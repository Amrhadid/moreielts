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
  return (
    <div className="border-t border-line bg-surface">
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
        </div>
        <div className="thin-scroll flex flex-1 gap-1 overflow-x-auto pb-0.5">
          {numbers.map((n) => {
            const isCurrent = n === current;
            const isAnswered = answered.has(n);
            return (
              <button
                key={n}
                type="button"
                onClick={() => onJump(n)}
                aria-current={isCurrent ? "true" : undefined}
                aria-label={`Question ${n}${isAnswered ? ", answered" : ", not answered"}`}
                className={cn(
                  "h-8 w-8 shrink-0 rounded-md border text-xs font-medium transition-colors",
                  isCurrent && "ring-2 ring-brand-600 ring-offset-1",
                  isAnswered
                    ? "border-brand-600 bg-brand-600 text-white"
                    : "border-line-strong bg-surface text-ink-soft hover:bg-paper",
                )}
              >
                {n}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
