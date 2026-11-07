import { Badge } from "~/components/ui/Badge";
import { BandRuler, bandDelta } from "~/components/ui/BandRuler";
import { Card, CardBody, CardHeader } from "~/components/ui/Card";
import { useAuth } from "~/lib/auth";
import { formatBand } from "~/lib/band";
import type { CriterionFeedback } from "~/lib/practice/grading";

/**
 * The band breakdown shared by Writing and Speaking practice: the overall
 * band against the learner's target, one row per criterion with the
 * examiner's comment and the verbatim evidence it rests on, and the single
 * highest-value improvement.
 */
export function BandResultCard<K extends string>({
  heading,
  band,
  criteria,
  labels,
  feedback,
  meta,
}: {
  heading: string;
  band: number;
  criteria: Record<K, number>;
  labels: ReadonlyArray<{ key: K; label: string }>;
  feedback: Record<K, CriterionFeedback> & { summary: string };
  meta?: string;
}) {
  const { profile } = useAuth();
  const target = profile?.target_band ? Number(profile.target_band) : 7;
  const delta = bandDelta(band, target);

  return (
    <Card className="animate-rise">
      <CardHeader className="grid gap-5 sm:grid-cols-[auto_1fr] sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">{heading}</p>
          <div className="mt-1 flex items-baseline gap-3">
            <span className="display tnum text-5xl leading-none">{formatBand(band)}</span>
            <span className="display tnum text-lg text-muted">/ {formatBand(target)} target</span>
            {delta && <Badge tone={delta.tone}>{delta.label}</Badge>}
          </div>
          {meta && <p className="mt-2 text-xs text-muted">{meta}</p>}
        </div>
        <BandRuler band={band} target={target} ticks className="sm:pb-1" />
      </CardHeader>
      <CardBody className="grid gap-3">
        {labels.map(({ key, label }) => {
          const value = criteria[key];
          const fb = feedback[key];
          return (
            <div key={key} className="rounded-[0.625rem] border border-line p-4">
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm font-semibold">{label}</p>
                <span className="display tnum text-xl">{formatBand(value)}</span>
              </div>
              <BandRuler band={value} target={target} className="mt-3" />
              {fb.comment && (
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">{fb.comment}</p>
              )}
              {fb.evidence.length > 0 && (
                <ul className="mt-2 grid gap-1.5">
                  {fb.evidence.map((quote, i) => (
                    <li
                      key={i}
                      className="border-s-2 border-brand-200 ps-3 font-serif text-sm italic text-muted"
                    >
                      “{quote}”
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
        {feedback.summary && (
          <div className="rounded-[0.625rem] border border-brand-200 bg-brand-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-brand-700">
              Work on this first
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-ink">{feedback.summary}</p>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
