import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Logo } from "~/components/layout/Logo";
import { PlayerStatus } from "~/components/player/PlayerStatus";
import { Button } from "~/components/ui/Button";
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

const WAVE = [8, 16, 26, 14, 30, 22, 34, 18, 28, 12, 24, 32, 20, 10, 26, 18, 30, 14, 22, 8];

function Waveform({ active }: { active: boolean }) {
  return (
    <div aria-hidden className="flex h-12 items-center justify-center gap-1">
      {WAVE.map((h, i) => (
        <span
          key={i}
          className={cn(
            "w-1 rounded-full transition-colors",
            active ? "animate-pulse bg-brand-500" : "bg-line-strong",
          )}
          style={{ height: `${active ? h : Math.max(4, h / 3)}px` }}
        />
      ))}
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

  return (
    <div className="rounded-card border border-line bg-surface p-6 text-center">
      <Waveform active={state === "recording"} />
      <p className="mt-3 font-mono text-sm tabular-nums text-muted">
        {formatClock(elapsed)} / {formatClock(maxSeconds)}
      </p>

      {error && <p className="mt-3 text-sm text-bad">{error}</p>}

      <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
        {state === "idle" && (
          <Button size="lg" onClick={start}>
            <span aria-hidden className="mr-1">●</span> Record answer
          </Button>
        )}
        {state === "recording" && (
          <Button size="lg" variant="danger" onClick={stop}>
            <span aria-hidden className="mr-1">■</span> Stop
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
              Re-record
            </Button>
            <Button onClick={onDone}>Next →</Button>
          </>
        )}
      </div>
    </div>
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
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
          <Logo />
          <p className="text-sm text-muted">Speaking · 11–14 minutes</p>
        </div>
      </header>

      <PlayerStatus saving={player.saving} saveError={player.saveError} inline />

      {/* Part progress */}
      <div className="mx-auto w-full max-w-3xl px-4 pt-6">
        <ol className="flex gap-2">
          {player.groups.map((g, i) => (
            <li key={g.id} className="flex-1">
              <div
                className={cn("h-1 rounded-full", i <= partIndex ? "bg-brand-600" : "bg-line")}
              />
              <p
                className={cn(
                  "mt-2 text-xs",
                  i === partIndex ? "font-medium text-ink" : "text-muted",
                )}
              >
                Part {g.partNumber}
              </p>
            </li>
          ))}
        </ol>
      </div>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
        <p className="text-xs font-medium uppercase tracking-wide text-muted">
          {group?.title}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">{group?.instructions}</p>

        {isCueCard ? (
          <>
            <div className="mt-6 rounded-card border-2 border-line-strong bg-surface p-6">
              <div className="prose-passage whitespace-pre-line text-[1rem]">
                {group?.passageText}
              </div>
            </div>

            {phase === "prep" ? (
              <div className="mt-6">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-medium">Preparation time</p>
                  <p className="font-mono text-lg tabular-nums text-brand-700">
                    {formatClock(prepRemaining)}
                  </p>
                </div>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={6}
                  placeholder="Make notes here — you may refer to them while you speak."
                />
                <div className="mt-3 flex justify-end">
                  <Button variant="outline" onClick={() => setPhase("talk")}>
                    I'm ready — start speaking
                  </Button>
                </div>
              </div>
            ) : (
              <div className="mt-6">
                {notes && (
                  <div className="mb-4 rounded-lg border border-line bg-surface p-4">
                    <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted">
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
                <p className="mt-3 text-center text-xs text-muted">
                  Speak for one to two minutes. The recording stops automatically at two
                  minutes.
                </p>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="mt-6 rounded-card border border-line bg-surface p-6">
              <p className="text-xs font-medium uppercase tracking-wide text-muted">
                Question {questionIndex + 1} of {group?.questions.length ?? 0}
              </p>
              <p className="mt-2 text-lg leading-relaxed">{question?.prompt}</p>
            </div>
            <div className="mt-5">
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
            </div>
          </>
        )}

        {finished && (
          <div className="mt-8 rounded-card border border-brand-200 bg-brand-50 p-6 text-center">
            <p className="font-medium">That is the end of the speaking test.</p>
            <p className="mt-1 text-sm text-muted">
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
                  className="text-sm font-medium text-brand-600"
                >
                  See your result →
                </Link>
              </p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
