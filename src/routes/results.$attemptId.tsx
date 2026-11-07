import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { EvidenceEssay, type EvidenceCriterion } from "~/components/results/EvidenceEssay";
import { Icon } from "~/components/ui/Icon";
import {
  useAttemptReviewV2,
  useAttemptTranscripts,
  useGradingJobs,
  useRetryGradingJob,
  type AttemptReviewV2Row,
  type GradingJobRow,
  type TranscriptRow,
  type WritingFeedback,
} from "~/lib/practice-queries";
import { AppShell, PageHeader } from "~/components/layout/AppShell";
import { Badge } from "~/components/ui/Badge";
import { BandRuler, bandDelta } from "~/components/ui/BandRuler";
import { Button } from "~/components/ui/Button";
import { Card, CardBody, CardHeader, CardTitle } from "~/components/ui/Card";
import { EmptyState, Skeleton } from "~/components/ui/EmptyState";
import { Progress } from "~/components/ui/Progress";
import { SectionIcon } from "~/components/ui/SectionIcon";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/Tabs";
import { formatBand, tallyBy } from "~/lib/scoring";
import { cn } from "~/lib/cn";
import { Protected, useAuth } from "~/lib/auth";
import { SECTIONS } from "~/lib/sections";
import { queryKeys, useAttemptResult, useAttempts } from "~/lib/queries";
import type { CriterionFeedback, SpeakingScoreRow, WritingScoreRow } from "~/types/database";

export const Route = createFileRoute("/results/$attemptId")({ component: ResultRoute });

function ResultRoute() {
  return (
    <Protected>
      <ResultPage />
    </Protected>
  );
}

const num = (v: number | null | undefined) => (v === null || v === undefined ? null : Number(v));

function longDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

function shortDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long" });
}

/* ------------------------------------------------------------------ *
 * Objective sections
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
              <span className="tnum shrink-0 text-muted">
                {row.correct}/{row.total}
              </span>
            </div>
            <Progress value={pct} tone={pct >= 70 ? "good" : "brand"} label={row.key} />
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
  review: AttemptReviewV2Row[];
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
            {raw ?? "–"}
            <span className="ms-1 font-sans text-lg font-medium text-muted">/ 40</span>
          </p>
          <p className="mt-3 text-sm text-muted">
            {band !== null ? `Converted to band ${formatBand(band)} for this test form.` : "Not scored yet."}
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
 * Grading progress (unchanged behaviour)
 * ------------------------------------------------------------------ */

const JOB_STATUS: Record<GradingJobRow["status"], { label: string; tone: "neutral" | "brand" | "good" | "bad" }> = {
  pending: { label: "Queued", tone: "neutral" },
  running: { label: "Grading…", tone: "brand" },
  done: { label: "Done", tone: "good" },
  failed: { label: "Grading failed", tone: "bad" },
};

function GradingPanel({ jobs }: { jobs: GradingJobRow[] | undefined }) {
  const retry = useRetryGradingJob();
  return (
    <Card className="mb-5 border-brand-600 bg-brand-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-brand-600" aria-hidden />
          Grading your Writing and Speaking
        </CardTitle>
      </CardHeader>
      <CardBody>
        <p className="mb-3 text-sm text-ink-soft">
          This usually takes a minute or two. You can leave this page; your bands will be here when you come back.
        </p>
        {retry.isError && (
          <p className="mb-3 text-sm text-bad">Could not restart grading. Please try again in a minute.</p>
        )}
        {jobs?.some((j) => j.status === "failed") && (
          <p className="mb-3 text-sm text-ink-soft">
            One part could not be graded. "Try again" puts it back in the queue; if it fails again, message us on
            WhatsApp and we will look at it.
          </p>
        )}
        {!jobs ? (
          <p className="text-sm text-muted">Checking progress…</p>
        ) : (
          <ul className="grid gap-2">
            {jobs.map((job) => (
              <li
                key={job.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-line bg-surface px-3 py-2 text-sm"
              >
                <span className="flex items-center gap-2">
                  <SectionIcon code={job.kind === "writing" ? "writing" : "speaking"} size="sm" />
                  {job.kind === "writing" ? `Writing Task ${job.part_number}` : `Speaking Part ${job.part_number}`}
                </span>
                <span className="flex items-center gap-2">
                  <Badge tone={JOB_STATUS[job.status].tone}>{JOB_STATUS[job.status].label}</Badge>
                  {job.status === "failed" && (
                    <button
                      type="button"
                      onClick={() => retry.mutate(job.id)}
                      disabled={retry.isPending}
                      className="text-xs font-medium text-brand-600 hover:underline disabled:opacity-50"
                    >
                      {retry.isPending ? "Retrying…" : "Try again"}
                    </button>
                  )}
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardBody>
    </Card>
  );
}

/* ------------------------------------------------------------------ *
 * Listening transcript (unchanged behaviour)
 * ------------------------------------------------------------------ */

function TranscriptLines({ text }: { text: string }) {
  const lines = text.split(/\n+/).filter((l) => l.trim());
  return (
    <div className="grid gap-2 text-sm leading-relaxed">
      {lines.map((line, i) => {
        const m = /^([A-Z][\w .'-]{0,30}):\s*(.*)$/.exec(line.trim());
        return (
          <p key={i}>
            {m ? (
              <>
                <strong className="font-semibold">{m[1]}:</strong> {m[2]}
              </>
            ) : (
              line
            )}
          </p>
        );
      })}
    </div>
  );
}

function TranscriptPart({ part }: { part: TranscriptRow }) {
  const [rate, setRate] = useState("1");
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  useEffect(() => {
    if (audio) audio.playbackRate = Number(rate);
  }, [audio, rate]);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Part {part.part_number}</CardTitle>
      </CardHeader>
      <CardBody>
        {part.audio_url && (
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <audio ref={setAudio} controls preload="none" src={part.audio_url} className="min-w-0 flex-1" />
            <label className="flex items-center gap-2 text-sm text-muted">
              Speed
              <select
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                className="h-9 rounded-lg border border-line-strong bg-surface px-2 text-sm text-ink"
              >
                {["0.75", "1", "1.25", "1.5"].map((r) => (
                  <option key={r} value={r}>
                    {r}×
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}
        <TranscriptLines text={part.transcript} />
      </CardBody>
    </Card>
  );
}

/* ------------------------------------------------------------------ *
 * Writing and speaking feedback
 * ------------------------------------------------------------------ */

function criterionOf(feedback: Record<string, unknown> | null | undefined, key: string): CriterionFeedback | undefined {
  const value = feedback?.[key];
  return value && typeof value === "object" ? (value as CriterionFeedback) : undefined;
}

function WritingTask({ row, text }: { row: WritingScoreRow; text: string | null }) {
  const fb = (row.feedback ?? {}) as unknown as WritingFeedback;
  const prev = fb.previous;
  const [openModel, setOpenModel] = useState(false);
  const criteria: EvidenceCriterion[] = [
    { key: "task_achievement", label: row.task_number === 1 ? "Task achievement" : "Task response", band: row.task_achievement, ...criterionOf(fb as Record<string, unknown>, "task_achievement") },
    { key: "coherence_cohesion", label: "Coherence and cohesion", band: row.coherence_cohesion, ...criterionOf(fb as Record<string, unknown>, "coherence_cohesion") },
    { key: "lexical_resource", label: "Lexical resource", band: row.lexical_resource, ...criterionOf(fb as Record<string, unknown>, "lexical_resource") },
    { key: "grammatical_range", label: "Grammatical range and accuracy", band: row.grammatical_range, ...criterionOf(fb as Record<string, unknown>, "grammatical_range") },
  ];
  const words = fb.word_count ?? (text ? (text.trim().match(/\S+/g) ?? []).length : null);
  const delta = prev && row.task_band != null && prev.task_band != null ? Number(row.task_band) - Number(prev.task_band) : null;

  return (
    <section>
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-3">
        <h3 className="display text-xl">Task {row.task_number}</h3>
        <div className="flex items-center gap-2">
          {delta !== null && delta !== 0 && (
            <Badge tone={delta > 0 ? "good" : "warn"}>
              {delta > 0 ? "+" : "−"}
              {Math.abs(delta).toFixed(1)} since your last essay
            </Badge>
          )}
          <span className="display tnum text-2xl">{row.task_band != null ? formatBand(Number(row.task_band)) : "–"}</span>
        </div>
      </div>
      {fb.summary && <p className="mb-4 max-w-3xl text-sm leading-relaxed text-ink-soft">{fb.summary}</p>}
      <EvidenceEssay
        title="Your essay"
        meta={words !== null ? <span>{words} words</span> : undefined}
        text={text}
        emptyText="Your response text was not kept for this attempt."
        criteria={criteria}
        extra={
          <>
            {fb.corrections?.length ? (
              <Card className="px-4 py-3.5">
                <h4 className="mb-2.5 text-sm font-semibold">Corrections</h4>
                <ul className="grid gap-2.5">
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
              </Card>
            ) : null}
            {fb.model_answer && (
              <Card>
                <button
                  type="button"
                  onClick={() => setOpenModel((o) => !o)}
                  className="flex w-full items-center justify-between px-4 py-3.5 text-start text-sm font-semibold"
                  aria-expanded={openModel}
                >
                  <span className="flex items-center gap-2">
                    <Icon name="sparkles" size={16} /> Band +1 rewrite
                  </span>
                  <Icon name="chevronDown" size={16} className={cn("text-muted transition-transform", openModel && "rotate-180")} />
                </button>
                {openModel && (
                  <div className="prose-passage whitespace-pre-wrap border-t border-line px-4 py-4 text-[0.95rem]">
                    {fb.model_answer}
                  </div>
                )}
              </Card>
            )}
          </>
        }
      />
    </section>
  );
}

interface SpeakingStats {
  wordCount?: number;
  wordsPerMinute?: number;
  fillerCount?: number;
  fillerRate?: number;
  longPauses?: number;
  topFillers?: Array<{ filler: string; count: number }>;
  speakingSeconds?: number;
}

function SpeakingPart({ row }: { row: SpeakingScoreRow }) {
  const fb = (row.feedback ?? {}) as Record<string, unknown>;
  const stats = (fb.stats ?? null) as SpeakingStats | null;
  const better = typeof fb.better_answer === "string" ? fb.better_answer : null;
  const criteria: EvidenceCriterion[] = [
    { key: "fluency_coherence", label: "Fluency and coherence", band: row.fluency_coherence, ...criterionOf(fb, "fluency_coherence") },
    { key: "lexical_resource", label: "Lexical resource", band: row.lexical_resource, ...criterionOf(fb, "lexical_resource") },
    { key: "grammatical_range", label: "Grammatical range and accuracy", band: row.grammatical_range, ...criterionOf(fb, "grammatical_range") },
    { key: "pronunciation", label: "Pronunciation", band: row.pronunciation, ...criterionOf(fb, "pronunciation") },
  ];

  return (
    <section>
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-3">
        <h3 className="display text-xl">Part {row.part_number}</h3>
        <span className="display tnum text-2xl">{row.part_band != null ? formatBand(Number(row.part_band)) : "–"}</span>
      </div>
      <EvidenceEssay
        title="Your transcript"
        meta={
          stats?.speakingSeconds != null ? (
            <span>
              {Math.round(stats.speakingSeconds)} s spoken
            </span>
          ) : undefined
        }
        text={row.transcript}
        emptyText="No transcript was produced for this part."
        criteria={criteria}
        extra={
          <>
            {stats && (
              <Card className="px-4 py-3.5">
                <h4 className="mb-2.5 text-sm font-semibold">Delivery</h4>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <p className="display tnum text-xl">{stats.wordsPerMinute != null ? Math.round(stats.wordsPerMinute) : "–"}</p>
                    <p className="text-xs text-muted">words per minute</p>
                  </div>
                  <div>
                    <p className="display tnum text-xl">{stats.fillerRate != null ? Number(stats.fillerRate).toFixed(1) : "–"}</p>
                    <p className="text-xs text-muted">fillers per 100 words</p>
                  </div>
                  <div>
                    <p className="display tnum text-xl">{stats.longPauses ?? "–"}</p>
                    <p className="text-xs text-muted">long pauses</p>
                  </div>
                </div>
                {stats.topFillers?.length ? (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {stats.topFillers.map((f) => (
                      <Badge key={f.filler} tone="warn">
                        "{f.filler}" × {f.count}
                      </Badge>
                    ))}
                  </div>
                ) : null}
              </Card>
            )}
            {better && (
              <Card className="border-good/40 px-4 py-3.5">
                <h4 className="mb-2 text-sm font-semibold">A stronger answer</h4>
                <p className="whitespace-pre-line text-sm leading-relaxed text-ink-soft">{better}</p>
              </Card>
            )}
          </>
        }
      />
    </section>
  );
}

/* ------------------------------------------------------------------ *
 * Answer review
 * ------------------------------------------------------------------ */

function ReviewRow({ row, index }: { row: AttemptReviewV2Row; index: number }) {
  const ok = row.is_correct === true;
  return (
    <li className="rounded-card border border-line bg-surface px-4 py-3 text-sm md:grid md:grid-cols-[3rem_minmax(0,1.6fr)_minmax(0,1fr)_minmax(0,1.2fr)_auto] md:items-start md:gap-4">
      <div className="flex items-center gap-2 md:block">
        <span className="font-mono text-xs text-muted">{index}</span>
        <span className="text-xs capitalize text-muted md:block md:text-[0.65rem] md:uppercase md:tracking-wide">{row.section}</span>
      </div>
      <div className="mt-2 md:mt-0">
        <p className="mb-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-muted md:hidden">Question</p>
        <p className="leading-relaxed">{row.prompt}</p>
      </div>
      <div className="mt-2 md:mt-0">
        <p className="mb-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-muted md:hidden">Your answer</p>
        <p className={cn("font-medium", ok ? "text-good" : "text-bad")}>{row.user_answer || "–"}</p>
      </div>
      <div className="mt-2 md:mt-0">
        <p className="mb-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-muted md:hidden">Accepted</p>
        <p className="text-ink-soft">{row.accepted_answers?.join(" / ")}</p>
        {row.explanation && <p className="mt-1 text-xs leading-relaxed text-muted">{row.explanation}</p>}
      </div>
      <div className="mt-3 flex items-center gap-2 md:mt-0 md:justify-end">
        <Badge tone={ok ? "good" : "bad"}>{ok ? "Correct" : "Incorrect"}</Badge>
        {!ok && (
          <Button asChild variant="outline" size="sm">
            <Link to="/drill/$typeCode" params={{ typeCode: row.type_code }}>
              Drill this type
            </Link>
          </Button>
        )}
      </div>
    </li>
  );
}

function AnswerReview({ review, submitted }: { review: AttemptReviewV2Row[]; submitted: boolean }) {
  const [filter, setFilter] = useState<string>("all");
  const objective = useMemo(
    () => review.filter((r) => r.section === "listening" || r.section === "reading"),
    [review],
  );
  const types = useMemo(() => {
    const seen = new Map<string, string>();
    for (const r of objective) seen.set(r.type_code, r.type_label);
    return [...seen.entries()];
  }, [objective]);
  const wrong = objective.filter((r) => r.is_correct !== true).length;
  const rows = objective.filter((r) => filter === "all" || (filter === "wrong" ? r.is_correct !== true : r.type_code === filter));

  if (!submitted) {
    return <EmptyState title="Answers are released once the attempt is submitted." />;
  }

  const chip = (value: string, label: string) => (
    <button
      key={value}
      type="button"
      onClick={() => setFilter(value)}
      aria-pressed={filter === value}
      className={cn(
        "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
        filter === value ? "border-brand-600 bg-brand-600 text-on-brand" : "border-line bg-surface text-ink-soft hover:border-line-strong",
      )}
    >
      {label}
    </button>
  );

  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-1.5">
        {chip("all", `All ${objective.length}`)}
        {chip("wrong", `Incorrect ${wrong}`)}
        {types.map(([code, label]) => chip(code, label))}
      </div>
      {rows.length === 0 ? (
        <EmptyState title="Nothing to show for this filter." />
      ) : (
        <ul className="grid gap-2">
          {rows.map((row, i) => (
            <ReviewRow key={row.question_id} row={row} index={i + 1} />
          ))}
        </ul>
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
        <Skeleton className="mb-6 h-8 w-72" />
        <div className="grid gap-5 lg:grid-cols-[20rem_minmax(0,1fr)]">
          <Skeleton className="h-48 rounded-card" />
          <Skeleton className="h-48 rounded-card" />
        </div>
      </div>
    </AppShell>
  );
}

function ResultPage() {
  const { attemptId } = useParams({ from: "/results/$attemptId" });
  const { data, isLoading } = useAttemptResult(attemptId);
  const { profile, user } = useAuth();
  const { data: attempts } = useAttempts(user?.id);

  const queryClient = useQueryClient();
  const submitted = Boolean(data?.attempt.submitted_at);
  const completed = data?.attempt.status === "completed";
  const gradingActive = data?.attempt.status === "awaiting_speaking" && submitted;

  const [poll, setPoll] = useState(true);
  const { data: jobs } = useGradingJobs(gradingActive ? attemptId : undefined, gradingActive && poll);
  const allDone = Boolean(jobs && jobs.length > 0 && jobs.every((j) => j.status === "done" || j.status === "failed"));
  useEffect(() => {
    setPoll(!allDone);
  }, [allDone]);
  // Once every job has finished, refresh the result until the bands land.
  useEffect(() => {
    if (!gradingActive || !allDone) return;
    const refresh = () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.result(attemptId) });
      queryClient.invalidateQueries({ queryKey: ["attempts"] });
    };
    refresh();
    const id = window.setInterval(refresh, 5000);
    return () => window.clearInterval(id);
  }, [gradingActive, allDone, attemptId, queryClient]);

  const { data: review } = useAttemptReviewV2(attemptId, submitted);
  const { data: transcripts } = useAttemptTranscripts(attemptId, submitted);

  // The candidate's essays come back from the review RPC as writing rows.
  const writingText = useMemo(() => {
    const map = new Map<number, string>();
    for (const r of review ?? []) {
      if (r.section === "writing" && r.user_answer && !map.has(r.part_number)) map.set(r.part_number, r.user_answer);
    }
    return map;
  }, [review]);

  const target = profile?.target_band ? Number(profile.target_band) : 7;

  // Change since the previous completed attempt, for the overall card.
  const previous = useMemo(() => {
    if (!data || !attempts) return null;
    const mine = attempts
      .filter((a) => a.status === "completed" && a.id !== data.attempt.id && a.attempt_scores?.overall_band != null)
      .filter((a) => new Date(a.started_at) < new Date(data.attempt.started_at))
      .sort((a, b) => new Date(b.started_at).getTime() - new Date(a.started_at).getTime());
    return mine[0] ?? null;
  }, [attempts, data]);

  if (isLoading) return <LoadingResult />;

  if (!data) {
    return (
      <AppShell wide>
        <EmptyState
          title="That result could not be found."
          body="It may belong to another account, or the link is out of date."
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
  const overall = num(scores?.overall_band);
  const sectionBands: Record<string, number | null> = {
    listening: num(scores?.listening_band),
    reading: num(scores?.reading_band),
    writing: num(scores?.writing_band),
    speaking: num(scores?.speaking_band),
  };
  const defaultTab = SECTIONS.find((s) => sectionBands[s.code] !== null)?.code ?? "listening";
  const prevBand = previous?.attempt_scores?.overall_band != null ? Number(previous.attempt_scores.overall_band) : null;
  const change = overall !== null && prevBand !== null ? Math.round((overall - prevBand) * 2) / 2 : null;
  const overallDelta = bandDelta(overall, target);

  return (
    <AppShell wide>
      <PageHeader
        eyebrow={`Results · ${data.attempt.submitted_at ? longDate(data.attempt.submitted_at) : "not yet submitted"}`}
        title={
          <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
            {data.attempt.test_forms?.title ?? "Test result"}
            <span className="flex items-center gap-1.5 align-middle">
              <Badge tone="brand" className="capitalize">
                {(data.attempt.test_forms?.variant ?? "").replace("_", " ")}
              </Badge>
              {!completed && <Badge tone="warn">{gradingActive ? "Grading in progress" : "Awaiting speaking"}</Badge>}
            </span>
          </span>
        }
        action={
          <Button asChild variant="outline">
            <Link to="/drills">Drill your weakest types</Link>
          </Button>
        }
      />

      {gradingActive && <GradingPanel jobs={jobs} />}

      {/* Bands */}
      <div className="grid gap-5 lg:grid-cols-[20rem_minmax(0,1fr)]">
        <Card className="p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">Overall band</p>
          <div className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="display tnum text-[4.25rem] leading-none">{overall !== null ? formatBand(overall) : "–"}</span>
            <span className="display tnum text-xl text-muted">/ {formatBand(target)} target</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {change !== null && previous ? (
              <Badge tone={change > 0 ? "good" : change < 0 ? "warn" : "neutral"}>
                {change > 0 ? "+" : change < 0 ? "−" : "="}
                {change === 0 ? " no change" : ` ${formatBand(Math.abs(change))}`} since {shortDate(previous.started_at)}
              </Badge>
            ) : overall !== null ? (
              <Badge tone="neutral">First mock</Badge>
            ) : null}
            {overallDelta && <Badge tone={overallDelta.tone}>{overallDelta.label === "at target" ? "At target" : `${overallDelta.label} to target`}</Badge>}
          </div>
          <p className="mt-5 text-xs leading-relaxed text-muted">
            Mean of the four component bands, rounded to the nearest half.
            {scores?.overall_unrounded ? ` Unrounded ${Number(scores.overall_unrounded).toFixed(2)}.` : ""} AI estimate, not an
            official IELTS result.
          </p>
        </Card>

        <Card className="grid content-center gap-5 p-6">
          {SECTIONS.map((s) => {
            const band = sectionBands[s.code];
            const pending = band === null && gradingActive && (s.code === "writing" || s.code === "speaking");
            const d = bandDelta(band, target);
            return (
              <div key={s.code} className="grid grid-cols-[7.5rem_minmax(0,1fr)_auto] items-center gap-4 sm:grid-cols-[8.5rem_minmax(0,1fr)_5.5rem]">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <SectionIcon code={s.code} size="sm" />
                  {s.label}
                </div>
                <BandRuler band={band} target={target} />
                <div className="flex items-center justify-end gap-2">
                  {pending ? (
                    <span className="text-xs text-muted">Grading…</span>
                  ) : (
                    <>
                      {d && <Badge tone={d.tone} className="hidden sm:inline-flex">{d.label}</Badge>}
                      <span className="display tnum text-xl">{band !== null ? formatBand(band) : "–"}</span>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </Card>
      </div>

      {/* Per-section detail */}
      <Tabs defaultValue={defaultTab} className="mt-8">
        <TabsList>
          <TabsTrigger value="listening">Listening</TabsTrigger>
          <TabsTrigger value="reading">Reading</TabsTrigger>
          <TabsTrigger value="writing">Writing</TabsTrigger>
          <TabsTrigger value="speaking">Speaking</TabsTrigger>
          <TabsTrigger value="review">Answer review</TabsTrigger>
          <TabsTrigger value="transcript">Listening transcript</TabsTrigger>
        </TabsList>

        <TabsContent value="listening" className="mt-5">
          <ObjectivePanel section="listening" raw={scores?.listening_raw ?? null} band={sectionBands.listening} review={review ?? []} />
        </TabsContent>
        <TabsContent value="reading" className="mt-5">
          <ObjectivePanel section="reading" raw={scores?.reading_raw ?? null} band={sectionBands.reading} review={review ?? []} />
        </TabsContent>
        <TabsContent value="writing" className="mt-5">
          {data.writing.length === 0 ? (
            <EmptyState
              title={gradingActive ? "Your writing is being graded." : "Your writing has not been graded yet."}
              body={gradingActive ? "The bands and feedback appear here as soon as the examiner finishes." : undefined}
            />
          ) : (
            <div className="grid gap-10">
              {data.writing.map((row) => (
                <WritingTask key={row.id} row={row} text={writingText.get(row.task_number) ?? null} />
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="speaking" className="mt-5">
          {data.speaking.length === 0 ? (
            <EmptyState
              title={gradingActive ? "Your speaking is being graded." : "Your speaking has not been graded yet."}
              body={gradingActive ? "Transcription and grading usually take a minute or two per part." : undefined}
            />
          ) : (
            <div className="grid gap-10">
              {data.speaking.map((row) => (
                <SpeakingPart key={row.id} row={row} />
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="review" className="mt-5">
          <AnswerReview review={review ?? []} submitted={submitted} />
        </TabsContent>
        <TabsContent value="transcript" className="mt-5">
          {!submitted ? (
            <EmptyState title="Transcripts are released once the attempt is submitted." />
          ) : !transcripts?.length ? (
            <EmptyState title="No listening transcript for this test." />
          ) : (
            <div className="grid gap-4">
              {[...transcripts]
                .sort((a, b) => a.part_number - b.part_number)
                .map((part) => (
                  <TranscriptPart key={part.group_id} part={part} />
                ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}
