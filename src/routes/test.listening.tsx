import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { PlayerHeader } from "~/components/player/PlayerHeader";
import { QuestionBlock } from "~/components/player/QuestionBlock";
import { QuestionNavigator } from "~/components/player/QuestionNavigator";
import { SubmitDialog } from "~/components/player/SubmitDialog";
import { useAnswers } from "~/components/player/useAnswers";
import { Button } from "~/components/ui/Button";
import { cn } from "~/lib/cn";
import { formatClock } from "~/lib/text";
import { useCountdown } from "~/lib/useCountdown";
import { flatQuestions, getSection } from "~/mock/testForm";

export const Route = createFileRoute("/test/listening")({
  component: ListeningPlayer,
});

/** Stand-in duration per part. TODO(backend): read from the audio metadata. */
const PART_SECONDS = 420;

/**
 * Audio pane. IELTS listening audio plays exactly once: there is no scrub bar,
 * no replay and no pause. The progress bar is display-only.
 *
 * TODO(backend): swap the simulated ticker for an <audio> element pointed at
 * the group's R2 object URL, with controls suppressed.
 */
function AudioPane({
  partNumber,
  totalParts,
  title,
}: {
  partNumber: number;
  totalParts: number;
  title: string;
}) {
  const [state, setState] = useState<"idle" | "playing" | "finished">("idle");
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    setState("idle");
    setElapsed(0);
  }, [partNumber]);

  useEffect(() => {
    if (state !== "playing") return;
    const id = setInterval(() => {
      setElapsed((prev) => {
        if (prev >= PART_SECONDS - 1) {
          clearInterval(id);
          setState("finished");
          return PART_SECONDS;
        }
        return prev + 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [state]);

  const pct = (elapsed / PART_SECONDS) * 100;

  return (
    <div className="mx-auto max-w-md text-center">
      <p className="text-xs font-medium uppercase tracking-wide text-muted">
        Part {partNumber} of {totalParts}
      </p>
      <h2 className="mt-1 text-xl font-semibold tracking-tight">{title}</h2>

      <div
        aria-hidden
        className={cn(
          "mx-auto my-8 grid h-32 w-32 place-items-center rounded-full border-4 transition-colors",
          state === "playing"
            ? "animate-pulse border-brand-200 bg-brand-50 text-brand-600"
            : "border-line bg-surface text-muted",
        )}
      >
        <span className="text-4xl">{state === "finished" ? "✓" : "🎧"}</span>
      </div>

      {state === "idle" && (
        <>
          <Button size="lg" onClick={() => setState("playing")}>
            Play audio
          </Button>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            The recording plays <strong className="text-ink">once only</strong>. You
            cannot pause, rewind or replay it. Answer as you listen.
          </p>
        </>
      )}

      {state !== "idle" && (
        <div>
          {/* Display-only: not a slider, and it carries no click handler. */}
          <div
            className="h-2 w-full overflow-hidden rounded-full bg-line"
            role="progressbar"
            aria-label="Audio progress"
            aria-valuenow={Math.round(pct)}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full bg-brand-600 transition-[width] duration-1000 ease-linear"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="mt-2 font-mono text-xs tabular-nums text-muted">
            {formatClock(elapsed)} / {formatClock(PART_SECONDS)}
          </p>
          <p className="mt-4 text-sm text-muted">
            {state === "playing"
              ? "Playing — this recording will not be repeated."
              : "This part has finished. Check your answers before moving on."}
          </p>
        </div>
      )}
    </div>
  );
}

function ListeningPlayer() {
  const section = getSection("listening");
  const items = useMemo(() => flatQuestions("listening"), []);
  const numbers = useMemo(() => items.map((i) => i.question.number), [items]);
  const idFor = useMemo(() => {
    const map = new Map(items.map((i) => [i.question.number, i.question.id]));
    return (n: number) => map.get(n) ?? "";
  }, [items]);

  const { answers, setAnswer, current, jumpTo, answered, registerRef } = useAnswers(
    numbers,
    idFor,
  );
  const { remaining } = useCountdown(section.durationMinutes * 60);
  const [mobilePane, setMobilePane] = useState<"audio" | "questions">("audio");

  const currentGroup =
    items.find((i) => i.question.number === current)?.group ?? section.itemGroups[0];
  const partIndex = section.itemGroups.indexOf(currentGroup);

  function goToPart(index: number) {
    const group = section.itemGroups[index];
    if (group) jumpTo(group.questions[0].number);
  }

  return (
    <div className="flex h-screen flex-col bg-paper">
      <PlayerHeader
        sectionName="Listening"
        contextLabel={`Part ${currentGroup.partNumber} of ${section.itemGroups.length} · Question ${current} of 40`}
        remaining={remaining}
        right={<SubmitDialog answeredCount={answered.size} total={numbers.length} />}
      />

      <div className="flex border-b border-line bg-surface md:hidden">
        {(["audio", "questions"] as const).map((pane) => (
          <button
            key={pane}
            type="button"
            onClick={() => setMobilePane(pane)}
            className={cn(
              "flex-1 py-2.5 text-sm font-medium capitalize transition-colors",
              mobilePane === pane
                ? "border-b-2 border-brand-600 text-brand-700"
                : "text-muted",
            )}
          >
            {pane}
          </button>
        ))}
      </div>

      <div className="flex min-h-0 flex-1 md:divide-x md:divide-line">
        <section
          className={cn(
            "min-h-0 overflow-y-auto bg-surface px-5 py-10 md:block md:w-1/2 md:px-8",
            mobilePane === "audio" ? "block w-full" : "hidden",
          )}
          aria-label="Audio"
        >
          <AudioPane
            key={currentGroup.id}
            partNumber={currentGroup.partNumber}
            totalParts={section.itemGroups.length}
            title={currentGroup.title.replace(/^Part \d+ — /, "")}
          />
        </section>

        {/* Only the current part's questions are shown, as in the real test. */}
        <section
          className={cn(
            "thin-scroll min-h-0 overflow-y-auto px-4 py-6 md:block md:w-1/2 md:px-6",
            mobilePane === "questions" ? "block w-full" : "hidden",
          )}
          aria-label="Questions"
        >
          <div className="mx-auto max-w-2xl">
            <QuestionBlock
              group={currentGroup}
              answers={answers}
              onAnswer={setAnswer}
              current={current}
              registerRef={registerRef}
            />
            <div className="flex items-center justify-between gap-3 pb-4">
              <Button
                variant="outline"
                onClick={() => goToPart(partIndex - 1)}
                disabled={partIndex <= 0}
              >
                ← Previous part
              </Button>
              <Button
                variant="outline"
                onClick={() => goToPart(partIndex + 1)}
                disabled={partIndex >= section.itemGroups.length - 1}
              >
                Next part →
              </Button>
            </div>
          </div>
        </section>
      </div>

      <QuestionNavigator
        numbers={numbers}
        answered={answered}
        current={current}
        onJump={(n) => {
          setMobilePane("questions");
          jumpTo(n);
        }}
      />
    </div>
  );
}
