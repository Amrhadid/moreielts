import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/Button";
import { Textarea } from "~/components/ui/Field";
import { Logo } from "~/components/layout/Logo";
import { cn } from "~/lib/cn";
import { formatClock } from "~/lib/text";
import { getSection } from "~/mock/testForm";
import { ThemeToggle } from "~/components/ui/ThemeToggle";

export const Route = createFileRoute("/test/speaking")({ component: SpeakingPlayer });

const PREP_SECONDS = 60;
/** Part 2 long turn: candidates speak for one to two minutes. */
const LONG_TURN_SECONDS = 120;

/** Static bar heights so the placeholder does not re-randomise every render. */
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
 * Recorder placeholder.
 * TODO(backend): replace with MediaRecorder + upload to R2. Nothing is captured
 * in this pass -- the states below are UI only.
 */
function Recorder({
  onDone,
  maxSeconds,
  autoStart = false,
}: {
  onDone: () => void;
  maxSeconds: number;
  autoStart?: boolean;
}) {
  const [state, setState] = useState<"idle" | "recording" | "recorded">(
    autoStart ? "recording" : "idle",
  );
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (state !== "recording") return;
    const id = setInterval(() => {
      setElapsed((prev) => {
        if (prev >= maxSeconds - 1) {
          clearInterval(id);
          setState("recorded");
          return maxSeconds;
        }
        return prev + 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [state, maxSeconds]);

  return (
    <div className="rounded-card border border-line bg-surface p-6 text-center">
      <Waveform active={state === "recording"} />
      <p className="mt-3 font-mono text-sm tabular-nums text-muted">
        {formatClock(elapsed)} / {formatClock(maxSeconds)}
      </p>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
        {state === "idle" && (
          <Button size="lg" onClick={() => setState("recording")}>
            <span aria-hidden className="mr-1">●</span> Record answer
          </Button>
        )}
        {state === "recording" && (
          <Button size="lg" variant="danger" onClick={() => setState("recorded")}>
            <span aria-hidden className="mr-1">■</span> Stop
          </Button>
        )}
        {state === "recorded" && (
          <>
            {/* TODO(backend): play back the stored blob. */}
            <Button variant="outline">▶ Play back</Button>
            <Button
              variant="ghost"
              onClick={() => {
                setElapsed(0);
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
  const section = getSection("speaking");
  const [partIndex, setPartIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [notes, setNotes] = useState("");
  const [prepRemaining, setPrepRemaining] = useState(PREP_SECONDS);
  const [phase, setPhase] = useState<"prep" | "talk">("prep");

  const group = section.itemGroups[partIndex];
  const question = group.questions[questionIndex];
  const isCueCard = group.stimulusKind === "cue_card";

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

  function advance() {
    if (questionIndex < group.questions.length - 1) {
      setQuestionIndex(questionIndex + 1);
    } else if (partIndex < section.itemGroups.length - 1) {
      setPartIndex(partIndex + 1);
      setQuestionIndex(0);
      setPhase("prep");
      setPrepRemaining(PREP_SECONDS);
    }
  }

  const finished =
    partIndex === section.itemGroups.length - 1 &&
    questionIndex === group.questions.length - 1;

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
          <Logo />
          <div className="flex items-center gap-3"><p className="text-sm text-muted">Speaking · 11–14 minutes</p><ThemeToggle compact /></div>
        </div>
      </header>

      {/* Part progress */}
      <div className="mx-auto w-full max-w-3xl px-4 pt-6">
        <ol className="flex gap-2">
          {section.itemGroups.map((g, i) => (
            <li key={g.id} className="flex-1">
              <div
                className={cn(
                  "h-1 rounded-full",
                  i <= partIndex ? "bg-brand-600" : "bg-line",
                )}
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
          {group.title}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          {group.instructions}
        </p>

        {isCueCard ? (
          <>
            {/* Cue card */}
            <div className="mt-6 rounded-card border-2 border-line-strong bg-surface p-6">
              <div className="prose-passage whitespace-pre-line text-[1rem]">
                {group.passageText}
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
                <Recorder
                  maxSeconds={LONG_TURN_SECONDS}
                  autoStart
                  onDone={advance}
                />
                <p className="mt-3 text-center text-xs text-muted">
                  Speak for one to two minutes. The recording stops automatically at
                  two minutes.
                </p>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="mt-6 rounded-card border border-line bg-surface p-6">
              <p className="text-xs font-medium uppercase tracking-wide text-muted">
                Question {questionIndex + 1} of {group.questions.length}
              </p>
              <p className="mt-2 text-lg leading-relaxed">{question.prompt}</p>
            </div>
            <div className="mt-5">
              <Recorder
                key={question.id}
                maxSeconds={60}
                onDone={advance}
              />
            </div>
          </>
        )}

        {finished && (
          <div className="mt-8 rounded-card border border-brand-200 bg-brand-50 p-6 text-center">
            <p className="font-medium">That is the end of the speaking test.</p>
            <p className="mt-1 text-sm text-muted">
              Your recordings will be scored against the four speaking criteria.
            </p>
            <Button asChild className="mt-4">
              <Link to="/results/$attemptId" params={{ attemptId: "a-104" }}>
                See your result
              </Link>
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
