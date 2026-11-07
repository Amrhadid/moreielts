import { useEffect, useRef, useState } from "react";
import type { WritingTask } from "~/data/practice";
import { Badge } from "~/components/ui/Badge";
import { Button } from "~/components/ui/Button";
import { Card, CardBody } from "~/components/ui/Card";
import { cn } from "~/lib/cn";
import { countWords } from "~/lib/answer-check";
import { useAuth } from "~/lib/auth";
import { formatClock } from "~/lib/text";
import { gradeWriting, WRITING_CRITERIA, type WritingGrade } from "~/lib/practice/grading";
import { appendHistory } from "~/lib/practice/history";
import { BandResultCard } from "./BandResultCard";
import { AiStatus } from "./PracticeShell";
import { BarChart, DataTable } from "./TaskData";

/**
 * Writing practice: pick one of five tasks, write against the live word count
 * and a suggested-time clock, then have the AI examiner band it on the four
 * official criteria.
 */
export function WritingRunner({ tasks }: { tasks: WritingTask[] }) {
  const [taskId, setTaskId] = useState(tasks[0]?.id ?? "");
  const task = tasks.find((t) => t.id === taskId) ?? tasks[0];
  const done = useRef(new Set<string>());

  return (
    <div className="grid gap-6">
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
        {tasks.map((t) => {
          const active = t.id === task.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTaskId(t.id)}
              aria-pressed={active}
              className={cn(
                "rounded-card border bg-surface p-3.5 text-start transition-colors",
                active
                  ? "border-brand-600 shadow-[inset_3px_0_0_var(--color-brand-600)]"
                  : "border-line hover:border-line-strong",
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">
                  Task {t.taskNumber}
                </p>
                {done.current.has(t.id) && <Badge tone="good">Banded</Badge>}
              </div>
              <p className="mt-1 text-sm font-medium leading-snug">{t.topic}</p>
            </button>
          );
        })}
      </div>

      <TaskEditor
        key={task.id}
        task={task}
        onGraded={() => {
          done.current.add(task.id);
        }}
      />
    </div>
  );
}

function TaskEditor({ task, onGraded }: { task: WritingTask; onGraded: () => void }) {
  const { user } = useAuth();
  const [text, setText] = useState("");
  const [grade, setGrade] = useState<WritingGrade | null>(null);
  const [grading, setGrading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [remaining, setRemaining] = useState(task.suggestedMinutes * 60);
  const [started, setStarted] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const words = countWords(text);
  const underLength = words < task.minWords;

  // The clock is advisory: it starts on the first keystroke, and nothing is
  // locked when it reaches zero. The examiner is told the actual length.
  useEffect(() => {
    if (!started || grade) return;
    const id = setInterval(() => setRemaining((r) => Math.max(0, r - 1)), 1000);
    return () => clearInterval(id);
  }, [started, grade]);

  useEffect(() => {
    if (grade) resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [grade]);

  async function submit() {
    setGrading(true);
    setError(null);
    try {
      const result = await gradeWriting(task, text);
      setGrade(result);
      onGraded();
      appendHistory(user?.id, {
        section: "writing",
        itemId: task.id,
        title: `${task.title} — ${task.topic}`,
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
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
      <Card className="lg:sticky lg:top-6 lg:self-start">
        <CardBody className="pt-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">{task.title}</p>
            <div
              className={cn(
                "rounded-lg border px-2.5 py-1 font-mono text-xs tabular-nums",
                remaining === 0
                  ? "border-warn/30 bg-warn-soft text-warn"
                  : "border-line-strong bg-paper text-ink",
              )}
              title="Suggested time. Nothing is locked when it runs out."
            >
              {formatClock(remaining)}
            </div>
          </div>
          <p className="mt-2 text-sm text-ink-soft">{task.instructions}</p>
          <div className="prose-passage mt-4 text-[1rem]">
            {task.prompt.split("\n\n").map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
          {task.chart && <BarChart spec={task.chart} />}
          {task.table && <DataTable spec={task.table} />}
        </CardBody>
      </Card>

      <div className="min-w-0">
        <label htmlFor={`response-${task.id}`} className="sr-only">
          Your response
        </label>
        <textarea
          id={`response-${task.id}`}
          value={text}
          disabled={grading || grade !== null}
          onChange={(e) => {
            if (!started) setStarted(true);
            setText(e.target.value);
          }}
          rows={18}
          placeholder="Start writing. There is no maximum length."
          className="min-h-[22rem] w-full resize-y rounded-t-card border border-line-strong bg-surface px-5 py-4 font-serif text-[1.0625rem] leading-[1.8] text-ink placeholder:text-muted/70 focus:border-brand-500 focus:outline-none disabled:opacity-70"
        />
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 rounded-b-card border border-t-0 border-line-strong bg-surface px-4 py-2.5 text-xs text-muted">
          <span className={cn("tnum", underLength && words > 0 ? "text-warn" : "")} aria-live="polite">
            {words} words · minimum {task.minWords}
          </span>
          <span>
            {underLength && words > 0
              ? `Under ${task.minWords} words loses marks for Task ${task.taskNumber === 1 ? "Achievement" : "Response"}.`
              : "No maximum. Write as much as the task needs."}
          </span>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          {!grade ? (
            <Button onClick={submit} disabled={grading || words === 0}>
              {grading ? "Grading…" : "Get my band"}
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={() => {
                setGrade(null);
                setText("");
                setRemaining(task.suggestedMinutes * 60);
                setStarted(false);
              }}
            >
              Write it again
            </Button>
          )}
          {!grade && words === 0 && (
            <p className="text-xs text-muted">Write your response, then ask for a band.</p>
          )}
        </div>

        <div className="mt-4">
          <AiStatus loading={grading} error={error} onRetry={submit} />
        </div>

        {grade && (
          <div ref={resultRef} className="mt-6 scroll-mt-24">
            <BandResultCard
              heading={`${task.title} · ${task.topic}`}
              band={grade.band}
              criteria={grade.criteria}
              labels={WRITING_CRITERIA}
              feedback={grade.feedback}
              meta={`${grade.wordCount} words · Task band is the mean of the four criteria to the nearest half band`}
            />
          </div>
        )}
      </div>
    </div>
  );
}
