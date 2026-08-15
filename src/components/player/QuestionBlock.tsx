import { QuestionRenderer } from "~/components/renderers/QuestionRenderer";
import { getQuestionType } from "~/registry/questionTypes";
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
}: {
  group: ItemGroup;
  answers: AnswerSheet;
  onAnswer: (questionId: string, value: string | string[]) => void;
  current: number;
  registerRef: (n: number, el: HTMLDivElement | null) => void;
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
              "scroll-mt-24 rounded-card border p-4 transition-colors",
              q.number === current
                ? "border-brand-200 bg-brand-50/40"
                : "border-line bg-surface",
            )}
          >
            <div className="mb-2 flex items-baseline gap-2">
              <span className="text-sm font-semibold text-brand-700">{q.number}</span>
              <span className="text-[0.6875rem] uppercase tracking-wide text-muted">
                {getQuestionType(q.type).label}
              </span>
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
