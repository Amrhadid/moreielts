import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "~/components/layout/AppShell";
import { Badge } from "~/components/ui/Badge";
import { Button } from "~/components/ui/Button";
import { Card, CardBody, CardHeader, CardTitle } from "~/components/ui/Card";
import { Progress } from "~/components/ui/Progress";
import { formatBand } from "~/lib/band";
import { cn } from "~/lib/cn";
import { mockAttempts, mockBandTrend, mockInProgress, mockUser } from "~/mock/user";
import { mockResult } from "~/mock/result";

export const Route = createFileRoute("/")({ component: Dashboard });

const SECTION_LINKS = [
  { code: "listening", icon: "◖", label: "Listening", detail: "4 parts · 40 questions · 30 min", to: "/test/listening", band: mockResult.listening.band },
  { code: "reading", icon: "▤", label: "Reading", detail: "3 passages · 40 questions · 60 min", to: "/test/reading", band: mockResult.reading.band },
  { code: "writing", icon: "✎", label: "Writing", detail: "2 tasks · 60 min", to: "/test/writing", band: mockResult.writing.band },
  { code: "speaking", icon: "◉", label: "Speaking", detail: "3 parts · 11–14 min", to: "/test/speaking", band: mockResult.speaking.band },
] as const;

function Dashboard() {
  const gap = mockUser.targetBand - mockUser.estimatedBand;

  return (
    <AppShell>
      <div className="mb-7">
        <p className="text-sm font-medium text-muted">Your Academic preparation</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
          Good afternoon, {mockUser.name.split(" ")[0]}
        </h1>
        <p className="mt-1.5 text-sm text-muted">
          Academic · test booked for{" "}
          {new Date(mockUser.testDate).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>

      {/* Band summary */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="overflow-hidden lg:col-span-2">
          <CardBody className="pt-6 sm:px-7 sm:pb-7">
            <div className="flex flex-wrap items-center gap-x-10 gap-y-6">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted">
                  Current estimate
                </p>
                <p className="mt-1 text-5xl font-semibold tabular-nums text-brand-700 sm:text-6xl">
                  {formatBand(mockUser.estimatedBand)}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted">
                  Target band
                </p>
                <p className="mt-1 text-5xl font-semibold tabular-nums sm:text-6xl" style={{ color: "var(--score-accent)" }}>
                  {formatBand(mockUser.targetBand)}
                </p>
              </div>
              <div className="min-w-40 flex-1">
                <p className="mb-2 text-sm text-ink-soft">
                  {gap > 0
                    ? `${gap.toFixed(1)} bands to go`
                    : "You are at your target band"}
                </p>
                <Progress className="h-2.5"
                  value={(mockUser.estimatedBand / mockUser.targetBand) * 100}
                />
                {/* Trend bars scale against the range shown, not the full 0-9
                    scale, so week-on-week movement stays visible. */}
                <div className="mt-3 flex h-10 items-end gap-1" aria-hidden>
                  {mockBandTrend.map((band, i) => {
                    const min = Math.min(...mockBandTrend) - 0.5;
                    const max = Math.max(...mockBandTrend);
                    const pct = ((band - min) / (max - min || 1)) * 100;
                    return (
                      <span
                        key={i}
                        className={cn(
                          "w-full rounded-sm",
                          i === mockBandTrend.length - 1
                            ? "bg-warn"
                            : "bg-line-strong",
                        )}
                        style={{ height: `${Math.max(15, pct)}%` }}
                      />
                    );
                  })}
                </div>
                <p className="mt-1.5 text-xs text-muted">Last six weeks</p>
              </div>
            </div>
            <p className="mt-5 border-t border-line pt-4 text-xs text-muted">
              Your estimate is based on recent practice and updates as you complete work.
            </p>
          </CardBody>
        </Card>

        {/* Continue where you left off */}
        <Card className="border-brand-200 bg-brand-50/40">
          <CardHeader>
            <Badge tone="brand">Continue where you left off</Badge>
            <CardTitle className="mt-3">{mockInProgress.formTitle}</CardTitle>
          </CardHeader>
          <CardBody>
            <p className="text-sm capitalize text-ink-soft">
              {mockInProgress.section} section · {mockInProgress.progress}% complete
            </p>
            <Progress className="my-3" value={mockInProgress.progress ?? 0} />
            <Button asChild className="w-full">
              <Link to="/test/reading">Continue test</Link>
            </Button>
          </CardBody>
        </Card>
      </div>

      {/* Quick links to each section */}
      <h2 className="mb-3 mt-9 text-lg font-semibold tracking-tight">
        Your skills
      </h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {SECTION_LINKS.map((section) => (
          <Link key={section.code} to={section.to} className="group rounded-card">
            <Card className="h-full transition-colors group-hover:border-brand-200 group-hover:bg-brand-50/30">
              <CardBody className="pt-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-lg bg-brand-50 text-lg text-brand-700" aria-hidden>{section.icon}</div>
                  <p className="text-3xl font-semibold tabular-nums text-brand-700">{formatBand(section.band)}</p>
                </div>
                <p className="mt-4 font-semibold">{section.label}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted">
                  {section.detail}
                </p>
                <Progress className="mt-4 h-1.5" value={(section.band / 9) * 100} tone={section.band >= 7 ? "good" : "brand"} />
                <span className="mt-3 inline-block text-sm font-medium text-brand-700">Practise →</span>
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
        <ul className="divide-y divide-line">
          {mockAttempts.map((attempt) => (
            <li key={attempt.id}>
              <Link
                to="/results/$attemptId"
                params={{ attemptId: attempt.id }}
                className="flex items-center gap-4 px-5 py-4 hover:bg-paper"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{attempt.formTitle}</p>
                  <p className="mt-0.5 text-xs text-muted">
                    {new Date(attempt.takenAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                    })}{" "}
                    · {attempt.mode === "mock" ? "Full mock test" : "Practice"}
                  </p>
                </div>
                <Badge tone={attempt.mode === "mock" ? "brand" : "neutral"}>
                  {attempt.mode === "mock" ? "Mock" : "Practice"}
                </Badge>
                <span className="w-12 text-right text-lg font-semibold tabular-nums">
                  {attempt.overall ? formatBand(attempt.overall) : "—"}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Card>
    </AppShell>
  );
}
