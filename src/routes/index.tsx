import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "~/components/layout/AppShell";
import { Badge } from "~/components/ui/Badge";
import { Button } from "~/components/ui/Button";
import { Card, CardBody, CardHeader, CardTitle } from "~/components/ui/Card";
import { Progress } from "~/components/ui/Progress";
import { formatBand } from "~/lib/scoring";
import { cn } from "~/lib/cn";
import { useAuth } from "~/lib/auth";
import { Landing } from "~/components/layout/Landing";
import { useAttempts } from "~/lib/queries";
import { useQuery } from "@tanstack/react-query";
import { Icon, type IconName } from "~/components/ui/Icon";
import { supabase } from "~/lib/supabase";
import { roundToHalfBand } from "~/lib/scoring";
import { useDailyPlan } from "~/lib/use-daily-plan";

type SectionBands = {
  listening_band: number | null;
  reading_band: number | null;
  writing_band: number | null;
  speaking_band: number | null;
};

/** Section bands of the latest completed attempts, newest first. */
function useRecentSectionBands(userId: string | undefined) {
  return useQuery({
    queryKey: ["recent_section_bands", userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ielts_attempts")
        .select("id, submitted_at, attempt_scores:ielts_attempt_scores ( listening_band, reading_band, writing_band, speaking_band )")
        .eq("status", "completed")
        .order("submitted_at", { ascending: false })
        .limit(10);
      if (error) throw error;
      return ((data ?? []) as unknown as Array<{ attempt_scores: SectionBands | SectionBands[] | null }>)
        .map((a) => (Array.isArray(a.attempt_scores) ? a.attempt_scores[0] : a.attempt_scores))
        .filter((s): s is SectionBands => Boolean(s));
    },
  });
}

const PREDICT_SECTIONS: Array<{ key: keyof SectionBands; label: string; icon: IconName }> = [
  { key: "listening_band", label: "Listening", icon: "headphones" },
  { key: "reading_band", label: "Reading", icon: "book" },
  { key: "writing_band", label: "Writing", icon: "pen" },
  { key: "speaking_band", label: "Speaking", icon: "mic" },
];

function predicted(rows: SectionBands[], key: keyof SectionBands): number | null {
  const vals = rows
    .map((r) => r[key])
    .filter((v): v is number => v !== null && v !== undefined)
    .slice(0, 3)
    .map(Number);
  if (!vals.length) return null;
  return roundToHalfBand(vals.reduce((a, b) => a + b, 0) / vals.length);
}

function StatTile({
  icon,
  label,
  value,
  to,
  tone = "text-brand-600 bg-brand-50",
}: {
  icon: IconName;
  label: string;
  value: string;
  to?: string;
  tone?: string;
}) {
  const body = (
    <Card className={cn("h-full", to && "transition-colors hover:border-brand-200")}>
      <CardBody className="flex items-center gap-3 pt-5">
        <span className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-xl", tone)}>
          <Icon name={icon} size={20} />
        </span>
        <div className="min-w-0">
          <p className="text-xl font-bold tabular-nums">{value}</p>
          <p className="truncate text-xs text-muted">{label}</p>
        </div>
      </CardBody>
    </Card>
  );
  return to ? (
    <Link to={to as never} className="block">
      {body}
    </Link>
  ) : (
    body
  );
}

function ActivityChart({ days, goal }: { days: Array<{ day: string; minutes: number }>; goal: number }) {
  const last = days.slice(-14);
  const max = Math.max(goal, ...last.map((d) => d.minutes), 1);
  return (
    <div>
      <div className="flex h-28 items-end gap-1.5" role="img" aria-label="Study minutes over the last 14 days">
        {last.map((d) => (
          <div key={d.day} className="flex h-full flex-1 flex-col justify-end" title={`${d.day}: ${d.minutes} min`}>
            <span
              className={cn("w-full rounded-t-sm", d.minutes >= goal ? "bg-good" : d.minutes > 0 ? "bg-brand-500" : "bg-line")}
              style={{ height: `${Math.max(4, (d.minutes / max) * 100)}%` }}
            />
          </div>
        ))}
      </div>
      <div className="mt-1.5 flex justify-between text-[11px] text-muted">
        <span>{last[0] ? new Date(last[0].day).toLocaleDateString("en-GB", { day: "numeric", month: "short" }) : ""}</span>
        <span>Today</span>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/")({ component: HomeRoute });

const SECTION_LINKS = [
  { code: "listening", icon: "◉", label: "Listening", detail: "4 parts · 40 questions · 30 min", to: "/practice/listening", color: "text-[#607eea] bg-[#eef1ff]" },
  { code: "reading", icon: "▤", label: "Reading", detail: "3 passages · 40 questions · 60 min", to: "/practice/reading", color: "text-[#07966f] bg-[#e8f8f2]" },
  { code: "writing", icon: "✎", label: "Writing", detail: "2 tasks · 60 min", to: "/practice/writing", color: "text-[#c47918] bg-[#fff4df]" },
  { code: "speaking", icon: "◌", label: "Speaking", detail: "3 parts · 11–14 min", to: "/practice/speaking", color: "text-[#a055c9] bg-[#f7ecfc]" },
] as const;

/**
 * The homepage is public: visitors without a session get the marketing landing
 * page, signed-in users get their dashboard.
 */
function HomeRoute() {
  const { session, loading } = useAuth();

  // Render the landing page while the session lookup settles (and on the SSR
  // pass, where there is never a session) so the public page is what a first
  // visit paints.
  if (loading || !session) return <Landing />;

  return <Dashboard />;
}

function Dashboard() {
  const { profile, user } = useAuth();
  const { data: attempts, isLoading } = useAttempts(user?.id);
  const { plan, stats } = useDailyPlan();
  const { data: sectionRows } = useRecentSectionBands(user?.id);
  const goalMinutes = profile?.daily_goal_minutes ?? 30;

  const targetBand = profile?.target_band ? Number(profile.target_band) : 7;
  const currentBand = profile?.current_band ? Number(profile.current_band) : null;
  const gap = currentBand !== null ? targetBand - currentBand : null;

  const inProgress = attempts?.find(
    (a) => a.status === "in_progress" || a.status === "awaiting_speaking",
  );
  const grading = inProgress?.status === "awaiting_speaking" && Boolean(inProgress.submitted_at);
  const completed = (attempts ?? []).filter((a) => a.status === "completed");

  // Band trend from the last six completed attempts, oldest first.
  const trend = completed
    .map((a) => a.attempt_scores?.overall_band)
    .filter((b): b is number => b !== null && b !== undefined)
    .slice(0, 6)
    .reverse()
    .map(Number);

  const firstName = (profile?.full_name ?? user?.email ?? "there").split(" ")[0];

  return (
    <AppShell>
      <div className="mb-8 animate-rise">
        <p className="mb-2 text-xs font-bold uppercase tracking-[.14em] text-brand-600">Your study space</p>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Welcome back, {firstName}
        </h1>
        <p className="mt-1.5 text-sm capitalize text-muted">
          {profile?.tier === "premium" ? "Premium" : "Free"} plan
        </p>
      </div>

      {/* Stats row */}
      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <StatTile icon="flame" label="Day streak" value={String(stats?.streak ?? 0)} tone="text-warn bg-warn-soft" />
        <StatTile icon="chart" label={`of ${goalMinutes} min today`} value={`${stats?.today_minutes ?? 0}`} to="/enhance" />
        <StatTile icon="repeat" label="Cards due" value={String(stats?.mistakes_due ?? 0)} to="/review" />
        <StatTile icon="language" label="Words learned" value={String(stats?.words_learned ?? 0)} to="/vocabulary" />
        {plan.daysToExam !== null && (
          <StatTile icon="calendar" label="Days to exam" value={String(plan.daysToExam)} to="/enhance" tone="text-good bg-good-soft" />
        )}
      </div>

      {/* Band summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="relative overflow-hidden border-brand-100 sm:col-span-2">
          <CardBody className="pt-5">
            <span className="pointer-events-none absolute -end-16 -top-16 z-0 h-32 w-32 rounded-full bg-brand-50/70" aria-hidden />
            <div className="relative z-10 flex flex-wrap items-end gap-8">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted">
                  Estimated band
                </p>
                <p className="mt-1 text-5xl font-extrabold tabular-nums">
                  {currentBand !== null ? formatBand(currentBand) : "—"}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted">
                  Target band
                </p>
                <p className="mt-1 text-5xl font-extrabold tabular-nums text-brand-600">
                  {formatBand(targetBand)}
                </p>
              </div>
              <div className="min-w-40 flex-1">
                <p className="mb-2 text-sm text-ink-soft">
                  {gap === null
                    ? "Sit a mock test to get your first estimate"
                    : gap > 0
                      ? `${gap.toFixed(1)} bands to go`
                      : "You are at your target band"}
                </p>
                <Progress
                  value={currentBand !== null ? (currentBand / targetBand) * 100 : 0}
                />
                {trend.length > 1 && (
                  <>
                    {/* Trend bars scale against the range shown, not the full
                        0-9 scale, so movement stays visible. */}
                    <div className="mt-3 flex h-10 items-end gap-1" aria-hidden>
                      {trend.map((band, i) => {
                        const min = Math.min(...trend) - 0.5;
                        const max = Math.max(...trend);
                        const pct = ((band - min) / (max - min || 1)) * 100;
                        return (
                          <span
                            key={i}
                            className={cn(
                              "w-full rounded-sm",
                              i === trend.length - 1 ? "bg-brand-600" : "bg-brand-200",
                            )}
                            style={{ height: `${Math.max(15, pct)}%` }}
                          />
                        );
                      })}
                    </div>
                    <p className="mt-1.5 text-xs text-muted">Recent attempts</p>
                  </>
                )}
              </div>
            </div>
            <p className="mt-5 text-xs text-muted">
              AI estimated band — not an official IELTS result.
            </p>
          </CardBody>
        </Card>

        {/* Continue where you left off */}
        {inProgress && grading ? (
          <Card className="border-brand-200 bg-brand-50/40">
            <CardHeader>
              <Badge tone="warn">Grading in progress</Badge>
              <CardTitle className="mt-2">{inProgress.test_forms?.title ?? "Mock test"}</CardTitle>
            </CardHeader>
            <CardBody>
              <p className="text-sm text-ink-soft">Your Writing and Speaking are being scored.</p>
              <Button asChild variant="secondary" className="mt-3 w-full">
                <Link to="/results/$attemptId" params={{ attemptId: inProgress.id }}>
                  View results
                </Link>
              </Button>
            </CardBody>
          </Card>
        ) : inProgress ? (
          <Card className="border-brand-200 bg-brand-50/40">
            <CardHeader>
              <Badge tone="brand">In progress</Badge>
              <CardTitle className="mt-2">
                {inProgress.test_forms?.title ?? "Mock test"}
              </CardTitle>
            </CardHeader>
            <CardBody>
              <p className="text-sm capitalize text-ink-soft">
                {inProgress.current_section ?? "Not started"} section
              </p>
              <Button asChild className="mt-3 w-full">
                <Link
                  to={
                    inProgress.current_section === "listening"
                      ? "/test/listening"
                      : inProgress.current_section === "writing"
                        ? "/test/writing"
                        : inProgress.current_section === "speaking"
                          ? "/test/speaking"
                          : "/test/reading"
                  }
                  search={{ form: inProgress.form_id }}
                >
                  Continue test
                </Link>
              </Button>
            </CardBody>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Start a mock test</CardTitle>
            </CardHeader>
            <CardBody>
              <p className="text-sm text-ink-soft">
                A full timed exam under test conditions.
              </p>
              <Button asChild className="mt-3 w-full">
                <Link to="/mock">Choose a test</Link>
              </Button>
            </CardBody>
          </Card>
        )}
      </div>

      {/* Predicted band per section */}
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Predicted band</CardTitle>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted">Overall</p>
              <p className="mt-1 text-3xl font-extrabold tabular-nums text-brand-600">
                {currentBand !== null ? formatBand(currentBand) : "—"}
              </p>
            </div>
            {PREDICT_SECTIONS.map((sec) => {
              const band = predicted(sectionRows ?? [], sec.key);
              return (
                <div key={sec.key}>
                  <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted">
                    <Icon name={sec.icon} size={14} /> {sec.label}
                  </p>
                  <p className="mt-1 text-3xl font-bold tabular-nums">{band !== null ? formatBand(band) : "—"}</p>
                </div>
              );
            })}
          </div>
          <p className="mt-4 text-xs text-muted">Average of your last three completed mocks per section, to the nearest half band.</p>
        </CardBody>
      </Card>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Last 14 days</CardTitle>
          </CardHeader>
          <CardBody>
            <ActivityChart days={stats?.days ?? []} goal={goalMinutes} />
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Today's plan</CardTitle>
              <Link to="/enhance" className="text-sm font-medium text-brand-600">
                Full plan
              </Link>
            </div>
          </CardHeader>
          <CardBody>
            <ul className="grid gap-2">
              {plan.tasks.slice(0, 3).map((task) => (
                <li key={task.key}>
                  <Link
                    to={task.to as never}
                    search={task.search as never}
                    className="flex items-center gap-3 rounded-lg border border-line px-3 py-2.5 hover:bg-paper"
                  >
                    <Icon name={task.icon} size={18} className="shrink-0 text-brand-600" />
                    <span className="min-w-0 flex-1 truncate text-sm font-medium">{task.title}</span>
                    <span className="text-xs tabular-nums text-muted">{task.minutes} min</span>
                  </Link>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      </div>

      {/* Quick links to each section */}
      <h2 className="mb-3 mt-10 text-lg font-semibold tracking-tight">
        Practise a section
      </h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {SECTION_LINKS.map((section) => (
          <Link key={section.code} to="/practice/$section" params={{ section: section.code }} className="group">
            <Card className="h-full transition-all group-hover:-translate-y-1 group-hover:border-brand-200 group-hover:bg-brand-50/30 group-hover:shadow-[0_14px_30px_rgba(20,75,120,.09)]">
              <CardBody className="pt-5">
                <span className={`grid h-11 w-11 place-items-center rounded-xl text-lg font-bold ${section.color}`} aria-hidden>{section.icon}</span>
                <p className="mt-4 font-semibold">{section.label}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted">{section.detail}</p>
                <span className="mt-4 inline-block text-sm font-medium text-brand-600">
                  Start →
                </span>
              </CardBody>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent attempts */}
      <div className="mb-3 mt-10 flex items-center justify-between">
        <h2 className="text-lg font-semibold tracking-tight">Recent attempts</h2>
        <Link to="/results" className="text-sm font-medium text-brand-600">
          View all
        </Link>
      </div>
      <Card>
        {isLoading ? (
          <div className="px-5 py-8 text-center text-sm text-muted">Loading…</div>
        ) : completed.length === 0 ? (
          <div className="px-5 py-8 text-center text-sm text-muted">
            No attempts yet. Your results will appear here.
          </div>
        ) : (
          <ul className="divide-y divide-line">
            {completed.slice(0, 5).map((attempt) => (
              <li key={attempt.id}>
                <Link
                  to="/results/$attemptId"
                  params={{ attemptId: attempt.id }}
                  className="flex items-center gap-4 px-5 py-4 hover:bg-paper"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {attempt.test_forms?.title ?? "Test"}
                    </p>
                    <p className="mt-0.5 text-xs text-muted">
                      {new Date(attempt.started_at).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                      })}
                    </p>
                  </div>
                  <Badge tone="brand">Mock</Badge>
                  <span className="w-12 text-end text-lg font-semibold tabular-nums">
                    {attempt.attempt_scores?.overall_band
                      ? formatBand(Number(attempt.attempt_scores.overall_band))
                      : "—"}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </AppShell>
  );
}
