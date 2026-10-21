import { countWords } from "../../src/lib/answer-check";
import type { QuestionTypeCode, SeedForm, Section } from "../../src/types/content";

/**
 * Structural checks for an authored form. Errors make the seed unusable (a
 * question nobody can score, a wrong question count); warnings are content
 * gaps worth fixing (no transcript, so no audio can be generated).
 */

const OBJECTIVE_TYPES = new Set<QuestionTypeCode>([
  "multiple_choice_single",
  "multiple_choice_multiple",
  "true_false_notgiven",
  "yes_no_notgiven",
  "matching_headings",
  "matching_information",
  "matching_features",
  "matching_sentence_endings",
  "sentence_completion",
  "summary_completion",
  "note_completion",
  "table_completion",
  "flowchart_completion",
  "diagram_label",
  "short_answer",
]);

const SHAPE: Record<Section["code"], { groups: number; questions?: number }> = {
  listening: { groups: 4, questions: 40 },
  reading: { groups: 3, questions: 40 },
  writing: { groups: 2, questions: 2 },
  speaking: { groups: 3 },
};

export interface ValidationReport {
  errors: string[];
  warnings: string[];
}

export function validateForm(form: SeedForm): ValidationReport {
  const errors: string[] = [];
  const warnings: string[] = [];
  const at = (where: string, msg: string) => `${form.slug} ${where}: ${msg}`;

  if (!/^[a-z0-9-]+$/.test(form.slug)) errors.push(at("slug", "use lowercase letters, digits and dashes"));

  const codes = form.sections.map((s) => s.code);
  for (const code of ["listening", "reading", "writing", "speaking"] as const) {
    if (!codes.includes(code)) errors.push(at(code, "section missing"));
  }

  const ids = new Set<string>();
  for (const section of form.sections) {
    const shape = SHAPE[section.code];
    // General Training reading splits its first two sections into several
    // short texts, so it may have up to five parts.
    const groupsOk =
      section.code === "reading" && form.variant === "general_training"
        ? section.itemGroups.length >= 3 && section.itemGroups.length <= 5
        : section.itemGroups.length === shape.groups;
    if (!groupsOk) {
      errors.push(at(section.code, `expected ${shape.groups} parts, found ${section.itemGroups.length}`));
    }
    const questions = section.itemGroups.flatMap((g) => g.questions);
    if (shape.questions && questions.length !== shape.questions) {
      errors.push(at(section.code, `expected ${shape.questions} questions, found ${questions.length}`));
    }
    if (section.questionCount !== questions.length) {
      errors.push(at(section.code, `questionCount ${section.questionCount} ≠ ${questions.length} questions`));
    }

    for (const group of section.itemGroups) {
      if (section.code === "listening" && !group.transcript?.trim()) {
        warnings.push(at(group.id, "no transcript — audio cannot be generated"));
      }
      if (section.code === "reading" && !group.passageText?.trim()) {
        errors.push(at(group.id, "reading part has no passage"));
      }
      if (section.code === "writing" && !group.passageText?.trim()) {
        errors.push(at(group.id, "writing task has no prompt"));
      }
    }

    const objective = section.code === "listening" || section.code === "reading";
    questions.forEach((question, index) => {
      const where = `${section.code} ${question.id}`;
      if (ids.has(`${section.code}:${question.id}`)) errors.push(at(where, "duplicate question id"));
      ids.add(`${section.code}:${question.id}`);
      if (objective && question.number !== index + 1) {
        errors.push(at(where, `numbered ${question.number}, expected ${index + 1}`));
      }
      if (!OBJECTIVE_TYPES.has(question.type)) errors.push(at(where, `unknown type ${question.type}`));
      if (!objective) return;

      if (question.acceptedAnswers.length === 0) errors.push(at(where, "no accepted answer"));
      if (question.options && question.options.length > 0) {
        const values = new Set(question.options.map((o) => o.value));
        for (const answer of question.acceptedAnswers) {
          if (!values.has(answer)) errors.push(at(where, `answer "${answer}" is not an option value`));
        }
      } else if (question.wordLimit) {
        for (const answer of question.acceptedAnswers) {
          if (countWords(answer) > question.wordLimit) {
            errors.push(at(where, `answer "${answer}" exceeds the ${question.wordLimit}-word limit`));
          }
        }
      }
      if (!question.explanation?.trim()) warnings.push(at(where, "no explanation"));
    });
  }

  return { errors, warnings };
}

export function validateForms(forms: SeedForm[]): ValidationReport {
  const report: ValidationReport = { errors: [], warnings: [] };
  const slugs = new Set<string>();
  for (const form of forms) {
    if (slugs.has(form.slug)) report.errors.push(`${form.slug}: duplicate slug`);
    slugs.add(form.slug);
    const r = validateForm(form);
    report.errors.push(...r.errors);
    report.warnings.push(...r.warnings);
  }
  return report;
}
