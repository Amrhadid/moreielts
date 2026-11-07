import type { IconName } from "~/components/ui/Icon";
import type { SectionCode } from "~/types/content";

/**
 * One place for how each IELTS section is named, drawn and described. The
 * colour classes are tokens with dark variants (see styles.css), never
 * literal hex values.
 */
export interface SectionMeta {
  code: SectionCode;
  label: string;
  icon: IconName;
  /** Icon tile: tinted background and coloured glyph. */
  tile: string;
  /** Text in the section colour. */
  text: string;
  /** Facts in the official format. */
  facts: string[];
  short: string;
  player: "/test/listening" | "/test/reading" | "/test/writing" | "/test/speaking";
  durationMinutes: number;
}

export const SECTIONS: readonly SectionMeta[] = [
  {
    code: "listening",
    label: "Listening",
    icon: "headphones",
    tile: "bg-listening-soft text-listening",
    text: "text-listening",
    facts: ["4 parts", "40 questions", "about 30 minutes", "the recording plays once"],
    short: "4 parts · 40 questions · 30 min",
    player: "/test/listening",
    durationMinutes: 30,
  },
  {
    code: "reading",
    label: "Reading",
    icon: "book",
    tile: "bg-reading-soft text-reading",
    text: "text-reading",
    facts: ["3 passages", "40 questions", "60 minutes", "no transfer time"],
    short: "3 passages · 40 questions · 60 min",
    player: "/test/reading",
    durationMinutes: 60,
  },
  {
    code: "writing",
    label: "Writing",
    icon: "pen",
    tile: "bg-writing-soft text-writing",
    text: "text-writing",
    facts: ["Task 1, 150 words", "Task 2, 250 words", "one 60-minute clock for both"],
    short: "2 tasks · 60 min",
    player: "/test/writing",
    durationMinutes: 60,
  },
  {
    code: "speaking",
    label: "Speaking",
    icon: "mic",
    tile: "bg-speaking-soft text-speaking",
    text: "text-speaking",
    facts: ["3 parts", "11 to 14 minutes", "Part 2: 1 minute to prepare, 2 to talk"],
    short: "3 parts · 11–14 min",
    player: "/test/speaking",
    durationMinutes: 14,
  },
] as const;

export const SECTION_BY_CODE: Record<SectionCode, SectionMeta> = Object.fromEntries(
  SECTIONS.map((s) => [s.code, s]),
) as Record<SectionCode, SectionMeta>;

export function sectionMeta(code: SectionCode | string | null | undefined): SectionMeta {
  return SECTION_BY_CODE[(code as SectionCode) ?? "reading"] ?? SECTION_BY_CODE.reading;
}
