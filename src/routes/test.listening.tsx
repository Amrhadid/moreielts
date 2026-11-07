import { createFileRoute } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PlayerHeader } from "~/components/player/PlayerHeader";
import { PlayerStatus } from "~/components/player/PlayerStatus";
import { QuestionBlock } from "~/components/player/QuestionBlock";
import { QuestionNavigator } from "~/components/player/QuestionNavigator";
import { SubmitDialog } from "~/components/player/SubmitDialog";
import { usePassageSize } from "~/components/player/usePassageSize";
import { Button } from "~/components/ui/Button";
import { cn } from "~/lib/cn";
import { formatClock } from "~/lib/text";
import { Protected } from "~/lib/auth";
import { usePlayerAttempt } from "~/lib/usePlayerAttempt";

export const Route = createFileRoute("/test/listening")({ component: ListeningRoute });

function ListeningRoute() {
  return (
    <Protected>
      <ListeningPlayer />
    </Protected>
  );
}

/**
 * Audio status strip. IELTS listening audio plays exactly once: no scrub bar,
 * no replay, no pause. The progress bar is display-only.
 *
 * The <audio> element is deliberately created without controls and its
 * currentTime is never written, so there is no seek surface at all.
 */
function AudioStrip({
  audioUrl,
  durationMs,
  partNumber,
  totalParts,
  title,
}: {
  audioUrl: string | null;
  durationMs: number | null;
  partNumber: number;
  totalParts: number;
  title: string;
}) {
  const [state, setState] = useState<"idle" | "playing" | "finished">("idle");
  const [elapsed, setElapsed] = useState(0);
  const [duration, setDuration] = useState((durationMs ?? 0) / 1000);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setState("idle");
    setElapsed(0);
  }, [audioUrl]);

  function play() {
    setState("playing");
    audioRef.current?.play().catch(() => setState("idle"));
  }

  const pct = duration > 0 ? (elapsed / duration) * 100 : 0;
  const status =
    state === "playing" ? "Playing" : state === "finished" ? "Finished" : "Ready";

  return (
    <div className="border-b border-line bg-surface px-4 py-3 sm:px-6">
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          preload="auto"
          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration || duration)}
          onTimeUpdate={(e) => setElapsed(e.currentTarget.currentTime)}
          onEnded={() => setState("finished")}
        />
      )}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <span className="flex items-center gap-2.5">
          <span
            aria-hidden
            className={cn(
              "h-3 w-3 rounded-full",
              state === "playing"
                ? "animate-pulse bg-listening shadow-[0_0_0_4px_var(--color-listening-soft)]"
                : state === "finished"
                  ? "bg-good"
                  : "bg-line-strong",
            )}
          />
          <span className="text-sm font-semibold">
            Part {partNumber} of {totalParts} · {status}
          </span>
        </span>
        <span className="hidden truncate text-sm text-muted md:inline">{title}</span>

        {state === "idle" ? (
          <Button size="sm" onClick={play} disabled={!audioUrl} className="ml-auto">
            <Play className="h-3.5 w-3.5" aria-hidden />
            {audioUrl ? "Play the recording" : "No audio uploaded"}
          </Button>
        ) : (
          <>
            <div
              className="order-last h-1.5 w-full min-w-[8rem] flex-1 overflow-hidden rounded-full bg-line sm:order-none sm:w-auto"
              role="progressbar"
              aria-label="Audio progress"
              aria-valuenow={Math.round(pct)}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="h-full bg-listening transition-[width] duration-1000 ease-linear"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="tnum font-mono text-xs text-muted">
              {formatClock(elapsed)} of {formatClock(duration)}
            </span>
          </>
        )}
        <span className="w-full text-xs text-muted sm:ml-auto sm:w-auto">
          {state === "finished"
            ? "This part has finished. Check your answers before moving on."
            : "The recording cannot be paused or replayed."}
        </span>
      </div>
    </div>
  );
}

function ListeningPlayer() {
  const player = usePlayerAttempt("listening");
  const [current, setCurrent] = useState(1);
  const refs = useRef(new Map<number, HTMLDivElement>());
  const textSize = usePassageSize();

  const numbers = useMemo(
    () => player.flat.map((i) => i.question.number),
    [player.flat],
  );

  const parts = useMemo(
    () =>
      player.groups.map((g) => ({
        label: `Part ${g.partNumber}`,
        numbers: g.questions.map((q) => q.number),
      })),
    [player.groups],
  );

  const registerRef = useCallback((n: number, el: HTMLDivElement | null) => {
    if (el) refs.current.set(n, el);
    else refs.current.delete(n);
  }, []);

  if (player.loading || player.error) {
    return <PlayerStatus loading={player.loading} error={player.error} />;
  }

  const currentGroup =
    player.flat.find((i) => i.question.number === current)?.group ?? player.groups[0];
  const partIndex = player.groups.indexOf(currentGroup);
  const lockedParts = player.groups.map((_, i) => i).filter((i) => i !== partIndex);

  function goToPart(index: number) {
    const group = player.groups[index];
    if (group?.questions[0]) setCurrent(group.questions[0].number);
  }

  return (
    <div className="flex h-screen flex-col bg-paper" style={textSize.style}>
      <PlayerHeader
        section="listening"
        sectionName="Listening"
        contextLabel={`Part ${currentGroup?.partNumber ?? 1} of ${player.groups.length} · ${player.form?.title ?? "Mock test"}`}
        remaining={player.remaining ?? 0}
        textSizeIndex={textSize.index}
        onTextSize={textSize.setIndex}
        right={
          <SubmitDialog
            attemptId={player.attemptId!}
            section="listening"
            answeredCount={player.answered.size}
            total={numbers.length}
            flaggedCount={player.flagged.size}
          />
        }
      />

      <PlayerStatus saveError={player.saveError} inline />

      <AudioStrip
        key={currentGroup?.id}
        audioUrl={currentGroup?.audioUrl ?? null}
        durationMs={null}
        partNumber={currentGroup?.partNumber ?? 1}
        totalParts={player.groups.length}
        title={currentGroup?.title ?? ""}
      />

      {/* Only the current part's questions, as in the real test. */}
      <section
        className="thin-scroll min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6"
        aria-label="Questions"
      >
        <div className="mx-auto max-w-3xl">
          {currentGroup && (
            <QuestionBlock
              group={currentGroup}
              answers={player.answers}
              onAnswer={player.setAnswer}
              current={current}
              flagged={player.flagged}
              onToggleFlag={player.toggleFlag}
              onFocusQuestion={setCurrent}
              registerRef={registerRef}
            />
          )}
          <div className="flex items-center justify-between gap-3 pb-4">
            <Button
              variant="outline"
              onClick={() => goToPart(partIndex - 1)}
              disabled={partIndex <= 0}
            >
              <ChevronLeft className="h-4 w-4" aria-hidden />
              Previous part
            </Button>
            <Button
              variant="outline"
              onClick={() => goToPart(partIndex + 1)}
              disabled={partIndex >= player.groups.length - 1}
            >
              Next part
              <ChevronRight className="h-4 w-4" aria-hidden />
            </Button>
          </div>
        </div>
      </section>

      <QuestionNavigator
        parts={parts}
        answered={player.answered}
        flagged={player.flagged}
        current={current}
        lockedParts={lockedParts}
        onJump={(n) => {
          setCurrent(n);
          // The target may be in another part, which mounts on the next render.
          requestAnimationFrame(() => {
            refs.current.get(n)?.scrollIntoView({ behavior: "smooth", block: "center" });
          });
        }}
        onJumpPart={goToPart}
      />
    </div>
  );
}
