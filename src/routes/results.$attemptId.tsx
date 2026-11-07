import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { Fragment, useMemo, useState } from "react";
import { AppShell, PageHeader } from "~/components/layout/AppShell";
import { Badge } from "~/components/ui/Badge";
import { BandRuler, bandDelta } from "~/components/ui/BandRuler";
import { Button } from "~/components/ui/Button";
import { Card, CardBody, CardHeader, CardTitle } from "~/components/ui/Card";
import { EmptyState, Skeleton } from "~/components/ui/EmptyState";
import { Progress } from "~/components/ui/Progress";
import { SectionIcon } from "~/components/ui/SectionIcon";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/Tabs";
import { cn } from "~/lib/cn";
import { Protected, useAuth } from "~/lib/auth";
import { useAttemptResult, useAttemptReview, useAttempts } from "~/lib/queries";
import { formatBand, tallyBy } from "~/lib/scoring";
import { SECTIONS } from "~/lib/sections";
import type { SectionCode } from "~/types/content";
import type {
  AttemptReviewRow,
  CriterionFeedback,
  SpeakingScoreRow,
  WritingScoreRow,
} from "~/types/database";

export const Route = createFileRoute("/results/$attemptId")({ component: ResultRoute });

function ResultRoute() {
  return (
    <Protected>
      <ResultPage />
    </Protected>
  );
}

const num = (v: number | null | undefined) =>
  v === null || v === undefined ? null : Number(v);

function longDate(iso: string | null | undefined) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function shortDate(iso: string | null | undefined) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long" });
}

/* ------------------------------------------------------------------ *
 * Listening and Reading
 * ------------------------------------------------------------------ */

function AccuracyList({ rows }: { rows: Array<{ key: string; correct: number; total: number }> }) {
  if (rows.length === 0) {
    return <p className="text-sm text-muted">No questions answered in this section.</p>;
  }
  return (
    <ul className="grid gap-3">
      {rows.map((row) => {
        const pct = row.total ? (row.correct / row.total) * 100 : 0;
        return (
          <li key={row.key}>
            <div className="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
              <span className="min-w-0 truncate">{row.key}</span>
              <span className="tnum shrink-0 font-mono text-xs text-muted">
                {row.correct}/{row.total}
              </span>
            </div>
            <Progress value={pct} tone={pct >= 70 ? "good" : "brand"} label={`${row.key} accuracy`} />
          </li>
        );
      })}
    </ul>
  );
}

function ObjectivePanel({
  section,
  raw,
  band,
  review,
}: {
  section: "listening" | "reading";
  raw: number | null;
  band: number | null;
  review: AttemptReviewRow[];
}) {
  const rows = review
    .filter((r) => r.section === section)
    .map((r) => ({
      questionId: r.question_id,
      typeCode: r.type_label,
      partNumber: r.part_number,
      isCorrect: r.is_correct === true,
    }));
  const partLabel = section === "reading" ? "Passage" : "Part";

  return (
    <div className="grid items-start gap-4 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Raw score</CardTitle>
        </CardHeader>
        <CardBody>
          <p className="display tnum text-[2.5rem] leading-none">
            {raw ?? "—"}
            <span className="ml-1 font-sans text-lg font-medium text-muted"> / 40</span>
          </p>
          <p className="mt-3 text-sm text-muted">
            {band !== null
              ? `Converted to band ${formatBand(band)} for this test form.`
              : "Not scored yet."}
          </p>
        </CardBody>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Accuracy by {partLabel.toLowerCase()}</CardTitle>
        </CardHeader>
        <CardBody>
          <AccuracyList rows={tallyBy(rows, (r) => `${partLabel} ${r.partNumber}`)} />
        </CardBody>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Accuracy by question type</CardTitle>
        </CardHeader>
        <CardBody>
          <AccuracyList rows={tallyBy(rows, (r) => r.typeCode)} />
        </CardBody>
      </Card>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Writing and Speaking: criteria with evidence located in the text
 * ------------------------------------------------------------------ */

const WRITING_CRITERIA: Array<[keyof WritingScoreRow, string]> = [
  ["task_achievement", "Task achievement / response"],
  ["coherence_cohesion", "Coherence and cohesion"],
  ["lexical_resource", "Lexical resource"],
  ["grammatical_range", "Grammatical range and accuracy"],
];

const SPEAKING_CRITERIA: Array<[keyof SpeakingScoreRow, string]> = [
  ["fluency_coherence", "Fluency and coherence"],
  ["lexical_resource", "Lexical resource"],
  ["grammatical_range", "Grammatical range and accuracy"],
  ["pronunciation", "Pronunciation"],
];

function feedbackFor(
  row: Record<string, unknown>,
  key: string,
): CriterionFeedback | null {
  const fb = (row.feedback as Record<string, CriterionFeedback | string> | undefined)?.[key];
  if (!fb) return null;
  if (typeof fb === "string") return { comment: fb };
  return fb;
}

interface Segment {
  text: string;
  /** 1-based criterion index when this segment is an evidence quote. */
  criterion?: number;
}

/**
 * Locate every evidence quote in the candidate's own text and split it into
 * plain and marked segments. First match wins; a quote that overlaps one
 * already marked is skipped rather than nested.
 */
function segmentText(
  text: string,
  criteria: Array<{ index: number; evidence: string[] }>,
): Segment[] {
  const lower = text.toLowerCase();
  const found: Array<{ start: number; end: number; criterion: number }> = [];
  for (const { index, evidence } of criteria) {
    for (const quote of evidence) {
      const q = quote.trim().toLowerCase();
      if (q.length < 3) continue;
      const start = lower.indexOf(q);
      if (start < 0) continue;
      const end = start + q.length;
      if (found.some((f) => start < f.end && end > f.start)) continue;
      found.push({ start, end, criterion: index });
    }
  }
  found.sort((a, b) => a.start - b.start);
  const segments: Segment[] = [];
  let cursor = 0;
  for (const f of found) {
    if (f.start > cursor) segments.push({ text: text.slice(cursor, f.start) });
    segments.push({ text: text.slice(f.start, f.end), criterion: f.criterion });
    cursor = f.end;
  }
  if (cursor < text.length) segments.push({ text: text.slice(cursor) });
  return segments;
}

function CandidateText({
  text,
  segments,
  active,
}: {
  text: string;
  segments: Segment[];
  active: number | null;
}) {
  const paragraphs = useMemo(() => {
    // Re-split the segmented stream on blank lines so paragraphs survive.
    const out: Segment[][] = [[]];
    for (const seg of segments) {
      const parts = seg.text.split(/\n\s*\n/);
      parts.forEach((part, i) => {
        if (i > 0) out.push([]);
        if (part) out[out.length - 1].push({ text: part, criterion: seg.criterion });
      });
    }
    return out.filter((p) => p.length > 0);
  }, [segments]);

  if (!text.trim()) return null;

  return (
    <div className="prose-passage text-[0.98rem]">
      {paragraphs.map((para, i) => (
        <p key={i} className="whitespace-pre-line">
          {para.map((seg, j) =>
            seg.criterion ? (
              <mark
                key={j}
                data-criterion={seg.criterion}
                className={cn(
                  "transition-opacity",
                  active !== null && active !== seg.criterion && "bg-transparent opacity-60",
                )}
              >
                {seg.text}
                <sup className="ml-0.5 font-sans text-[0.6rem] font-bold text-brand-700">
                  {seg.criterion}
                </sup>
              </mark>
            ) : (
              <Fragment key={j}>{seg.text}</Fragment>
            ),
          )}
        </p>
      ))}
    </div>
  );
}

function CriteriaPanel({
  rows,
  criteria,
  emptyMessage,
  labelFor,
  textFor,
  wordsFor,
}: {
  rows: Array<Record<string, unknown>>;
  criteria: Array<[string, string]>;
  emptyMessage: string;
  labelFor: (row: Record<string, unknown>) => string;
  /** The candidate's own text for this task or part, when kept. */
  textFor: (row: Record<string, unknown>) => string | null;
  wordsFor?: (text: string) => number;
}) {
  const [active, setActive] = useState<Record<number, number | null>>({});

  if (rows.length === 0) {
    return <EmptyState title={emptyMessage} />;
  }

  return (
    <div className="grid gap-8">
      {rows.map((row, i) => {
        const text = textFor(row);
        const bandKey = "task_band" in row ? "task_band" : "part_band";
        const rowBand = num(row[bandKey] as number | null);
        const segments = text
          ? segmentText(
              text,
              criteria.map(([key], idx) => ({
                index: idx + 1,
                evidence: feedbackFor(row, key)?.evidence ?? [],
              })),
            )
          : [];
        const current = active[i] ?? null;
        const words = text && wordsFor ? wordsFor(text) : null;

        return (
          <section key={i} aria-label={labelFor(row)}>
            <div className={cn("grid items-start gap-5", text && "lg:grid-cols-[1.15fr_1fr]")}>
              {text && (
                <Card>
                  <CardBody className="pt-5">
                    <div className="mb-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                      <p className="font-semibold">{labelFor(row)} · Your {bandKey === "task_band" ? "response" : "transcript"}</p>
                      <p className="text-xs text-muted">
                        {words !== null ? `${words} words · ` : ""}
                        {rowBand !== null ? `band ${formatBand(rowBand)}` : "not banded"}
                        {current !== null && (
                          <>
                            {" · "}
                            <button
                              type="button"
                              className="font-medium text-brand-700 hover:underline"
                              onClick={() => setActive((a) => ({ ...a, [i]: null }))}
                            >
                              show all evidence
                            </button>
                          </>
                        )}
                      </p>
                    </div>
                    <CandidateText text={text} segments={segments} active={current} />
                  </CardBody>
                </Card>
              )}

              <div className="grid gap-2.5">
                {!text && (
                  <div className="mb-1 flex items-baseline justify-between gap-3">
                    <p className="font-semibold">{labelFor(row)}</p>
                    {rowBand !== null && (
                      <p className="text-xs text-muted">band {formatBand(rowBand)}</p>
                    )}
                  </div>
                )}
                <div className={cn("grid gap-2.5", !text && "sm:grid-cols-2")}>
                  {criteria.map(([key, label], idx) => {
                    const band = num(row[key] as number | null);
                    const fb = feedbackFor(row, key);
                    const n = idx + 1;
                    const selected = current === n;
                    const selectable = Boolean(text) && (fb?.evidence?.length ?? 0) > 0;
                    const inner = (
                      <>
                        <div className="flex items-baseline justify-between gap-3">
                          <span className="text-sm font-semibold">
                            {text && (
                              <sup className="mr-1 text-[0.6rem] font-bold text-brand-700">{n}</sup>
                            )}
                            {label}
                          </span>
                          <span className="display tnum text-xl">
                            {band !== null ? formatBand(band) : "—"}
                          </span>
                        </div>
                        <p className="mt-1 text-[0.8125rem] leading-relaxed text-muted">
                          {fb?.comment ?? "No feedback recorded."}
                        </p>
                      </>
                    );
                    return selectable ? (
                      <button
                        key={key}
                        type="button"
                        aria-pressed={selected}
                        onClick={() =>
                          setActive((a) => ({ ...a, [i]: selected ? null : n }))
                        }
                        className={cn(
                          "rounded-card border bg-surface px-4 py-3.5 text-left transition-colors hover:border-brand-500",
                          selected ? "border-brand-600 bg-brand-50/40" : "border-line",
                        )}
                      >
                        {inner}
                      </button>
                    ) : (
                      <Card key={key} className="px-4 py-3.5">
                        {inner}
                      </Card>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        );
      })}
      {rows.some((row) => textFor(row)) && (
        <p className="-mt-3 text-xs text-muted">Select a criterion to see only its evidence.</p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Answer review
 * ------------------------------------------------------------------ */

function ReviewPanel({ rows, submitted }: { rows: AttemptReviewRow[]; submitted: boolean }) {
  const [filter, setFilter] = useState<string>("all");

  const objective = useMemo(
    () => rows.filter((r) => r.section === "listening" || r.section === "reading"),
    [rows],
  );
  const wrong = objective.filter((r) => r.is_correct !== true);
  const types = useMemo(() => {
    const seen = new Map<string, string>();
    for (const r of objective) if (!seen.has(r.type_code)) seen.set(r.type_code, r.type_label);
    return [...seen.entries()];
  }, [objective]);

  const visible = objective.filter((r) =>
    filter === "all" ? true : filter === "wrong" ? r.is_correct !== true : r.type_code === filter,
  );

  if (!submitted) {
    return (
      <EmptyState
        title="Answers are released once the attempt is submitted."
        body="Finish every section and submit, and the full answer review appears here."
      />
    );
  }

  if (objective.length === 0) {
    return <EmptyState title="No Listening or Reading answers to review in this attempt." />;
  }

  const chip = (value: string, label: string) => (
    <button
      key={value}
      type="button"
      aria-pressed={filter === value}
      onClick={() => setFilter(value)}
      className={cn(
        "h-8 rounded-full border px-3 text-xs font-semibold transition-colors",
        filter === value
          ? "border-brand-600 bg-brand-600 text-on-brand"
          : "border-line bg-surface text-ink-soft hover:border-line-strong",
      )}
    >
      {label}
    </button>
  );

  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-1.5">
        {chip("all", `All ${objective.length}`)}
        {chip("wrong", `Incorrect ${wrong.length}`)}
        {types.map(([code, label]) => chip(code, label))}
      </div>

      {visible.length === 0 ? (
        <EmptyState title="Nothing matches this filter." />
      ) : (
        <ol className="grid gap-2">
          {visible.map((row) => {
            const ok = row.is_correct === true;
            const prefix = row.section === "listening" ? "L" : "R";
            return (
              <li
                key={row.question_id}
                className="grid gap-x-4 gap-y-1.5 rounded-card border border-line bg-surface px-4 py-3 text-sm md:grid-cols-[2.5rem_minmax(0,1.6fr)_minmax(0,1fr)_minmax(0,1fr)_auto] md:items-center"
              >
                <span className="tnum font-mono text-xs text-muted">
                  {prefix}
                  {row.order_index}
                </span>
                <div className="min-w-0">
                  <span className="block text-[0.65rem] font-semibold uppercase tracking-wider text-muted md:hidden">
                    Question
                  </span>
                  <p className="line-clamp-2 leading-relaxed">{row.prompt}</p>
                </div>
                <div className="min-w-0">
                  <span className="block text-[0.65rem] font-semibold uppercase tracking-wider text-muted md:hidden">
                    Your answer
                  </span>
                  <p className={cn("break-words font-semibold", ok ? "text-good" : "text-bad")}>
                    {row.user_answer || "—"}
                  </p>
                </div>
                <div className="min-w-0">
                  <span className="block text-[0.65rem] font-semibold uppercase tracking-wider text-muted md:hidden">
                    Accepted
                  </span>
                  <p className="break-words text-ink-soft">{row.accepted_answers?.join(" / ")}</p>
                </div>
                <div className="mt-1 flex flex-wrap items-center justify-start gap-2 md:mt-0 md:justify-end">
                  <Badge tone={ok ? "good" : "bad"}>{ok ? "Correct" : "Incorrect"}</Badge>
                  {!ok && (
                    <Button asChild variant="outline" size="sm">
                      <Link
                        to="/practice"
                        search={{ section: row.section as SectionCode, type: row.type_code }}
                      >
                        Practise this type
                      </Link>
                    </Button>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Page
 * ------------------------------------------------------------------ */

function LoadingResult() {
  return (
    <AppShell wide>
      <div role="status" aria-label="Loading your result">
        <Skeleton className="mb-2 h-3 w-32" />
        <Skeleton className="mb-7 h-9 w-72" />
        <div className="grid gap-4 lg:grid-cols-[20rem_minmax(0,1fr)]">
          <Skeleton className="h-52 rounded-card" />
          <Skeleton className="h-52 rounded-card" />
        </div>
        <Skeleton className="mt-8 h-10 w-full max-w-md" />
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          <Skeleton className="h-40 rounded-card" />
          <Skeleton className="h-40 rounded-card" />
          <Skeleton className="h-40 rounded-card" />
        </div>
      </div>
    </AppShell>
  );
}

function countWords(text: string) {
  return (text.trim().match(/\S+/g) ?? []).length;
}

function ResultPage() {
  const { attemptId } = useParams({ from: "/results/$attemptId" });
  const { profile, user } = useAuth();
  const { data, isLoading } = useAttemptResult(attemptId);
  const { data: attempts } = useAttempts(user?.id);

  const submitted = data?.attempt.status === "completed";
  const { data: review } = useAttemptReview(attemptId, submitted);

  if (isLoading) return <LoadingResult />;

  if (!data) {
    return (
      <AppShell wide>
        <EmptyState
          title="That result could not be found."
          body="It may belong to another account, or the link may be out of date."
          action={
            <Button asChild variant="outline">
              <Link to="/results">All results</Link>
            </Button>
          }
        />
      </AppShell>
    );
  }

  const scores = data.scores;
  const target = profile?.target_band ? Number(profile.target_band) : 7;
  const overall = num(scores?.overall_band);

  const bands: Record<SectionCode, number | null> = {
    listening: num(scores?.listening_band),
    reading: num(scores?.reading_band),
    writing: num(scores?.writing_band),
    speaking: num(scores?.speaking_band),
  };

  // Change since the previous completed mock.
  const previous = (attempts ?? [])
    .filter(
      (a) =>
        a.id !== data.attempt.id &&
        a.status === "completed" &&
        a.attempt_scores?.overall_band != null &&
        new Date(a.submitted_at ?? a.started_at) <
          new Date(data.attempt.submitted_at ?? data.attempt.started_at),
    )
    .sort(
      (a, b) =>
        new Date(b.submitted_at ?? b.started_at).getTime() -
        new Date(a.submitted_at ?? a.started_at).getTime(),
    )[0];
  const previousBand = previous ? num(previous.attempt_scores?.overall_band) : null;
  const change =
    overall !== null && previousBand !== null
      ? Math.round((overall - previousBand) * 2) / 2
      : null;

  const firstBanded =
    (SECTIONS.find((s) => bands[s.code] !== null)?.code as string | undefined) ?? "review";

  const reviewRows = review ?? [];
  const writingText = (row: Record<string, unknown>) => {
    const task = row.task_number as number;
    const match = reviewRows.find((r) => r.section === "writing" && r.part_number === task);
    return match?.user_answer?.trim() ? match.user_answer : null;
  };
  const speakingText = (row: Record<string, unknown>) => {
    const t = row.transcript as string | null | undefined;
    return t && t.trim() ? t : null;
  };

  const completedOn = longDate(data.attempt.submitted_at);

  return (
    <AppShell wide>
      <PageHeader
        eyebrow={completedOn ? `Results · ${completedOn}` : "Results · not yet submitted"}
        title={
          <span className="inline-flex flex-wrap items-center gap-x-3 gap-y-1">
            {data.attempt.test_forms?.title ?? "Test result"}
            <Badge tone="brand" className="relative -top-0.5 capitalize">
              {(data.attempt.test_forms?.variant ?? "").replace("_", " ")}
            </Badge>
            {!submitted && (
              <Badge tone="warn" className="relative -top-0.5">
                Awaiting speaking
              </Badge>
            )}
          </span>
        }
        action={
          <Button asChild variant="outline">
            <Link to="/practice">Practise your weakest types</Link>
          </Button>
        }
      />

      {/* Overall and section bands */}
      <div className="grid gap-4 lg:grid-cols-[20rem_minmax(0,1fr)]">
        <Card>
          <CardBody className="pt-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">
              Overall band
            </p>
            <div className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="display tnum text-[4.5rem] leading-none">
                {overall !== null ? formatBand(overall) : "—"}
              </span>
              <span className="display tnum text-xl text-muted">
                / {formatBand(target)} target
              </span>
            </div>
            <div className="mt-3">
              {change !== null ? (
                <Badge tone={change > 0 ? "good" : change < 0 ? "warn" : "neutral"}>
                  {change > 0 ? `+${formatBand(change)}` : change < 0 ? `−${formatBand(Math.abs(change))}` : "No change"}
                  {" since "}
                  {shortDate(previous?.submitted_at ?? previous?.started_at)}
                </Badge>
              ) : (
                <Badge tone="neutral">First mock</Badge>
              )}
            </div>
            <p className="mt-4 text-xs leading-relaxed text-muted">
              Mean of the four component bands, rounded to the nearest half.
              {scores?.overall_unrounded
                ? ` Unrounded ${Number(scores.overall_unrounded).toFixed(2)}.`
                : ""}{" "}
              AI estimate, not an official IELTS result.
            </p>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="grid content-center gap-5 pt-6">
            {SECTIONS.map((s) => {
              const band = bands[s.code];
              const delta = bandDelta(band, target);
              return (
                <div
                  key={s.code}
                  className="grid grid-cols-[7rem_minmax(0,1fr)_3rem] items-center gap-3 sm:grid-cols-[8.5rem_minmax(0,1fr)_4.5rem_3rem] sm:gap-4"
                >
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <SectionIcon code={s.code} size="sm" />
                    {s.label}
                  </div>
                  <BandRuler band={band} target={target} />
                  <span className="hidden justify-self-end sm:block">
                    {delta && <Badge tone={delta.tone}>{delta.label}</Badge>}
                  </span>
                  <span className="display tnum text-right text-xl">
                    {band !== null ? formatBand(band) : "—"}
                  </span>
                </div>
              );
            })}
          </CardBody>
        </Card>
      </div>

      {/* Per-section detail */}
      <Tabs defaultValue={firstBanded} className="mt-10">
        <TabsList>
          <TabsTrigger value="listening">Listening</TabsTrigger>
          <TabsTrigger value="reading">Reading</TabsTrigger>
          <TabsTrigger value="writing">Writing</TabsTrigger>
          <TabsTrigger value="speaking">Speaking</TabsTrigger>
          <TabsTrigger value="review">Answer review</TabsTrigger>
        </TabsList>

        <TabsContent value="listening" className="mt-5">
          <ObjectivePanel
            section="listening"
            raw={scores?.listening_raw ?? null}
            band={bands.listening}
            review={reviewRows}
          />
        </TabsContent>
        <TabsContent value="reading" className="mt-5">
          <ObjectivePanel
            section="reading"
            raw={scores?.reading_raw ?? null}
            band={bands.reading}
            review={reviewRows}
          />
        </TabsContent>
        <TabsContent value="writing" className="mt-5">
          <CriteriaPanel
            rows={data.writing as unknown as Array<Record<string, unknown>>}
            criteria={WRITING_CRITERIA as Array<[string, string]>}
            emptyMessage="Your writing has not been graded yet."
            labelFor={(row) => `Task ${row.task_number}`}
            textFor={writingText}
            wordsFor={countWords}
          />
        </TabsContent>
        <TabsContent value="speaking" className="mt-5">
          <CriteriaPanel
            rows={data.speaking as unknown as Array<Record<string, unknown>>}
            criteria={SPEAKING_CRITERIA as Array<[string, string]>}
            emptyMessage="Your speaking has not been graded yet."
            labelFor={(row) => `Part ${row.part_number}`}
            textFor={speakingText}
          />
        </TabsContent>
        <TabsContent value="review" className="mt-5">
          <ReviewPanel rows={reviewRows} submitted={submitted} />
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}
