import type { PracticeSection } from "~/data/practice";

/**
 * Practice history. Every finished item is written to
 * `public.ielts_practice_results` (migration 0007; own rows only under RLS) so
 * "Recent practice" follows the learner across devices, and mirrored into
 * localStorage so the list still renders offline or if the insert fails.
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

export const PRACTICE_RESULTS_TABLE = "ielts_practice_results";

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

/**
 * Records a finished item: the local mirror synchronously, the server row in
 * the background. Returns the entry as it will appear in the list.
 */
export function appendHistory(
  userId: string | undefined,
  entry: Omit<PracticeHistoryEntry, "id" | "at">,
): PracticeHistoryEntry | null {
  if (!userId) return null;
  const full: PracticeHistoryEntry = {
    ...entry,
    id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    at: new Date().toISOString(),
  };
  const store = storage();
  if (store) {
    try {
      const next = [full, ...readHistory(userId)].slice(0, LIMIT);
      store.setItem(key(userId), JSON.stringify(next));
    } catch {
      // Quota or privacy mode: the result is still shown on screen.
    }
  }
  void persistRemote(userId, full);
  return full;
}

interface PracticeResultRow {
  id: string;
  section: PracticeSection;
  item_id: string;
  title: string;
  score: PracticeHistoryEntry["score"];
  summary: string | null;
  created_at: string;
}

/** Best-effort server write. A failure never blocks the result on screen. */
async function persistRemote(userId: string, entry: PracticeHistoryEntry): Promise<void> {
  try {
    // Imported lazily so the pure helpers stay testable without a client.
    const { supabase } = await import("~/lib/supabase");
    const { error } = await supabase.from(PRACTICE_RESULTS_TABLE).insert({
      user_id: userId,
      section: entry.section,
      item_id: entry.itemId,
      title: entry.title,
      score: entry.score,
      summary: entry.summary ?? null,
    });
    if (error) console.warn("Practice result was not saved to the server:", error.message);
  } catch (error) {
    console.warn("Practice result was not saved to the server:", error);
  }
}

/**
 * The learner's history from the server, newest first. Throws on a query
 * error so the caller can fall back to the local mirror.
 */
export async function fetchHistory(userId: string): Promise<PracticeHistoryEntry[]> {
  const { supabase } = await import("~/lib/supabase");
  const { data, error } = await supabase
    .from(PRACTICE_RESULTS_TABLE)
    .select("id, section, item_id, title, score, summary, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(LIMIT);
  if (error) throw error;
  return ((data ?? []) as unknown as PracticeResultRow[]).map((row) => ({
    id: row.id,
    section: row.section,
    itemId: row.item_id,
    title: row.title,
    at: row.created_at,
    score: row.score,
    summary: row.summary ?? undefined,
  }));
}

export function formatHistoryScore(entry: PracticeHistoryEntry): string {
  return entry.score.kind === "raw"
    ? `${entry.score.correct}/${entry.score.total}`
    : `Band ${entry.score.band.toFixed(1)}`;
}
