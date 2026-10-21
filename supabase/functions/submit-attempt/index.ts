/**
 * submit-attempt
 *
 * The authoritative marking and scoring pass. This is the only place where
 * responses.is_correct and the score tables are written, and it runs as the
 * service role so the candidate never sees an accepted answer beforehand.
 *
 * It imports the SAME answer-check and scoring modules the app uses, so there
 * is one implementation of "is this correct" and one of the band maths, both
 * covered by the unit tests in src/lib.
 */
import { corsHeaders, json, preflight } from "../_shared/cors.ts";
import { getCaller, serviceClient } from "../_shared/supabase.ts";
import {
  checkAnswer,
  checkMultiAnswer,
  type CheckableQuestion,
} from "../../../src/lib/answer-check.ts";
import { scoreAttempt } from "../_shared/attempt-score.ts";

/** Starts grading now instead of waiting up to a minute for the sweep. */
function kickWorker() {
  const key = Deno.env.get("GRADING_WORKER_KEY");
  if (!key) return;
  const call = fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/grading-worker`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-grade-key": key },
    body: JSON.stringify({ limit: 5 }),
  }).catch((err) => console.error("kickWorker failed", err));
  // deno-lint-ignore no-explicit-any
  (globalThis as any).EdgeRuntime?.waitUntil?.(call);
}

interface SubmitBody {
  attempt_id: string;
  /** Submit one section, or the whole attempt when omitted. */
  section?: "listening" | "reading" | "writing" | "speaking";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return preflight();

  try {
    const user = await getCaller(req);
    if (!user) return json({ error: "unauthorized" }, 401);

    const { attempt_id, section }: SubmitBody = await req.json();
    if (!attempt_id) return json({ error: "attempt_id_required" }, 400);

    const db = serviceClient();

    const { data: attempt, error: attemptError } = await db
      .from("attempts")
      .select("id, user_id, form_id, status")
      .eq("id", attempt_id)
      .single();

    if (attemptError || !attempt) return json({ error: "attempt_not_found" }, 404);
    if (attempt.user_id !== user.id) return json({ error: "forbidden" }, 403);

    // ---------------------------------------------------------------- mark
    // Pull every objective question on the form together with its answers.
    const { data: questions, error: questionsError } = await db
      .from("questions")
      .select(
        `id, type_code, accepted_answers, word_limit, spelling_policy,
         accepts_plural, case_sensitive, scoring_rules,
         item_groups!inner (
           part_number,
           test_sections!inner ( section, form_id )
         ),
         question_types!inner ( renderer )`,
      )
      .eq("item_groups.test_sections.form_id", attempt.form_id);

    if (questionsError) throw questionsError;

    const { data: responses } = await db
      .from("responses")
      .select("id, question_id, answer")
      .eq("attempt_id", attempt_id);

    const responseByQuestion = new Map(
      (responses ?? []).map((r) => [r.question_id, r]),
    );

    const marked: Array<{
      id: string;
      is_correct: boolean;
      section: string;
      part_number: number;
    }> = [];

    for (const question of questions ?? []) {
      // deno-lint-ignore no-explicit-any
      const group = (question as any).item_groups;
      const sectionCode = group.test_sections.section as string;
      if (sectionCode !== "listening" && sectionCode !== "reading") continue;

      const response = responseByQuestion.get(question.id);
      if (!response) continue;

      const checkable: CheckableQuestion = {
        acceptedAnswers: question.accepted_answers ?? [],
        wordLimit: question.word_limit,
        spellingPolicy: question.spelling_policy,
        acceptsPlural: question.accepts_plural,
        caseSensitive: question.case_sensitive,
        scoringRules: question.scoring_rules ?? {},
      };

      // Multi-select answers are stored as a JSON array in the answer column.
      // deno-lint-ignore no-explicit-any
      const renderer = (question as any).question_types.renderer as string;
      let isCorrect: boolean;
      if (renderer === "checkbox") {
        let selected: string[] = [];
        try {
          const parsed = JSON.parse(response.answer ?? "[]");
          selected = Array.isArray(parsed) ? parsed : [];
        } catch {
          selected = (response.answer ?? "").split(",").map((s: string) => s.trim());
        }
        isCorrect = checkMultiAnswer(selected, checkable).correct;
      } else {
        isCorrect = checkAnswer(response.answer ?? "", checkable).correct;
      }

      marked.push({
        id: response.id,
        is_correct: isCorrect,
        section: sectionCode,
        part_number: group.part_number,
      });
    }

    // Persist the marks. Only the service role may write this column.
    for (const row of marked) {
      await db.from("responses").update({ is_correct: row.is_correct }).eq("id", row.id);
    }

    // ---------------------------------------------------- mistake notebook
    // Wrong objective answers go into the learner's spaced-repetition deck.
    if (!section) {
      const wrong = marked.filter((m) => !m.is_correct);
      if (wrong.length) {
        const answerById = new Map((responses ?? []).map((r) => [r.id, r]));
        await db.from("mistakes").upsert(
          wrong.map((m) => ({
            user_id: user.id,
            question_id: answerById.get(m.id)!.question_id,
            last_answer: answerById.get(m.id)!.answer,
            box: 1,
            due_at: new Date(Date.now() + 86_400_000).toISOString(),
            source: "mock",
          })),
          // A card answered wrong again goes back to box 1.
          { onConflict: "user_id,question_id" },
        );
      }
    }

    // ------------------------------------------------------ queue AI grading
    // Writing and Speaking are graded in the background by grading-worker;
    // the candidate never waits on the model. One job per task and part.
    if (!section) {
      const { data: aiGroups } = await db
        .from("item_groups")
        .select("part_number, test_sections!inner ( section, form_id )")
        .eq("test_sections.form_id", attempt.form_id)
        .in("test_sections.section", ["writing", "speaking"]);

      const jobs = (aiGroups ?? []).map((g) => ({
        // deno-lint-ignore no-explicit-any
        kind: (g as any).test_sections.section as "writing" | "speaking",
        attempt_id,
        part_number: g.part_number,
        user_id: user.id,
      }));
      if (jobs.length) {
        const { error: jobError } = await db
          .from("grading_jobs")
          .upsert(jobs, { onConflict: "attempt_id,kind,part_number", ignoreDuplicates: true });
        if (jobError) throw jobError;
        kickWorker();
      }
    }

    // --------------------------------------------------------------- score
    const score = await scoreAttempt(db, attempt_id, { close: !section });
    const { listening, reading, overall, complete } = score;
    const writingBand = score.writingBand;
    const speakingBandValue = score.speakingBand;

    return json({
      attempt_id,
      marked: marked.length,
      listening,
      reading,
      writing_band: writingBand,
      speaking_band: speakingBandValue,
      overall,
      status: complete ? "completed" : "awaiting_speaking",
    });
  } catch (error) {
    console.error("submit-attempt failed", error);
    return new Response(
      JSON.stringify({ error: String((error as Error).message ?? error) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
