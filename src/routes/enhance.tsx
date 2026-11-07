import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell, PageHeader } from "~/components/layout/AppShell";
import { Badge } from "~/components/ui/Badge";
import { Button } from "~/components/ui/Button";
import { Card } from "~/components/ui/Card";
import { EmptyState } from "~/components/ui/EmptyState";
import { Input, Label } from "~/components/ui/Field";
import { Icon } from "~/components/ui/Icon";
import { Progress } from "~/components/ui/Progress";
import { SectionIcon } from "~/components/ui/SectionIcon";
import { Select } from "~/components/ui/Select";
import { cn } from "~/lib/cn";
import { useI18n } from "~/lib/i18n";
import { PremiumGate, useAuth } from "~/lib/auth";
import { usePlanChecks, useTogglePlanCheck, useUpdateGoals, type TypeAccuracyRow } from "~/lib/practice-queries";
import type { PlanPhase } from "~/lib/study-plan";
import { useDailyPlan } from "~/lib/use-daily-plan";

export const Route = createFileRoute("/enhance")({ component: EnhanceRoute });

function EnhanceRoute() {
  return (
    <PremiumGate>
      <StudyPlan />
    </PremiumGate>
  );
}

const BAND_OPTIONS = Array.from({ length: 11 }, (_, i) => {
  const v = (4 + i * 0.5).toFixed(1);
  return { value: v, label: v };
});
const GOAL_OPTIONS = [10, 20, 30, 45, 60, 90].map((m) => ({ value: String(m), label: `${m} min / day` }));
const VARIANT_OPTIONS = [
  { value: "academic", label: "Academic" },
  { value: "general_training", label: "General Training" },
];

const PHASE_LABEL: Record<PlanPhase, { label: string; detail: string }> = {
  foundation: { label: "Foundation", detail: "Learning every question type and building vocabulary." },
  build: { label: "Build", detail: "Targeting the types that cost you the most marks." },
  "exam-ready": { label: "Exam ready", detail: "Weekly full mocks and timed practice." },
  "final-week": { label: "Final week", detail: "A lighter load: review, stay sharp, rest well." },
};

function pct(row: TypeAccuracyRow) {
  return row.total ? Math.round((row.correct / row.total) * 100) : 0;
}

function SectionHeading({ title, aside }: { title: string; aside?: React.ReactNode }) {
  return (
    <div className="mb-2.5 mt-8 flex items-baseline justify-between gap-3">
      <h2 className="text-[1.0625rem] font-semibold">{title}</h2>
      {aside}
    </div>
  );
}

function StudyPlan() {
  const { t } = useI18n();
  const { user, profile } = useAuth();
  const { plan, today, stats, accuracy } = useDailyPlan();
  const { data: checks } = usePlanChecks(today, Boolean(user));
  const toggle = useTogglePlanCheck(user?.id, today);

  const planned = plan.tasks.reduce((s, task) => s + task.minutes, 0);
  const doneCount = plan.tasks.filter((task) => checks?.has(task.key)).length;

  const measured = accuracy.filter((r) => r.total >= 3);
  const weakest = [...measured].sort((a, b) => pct(a) - pct(b)).slice(0, 4);
  const strongest = [...measured]
    .sort((a, b) => pct(b) - pct(a))
    .filter((r) => !weakest.includes(r))
    .slice(0, 3);

  return (
    <AppShell>
      <PageHeader title={t("plan.title")} subtitle={t("plan.subtitle")} />

      <div className="grid gap-4 lg:grid-cols-3">
        <GoalsCard />
        <Card className="p-5">
          <p className="text-[0.6875rem] font-bold uppercase tracking-[.08em] text-muted">Exam countdown</p>
          {plan.daysToExam !== null ? (
            <p className="mt-1 flex items-baseline gap-2">
              <span className="display tnum text-[3rem] leading-none">{plan.daysToExam}</span>
              <span className="text-sm text-muted">day{plan.daysToExam === 1 ? "" : "s"} to go</span>
            </p>
          ) : (
            <p className="mt-2 text-sm text-muted">Set your exam date to get a countdown and a paced plan.</p>
          )}
          <Badge tone="brand" className="mt-4">
            {PHASE_LABEL[plan.phase].label} phase
          </Badge>
          <p className="mt-2 text-sm text-ink-soft">{PHASE_LABEL[plan.phase].detail}</p>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SectionHeading
            title="Today's plan"
            aside={
              <span className="tnum text-sm text-muted">
                {doneCount}/{plan.tasks.length} done · {planned} min
              </span>
            }
          />
          {plan.tasks.length === 0 ? (
            <EmptyState title="Nothing planned for today" body="Save your goals above to get a daily plan." />
          ) : (
            <ul className="divide-y divide-line border-t border-line">
              {plan.tasks.map((task) => {
                const done = checks?.has(task.key) ?? false;
                return (
                  <li key={task.key} className="flex items-center gap-3 py-3">
                    <input
                      type="checkbox"
                      className="h-5 w-5 shrink-0 accent-[var(--color-brand-600)]"
                      checked={done}
                      aria-label={`Mark "${task.title}" done`}
                      onChange={(e) => toggle.mutate({ taskKey: task.key, done: e.target.checked })}
                    />
                    <span
                      className={cn(
                        "grid h-9 w-9 shrink-0 place-items-center rounded-[0.625rem]",
                        done ? "bg-good-soft text-good" : "bg-brand-50 text-brand-700",
                      )}
                    >
                      <Icon name={done ? "check" : task.icon} size={17} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className={cn("text-sm font-medium", done && "text-muted line-through")}>{task.title}</p>
                      <p className="mt-0.5 text-xs text-muted">
                        {task.detail} · {task.minutes} min
                      </p>
                    </div>
                    <Button asChild variant="outline" size="sm">
                      <Link to={task.to as never} search={task.search as never}>
                        {t("common.start")}
                      </Link>
                    </Button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div>
          <SectionHeading title="Today's minutes" />
          <Card className="flex flex-col items-center p-5">
            <ProgressRing value={stats?.today_minutes ?? 0} goal={profile?.daily_goal_minutes ?? 30} />
            <p className="mt-3 flex items-center gap-1.5 text-sm text-ink-soft">
              <Icon name="flame" size={16} className="text-warn" />
              {stats?.streak ?? 0}-day streak
            </p>
          </Card>
        </div>
      </div>

      <SectionHeading title="Weak spots" aside={<span className="text-xs text-muted">From drills and mocks</span>} />
      {weakest.length === 0 ? (
        <EmptyState
          title="Not enough answers yet"
          body="Answer at least three questions of a type, in a drill or a mock, to see how you are doing on it."
          action={
            <Button asChild size="sm" variant="outline">
              <Link to="/drills">Open drills</Link>
            </Button>
          }
        />
      ) : (
        <ul className="divide-y divide-line border-t border-line">
          {weakest.map((row) => (
            <TypeRow key={row.type_code} row={row} />
          ))}
        </ul>
      )}

      {strongest.length > 0 && (
        <>
          <SectionHeading title="Strongest types" />
          <ul className="divide-y divide-line border-t border-line">
            {strongest.map((row) => (
              <TypeRow key={row.type_code} row={row} strong />
            ))}
          </ul>
        </>
      )}
    </AppShell>
  );
}

function TypeRow({ row, strong = false }: { row: TypeAccuracyRow; strong?: boolean }) {
  const p = pct(row);
  return (
    <li className="flex items-center gap-3 py-3">
      <SectionIcon code={row.section} />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{row.type_label}</p>
        <div className="mt-1.5 flex items-center gap-3">
          <Progress value={p} tone={p >= 70 ? "good" : "brand"} className="max-w-[12rem]" label={`${row.type_label} accuracy`} />
          <span className="tnum text-xs text-muted">
            {row.correct}/{row.total} · {p}%
          </span>
        </div>
      </div>
      {!strong && (
        <Button asChild variant="outline" size="sm">
          <Link to={`/drill/${row.type_code}` as never}>Drill this</Link>
        </Button>
      )}
    </li>
  );
}

function ProgressRing({ value, goal, size = 132 }: { value: number; goal: number; size?: number }) {
  const r = (size - 14) / 2;
  const c = 2 * Math.PI * r;
  const frac = Math.min(1, goal ? value / goal : 0);
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={12} className="stroke-line" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={12}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - frac)}
          className={cn("transition-[stroke-dashoffset] duration-500", frac >= 1 ? "stroke-good" : "stroke-brand-600")}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <p className="display tnum text-[1.75rem] leading-none">{value}</p>
          <p className="mt-1 text-xs text-muted">of {goal} min</p>
        </div>
      </div>
    </div>
  );
}

function GoalsCard() {
  const { user, profile } = useAuth();
  const update = useUpdateGoals();
  const [target, setTarget] = useState("7.0");
  const [examDate, setExamDate] = useState("");
  const [goal, setGoal] = useState("30");
  const [variant, setVariant] = useState<string | undefined>(undefined);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!profile) return;
    setTarget(profile.target_band != null ? Number(profile.target_band).toFixed(1) : "7.0");
    setExamDate(profile.exam_date ?? "");
    setGoal(String(profile.daily_goal_minutes ?? 30));
    setVariant(profile.variant ?? undefined);
  }, [profile]);

  return (
    <Card className="p-5 lg:col-span-2">
      <p className="text-[0.6875rem] font-bold uppercase tracking-[.08em] text-muted">Your goals</p>
      <form
        className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (!user) return;
          setSaved(false);
          update.mutate(
            {
              userId: user.id,
              target_band: Number(target),
              exam_date: examDate || null,
              daily_goal_minutes: Number(goal),
              variant: (variant as "academic" | "general_training" | undefined) ?? null,
            },
            { onSuccess: () => setSaved(true) },
          );
        }}
      >
        <div>
          <Label>Target band</Label>
          <Select aria-label="Target band" value={target} onValueChange={setTarget} options={BAND_OPTIONS} />
        </div>
        <div>
          <Label htmlFor="exam-date">Exam date</Label>
          <Input id="exam-date" type="date" value={examDate} onChange={(e) => setExamDate(e.target.value)} />
        </div>
        <div>
          <Label>Daily goal</Label>
          <Select aria-label="Daily goal" value={goal} onValueChange={setGoal} options={GOAL_OPTIONS} />
        </div>
        <div>
          <Label>Exam type</Label>
          <Select
            aria-label="Exam type"
            value={variant}
            onValueChange={setVariant}
            options={VARIANT_OPTIONS}
            placeholder="Academic or General?"
          />
          <p className="mt-1 text-xs text-muted">Filters your mocks, drills and writing prompts.</p>
        </div>
        <div className="flex items-center gap-3 sm:col-span-2 lg:col-span-4">
          <Button type="submit" disabled={update.isPending}>
            {update.isPending ? "Saving…" : "Save goals"}
          </Button>
          {saved && <span className="text-sm text-good">Saved</span>}
          {update.isError && <span className="text-sm text-bad">Could not save. Try again.</span>}
        </div>
      </form>
    </Card>
  );
}
