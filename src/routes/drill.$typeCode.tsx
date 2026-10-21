import { Link, createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { AppShell } from "~/components/layout/AppShell";
import { QuestionRenderer } from "~/components/renderers/QuestionRenderer";
import { Button } from "~/components/ui/Button";
import { Card, CardBody } from "~/components/ui/Card";
import { Icon } from "~/components/ui/Icon";
import { Protected } from "~/lib/auth";
import { cn } from "~/lib/cn";
import {
  type DrillGroup,
  type DrillQuestion,
  type DrillResult,
  useStartDrill,
  useSubmitDrill,
} from "~/lib/practice-queries";
import { useQuestionTypes } from "~/lib/queries";
import type { Question, QuestionTypeCode, RendererKey } from "~/types/content";

export const Route = createFileRoute("/drill/$typeCode")({
  validateSearch: (s: Record<string, unknown>): { difficulty?: string } =>
    typeof s.difficulty === "string" && s.difficulty ? { difficulty: s.difficulty } : {},
  component: DrillRoute,
});

function DrillRoute() {
  return (
    <Protected>
      <AppShell>
        <DrillPage />
      </AppShell>
    </Protected>
  );
}

/** Edge Function errors arrive as FunctionsHttpError with the JSON body on `context`. */
async function functionErrorCode(err: unknown): Promise<string> {
  const ctx = (err as { context?: Response })?.context;
  if (ctx && typeof ctx.json === "function") {
    try {
      const body = await ctx.clone().json();
      if (body?.error) return String(body.error);
    } catch {
      /* not JSON */
    }
  }
  return (err as Error)?.message ?? "unknown_error";
}

function toQuestion(q: DrillQuestion, index: number, renderer?: RendererKey): Question {
  return {
    id: q.id,
    number: index + 1,
    type: q.type_code as QuestionTypeCode,
    prompt: q.prompt,
    options: q.options?.length ? q.options : undefined,
    acceptedAnswers: [],
    wordLimit: q.word_limit || undefined,
    renderer,
  } as Question;
}

function fmtAnswer(a: string | string[] | undefined | null) {
  if (a == null || (Array.isArray(a) && !a.length) || a === "") return "No answer";
  return Array.isArray(a) ? a.join(", ") : a;
}

function DrillPage() {
  const { typeCode } = Route.useParams();
  const { difficulty } = Route.useSearch();
  const start = useStartDrill();
  const submit = useSubmitDrill();
  const { data: types } = useQuestionTypes();
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [result, setResult] = useState<DrillResult | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const started = useRef(false);

  const begin = () => {
    setAnswers({});
    setResult(null);
    setErrorCode(null);
    submit.reset();
    start.mutate(
      { typeCode, difficulty },
      { onError: async (e) => setErrorCode(await functionErrorCode(e)) },
    );
    window.scrollTo?.({ top: 0 });
  };

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    begin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const type = types?.find((t) => t.code === typeCode);
  const label = type?.label ?? typeCode.replace(/_/g, " ");
  const drill = start.data;

  if (errorCode) {
    return (
      <Card className="mx-auto max-w-xl">
        <CardBody className="pt-6 text-center">
          {errorCode === "no_free_content_for_type" ? (
            <>
              <Icon name="lock" className="mx-auto h-8 w-8 text-brand-600" />
              <p className="mt-3 font-medium">You've finished the free sets for {label}</p>
              <p className="mt-1 text-sm text-muted">Upgrade to Premium to keep drilling this type.</p>
              <Button asChild className="mt-4">
                <Link to={"/pricing" as never}>See plans</Link>
              </Button>
            </>
          ) : errorCode === "no_content_for_type" ? (
            <>
              <p className="font-medium">No practice sets for {label} yet</p>
              <p className="mt-1 text-sm text-muted">We're adding more content — try another question type for now.</p>
            </>
          ) : (
            <>
              <p className="font-medium">Something went wrong starting this drill</p>
              <p className="mt-1 text-sm text-muted">{errorCode}</p>
              <Button className="mt-4" variant="outline" onClick={begin}>
                Try again
              </Button>
            </>
          )}
          <div className="mt-4">
            <Link to="/practice" className="text-sm font-medium text-brand-700">
              Back to practice
            </Link>
          </div>
        </CardBody>
      </Card>
    );
  }

  if (start.isPending || !drill) return <p className="text-sm text-muted">Preparing your drill…</p>;

  const questions = [...drill.questions].sort((a, b) => a.order_index - b.order_index);

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
        <div>
          <Link to="/practice" className="text-xs text-muted hover:text-ink">
            ← Practice
          </Link>
          <h1 className="text-xl font-semibold tracking-tight">{label}</h1>
        </div>
        {result && (
          <div className="flex gap-2">
            <Button onClick={begin}>Another set</Button>
            <Button asChild variant="outline">
              <Link to="/practice">Back to practice</Link>
            </Button>
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Stimulus group={drill.group} />
        <div className="space-y-4">
          {result && (
            <Card>
              <CardBody className="pt-5">
                <p className="text-sm text-muted">Your score</p>
                <p className="text-3xl font-semibold">
                  {result.correct}/{result.total}
                </p>
              </CardBody>
            </Card>
          )}
          {drill.group.instructions && <p className="text-sm text-ink-soft">{drill.group.instructions}</p>}
          {questions.map((q, i) => {
            const review = result?.review.find((r) => r.question_id === q.id);
            return (
              <div
                key={q.id}
                className={cn(
                  "rounded-card border bg-surface p-4",
                  review ? (review.correct ? "border-good/40" : "border-bad/40") : "border-line",
                )}
              >
                <QuestionRenderer
                  question={toQuestion(q, i, type?.renderer)}
                  value={answers[q.id]}
                  onChange={(v) => setAnswers((a) => ({ ...a, [q.id]: v }))}
                  disabled={!!result}
                />
                {review && (
                  <div className={cn("mt-3 rounded-md p-3 text-sm", review.correct ? "bg-good-soft" : "bg-bad-soft")}>
                    <p className={cn("flex items-center gap-1.5 font-medium", review.correct ? "text-good" : "text-bad")}>
                      <Icon name={review.correct ? "check" : "x"} className="h-4 w-4" />
                      {review.correct ? "Correct" : "Incorrect"}
                    </p>
                    <p className="mt-1">Your answer: {fmtAnswer(review.answer)}</p>
                    {review.accepted_answers.length > 0 && (
                      <p className="mt-1">Accepted: {review.accepted_answers.join(" / ")}</p>
                    )}
                    {review.explanation && <p className="mt-2 text-ink-soft">{review.explanation}</p>}
                  </div>
                )}
              </div>
            );
          })}
          {!result && (
            <Button
              size="lg"
              disabled={submit.isPending}
              onClick={() =>
                submit.mutate({ drillId: drill.drill_id, answers }, { onSuccess: (r) => setResult(r) })
              }
            >
              {submit.isPending ? "Checking…" : "Submit answers"}
            </Button>
          )}
          {submit.isError && <p className="text-sm text-bad">Could not submit. Please try again.</p>}
          {result?.transcript && <Transcript text={result.transcript} />}
        </div>
      </div>
    </>
  );
}

function Stimulus({ group }: { group: Pick<DrillGroup, "passage_text" | "audio_url" | "image_url"> & { image_caption?: string | null } }) {
  return (
    <div className="space-y-4 lg:sticky lg:top-4 lg:self-start">
      {group.audio_url && <AudioPlayer src={group.audio_url} />}
      {group.image_url && (
        <figure>
          <img src={group.image_url} alt={group.image_caption ?? ""} className="w-full rounded-card border border-line" />
          {group.image_caption && <figcaption className="mt-1.5 text-xs text-muted">{group.image_caption}</figcaption>}
        </figure>
      )}
      {group.passage_text && (
        <div className="max-h-[70vh] overflow-y-auto rounded-card border border-line bg-surface p-5 font-serif leading-relaxed">
          {group.passage_text.split(/\n\s*\n/).map((p, i) => (
            <p key={i} className="mb-3 last:mb-0">
              {p}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

function AudioPlayer({ src }: { src: string }) {
  const ref = useRef<HTMLAudioElement>(null);
  const [rate, setRate] = useState(1);
  return (
    <div className="rounded-card border border-line bg-surface p-3">
      <audio ref={ref} controls src={src} className="w-full" />
      <label className="mt-2 flex items-center gap-2 text-xs text-muted">
        Speed
        <select
          value={rate}
          onChange={(e) => {
            const r = Number(e.target.value);
            setRate(r);
            if (ref.current) ref.current.playbackRate = r;
          }}
          className="rounded border border-line-strong bg-surface px-1.5 py-0.5"
        >
          {[0.75, 1, 1.25].map((r) => (
            <option key={r} value={r}>
              {r}×
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

function Transcript({ text }: { text: string }) {
  return (
    <details className="rounded-card border border-line bg-surface p-4">
      <summary className="cursor-pointer text-sm font-medium">Transcript</summary>
      <div className="mt-3 space-y-1.5 text-sm leading-relaxed">
        {text.split("\n").filter(Boolean).map((line, i) => {
          const m = line.match(/^([A-Z][A-Za-z .'-]{0,30}):\s*(.*)$/);
          return (
            <p key={i}>
              {m ? (
                <>
                  <strong>{m[1]}:</strong> {m[2]}
                </>
              ) : (
                line
              )}
            </p>
          );
        })}
      </div>
    </details>
  );
}
