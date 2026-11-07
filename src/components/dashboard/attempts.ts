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

export function num(v: number | string | null | undefined): number | null {
  return v === null || v === undefined ? null : Number(v);
}

/** Change between two bands as a chip: "+0.5" (good) or "−0.5" (warn), null when either is missing. */
export function changeChip(current: number | null, previous: number | null) {
  if (current === null || previous === null) return null;
  const d = Math.round((current - previous) * 2) / 2;
  if (d === 0) return { tone: "neutral" as const, label: "no change" };
  return d > 0
    ? { tone: "good" as const, label: `+${d.toFixed(1)}` }
    : { tone: "warn" as const, label: `−${Math.abs(d).toFixed(1)}` };
}

export function greeting(date = new Date()) {
  const h = date.getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}
