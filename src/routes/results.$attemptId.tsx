import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "~/components/layout/AppShell";
import { Badge } from "~/components/ui/Badge";
import { Card, CardBody, CardHeader, CardTitle } from "~/components/ui/Card";
import { Progress } from "~/components/ui/Progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/Tabs";
import { bandTone, formatBand } from "~/lib/band";
import { cn } from "~/lib/cn";
import { mockResult } from "~/mock/result";
import type {
  AccuracyRow,
  ObjectiveSectionResult,
  SubjectiveSectionResult,
} from "~/types/result";

export const Route = createFileRoute("/results/$attemptId")({ component: ResultPage });

function BandTile({
  label,
  band,
  large,
}: {
  label: string;
  band: number;
  large?: boolean;
}) {
  const tone = bandTone(band);
  return (
    <Card
      className={cn(
        large && "border-brand-200 bg-brand-50/50",
        "flex flex-col justify-center",
      )}
    >
      <CardBody className="pt-5 text-center">
        <p className="text-xs font-medium uppercase tracking-wide text-muted">
          {label}
        </p>
        <p
          className={cn(
            "mt-1 font-semibold tabular-nums",
            large ? "text-6xl text-brand-700" : "text-4xl",
            !large && tone === "good" && "text-good",
            !large && tone === "bad" && "text-bad",
          )}
        >
          {formatBand(band)}
        </p>
      </CardBody>
    </Card>
  );
}

function AccuracyList({ rows }: { rows: AccuracyRow[] }) {
  return (
    <ul className="grid gap-3">
      {rows.map((row) => {
        const pct = row.total ? (row.correct / row.total) * 100 : 0;
        return (
          <li key={row.label}>
            <div className="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
              <span className="min-w-0 truncate">{row.label}</span>
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

function ObjectivePanel({ result }: { result: ObjectiveSectionResult }) {
  return (
    <div className="grid items-start gap-4 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Raw score</CardTitle>
        </CardHeader>
        <CardBody>
          <p className="text-4xl font-semibold tabular-nums">
            {result.rawScore}
            <span className="text-xl text-muted"> / {result.rawTotal}</span>
          </p>
          <p className="mt-3 text-sm text-muted">
            Converted to band {formatBand(result.band)} for this test form.
          </p>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Accuracy by part</CardTitle>
        </CardHeader>
        <CardBody>
          <AccuracyList rows={result.byPart} />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Accuracy by question type</CardTitle>
        </CardHeader>
        <CardBody>
          <AccuracyList rows={result.byQuestionType} />
        </CardBody>
      </Card>
    </div>
  );
}

function SubjectivePanel({ result }: { result: SubjectiveSectionResult }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {result.criteria.map((c) => (
        <Card key={c.criterion}>
          <CardHeader>
            <div className="flex items-baseline justify-between gap-3">
              <CardTitle>{c.criterion}</CardTitle>
              <span className="text-2xl font-semibold tabular-nums">
                {formatBand(c.band)}
              </span>
            </div>
          </CardHeader>
          <CardBody>
            <p className="text-sm leading-relaxed text-ink-soft">{c.feedback}</p>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}

function ResultPage() {
  const result = mockResult;
  const [reviewFilter, setReviewFilter] = useState<"all" | "wrong">("all");

  const rows = result.answerReview.filter(
    (r) => reviewFilter === "all" || !r.correct,
  );

  return (
    <AppShell withSidebar={false}>
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {result.formTitle}
          </h1>
          <Badge tone="brand" className="capitalize">
            {result.variant}
          </Badge>
        </div>
        <p className="mt-1.5 text-sm text-muted">
          Completed{" "}
          {new Date(result.takenAt).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>

      {/* Bands */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <BandTile label="Overall band" band={result.overall} large />
        <BandTile label="Listening" band={result.listening.band} />
        <BandTile label="Reading" band={result.reading.band} />
        <BandTile label="Writing" band={result.writing.band} />
        <BandTile label="Speaking" band={result.speaking.band} />
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
          <ObjectivePanel result={result.listening} />
        </TabsContent>
        <TabsContent value="reading" className="mt-4">
          <ObjectivePanel result={result.reading} />
        </TabsContent>
        <TabsContent value="writing" className="mt-4">
          <SubjectivePanel result={result.writing} />
        </TabsContent>
        <TabsContent value="speaking" className="mt-4">
          <SubjectivePanel result={result.speaking} />
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
                reviewFilter === f
                  ? "bg-brand-600 text-white"
                  : "text-muted hover:text-ink",
              )}
            >
              {f === "all" ? "All questions" : "Incorrect only"}
            </button>
          ))}
        </div>
      </div>

      <Card className="overflow-hidden">
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
              {rows.map((row) => (
                <tr key={`${row.section}-${row.questionId}`}>
                  <td className="px-4 py-3 tabular-nums text-muted">{row.number}</td>
                  <td className="px-4 py-3 capitalize text-muted">{row.section}</td>
                  <td className="max-w-md px-4 py-3">
                    <p className="line-clamp-2 leading-relaxed">{row.prompt}</p>
                  </td>
                  <td
                    className={cn(
                      "px-4 py-3 font-medium",
                      row.correct ? "text-good" : "text-bad",
                    )}
                  >
                    {row.userAnswer || "—"}
                  </td>
                  <td className="px-4 py-3 text-ink-soft">{row.correctAnswer}</td>
                  <td className="px-4 py-3">
                    <Badge tone={row.correct ? "good" : "bad"}>
                      {row.correct ? "Correct" : "Incorrect"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </AppShell>
  );
}
