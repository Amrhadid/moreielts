/**
 * Recomputes an attempt's scores from what is stored: objective marks from
 * responses.is_correct, Writing and Speaking from their score tables. Called
 * by submit-attempt after marking and by grading-worker after each AI grade,
 * so the overall band appears as soon as the last job lands.
 */
import type { SupabaseClient } from "jsr:@supabase/supabase-js@2";
import {
  overallBand,
  rawScore,
  rawScoreToBand,
  speakingSectionBand,
  writingSectionBand,
  type BandConversionRow,
} from "../../../src/lib/scoring.ts";

export interface ScoreResult {
  listening: { raw: number; band: number };
  reading: { raw: number; band: number };
  writingBand: number | null;
  speakingBand: number | null;
  overall: { unrounded: number; band: number } | null;
  complete: boolean;
}

export async function scoreAttempt(
  db: SupabaseClient,
  attemptId: string,
  options: { close?: boolean } = {},
): Promise<ScoreResult> {
  const { data: attempt, error } = await db
    .from("attempts")
    .select("id, user_id, form_id, submitted_at, test_forms ( variant, scoring_version )")
    .eq("id", attemptId)
    .single();
  if (error || !attempt) throw new Error("attempt_not_found");
  // deno-lint-ignore no-explicit-any
  const form = (attempt as any).test_forms as { variant: string; scoring_version: string | null };
  const version = form?.scoring_version ?? "v1";

  const { data: marked } = await db
    .from("responses")
    .select(
      `id, is_correct,
       questions!inner ( item_groups!inner ( part_number, test_sections!inner ( section ) ) )`,
    )
    .eq("attempt_id", attemptId)
    .not("is_correct", "is", null);

  const { data: conversion } = await db
    .from("band_conversion")
    .select("variant, section, raw_min, raw_max, band, version")
    .eq("version", version);
  const table = (conversion ?? []) as BandConversionRow[];
  const variant = form.variant as "academic" | "general_training";

  function sectionBand(code: "listening" | "reading") {
    const rows = (marked ?? [])
      // deno-lint-ignore no-explicit-any
      .filter((m: any) => m.questions.item_groups.test_sections.section === code)
      // deno-lint-ignore no-explicit-any
      .map((m: any) => ({
        questionId: m.id,
        typeCode: "",
        partNumber: m.questions.item_groups.part_number,
        isCorrect: m.is_correct === true,
      }));
    const raw = rawScore(rows);
    return { raw, band: rawScoreToBand(raw, code, variant, table) };
  }

  const listening = sectionBand("listening");
  const reading = sectionBand("reading");

  const { data: writingRows } = await db
    .from("writing_scores")
    .select("task_number, task_band")
    .eq("attempt_id", attemptId);
  const task1 = writingRows?.find((r) => r.task_number === 1)?.task_band ?? null;
  const task2 = writingRows?.find((r) => r.task_number === 2)?.task_band ?? null;
  const writingBand =
    task1 !== null && task2 !== null ? writingSectionBand(Number(task1), Number(task2)) : null;

  const { data: speakingRows } = await db
    .from("speaking_scores")
    .select("part_band")
    .eq("attempt_id", attemptId);
  const speakingBand = speakingRows?.length
    ? speakingSectionBand(speakingRows.map((r) => Number(r.part_band)))
    : null;

  const complete = writingBand !== null && speakingBand !== null;
  const overall = complete
    ? overallBand({
        listening: listening.band,
        reading: reading.band,
        writing: writingBand,
        speaking: speakingBand,
      })
    : null;

  await db.from("attempt_scores").upsert(
    {
      attempt_id: attemptId,
      listening_raw: listening.raw,
      listening_band: listening.band,
      reading_raw: reading.raw,
      reading_band: reading.band,
      writing_band: writingBand,
      speaking_band: speakingBand,
      overall_unrounded: overall?.unrounded ?? null,
      overall_band: overall?.band ?? null,
      scoring_version: version,
    },
    { onConflict: "attempt_id" },
  );

  // Once submitted, the attempt flips to completed the moment the last AI
  // grade arrives. `close` is the submission itself.
  if (options.close || attempt.submitted_at) {
    await db
      .from("attempts")
      .update({
        status: complete ? "completed" : "awaiting_speaking",
        ...(options.close
          ? { submitted_at: new Date().toISOString(), section_deadline_at: null }
          : {}),
      })
      .eq("id", attemptId);

    if (complete && overall) {
      await db.from("profiles").update({ current_band: overall.band }).eq("id", attempt.user_id);
    }
  }

  return { listening, reading, writingBand, speakingBand, overall, complete };
}
