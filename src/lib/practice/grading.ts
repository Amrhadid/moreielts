import type {
  ObjectiveQuestion,
  ObjectiveSet,
  SpeakingPrompt,
  WritingTask,
} from "~/data/practice";
import { checkAnswer, countWords, type CheckResult } from "~/lib/answer-check";
import {
  speakingBand,
  writingTaskBand,
  type SpeakingCriteria,
  type WritingCriteria,
} from "~/lib/scoring";
import { assertBand, callClaude, parseStrictJson } from "./ai";

/* ------------------------------------------------------------------ *
 * Objective sections: deterministic marking + AI explanation
 * ------------------------------------------------------------------ */

export type ObjectiveAnswers = Record<string, string>;

export interface MarkedQuestion {
  question: ObjectiveQuestion;
  given: string;
  result: CheckResult;
}

/**
 * Marks a set with the same rules the test players use. Choice questions
 * compare the option value exactly; completion answers go through the full
 * normalisation / word-limit / spelling pipeline in answer-check.
 */
export function markObjective(set: ObjectiveSet, answers: ObjectiveAnswers): MarkedQuestion[] {
  return set.questions.map((question) => {
    const given = (answers[question.id] ?? "").trim();
    if (question.kind === "radio") {
      const correct = given !== "" && question.acceptedAnswers.includes(given);
      return {
        question,
        given,
        result: correct
          ? { correct: true, matched: given }
          : { correct: false, reason: given ? "no_match" : "empty" },
      };
    }
    return {
      question,
      given,
      result: checkAnswer(given, {
        acceptedAnswers: question.acceptedAnswers,
        wordLimit: question.wordLimit ?? 0,
        spellingPolicy: "lenient",
        acceptsPlural: true,
        caseSensitive: false,
      }),
    };
  });
}

export interface ObjectiveExplanation {
  number: number;
  /** Why the correct answer is correct, and what led the learner astray. */
  explanation: string;
  /** Short verbatim quote from the passage or transcript. */
  evidence: string;
  /** One concrete technique for this question type. */
  tip: string;
}

export interface ObjectiveReview {
  items: ObjectiveExplanation[];
  summary: string;
}

const OBJECTIVE_SYSTEM = `You are an experienced IELTS tutor reviewing a learner's answers to a short Listening or Reading practice set.

You are given the source text (a reading passage or a listening transcript), each question with its accepted answer(s), and what the learner wrote. The marking has ALREADY been done by the system and is final — never change a verdict, and never award credit the system did not.

For EVERY question, in order, write:
- "explanation": 2-3 sentences. For a correct answer, confirm why it is right and name the paraphrase between question and text. For a wrong or blank answer, explain exactly why the accepted answer is right and, if the learner chose a distractor, why that distractor is wrong.
- "evidence": one SHORT VERBATIM quote (under 25 words) from the source text that locates the answer. Quote exactly; never paraphrase into this field and never invent text.
- "tip": one sentence with a concrete technique for this question type (e.g. how to tell FALSE from NOT GIVEN, listening for a correction after "but").

Then write "summary": 2-3 sentences on the single most valuable thing this learner should work on, based on the pattern of their errors. If everything is correct, say what they did well and what to try next.

Be specific and calm. Do not praise generically. Return STRICT JSON only, no markdown, no code fence, in exactly this shape:
{ "items": [ { "number": 1, "explanation": "...", "evidence": "...", "tip": "..." } ], "summary": "..." }`;

export async function explainObjective(
  set: ObjectiveSet,
  marked: MarkedQuestion[],
): Promise<ObjectiveReview> {
  const source =
    set.section === "reading"
      ? `READING PASSAGE: ${set.passage?.title}\n\n${set.passage?.paragraphs.join("\n\n")}`
      : `LISTENING TRANSCRIPT:\n${set.audio?.transcript.join("\n")}`;

  const questions = marked
    .map(({ question, given, result }) => {
      const options = question.options
        ? "\n  Options: " + question.options.map((o) => `${o.value}) ${o.label}`).join("  ")
        : "";
      return [
        `Q${question.number} [${question.typeLabel}]: ${question.prompt}${options}`,
        `  Accepted answer(s): ${question.acceptedAnswers.join(" / ")}`,
        `  Learner wrote: ${given || "(blank)"}`,
        `  System verdict: ${result.correct ? "CORRECT" : `INCORRECT${result.reason === "word_limit_exceeded" ? " (over the word limit)" : ""}`}`,
      ].join("\n");
    })
    .join("\n\n");

  const prompt = [
    `SECTION: IELTS ${set.section === "reading" ? "Academic Reading" : "Listening"}`,
    `INSTRUCTIONS GIVEN TO THE LEARNER: ${set.instructions}`,
    "",
    source,
    "",
    "QUESTIONS AND ANSWERS:",
    questions,
    "",
    "Return JSON only.",
  ].join("\n");

  const raw = await callClaude({
    system: OBJECTIVE_SYSTEM,
    prompt,
    maxTokens: 1800,
    temperature: 0.2,
  });
  const parsed = parseStrictJson<Partial<ObjectiveReview>>(raw);
  const items = Array.isArray(parsed.items) ? parsed.items : [];
  return {
    items: marked.map(({ question }) => {
      const found = items.find((i) => Number(i?.number) === question.number);
      return {
        number: question.number,
        explanation: String(found?.explanation ?? "").trim(),
        evidence: String(found?.evidence ?? "").trim(),
        tip: String(found?.tip ?? "").trim(),
      };
    }),
    summary: String(parsed.summary ?? "").trim(),
  };
}

/* ------------------------------------------------------------------ *
 * Writing: four criteria, half bands, quotes as evidence
 * ------------------------------------------------------------------ */

export interface CriterionFeedback {
  comment: string;
  evidence: string[];
}

export interface WritingGrade {
  criteria: WritingCriteria;
  band: number;
  feedback: Record<keyof WritingCriteria, CriterionFeedback> & { summary: string };
  wordCount: number;
}

export const WRITING_CRITERIA: Array<{ key: keyof WritingCriteria; label: string }> = [
  { key: "task_achievement", label: "Task Achievement / Response" },
  { key: "coherence_cohesion", label: "Coherence and Cohesion" },
  { key: "lexical_resource", label: "Lexical Resource" },
  { key: "grammatical_range", label: "Grammatical Range and Accuracy" },
];

/** The same examiner brief as supabase/functions/grade-writing. */
const WRITING_SYSTEM = `You are a certified IELTS Writing examiner applying the public band descriptors.

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
5. In each comment, when you deduct, say exactly why: name the error and give the corrected form. Do not give generic advice such as "improve grammar".
6. Be calibrated, not generous. A band 7 requires genuine control; a response with frequent basic errors is not band 7. A blank, off-topic or memorised response scores very low.

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

interface WritingModelResult {
  task_achievement: unknown;
  coherence_cohesion: unknown;
  lexical_resource: unknown;
  grammatical_range: unknown;
  feedback?: Record<string, unknown>;
}

/** Renders the Task 1 data as text so the examiner sees what the candidate saw. */
export function describeTaskData(task: WritingTask): string {
  if (task.chart) {
    const header = ["", ...task.chart.series.map((s) => s.name)].join(" | ");
    const rows = task.chart.categories.map((category, i) =>
      [category, ...task.chart!.series.map((s) => `${s.values[i]}`)].join(" | "),
    );
    return `${task.chart.title} (${task.chart.unit})\n${header}\n${rows.join("\n")}`;
  }
  if (task.table) {
    return `${task.table.title}\n${task.table.columns.join(" | ")}\n${task.table.rows
      .map((r) => r.join(" | "))
      .join("\n")}`;
  }
  return "";
}

export async function gradeWriting(task: WritingTask, answer: string): Promise<WritingGrade> {
  const text = answer.trim();
  const wordCount = countWords(text);
  const data = describeTaskData(task);

  const prompt = [
    `TASK NUMBER: ${task.taskNumber}`,
    `MINIMUM REQUIRED LENGTH: ${task.minWords} words`,
    `ACTUAL LENGTH: ${wordCount} words`,
    "",
    "TASK PROMPT:",
    task.prompt,
    data ? `\nDATA SHOWN TO THE CANDIDATE:\n${data}` : "",
    "",
    "CANDIDATE RESPONSE:",
    text || "(blank)",
  ].join("\n");

  const raw = await callClaude({ system: WRITING_SYSTEM, prompt, maxTokens: 2000, temperature: 0 });
  const result = parseStrictJson<WritingModelResult>(raw);

  const criteria: WritingCriteria = {
    task_achievement: assertBand(result.task_achievement, "Task Achievement"),
    coherence_cohesion: assertBand(result.coherence_cohesion, "Coherence and Cohesion"),
    lexical_resource: assertBand(result.lexical_resource, "Lexical Resource"),
    grammatical_range: assertBand(result.grammatical_range, "Grammatical Range"),
  };

  return {
    criteria,
    // The band is our arithmetic (unit tested), never the model's.
    band: writingTaskBand(criteria),
    feedback: normaliseFeedback(result.feedback, WRITING_CRITERIA.map((c) => c.key)),
    wordCount,
  };
}

/* ------------------------------------------------------------------ *
 * Speaking: four criteria on the transcript
 * ------------------------------------------------------------------ */

export interface SpeakingGrade {
  criteria: SpeakingCriteria;
  band: number;
  feedback: Record<keyof SpeakingCriteria, CriterionFeedback> & { summary: string };
  wordCount: number;
}

export const SPEAKING_CRITERIA: Array<{ key: keyof SpeakingCriteria; label: string }> = [
  { key: "fluency_coherence", label: "Fluency and Coherence" },
  { key: "lexical_resource", label: "Lexical Resource" },
  { key: "grammatical_range", label: "Grammatical Range and Accuracy" },
  { key: "pronunciation", label: "Pronunciation" },
];

/** The same examiner brief as supabase/functions/grade-speaking. */
const SPEAKING_SYSTEM = `You are a certified IELTS Speaking examiner applying the public band descriptors.

You assess ONE part of the Speaking test against exactly four criteria:
- Fluency and Coherence: speech rate and continuity, hesitation, self-correction, discourse markers, and whether ideas connect logically.
- Lexical Resource: range and precision of vocabulary, paraphrase when a word is missing, collocation, idiomatic control.
- Grammatical Range and Accuracy: variety of structures attempted, control of complex forms, error density and whether errors impede understanding.
- Pronunciation: judged only from what the transcript can evidence — word stress patterns, chunking, and any transcription markers of unclear speech. If the transcript gives no pronunciation evidence, award a neutral band and say so explicitly in the comment rather than inventing evidence.

Rules you must follow:
1. Award each criterion a band from 0 to 9 in HALF BANDS only (e.g. 6, 6.5, 7). Never use percentages.
2. Judge only the transcript supplied. Do not assume anything the candidate did not say. The transcript comes from browser speech recognition: ignore punctuation, capitalisation and digits-versus-words, which come from the transcriber, not the candidate.
3. Part 1 is short familiar exchanges, Part 2 is a 1-2 minute monologue, Part 3 is abstract discussion. Calibrate expectations to the part: a short Part 1 answer is not penalised for lacking extended argument, but a Part 2 turn of only a few sentences is under-developed.
4. Every criterion must cite at least one SHORT VERBATIM QUOTE from the candidate's own words as evidence. Quote exactly; never invent text.
5. In each comment, when you deduct, say exactly why: name the error and give the corrected form, or the more natural phrase. Do not give generic advice.
6. Be calibrated, not generous. A blank, off-topic or memorised answer scores very low.

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

interface SpeakingModelResult {
  fluency_coherence: unknown;
  lexical_resource: unknown;
  grammatical_range: unknown;
  pronunciation: unknown;
  feedback?: Record<string, unknown>;
}

export async function gradeSpeaking(
  item: SpeakingPrompt,
  transcript: string,
  speakingSeconds?: number,
): Promise<SpeakingGrade> {
  const text = transcript.trim();
  const wordCount = countWords(text);
  const cue = item.cueCard
    ? `${item.cueCard.topic}\nYou should say:\n${item.cueCard.bullets.map((b) => `- ${b}`).join("\n")}\n${item.cueCard.closing}`
    : item.prompt;

  const prompt = [
    `SPEAKING PART: ${item.part}`,
    `PART INSTRUCTIONS: ${item.instructions}`,
    `CUE CARD / PROMPTS: ${cue}`,
    speakingSeconds ? `SPEAKING TIME: about ${Math.round(speakingSeconds)} seconds` : "",
    `TRANSCRIPT LENGTH: ${wordCount} words`,
    "",
    "CANDIDATE TRANSCRIPT:",
    text || "(nothing was said)",
  ]
    .filter((line) => line !== "")
    .join("\n");

  const raw = await callClaude({ system: SPEAKING_SYSTEM, prompt, maxTokens: 2000, temperature: 0 });
  const result = parseStrictJson<SpeakingModelResult>(raw);

  const criteria: SpeakingCriteria = {
    fluency_coherence: assertBand(result.fluency_coherence, "Fluency and Coherence"),
    lexical_resource: assertBand(result.lexical_resource, "Lexical Resource"),
    grammatical_range: assertBand(result.grammatical_range, "Grammatical Range"),
    pronunciation: assertBand(result.pronunciation, "Pronunciation"),
  };

  return {
    criteria,
    band: speakingBand(criteria),
    feedback: normaliseFeedback(result.feedback, SPEAKING_CRITERIA.map((c) => c.key)),
    wordCount,
  };
}

/* ------------------------------------------------------------------ *
 * Shared
 * ------------------------------------------------------------------ */

/**
 * The model's feedback object is coerced into the exact shape the UI renders,
 * so a missing field never produces an undefined access at render time.
 */
export function normaliseFeedback<K extends string>(
  raw: Record<string, unknown> | undefined,
  keys: readonly K[],
): Record<K, CriterionFeedback> & { summary: string } {
  const out: Record<string, CriterionFeedback> = {};
  for (const key of keys) {
    const entry = (raw?.[key] ?? {}) as { comment?: unknown; evidence?: unknown };
    const evidence = Array.isArray(entry.evidence)
      ? entry.evidence.map((e) => String(e)).filter((e) => e.trim() !== "")
      : typeof entry.evidence === "string" && entry.evidence.trim()
        ? [entry.evidence]
        : [];
    out[key] = { comment: String(entry.comment ?? "").trim(), evidence };
  }
  return {
    ...(out as Record<K, CriterionFeedback>),
    summary: String(raw?.summary ?? "").trim(),
  };
}
