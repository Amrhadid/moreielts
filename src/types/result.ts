import type { QuestionTypeCode, SectionCode } from "./content";

export interface AccuracyRow {
  label: string;
  correct: number;
  total: number;
}

export interface ObjectiveSectionResult {
  section: Extract<SectionCode, "listening" | "reading">;
  band: number;
  rawScore: number;
  rawTotal: 40;
  byQuestionType: Array<AccuracyRow & { code: QuestionTypeCode }>;
  byPart: AccuracyRow[];
}

export interface CriterionScore {
  /** e.g. "Task Achievement", "Fluency and Coherence". */
  criterion: string;
  band: number;
  feedback: string;
}

export interface SubjectiveSectionResult {
  section: Extract<SectionCode, "writing" | "speaking">;
  band: number;
  criteria: CriterionScore[];
}

export interface AnswerReviewRow {
  questionId: string;
  number: number;
  section: SectionCode;
  type: QuestionTypeCode;
  prompt: string;
  userAnswer: string;
  correctAnswer: string;
  correct: boolean;
}

export interface AttemptResult {
  attemptId: string;
  formTitle: string;
  variant: "academic" | "general";
  takenAt: string;
  overall: number;
  listening: ObjectiveSectionResult;
  reading: ObjectiveSectionResult;
  writing: SubjectiveSectionResult;
  speaking: SubjectiveSectionResult;
  answerReview: AnswerReviewRow[];
}

export interface AttemptSummary {
  id: string;
  formTitle: string;
  mode: "practice" | "mock";
  section: SectionCode | "full";
  takenAt: string;
  /** Undefined while an attempt is still in progress. */
  overall?: number;
  status: "completed" | "in_progress";
  /** Progress for the resume card, 0-100. */
  progress?: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  initials: string;
  targetBand: number;
  estimatedBand: number;
  variant: "academic" | "general";
  plan: "free" | "premium";
  testDate: string;
}
