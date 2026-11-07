import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PlayerHeader } from "~/components/player/PlayerHeader";
import { PlayerStatus, SaveIndicator } from "~/components/player/PlayerStatus";
import { SubmitDialog } from "~/components/player/SubmitDialog";
import { usePassageSize } from "~/components/player/usePassageSize";
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
  const textSize = usePassageSize();

  if (player.loading || player.error) {
    return <PlayerStatus loading={player.loading} error={player.error} />;
  }

  const group = player.groups[taskIndex];
  const question = group?.questions[0];
  const text = question ? String(player.answers[question.id] ?? "") : "";
  const words = countWords(text);
  const minimum = MINIMUM[group?.partNumber ?? 1] ?? 0;
  const underLength = words > 0 && words < minimum;
  const tasksWithText = player.groups.filter((g) =>
    g.questions.some((q) => String(player.answers[q.id] ?? "").trim()),
  ).length;

  return (
    <div className="flex h-screen flex-col bg-paper" style={textSize.style}>
      <PlayerHeader
        section="writing"
        sectionName="Writing"
        contextLabel="Task 1 and Task 2 · one 60-minute clock for both"
        remaining={player.remaining ?? 0}
        textSizeIndex={textSize.index}
        onTextSize={textSize.setIndex}
        right={
          <SubmitDialog
            attemptId={player.attemptId!}
            section="writing"
            answeredCount={tasksWithText}
            total={player.groups.length}
            unit="tasks"
            label="Submit both tasks"
          />
        }
      />

      <PlayerStatus saveError={player.saveError} inline />

      {/* Task switcher */}
      <div className="flex gap-0.5 border-b border-line bg-surface px-3 sm:px-5" role="tablist">
        {player.groups.map((g, i) => {
          const done = countWords(String(player.answers[g.questions[0]?.id ?? ""] ?? ""));
          return (
            <button
              key={g.id}
              type="button"
              role="tab"
              aria-selected={taskIndex === i}
              onClick={() => setTaskIndex(i)}
              className={cn(
                "-mb-px flex items-center gap-2 border-b-2 px-3.5 py-3 text-sm font-semibold transition-colors",
                taskIndex === i
                  ? "border-brand-600 text-brand-700"
                  : "border-transparent text-muted hover:text-ink",
              )}
            >
              {g.title}
              <span className="tnum font-mono text-[0.6875rem] font-medium text-muted">
                {done} words
              </span>
            </button>
          );
        })}
      </div>

      <div className="grid min-h-0 flex-1 grid-rows-[auto_minmax(0,1fr)] md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] md:grid-rows-1">
        {/* Prompt */}
        <section
          className="thin-scroll max-h-[38vh] overflow-y-auto border-b border-line bg-surface px-5 py-5 md:max-h-none md:border-b-0 md:border-r md:px-8 md:py-6"
          aria-label="Task prompt"
        >
          <div className="mx-auto max-w-[62ch]">
            <div className="mb-4 rounded-[0.5625rem] border border-line bg-paper px-3.5 py-2.5 text-[0.8125rem] leading-relaxed text-ink-soft">
              {group?.instructions}
            </div>
            <div className="prose-passage">
              {group?.passageText?.split("\n\n").map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            {/* Academic Task 1 chart, uploaded to R2 by an admin. */}
            {group?.imageUrl && (
              <figure className="mt-5 rounded-[0.625rem] border border-line bg-paper p-3">
                <img
                  src={group.imageUrl}
                  alt={group.imageCaption ?? "Task 1 chart"}
                  className="mx-auto max-h-[26rem] w-full rounded-md object-contain"
                />
                {group.imageCaption && (
                  <figcaption className="mt-2 text-center text-xs text-muted">
                    {group.imageCaption}
                  </figcaption>
                )}
              </figure>
            )}
          </div>
        </section>

        {/* Response */}
        <section className="flex min-h-0 flex-col p-3 sm:p-4 md:p-5" aria-label="Your response">
          <label htmlFor="response" className="sr-only">
            Your response
          </label>
          <textarea
            id="response"
            value={text}
            onChange={(e) => question && player.setAnswer(question.id, e.target.value)}
            placeholder="Start writing. Your work saves as you type."
            className="prose-passage min-h-[14rem] w-full flex-1 resize-none rounded-t-xl border border-line-strong bg-surface px-5 py-4 placeholder:text-muted/70 focus:border-brand-500 focus:outline-none sm:px-6 sm:py-5"
          />
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 rounded-b-xl border border-t-0 border-line-strong bg-surface px-4 py-2.5 text-xs text-muted">
            <span className={cn("tnum", underLength ? "font-semibold text-warn" : "")} aria-live="polite">
              {words} words{minimum > 0 && ` · minimum ${minimum}`}
            </span>
            <span className="hidden sm:inline">
              {underLength
                ? `Responses under ${minimum} words are penalised. There is no maximum.`
                : "No maximum. Write as much as the task needs."}
            </span>
            <SaveIndicator saving={player.saving} />
          </div>
        </section>
      </div>
    </div>
  );
}
