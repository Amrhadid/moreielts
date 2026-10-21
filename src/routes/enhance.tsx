import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "~/components/layout/AppShell";
import { Badge } from "~/components/ui/Badge";
import { Button } from "~/components/ui/Button";
import { Card, CardBody, CardDescription, CardHeader, CardTitle } from "~/components/ui/Card";
import { Input, Label } from "~/components/ui/Field";
import { Icon } from "~/components/ui/Icon";
import { Progress } from "~/components/ui/Progress";
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

const PHASE_LABEL: Record<PlanPhase, { label: string; detail: string }> = {
  foundation: { label: "Foundation", detail: "Learning every question type and building vocabulary." },
  build: { label: "Build", detail: "Targeting the types that cost you the most marks." },
  "exam-ready": { label: "Exam ready", detail: "Weekly full mocks and timed practice." },
  "final-week": { label: "Final week", detail: "A lighter load: review, stay sharp, rest well." },
};

function pct(row: TypeAccuracyRow) {
  return row.total ? Math.round((row.correct / row.total) * 100) : 0;
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
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{t("plan.title")}</h1>
      <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted">{t("plan.subtitle")}</p>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <GoalsCard />
        <Card>
          <CardHeader>
            <CardTitle>Exam countdown</CardTitle>
          </CardHeader>
          <CardBody>
            {plan.daysToExam !== null ? (
              <p className="text-5xl font-extrabold tabular-nums">
                {plan.daysToExam}
                <span className="ms-2 text-base font-medium text-muted">
                  day{plan.daysToExam === 1 ? "" : "s"} to go
                </span>
              </p>
            ) : (
              <p className="text-sm text-muted">Set your exam date to get a countdown and a paced plan.</p>
            )}
            <Badge tone="brand" className="mt-4">
              {PHASE_LABEL[plan.phase].label} phase
            </Badge>
            <p className="mt-2 text-sm text-ink-soft">{PHASE_LABEL[plan.phase].detail}</p>
          </CardBody>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <CardTitle>Today's plan</CardTitle>
              <span className="text-sm tabular-nums text-muted">
                {doneCount}/{plan.tasks.length} done · {planned} min
              </span>
            </div>
          </CardHeader>
          <CardBody>
            <ul className="grid gap-2">
              {plan.tasks.map((task) => {
                const done = checks?.has(task.key) ?? false;
                return (
                  <li
                    key={task.key}
                    className={cn(
                      "flex items-center gap-3 rounded-xl border border-line px-3 py-3",
                      done && "bg-good-soft/50",
                    )}
                  >
                    <input
                      type="checkbox"
                      className="h-5 w-5 shrink-0 accent-[var(--color-brand-600)]"
                      checked={done}
                      aria-label={`Mark "${task.title}" done`}
                      onChange={(e) => toggle.mutate({ taskKey: task.key, done: e.target.checked })}
                    />
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-600">
                      <Icon name={task.icon} size={18} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className={cn("text-sm font-medium", done && "text-muted line-through")}>{task.title}</p>
                      <p className="mt-0.5 text-xs text-muted">
                        {task.detail} · {task.minutes} min
                      </p>
                    </div>
                    <Button asChild variant="secondary" size="sm">
                      <Link to={task.to as never} search={task.search as never}>
                        Start
                      </Link>
                    </Button>
                  </li>
                );
              })}
            </ul>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Today's minutes</CardTitle>
          </CardHeader>
          <CardBody className="flex flex-col items-center">
            <ProgressRing value={stats?.today_minutes ?? 0} goal={profile?.daily_goal_minutes ?? 30} />
            <p className="mt-3 flex items-center gap-1.5 text-sm text-ink-soft">
              <Icon name="flame" size={16} className="text-warn" />
              {stats?.streak ?? 0}-day streak
            </p>
          </CardBody>
        </Card>
      </div>

      <h2 className="mb-3 mt-10 text-lg font-semibold tracking-tight">Weak spots</h2>
      {weakest.length === 0 ? (
        <Card>
          <CardBody className="pt-5 text-sm text-muted">
            Answer at least three questions of a type (in a drill or a mock) to see how you are doing on it.
          </CardBody>
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {weakest.map((row) => (
            <TypeCard key={row.type_code} row={row} />
          ))}
        </div>
      )}

      {strongest.length > 0 && (
        <>
          <h2 className="mb-3 mt-8 text-lg font-semibold tracking-tight">Strongest types</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {strongest.map((row) => (
              <Card key={row.type_code}>
                <CardBody className="pt-5">
                  <p className="text-sm font-medium">{row.type_label}</p>
                  <p className="mt-1 text-xs capitalize text-muted">{row.section}</p>
                  <Progress value={pct(row)} tone="good" className="mt-3" />
                  <p className="mt-1.5 text-xs tabular-nums text-muted">
                    {row.correct}/{row.total} · {pct(row)}%
                  </p>
                </CardBody>
              </Card>
            ))}
          </div>
        </>
      )}
    </AppShell>
  );
}

function TypeCard({ row }: { row: TypeAccuracyRow }) {
  const p = pct(row);
  return (
    <Card>
      <CardHeader>
        <CardTitle>{row.type_label}</CardTitle>
        <CardDescription className="capitalize">{row.section}</CardDescription>
      </CardHeader>
      <CardBody>
        <div className="mb-2 flex items-baseline justify-between text-sm">
          <span className="text-muted">Accuracy</span>
          <span className="tabular-nums">
            {row.correct}/{row.total} · {p}%
          </span>
        </div>
        <Progress value={p} tone={p >= 70 ? "good" : "brand"} />
        <Button asChild variant="secondary" size="sm" className="mt-4">
          <Link to={`/drill/${row.type_code}` as never}>Drill this</Link>
        </Button>
      </CardBody>
    </Card>
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
          <p className="text-2xl font-bold tabular-nums">{value}</p>
          <p className="text-xs text-muted">of {goal} min</p>
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
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!profile) return;
    setTarget(profile.target_band != null ? Number(profile.target_band).toFixed(1) : "7.0");
    setExamDate(profile.exam_date ?? "");
    setGoal(String(profile.daily_goal_minutes ?? 30));
  }, [profile]);

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Your goals</CardTitle>
      </CardHeader>
      <CardBody>
        <form
          className="grid gap-4 sm:grid-cols-3"
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
          <div className="flex items-center gap-3 sm:col-span-3">
            <Button type="submit" disabled={update.isPending}>
              {update.isPending ? "Saving…" : "Save goals"}
            </Button>
            {saved && <span className="text-sm text-good">Saved</span>}
            {update.isError && <span className="text-sm text-bad">Could not save. Try again.</span>}
          </div>
        </form>
      </CardBody>
    </Card>
  );
}
