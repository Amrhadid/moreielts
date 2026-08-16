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

export const Route = createFileRoute("/")({ component: HomeRoute });

const SECTION_LINKS = [
  { code: "listening", label: "Listening", detail: "4 parts · 40 questions · 30 min", to: "/test/listening" },
  { code: "reading", label: "Reading", detail: "3 passages · 40 questions · 60 min", to: "/test/reading" },
  { code: "writing", label: "Writing", detail: "2 tasks · 60 min", to: "/test/writing" },
  { code: "speaking", label: "Speaking", detail: "3 parts · 11–14 min", to: "/test/speaking" },
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

  const targetBand = profile?.target_band ? Number(profile.target_band) : 7;
  const currentBand = profile?.current_band ? Number(profile.current_band) : null;
  const gap = currentBand !== null ? targetBand - currentBand : null;

  const inProgress = attempts?.find(
    (a) => a.status === "in_progress" || a.status === "awaiting_speaking",
  );
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
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Welcome back, {firstName}
        </h1>
        <p className="mt-1.5 text-sm capitalize text-muted">
          {profile?.tier === "premium" ? "Premium" : "Free"} plan
        </p>
      </div>

      {/* Band summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="sm:col-span-2">
          <CardBody className="pt-5">
            <div className="flex flex-wrap items-end gap-8">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted">
                  Estimated band
                </p>
                <p className="mt-1 text-5xl font-semibold tabular-nums">
                  {currentBand !== null ? formatBand(currentBand) : "—"}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted">
                  Target band
                </p>
                <p className="mt-1 text-5xl font-semibold tabular-nums text-brand-600">
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
        {inProgress ? (
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

      {/* Quick links to each section */}
      <h2 className="mb-3 mt-10 text-lg font-semibold tracking-tight">
        Practise a section
      </h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {SECTION_LINKS.map((section) => (
          <Link key={section.code} to={section.to} className="group">
            <Card className="h-full transition-colors group-hover:border-brand-200 group-hover:bg-brand-50/30">
              <CardBody className="pt-5">
                <p className="font-medium">{section.label}</p>
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
                  <span className="w-12 text-right text-lg font-semibold tabular-nums">
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
