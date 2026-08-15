import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PlayerHeader } from "~/components/player/PlayerHeader";
import { SubmitDialog } from "~/components/player/SubmitDialog";
import { Textarea } from "~/components/ui/Field";
import { cn } from "~/lib/cn";
import { countWords } from "~/lib/text";
import { useCountdown } from "~/lib/useCountdown";
import { getSection } from "~/mock/testForm";

export const Route = createFileRoute("/test/writing")({ component: WritingPlayer });

/** Minimum word counts set by the rubric. There is no maximum. */
const MINIMUM: Record<number, number> = { 1: 150, 2: 250 };

type SaveState = "saved" | "saving";

function WritingPlayer() {
  const section = getSection("writing");
  const [taskIndex, setTaskIndex] = useState(0);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [saveState, setSaveState] = useState<SaveState>("saved");

  // One clock covers both tasks -- the candidate divides the hour themselves.
  const { remaining } = useCountdown(section.durationMinutes * 60);

  const group = section.itemGroups[taskIndex];
  const text = drafts[group.id] ?? "";
  const words = countWords(text);
  const minimum = MINIMUM[group.partNumber] ?? 0;
  const underLength = words > 0 && words < minimum;

  // TODO(backend): replace the timer with a debounced write to the attempts table.
  useEffect(() => {
    if (!text) return;
    setSaveState("saving");
    const id = setTimeout(() => setSaveState("saved"), 700);
    return () => clearTimeout(id);
  }, [text]);

  return (
    <div className="flex h-screen flex-col bg-paper">
      <PlayerHeader
        sectionName="Writing"
        contextLabel="Task 1 and Task 2 · one 60-minute limit for both"
        remaining={remaining}
        right={<SubmitDialog answeredCount={Object.keys(drafts).length} total={2} label="Submit both tasks" />}
      />

      {/* Task switcher */}
      <div className="flex items-center gap-1 border-b border-line bg-surface px-3 sm:px-5">
        {section.itemGroups.map((g, i) => {
          const done = countWords(drafts[g.id] ?? "");
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
              <span className="ml-2 text-xs tabular-nums text-muted">
                {done} words
              </span>
            </button>
          );
        })}
      </div>

      <div className="thin-scroll min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
          {/* Prompt */}
          <div className="rounded-card border border-line bg-surface p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-muted">
              {group.instructions}
            </p>
            <div className="prose-passage mt-3 text-[1rem]">
              {group.passageText?.split("\n\n").map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            {/* Image slot for Academic Task 1 charts. */}
            {group.imageUrl && (
              <figure className="mt-5">
                <div className="grid min-h-56 place-items-center rounded-lg border border-dashed border-line-strong bg-paper p-6 text-center">
                  {/* TODO(backend): render the uploaded chart from R2 here. */}
                  <div>
                    <p className="text-3xl" aria-hidden>
                      📊
                    </p>
                    <p className="mt-2 text-sm font-medium">Chart</p>
                    <p className="mt-1 text-xs text-muted">{group.imageCaption}</p>
                  </div>
                </div>
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
                  className={cn(
                    "tabular-nums",
                    underLength ? "text-warn" : "text-muted",
                  )}
                  aria-live="polite"
                >
                  {words} words
                  {minimum > 0 && ` · minimum ${minimum}`}
                </span>
                <span
                  className={cn(
                    "flex items-center gap-1.5",
                    saveState === "saved" ? "text-good" : "text-muted",
                  )}
                  aria-live="polite"
                >
                  <i
                    aria-hidden
                    className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      saveState === "saved" ? "bg-good" : "animate-pulse bg-muted",
                    )}
                  />
                  {saveState === "saved" ? "Saved" : "Saving…"}
                </span>
              </div>
            </div>

            <Textarea
              id="response"
              value={text}
              onChange={(e) =>
                setDrafts((prev) => ({ ...prev, [group.id]: e.target.value }))
              }
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
