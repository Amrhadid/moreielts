/**
 * Practice content shapes.
 *
 * Practice sets are authored in this directory and shipped with the build, so
 * they need neither a published test form nor a Supabase table. Each section
 * has exactly five items. The AI correction step runs against the deployed
 * `claude-completion` Edge Function (see ~/lib/practice/ai.ts).
 */

export type PracticeSection = "listening" | "reading" | "writing" | "speaking";

export type ObjectiveSection = "listening" | "reading";

export interface ObjectiveOption {
  /** Stable value stored in the answer sheet, e.g. "A" or "TRUE". */
  value: string;
  label: string;
}

export interface ObjectiveQuestion {
  id: string;
  /** 1-5 within the set. */
  number: number;
  /** `radio` for choice questions, `text` for completion and short answers. */
  kind: "radio" | "text";
  /** Human label for the IELTS question type, shown above the question. */
  typeLabel: string;
  prompt: string;
  options?: ObjectiveOption[];
  /** Every spelling/phrasing that scores a mark. First entry is canonical. */
  acceptedAnswers: string[];
  /** IELTS rubric limit for completion questions, 0 = none. */
  wordLimit?: number;
  /**
   * Authored explanation, shown in the review alongside the AI feedback so the
   * learner still gets an answer key if the AI call fails.
   */
  explanation: string;
}

export interface ReadingPassage {
  title: string;
  /** Plain paragraphs. A leading "A. " style letter is kept as written. */
  paragraphs: string[];
}

export interface ListeningAudio {
  /** Path under /public. */
  src: string;
  durationLabel: string;
  /** Speaker-prefixed lines, revealed only after the answers are checked. */
  transcript: string[];
}

export interface ObjectiveSet {
  section: ObjectiveSection;
  id: string;
  title: string;
  /** Shared rubric shown above the questions, e.g. "Write NO MORE THAN TWO WORDS…". */
  instructions: string;
  /** One-line scene-setter: "Passage 1 · 5 questions". */
  contextLabel: string;
  passage?: ReadingPassage;
  audio?: ListeningAudio;
  questions: ObjectiveQuestion[];
}

export interface BarChartSpec {
  kind: "bar";
  title: string;
  /** Axis unit label, e.g. "% of households". */
  unit: string;
  categories: string[];
  series: Array<{ name: string; values: number[] }>;
  /** Upper bound of the axis. */
  max: number;
}

export interface TableSpec {
  title: string;
  columns: string[];
  rows: string[][];
}

export interface WritingTask {
  id: string;
  taskNumber: 1 | 2;
  title: string;
  /** Short label for the picker, e.g. "Bar chart · internet access". */
  topic: string;
  instructions: string;
  /** The task statement, plain paragraphs separated by blank lines. */
  prompt: string;
  minWords: number;
  suggestedMinutes: number;
  chart?: BarChartSpec;
  table?: TableSpec;
}

export interface CueCard {
  topic: string;
  bullets: string[];
  closing: string;
}

export interface SpeakingPrompt {
  id: string;
  part: 1 | 2 | 3;
  title: string;
  topic: string;
  instructions: string;
  /** The examiner's question. For Part 2 the cue card carries the content. */
  prompt: string;
  cueCard?: CueCard;
  /** Recording limit in seconds. */
  maxSeconds: number;
  /** Part 2 only: preparation time in seconds. */
  prepSeconds?: number;
}
