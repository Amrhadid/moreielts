import type { PracticeSection } from "~/data/practice";

/**
 * Practice history lives in the browser, per signed-in user. Practice sets are
 * drills with no test form or attempt row behind them, and a result table for
 * them is not part of the schema yet, so a small localStorage log keeps the
 * "recent practice" list working without a backend write.
 */

export interface PracticeHistoryEntry {
  id: string;
  section: PracticeSection;
  /** Set or task id from ~/data/practice. */
  itemId: string;
  title: string;
  /** ISO timestamp. */
  at: string;
  /** Objective sections: "4/5". Productive sections: a band such as 6.5. */
  score: { kind: "raw"; correct: number; total: number } | { kind: "band"; band: number };
  summary?: string;
}

const LIMIT = 40;

function key(userId: string) {
  return `moreielts.practice.history.${userId}`;
}

function storage(): Storage | null {
  try {
    if (typeof window === "undefined") return null;
    return window.localStorage;
  } catch {
    return null;
  }
}

export function readHistory(userId: string | undefined): PracticeHistoryEntry[] {
  if (!userId) return [];
  const store = storage();
  if (!store) return [];
  try {
    const raw = store.getItem(key(userId));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as PracticeHistoryEntry[]) : [];
  } catch {
    return [];
  }
}

export function appendHistory(
  userId: string | undefined,
  entry: Omit<PracticeHistoryEntry, "id" | "at">,
): PracticeHistoryEntry | null {
  if (!userId) return null;
  const store = storage();
  if (!store) return null;
  const full: PracticeHistoryEntry = {
    ...entry,
    id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    at: new Date().toISOString(),
  };
  try {
    const next = [full, ...readHistory(userId)].slice(0, LIMIT);
    store.setItem(key(userId), JSON.stringify(next));
  } catch {
    // Quota or privacy mode: the result is still shown on screen.
  }
  return full;
}

export function formatHistoryScore(entry: PracticeHistoryEntry): string {
  return entry.score.kind === "raw"
    ? `${entry.score.correct}/${entry.score.total}`
    : `Band ${entry.score.band.toFixed(1)}`;
}
