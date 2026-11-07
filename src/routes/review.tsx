import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell, PageHeader } from "~/components/layout/AppShell";
import { QuestionRenderer } from "~/components/renderers/QuestionRenderer";
import { Badge } from "~/components/ui/Badge";
import { Button } from "~/components/ui/Button";
import { Card, CardBody } from "~/components/ui/Card";
import { EmptyState, SkeletonRows } from "~/components/ui/EmptyState";
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
      <PageHeader title={t("review.title")} subtitle={t("review.subtitle")} />

      <div className="grid grid-cols-3 gap-3">
        <Stat label="Due now" value={isLoading ? "…" : queue.length} accent />
        <Stat label="In notebook" value={counts?.open ?? "…"} />
        <Stat label="Mastered" value={counts?.mastered ?? "…"} />
      </div>

      <div className="mt-6">
        {isLoading ? (
          <SkeletonRows rows={3} />
        ) : !card ? (
          <EmptyState
            title="All caught up"
            body="Nothing is due for review. Drill a question type to keep improving."
            action={
              <Button asChild>
                <Link to="/drills">Go to drills</Link>
              </Button>
            }
          />
        ) : (
          <ReviewCardView key={card.question_id} card={card} onNext={() => next(card.question_id)} />
        )}
      </div>
    </>
  );
}

function Stat({ label, value, accent = false }: { label: string; value: number | string; accent?: boolean }) {
  return (
    <div className={cn("rounded-card border px-4 py-3", accent ? "border-brand-600 bg-brand-50" : "border-line bg-surface")}>
      <p className={cn("text-xs", accent ? "text-brand-700" : "text-muted")}>{label}</p>
      <p className="display tnum text-2xl">{value}</p>
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
    <Card className={cn(verdict && (verdict.correct ? "border-good/40" : "border-bad/40"))}>
      <CardBody className="grid gap-4 pt-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Badge tone="brand">{card.question.type_label}</Badge>
          <BoxDots box={verdict?.box ?? card.box} />
        </div>

        {g.instructions && (
          <div className="rounded-[0.625rem] border border-line bg-paper px-4 py-3 text-sm leading-relaxed text-ink-soft">
            {g.instructions}
          </div>
        )}

        {hasStimulus && (
          <div>
            <button
              type="button"
              onClick={() => setShowStimulus((s) => !s)}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-700"
              aria-expanded={showStimulus}
            >
              <Icon name={showStimulus ? "eyeOff" : "eye"} size={15} />
              {showStimulus ? "Hide" : "Show"} {g.audio_url ? "audio" : "passage"}
            </button>
            {showStimulus && (
              <div className="mt-2 grid gap-3">
                {g.audio_url && <audio controls src={g.audio_url} className="w-full" />}
                {g.image_url && <img src={g.image_url} alt="" className="w-full rounded-card border border-line" />}
                {g.passage_text && (
                  <div className="thin-scroll max-h-80 overflow-y-auto rounded-card border border-line bg-paper p-4">
                    <div className="prose-passage text-[0.95rem]">
                      {g.passage_text.split(/\n\s*\n/).map((p, i) => (
                        <p key={i}>{p}</p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div className="rounded-[0.625rem] border border-line p-4">
          <QuestionRenderer question={toQuestion(card)} value={answer} onChange={setAnswer} disabled={!!verdict} />
        </div>

        {card.last_answer && !verdict && (
          <p className="text-xs text-muted">Last time you answered: {card.last_answer}</p>
        )}

        {verdict && (
          <div className="rounded-[0.625rem] bg-paper p-4 text-sm">
            <p className={cn("flex items-center gap-1.5 font-semibold", verdict.correct ? "text-good" : "text-bad")}>
              <Icon name={verdict.correct ? "check" : "x"} size={16} />
              {verdict.correct ? "Correct" : "Incorrect"}
            </p>
            {verdict.accepted_answers.length > 0 && (
              <p className="mt-1">
                <span className="text-xs uppercase tracking-wide text-muted">Accepted </span>
                <span className="font-medium text-good">{verdict.accepted_answers.join(" / ")}</span>
              </p>
            )}
            {verdict.explanation && <p className="mt-2 leading-relaxed text-ink-soft">{verdict.explanation}</p>}
            <p className="mt-2 font-medium">
              {verdict.mastered
                ? "Mastered"
                : verdict.next_in_days != null
                  ? `Next review in ${verdict.next_in_days} day${verdict.next_in_days === 1 ? "" : "s"}`
                  : null}
            </p>
          </div>
        )}

        {review.isError && <p className="text-sm text-bad">Could not check this answer. Please try again.</p>}

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line pt-4">
          {verdict ? (
            <Button onClick={onNext}>
              Next card <Icon name="arrowRight" size={14} className="rtl:rotate-180" />
            </Button>
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
            variant="outline"
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
