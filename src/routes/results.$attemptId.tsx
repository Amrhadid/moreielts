import { createFileRoute, useParams } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "~/components/layout/AppShell";
import { Badge } from "~/components/ui/Badge";
import { Card, CardBody, CardHeader, CardTitle } from "~/components/ui/Card";
import { Progress } from "~/components/ui/Progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/Tabs";
import { formatBand, tallyBy } from "~/lib/scoring";
import { cn } from "~/lib/cn";
import { Protected } from "~/lib/auth";
import { useAttemptResult, useAttemptReview } from "~/lib/queries";
import type { AttemptReviewRow, CriterionFeedback, SpeakingScoreRow, WritingScoreRow } from "~/types/database";

export const Route = createFileRoute("/results/$attemptId")({ component: ResultRoute });

function ResultRoute() {
  return (
    <Protected>
      <ResultPage />
    </Protected>
  );
}

function bandTone(band: number): "good" | "warn" | "bad" {
  if (band >= 7) return "good";
  if (band >= 5.5) return "warn";
  return "bad";
}

function BandTile({
  label,
  band,
  large,
}: {
  label: string;
  band: number | null;
  large?: boolean;
}) {
  const tone = band !== null ? bandTone(band) : "warn";
  return (
    <Card className={cn(large && "border-brand-200 bg-brand-50/50", "flex flex-col justify-center")}>
      <CardBody className="pt-5 text-center">
        <p className="text-xs font-medium uppercase tracking-wide text-muted">{label}</p>
        <p
          className={cn(
            "mt-1 font-semibold tabular-nums",
            large ? "text-6xl text-brand-700" : "text-4xl",
            !large && band !== null && tone === "good" && "text-good",
            !large && band !== null && tone === "bad" && "text-bad",
          )}
        >
          {band !== null ? formatBand(band) : "—"}
        </p>
      </CardBody>
    </Card>
  );
}

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
              <span className="shrink-0 tabular-nums text-muted">
                {row.correct}/{row.total}
              </span>
            </div>
            <Progress value={pct} tone={pct >= 70 ? "good" : "brand"} />
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
          <p className="text-4xl font-semibold tabular-nums">
            {raw ?? "—"}
            <span className="text-xl text-muted"> / 40</span>
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
          <CardTitle>Accuracy by part</CardTitle>
        </CardHeader>
        <CardBody>
          <AccuracyList
            rows={tallyBy(rows, (r) => `${partLabel} ${r.partNumber}`)}
          />
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

const WRITING_CRITERIA: Array<[keyof WritingScoreRow, string]> = [
  ["task_achievement", "Task Achievement / Response"],
  ["coherence_cohesion", "Coherence and Cohesion"],
  ["lexical_resource", "Lexical Resource"],
  ["grammatical_range", "Grammatical Range and Accuracy"],
];

const SPEAKING_CRITERIA: Array<[keyof SpeakingScoreRow, string]> = [
  ["fluency_coherence", "Fluency and Coherence"],
  ["lexical_resource", "Lexical Resource"],
  ["grammatical_range", "Grammatical Range and Accuracy"],
  ["pronunciation", "Pronunciation"],
];

function CriteriaPanel({
  rows,
  criteria,
  emptyMessage,
  labelFor,
}: {
  rows: Array<Record<string, unknown>>;
  criteria: Array<[string, string]>;
  emptyMessage: string;
  labelFor: (row: Record<string, unknown>) => string;
}) {
  if (rows.length === 0) {
    return (
      <Card>
        <CardBody className="pt-5 text-sm text-muted">{emptyMessage}</CardBody>
      </Card>
    );
  }

  return (
    <div className="grid gap-6">
      {rows.map((row, i) => (
        <div key={i}>
          <h3 className="mb-3 text-sm font-semibold">{labelFor(row)}</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {criteria.map(([key, label]) => {
              const band = row[key] as number | null;
              const feedback = (row.feedback as Record<string, CriterionFeedback>)?.[key];
              return (
                <Card key={key}>
                  <CardHeader>
                    <div className="flex items-baseline justify-between gap-3">
                      <CardTitle>{label}</CardTitle>
                      <span className="text-2xl font-semibold tabular-nums">
                        {band !== null && band !== undefined ? formatBand(Number(band)) : "—"}
                      </span>
                    </div>
                  </CardHeader>
                  <CardBody>
                    <p className="text-sm leading-relaxed text-ink-soft">
                      {feedback?.comment ?? "No feedback recorded."}
                    </p>
                    {feedback?.evidence?.length ? (
                      <ul className="mt-3 grid gap-1.5">
                        {feedback.evidence.map((quote, j) => (
                          <li
                            key={j}
                            className="border-l-2 border-line-strong pl-3 text-xs italic leading-relaxed text-muted"
                          >
                            “{quote}”
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </CardBody>
                </Card>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function ResultPage() {
  const { attemptId } = useParams({ from: "/results/$attemptId" });
  const { data, isLoading } = useAttemptResult(attemptId);
  const [reviewFilter, setReviewFilter] = useState<"all" | "wrong">("all");

  const submitted = data?.attempt.status === "completed";
  const { data: review } = useAttemptReview(attemptId, submitted);

  const rows = useMemo(
    () =>
      (review ?? []).filter(
        (r) =>
          (r.section === "listening" || r.section === "reading") &&
          (reviewFilter === "all" || r.is_correct !== true),
      ),
    [review, reviewFilter],
  );

  if (isLoading) {
    return (
      <AppShell withSidebar={false}>
        <p className="py-16 text-center text-sm text-muted">Loading your result…</p>
      </AppShell>
    );
  }

  if (!data) {
    return (
      <AppShell withSidebar={false}>
        <p className="py-16 text-center text-sm text-muted">
          That result could not be found.
        </p>
      </AppShell>
    );
  }

  const scores = data.scores;
  const num = (v: number | null | undefined) => (v === null || v === undefined ? null : Number(v));

  return (
    <AppShell withSidebar={false}>
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {data.attempt.test_forms?.title ?? "Test result"}
          </h1>
          <Badge tone="brand" className="capitalize">
            {(data.attempt.test_forms?.variant ?? "").replace("_", " ")}
          </Badge>
          {!submitted && <Badge tone="warn">Awaiting speaking</Badge>}
        </div>
        <p className="mt-1.5 text-sm text-muted">
          {data.attempt.submitted_at
            ? `Completed ${new Date(data.attempt.submitted_at).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}`
            : "Not yet submitted"}
        </p>
      </div>

      {/* Bands */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <BandTile label="Overall band" band={num(scores?.overall_band)} large />
        <BandTile label="Listening" band={num(scores?.listening_band)} />
        <BandTile label="Reading" band={num(scores?.reading_band)} />
        <BandTile label="Writing" band={num(scores?.writing_band)} />
        <BandTile label="Speaking" band={num(scores?.speaking_band)} />
      </div>

      <aside className="mt-4 flex gap-3 rounded-lg border border-warn/30 bg-warn-soft px-4 py-3 text-sm text-warn" role="note">
        <span aria-hidden>ⓘ</span>
        <div>
          <p className="font-medium">AI-estimated band — for practice only. This is not an official IELTS result.</p>
          <p className="mt-0.5 text-xs">Use this estimate to guide your study plan.</p>
        </div>
      </aside>

      <p className="mt-3 text-xs leading-relaxed text-muted">
        The overall band is the average of the four component bands, rounded to the
        nearest half band.
        {scores?.overall_unrounded
          ? ` Unrounded average: ${Number(scores.overall_unrounded).toFixed(2)}.`
          : ""}
      </p>

      {/* Per-section detail */}
      <Tabs defaultValue="listening" className="mt-10">
        <TabsList>
          <TabsTrigger value="listening">Listening</TabsTrigger>
          <TabsTrigger value="reading">Reading</TabsTrigger>
          <TabsTrigger value="writing">Writing</TabsTrigger>
          <TabsTrigger value="speaking">Speaking</TabsTrigger>
        </TabsList>

        <TabsContent value="listening" className="mt-4">
          <ObjectivePanel
            section="listening"
            raw={scores?.listening_raw ?? null}
            band={num(scores?.listening_band)}
            review={review ?? []}
          />
        </TabsContent>
        <TabsContent value="reading" className="mt-4">
          <ObjectivePanel
            section="reading"
            raw={scores?.reading_raw ?? null}
            band={num(scores?.reading_band)}
            review={review ?? []}
          />
        </TabsContent>
        <TabsContent value="writing" className="mt-4">
          <CriteriaPanel
            rows={data.writing as unknown as Array<Record<string, unknown>>}
            criteria={WRITING_CRITERIA as Array<[string, string]>}
            emptyMessage="Your writing has not been graded yet."
            labelFor={(row) => `Task ${row.task_number}`}
          />
        </TabsContent>
        <TabsContent value="speaking" className="mt-4">
          <CriteriaPanel
            rows={data.speaking as unknown as Array<Record<string, unknown>>}
            criteria={SPEAKING_CRITERIA as Array<[string, string]>}
            emptyMessage="Your speaking has not been graded yet."
            labelFor={(row) => `Part ${row.part_number}`}
          />
        </TabsContent>
      </Tabs>

      {/* Answer review */}
      <div className="mb-3 mt-10 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold tracking-tight">Answer review</h2>
        <div className="flex gap-1 rounded-lg border border-line bg-surface p-1">
          {(["all", "wrong"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setReviewFilter(f)}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                reviewFilter === f ? "bg-brand-600 text-white" : "text-muted hover:text-ink",
              )}
            >
              {f === "all" ? "All questions" : "Incorrect only"}
            </button>
          ))}
        </div>
      </div>

      <Card className="overflow-hidden">
        {!submitted ? (
          <div className="px-5 py-8 text-center text-sm text-muted">
            Answers are released once the attempt is submitted.
          </div>
        ) : rows.length === 0 ? (
          <div className="px-5 py-8 text-center text-sm text-muted">
            Nothing to show here.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[46rem] text-sm">
              <thead className="border-b border-line bg-paper text-left text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-4 py-3 font-medium">#</th>
                  <th className="px-4 py-3 font-medium">Section</th>
                  <th className="px-4 py-3 font-medium">Question</th>
                  <th className="px-4 py-3 font-medium">Your answer</th>
                  <th className="px-4 py-3 font-medium">Correct answer</th>
                  <th className="px-4 py-3 font-medium">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {rows.map((row, i) => (
                  <tr key={row.question_id}>
                    <td className="px-4 py-3 tabular-nums text-muted">{i + 1}</td>
                    <td className="px-4 py-3 capitalize text-muted">{row.section}</td>
                    <td className="max-w-md px-4 py-3">
                      <p className="line-clamp-2 leading-relaxed">{row.prompt}</p>
                    </td>
                    <td
                      className={cn(
                        "px-4 py-3 font-medium",
                        row.is_correct ? "text-good" : "text-bad",
                      )}
                    >
                      {row.user_answer || "—"}
                    </td>
                    <td className="px-4 py-3 text-ink-soft">
                      {row.accepted_answers?.join(" / ")}
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone={row.is_correct ? "good" : "bad"}>
                        {row.is_correct ? "Correct" : "Incorrect"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </AppShell>
  );
}
