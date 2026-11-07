import { useCallback, useEffect, useRef, useState } from "react";
import type { ObjectiveQuestion, ObjectiveSet } from "~/data/practice";
import { Badge } from "~/components/ui/Badge";
import { Button } from "~/components/ui/Button";
import { Card, CardBody, CardHeader, CardTitle } from "~/components/ui/Card";
import { Input } from "~/components/ui/Field";
import { Icon } from "~/components/ui/Icon";
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
  const [current, setCurrent] = useState<string | null>(null);
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
        <div className="rounded-[0.625rem] border border-line bg-surface px-4 py-3 text-sm leading-relaxed text-ink-soft">
          <b className="font-semibold text-ink">Questions 1 to {set.questions.length}.</b>{" "}
          {set.instructions}
        </div>

        <div className="mt-3 grid gap-3">
          {set.questions.map((question) => (
            <QuestionField
              key={question.id}
              question={question}
              value={answers[question.id] ?? ""}
              locked={marked !== null}
              current={current === question.id}
              marked={marked?.find((m) => m.question.id === question.id) ?? null}
              onFocus={() => setCurrent(question.id)}
              onChange={(value) => setAnswers((prev) => ({ ...prev, [question.id]: value }))}
            />
          ))}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
          {!marked ? (
            <>
              <p className="tnum text-sm text-muted">
                {answered} of {set.questions.length} answered
              </p>
              <Button onClick={check}>Check answers</Button>
            </>
          ) : (
            <>
              <p className="tnum text-sm font-medium">
                {correct} of {set.questions.length} correct
              </p>
              <Button variant="outline" onClick={reset}>
                Try again
              </Button>
            </>
          )}
        </div>

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
              <div className="mt-4 rounded-card border border-brand-200 bg-brand-50 p-5 animate-rise">
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-brand-700">
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
    <Card className="lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)] lg:overflow-hidden">
      <CardBody className="thin-scroll pt-5 lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.1em] text-muted">Passage</p>
        <h3 className="display mb-4 text-2xl">{title}</h3>
        <div className="prose-passage">
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
      <CardHeader className="flex items-start gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[0.625rem] bg-listening-soft text-listening">
          <Icon name="headphones" size={17} />
        </span>
        <div>
          <CardTitle>Recording</CardTitle>
          <p className="mt-1 text-sm text-muted">
            {durationLabel}. In the real test you hear it once, so try to answer on the first play.
          </p>
        </div>
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

        <div className="mt-5 rounded-[0.625rem] border border-line bg-paper p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">Transcript</p>
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
  current,
  marked,
  onFocus,
  onChange,
}: {
  question: ObjectiveQuestion;
  value: string;
  locked: boolean;
  current: boolean;
  marked: MarkedQuestion | null;
  onFocus: () => void;
  onChange: (value: string) => void;
}) {
  const verdict = marked ? (marked.result.correct ? "good" : "bad") : null;
  return (
    <fieldset
      onFocus={onFocus}
      onClick={onFocus}
      className={cn(
        "rounded-[0.625rem] border bg-surface p-4 ps-[1.125rem] transition-colors",
        verdict === "good" && "border-good/40 shadow-[inset_3px_0_0_var(--color-good)]",
        verdict === "bad" && "border-bad/40 shadow-[inset_3px_0_0_var(--color-bad)]",
        verdict === null && current && "border-brand-600 shadow-[inset_3px_0_0_var(--color-brand-600)]",
        verdict === null && !current && "border-line",
      )}
    >
      <legend className="sr-only">Question {question.number}</legend>
      <div className="flex items-start gap-3">
        <span className="font-mono text-sm text-brand-600">{question.number}</span>
        <div className="min-w-0 flex-1">
          <p className="text-[0.95rem] leading-relaxed">{question.prompt}</p>
          {question.kind === "text" && question.wordLimit ? (
            <p className="mt-0.5 text-xs text-muted">
              Up to {question.wordLimit} {question.wordLimit === 1 ? "word" : "words"}
            </p>
          ) : null}

          {question.kind === "radio" && question.options ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {question.options.map((option) => {
                const selected = value === option.value;
                const isAnswer = marked !== null && question.acceptedAnswers.includes(option.value);
                const wrong = marked !== null && selected && !isAnswer;
                return (
                  <label
                    key={option.value}
                    className={cn(
                      "inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors",
                      selected
                        ? "border-brand-600 bg-brand-50 text-brand-700"
                        : "border-line bg-surface hover:border-line-strong",
                      locked && "cursor-default",
                      isAnswer && "border-good bg-good-soft text-good",
                      wrong && "border-bad bg-bad-soft text-bad",
                    )}
                  >
                    <input
                      type="radio"
                      name={question.id}
                      value={option.value}
                      checked={selected}
                      disabled={locked}
                      onChange={() => onChange(option.value)}
                      className="sr-only"
                    />
                    <span
                      aria-hidden
                      className={cn(
                        "grid h-3.5 w-3.5 place-items-center rounded-full border",
                        selected || isAnswer ? "border-current" : "border-line-strong",
                      )}
                    >
                      {(selected || isAnswer) && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
                    </span>
                    <span>
                      {/* Letter prefix for A–D options; TFNG labels stand alone. */}
                      {/^[A-Z]$/.test(option.value) && (
                        <span className="me-1.5 font-semibold">{option.value}</span>
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
          <p className="display tnum text-3xl">
            {correct}
            <span className="text-base text-muted"> / {total}</span>
          </p>
        </div>
        <Progress value={pct} tone={pct >= 80 ? "good" : "brand"} className="mt-3" label="Score" />
        <p className="mt-2 text-xs text-muted">
          Five questions are too few for a band estimate. A full 40-question section is scored in
          bands on the mock test.
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
          return option ? `${v} · ${option.label}` : v;
        })
        .join(" / ")
    : question.acceptedAnswers.join(" / ");

  return (
    <li className="rounded-card border border-line bg-surface p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold">
          <span className="font-mono text-brand-600">{question.number}</span>
          <span className="ms-2">Question {question.number}</span>
        </p>
        <Badge tone={result.correct ? "good" : "bad"}>
          <Icon name={result.correct ? "check" : "x"} size={12} />
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
            {given || "No answer"}
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
        <p className="mt-2 border-s-2 border-brand-200 ps-3 font-serif text-sm italic text-muted">
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
