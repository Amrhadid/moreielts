/**
 * Hand-written row types matching supabase/migrations.
 *
 * Regenerate with:
 *   npx supabase gen types typescript --project-id <ref> > src/types/database.ts
 * once the project is linked. Kept by hand for now so the app typechecks
 * without a live project.
 */

export type SectionCode = "listening" | "reading" | "writing" | "speaking";
export type Variant = "academic" | "general_training";
export type RendererKey = "radio" | "checkbox" | "dropdown" | "text_input";
export type AttemptStatus =
  | "in_progress"
  | "completed"
  | "abandoned"
  | "awaiting_speaking";

export interface ProfileRow {
  id: string;
  email: string;
  full_name: string | null;
  role: "user" | "admin";
  tier: "free" | "premium";
  premium_expires_at: string | null;
  target_band: number | null;
  current_band: number | null;
  created_at: string;
  updated_at: string;
}

export interface QuestionTypeRow {
  code: string;
  section: SectionCode;
  label: string;
  renderer: RendererKey;
  default_word_limit: number;
  is_active: boolean;
}

export interface TestFormRow {
  id: string;
  title: string;
  description: string | null;
  variant: Variant;
  delivery_mode: "computer" | "paper";
  is_published: boolean;
  is_premium: boolean;
  scoring_version: string;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface TestSectionRow {
  id: string;
  form_id: string;
  section: SectionCode;
  time_limit_seconds: number;
  question_count: number;
  instructions: string | null;
  order_index: number;
}

export interface ItemGroupRow {
  id: string;
  section_id: string;
  part_number: number;
  passage_text: string | null;
  audio_url: string | null;
  audio_duration_ms: number | null;
  transcript: string | null;
  image_url: string | null;
  shared_instructions: string | null;
  metadata: Record<string, unknown>;
  order_index: number;
}

/** The candidate-safe projection. Note: no accepted_answers, by construction. */
export interface QuestionPublicRow {
  id: string;
  group_id: string;
  type_code: string;
  prompt: string;
  options: Array<{ value: string; label: string }>;
  word_limit: number;
  spelling_policy: "strict" | "lenient";
  accepts_plural: boolean;
  case_sensitive: boolean;
  order_index: number;
  renderer: RendererKey;
  type_label: string;
  section: SectionCode;
}

/** The admin view of a question, including the answer columns. */
export interface QuestionRow extends Omit<QuestionPublicRow, "renderer" | "type_label" | "section"> {
  accepted_answers: string[];
  scoring_rules: Record<string, unknown>;
}

export interface AttemptRow {
  id: string;
  user_id: string;
  form_id: string;
  status: AttemptStatus;
  current_section: SectionCode | null;
  current_position: number;
  section_started_at: string | null;
  section_deadline_at: string | null;
  last_heartbeat_at: string | null;
  started_at: string;
  submitted_at: string | null;
}

export interface ResponseRow {
  id: string;
  attempt_id: string;
  question_id: string;
  answer: string | null;
  audio_url: string | null;
  is_correct: boolean | null;
  time_spent_ms: number | null;
  answered_at: string;
}

export interface AttemptScoreRow {
  attempt_id: string;
  listening_raw: number | null;
  listening_band: number | null;
  reading_raw: number | null;
  reading_band: number | null;
  writing_band: number | null;
  speaking_band: number | null;
  overall_unrounded: number | null;
  overall_band: number | null;
  scoring_version: string;
}

export interface CriterionFeedback {
  comment?: string;
  evidence?: string[];
}

export interface WritingScoreRow {
  id: string;
  attempt_id: string;
  task_number: 1 | 2;
  task_achievement: number | null;
  coherence_cohesion: number | null;
  lexical_resource: number | null;
  grammatical_range: number | null;
  task_band: number | null;
  feedback: Record<string, CriterionFeedback | string>;
  model_version: string | null;
}

export interface SpeakingScoreRow {
  id: string;
  attempt_id: string;
  part_number: 1 | 2 | 3;
  fluency_coherence: number | null;
  lexical_resource: number | null;
  grammatical_range: number | null;
  pronunciation: number | null;
  part_band: number | null;
  transcript: string | null;
  feedback: Record<string, CriterionFeedback | string>;
  model_version: string | null;
}

export interface BandConversionRow {
  id: string;
  variant: Variant;
  section: "listening" | "reading";
  raw_min: number;
  raw_max: number;
  band: number;
  version: string;
}

export interface RedemptionCodeRow {
  code: string;
  type: "premium" | "mock_credit";
  duration_days: number | null;
  form_id: string | null;
  used_by: string | null;
  used_at: string | null;
  expires_at: string | null;
  created_by: string | null;
  created_at: string;
}

/** Return shape of get_attempt_state(). */
export interface AttemptStateRow {
  id: string;
  form_id: string;
  status: AttemptStatus;
  current_section: SectionCode | null;
  current_position: number;
  section_started_at: string | null;
  section_deadline_at: string | null;
  remaining_seconds: number | null;
  server_time: string;
  answered_count: number;
}

/** Return shape of get_attempt_review(). */
export interface AttemptReviewRow {
  question_id: string;
  section: SectionCode;
  part_number: number;
  order_index: number;
  type_code: string;
  type_label: string;
  prompt: string;
  user_answer: string | null;
  accepted_answers: string[];
  is_correct: boolean | null;
}
