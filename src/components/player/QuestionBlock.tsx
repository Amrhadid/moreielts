import { QuestionRenderer } from "~/components/renderers/QuestionRenderer";
import { Icon } from "~/components/ui/Icon";
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
  registerRef,
  flagged,
  onToggleFlag,
}: {
  group: ItemGroup;
  answers: AnswerSheet;
  onAnswer: (questionId: string, value: string | string[]) => void;
  current: number;
  registerRef: (n: number, el: HTMLDivElement | null) => void;
  /** Optional "flag for review" support. */
  flagged?: Set<number>;
  onToggleFlag?: (n: number) => void;
}) {
  return (
    <section className="mb-8">
      <div className="mb-4 rounded-lg border border-line bg-paper px-4 py-3">
        <p className="text-sm leading-relaxed text-ink-soft">{group.instructions}</p>
      </div>

      <div className="grid gap-5">
        {group.questions.map((q) => (
          <div
            key={q.id}
            ref={(el) => registerRef(q.number, el)}
            className={cn(
              "scroll-mt-24 rounded-card border p-4 shadow-[0_3px_12px_rgba(20,49,78,.035)] transition-all",
              q.number === current
                ? "border-brand-200 bg-brand-50/40"
                : "border-line bg-surface",
            )}
          >
            <div className="mb-2 flex items-baseline gap-2">
              <span className="text-sm font-semibold text-brand-700">{q.number}</span>
              <span className="text-[0.6875rem] uppercase tracking-wide text-muted">
                {q.typeLabel ?? q.type}
              </span>
              {onToggleFlag && (
                <button
                  type="button"
                  onClick={() => onToggleFlag(q.number)}
                  aria-pressed={flagged?.has(q.number) ?? false}
                  className={cn(
                    "ms-auto inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs transition-colors",
                    flagged?.has(q.number)
                      ? "bg-warn-soft text-warn"
                      : "text-muted hover:bg-paper",
                  )}
                >
                  <Icon name="flag" className="size-3.5" />
                  {flagged?.has(q.number) ? "Flagged" : "Flag for review"}
                </button>
              )}
            </div>
            <p className="mb-3 text-sm leading-relaxed">{q.prompt}</p>
            <QuestionRenderer
              question={q}
              value={answers[q.id]}
              onChange={(value) => onAnswer(q.id, value)}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
