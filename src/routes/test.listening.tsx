import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PlayerHeader } from "~/components/player/PlayerHeader";
import { PlayerStatus } from "~/components/player/PlayerStatus";
import { QuestionBlock } from "~/components/player/QuestionBlock";
import { QuestionNavigator } from "~/components/player/QuestionNavigator";
import { SubmitDialog } from "~/components/player/SubmitDialog";
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
 * Audio pane. IELTS listening audio plays exactly once: no scrub bar, no
 * replay, no pause. The progress bar is display-only.
 *
 * The <audio> element is deliberately created without controls and its
 * currentTime is never written, so there is no seek surface at all.
 */
function AudioPane({
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

  return (
    <div className="mx-auto max-w-md text-center">
      <p className="text-xs font-medium uppercase tracking-wide text-muted">
        Part {partNumber} of {totalParts}
      </p>
      <h2 className="mt-1 text-xl font-semibold tracking-tight">{title}</h2>

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
          <Button size="lg" onClick={play} disabled={!audioUrl}>
            {audioUrl ? "Play audio" : "No audio uploaded"}
          </Button>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            The recording plays <strong className="text-ink">once only</strong>. You
            cannot pause, rewind or replay it. Answer as you listen.
          </p>
        </>
      )}

      {state !== "idle" && (
        <div>
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
            {formatClock(elapsed)} / {formatClock(duration)}
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
  const player = usePlayerAttempt("listening");
  const [mobilePane, setMobilePane] = useState<"audio" | "questions">("audio");
  const [current, setCurrent] = useState(1);
  const refs = useRef(new Map<number, HTMLDivElement>());

  const numbers = useMemo(
    () => player.flat.map((i) => i.question.number),
    [player.flat],
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

  function goToPart(index: number) {
    const group = player.groups[index];
    if (group?.questions[0]) setCurrent(group.questions[0].number);
  }

  return (
    <div className="flex h-screen flex-col bg-paper">
      <PlayerHeader
        sectionName="Listening"
        contextLabel={`Part ${currentGroup?.partNumber ?? 1} of ${player.groups.length} · Question ${current} of ${numbers.length}`}
        remaining={player.remaining ?? 0}
        right={
          <SubmitDialog
            attemptId={player.attemptId!}
            section="listening"
            answeredCount={player.answered.size}
            total={numbers.length}
          />
        }
      />

      <PlayerStatus saving={player.saving} saveError={player.saveError} inline />

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
            key={currentGroup?.id}
            audioUrl={currentGroup?.audioUrl ?? null}
            durationMs={null}
            partNumber={currentGroup?.partNumber ?? 1}
            totalParts={player.groups.length}
            title={currentGroup?.title ?? ""}
          />
        </section>

        {/* Only the current part's questions, as in the real test. */}
        <section
          className={cn(
            "thin-scroll min-h-0 overflow-y-auto px-4 py-6 md:block md:w-1/2 md:px-6",
            mobilePane === "questions" ? "block w-full" : "hidden",
          )}
          aria-label="Questions"
        >
          <div className="mx-auto max-w-2xl">
            {currentGroup && (
              <QuestionBlock
                group={currentGroup}
                answers={player.answers}
                onAnswer={player.setAnswer}
                current={current}
                registerRef={registerRef}
              />
            )}
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
                disabled={partIndex >= player.groups.length - 1}
              >
                Next part →
              </Button>
            </div>
          </div>
        </section>
      </div>

      <QuestionNavigator
        numbers={numbers}
        answered={player.answered}
        current={current}
        onJump={(n) => {
          setMobilePane("questions");
          setCurrent(n);
          refs.current.get(n)?.scrollIntoView({ behavior: "smooth", block: "center" });
        }}
      />
    </div>
  );
}
