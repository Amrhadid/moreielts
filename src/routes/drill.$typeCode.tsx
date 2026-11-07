import { Link, createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { AppShell } from "~/components/layout/AppShell";
import { QuestionRenderer } from "~/components/renderers/QuestionRenderer";
import { Button } from "~/components/ui/Button";
import { Card, CardBody } from "~/components/ui/Card";
import { Skeleton } from "~/components/ui/EmptyState";
import { Icon } from "~/components/ui/Icon";
import { PremiumGate } from "~/lib/auth";
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
    <PremiumGate>
      <AppShell wide>
        <DrillPage />
      </AppShell>
    </PremiumGate>
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
  const [current, setCurrent] = useState<string | null>(null);
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
          {errorCode === "premium_required" ? (
            <>
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-warn-soft text-warn">
                <Icon name="lock" size={22} />
              </span>
              <p className="mt-3 font-semibold">Drills are part of Premium</p>
              <p className="mt-1 text-sm text-muted">Enter your access code to drill {label}.</p>
              <Button asChild className="mt-4">
                <Link to={"/pricing" as never}>Enter a code</Link>
              </Button>
            </>
          ) : errorCode === "no_content_for_type" ? (
            <>
              <p className="font-semibold">No practice sets for {label} yet</p>
              <p className="mt-1 text-sm text-muted">
                None of the {label} sets match your exam type yet. Try another question type, or
                change your exam type under Study plan to see every set.
              </p>
            </>
          ) : (
            <>
              <p className="font-semibold">Something went wrong starting this drill</p>
              <p className="mt-1 text-sm text-muted">{errorCode}</p>
              <Button className="mt-4" variant="outline" onClick={begin}>
                Try again
              </Button>
            </>
          )}
          <div className="mt-4">
            <Link to="/drills" className="text-sm font-medium text-brand-700">
              Back to drills
            </Link>
          </div>
        </CardBody>
      </Card>
    );
  }

  if (start.isPending || !drill) {
    return (
      <div role="status" aria-label="Preparing your drill" className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-80 rounded-card" />
        <div className="grid gap-3">
          <Skeleton className="h-12 rounded-[0.625rem]" />
          <Skeleton className="h-28 rounded-[0.625rem]" />
          <Skeleton className="h-28 rounded-[0.625rem]" />
        </div>
      </div>
    );
  }

  const questions = [...drill.questions].sort((a, b) => a.order_index - b.order_index);
  const answeredCount = questions.filter((q) => {
    const a = answers[q.id];
    return Array.isArray(a) ? a.length > 0 : Boolean(a && String(a).trim());
  }).length;

  return (
    <>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <Link to="/drills" className="inline-flex items-center gap-1 text-sm font-medium text-muted hover:text-ink">
            <Icon name="arrowRight" size={14} className="rotate-180 rtl:rotate-0" />
            Drills
          </Link>
          <h1 className="display mt-2 text-[1.75rem] leading-tight sm:text-[2rem]">{label}</h1>
          <p className="mt-1 text-sm text-muted">
            {questions.length} questions · marked on the server · explained afterwards
          </p>
        </div>
        {result && (
          <div className="flex gap-2">
            <Button onClick={begin}>Another set</Button>
            <Button asChild variant="outline">
              <Link to="/drills">Back to drills</Link>
            </Button>
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Stimulus group={drill.group} />
        <div className="grid gap-3 content-start">
          {result && (
            <Card className="animate-rise">
              <CardBody className="flex items-baseline justify-between pt-5">
                <p className="text-sm font-semibold">Your score</p>
                <p className="display tnum text-3xl">
                  {result.correct}
                  <span className="text-base text-muted"> / {result.total}</span>
                </p>
              </CardBody>
            </Card>
          )}
          {drill.group.instructions && (
            <div className="rounded-[0.625rem] border border-line bg-surface px-4 py-3 text-sm leading-relaxed text-ink-soft">
              {drill.group.instructions}
            </div>
          )}
          {questions.map((q, i) => {
            const review = result?.review.find((r) => r.question_id === q.id);
            const isCurrent = !result && current === q.id;
            return (
              <div
                key={q.id}
                onFocus={() => setCurrent(q.id)}
                onClick={() => setCurrent(q.id)}
                className={cn(
                  "rounded-[0.625rem] border bg-surface p-4 ps-[1.125rem] transition-colors",
                  review
                    ? review.correct
                      ? "border-good/40 shadow-[inset_3px_0_0_var(--color-good)]"
                      : "border-bad/40 shadow-[inset_3px_0_0_var(--color-bad)]"
                    : isCurrent
                      ? "border-brand-600 shadow-[inset_3px_0_0_var(--color-brand-600)]"
                      : "border-line",
                )}
              >
                <div className="mb-2 flex items-baseline gap-2">
                  <span className="font-mono text-sm text-brand-600">{i + 1}</span>
                  <p className="text-sm leading-relaxed">{q.prompt}</p>
                </div>
                <QuestionRenderer
                  question={{ ...toQuestion(q, i, type?.renderer), prompt: "" }}
                  value={answers[q.id]}
                  onChange={(v) => setAnswers((a) => ({ ...a, [q.id]: v }))}
                  disabled={!!result}
                />
                {review && (
                  <div className="mt-3 rounded-lg bg-paper p-3 text-sm">
                    <p className={cn("flex items-center gap-1.5 font-semibold", review.correct ? "text-good" : "text-bad")}>
                      <Icon name={review.correct ? "check" : "x"} size={16} />
                      {review.correct ? "Correct" : "Incorrect"}
                    </p>
                    <dl className="mt-2 grid gap-1 sm:grid-cols-2">
                      <div>
                        <dt className="text-xs uppercase tracking-wide text-muted">Your answer</dt>
                        <dd className={cn("font-medium", !review.correct && "line-through")}>{fmtAnswer(review.answer)}</dd>
                      </div>
                      {review.accepted_answers.length > 0 && (
                        <div>
                          <dt className="text-xs uppercase tracking-wide text-muted">Accepted</dt>
                          <dd className="font-medium text-good">{review.accepted_answers.join(" / ")}</dd>
                        </div>
                      )}
                    </dl>
                    {review.explanation && <p className="mt-2 leading-relaxed text-ink-soft">{review.explanation}</p>}
                  </div>
                )}
              </div>
            );
          })}
          {!result && (
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
              <p className="tnum text-sm text-muted">
                {answeredCount} of {questions.length} answered
              </p>
              <Button
                size="lg"
                disabled={submit.isPending}
                onClick={() =>
                  submit.mutate({ drillId: drill.drill_id, answers }, { onSuccess: (r) => setResult(r) })
                }
              >
                {submit.isPending ? "Checking…" : "Submit answers"}
              </Button>
            </div>
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
    <div className="grid gap-4 lg:sticky lg:top-6 lg:self-start">
      {group.audio_url && <AudioPlayer src={group.audio_url} />}
      {group.image_url && (
        <figure>
          <img src={group.image_url} alt={group.image_caption ?? ""} className="w-full rounded-card border border-line" />
          {group.image_caption && <figcaption className="mt-1.5 text-xs text-muted">{group.image_caption}</figcaption>}
        </figure>
      )}
      {group.passage_text && (
        <div className="thin-scroll max-h-[70vh] overflow-y-auto rounded-card border border-line bg-surface p-6">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.1em] text-muted">Passage</p>
          <div className="prose-passage">
            {group.passage_text.split(/\n\s*\n/).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function AudioPlayer({ src }: { src: string }) {
  const ref = useRef<HTMLAudioElement>(null);
  const [rate, setRate] = useState(1);
  return (
    <div className="rounded-card border border-line bg-surface p-4">
      <div className="mb-3 flex items-center gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-[0.625rem] bg-listening-soft text-listening">
          <Icon name="headphones" size={17} />
        </span>
        <div>
          <p className="text-sm font-semibold">Recording</p>
          <p className="text-xs text-muted">Drills let you replay. The mock test plays once.</p>
        </div>
      </div>
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
          className="rounded-md border border-line-strong bg-surface px-1.5 py-0.5 text-ink"
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
      <summary className="cursor-pointer text-sm font-semibold">Transcript</summary>
      <div className="mt-3 grid gap-1.5 text-sm leading-relaxed">
        {text.split("\n").filter(Boolean).map((line, i) => {
          const m = line.match(/^([A-Z][A-Za-z .'-]{0,30}):\s*(.*)$/);
          return (
            <p key={i}>
              {m ? (
                <>
                  <strong className="text-ink-soft">{m[1]}:</strong> {m[2]}
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
