import type { AttemptRow } from "~/types/database";
import type { SectionCode } from "~/types/content";
import { sectionMeta } from "~/lib/sections";

export type AttemptListRow = AttemptRow & {
  test_forms: { title: string; variant: string } | null;
  attempt_scores: { overall_band: number | null } | null;
};

export function isOpen(a: AttemptListRow) {
  return a.status === "in_progress" || a.status === "awaiting_speaking";
}

export function isCompleted(a: AttemptListRow) {
  return a.status === "completed";
}

/** Where to resume an open attempt. */
export function resumeRoute(a: AttemptListRow) {
  return sectionMeta(a.current_section ?? "listening").player;
}

export function resumeSection(a: AttemptListRow): SectionCode {
  return (a.current_section ?? "listening") as SectionCode;
}

export function shortDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export function longDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function overallOf(a: AttemptListRow | undefined): number | null {
  const v = a?.attempt_scores?.overall_band;
  return v === null || v === undefined ? null : Number(v);
}

/** Round to the nearest half band, formatted with one decimal. */
export function num(v: number | string | null | undefined): number | null {
  return v === null || v === undefined ? null : Number(v);
}
