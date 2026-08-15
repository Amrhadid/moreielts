import type { ItemGroupRow, QuestionPublicRow } from "~/types/database";
import type { ItemGroup, Question, StimulusKind } from "~/types/content";

/**
 * Maps database rows onto the shapes the existing UI components already
 * consume, so the backend pass changed no component props and no layout.
 */

function stimulusKindFor(group: ItemGroupRow, section: string): StimulusKind {
  if (group.audio_url) return "audio";
  if (section === "speaking") return group.passage_text ? "cue_card" : "none";
  if (section === "writing") return "writing_task";
  if (group.passage_text) return "passage";
  if (group.image_url) return "image";
  return "none";
}

export function toQuestion(row: QuestionPublicRow, number: number): Question {
  return {
    id: row.id,
    number,
    type: row.type_code as Question["type"],
    prompt: row.prompt,
    options: row.options ?? [],
    // Candidates never receive accepted answers; the field stays empty until
    // the review RPC supplies them after submission.
    acceptedAnswers: [],
    wordLimit: row.word_limit,
    spellingStrict: row.spelling_policy === "strict",
    renderer: row.renderer,
    typeLabel: row.type_label,
  };
}

export function toItemGroup(
  row: ItemGroupRow & { questions: QuestionPublicRow[] },
  section: string,
  numberOffset: number,
): { group: ItemGroup; nextOffset: number } {
  let offset = numberOffset;
  const questions = row.questions.map((q) => toQuestion(q, ++offset));

  return {
    nextOffset: offset,
    group: {
      id: row.id,
      partNumber: row.part_number,
      title: partTitle(section, row.part_number),
      stimulusKind: stimulusKindFor(row, section),
      passageText: row.passage_text ?? undefined,
      audioUrl: row.audio_url ?? undefined,
      imageUrl: row.image_url ?? undefined,
      imageCaption: (row.metadata?.image_caption as string) ?? undefined,
      instructions: row.shared_instructions ?? "",
      questions,
    },
  };
}

function partTitle(section: string, partNumber: number): string {
  if (section === "reading") return `Passage ${partNumber}`;
  if (section === "writing") return `Task ${partNumber}`;
  return `Part ${partNumber}`;
}

/** Whole section: groups in order with questions numbered 1..n across them. */
export function toItemGroups(
  rows: Array<ItemGroupRow & { questions: QuestionPublicRow[] }>,
  section: string,
): ItemGroup[] {
  let offset = 0;
  return rows.map((row) => {
    const { group, nextOffset } = toItemGroup(row, section, offset);
    offset = nextOffset;
    return group;
  });
}
