import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "~/components/layout/AppShell";
import { QuestionRenderer } from "~/components/renderers/QuestionRenderer";
import { Badge } from "~/components/ui/Badge";
import { Button } from "~/components/ui/Button";
import { Card, CardBody } from "~/components/ui/Card";
import { Icon } from "~/components/ui/Icon";
import { PremiumGate } from "~/lib/auth";
import { cn } from "~/lib/cn";
import { useI18n } from "~/lib/i18n";
import {
  type MistakeCard,
  type ReviewVerdict,
  useDropCard,
  useDueCards,
  useMistakeCount,
  useReviewCard,
} from "~/lib/practice-queries";
import type { Question, QuestionTypeCode } from "~/types/content";

export const Route = createFileRoute("/review")({ component: ReviewRoute });

function ReviewRoute() {
  return (
    <PremiumGate>
      <AppShell>
        <ReviewPage />
      </AppShell>
    </PremiumGate>
  );
}

function toQuestion(card: MistakeCard): Question {
  const q = card.question;
  return {
    id: q.id,
    number: 1,
    type: q.type_code as QuestionTypeCode,
    prompt: q.prompt,
    options: q.options?.length ? q.options : undefined,
    acceptedAnswers: [],
    wordLimit: q.word_limit || undefined,
    renderer: q.renderer,
    typeLabel: q.type_label,
  } as Question;
}

function ReviewPage() {
  const { t } = useI18n();
  const { data: cards, isLoading } = useDueCards();
  const { data: counts } = useMistakeCount();
  // Work through the batch fetched on load; the due query is not refetched
  // mid-session so cards do not reshuffle under the learner.
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState<Set<string>>(new Set());

  const queue = (cards ?? []).filter((c) => !done.has(c.question_id));
  const card = queue[Math.min(index, Math.max(queue.length - 1, 0))];
  const next = (id: string) => {
    setDone((d) => new Set(d).add(id));
    setIndex(0);
  };

  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{t("review.title")}</h1>
      <p className="mt-1.5 text-sm text-muted">{t("review.subtitle")}</p>

      <div className="mt-5 grid grid-cols-3 gap-3">
        <Stat label="Due now" value={isLoading ? "…" : queue.length} />
        <Stat label="In notebook" value={counts?.open ?? "…"} />
        <Stat label="Mastered" value={counts?.mastered ?? "…"} />
      </div>

      <div className="mt-6">
        {isLoading ? (
          <p className="text-sm text-muted">Loading your cards…</p>
        ) : !card ? (
          <Card>
            <CardBody className="pt-8 pb-8 text-center">
              <Icon name="sparkles" className="mx-auto h-10 w-10 text-brand-600" />
              <p className="mt-3 text-lg font-semibold">All caught up!</p>
              <p className="mt-1 text-sm text-muted">
                Nothing is due for review. Drill a question type to keep improving.
              </p>
              <Button asChild className="mt-4">
                <Link to="/drills">Go to drills</Link>
              </Button>
            </CardBody>
          </Card>
        ) : (
          <ReviewCardView key={card.question_id} card={card} onNext={() => next(card.question_id)} />
        )}
      </div>
    </>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-card border border-line bg-surface p-3">
      <p className="text-xs text-muted">{label}</p>
      <p className="text-xl font-semibold">{value}</p>
    </div>
  );
}

function BoxDots({ box }: { box: number }) {
  return (
    <span className="flex items-center gap-1" aria-label={`Box ${Math.min(box, 5)} of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={cn("h-2 w-2 rounded-full", n <= box ? "bg-brand-600" : "bg-line-strong")} />
      ))}
    </span>
  );
}

function ReviewCardView({ card, onNext }: { card: MistakeCard; onNext: () => void }) {
  const review = useReviewCard();
  const drop = useDropCard();
  const [answer, setAnswer] = useState<string | string[] | undefined>();
  const [showStimulus, setShowStimulus] = useState(false);
  const [verdict, setVerdict] = useState<ReviewVerdict | null>(null);
  const g = card.group;
  const hasStimulus = !!(g.passage_text || g.audio_url || g.image_url);

  return (
    <Card>
      <CardBody className="space-y-4 pt-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Badge tone="brand">{card.question.type_label}</Badge>
          <BoxDots box={verdict?.box ?? card.box} />
        </div>

        {g.instructions && <p className="text-sm text-ink-soft">{g.instructions}</p>}

        {hasStimulus && (
          <div>
            <button
              type="button"
              onClick={() => setShowStimulus((s) => !s)}
              className="text-sm font-medium text-brand-700"
            >
              {showStimulus ? "Hide" : "Show"} {g.audio_url ? "audio" : "passage"}
            </button>
            {showStimulus && (
              <div className="mt-2 space-y-3">
                {g.audio_url && <audio controls src={g.audio_url} className="w-full" />}
                {g.image_url && <img src={g.image_url} alt="" className="w-full rounded-card border border-line" />}
                {g.passage_text && (
                  <div className="max-h-80 overflow-y-auto rounded-card border border-line bg-paper p-4 font-serif text-sm leading-relaxed">
                    {g.passage_text.split(/\n\s*\n/).map((p, i) => (
                      <p key={i} className="mb-3 last:mb-0">
                        {p}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <QuestionRenderer question={toQuestion(card)} value={answer} onChange={setAnswer} disabled={!!verdict} />

        {card.last_answer && !verdict && (
          <p className="text-xs text-muted">Last time you answered: {card.last_answer}</p>
        )}

        {verdict && (
          <div className={cn("rounded-md p-3 text-sm", verdict.correct ? "bg-good-soft" : "bg-bad-soft")}>
            <p className={cn("flex items-center gap-1.5 font-medium", verdict.correct ? "text-good" : "text-bad")}>
              <Icon name={verdict.correct ? "check" : "x"} className="h-4 w-4" />
              {verdict.correct ? "Correct" : "Incorrect"}
            </p>
            {verdict.accepted_answers.length > 0 && (
              <p className="mt-1">Accepted: {verdict.accepted_answers.join(" / ")}</p>
            )}
            {verdict.explanation && <p className="mt-2 text-ink-soft">{verdict.explanation}</p>}
            <p className="mt-2 font-medium">
              {verdict.mastered
                ? "Mastered!"
                : verdict.next_in_days != null
                  ? `Next review in ${verdict.next_in_days} day${verdict.next_in_days === 1 ? "" : "s"}`
                  : null}
            </p>
          </div>
        )}

        {review.isError && <p className="text-sm text-bad">Could not check this answer. Please try again.</p>}

        <div className="flex flex-wrap items-center justify-between gap-2">
          {verdict ? (
            <Button onClick={onNext}>Next card</Button>
          ) : (
            <Button
              disabled={review.isPending || answer == null || (Array.isArray(answer) && !answer.length)}
              onClick={() =>
                review.mutate(
                  { questionId: card.question_id, answer: answer ?? "" },
                  { onSuccess: setVerdict },
                )
              }
            >
              {review.isPending ? "Checking…" : "Check"}
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            disabled={drop.isPending}
            onClick={() => drop.mutate(card.question_id, { onSuccess: onNext })}
          >
            Remove from notebook
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}
