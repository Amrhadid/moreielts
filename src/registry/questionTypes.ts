import type {
  QuestionTypeCode,
  RendererKey,
  SectionCode,
} from "~/types/content";

/**
 * The question type registry.
 *
 * Adding a new IELTS question type means adding one entry here and nothing
 * else -- the practice picker, the admin builder's type dropdown and the
 * player all read from this list. There is deliberately no hardcoded union of
 * types in any component.
 */
export interface QuestionTypeEntry {
  code: QuestionTypeCode;
  /** Which sections may use this type. */
  sections: SectionCode[];
  label: string;
  /** Short line shown in the practice picker and the builder. */
  blurb: string;
  renderer: RendererKey;
  /** Default answer word limit; 0 means "not word limited". */
  defaultWordLimit: number;
  /** Practice availability. UI badge only in this pass. */
  tier: "free" | "premium";
}

export const QUESTION_TYPES: QuestionTypeEntry[] = [
  {
    code: "multiple_choice_single",
    sections: ["listening", "reading"],
    label: "Multiple choice (one answer)",
    blurb: "Pick the single best option from A-D.",
    renderer: "radio",
    defaultWordLimit: 0,
    tier: "free",
  },
  {
    code: "multiple_choice_multiple",
    sections: ["listening", "reading"],
    label: "Multiple choice (several answers)",
    blurb: "Choose two or more correct options from a longer list.",
    renderer: "checkbox",
    defaultWordLimit: 0,
    tier: "free",
  },
  {
    code: "true_false_notgiven",
    sections: ["reading"],
    label: "True / False / Not Given",
    blurb: "Decide whether a statement matches the factual information.",
    renderer: "radio",
    defaultWordLimit: 0,
    tier: "free",
  },
  {
    code: "yes_no_notgiven",
    sections: ["reading"],
    label: "Yes / No / Not Given",
    blurb: "Decide whether a statement matches the writer's claims or views.",
    renderer: "radio",
    defaultWordLimit: 0,
    tier: "free",
  },
  {
    code: "matching_headings",
    sections: ["reading"],
    label: "Matching headings",
    blurb: "Match a heading from the list to each paragraph.",
    renderer: "dropdown",
    defaultWordLimit: 0,
    tier: "free",
  },
  {
    code: "matching_information",
    sections: ["reading"],
    label: "Matching information",
    blurb: "Locate which paragraph contains a given piece of information.",
    renderer: "dropdown",
    defaultWordLimit: 0,
    tier: "premium",
  },
  {
    code: "matching_features",
    sections: ["listening", "reading"],
    label: "Matching features",
    blurb: "Match statements to people, places, dates or categories.",
    renderer: "dropdown",
    defaultWordLimit: 0,
    tier: "premium",
  },
  {
    code: "matching_sentence_endings",
    sections: ["reading"],
    label: "Matching sentence endings",
    blurb: "Complete each sentence with the correct ending from a list.",
    renderer: "dropdown",
    defaultWordLimit: 0,
    tier: "premium",
  },
  {
    code: "sentence_completion",
    sections: ["listening", "reading"],
    label: "Sentence completion",
    blurb: "Fill the gap using words taken from the text.",
    renderer: "text_input",
    defaultWordLimit: 2,
    tier: "free",
  },
  {
    code: "summary_completion",
    sections: ["listening", "reading"],
    label: "Summary completion",
    blurb: "Complete a summary of part of the text.",
    renderer: "text_input",
    defaultWordLimit: 2,
    tier: "free",
  },
  {
    code: "note_completion",
    sections: ["listening", "reading"],
    label: "Note completion",
    blurb: "Complete a set of notes with missing details.",
    renderer: "text_input",
    defaultWordLimit: 2,
    tier: "free",
  },
  {
    code: "table_completion",
    sections: ["listening", "reading"],
    label: "Table completion",
    blurb: "Fill the empty cells of a table.",
    renderer: "text_input",
    defaultWordLimit: 2,
    tier: "premium",
  },
  {
    code: "flowchart_completion",
    sections: ["listening", "reading"],
    label: "Flow-chart completion",
    blurb: "Complete the stages of a process diagram.",
    renderer: "text_input",
    defaultWordLimit: 2,
    tier: "premium",
  },
  {
    code: "diagram_label",
    sections: ["listening", "reading"],
    label: "Diagram labelling",
    blurb: "Label the parts of a plan, map or technical drawing.",
    renderer: "text_input",
    defaultWordLimit: 2,
    tier: "premium",
  },
  {
    code: "short_answer",
    sections: ["listening", "reading"],
    label: "Short answer",
    blurb: "Answer a direct question in a few words.",
    renderer: "text_input",
    defaultWordLimit: 3,
    tier: "free",
  },
];

const BY_CODE = new Map(QUESTION_TYPES.map((t) => [t.code, t]));

export function getQuestionType(code: QuestionTypeCode): QuestionTypeEntry {
  const entry = BY_CODE.get(code);
  if (!entry) throw new Error(`Unknown question type: ${code}`);
  return entry;
}

export function questionTypesForSection(
  section: SectionCode,
): QuestionTypeEntry[] {
  return QUESTION_TYPES.filter((t) => t.sections.includes(section));
}
