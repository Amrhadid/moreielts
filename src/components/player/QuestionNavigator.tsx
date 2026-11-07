import { cn } from "~/lib/cn";

export interface NavigatorPart {
  label: string;
  numbers: number[];
}

/**
 * Bottom strip, grouped by part exactly as the computer-delivered test does.
 * Each square has four states: blank, answered, flagged, current. Clicking
 * jumps straight to a question.
 */
export function QuestionNavigator({
  parts,
  answered,
  flagged,
  current,
  onJump,
  lockedParts = [],
  onJumpPart,
}: {
  parts: NavigatorPart[];
  answered: Set<number>;
  flagged?: Set<number>;
  current: number;
  onJump: (n: number) => void;
  /** Indexes into `parts` that are drawn muted (played / not yet reached). */
  lockedParts?: number[];
  onJumpPart?: (index: number) => void;
}) {
  return (
    <nav aria-label="Questions" className="flex items-stretch border-t border-line bg-surface">
      <div className="thin-scroll flex min-w-0 flex-1 overflow-x-auto">
        {parts.map((part, index) => {
          const locked = lockedParts.includes(index);
          const done = part.numbers.filter((n) => answered.has(n)).length;
          const isCurrentPart = part.numbers.includes(current);
          return (
            <div
              key={part.label}
              className={cn(
                "flex shrink-0 items-center gap-3 border-e border-line px-3 py-2",
                isCurrentPart && "bg-paper",
              )}
            >
              <button
                type="button"
                onClick={() => onJumpPart?.(index)}
                className={cn(
                  "text-start text-xs font-semibold leading-tight",
                  locked ? "text-muted" : "text-ink-soft",
                  onJumpPart ? "hover:text-ink" : "cursor-default",
                )}
              >
                {part.label}
                <span className="tnum block text-[0.65rem] font-medium text-muted">
                  {done} of {part.numbers.length}
                </span>
              </button>
              <div className="flex gap-1">
                {part.numbers.map((n) => {
                  const isCurrent = n === current;
                  const isAnswered = answered.has(n);
                  const isFlagged = flagged?.has(n) ?? false;
                  return (
                    <button
                      key={n}
                      type="button"
                      onClick={() => onJump(n)}
                      aria-current={isCurrent ? "true" : undefined}
                      aria-label={`Question ${n}${isAnswered ? ", answered" : ", not answered"}${isFlagged ? ", flagged for review" : ""}`}
                      className={cn(
                        "tnum relative grid h-7 w-7 shrink-0 place-items-center rounded-md border font-mono text-[0.6875rem] font-medium transition-colors",
                        isAnswered
                          ? "border-brand-600 bg-brand-600 text-on-brand"
                          : "border-line-strong bg-surface text-ink-soft hover:bg-paper",
                        locked && !isAnswered && "border-line text-muted",
                        locked && isAnswered && "opacity-60",
                        isCurrent && "ring-2 ring-brand-600 ring-offset-1 ring-offset-surface",
                      )}
                    >
                      {n}
                      {isFlagged && (
                        <span
                          aria-hidden
                          className="absolute -end-1 -top-1 h-2 w-2 rounded-full border border-surface bg-warn"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      <div className="hidden shrink-0 items-center gap-3.5 px-4 text-[0.6875rem] text-muted sm:flex">
        <span className="flex items-center gap-1.5">
          <i className="h-2.5 w-2.5 rounded-[3px] border border-brand-600 bg-brand-600" aria-hidden />
          Answered
        </span>
        <span className="flex items-center gap-1.5">
          <i className="h-2.5 w-2.5 rounded-[3px] border border-line-strong bg-surface" aria-hidden />
          Blank
        </span>
        {flagged && (
          <span className="flex items-center gap-1.5">
            <i className="h-2.5 w-2.5 rounded-full bg-warn" aria-hidden />
            Flagged
          </span>
        )}
        <span className="flex items-center gap-1.5">
          <i className="h-2.5 w-2.5 rounded-[3px] border border-line-strong ring-2 ring-brand-600 ring-offset-1 ring-offset-surface" aria-hidden />
          Current
        </span>
      </div>
    </nav>
  );
}
