import { useCallback, useEffect, useState } from "react";

/**
 * "Flag for review", as in the computer-delivered test. A client-side aid
 * only: it never reaches the server, and it survives a refresh through
 * sessionStorage keyed by attempt and section.
 */
export function useFlags(attemptId: string | null | undefined, section: string) {
  const [flagged, setFlagged] = useState<Set<number>>(() => new Set());
  const key = attemptId ? `flags:${attemptId}:${section}` : null;

  useEffect(() => {
    if (!key || typeof window === "undefined") return;
    try {
      const raw = window.sessionStorage.getItem(key);
      if (raw) setFlagged(new Set(JSON.parse(raw) as number[]));
    } catch {
      /* ignore a corrupt entry */
    }
  }, [key]);

  const toggleFlag = useCallback(
    (n: number) => {
      setFlagged((prev) => {
        const next = new Set(prev);
        if (next.has(n)) next.delete(n);
        else next.add(n);
        if (key && typeof window !== "undefined") {
          try {
            window.sessionStorage.setItem(key, JSON.stringify([...next]));
          } catch {
            /* storage unavailable: flags still work for this page view */
          }
        }
        return next;
      });
    },
    [key],
  );

  return { flagged, toggleFlag };
}
