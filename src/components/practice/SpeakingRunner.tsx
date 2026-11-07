import { useEffect, useRef, useState } from "react";
import type { SpeakingPrompt } from "~/data/practice";
import { Badge } from "~/components/ui/Badge";
import { Button } from "~/components/ui/Button";
import { Card, CardBody } from "~/components/ui/Card";
import { Textarea } from "~/components/ui/Field";
import { Icon } from "~/components/ui/Icon";
import { cn } from "~/lib/cn";
import { countWords } from "~/lib/answer-check";
import { useAuth } from "~/lib/auth";
import { formatClock } from "~/lib/text";
import { gradeSpeaking, SPEAKING_CRITERIA, type SpeakingGrade } from "~/lib/practice/grading";
import { appendHistory } from "~/lib/practice/history";
import { useSpeechRecognition } from "~/lib/practice/useSpeechRecognition";
import { BandResultCard } from "./BandResultCard";
import { AiStatus } from "./PracticeShell";

/** Conic ring: preparation counts down in the speaking hue, recording in the bad hue. */
function Ring({
  value,
  total,
  tone,
  label,
  children,
}: {
  value: number;
  total: number;
  tone: "speaking" | "bad" | "good" | "muted";
  label: string;
  children?: React.ReactNode;
}) {
  const pct = total > 0 ? Math.min(100, (value / total) * 100) : 0;
  const colour =
    tone === "speaking"
      ? "var(--color-speaking)"
      : tone === "bad"
        ? "var(--color-bad)"
        : tone === "good"
          ? "var(--color-good)"
          : "var(--color-line-strong)";
  return (
    <div
      className="relative grid h-36 w-36 place-items-center rounded-full"
      style={{ background: `conic-gradient(${colour} ${pct}%, var(--color-line) 0)` }}
      role="img"
      aria-label={label}
    >
      <div className="absolute inset-2 rounded-full bg-paper" />
      <div className="relative text-center">{children}</div>
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
          const active = i === index;
          return (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-pressed={active}
                className={cn(
                  "w-full rounded-[0.625rem] border bg-surface px-2.5 py-2 text-start transition-colors",
                  active
                    ? "border-brand-600 shadow-[inset_3px_0_0_var(--color-brand-600)]"
                    : "border-line hover:border-line-strong",
                )}
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted">
                  Part {p.part}
                </p>
                <p className="mt-0.5 truncate text-xs font-medium">{p.topic}</p>
                <p className="tnum mt-1 text-xs text-good">
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

  const ringState =
    phase === "prep"
      ? { value: (item.prepSeconds ?? 0) - prepRemaining, total: item.prepSeconds ?? 1, tone: "speaking" as const, caption: "Preparing", time: formatClock(prepRemaining) }
      : phase === "recording"
        ? { value: elapsed, total: item.maxSeconds, tone: "bad" as const, caption: "Recording", time: formatClock(elapsed) }
        : phase === "review" || phase === "graded"
          ? { value: elapsed, total: item.maxSeconds, tone: "good" as const, caption: "Recorded", time: formatClock(elapsed) }
          : { value: 0, total: item.maxSeconds, tone: "muted" as const, caption: "Ready", time: formatClock(item.maxSeconds) };

  return (
    <div className="grid gap-6">
      <Card>
        <CardBody className="pt-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">
              {item.title} · {position}
            </p>
            <Badge tone="neutral">
              {item.prepSeconds ? `${item.prepSeconds}s prep · ` : ""}up to {formatClock(item.maxSeconds)}
            </Badge>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">{item.instructions}</p>

          {item.cueCard ? (
            <div className="mt-5 rounded-card border border-line bg-paper p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-speaking">Cue card</p>
              <p className="display mt-2 text-2xl leading-snug">{item.cueCard.topic}</p>
              <p className="mt-3 text-sm text-muted">You should say:</p>
              <ul className="mt-1 grid list-disc gap-1 ps-5 text-[1rem] leading-relaxed">
                {item.cueCard.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
              <p className="mt-3 text-[1rem] leading-relaxed">{item.cueCard.closing}</p>
            </div>
          ) : (
            <p className="display mt-5 text-2xl leading-relaxed">{item.prompt}</p>
          )}
        </CardBody>
      </Card>

      {phase === "prep" && (
        <Card>
          <CardBody className="grid gap-4 pt-5 sm:grid-cols-[auto_1fr] sm:items-start">
            <Ring value={ringState.value} total={ringState.total} tone={ringState.tone} label={`Preparation, ${ringState.time} left`}>
              <p className="font-mono text-2xl tabular-nums">{ringState.time}</p>
              <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted">{ringState.caption}</p>
            </Ring>
            <div>
              <p className="text-sm font-medium">Preparation time</p>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={5}
                className="mt-2"
                placeholder="Make notes here. You can see them while you speak."
              />
              <div className="mt-3 flex justify-end">
                <Button variant="outline" onClick={() => setPhase("ready")}>
                  Start speaking now
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {phase !== "prep" && (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          <div className="grid gap-4 self-start">
            {notes && (
              <div className="rounded-[0.625rem] border border-line bg-surface p-4">
                <p className="mb-1 text-xs font-semibold uppercase tracking-[0.1em] text-muted">
                  Your notes
                </p>
                <p className="whitespace-pre-line text-sm">{notes}</p>
              </div>
            )}
            <div className="grid justify-items-center gap-4 rounded-card border border-line bg-surface p-6 text-center">
              <Ring value={ringState.value} total={ringState.total} tone={ringState.tone} label={`${ringState.caption}, ${ringState.time}`}>
                <p className="font-mono text-2xl tabular-nums">{ringState.time}</p>
                <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted">{ringState.caption}</p>
              </Ring>
              <p className="font-mono text-xs tabular-nums text-muted">
                up to {formatClock(item.maxSeconds)}
              </p>
              {!speech.supported && (
                <p className="text-xs text-warn">
                  Live transcription needs Chrome or Safari. You can still practise: time yourself
                  with the clock, then type what you said.
                </p>
              )}
              {speech.error && phase !== "recording" && (
                <p className="text-sm text-bad">{speech.error}</p>
              )}
              <div className="flex flex-wrap items-center justify-center gap-3">
                {phase === "ready" && (
                  <Button size="lg" onClick={startRecording}>
                    <Icon name="mic" size={16} /> Start speaking
                  </Button>
                )}
                {phase === "recording" && (
                  <Button size="lg" variant="danger" onClick={stopRecording}>
                    <Icon name="square" size={14} /> Stop
                  </Button>
                )}
                {(phase === "review" || phase === "graded") && (
                  <Button variant="ghost" onClick={restart} disabled={grading}>
                    <Icon name="rotateCcw" size={14} /> Speak again
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
              <span className="tnum text-xs text-muted">
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
              The examiner grades the transcript, so correct any words the recogniser misheard,
              but do not rewrite what you actually said.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              {phase === "review" && (
                <Button onClick={submit} disabled={grading || words === 0}>
                  {grading ? "Grading…" : "Get my band"}
                </Button>
              )}
              {phase === "graded" && onNext && (
                <Button onClick={onNext}>
                  Next prompt <Icon name="arrowRight" size={14} className="rtl:rotate-180" />
                </Button>
              )}
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
