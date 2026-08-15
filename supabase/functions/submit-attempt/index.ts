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
import {
  overallBand,
  rawScore,
  rawScoreToBand,
  speakingSectionBand,
  writingSectionBand,
  type BandConversionRow,
} from "../../../src/lib/scoring.ts";

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

    const { data: form } = await db
      .from("test_forms")
      .select("id, variant, scoring_version")
      .eq("id", attempt.form_id)
      .single();
    if (!form) return json({ error: "form_not_found" }, 404);

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
          selected = (response.answer ?? "").split(",").map((s) => s.trim());
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

    // --------------------------------------------------------------- score
    const { data: conversion } = await db
      .from("band_conversion")
      .select("variant, section, raw_min, raw_max, band, version")
      .eq("version", form.scoring_version ?? "v1");

    const table = (conversion ?? []) as BandConversionRow[];
    const variant = form.variant as "academic" | "general_training";

    function sectionBand(code: "listening" | "reading") {
      const rows = marked
        .filter((m) => m.section === code)
        .map((m) => ({
          questionId: m.id,
          typeCode: "",
          partNumber: m.part_number,
          isCorrect: m.is_correct,
        }));
      const raw = rawScore(rows);
      return { raw, band: rawScoreToBand(raw, code, variant, table) };
    }

    const listening = sectionBand("listening");
    const reading = sectionBand("reading");

    // Writing and Speaking bands come from the AI graders, which run
    // separately. A section with no scores yet contributes 0 and the attempt
    // stays awaiting_speaking until they land.
    const { data: writingRows } = await db
      .from("writing_scores")
      .select("task_number, task_band")
      .eq("attempt_id", attempt_id);

    const task1 = writingRows?.find((r) => r.task_number === 1)?.task_band ?? null;
    const task2 = writingRows?.find((r) => r.task_number === 2)?.task_band ?? null;
    const writingBand =
      task1 !== null && task2 !== null
        ? writingSectionBand(Number(task1), Number(task2))
        : null;

    const { data: speakingRows } = await db
      .from("speaking_scores")
      .select("part_band")
      .eq("attempt_id", attempt_id);

    const speakingBandValue = speakingRows?.length
      ? speakingSectionBand(speakingRows.map((r) => Number(r.part_band)))
      : null;

    const complete = writingBand !== null && speakingBandValue !== null;

    const overall = complete
      ? overallBand({
          listening: listening.band,
          reading: reading.band,
          writing: writingBand,
          speaking: speakingBandValue,
        })
      : null;

    await db.from("attempt_scores").upsert(
      {
        attempt_id,
        listening_raw: listening.raw,
        listening_band: listening.band,
        reading_raw: reading.raw,
        reading_band: reading.band,
        writing_band: writingBand,
        speaking_band: speakingBandValue,
        overall_unrounded: overall?.unrounded ?? null,
        overall_band: overall?.band ?? null,
        scoring_version: form.scoring_version ?? "v1",
      },
      { onConflict: "attempt_id" },
    );

    // A whole-attempt submission closes the attempt; a section submission
    // leaves it open for the next section.
    if (!section) {
      await db
        .from("attempts")
        .update({
          status: complete ? "completed" : "awaiting_speaking",
          submitted_at: new Date().toISOString(),
          section_deadline_at: null,
        })
        .eq("id", attempt_id);

      if (complete && overall) {
        await db
          .from("profiles")
          .update({ current_band: overall.band })
          .eq("id", user.id);
      }
    }

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
