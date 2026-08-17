import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PlayerHeader } from "~/components/player/PlayerHeader";
import { PlayerStatus } from "~/components/player/PlayerStatus";
import { SubmitDialog } from "~/components/player/SubmitDialog";
import { Textarea } from "~/components/ui/Field";
import { cn } from "~/lib/cn";
import { countWords } from "~/lib/answer-check";
import { Protected } from "~/lib/auth";
import { usePlayerAttempt } from "~/lib/usePlayerAttempt";

export const Route = createFileRoute("/test/writing")({ component: WritingRoute });

function WritingRoute() {
  return (
    <Protected>
      <WritingPlayer />
    </Protected>
  );
}

/** Minimum word counts set by the rubric. There is no maximum. */
const MINIMUM: Record<number, number> = { 1: 150, 2: 250 };

function WritingPlayer() {
  // One clock covers both tasks: the section deadline is stamped once, by the
  // server, when the writing section starts.
  const player = usePlayerAttempt("writing");
  const [taskIndex, setTaskIndex] = useState(0);

  if (player.loading || player.error) {
    return <PlayerStatus loading={player.loading} error={player.error} />;
  }

  const group = player.groups[taskIndex];
  const question = group?.questions[0];
  const text = question ? String(player.answers[question.id] ?? "") : "";
  const words = countWords(text);
  const minimum = MINIMUM[group?.partNumber ?? 1] ?? 0;
  const underLength = words > 0 && words < minimum;

  return (
    <div className="flex h-screen flex-col bg-paper">
      <PlayerHeader
        sectionName="Writing"
        contextLabel="Task 1 and Task 2 · one 60-minute limit for both"
        remaining={player.remaining ?? 0}
        right={
          <SubmitDialog
            attemptId={player.attemptId!}
            section="writing"
            answeredCount={
              player.groups.filter((g) =>
                g.questions.some((q) => String(player.answers[q.id] ?? "").trim()),
              ).length
            }
            total={player.groups.length}
            label="Submit both tasks"
          />
        }
      />

      <PlayerStatus saving={player.saving} saveError={player.saveError} inline />

      {/* Task switcher */}
      <div className="flex items-center gap-1 border-b border-line bg-surface px-3 sm:px-5">
        {player.groups.map((g, i) => {
          const done = countWords(String(player.answers[g.questions[0]?.id ?? ""] ?? ""));
          return (
            <button
              key={g.id}
              type="button"
              onClick={() => setTaskIndex(i)}
              className={cn(
                "-mb-px border-b-2 px-4 py-3 text-sm font-medium transition-colors",
                taskIndex === i
                  ? "border-brand-600 text-brand-700"
                  : "border-transparent text-muted hover:text-ink",
              )}
            >
              {g.title}
              <span className="ml-2 text-xs tabular-nums text-muted">{done} words</span>
            </button>
          );
        })}
      </div>

      <div className="thin-scroll min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
          {/* Prompt */}
          <div className="rounded-card border border-line bg-surface p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-muted">
              {group?.instructions}
            </p>
            <div className="prose-passage mt-3 text-[1rem]">
              {group?.passageText?.split("\n\n").map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            {/* Academic Task 1 chart, uploaded to R2 by an admin. */}
            {group?.imageUrl && (
              <figure className="mt-5">
                <img
                  src={group.imageUrl}
                  alt={group.imageCaption ?? "Task 1 chart"}
                  className="mx-auto max-h-[28rem] w-full rounded-lg border border-line object-contain"
                />
                {group.imageCaption && (
                  <figcaption className="mt-2 text-center text-xs text-muted">
                    {group.imageCaption}
                  </figcaption>
                )}
              </figure>
            )}
          </div>

          {/* Response */}
          <div className="mt-5">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <label htmlFor="response" className="text-sm font-medium">
                Your response
              </label>
              <div className="flex items-center gap-3 text-xs">
                <span
                  className={cn("tabular-nums", underLength ? "text-warn" : "text-muted")}
                  aria-live="polite"
                >
                  {words} words{minimum > 0 && ` · minimum ${minimum}`}
                </span>
                <span
                  className={cn(
                    "flex items-center gap-1.5",
                    player.saving ? "text-muted" : "text-good",
                  )}
                  aria-live="polite"
                >
                  <i
                    aria-hidden
                    className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      player.saving ? "animate-pulse bg-muted" : "bg-good",
                    )}
                  />
                  {player.saving ? "Saving…" : "Saved"}
                </span>
              </div>
            </div>

            <Textarea
              id="response"
              value={text}
              onChange={(e) => question && player.setAnswer(question.id, e.target.value)}
              rows={20}
              placeholder="Start writing…"
              className="min-h-[24rem] font-serif text-[1.0625rem] leading-[1.8]"
            />

            <p className="mt-2 text-xs text-muted">
              {underLength
                ? `Responses under ${minimum} words are penalised, but you can keep writing past any length — there is no maximum.`
                : "There is no maximum length. Write as much as the task needs."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
