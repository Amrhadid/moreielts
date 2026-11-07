import { Flag } from "lucide-react";
import { QuestionRenderer } from "~/components/renderers/QuestionRenderer";
import { cn } from "~/lib/cn";
import type { AnswerSheet, ItemGroup } from "~/types/content";

/**
 * One item group's shared instructions followed by its questions. Used by the
 * reading and listening players.
 */
export function QuestionBlock({
  group,
  answers,
  onAnswer,
  current,
  flagged,
  onToggleFlag,
  registerRef,
  onFocusQuestion,
}: {
  group: ItemGroup;
  answers: AnswerSheet;
  onAnswer: (questionId: string, value: string | string[]) => void;
  current: number;
  flagged: Set<number>;
  onToggleFlag: (n: number) => void;
  registerRef: (n: number, el: HTMLDivElement | null) => void;
  /** Called when the candidate interacts with a question, so it becomes current. */
  onFocusQuestion?: (n: number) => void;
}) {
  return (
    <section className="mb-6 grid gap-2.5">
      <div className="rounded-[0.5625rem] border border-line bg-surface px-3.5 py-2.5">
        <p className="text-[0.8125rem] leading-relaxed text-ink-soft">{group.instructions}</p>
      </div>

      {group.questions.map((q) => {
        const isCurrent = q.number === current;
        const isFlagged = flagged.has(q.number);
        return (
          <div
            key={q.id}
            ref={(el) => registerRef(q.number, el)}
            onFocusCapture={() => onFocusQuestion?.(q.number)}
            onPointerDownCapture={() => onFocusQuestion?.(q.number)}
            className={cn(
              "scroll-mt-20 rounded-[0.625rem] border bg-surface py-3.5 pl-[1.0625rem] pr-4 transition-colors",
              isCurrent
                ? "border-brand-600 shadow-[inset_3px_0_0_var(--color-brand-600)]"
                : "border-line",
            )}
          >
            <div className="mb-2 flex items-start gap-2.5">
              <span className="tnum pt-0.5 font-mono text-[0.8125rem] font-medium text-brand-600">
                {q.number}
              </span>
              <p className="flex-1 text-sm leading-relaxed">{q.prompt}</p>
              <button
                type="button"
                onClick={() => onToggleFlag(q.number)}
                aria-pressed={isFlagged}
                aria-label={isFlagged ? `Remove flag from question ${q.number}` : `Flag question ${q.number} for review`}
                className={cn(
                  "grid h-7 w-7 shrink-0 place-items-center rounded-md transition-colors",
                  isFlagged
                    ? "bg-warn-soft text-warn"
                    : "text-muted hover:bg-paper hover:text-ink",
                )}
              >
                <Flag
                  className="h-3.5 w-3.5"
                  strokeWidth={2}
                  fill={isFlagged ? "currentColor" : "none"}
                  aria-hidden
                />
              </button>
            </div>
            <QuestionRenderer
              question={q}
              value={answers[q.id]}
              onChange={(value) => onAnswer(q.id, value)}
            />
          </div>
        );
      })}
    </section>
  );
}
