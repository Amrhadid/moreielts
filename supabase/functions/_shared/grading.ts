/**
 * The AI graders, shared by grade-writing / grade-speaking (on-demand
 * re-grades) and grading-worker (the background queue). Every function here
 * runs as the service role and writes its own result row.
 */
import type { SupabaseClient } from "jsr:@supabase/supabase-js@2";
import { assertBand, callClaude, MODEL_VERSION, parseStrictJson } from "./anthropic.ts";
import { transcribeUrl, type TranscriptWord } from "./openai.ts";
import { speakingBand, writingTaskBand } from "../../../src/lib/scoring.ts";
import { speechStats } from "../../../src/lib/speech-stats.ts";

/* ------------------------------------------------------------------ *
 * Writing
 * ------------------------------------------------------------------ */

const WRITING_PROMPT = `You are a certified IELTS Writing examiner applying the public band descriptors.

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
6. "corrections": up to 10 of the most instructive errors. "original" must be copied verbatim from the response; "corrected" is the minimal fix; "why" is one short sentence naming the rule.
7. "model_answer": rewrite the candidate's OWN response so it would score about one band higher overall (cap at 9). Keep their ideas, position and structure where possible; change what the band descriptors reward. Keep it to the task's typical length.

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
    "summary": "<2-3 sentences on the single highest-value improvement>",
    "corrections": [ { "original": "<verbatim>", "corrected": "<fix>", "why": "<rule>" } ],
    "model_answer": "<the improved response>"
  }
}`;

interface WritingModelResult {
  task_achievement: number;
  coherence_cohesion: number;
  lexical_resource: number;
  grammatical_range: number;
  feedback: Record<string, unknown>;
}

export interface WritingGrade {
  task_achievement: number;
  coherence_cohesion: number;
  lexical_resource: number;
  grammatical_range: number;
  task_band: number;
  feedback: Record<string, unknown>;
  model_version: string;
}

/** Grades a response to a prompt. Pure apart from the model call. */
export async function gradeWritingText(
  taskNumber: 1 | 2,
  prompt: string,
  answer: string,
): Promise<WritingGrade> {
  const wordCount = answer.split(/\s+/).filter(Boolean).length;
  const minimum = taskNumber === 1 ? 150 : 250;

  const raw = await callClaude(
    WRITING_PROMPT,
    [
      `TASK NUMBER: ${taskNumber}`,
      `MINIMUM REQUIRED LENGTH: ${minimum} words`,
      `ACTUAL LENGTH: ${wordCount} words`,
      "",
      "TASK PROMPT:",
      prompt,
      "",
      "CANDIDATE RESPONSE:",
      answer,
    ].join("\n"),
  );
  const result = parseStrictJson<WritingModelResult>(raw);

  const criteria = {
    task_achievement: assertBand(result.task_achievement, "task_achievement"),
    coherence_cohesion: assertBand(result.coherence_cohesion, "coherence_cohesion"),
    lexical_resource: assertBand(result.lexical_resource, "lexical_resource"),
    grammatical_range: assertBand(result.grammatical_range, "grammatical_range"),
  };

  // Corrections whose "original" is not actually in the response are model
  // inventions; drop them rather than show a learner a mistake they never made.
  const feedback = { ...(result.feedback ?? {}) } as Record<string, unknown>;
  if (Array.isArray(feedback.corrections)) {
    feedback.corrections = (feedback.corrections as Array<{ original?: string }>).filter(
      (c) => typeof c.original === "string" && c.original.length > 0 && answer.includes(c.original),
    );
  }
  feedback.word_count = wordCount;

  return {
    ...criteria,
    // Computed here from the four criteria, not taken from the model: the
    // arithmetic is ours and is unit tested.
    task_band: writingTaskBand(criteria),
    feedback,
    model_version: MODEL_VERSION,
  };
}

/** Grades Writing task N of an attempt and upserts writing_scores. */
export async function gradeAttemptWriting(
  db: SupabaseClient,
  attemptId: string,
  taskNumber: 1 | 2,
): Promise<WritingGrade | null> {
  const { data: attempt } = await db
    .from("ielts_attempts")
    .select("form_id")
    .eq("id", attemptId)
    .single();
  if (!attempt) throw new Error("attempt_not_found");

  const { data: groups } = await db
    .from("ielts_item_groups")
    .select("id, passage_text, test_sections:ielts_test_sections!inner ( section, form_id ), questions:ielts_questions ( id )")
    .eq("test_sections.form_id", attempt.form_id)
    .eq("test_sections.section", "writing")
    .eq("part_number", taskNumber);
  // deno-lint-ignore no-explicit-any
  const group = groups?.[0] as any;
  if (!group) throw new Error("writing_task_not_found");

  const questionIds = (group.questions ?? []).map((q: { id: string }) => q.id);
  const { data: responses } = await db
    .from("ielts_responses")
    .select("answer")
    .eq("attempt_id", attemptId)
    .in("question_id", questionIds.length ? questionIds : ["00000000-0000-0000-0000-000000000000"]);
  const answer = responses?.[0]?.answer?.trim() ?? "";

  // A blank task is a band 0, not an error: IELTS scores a missing task, and
  // the attempt must still be able to finish.
  const grade: WritingGrade = answer
    ? await gradeWritingText(taskNumber, group.passage_text ?? "", answer)
    : {
        task_achievement: 0,
        coherence_cohesion: 0,
        lexical_resource: 0,
        grammatical_range: 0,
        task_band: 0,
        feedback: { summary: "No response was submitted for this task." },
        model_version: MODEL_VERSION,
      };

  const { error } = await db.from("ielts_writing_scores").upsert(
    { attempt_id: attemptId, task_number: taskNumber, ...grade },
    { onConflict: "attempt_id,task_number" },
  );
  if (error) throw error;
  return grade;
}

/** Grades a writing-lab essay and stores the result on the submission. */
export async function gradeEssay(db: SupabaseClient, submissionId: string): Promise<void> {
  const { data: sub } = await db
    .from("ielts_writing_submissions")
    .select("id, task_number, prompt, body, parent_id")
    .eq("id", submissionId)
    .single();
  if (!sub) throw new Error("submission_not_found");

  const grade = await gradeWritingText(sub.task_number, sub.prompt, sub.body);

  // A rewrite is told what the previous draft scored, so the page can show
  // movement per criterion.
  if (sub.parent_id) {
    const { data: parent } = await db
      .from("ielts_writing_submissions")
      .select("task_band, task_achievement, coherence_cohesion, lexical_resource, grammatical_range")
      .eq("id", sub.parent_id)
      .maybeSingle();
    if (parent) grade.feedback.previous = parent;
  }

  const { error } = await db
    .from("ielts_writing_submissions")
    .update({ ...grade, status: "graded", graded_at: new Date().toISOString() })
    .eq("id", submissionId);
  if (error) throw error;
}

/* ------------------------------------------------------------------ *
 * Speaking
 * ------------------------------------------------------------------ */

const SPEAKING_PROMPT = `You are a certified IELTS Speaking examiner applying the public band descriptors.

You assess ONE part of the Speaking test against exactly four criteria:
- Fluency and Coherence: speech rate and continuity, hesitation, self-correction, discourse markers, and whether ideas connect logically.
- Lexical Resource: range and precision of vocabulary, paraphrase when a word is missing, collocation, idiomatic control.
- Grammatical Range and Accuracy: variety of structures attempted, control of complex forms, error density and whether errors impede understanding.
- Pronunciation: you only have a machine transcript. Use the measured speech statistics and any transcription markers of unclear speech as evidence. Where there is no pronunciation evidence, award a neutral band close to the other criteria and say so explicitly rather than inventing evidence.

Rules you must follow:
1. Award each criterion a band from 0 to 9 in HALF BANDS only (e.g. 6, 6.5, 7). Never use percentages.
2. Judge only the transcript and statistics supplied. Do not assume anything the candidate did not say.
3. Part 1 is short familiar exchanges, Part 2 is a 1-2 minute monologue, Part 3 is abstract discussion. Calibrate expectations to the part.
4. Every criterion must cite at least one SHORT VERBATIM QUOTE from the candidate's own words as evidence. Quote exactly; never invent text.
5. Be calibrated, not generous.
6. "better_answer": a short model answer (Part 1: 2-3 sentences per question; Part 2: about 200 words; Part 3: 4-5 sentences per question) that keeps the candidate's ideas but shows band 7.5+ language.

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
    "summary": "<2-3 sentences on the single highest-value improvement>",
    "better_answer": "<model answer>"
  }
}`;

interface SpeakingModelResult {
  fluency_coherence: number;
  lexical_resource: number;
  grammatical_range: number;
  pronunciation: number;
  feedback: Record<string, unknown>;
}

/**
 * Transcribes every recording of Speaking part N server-side, measures the
 * delivery, grades it, and upserts speaking_scores. The transcript is never
 * taken from the client.
 */
export async function gradeAttemptSpeaking(
  db: SupabaseClient,
  attemptId: string,
  partNumber: 1 | 2 | 3,
): Promise<void> {
  const { data: attempt } = await db
    .from("ielts_attempts")
    .select("form_id")
    .eq("id", attemptId)
    .single();
  if (!attempt) throw new Error("attempt_not_found");

  const { data: groups } = await db
    .from("ielts_item_groups")
    .select(
      "id, passage_text, shared_instructions, test_sections:ielts_test_sections!inner ( section, form_id ), questions:ielts_questions ( id, prompt, order_index )",
    )
    .eq("test_sections.form_id", attempt.form_id)
    .eq("test_sections.section", "speaking")
    .eq("part_number", partNumber);
  // deno-lint-ignore no-explicit-any
  const group = groups?.[0] as any;
  if (!group) throw new Error("speaking_part_not_found");

  const questions = [...(group.questions ?? [])].sort(
    (a: { order_index: number }, b: { order_index: number }) => a.order_index - b.order_index,
  ) as Array<{ id: string; prompt: string }>;

  const { data: responses } = await db
    .from("ielts_responses")
    .select("question_id, audio_url, answer")
    .eq("attempt_id", attemptId)
    .in("question_id", questions.length ? questions.map((q) => q.id) : ["00000000-0000-0000-0000-000000000000"]);
  const byQuestion = new Map((responses ?? []).map((r) => [r.question_id, r]));

  // Reuse a transcript from an earlier try so a retried job does not pay for
  // transcription twice.
  const { data: existing } = await db
    .from("ielts_speaking_scores")
    .select("transcript, feedback")
    .eq("attempt_id", attemptId)
    .eq("part_number", partNumber)
    .maybeSingle();

  const lines: string[] = [];
  const allWords: TranscriptWord[] = [];
  let offset = 0;
  if (existing?.transcript) {
    lines.push(existing.transcript);
  } else {
    for (const question of questions) {
      const response = byQuestion.get(question.id);
      if (!response?.audio_url) continue;
      const t = await transcribeUrl(response.audio_url);
      lines.push(`EXAMINER: ${question.prompt}\nCANDIDATE: ${t.text || "(silence)"}`);
      // Concatenate timings so pauses between answers are not counted.
      const base = offset - (t.words[0]?.start ?? 0);
      for (const w of t.words) allWords.push({ ...w, start: w.start + base, end: w.end + base });
      offset = (allWords[allWords.length - 1]?.end ?? offset) + 0.5;
    }
  }
  const transcript = lines.join("\n\n").trim();

  const stats = allWords.length
    ? speechStats(allWords)
    : ((existing?.feedback as Record<string, unknown> | null)?.stats ?? null);

  if (!transcript) {
    const { error } = await db.from("ielts_speaking_scores").upsert(
      {
        attempt_id: attemptId,
        part_number: partNumber,
        fluency_coherence: 0,
        lexical_resource: 0,
        grammatical_range: 0,
        pronunciation: 0,
        part_band: 0,
        transcript: "",
        feedback: { summary: "No recording was submitted for this part." },
        model_version: MODEL_VERSION,
      },
      { onConflict: "attempt_id,part_number" },
    );
    if (error) throw error;
    return;
  }

  const raw = await callClaude(
    SPEAKING_PROMPT,
    [
      `SPEAKING PART: ${partNumber}`,
      `PART INSTRUCTIONS: ${group.shared_instructions ?? "n/a"}`,
      `CUE CARD / PROMPTS: ${group.passage_text ?? "n/a"}`,
      stats ? `MEASURED SPEECH STATISTICS: ${JSON.stringify(stats)}` : "MEASURED SPEECH STATISTICS: unavailable",
      "",
      "TRANSCRIPT:",
      transcript,
    ].join("\n"),
  );
  const result = parseStrictJson<SpeakingModelResult>(raw);

  const criteria = {
    fluency_coherence: assertBand(result.fluency_coherence, "fluency_coherence"),
    lexical_resource: assertBand(result.lexical_resource, "lexical_resource"),
    grammatical_range: assertBand(result.grammatical_range, "grammatical_range"),
    pronunciation: assertBand(result.pronunciation, "pronunciation"),
  };

  const { error } = await db.from("ielts_speaking_scores").upsert(
    {
      attempt_id: attemptId,
      part_number: partNumber,
      ...criteria,
      part_band: speakingBand(criteria),
      transcript,
      feedback: { ...(result.feedback ?? {}), stats },
      model_version: MODEL_VERSION,
    },
    { onConflict: "attempt_id,part_number" },
  );
  if (error) throw error;
}
