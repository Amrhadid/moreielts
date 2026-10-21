/**
 * Content hierarchy: test form -> sections -> item groups -> questions.
 *
 * An item group owns a shared stimulus (reading passage, listening part audio,
 * a chart image, or a speaking cue card) plus shared instructions, and contains
 * an ordered list of questions.
 */

export type SectionCode = "listening" | "reading" | "writing" | "speaking";

export type Variant = "academic" | "general";

export type Difficulty = "foundation" | "standard" | "challenge";

/** Renderer keys. Every question type maps onto exactly one of these four. */
export type RendererKey = "radio" | "checkbox" | "dropdown" | "text_input";

export type QuestionTypeCode =
  | "multiple_choice_single"
  | "multiple_choice_multiple"
  | "true_false_notgiven"
  | "yes_no_notgiven"
  | "matching_headings"
  | "matching_information"
  | "matching_features"
  | "matching_sentence_endings"
  | "sentence_completion"
  | "summary_completion"
  | "note_completion"
  | "table_completion"
  | "flowchart_completion"
  | "diagram_label"
  | "short_answer";

export interface QuestionOption {
  /** Stable value stored in the answer sheet, e.g. "A" or "iv". */
  value: string;
  label: string;
}

export interface Question {
  id: string;
  /** 1-40 within the section. Drives the question navigator. */
  number: number;
  type: QuestionTypeCode;
  prompt: string;
  options?: QuestionOption[];
  /** All spellings/phrasings accepted as correct. First entry is canonical. */
  acceptedAnswers: string[];
  /** Overrides the registry default when the rubric says something else. */
  wordLimit?: number;
  /** false => spelling is not penalised (rare, but supported by the builder). */
  spellingStrict?: boolean;
  /**
   * Renderer and label as supplied by question_types via the database. When
   * present these win over the static registry, so adding a question type is
   * an INSERT and needs no client release.
   */
  renderer?: RendererKey;
  typeLabel?: string;
  /**
   * Why the answer is right, ideally quoting the passage or transcript line
   * that proves it. Admin-only until the attempt or drill is submitted.
   */
  explanation?: string;
}

export type StimulusKind =
  | "passage"
  | "audio"
  | "image"
  | "cue_card"
  | "writing_task"
  | "none";

export interface ItemGroup {
  id: string;
  /** Passage number, listening part number, task number, speaking part. */
  partNumber: number;
  title: string;
  stimulusKind: StimulusKind;
  /** Passage prose or cue-card / writing-task body. Plain paragraphs. */
  passageText?: string;
  /** TODO(backend): replace with the R2 object URL for the part's audio. */
  /** R2 object URL of the part's MP3 (written by generate-audio or an upload). */
  audioUrl?: string;
  /** R2 object URL, or a /public path, of the chart, map or diagram. */
  imageUrl?: string;
  imageCaption?: string;
  /** Shared rubric shown above every question in the group. */
  instructions: string;
  /**
   * Listening only: the full script. Stored admin-only (item_group_scripts),
   * fed to text-to-speech, and released to the candidate after submission.
   * Speaker turns are written "NAME: line" so TTS can assign voices.
   */
  transcript?: string;
  questions: Question[];
}

export interface Section {
  code: SectionCode;
  title: string;
  /** Whole-section limit in minutes (Writing covers both tasks with one clock). */
  durationMinutes: number;
  questionCount: number;
  itemGroups: ItemGroup[];
}

export interface TestForm {
  id: string;
  title: string;
  variant: Variant;
  published: boolean;
  updatedAt: string;
  sections: Section[];
}

/** answers[questionId] = string (single) | string[] (multi-select). */
export type AnswerSheet = Record<string, string | string[]>;

/** One complete form as authored in scripts/seed-content/forms. */
export interface SeedForm {
  /** Stable, unique slug. Seed uuids derive from it, so never rename one. */
  slug: string;
  title: string;
  description: string;
  variant: "academic" | "general_training";
  difficulty: Difficulty;
  isPremium: boolean;
  sections: Section[];
}
