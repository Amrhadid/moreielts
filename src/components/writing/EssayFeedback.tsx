import { useMemo, useState, type ReactNode } from "react";
import { BandRuler, bandDelta } from "~/components/ui/BandRuler";
import { Badge } from "~/components/ui/Badge";
import { Card, CardBody } from "~/components/ui/Card";
import { Icon } from "~/components/ui/Icon";
import { useAuth } from "~/lib/auth";
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
  /** The essay itself. When given, evidence quotes are highlighted inside it. */
  body?: string;
  className?: string;
}

function show(v: number | null | undefined) {
  return v === null || v === undefined ? "–" : formatBand(Number(v));
}

function Delta({ now, before }: { now: number | null | undefined; before: number | null | undefined }) {
  if (now == null || before == null) return null;
  const d = Number(now) - Number(before);
  if (d === 0) return <span className="text-xs text-muted">same as last draft</span>;
  return (
    <span className={cn("text-xs font-semibold", d > 0 ? "text-good" : "text-bad")}>
      {d > 0 ? "+" : "−"}
      {Math.abs(d).toFixed(1)} since last draft
    </span>
  );
}

/** The essay with each evidence quote wrapped in a mark numbered by criterion. */
function MarkedEssay({
  body,
  evidence,
  focus,
}: {
  body: string;
  evidence: Array<{ n: number; key: CriterionKey; quote: string }>;
  focus: CriterionKey | null;
}) {
  const parts = useMemo(() => {
    const lower = body.toLowerCase();
    const hits: Array<{ start: number; end: number; n: number; key: CriterionKey }> = [];
    for (const e of evidence) {
      const q = e.quote.trim().toLowerCase();
      if (q.length < 4) continue;
      const at = lower.indexOf(q);
      if (at < 0) continue;
      if (hits.some((h) => at < h.end && at + q.length > h.start)) continue;
      hits.push({ start: at, end: at + q.length, n: e.n, key: e.key });
    }
    hits.sort((a, b) => a.start - b.start);
    const out: ReactNode[] = [];
    let cursor = 0;
    hits.forEach((h, i) => {
      if (h.start > cursor) out.push(body.slice(cursor, h.start));
      out.push(
        <mark
          key={i}
          className={cn("transition-opacity", focus && focus !== h.key && "bg-transparent opacity-60")}
        >
          {body.slice(h.start, h.end)}
          <sup className="ms-0.5 font-sans text-[0.6rem] font-bold text-brand-600">{h.n}</sup>
        </mark>,
      );
      cursor = h.end;
    });
    if (cursor < body.length) out.push(body.slice(cursor));
    return out;
  }, [body, evidence, focus]);

  return <div className="prose-passage whitespace-pre-wrap text-[1rem]">{parts}</div>;
}

export function EssayFeedback(props: EssayFeedbackProps) {
  const { taskNumber, task_band, feedback: fb0, body, className } = props;
  const fb = fb0 ?? {};
  const prev = fb.previous;
  const { profile } = useAuth();
  const target = profile?.target_band ? Number(profile.target_band) : 7;
  const [openModel, setOpenModel] = useState(false);
  const [focus, setFocus] = useState<CriterionKey | null>(null);

  const criteria: Array<{ key: CriterionKey; label: string }> = [
    { key: "task_achievement", label: taskNumber === 1 ? "Task achievement" : "Task response" },
    { key: "coherence_cohesion", label: "Coherence and cohesion" },
    { key: "lexical_resource", label: "Lexical resource" },
    { key: "grammatical_range", label: "Grammatical range and accuracy" },
  ];

  const evidence = criteria.flatMap(({ key }, i) =>
    (fb[key]?.evidence ?? []).map((quote) => ({ n: i + 1, key, quote })),
  );
  const band = task_band == null ? null : Number(task_band);
  const delta = bandDelta(band, target);

  return (
    <div className={cn("grid gap-4", className)}>
      <Card>
        <CardBody className="grid gap-5 p-5 sm:grid-cols-[auto_1fr] sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">Task {taskNumber} band</p>
            <div className="mt-1 flex flex-wrap items-baseline gap-3">
              <span className="display tnum text-5xl leading-none">{show(task_band)}</span>
              <span className="display tnum text-lg text-muted">/ {formatBand(target)} target</span>
              {delta && <Badge tone={delta.tone}>{delta.label}</Badge>}
            </div>
            {prev && (
              <p className="mt-2">
                <Delta now={task_band} before={prev.task_band} />
              </p>
            )}
          </div>
          <div>
            <BandRuler band={band} target={target} ticks />
            {fb.summary && <p className="mt-4 text-sm leading-relaxed text-ink-soft">{fb.summary}</p>}
          </div>
        </CardBody>
      </Card>

      <div className={cn("grid gap-4", body && "lg:grid-cols-[1.15fr_1fr] lg:items-start")}>
        {body && (
          <Card>
            <CardBody className="p-5">
              <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
                <p className="text-sm font-semibold">Your essay</p>
                <p className="text-xs text-muted">
                  Numbered highlights are the examiner's evidence.{" "}
                  {focus && (
                    <button type="button" className="font-medium text-brand-600" onClick={() => setFocus(null)}>
                      Show all
                    </button>
                  )}
                </p>
              </div>
              <MarkedEssay body={body} evidence={evidence} focus={focus} />
            </CardBody>
          </Card>
        )}

        <div className="grid gap-3">
          {criteria.map(({ key, label }, i) => {
            const c = fb[key];
            const active = focus === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setFocus(active ? null : key)}
                aria-pressed={active}
                className={cn(
                  "rounded-card border bg-surface p-4 text-start transition-colors",
                  active ? "border-brand-600 shadow-[inset_3px_0_0_var(--color-brand-600)]" : "border-line hover:border-line-strong",
                )}
              >
                <div className="flex items-baseline justify-between gap-3">
                  <h4 className="text-sm font-semibold">
                    <sup className="me-1 text-[0.65rem] text-brand-600">{i + 1}</sup>
                    {label}
                  </h4>
                  <span className="display tnum text-xl">{show(props[key])}</span>
                </div>
                {prev && (
                  <p className="mt-0.5">
                    <Delta now={props[key]} before={prev[key]} />
                  </p>
                )}
                {c?.comment && <p className="mt-2 text-sm leading-relaxed text-ink-soft">{c.comment}</p>}
                {!body && c?.evidence?.length ? (
                  <ul className="mt-2 grid gap-1">
                    {c.evidence.map((e, j) => (
                      <li key={j} className="border-s-2 border-brand-200 ps-2 font-serif text-xs italic text-muted">
                        “{e}”
                      </li>
                    ))}
                  </ul>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      {fb.corrections?.length ? (
        <Card>
          <CardBody className="p-5">
            <h4 className="mb-3 text-sm font-semibold">Corrections</h4>
            <ul className="grid gap-3">
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
            <Icon name="chevronDown" size={16} className={cn("text-muted transition-transform", openModel && "rotate-180")} />
          </button>
          {openModel && (
            <CardBody className="border-t border-line p-5">
              <div className="prose-passage whitespace-pre-wrap text-[1rem]">{fb.model_answer}</div>
            </CardBody>
          )}
        </Card>
      )}
    </div>
  );
}
