import { useEffect, useRef, useState } from "react";
import type { SpeakingPrompt } from "~/data/practice";
import { Badge } from "~/components/ui/Badge";
import { Button } from "~/components/ui/Button";
import { Card, CardBody } from "~/components/ui/Card";
import { Textarea } from "~/components/ui/Field";
import { cn } from "~/lib/cn";
import { countWords } from "~/lib/answer-check";
import { useAuth } from "~/lib/auth";
import { formatClock } from "~/lib/text";
import { gradeSpeaking, SPEAKING_CRITERIA, type SpeakingGrade } from "~/lib/practice/grading";
import { appendHistory } from "~/lib/practice/history";
import { useSpeechRecognition } from "~/lib/practice/useSpeechRecognition";
import { BandResultCard } from "./BandResultCard";
import { AiStatus } from "./PracticeShell";

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
 * Speaking practice: five prompts in test order. Each answer is transcribed in
 * the browser as the learner speaks, can be corrected before grading, and is
 * then banded by the AI examiner on the four Speaking criteria.
 */
export function SpeakingRunner({ prompts }: { prompts: SpeakingPrompt[] }) {
  const [index, setIndex] = useState(0);
  const [bands, setBands] = useState<Record<string, number>>({});
  const item = prompts[index];

  return (
    <div className="grid gap-6">
      <ol className="grid grid-cols-5 gap-2">
        {prompts.map((p, i) => {
          const band = bands[p.id];
          return (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => setIndex(i)}
                className={cn(
                  "w-full rounded-xl border px-2 py-2 text-left transition-colors",
                  i === index
                    ? "border-brand-500 bg-brand-50"
                    : "border-line bg-surface hover:border-line-strong",
                )}
              >
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                  Part {p.part}
                </p>
                <p className="mt-0.5 truncate text-xs font-medium">{p.topic}</p>
                <p className="mt-1 text-xs tabular-nums text-good">
                  {band !== undefined ? `Band ${band.toFixed(1)}` : " "}
                </p>
              </button>
            </li>
          );
        })}
      </ol>

      <PromptRunner
        key={item.id}
        item={item}
        position={`${index + 1} of ${prompts.length}`}
        onGraded={(band) => setBands((prev) => ({ ...prev, [item.id]: band }))}
        onNext={index < prompts.length - 1 ? () => setIndex(index + 1) : undefined}
      />
    </div>
  );
}

type Phase = "prep" | "ready" | "recording" | "review" | "graded";

function PromptRunner({
  item,
  position,
  onGraded,
  onNext,
}: {
  item: SpeakingPrompt;
  position: string;
  onGraded: (band: number) => void;
  onNext?: () => void;
}) {
  const { user } = useAuth();
  const speech = useSpeechRecognition();
  const [phase, setPhase] = useState<Phase>(item.prepSeconds ? "prep" : "ready");
  const [prepRemaining, setPrepRemaining] = useState(item.prepSeconds ?? 0);
  const [notes, setNotes] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const [typed, setTyped] = useState("");
  const [edited, setEdited] = useState(false);
  const [grade, setGrade] = useState<SpeakingGrade | null>(null);
  const [grading, setGrading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const stopRef = useRef(speech.stop);
  stopRef.current = speech.stop;

  // Part 2 preparation minute.
  useEffect(() => {
    if (phase !== "prep") return;
    if (prepRemaining <= 0) {
      setPhase("ready");
      return;
    }
    const id = setTimeout(() => setPrepRemaining((p) => p - 1), 1000);
    return () => clearTimeout(id);
  }, [phase, prepRemaining]);

  // Recording clock; stops automatically at the part's limit.
  useEffect(() => {
    if (phase !== "recording") return;
    const id = setInterval(() => {
      setElapsed((prev) => {
        if (prev + 1 >= item.maxSeconds) {
          clearInterval(id);
          stopRef.current();
          setPhase("review");
          return item.maxSeconds;
        }
        return prev + 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [phase, item.maxSeconds]);

  // A recogniser error while recording ends the turn with what was captured.
  useEffect(() => {
    if (phase === "recording" && speech.error) setPhase("review");
  }, [phase, speech.error]);

  useEffect(() => {
    if (grade) resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [grade]);

  const transcript = edited || !speech.supported ? typed : speech.transcript;
  const words = countWords(transcript);

  function startRecording() {
    setElapsed(0);
    setEdited(false);
    setTyped("");
    if (speech.supported) speech.start();
    setPhase("recording");
  }

  function stopRecording() {
    speech.stop();
    setPhase("review");
  }

  function restart() {
    speech.reset();
    setGrade(null);
    setError(null);
    setElapsed(0);
    setEdited(false);
    setTyped("");
    setPhase("ready");
  }

  async function submit() {
    setGrading(true);
    setError(null);
    try {
      const result = await gradeSpeaking(item, transcript, elapsed || undefined);
      setGrade(result);
      setPhase("graded");
      onGraded(result.band);
      appendHistory(user?.id, {
        section: "speaking",
        itemId: item.id,
        title: `${item.title} — ${item.topic}`,
        score: { kind: "band", band: result.band },
        summary: result.feedback.summary,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setGrading(false);
    }
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardBody className="pt-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              {item.title} · {position}
            </p>
            <Badge tone="neutral">
              {item.prepSeconds ? `${item.prepSeconds}s prep · ` : ""}up to {formatClock(item.maxSeconds)}
            </Badge>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">{item.instructions}</p>

          {item.cueCard ? (
            <div className="mt-5 rounded-card border-2 border-line-strong bg-surface p-6">
              <p className="text-lg font-semibold leading-snug">{item.cueCard.topic}</p>
              <p className="mt-3 text-sm text-muted">You should say:</p>
              <ul className="mt-1 grid gap-1 text-[1rem] leading-relaxed">
                {item.cueCard.bullets.map((b) => (
                  <li key={b} className="pl-4 before:absolute before:-ml-4 before:content-['•']">
                    {b}
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-[1rem] leading-relaxed">{item.cueCard.closing}</p>
            </div>
          ) : (
            <p className="mt-5 text-xl leading-relaxed">{item.prompt}</p>
          )}
        </CardBody>
      </Card>

      {phase === "prep" && (
        <Card>
          <CardBody className="pt-5">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-medium">Preparation time</p>
              <p className="font-mono text-lg tabular-nums text-brand-700">
                {formatClock(prepRemaining)}
              </p>
            </div>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={5}
              placeholder="Make notes here — you can see them while you speak."
            />
            <div className="mt-3 flex justify-end">
              <Button variant="outline" onClick={() => setPhase("ready")}>
                I'm ready — start speaking
              </Button>
            </div>
          </CardBody>
        </Card>
      )}

      {phase !== "prep" && (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          <div className="grid gap-4 self-start">
            {notes && (
              <div className="rounded-xl border border-line bg-surface p-4">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted">
                  Your notes
                </p>
                <p className="whitespace-pre-line text-sm">{notes}</p>
              </div>
            )}
            <div className="rounded-card border border-line bg-surface p-6 text-center">
              <Waveform active={phase === "recording"} />
              <p className="mt-3 font-mono text-sm tabular-nums text-muted">
                {formatClock(elapsed)} / {formatClock(item.maxSeconds)}
              </p>
              {!speech.supported && (
                <p className="mt-3 text-xs text-warn">
                  Live transcription needs Chrome or Safari. You can still practise: time
                  yourself with the clock, then type what you said.
                </p>
              )}
              {speech.error && phase !== "recording" && (
                <p className="mt-3 text-sm text-bad">{speech.error}</p>
              )}
              <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                {phase === "ready" && (
                  <Button size="lg" onClick={startRecording}>
                    <span aria-hidden className="mr-1">●</span> Start speaking
                  </Button>
                )}
                {phase === "recording" && (
                  <Button size="lg" variant="danger" onClick={stopRecording}>
                    <span aria-hidden className="mr-1">■</span> Stop
                  </Button>
                )}
                {(phase === "review" || phase === "graded") && (
                  <Button variant="ghost" onClick={restart} disabled={grading}>
                    Speak again
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <label htmlFor={`transcript-${item.id}`} className="text-sm font-medium">
                {speech.supported ? "Transcript" : "What you said"}
              </label>
              <span className="text-xs tabular-nums text-muted">
                {words} words
                {phase === "recording" && speech.supported ? " · listening…" : ""}
              </span>
            </div>
            <Textarea
              id={`transcript-${item.id}`}
              value={transcript}
              readOnly={phase === "recording"}
              disabled={grading || phase === "graded" || (phase === "ready" && speech.supported)}
              onChange={(e) => {
                setEdited(true);
                setTyped(e.target.value);
              }}
              onFocus={() => {
                // The first edit forks the live transcript into an editable copy.
                if (!edited && speech.supported) setTyped(speech.transcript);
              }}
              rows={10}
              placeholder={
                speech.supported
                  ? "Your words appear here as you speak. Fix any mis-heard words before grading."
                  : "Type what you said, as closely as you can."
              }
              className="min-h-[14rem] text-[1rem] leading-[1.7]"
            />
            <p className="mt-2 text-xs text-muted">
              The examiner grades the transcript, so correct any words the recogniser misheard —
              but do not rewrite what you actually said.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              {phase === "review" && (
                <Button onClick={submit} disabled={grading || words === 0}>
                  {grading ? "Grading…" : "Get my band"}
                </Button>
              )}
              {phase === "graded" && onNext && <Button onClick={onNext}>Next prompt →</Button>}
            </div>

            <div className="mt-4">
              <AiStatus loading={grading} error={error} onRetry={submit} />
            </div>

            {grade && (
              <div ref={resultRef} className="mt-6 scroll-mt-24">
                <BandResultCard
                  heading={`${item.title} · ${item.topic}`}
                  band={grade.band}
                  criteria={grade.criteria}
                  labels={SPEAKING_CRITERIA}
                  feedback={grade.feedback}
                  meta={`${grade.wordCount} words in ${formatClock(elapsed)} · graded from the transcript`}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
