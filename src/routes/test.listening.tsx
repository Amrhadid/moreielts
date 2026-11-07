import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PlayerHeader } from "~/components/player/PlayerHeader";
import { PlayerStatus } from "~/components/player/PlayerStatus";
import { QuestionBlock } from "~/components/player/QuestionBlock";
import { QuestionNavigator } from "~/components/player/QuestionNavigator";
import { SubmitDialog } from "~/components/player/SubmitDialog";
import { useFlags } from "~/components/player/useFlags";
import { usePassageSize } from "~/components/player/usePassageSize";
import { Button } from "~/components/ui/Button";
import { Icon } from "~/components/ui/Icon";
import { cn } from "~/lib/cn";
import { formatClock } from "~/lib/text";
import { PremiumGate } from "~/lib/auth";
import { usePlayerAttempt } from "~/lib/usePlayerAttempt";

export const Route = createFileRoute("/test/listening")({
  validateSearch: (s: Record<string, unknown>): { form?: string } =>
    typeof s.form === "string" ? { form: s.form } : {},
  component: ListeningRoute,
});

function ListeningRoute() {
  return (
    <PremiumGate>
      <ListeningPlayer />
    </PremiumGate>
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
  const status = state === "playing" ? "Playing" : state === "finished" ? "Finished" : "Ready";

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
          <Button size="sm" onClick={play} disabled={!audioUrl} className="ms-auto">
            <Icon name="play" size={14} />
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
        <span className="w-full text-xs text-muted sm:ms-auto sm:w-auto">
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
  const { flagged, toggleFlag } = useFlags(player.attemptId, "listening");
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
    return <PlayerStatus loading={player.loading} error={player.error} action={player.errorAction} />;
  }

  const currentGroup =
    player.flat.find((i) => i.question.number === current)?.group ?? player.groups[0];
  const partIndex = player.groups.indexOf(currentGroup);
  // Other parts are drawn muted: the real test moves through the recording in
  // order. They stay reachable so a candidate can check an earlier answer.
  const lockedParts = player.groups.map((_, i) => i).filter((i) => i !== partIndex);

  function goToPart(index: number) {
    const group = player.groups[index];
    if (group?.questions[0]) setCurrent(group.questions[0].number);
  }

  function jumpTo(n: number) {
    setCurrent(n);
    // The question may belong to another part, which renders after the state
    // update; scroll on the next frame.
    requestAnimationFrame(() =>
      refs.current.get(n)?.scrollIntoView({ behavior: "smooth", block: "center" }),
    );
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
            formId={player.form?.id}
            answeredCount={player.answered.size}
            total={numbers.length}
            flaggedCount={flagged.size}
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
      <section className="thin-scroll min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6" aria-label="Questions">
        <div className="mx-auto max-w-2xl">
          {currentGroup && (
            <QuestionBlock
              group={currentGroup}
              answers={player.answers}
              onAnswer={player.setAnswer}
              current={current}
              registerRef={registerRef}
              flagged={flagged}
              onToggleFlag={toggleFlag}
              onFocusQuestion={setCurrent}
            />
          )}
          <div className="flex items-center justify-between gap-3 pb-4">
            <Button variant="outline" onClick={() => goToPart(partIndex - 1)} disabled={partIndex <= 0}>
              <Icon name="arrowRight" size={16} className="rotate-180 rtl:rotate-0" />
              Previous part
            </Button>
            <Button
              variant="outline"
              onClick={() => goToPart(partIndex + 1)}
              disabled={partIndex >= player.groups.length - 1}
            >
              Next part
              <Icon name="arrowRight" size={16} className="rtl:rotate-180" />
            </Button>
          </div>
        </div>
      </section>

      <QuestionNavigator
        parts={parts}
        answered={player.answered}
        flagged={flagged}
        current={current}
        lockedParts={lockedParts}
        onJump={jumpTo}
        onJumpPart={goToPart}
      />
    </div>
  );
}
