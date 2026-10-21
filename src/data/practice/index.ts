import { LISTENING_SET } from "./listening";
import { READING_SET } from "./reading";
import { SPEAKING_PROMPTS } from "./speaking";
import type { PracticeSection } from "./types";
import { WRITING_TASKS } from "./writing";

export * from "./types";
export { LISTENING_SET, READING_SET, SPEAKING_PROMPTS, WRITING_TASKS };

export const PRACTICE_SECTIONS: PracticeSection[] = [
  "listening",
  "reading",
  "writing",
  "speaking",
];

export function isPracticeSection(value: string): value is PracticeSection {
  return (PRACTICE_SECTIONS as string[]).includes(value);
}

export interface PracticeSectionMeta {
  code: PracticeSection;
  label: string;
  blurb: string;
  detail: string;
  /** How the AI corrects this section, for the picker card. */
  correction: string;
  icon: string;
}

export const PRACTICE_META: Record<PracticeSection, PracticeSectionMeta> = {
  listening: {
    code: "listening",
    label: "Listening",
    blurb: "A Part 1 conversation with form completion and multiple choice.",
    detail: "5 questions · about 2 minutes of audio",
    correction: "Marked instantly, then the AI explains each answer from the transcript.",
    icon: "🎧",
  },
  reading: {
    code: "reading",
    label: "Reading",
    blurb: "One Academic passage with True/False/Not Given, multiple choice and completion.",
    detail: "5 questions · one passage",
    correction: "Marked instantly, then the AI shows where in the passage each answer is.",
    icon: "📄",
  },
  writing: {
    code: "writing",
    label: "Writing",
    blurb: "Two Task 1 data prompts and three Task 2 essays.",
    detail: "5 tasks · choose one at a time",
    correction: "Banded by the AI on the four official criteria, with quotes from your text.",
    icon: "✍️",
  },
  speaking: {
    code: "speaking",
    label: "Speaking",
    blurb: "Part 1 questions, a Part 2 cue card and Part 3 discussion.",
    detail: "5 prompts · recorded in the browser",
    correction: "Transcribed as you speak, then banded by the AI on the four criteria.",
    icon: "🎙️",
  },
};
