import { Fragment, useMemo, useState, type ReactNode } from "react";
import { Card } from "~/components/ui/Card";
import { cn } from "~/lib/cn";
import { formatBand } from "~/lib/scoring";

export interface EvidenceCriterion {
  key: string;
  label: string;
  band: number | null | undefined;
  comment?: string;
  evidence?: string[];
}

interface Segment {
  text: string;
  /** 1-based criterion numbers whose evidence covers this segment. */
  marks: number[];
}

/**
 * Split the candidate's text into plain and highlighted segments. Each
 * evidence quote is located case-insensitively; a quote that is not found
 * verbatim is simply not drawn. Overlapping quotes share a segment.
 */
function segment(text: string, criteria: EvidenceCriterion[]): Segment[] {
  const lower = text.toLowerCase();
  const spans: Array<{ start: number; end: number; n: number }> = [];
  criteria.forEach((c, i) => {
    for (const quote of c.evidence ?? []) {
      const q = quote.trim().toLowerCase();
      if (q.length < 3) continue;
      const at = lower.indexOf(q);
      if (at >= 0) spans.push({ start: at, end: at + q.length, n: i + 1 });
    }
  });
  if (spans.length === 0) return [{ text, marks: [] }];

  const cuts = new Set<number>([0, text.length]);
  for (const s of spans) {
    cuts.add(s.start);
    cuts.add(s.end);
  }
  const points = [...cuts].sort((a, b) => a - b);
  const out: Segment[] = [];
  for (let i = 0; i < points.length - 1; i++) {
    const start = points[i];
    const end = points[i + 1];
    const marks = spans.filter((s) => s.start <= start && s.end >= end).map((s) => s.n);
    out.push({ text: text.slice(start, end), marks: [...new Set(marks)].sort() });
  }
  return out;
}

/**
 * The candidate's own text with the examiner's evidence highlighted and
 * numbered to the criterion it supports, beside the four criteria. Selecting
 * a criterion dims the other highlights.
 */
export function EvidenceEssay({
  title,
  meta,
  text,
  emptyText,
  criteria,
  extra,
}: {
  title: string;
  meta?: ReactNode;
  text: string | null | undefined;
  emptyText: string;
  criteria: EvidenceCriterion[];
  /** Rendered under the criteria list (corrections, delivery stats, rewrite). */
  extra?: ReactNode;
}) {
  const [active, setActive] = useState<number | null>(null);
  const segments = useMemo(() => (text ? segment(text, criteria) : []), [text, criteria]);
  const paragraphs = useMemo(() => {
    // Re-split segments by blank lines so paragraphs keep their shape.
    const paras: Segment[][] = [[]];
    for (const s of segments) {
      const parts = s.text.split(/\n{2,}/);
      parts.forEach((p, i) => {
        if (i > 0) paras.push([]);
        if (p) paras[paras.length - 1].push({ text: p, marks: s.marks });
      });
    }
    return paras.filter((p) => p.length);
  }, [segments]);

  return (
    <div className="grid items-start gap-5 lg:grid-cols-[1.15fr_1fr]">
      <Card className="p-5 sm:p-6">
        <div className="mb-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h3 className="font-semibold">{title}</h3>
          <div className="flex items-center gap-3 text-xs text-muted">
            {meta}
            {active !== null && (
              <button
                type="button"
                onClick={() => setActive(null)}
                className="font-semibold text-brand-600 hover:underline"
              >
                Show all evidence
              </button>
            )}
          </div>
        </div>
        {text ? (
          <div className="prose-passage text-[0.96rem] leading-[1.8]">
            {paragraphs.map((para, pi) => (
              <p key={pi}>
                {para.map((s, si) =>
                  s.marks.length ? (
                    <mark
                      key={si}
                      className={cn(
                        "transition-colors",
                        active !== null && !s.marks.includes(active) && "bg-transparent",
                      )}
                    >
                      {s.text}
                      {s.marks.map((n) => (
                        <sup
                          key={n}
                          className={cn(
                            "ms-0.5 font-sans text-[0.6rem] font-bold text-brand-600",
                            active !== null && active !== n && "opacity-40",
                          )}
                        >
                          {n}
                        </sup>
                      ))}
                    </mark>
                  ) : (
                    <Fragment key={si}>{s.text}</Fragment>
                  ),
                )}
              </p>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted">{emptyText}</p>
        )}
      </Card>

      <div className="grid gap-2.5">
        {criteria.map((c, i) => {
          const n = i + 1;
          const on = active === n;
          return (
            <button
              key={c.key}
              type="button"
              aria-pressed={on}
              onClick={() => setActive(on ? null : n)}
              className={cn(
                "rounded-card border bg-surface px-4 py-3.5 text-start transition-colors",
                on ? "border-brand-600" : "border-line hover:border-line-strong",
              )}
            >
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-sm font-semibold">
                  <sup className="me-1 text-[0.65rem] font-bold text-brand-600">{n}</sup>
                  {c.label}
                </span>
                <span className="display tnum text-xl">
                  {c.band === null || c.band === undefined ? "–" : formatBand(Number(c.band))}
                </span>
              </div>
              {c.comment && <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-muted">{c.comment}</p>}
            </button>
          );
        })}
        <p className="px-1 text-xs text-muted">Select a criterion to see only its evidence.</p>
        {extra}
      </div>
    </div>
  );
}
