import type { SectionCode } from "~/types/content";

/**
 * What the exam asks for each question type, in one line. Keyed by
 * question_types.code; anything the registry adds later falls back to a
 * neutral sentence, so a new type still renders without a client release.
 */
const ASKS: Record<string, string> = {
  multiple_choice_single: "Choose the one correct option from three or four.",
  multiple_choice_multiple: "Pick two or three correct options from a list.",
  true_false_notgiven: "Decide whether each statement agrees with the passage.",
  yes_no_notgiven: "Decide whether each statement matches the writer's views.",
  matching_headings: "Choose the heading that best summarises each paragraph.",
  matching_information: "Find which paragraph contains each piece of information.",
  matching_features: "Match statements to people, places or categories.",
  matching_sentence_endings: "Complete each sentence with the correct ending from a list.",
  sentence_completion: "Finish sentences with words taken from the text.",
  summary_completion: "Fill gaps in a summary with words from the passage.",
  note_completion: "Complete notes with words from the recording or passage.",
  table_completion: "Fill the empty cells of a table from the text.",
  flowchart_completion: "Complete the stages of a process from the text.",
  diagram_label: "Label parts of a diagram with words from the text.",
  short_answer: "Answer a question in a few words from the text.",
};

export function whatItAsks(code: string, section?: SectionCode) {
  if (ASKS[code]) return ASKS[code];
  return section === "listening"
    ? "Answer from what you hear. The recording plays once."
    : "Answer using the information in the text.";
}

/** Fixed choices for the two productive sections, which have no type list. */
export const WRITING_CHOICES = [
  { code: "task_1", label: "Task 1 · Chart or diagram", asks: "Describe the main features of a chart, table, map or process in at least 150 words." },
  { code: "task_2", label: "Task 2 · Essay", asks: "Argue a position on a topic in at least 250 words." },
] as const;

export const SPEAKING_CHOICES = [
  { code: "part_1", label: "Part 1 · Introduction", asks: "Short answers about home, work, study and interests. 4 to 5 minutes." },
  { code: "part_2", label: "Part 2 · Cue card", asks: "One minute to prepare, then talk for up to two minutes." },
  { code: "part_3", label: "Part 3 · Discussion", asks: "Abstract questions that follow from the Part 2 topic." },
] as const;
