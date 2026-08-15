import { useCallback, useMemo, useRef, useState } from "react";
import type { AnswerSheet } from "~/types/content";

/**
 * Local answer-sheet state plus the scroll refs the navigator jumps to.
 * TODO(backend): persist to the attempts table on a debounce.
 */
export function useAnswers(numbers: number[], idFor: (n: number) => string) {
  const [answers, setAnswers] = useState<AnswerSheet>({});
  const [current, setCurrent] = useState(numbers[0] ?? 1);
  const refs = useRef(new Map<number, HTMLDivElement>());

  const setAnswer = useCallback((questionId: string, value: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }, []);

  const registerRef = useCallback((n: number, el: HTMLDivElement | null) => {
    if (el) refs.current.set(n, el);
    else refs.current.delete(n);
  }, []);

  const jumpTo = useCallback((n: number) => {
    setCurrent(n);
    refs.current.get(n)?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  const answered = useMemo(() => {
    const set = new Set<number>();
    for (const n of numbers) {
      const value = answers[idFor(n)];
      const filled = Array.isArray(value) ? value.length > 0 : Boolean(value);
      if (filled) set.add(n);
    }
    return set;
  }, [answers, numbers, idFor]);

  return { answers, setAnswer, current, jumpTo, answered, registerRef };
}
