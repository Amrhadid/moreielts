/**
 * grade-writing
 *
 * Grades one Writing task against the four official criteria using Claude, and
 * writes the result to writing_scores as the service role.
 *
 * The model is required to return strict JSON in exactly the writing_scores
 * shape, and to justify each band with a quote taken from the candidate's own
 * response — an evidence-free band is rejected.
 */
import { corsHeaders, json, preflight } from "../_shared/cors.ts";
import { checkRateLimit, getCaller, serviceClient } from "../_shared/supabase.ts";
import {
  assertBand,
  callClaude,
  MODEL_VERSION,
  parseStrictJson,
} from "../_shared/anthropic.ts";
import { writingTaskBand } from "../../../src/lib/scoring.ts";

const SYSTEM_PROMPT = `You are a certified IELTS Writing examiner applying the public band descriptors.

You assess ONE task against exactly four criteria:
- Task Achievement (Task 1) or Task Response (Task 2): does the response cover the requirements, and for Task 1 is there a clear overview of the main trends without inventing data?
- Coherence and Cohesion: paragraphing, logical progression, cohesive devices, referencing.
- Lexical Resource: range, precision, collocation, repetition, and errors of word choice.
- Grammatical Range and Accuracy: sentence variety, control of complex forms, error density and whether errors impede meaning.

Rules you must follow:
1. Award each criterion a band from 0 to 9 in HALF BANDS only (e.g. 6, 6.5, 7). Never award a band outside that scale and never use percentages.
2. Judge only what is written. Do not reward intent or penalise opinions.
3. Under-length responses are penalised under Task Achievement/Response: below 150 words for Task 1 or 250 words for Task 2.
4. Every criterion must cite at least one SHORT VERBATIM QUOTE from the candidate's own response as evidence. Quote exactly; never paraphrase into the quote field and never invent text that is not present.
5. Be calibrated, not generous. A band 7 requires genuine control; a response with frequent basic errors is not band 7.

Return STRICT JSON only. No markdown, no commentary, no code fence. Use exactly this shape:
{
  "task_achievement": <number>,
  "coherence_cohesion": <number>,
  "lexical_resource": <number>,
  "grammatical_range": <number>,
  "feedback": {
    "task_achievement": { "comment": "<2-3 sentences>", "evidence": ["<quote>"] },
    "coherence_cohesion": { "comment": "<2-3 sentences>", "evidence": ["<quote>"] },
    "lexical_resource": { "comment": "<2-3 sentences>", "evidence": ["<quote>"] },
    "grammatical_range": { "comment": "<2-3 sentences>", "evidence": ["<quote>"] },
    "summary": "<2-3 sentences on the single highest-value improvement>"
  }
}`;

interface GradeBody {
  attempt_id: string;
  task_number: 1 | 2;
}

interface ModelResult {
  task_achievement: number;
  coherence_cohesion: number;
  lexical_resource: number;
  grammatical_range: number;
  feedback: Record<string, unknown>;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return preflight();

  try {
    const user = await getCaller(req);
    if (!user) return json({ error: "unauthorized" }, 401);

    const { attempt_id, task_number }: GradeBody = await req.json();
    if (!attempt_id || (task_number !== 1 && task_number !== 2)) {
      return json({ error: "attempt_id_and_task_number_required" }, 400);
    }

    const db = serviceClient();

    const { data: attempt } = await db
      .from("attempts")
      .select("id, user_id, form_id")
      .eq("id", attempt_id)
      .single();

    if (!attempt) return json({ error: "attempt_not_found" }, 404);
    if (attempt.user_id !== user.id) return json({ error: "forbidden" }, 403);

    // 6 gradings per hour is comfortably above honest use and well below the
    // rate at which a scripted client could run up an API bill.
    const allowed = await checkRateLimit(db, user.id, "grade-writing", 6, 60, attempt_id);
    if (!allowed) return json({ error: "rate_limited", retry_after_minutes: 60 }, 429);

    // Fetch the task prompt and the candidate's response.
    const { data: groups } = await db
      .from("item_groups")
      .select(
        `id, part_number, passage_text, shared_instructions,
         test_sections!inner ( section, form_id ),
         questions ( id )`,
      )
      .eq("test_sections.form_id", attempt.form_id)
      .eq("test_sections.section", "writing")
      .eq("part_number", task_number);

    const group = groups?.[0];
    if (!group) return json({ error: "writing_task_not_found" }, 404);

    // deno-lint-ignore no-explicit-any
    const questionIds = ((group as any).questions ?? []).map((q: { id: string }) => q.id);
    const { data: responses } = await db
      .from("responses")
      .select("answer")
      .eq("attempt_id", attempt_id)
      .in("question_id", questionIds);

    const answer = responses?.[0]?.answer?.trim() ?? "";
    if (!answer) return json({ error: "no_response_to_grade" }, 400);

    const wordCount = answer.split(/\s+/).filter(Boolean).length;
    const minimum = task_number === 1 ? 150 : 250;

    const userContent = [
      `TASK NUMBER: ${task_number}`,
      `MINIMUM REQUIRED LENGTH: ${minimum} words`,
      `ACTUAL LENGTH: ${wordCount} words`,
      "",
      "TASK PROMPT:",
      // deno-lint-ignore no-explicit-any
      (group as any).passage_text ?? "",
      "",
      "CANDIDATE RESPONSE:",
      answer,
    ].join("\n");

    const raw = await callClaude(SYSTEM_PROMPT, userContent, 2000);
    const result = parseStrictJson<ModelResult>(raw);

    const criteria = {
      task_achievement: assertBand(result.task_achievement, "task_achievement"),
      coherence_cohesion: assertBand(result.coherence_cohesion, "coherence_cohesion"),
      lexical_resource: assertBand(result.lexical_resource, "lexical_resource"),
      grammatical_range: assertBand(result.grammatical_range, "grammatical_range"),
    };

    // The task band is computed here, from the four criteria, rather than being
    // taken from the model: the arithmetic is ours and is unit tested.
    const taskBand = writingTaskBand(criteria);

    const { error: writeError } = await db.from("writing_scores").upsert(
      {
        attempt_id,
        task_number,
        ...criteria,
        task_band: taskBand,
        feedback: result.feedback ?? {},
        model_version: MODEL_VERSION,
      },
      { onConflict: "attempt_id,task_number" },
    );
    if (writeError) throw writeError;

    return json({ attempt_id, task_number, ...criteria, task_band: taskBand });
  } catch (error) {
    console.error("grade-writing failed", error);
    return new Response(
      JSON.stringify({ error: String((error as Error).message ?? error) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
