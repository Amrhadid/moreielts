import { Badge } from "~/components/ui/Badge";
import { Card, CardBody, CardHeader, CardTitle } from "~/components/ui/Card";
import { Progress } from "~/components/ui/Progress";
import { bandTone, formatBand } from "~/lib/band";
import type { CriterionFeedback } from "~/lib/practice/grading";

/**
 * The band breakdown shared by Writing and Speaking practice: the overall
 * band, one row per criterion with the examiner's comment and the verbatim
 * evidence it rests on, and the single highest-value improvement.
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
  const tone = bandTone(band);
  return (
    <Card className="animate-rise">
      <CardHeader className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">{heading}</p>
          <CardTitle className="mt-1 text-lg">Estimated band</CardTitle>
          {meta && <p className="mt-1 text-xs text-muted">{meta}</p>}
        </div>
        <div className="text-right">
          <p
            className={
              "text-5xl font-semibold tabular-nums tracking-tight " +
              (tone === "good" ? "text-good" : tone === "warn" ? "text-warn" : "text-bad")
            }
          >
            {formatBand(band)}
          </p>
          <p className="text-xs text-muted">mean of the four criteria</p>
        </div>
      </CardHeader>
      <CardBody className="grid gap-4">
        {labels.map(({ key, label }) => {
          const value = criteria[key];
          const fb = feedback[key];
          return (
            <div key={key} className="rounded-xl border border-line bg-paper/60 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold">{label}</p>
                <Badge tone={bandTone(value)}>{formatBand(value)}</Badge>
              </div>
              <Progress
                value={(value / 9) * 100}
                tone={bandTone(value) === "good" ? "good" : "brand"}
                className="mt-2"
              />
              {fb.comment && (
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">{fb.comment}</p>
              )}
              {fb.evidence.length > 0 && (
                <ul className="mt-2 grid gap-1.5">
                  {fb.evidence.map((quote, i) => (
                    <li
                      key={i}
                      className="border-l-2 border-brand-200 pl-3 font-serif text-sm italic text-muted"
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
          <div className="rounded-xl border border-brand-100 bg-brand-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">
              Work on this first
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-ink">{feedback.summary}</p>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
