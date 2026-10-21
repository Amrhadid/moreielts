import { useState } from "react";
import { Card, CardBody } from "~/components/ui/Card";
import { Icon } from "~/components/ui/Icon";
import { cn } from "~/lib/cn";
import { formatBand } from "~/lib/scoring";
import type { WritingFeedback } from "~/lib/practice-queries";

type CriterionKey = "task_achievement" | "coherence_cohesion" | "lexical_resource" | "grammatical_range";

export interface EssayFeedbackProps {
  taskNumber: 1 | 2;
  task_band: number | null;
  task_achievement: number | null;
  coherence_cohesion: number | null;
  lexical_resource: number | null;
  grammatical_range: number | null;
  feedback: WritingFeedback | null | undefined;
  className?: string;
}

function show(v: number | null | undefined) {
  return v === null || v === undefined ? "–" : formatBand(Number(v));
}

function Delta({ now, before }: { now: number | null | undefined; before: number | null | undefined }) {
  if (now == null || before == null) return null;
  const d = Number(now) - Number(before);
  if (d === 0) return <span className="text-xs text-muted">= {formatBand(Number(before))}</span>;
  return (
    <span className={cn("text-xs font-semibold", d > 0 ? "text-good" : "text-bad")}>
      {d > 0 ? "▲" : "▼"} {Math.abs(d).toFixed(1)}
    </span>
  );
}

export function EssayFeedback(props: EssayFeedbackProps) {
  const { taskNumber, task_band, feedback: fb0, className } = props;
  const fb = fb0 ?? {};
  const prev = fb.previous;
  const [openModel, setOpenModel] = useState(false);

  const criteria: Array<{ key: CriterionKey; label: string }> = [
    { key: "task_achievement", label: taskNumber === 1 ? "Task achievement" : "Task response" },
    { key: "coherence_cohesion", label: "Coherence & cohesion" },
    { key: "lexical_resource", label: "Lexical resource" },
    { key: "grammatical_range", label: "Grammatical range & accuracy" },
  ];

  return (
    <div className={cn("space-y-4", className)}>
      <Card>
        <CardBody className="flex flex-wrap items-center gap-5 p-5">
          <div className="text-center">
            <div className="text-xs font-medium uppercase tracking-wide text-muted">Task {taskNumber} band</div>
            <div className="text-5xl font-bold tracking-tight text-brand-700">{show(task_band)}</div>
            {prev && <Delta now={task_band} before={prev.task_band} />}
          </div>
          {fb.summary && <p className="min-w-0 flex-1 text-sm leading-relaxed text-ink-soft">{fb.summary}</p>}
        </CardBody>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2">
        {criteria.map(({ key, label }) => {
          const c = fb[key];
          return (
            <Card key={key}>
              <CardBody className="p-4">
                <div className="flex items-baseline justify-between gap-2">
                  <h4 className="text-sm font-semibold">{label}</h4>
                  <div className="flex items-baseline gap-2">
                    {prev && <Delta now={props[key]} before={prev[key]} />}
                    <span className="text-xl font-bold text-ink">{show(props[key])}</span>
                  </div>
                </div>
                {c?.comment && <p className="mt-2 text-sm text-ink-soft">{c.comment}</p>}
                {c?.evidence?.length ? (
                  <ul className="mt-2 space-y-1">
                    {c.evidence.map((e, i) => (
                      <li key={i} className="border-s-2 border-brand-100 ps-2 text-xs italic text-muted">
                        “{e}”
                      </li>
                    ))}
                  </ul>
                ) : null}
              </CardBody>
            </Card>
          );
        })}
      </div>

      {fb.corrections?.length ? (
        <Card>
          <CardBody className="p-4">
            <h4 className="mb-3 text-sm font-semibold">Corrections</h4>
            <ul className="space-y-3">
              {fb.corrections.map((c, i) => (
                <li key={i} className="text-sm">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-bad line-through decoration-bad">{c.original}</span>
                    <Icon name="arrowRight" size={14} className="text-muted rtl:rotate-180" />
                    <span className="font-medium text-good">{c.corrected}</span>
                  </div>
                  {c.why && <p className="mt-0.5 text-xs text-muted">{c.why}</p>}
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      ) : null}

      {fb.model_answer && (
        <Card>
          <button
            type="button"
            onClick={() => setOpenModel((o) => !o)}
            className="flex w-full items-center justify-between p-4 text-start text-sm font-semibold"
            aria-expanded={openModel}
          >
            <span className="flex items-center gap-2">
              <Icon name="sparkles" size={16} /> Band +1 rewrite
            </span>
            <span className="text-muted">{openModel ? "−" : "+"}</span>
          </button>
          {openModel && (
            <CardBody className="whitespace-pre-wrap border-t border-line p-4 text-sm leading-relaxed">
              {fb.model_answer}
            </CardBody>
          )}
        </Card>
      )}
    </div>
  );
}
