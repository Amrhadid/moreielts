/**
 * One question, one answer, one verdict. The same rules submit-attempt marks
 * a mock with, packaged for drills and the mistake notebook.
 */
import {
  checkAnswer,
  checkMultiAnswer,
  type CheckableQuestion,
} from "../../../src/lib/answer-check.ts";

export interface MarkableQuestion {
  accepted_answers: string[] | null;
  word_limit: number;
  spelling_policy: "strict" | "lenient";
  accepts_plural: boolean;
  case_sensitive: boolean;
  scoring_rules: Record<string, unknown> | null;
  renderer: string;
}

/** Multi-select answers arrive as arrays or as the stored JSON string. */
export function toSelection(answer: unknown): string[] {
  if (Array.isArray(answer)) return answer.map(String);
  if (typeof answer !== "string") return [];
  try {
    const parsed = JSON.parse(answer);
    if (Array.isArray(parsed)) return parsed.map(String);
  } catch {
    // fall through to comma split
  }
  return answer.split(",").map((s: string) => s.trim()).filter(Boolean);
}

export function isCorrect(question: MarkableQuestion, answer: unknown): boolean {
  const checkable: CheckableQuestion = {
    acceptedAnswers: question.accepted_answers ?? [],
    wordLimit: question.word_limit,
    spellingPolicy: question.spelling_policy,
    acceptsPlural: question.accepts_plural,
    caseSensitive: question.case_sensitive,
    scoringRules: question.scoring_rules ?? {},
  };
  if (question.renderer === "checkbox") {
    return checkMultiAnswer(toSelection(answer), checkable).correct;
  }
  return checkAnswer(typeof answer === "string" ? answer : String(answer ?? ""), checkable).correct;
}

/** Stored form of an answer: arrays as JSON, like the mock player saves them. */
export function storedAnswer(answer: unknown): string {
  return Array.isArray(answer) ? JSON.stringify(answer) : String(answer ?? "");
}
