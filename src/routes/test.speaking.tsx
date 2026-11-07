import { createFileRoute, Link } from "@tanstack/react-router";
import { Mic, RotateCcw, Square } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { PlayerHeader } from "~/components/player/PlayerHeader";
import { PlayerStatus } from "~/components/player/PlayerStatus";
import { Button } from "~/components/ui/Button";
import { Card } from "~/components/ui/Card";
import { Textarea } from "~/components/ui/Field";
import { cn } from "~/lib/cn";
import { formatClock } from "~/lib/text";
import { Protected } from "~/lib/auth";
import { uploadToR2, useSubmitAttempt } from "~/lib/queries";
import { usePlayerAttempt } from "~/lib/usePlayerAttempt";

export const Route = createFileRoute("/test/speaking")({ component: SpeakingRoute });

function SpeakingRoute() {
  return (
    <Protected>
      <SpeakingPlayer />
    </Protected>
  );
}

const PREP_SECONDS = 60;
/** Part 2 long turn: candidates speak for one to two minutes. */
const LONG_TURN_SECONDS = 120;

/**
 * Progress ring. The conic fill grows with `progress` (0 to 1); the inner disc
 * carries the time and a state label.
 */
function Ring({
  progress,
  time,
  state,
  tone = "speaking",
}: {
  progress: number;
  time: string;
  state: string;
  tone?: "speaking" | "bad" | "good";
}) {
  const colour =
    tone === "bad" ? "var(--color-bad)" : tone === "good" ? "var(--color-good)" : "var(--color-speaking)";
  const pct = Math.max(0, Math.min(100, progress * 100));
  const style = {
    background: `conic-gradient(${colour} ${pct}%, var(--color-line) 0)`,
  } as CSSProperties;
  return (
    <div
      className="relative grid h-40 w-40 place-items-center rounded-full"
      style={style}
      role="img"
      aria-label={`${state}, ${time}`}
    >
      <div className="absolute inset-2.5 rounded-full bg-paper" aria-hidden />
      <div className="relative text-center">
        <p className="tnum font-mono text-[2rem] font-medium leading-none">{time}</p>
        <p className="mt-1.5 text-[0.65rem] font-bold uppercase tracking-[0.12em] text-muted">
          {state}
        </p>
      </div>
    </div>
  );
}

/**
 * Real recorder. Captures with MediaRecorder, uploads the blob to R2 through a
 * presigned URL issued by the upload-url Edge Function, then stores the object
 * URL on the response row. The browser never holds an R2 credential.
 */
function Recorder({
  attemptId,
  questionId,
  maxSeconds,
  autoStart = false,
  onUploaded,
  onDone,
}: {
  attemptId: string;
  questionId: string;
  maxSeconds: number;
  autoStart?: boolean;
  onUploaded: (url: string) => void;
  onDone: () => void;
}) {
  const [state, setState] = useState<"idle" | "recording" | "recorded" | "uploading">(
    "idle",
  );
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [playbackUrl, setPlaybackUrl] = useState<string | null>(null);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  useEffect(() => {
    if (state !== "recording") return;
    const id = setInterval(() => {
      setElapsed((prev) => {
        if (prev >= maxSeconds - 1) {
          stop();
          return maxSeconds;
        }
        return prev + 1;
      });
    }, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, maxSeconds]);

  async function start() {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => chunksRef.current.push(e.data);
      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setPlaybackUrl(URL.createObjectURL(blob));
        setState("uploading");
        try {
          const file = new File([blob], `${questionId}.webm`, { type: "audio/webm" });
          const url = await uploadToR2(file, "response_audio", {
            attempt_id: attemptId,
            question_id: questionId,
          });
          onUploaded(url);
          setState("recorded");
        } catch (err) {
          setError(
            `Recording saved locally but the upload failed: ${(err as Error).message}`,
          );
          setState("recorded");
        }
      };
      recorder.start();
      recorderRef.current = recorder;
      setState("recording");
    } catch {
      setError("Microphone access was denied. Allow it to record your answer.");
      setState("idle");
    }
  }

  function stop() {
    recorderRef.current?.stop();
  }

  useEffect(() => {
    if (autoStart && state === "idle") void start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoStart]);

  const ringState =
    state === "recording"
      ? "Recording"
      : state === "uploading"
        ? "Uploading"
        : state === "recorded"
          ? "Recorded"
          : "Ready";

  return (
    <div className="grid justify-items-center gap-5">
      <Ring
        progress={state === "idle" ? 0 : elapsed / maxSeconds}
        time={formatClock(elapsed)}
        state={ringState}
        tone={state === "recording" ? "bad" : state === "recorded" ? "good" : "speaking"}
      />
      <p className="tnum font-mono text-xs text-muted">up to {formatClock(maxSeconds)}</p>

      {error && <p className="max-w-md text-center text-sm text-bad">{error}</p>}

      <div className="flex flex-wrap items-center justify-center gap-3">
        {state === "idle" && (
          <Button size="lg" onClick={start}>
            <Mic className="h-4 w-4" aria-hidden />
            Record answer
          </Button>
        )}
        {state === "recording" && (
          <Button size="lg" variant="danger" onClick={stop}>
            <Square className="h-3.5 w-3.5" fill="currentColor" aria-hidden />
            Stop
          </Button>
        )}
        {state === "uploading" && <p className="text-sm text-muted">Uploading…</p>}
        {state === "recorded" && (
          <>
            {playbackUrl && (
              <audio controls src={playbackUrl} className="h-9 max-w-full" />
            )}
            <Button
              variant="ghost"
              onClick={() => {
                setElapsed(0);
                setPlaybackUrl(null);
                setState("idle");
              }}
            >
              <RotateCcw className="h-4 w-4" aria-hidden />
              Re-record
            </Button>
            <Button onClick={onDone}>Next</Button>
          </>
        )}
      </div>
    </div>
  );
}

function PartStepper({ parts, current }: { parts: number[]; current: number }) {
  return (
    <ol className="flex items-center gap-1.5" aria-label="Speaking parts">
      {parts.map((p, i) => (
        <li
          key={p}
          aria-current={i === current ? "step" : undefined}
          className={cn(
            "rounded-full border px-2.5 py-1 text-xs font-semibold",
            i === current
              ? "border-transparent bg-speaking-soft text-speaking"
              : i < current
                ? "border-line text-ink-soft"
                : "border-line text-muted",
          )}
        >
          Part {p}
        </li>
      ))}
    </ol>
  );
}

function SpeakingPlayer() {
  const player = usePlayerAttempt("speaking");
  const submit = useSubmitAttempt();
  const [partIndex, setPartIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [notes, setNotes] = useState("");
  const [prepRemaining, setPrepRemaining] = useState(PREP_SECONDS);
  const [phase, setPhase] = useState<"prep" | "talk">("prep");

  const group = player.groups[partIndex];
  const question = group?.questions[questionIndex];
  const isCueCard = group?.stimulusKind === "cue_card";

  // Part 2 preparation minute.
  useEffect(() => {
    if (!isCueCard || phase !== "prep") return;
    if (prepRemaining <= 0) {
      setPhase("talk");
      return;
    }
    const id = setTimeout(() => setPrepRemaining((p) => p - 1), 1000);
    return () => clearTimeout(id);
  }, [isCueCard, phase, prepRemaining]);

  if (player.loading || player.error) {
    return <PlayerStatus loading={player.loading} error={player.error} />;
  }

  function advance() {
    if (group && questionIndex < group.questions.length - 1) {
      setQuestionIndex(questionIndex + 1);
    } else if (partIndex < player.groups.length - 1) {
      setPartIndex(partIndex + 1);
      setQuestionIndex(0);
      setPhase("prep");
      setPrepRemaining(PREP_SECONDS);
    }
  }

  const finished =
    partIndex === player.groups.length - 1 &&
    group !== undefined &&
    questionIndex === group.questions.length - 1;

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <PlayerHeader
        section="speaking"
        sectionName="Speaking"
        contextLabel={`Part ${group?.partNumber ?? 1} of ${player.groups.length} · 11 to 14 minutes`}
        remaining={null}
        centre={<PartStepper parts={player.groups.map((g) => g.partNumber)} current={partIndex} />}
      />

      <PlayerStatus saveError={player.saveError} inline />

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8 sm:px-6">
        <div className="grid justify-items-center gap-6">
          <p className="text-sm text-ink-soft">{group?.instructions}</p>

          {isCueCard ? (
            <>
              {phase === "prep" && (
                <Ring
                  progress={(PREP_SECONDS - prepRemaining) / PREP_SECONDS}
                  time={formatClock(prepRemaining)}
                  state="Preparing"
                />
              )}

              <Card className="w-full p-6">
                <p className="text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-speaking">
                  Cue card
                </p>
                <div className="prose-passage mt-2 whitespace-pre-line">
                  {group?.passageText}
                </div>
              </Card>

              {phase === "prep" ? (
                <div className="w-full">
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={5}
                    placeholder="Make notes here. You may refer to them while you speak."
                    aria-label="Preparation notes"
                  />
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-xs text-muted">
                      You have one minute to prepare. The recording starts on its own when
                      the minute ends.
                    </p>
                    <Button variant="outline" onClick={() => setPhase("talk")}>
                      Start talking now
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid w-full justify-items-center gap-5">
                  {notes && (
                    <div className="w-full rounded-[0.625rem] border border-line bg-surface p-4">
                      <p className="mb-1 text-[0.6875rem] font-bold uppercase tracking-[0.1em] text-muted">
                        Your notes
                      </p>
                      <p className="whitespace-pre-line text-sm">{notes}</p>
                    </div>
                  )}
                  {question && player.attemptId && (
                    <Recorder
                      key={question.id}
                      attemptId={player.attemptId}
                      questionId={question.id}
                      maxSeconds={LONG_TURN_SECONDS}
                      autoStart
                      onUploaded={(url) => player.setAnswer(question.id, url)}
                      onDone={advance}
                    />
                  )}
                  <p className="max-w-md text-center text-xs text-muted">
                    Speak for one to two minutes. The recording stops on its own at two
                    minutes, as the examiner would.
                  </p>
                </div>
              )}
            </>
          ) : (
            <>
              <Card className="w-full p-6">
                <p className="text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-muted">
                  Question {questionIndex + 1} of {group?.questions.length ?? 0}
                </p>
                <p className="display mt-2 text-[1.375rem] leading-snug">{question?.prompt}</p>
              </Card>
              {question && player.attemptId && (
                <Recorder
                  key={question.id}
                  attemptId={player.attemptId}
                  questionId={question.id}
                  maxSeconds={60}
                  onUploaded={(url) => player.setAnswer(question.id, url)}
                  onDone={advance}
                />
              )}
            </>
          )}

          {finished && (
            <Card className="w-full border-brand-600 bg-brand-50 p-6 text-center">
              <p className="display text-xl">That is the end of the speaking test.</p>
              <p className="mt-1 text-sm text-ink-soft">
                Your recordings will be scored against the four speaking criteria.
              </p>
              <Button
                className="mt-4"
                disabled={submit.isPending}
                onClick={() => submit.mutate({ attemptId: player.attemptId! })}
              >
                {submit.isPending ? "Submitting…" : "Finish and score"}
              </Button>
              {submit.isSuccess && (
                <p className="mt-3">
                  <Link
                    to="/results/$attemptId"
                    params={{ attemptId: player.attemptId! }}
                    className="text-sm font-semibold text-brand-600"
                  >
                    See your result
                  </Link>
                </p>
              )}
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
