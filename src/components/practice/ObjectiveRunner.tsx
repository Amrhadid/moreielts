import { useCallback, useEffect, useRef, useState } from "react";
import type { ObjectiveQuestion, ObjectiveSet } from "~/data/practice";
import { Badge } from "~/components/ui/Badge";
import { Button } from "~/components/ui/Button";
import { Card, CardBody, CardHeader, CardTitle } from "~/components/ui/Card";
import { Input } from "~/components/ui/Field";
import { Progress } from "~/components/ui/Progress";
import { cn } from "~/lib/cn";
import { useAuth } from "~/lib/auth";
import {
  explainObjective,
  markObjective,
  type MarkedQuestion,
  type ObjectiveAnswers,
  type ObjectiveReview,
} from "~/lib/practice/grading";
import { appendHistory } from "~/lib/practice/history";
import { AiStatus } from "./PracticeShell";

/**
 * Reading and Listening practice: five objective questions, marked locally
 * with the test's own answer-check rules the moment the learner submits, then
 * explained by the AI from the passage or transcript.
 */
export function ObjectiveRunner({ set }: { set: ObjectiveSet }) {
  const { user } = useAuth();
  const [answers, setAnswers] = useState<ObjectiveAnswers>({});
  const [marked, setMarked] = useState<MarkedQuestion[] | null>(null);
  const [review, setReview] = useState<ObjectiveReview | null>(null);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [reviewing, setReviewing] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const answered = set.questions.filter((q) => (answers[q.id] ?? "").trim() !== "").length;
  const correct = marked?.filter((m) => m.result.correct).length ?? 0;

  const runReview = useCallback(
    async (rows: MarkedQuestion[]) => {
      setReviewing(true);
      setReviewError(null);
      try {
        setReview(await explainObjective(set, rows));
      } catch (error) {
        setReviewError(error instanceof Error ? error.message : String(error));
      } finally {
        setReviewing(false);
      }
    },
    [set],
  );

  function check() {
    const rows = markObjective(set, answers);
    setMarked(rows);
    appendHistory(user?.id, {
      section: set.section,
      itemId: set.id,
      title: set.title,
      score: { kind: "raw", correct: rows.filter((r) => r.result.correct).length, total: rows.length },
    });
    void runReview(rows);
  }

  function reset() {
    setAnswers({});
    setMarked(null);
    setReview(null);
    setReviewError(null);
  }

  useEffect(() => {
    if (marked) resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [marked]);

  const stimulus =
    set.section === "reading" && set.passage ? (
      <PassagePane title={set.passage.title} paragraphs={set.passage.paragraphs} />
    ) : set.audio ? (
      <AudioPane
        src={set.audio.src}
        durationLabel={set.audio.durationLabel}
        transcript={marked ? set.audio.transcript : null}
      />
    ) : null;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
      <div className="min-w-0">{stimulus}</div>

      <div className="min-w-0">
        <Card>
          <CardHeader>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              Questions 1–{set.questions.length}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{set.instructions}</p>
          </CardHeader>
          <CardBody className="grid gap-5">
            {set.questions.map((question) => (
              <QuestionField
                key={question.id}
                question={question}
                value={answers[question.id] ?? ""}
                locked={marked !== null}
                marked={marked?.find((m) => m.question.id === question.id) ?? null}
                onChange={(value) => setAnswers((prev) => ({ ...prev, [question.id]: value }))}
              />
            ))}

            {!marked ? (
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
                <p className="text-sm text-muted">
                  {answered}/{set.questions.length} answered
                </p>
                <Button onClick={check}>Check answers</Button>
              </div>
            ) : (
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
                <p className="text-sm font-medium">
                  {correct}/{set.questions.length} correct
                </p>
                <Button variant="outline" onClick={reset}>
                  Try again
                </Button>
              </div>
            )}
          </CardBody>
        </Card>

        {marked && (
          <div ref={resultsRef} className="mt-6 scroll-mt-24">
            <ResultSummary correct={correct} total={set.questions.length} />
            <div className="mt-4">
              <AiStatus
                loading={reviewing}
                error={reviewError}
                onRetry={() => runReview(marked)}
                loadingLabel="The tutor is checking each answer against the text…"
              />
            </div>
            {review?.summary && (
              <div className="mt-4 rounded-card border border-brand-100 bg-brand-50 p-5 animate-rise">
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">
                  Tutor's summary
                </p>
                <p className="mt-1.5 text-sm leading-relaxed">{review.summary}</p>
              </div>
            )}
            <ol className="mt-4 grid gap-3">
              {marked.map((row) => (
                <ReviewItem
                  key={row.question.id}
                  row={row}
                  ai={review?.items.find((i) => i.number === row.question.number) ?? null}
                />
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}

function PassagePane({ title, paragraphs }: { title: string; paragraphs: string[] }) {
  return (
    <Card className="lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-hidden">
      <CardBody className="thin-scroll pt-5 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto">
        <div className="prose-passage">
          <h3>{title}</h3>
          {paragraphs.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}

function AudioPane({
  src,
  durationLabel,
  transcript,
}: {
  src: string;
  durationLabel: string;
  transcript: string[] | null;
}) {
  const [plays, setPlays] = useState(0);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recording</CardTitle>
        <p className="mt-1 text-sm text-muted">
          {durationLabel}. In the real test you hear it once, so try to answer on the first
          play.
        </p>
      </CardHeader>
      <CardBody>
        <audio
          controls
          preload="metadata"
          src={src}
          className="w-full"
          onPlay={() => setPlays((n) => n + 1)}
        />
        <p className="mt-2 text-xs text-muted">
          {plays === 0 ? "Not played yet" : plays === 1 ? "Played once" : `Played ${plays} times`}
        </p>

        <div className="mt-5 rounded-xl border border-line bg-paper/60 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Transcript</p>
          {transcript ? (
            <ul className="mt-2 grid gap-2 text-sm leading-relaxed">
              {transcript.map((line, i) => {
                const colon = line.indexOf(":");
                return (
                  <li key={i}>
                    <span className="font-semibold text-ink-soft">{line.slice(0, colon)}:</span>{" "}
                    <span className="text-ink">{line.slice(colon + 1).trim()}</span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="mt-1 text-sm text-muted">Revealed after you check your answers.</p>
          )}
        </div>
      </CardBody>
    </Card>
  );
}

function QuestionField({
  question,
  value,
  locked,
  marked,
  onChange,
}: {
  question: ObjectiveQuestion;
  value: string;
  locked: boolean;
  marked: MarkedQuestion | null;
  onChange: (value: string) => void;
}) {
  const verdict = marked ? (marked.result.correct ? "good" : "bad") : null;
  return (
    <fieldset
      className={cn(
        "rounded-xl border p-4 transition-colors",
        verdict === "good" && "border-good/30 bg-good-soft/40",
        verdict === "bad" && "border-bad/30 bg-bad-soft/40",
        verdict === null && "border-line",
      )}
    >
      <legend className="sr-only">Question {question.number}</legend>
      <div className="flex items-start gap-3">
        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-600 text-xs font-semibold text-white">
          {question.number}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">
            {question.typeLabel}
            {question.kind === "text" && question.wordLimit
              ? ` · max ${question.wordLimit} ${question.wordLimit === 1 ? "word" : "words"}`
              : ""}
          </p>
          <p className="mt-1 text-[0.95rem] leading-relaxed">{question.prompt}</p>

          {question.kind === "radio" && question.options ? (
            <div className="mt-3 grid gap-2">
              {question.options.map((option) => {
                const selected = value === option.value;
                const isAnswer = marked !== null && question.acceptedAnswers.includes(option.value);
                return (
                  <label
                    key={option.value}
                    className={cn(
                      "flex cursor-pointer items-start gap-3 rounded-lg border px-3 py-2 text-sm transition-colors",
                      selected ? "border-brand-500 bg-brand-50" : "border-line bg-surface",
                      locked && "cursor-default",
                      isAnswer && "border-good bg-good-soft",
                      marked && selected && !isAnswer && "border-bad bg-bad-soft",
                    )}
                  >
                    <input
                      type="radio"
                      name={question.id}
                      value={option.value}
                      checked={selected}
                      disabled={locked}
                      onChange={() => onChange(option.value)}
                      className="mt-1 accent-brand-600"
                    />
                    <span>
                      {/* Letter prefix for A–D options; TFNG labels stand alone. */}
                      {/^[A-Z]$/.test(option.value) && (
                        <span className="mr-1.5 font-semibold">{option.value}</span>
                      )}
                      {option.label}
                    </span>
                  </label>
                );
              })}
            </div>
          ) : (
            <Input
              value={value}
              disabled={locked}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Your answer"
              autoComplete="off"
              spellCheck={false}
              className="mt-3 max-w-xs"
            />
          )}
        </div>
      </div>
    </fieldset>
  );
}

function ResultSummary({ correct, total }: { correct: number; total: number }) {
  const pct = (correct / total) * 100;
  return (
    <Card className="animate-rise">
      <CardBody className="pt-5">
        <div className="flex items-baseline justify-between">
          <p className="text-sm font-semibold">Your score</p>
          <p className="text-2xl font-semibold tabular-nums">
            {correct}
            <span className="text-base text-muted">/{total}</span>
          </p>
        </div>
        <Progress value={pct} tone={pct >= 80 ? "good" : "brand"} className="mt-3" />
        <p className="mt-2 text-xs text-muted">
          Five questions are too few for a band estimate; a full 40-question section is scored
          in bands on the mock test.
        </p>
      </CardBody>
    </Card>
  );
}

function ReviewItem({
  row,
  ai,
}: {
  row: MarkedQuestion;
  ai: { explanation: string; evidence: string; tip: string } | null;
}) {
  const { question, given, result } = row;
  const accepted = question.options
    ? question.acceptedAnswers
        .map((v) => {
          const option = question.options?.find((o) => o.value === v);
          return option ? `${v} — ${option.label}` : v;
        })
        .join(" / ")
    : question.acceptedAnswers.join(" / ");

  return (
    <li className="rounded-card border border-line bg-surface p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold">Question {question.number}</p>
        <Badge tone={result.correct ? "good" : "bad"}>
          {result.correct
            ? "Correct"
            : result.reason === "empty"
              ? "Not answered"
              : result.reason === "word_limit_exceeded"
                ? "Over the word limit"
                : "Incorrect"}
        </Badge>
      </div>
      <dl className="mt-3 grid gap-1 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-xs uppercase tracking-wide text-muted">Your answer</dt>
          <dd className={cn("font-medium", !result.correct && given && "line-through")}>
            {given || "—"}
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-muted">Accepted</dt>
          <dd className="font-medium text-good">{accepted}</dd>
        </div>
      </dl>
      <p className="mt-3 text-sm leading-relaxed text-ink-soft">
        {ai?.explanation || question.explanation}
      </p>
      {ai?.evidence && (
        <p className="mt-2 border-l-2 border-brand-200 pl-3 font-serif text-sm italic text-muted">
          “{ai.evidence}”
        </p>
      )}
      {ai?.tip && (
        <p className="mt-2 text-sm">
          <span className="font-semibold text-brand-700">Tip · </span>
          {ai.tip}
        </p>
      )}
    </li>
  );
}
