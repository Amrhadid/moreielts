import { useState } from "react";
import { cn } from "~/lib/cn";

/**
 * Bottom strip: every question in the section, showing answered / unanswered /
 * current. Clicking jumps straight to a question.
 */
export function QuestionNavigator({
  numbers,
  answered,
  current,
  onJump,
}: {
  numbers: number[];
  answered: Set<number>;
  current: number;
  onJump: (n: number) => void;
}) {
  const [reviewed, setReviewed] = useState<Set<number>>(() => new Set());

  function toggleReview() {
    setReviewed((previous) => {
      const next = new Set(previous);
      next.has(current) ? next.delete(current) : next.add(current);
      return next;
    });
  }

  return (
    <div className="border-t border-line bg-surface/95 shadow-[0_-6px_24px_rgba(20,49,78,.05)] backdrop-blur">
      <div className="flex items-center gap-3 px-3 py-2.5 sm:px-5">
        <div className="hidden shrink-0 items-center gap-3 text-xs text-muted sm:flex">
          <span className="flex items-center gap-1.5">
            <i className="h-2.5 w-2.5 rounded-sm bg-brand-600" aria-hidden />
            Answered
          </span>
          <span className="flex items-center gap-1.5">
            <i className="h-2.5 w-2.5 rounded-sm border border-line-strong bg-surface" aria-hidden />
            Blank
          </span>
          <span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-sm border border-warn bg-warn-soft" aria-hidden />Review</span>
        </div>
        <div className="thin-scroll flex flex-1 gap-1 overflow-x-auto pb-0.5">
          {numbers.map((n) => {
            const isCurrent = n === current;
            const isAnswered = answered.has(n);
            const isReviewed = reviewed.has(n);
            return (
              <button
                key={n}
                type="button"
                onClick={() => onJump(n)}
                aria-current={isCurrent ? "true" : undefined}
                aria-label={`Question ${n}${isAnswered ? ", answered" : ", not answered"}${isReviewed ? ", marked for review" : ""}`}
                className={cn(
                  "h-9 w-9 shrink-0 rounded-lg border text-xs font-semibold transition-all hover:-translate-y-0.5",
                  isCurrent && "ring-2 ring-brand-600 ring-offset-1",
                  isReviewed && !isCurrent && "border-warn bg-warn-soft text-warn",
                  isAnswered
                    ? "border-brand-600 bg-brand-600 text-white"
                    : !isReviewed && "border-line-strong bg-surface text-ink-soft hover:bg-paper",
                )}
              >
                {n}
              </button>
            );
          })}
        </div>
        <button type="button" onClick={toggleReview} aria-pressed={reviewed.has(current)} className="shrink-0 rounded-md border border-line-strong px-2.5 py-1.5 text-xs font-medium text-ink-soft hover:bg-paper">
          {reviewed.has(current) ? "◆ Review" : "◇ Review"}
        </button>
      </div>
    </div>
  );
}
