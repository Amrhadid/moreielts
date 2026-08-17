/**
 * grade-speaking
 *
 * Grades one Speaking part against the four official criteria and writes the
 * result to speaking_scores as the service role.
 *
 * Grading runs on a transcript. Transcription itself is out of scope for this
 * pass: the client sends the transcript alongside the recording URL, and
 * TODO(transcription) marks where a speech-to-text step should be inserted so
 * the transcript is produced server-side from responses.audio_url rather than
 * being trusted from the client.
 */
import { corsHeaders, json, preflight } from "../_shared/cors.ts";
import { checkRateLimit, getCaller, serviceClient } from "../_shared/supabase.ts";
import {
  assertBand,
  callClaude,
  MODEL_VERSION,
  parseStrictJson,
} from "../_shared/anthropic.ts";
import { speakingBand } from "../../../src/lib/scoring.ts";

const SYSTEM_PROMPT = `You are a certified IELTS Speaking examiner applying the public band descriptors.

You assess ONE part of the Speaking test against exactly four criteria:
- Fluency and Coherence: speech rate and continuity, hesitation, self-correction, discourse markers, and whether ideas connect logically.
- Lexical Resource: range and precision of vocabulary, paraphrase when a word is missing, collocation, idiomatic control.
- Grammatical Range and Accuracy: variety of structures attempted, control of complex forms, error density and whether errors impede understanding.
- Pronunciation: judged only from what the transcript can evidence — word stress patterns, chunking, and any transcription markers of unclear speech. If the transcript gives no pronunciation evidence, award a neutral band and say so explicitly in the comment rather than inventing evidence.

Rules you must follow:
1. Award each criterion a band from 0 to 9 in HALF BANDS only (e.g. 6, 6.5, 7). Never use percentages.
2. Judge only the transcript supplied. Do not assume anything the candidate did not say.
3. Part 1 is short familiar exchanges, Part 2 is a 1-2 minute monologue, Part 3 is abstract discussion. Calibrate expectations to the part: a short Part 1 answer is not penalised for lacking extended argument.
4. Every criterion must cite at least one SHORT VERBATIM QUOTE from the candidate's own words as evidence. Quote exactly; never invent text.
5. Be calibrated, not generous.

Return STRICT JSON only. No markdown, no commentary, no code fence. Use exactly this shape:
{
  "fluency_coherence": <number>,
  "lexical_resource": <number>,
  "grammatical_range": <number>,
  "pronunciation": <number>,
  "feedback": {
    "fluency_coherence": { "comment": "<2-3 sentences>", "evidence": ["<quote>"] },
    "lexical_resource": { "comment": "<2-3 sentences>", "evidence": ["<quote>"] },
    "grammatical_range": { "comment": "<2-3 sentences>", "evidence": ["<quote>"] },
    "pronunciation": { "comment": "<2-3 sentences>", "evidence": ["<quote>"] },
    "summary": "<2-3 sentences on the single highest-value improvement>"
  }
}`;

interface GradeBody {
  attempt_id: string;
  part_number: 1 | 2 | 3;
  /** TODO(transcription): derive server-side from responses.audio_url. */
  transcript?: string;
}

interface ModelResult {
  fluency_coherence: number;
  lexical_resource: number;
  grammatical_range: number;
  pronunciation: number;
  feedback: Record<string, unknown>;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return preflight();

  try {
    const user = await getCaller(req);
    if (!user) return json({ error: "unauthorized" }, 401);

    const { attempt_id, part_number, transcript }: GradeBody = await req.json();
    if (!attempt_id || ![1, 2, 3].includes(part_number)) {
      return json({ error: "attempt_id_and_part_number_required" }, 400);
    }

    const db = serviceClient();

    const { data: attempt } = await db
      .from("attempts")
      .select("id, user_id, form_id")
      .eq("id", attempt_id)
      .single();

    if (!attempt) return json({ error: "attempt_not_found" }, 404);
    if (attempt.user_id !== user.id) return json({ error: "forbidden" }, 403);

    const allowed = await checkRateLimit(db, user.id, "grade-speaking", 9, 60, attempt_id);
    if (!allowed) return json({ error: "rate_limited", retry_after_minutes: 60 }, 429);

    // Prefer a transcript already stored on the row over one sent by the
    // client, so a re-grade never depends on client input.
    const { data: existing } = await db
      .from("speaking_scores")
      .select("transcript")
      .eq("attempt_id", attempt_id)
      .eq("part_number", part_number)
      .maybeSingle();

    const text = (existing?.transcript ?? transcript ?? "").trim();
    if (!text) return json({ error: "no_transcript_to_grade" }, 400);

    const { data: groups } = await db
      .from("item_groups")
      .select(
        `part_number, passage_text, shared_instructions,
         test_sections!inner ( section, form_id )`,
      )
      .eq("test_sections.form_id", attempt.form_id)
      .eq("test_sections.section", "speaking")
      .eq("part_number", part_number);

    const group = groups?.[0];

    const userContent = [
      `SPEAKING PART: ${part_number}`,
      // deno-lint-ignore no-explicit-any
      `PART INSTRUCTIONS: ${(group as any)?.shared_instructions ?? "n/a"}`,
      // deno-lint-ignore no-explicit-any
      `CUE CARD / PROMPTS: ${(group as any)?.passage_text ?? "n/a"}`,
      "",
      "CANDIDATE TRANSCRIPT:",
      text,
    ].join("\n");

    const raw = await callClaude(SYSTEM_PROMPT, userContent, 2000);
    const result = parseStrictJson<ModelResult>(raw);

    const criteria = {
      fluency_coherence: assertBand(result.fluency_coherence, "fluency_coherence"),
      lexical_resource: assertBand(result.lexical_resource, "lexical_resource"),
      grammatical_range: assertBand(result.grammatical_range, "grammatical_range"),
      pronunciation: assertBand(result.pronunciation, "pronunciation"),
    };

    const partBand = speakingBand(criteria);

    const { error: writeError } = await db.from("speaking_scores").upsert(
      {
        attempt_id,
        part_number,
        ...criteria,
        part_band: partBand,
        transcript: text,
        feedback: result.feedback ?? {},
        model_version: MODEL_VERSION,
      },
      { onConflict: "attempt_id,part_number" },
    );
    if (writeError) throw writeError;

    return json({ attempt_id, part_number, ...criteria, part_band: partBand });
  } catch (error) {
    console.error("grade-speaking failed", error);
    return new Response(
      JSON.stringify({ error: String((error as Error).message ?? error) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
