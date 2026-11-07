import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, PageHeader } from "~/components/layout/AppShell";
import { Landing } from "~/components/layout/Landing";
import { Badge } from "~/components/ui/Badge";
import { BandRuler, bandDelta } from "~/components/ui/BandRuler";
import { Button } from "~/components/ui/Button";
import { Card } from "~/components/ui/Card";
import { EmptyState, SkeletonRows } from "~/components/ui/EmptyState";
import { Icon, type IconName } from "~/components/ui/Icon";
import { SectionIcon } from "~/components/ui/SectionIcon";
import {
  changeChip,
  greeting,
  isCompleted,
  isOpen,
  overallOf,
  resumeRoute,
  shortDate,
  type AttemptListRow,
} from "~/components/dashboard/attempts";
import { useAuth } from "~/lib/auth";
import { cn } from "~/lib/cn";
import { useAttempts, useAttemptState } from "~/lib/queries";
import { formatBand, roundToHalfBand } from "~/lib/scoring";
import { SECTIONS, sectionMeta } from "~/lib/sections";
import { supabase } from "~/lib/supabase";
import { formatClock } from "~/lib/text";
import { useDailyPlan } from "~/lib/use-daily-plan";
import { WHATSAPP_MESSAGES, whatsappLink } from "~/lib/whatsapp";

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

/** Average of the last three completed mocks for one section, to the nearest half band. */
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
  tone = "bg-brand-50 text-brand-700",
}: {
  icon: IconName;
  label: string;
  value: string;
  to?: string;
  tone?: string;
}) {
  const body = (
    <>
      <span className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-[0.625rem]", tone)}>
        <Icon name={icon} size={17} />
      </span>
      <div className="min-w-0">
        <p className="display tnum text-xl leading-none">{value}</p>
        <p className="mt-1 truncate text-xs text-muted">{label}</p>
      </div>
    </>
  );
  const cls = "flex items-center gap-3 rounded-[0.625rem] border border-line bg-surface px-3 py-2.5";
  return to ? (
    <Link to={to as never} className={cn(cls, "transition-colors hover:border-line-strong")}>
      {body}
    </Link>
  ) : (
    <div className={cls}>{body}</div>
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
              className={cn(
                "w-full rounded-t-sm",
                d.minutes >= goal ? "bg-good" : d.minutes > 0 ? "bg-brand-500" : "bg-line",
              )}
              style={{ height: `${Math.max(4, (d.minutes / max) * 100)}%` }}
            />
          </div>
        ))}
      </div>
      <div className="mt-1.5 flex justify-between text-[11px] text-muted">
        <span>{last[0] ? shortDate(last[0].day) : ""}</span>
        <span>Today</span>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/")({ component: HomeRoute });

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
  const { profile, user, isPremium } = useAuth();
  const { data: attempts, isLoading } = useAttempts(user?.id);
  const { plan, stats } = useDailyPlan();
  const { data: sectionRows } = useRecentSectionBands(user?.id);
  const goalMinutes = profile?.daily_goal_minutes ?? 30;

  const rows = (attempts ?? []) as AttemptListRow[];
  const completed = rows.filter(isCompleted);
  const inProgress = rows.find(isOpen);
  const grading = inProgress?.status === "awaiting_speaking" && Boolean(inProgress.submitted_at);
  // The server clock for the open section, so "Continue" says how long is left.
  const { data: liveState } = useAttemptState(inProgress && !grading ? inProgress.id : undefined);
  const liveRemaining = liveState?.remaining_seconds ?? null;

  const targetBand = profile?.target_band ? Number(profile.target_band) : 7;
  const latestBand = overallOf(completed[0]);
  const currentBand = profile?.current_band ? Number(profile.current_band) : latestBand;
  const change = changeChip(latestBand, overallOf(completed[1]));

  const firstName = (profile?.full_name ?? user?.email ?? "there").split(" ")[0];
  const today = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });

  return (
    <AppShell>
      <PageHeader title={`${greeting()}, ${firstName}`} subtitle={today} />

      {/* Primary action */}
      {!isPremium ? (
        <Card className="flex flex-wrap items-center gap-5 border-warn bg-warn-soft p-5 sm:p-6">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-surface text-warn">
            <Icon name="lock" size={20} />
          </span>
          <div className="min-w-[14rem] flex-1">
            <p className="text-xs font-bold uppercase tracking-[.1em] text-warn">Premium</p>
            <p className="mt-0.5 text-lg font-semibold">Your exams and practice are locked</p>
            <p className="mt-0.5 text-sm text-ink-soft">
              Enter a Premium access code to unlock every mock exam, practice set and AI correction.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline">
              <a href={whatsappLink(WHATSAPP_MESSAGES.premium)} target="_blank" rel="noopener noreferrer">
                Get Premium on WhatsApp
              </a>
            </Button>
            <Button asChild>
              <Link to="/pricing">Enter a code</Link>
            </Button>
          </div>
        </Card>
      ) : inProgress && grading ? (
        <Card className="flex flex-wrap items-center gap-5 border-brand-600 bg-brand-50 p-5 sm:p-6">
          <SectionIcon code="speaking" size="lg" />
          <div className="min-w-[14rem] flex-1">
            <p className="text-xs font-bold uppercase tracking-[.1em] text-brand-700">Grading in progress</p>
            <p className="mt-0.5 text-lg font-semibold">{inProgress.test_forms?.title ?? "Mock test"}</p>
            <p className="mt-0.5 text-sm text-ink-soft">Your Writing and Speaking are being scored.</p>
          </div>
          <Button asChild variant="outline">
            <Link to="/results/$attemptId" params={{ attemptId: inProgress.id }}>
              View results
            </Link>
          </Button>
        </Card>
      ) : inProgress ? (
        <Card className="flex flex-wrap items-center gap-5 border-brand-600 bg-brand-50 p-5 sm:p-6">
          <SectionIcon code={inProgress.current_section ?? "listening"} size="lg" />
          <div className="min-w-[14rem] flex-1">
            <p className="text-xs font-bold uppercase tracking-[.1em] text-brand-700">In progress</p>
            <p className="mt-0.5 text-lg font-semibold">
              Continue {sectionMeta(inProgress.current_section).label} · {inProgress.test_forms?.title ?? "Mock test"}
            </p>
            {liveRemaining !== null && (
              <p className={cn("mt-0.5 text-sm", liveRemaining === 0 ? "text-bad" : "text-ink-soft")}>
                {liveRemaining === 0 ? (
                  "Time is up for this section. Open it to submit."
                ) : (
                  <>
                    <span className="font-mono tnum">{formatClock(liveRemaining)}</span> left on the clock
                  </>
                )}
              </p>
            )}
          </div>
          <Button asChild>
            <Link to={resumeRoute(inProgress)} search={{ form: inProgress.form_id }}>
              Continue test
            </Link>
          </Button>
        </Card>
      ) : (
        <Card className="flex flex-wrap items-center gap-5 border-brand-600 bg-brand-50 p-5 sm:p-6">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-surface text-brand-700">
            <Icon name="clipboard" size={22} />
          </span>
          <div className="min-w-[14rem] flex-1">
            <p className="text-xs font-bold uppercase tracking-[.1em] text-brand-700">Next step</p>
            <p className="mt-0.5 text-lg font-semibold">Start your next mock</p>
            <p className="mt-0.5 text-sm text-ink-soft">A full timed exam under test conditions, with a band at the end.</p>
          </div>
          <Button asChild>
            <Link to="/mock">Choose a test</Link>
          </Button>
        </Card>
      )}

      {/* Stats row */}
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
        <StatTile icon="flame" label="Day streak" value={String(stats?.streak ?? 0)} tone="bg-warn-soft text-warn" />
        <StatTile icon="chart" label={`of ${goalMinutes} min today`} value={`${stats?.today_minutes ?? 0}`} to="/enhance" />
        <StatTile icon="repeat" label="Cards due" value={String(stats?.mistakes_due ?? 0)} to="/review" tone="bg-speaking-soft text-speaking" />
        <StatTile icon="language" label="Words learned" value={String(stats?.words_learned ?? 0)} to="/vocabulary" tone="bg-reading-soft text-reading" />
        {plan.daysToExam !== null && (
          <StatTile icon="calendar" label="Days to exam" value={String(plan.daysToExam)} to="/enhance" tone="bg-good-soft text-good" />
        )}
      </div>

      {/* Band */}
      <div className="mb-2.5 mt-8 flex items-baseline justify-between gap-3">
        <h2 className="text-[1.0625rem] font-semibold">Your band</h2>
        <Link to="/learn" className="text-sm font-medium text-brand-600">
          How this is estimated
        </Link>
      </div>
      <Card className="grid gap-8 p-6 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <div className="mb-7 flex flex-wrap items-end gap-7">
            <div>
              <p className="text-[0.6875rem] font-bold uppercase tracking-[.08em] text-muted">Estimated</p>
              <p className="display tnum text-[3.25rem] leading-none">
                {currentBand !== null ? formatBand(currentBand) : "—"}
              </p>
            </div>
            <div>
              <p className="text-[0.6875rem] font-bold uppercase tracking-[.08em] text-muted">Target</p>
              <p className="display tnum text-[3.25rem] leading-none text-muted">{formatBand(targetBand)}</p>
            </div>
            {change && completed[1] && (
              <Badge tone={change.tone} className="mb-1.5">
                {change.label} since {shortDate(completed[1].submitted_at ?? completed[1].started_at)}
              </Badge>
            )}
          </div>
          <BandRuler band={currentBand} target={targetBand} ticks />
          <p className="mt-4 text-xs text-muted">
            {currentBand === null
              ? "Sit a mock test to get your first estimate. AI estimate, not an official IELTS result."
              : "Average of your last three completed mocks per section. AI estimate, not an official IELTS result."}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2.5 self-start">
          {SECTIONS.map((sec) => {
            const band = predicted(sectionRows ?? [], `${sec.code}_band` as keyof SectionBands);
            const delta = bandDelta(band, targetBand);
            return (
              <Link
                key={sec.code}
                to="/practice/$section"
                params={{ section: sec.code }}
                className="flex items-center gap-2.5 rounded-[0.625rem] border border-line px-3 py-2.5 transition-colors hover:border-line-strong hover:bg-paper"
              >
                <SectionIcon code={sec.code} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs text-muted">{sec.label}</p>
                  <p className="display tnum text-[1.375rem] leading-tight">{band !== null ? formatBand(band) : "—"}</p>
                </div>
                {delta && <Badge tone={delta.tone}>{delta.label}</Badge>}
              </Link>
            );
          })}
        </div>
      </Card>

      {/* Plan and activity */}
      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div>
          <div className="mb-2.5 flex items-baseline justify-between gap-3">
            <h2 className="text-[1.0625rem] font-semibold">Today's plan</h2>
            <Link to="/enhance" className="text-sm font-medium text-brand-600">
              Full plan
            </Link>
          </div>
          {plan.tasks.length === 0 ? (
            <EmptyState title="Nothing planned yet" body="Set your target band and exam date to get a paced plan." action={<Button asChild variant="outline" size="sm"><Link to="/enhance">Set goals</Link></Button>} />
          ) : (
            <ul className="divide-y divide-line">
              {plan.tasks.slice(0, 4).map((task) => (
                <li key={task.key}>
                  <Link
                    to={task.to as never}
                    search={task.search as never}
                    className="flex items-center gap-3 py-3 hover:bg-paper"
                  >
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[0.625rem] bg-brand-50 text-brand-700">
                      <Icon name={task.icon} size={17} />
                    </span>
                    <span className="min-w-0 flex-1 truncate text-sm font-medium">{task.title}</span>
                    <span className="tnum text-xs text-muted">{task.minutes} min</span>
                    <Icon name="arrowRight" size={14} className="text-muted rtl:rotate-180" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <div className="mb-2.5 flex items-baseline justify-between gap-3">
            <h2 className="text-[1.0625rem] font-semibold">Last 14 days</h2>
            <span className="text-xs text-muted">Goal {goalMinutes} min a day</span>
          </div>
          <Card className="p-5">
            <ActivityChart days={stats?.days ?? []} goal={goalMinutes} />
          </Card>
        </div>
      </div>

      {/* Practise a section */}
      <h2 className="mb-2.5 mt-8 text-[1.0625rem] font-semibold">Practise a section</h2>
      <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
        {SECTIONS.map((sec) => (
          <Link
            key={sec.code}
            to="/practice/$section"
            params={{ section: sec.code }}
            className="flex items-center gap-3 rounded-card border border-line bg-surface p-4 transition-colors hover:border-line-strong"
          >
            <SectionIcon code={sec.code} />
            <div className="min-w-0 flex-1">
              <p className="font-semibold">{sec.label}</p>
              <p className="truncate text-xs text-muted">{sec.short}</p>
            </div>
            <Icon name="arrowRight" size={16} className="text-muted rtl:rotate-180" />
          </Link>
        ))}
      </div>

      {/* Recent attempts */}
      <div className="mb-2.5 mt-8 flex items-baseline justify-between gap-3">
        <h2 className="text-[1.0625rem] font-semibold">Recent attempts</h2>
        <Link to="/results" className="text-sm font-medium text-brand-600">
          All results
        </Link>
      </div>
      {isLoading ? (
        <SkeletonRows rows={3} />
      ) : completed.length === 0 ? (
        <EmptyState
          title="No completed attempts yet"
          body="Your band history starts with your first mock."
          action={
            <Button asChild size="sm">
              <Link to="/mock">Start a mock</Link>
            </Button>
          }
        />
      ) : (
        <ul className="divide-y divide-line">
          {completed.slice(0, 5).map((attempt) => (
            <li key={attempt.id}>
              <Link
                to="/results/$attemptId"
                params={{ attemptId: attempt.id }}
                className="flex items-center gap-4 py-3 hover:bg-paper"
              >
                <span className="w-14 shrink-0 font-mono text-xs text-muted">{shortDate(attempt.started_at)}</span>
                <span className="min-w-0 flex-1 truncate text-sm">{attempt.test_forms?.title ?? "Test"}</span>
                <Badge>Mock</Badge>
                <span className="display tnum w-12 text-end text-lg">
                  {overallOf(attempt) !== null ? formatBand(overallOf(attempt)!) : "—"}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </AppShell>
  );
}
