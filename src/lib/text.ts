/*
 * Word counting lives in answer-check, where it is unit tested against the
 * IELTS rules (a hyphenated word is one word, a number is one word). Re-exported
 * here so callers have one obvious import.
 */
export { countWords } from "./answer-check";

/** mm:ss for the countdown clocks. */
export function formatClock(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const m = Math.floor(safe / 60);
  const s = safe % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
