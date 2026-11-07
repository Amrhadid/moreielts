import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, PageHeader } from "~/components/layout/AppShell";
import { Landing } from "~/components/layout/Landing";
import { Badge } from "~/components/ui/Badge";
import { BandRuler, bandDelta } from "~/components/ui/BandRuler";
import { Button } from "~/components/ui/Button";
import { Card } from "~/components/ui/Card";
import { EmptyState, SkeletonRows } from "~/components/ui/EmptyState";
import { SectionIcon } from "~/components/ui/SectionIcon";
import {
  isCompleted,
  isOpen,
  num,
  overallOf,
  resumeRoute,
  resumeSection,
  shortDate,
} from "~/components/dashboard/attempts";
import { useAuth } from "~/lib/auth";
import { useAttemptResult, useAttemptReview, useAttempts } from "~/lib/queries";
import { formatBand, tallyBy } from "~/lib/scoring";
import { SECTIONS, sectionMeta } from "~/lib/sections";
import type { SectionCode } from "~/types/content";

export const Route = createFileRoute("/")({ component: HomeRoute });

/**
 * The homepage is public: visitors without a session get the marketing landing
 * page, signed-in users get Today.
 */
function HomeRoute() {
  const { session, loading } = useAuth();
  if (loading || !session) return <Landing />;
  return <Today />;
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function Today() {
  const { profile, user } = useAuth();
  const { data: attempts, isLoading } = useAttempts(user?.id);

  const open = attempts?.find(isOpen);
  const completed = (attempts ?? []).filter(isCompleted);
  const latest = completed[0];
  const previous = completed[1];

  // Section bands come from the full score row of the latest completed attempt.
  const { data: latestResult } = useAttemptResult(latest?.id);
  const { data: review, isLoading: reviewLoading } = useAttemptReview(
    latest?.id,
    Boolean(latest),
  );

  const target = profile?.target_band ? Number(profile.target_band) : 7;
  const estimated =
    profile?.current_band !== null && profile?.current_band !== undefined
      ? Number(profile.current_band)
      : overallOf(latest);
  const change =
    overallOf(latest) !== null && overallOf(previous) !== null
      ? Math.round((overallOf(latest)! - overallOf(previous)!) * 2) / 2
      : null;

  const scores = latestResult?.scores;
  const sectionBand: Record<SectionCode, number | null> = {
    listening: num(scores?.listening_band),
    reading: num(scores?.reading_band),
    writing: num(scores?.writing_band),
    speaking: num(scores?.speaking_band),
  };

  const weakest = tallyBy(
    (review ?? [])
      .filter((r) => r.section === "listening" || r.section === "reading")
      .map((r) => ({
        questionId: r.question_id,
        typeCode: r.type_code,
        partNumber: r.part_number,
        isCorrect: r.is_correct === true,
      })),
    (r) => r.typeCode,
  )
    .filter((row) => row.total >= 3)
    .sort((a, b) => a.correct / a.total - b.correct / b.total)
    .slice(0, 3)
    .map((row) => {
      const sample = (review ?? []).find((r) => r.type_code === row.key);
      return {
        ...row,
        label: sample?.type_label ?? row.key,
        section: (sample?.section ?? "reading") as SectionCode,
      };
    });

  const firstName = (profile?.full_name ?? user?.email ?? "there").split(/[\s@]/)[0];
  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <AppShell>
      <PageHeader title={`${greeting()}, ${firstName}`} subtitle={today} />

      {/* Primary action: the only tinted surface on the page. */}
      {open ? (
        <Card className="flex flex-wrap items-center gap-5 border-brand-600 bg-brand-50 px-6 py-5">
          <SectionIcon code={resumeSection(open)} size="lg" />
          <div className="min-w-[12rem] flex-1">
            <p className="text-[0.6875rem] font-bold uppercase tracking-[0.1em] text-brand-700">
              {open.status === "awaiting_speaking" ? "Awaiting speaking" : "In progress"}
            </p>
            <p className="mt-0.5 text-lg font-semibold">
              Continue {sectionMeta(resumeSection(open)).label} · {open.test_forms?.title ?? "Mock test"}
            </p>
            <p className="mt-0.5 text-sm text-ink-soft">
              Started {shortDate(open.started_at)} · the section clock is set by the server when you return
            </p>
          </div>
          <Button asChild>
            <Link to={resumeRoute(open)}>Continue test</Link>
          </Button>
        </Card>
      ) : (
        <Card className="flex flex-wrap items-center gap-5 border-brand-600 bg-brand-50 px-6 py-5">
          <SectionIcon code="listening" size="lg" />
          <div className="min-w-[12rem] flex-1">
            <p className="text-[0.6875rem] font-bold uppercase tracking-[0.1em] text-brand-700">
              Next step
            </p>
            <p className="mt-0.5 text-lg font-semibold">Start your next mock</p>
            <p className="mt-0.5 text-sm text-ink-soft">
              Four sections in the official order, under exam timing. About 2 h 45 min.
            </p>
          </div>
          <Button asChild>
            <Link to="/mock">Choose a test</Link>
          </Button>
        </Card>
      )}

      {/* Band */}
      <div className="mb-3 mt-8 flex items-baseline justify-between gap-3">
        <h2 className="text-[1.0625rem] font-semibold tracking-tight">Your band</h2>
        <Link to="/learn" className="text-sm font-medium text-brand-600">
          How this is estimated
        </Link>
      </div>
      <Card className="grid gap-8 p-6 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <div className="mb-7 flex flex-wrap items-end gap-7">
            <div>
              <p className="text-[0.6875rem] font-bold uppercase tracking-[0.08em] text-muted">Estimated</p>
              <p className="display tnum text-[3.25rem] leading-none">
                {estimated !== null ? formatBand(estimated) : "—"}
              </p>
            </div>
            <div>
              <p className="text-[0.6875rem] font-bold uppercase tracking-[0.08em] text-muted">Target</p>
              <p className="display tnum text-[3.25rem] leading-none text-muted">{formatBand(target)}</p>
            </div>
            {change !== null && (
              <div className="pb-2">
                <Badge tone={change >= 0 ? "good" : "warn"}>
                  {change > 0 ? `+${formatBand(change)}` : change < 0 ? `−${formatBand(Math.abs(change))}` : "no change"} since{" "}
                  {shortDate(previous!.started_at)}
                </Badge>
              </div>
            )}
          </div>
          <div className="pt-4">
            <BandRuler band={estimated} target={target} ticks />
          </div>
          <p className="mt-4 text-xs text-muted">
            {estimated === null
              ? "Sit a mock test to get your first estimate."
              : "AI estimate. Not an official IELTS result."}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2.5 content-start">
          {SECTIONS.map((s) => {
            const band = sectionBand[s.code];
            const delta = bandDelta(band, target);
            return (
              <Link
                key={s.code}
                to="/practice"
                search={{ section: s.code }}
                className="flex items-center gap-2.5 rounded-[0.625rem] border border-line px-3 py-2.5 transition-colors hover:border-line-strong hover:bg-paper"
              >
                <SectionIcon code={s.code} />
                <span className="min-w-0 flex-1">
                  <span className="block text-xs text-muted">{s.label}</span>
                  <span className="display tnum block text-[1.375rem] leading-tight">
                    {band !== null ? formatBand(band) : "—"}
                  </span>
                </span>
                {delta && <Badge tone={delta.tone}>{delta.label}</Badge>}
              </Link>
            );
          })}
        </div>
      </Card>

      {/* Focus and recent attempts */}
      <div className="grid gap-x-10 gap-y-2 lg:grid-cols-[1.1fr_1fr]">
        <section>
          <div className="mb-1 mt-8 flex items-baseline justify-between gap-3">
            <h2 className="text-[1.0625rem] font-semibold tracking-tight">Focus this week</h2>
            {latest && (
              <Link
                to="/results/$attemptId"
                params={{ attemptId: latest.id }}
                className="text-sm font-medium text-brand-600"
              >
                From your last mock
              </Link>
            )}
          </div>
          {latest && reviewLoading ? (
            <SkeletonRows rows={3} />
          ) : weakest.length === 0 ? (
            <EmptyState
              className="mt-3"
              title="No focus yet"
              body="Complete a Listening or Reading section and your weakest question types appear here."
              action={
                <Button asChild variant="outline" size="sm">
                  <Link to="/mock">Start a mock</Link>
                </Button>
              }
            />
          ) : (
            <ul className="divide-y divide-line">
              {weakest.map((row) => (
                <li key={row.key} className="flex items-center gap-3.5 py-3.5">
                  <SectionIcon code={row.section} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{row.label}</p>
                    <p className="text-[0.8125rem] text-muted">
                      {row.correct} of {row.total} correct in {sectionMeta(row.section).label}
                    </p>
                  </div>
                  <Button asChild variant="outline" size="sm">
                    <Link to="/practice" search={{ section: row.section, type: row.key }}>
                      Practise
                    </Link>
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <div className="mb-1 mt-8 flex items-baseline justify-between gap-3">
            <h2 className="text-[1.0625rem] font-semibold tracking-tight">Recent attempts</h2>
            <Link to="/results" className="text-sm font-medium text-brand-600">
              All results
            </Link>
          </div>
          {isLoading ? (
            <SkeletonRows rows={4} />
          ) : completed.length === 0 ? (
            <EmptyState
              className="mt-3"
              title="No attempts yet"
              body="Your results appear here once you submit a section."
            />
          ) : (
            <ul className="divide-y divide-line">
              {completed.slice(0, 5).map((attempt) => (
                <li key={attempt.id}>
                  <Link
                    to="/results/$attemptId"
                    params={{ attemptId: attempt.id }}
                    className="-mx-2 flex items-center gap-3 rounded-lg px-2 py-3 transition-colors hover:bg-surface"
                  >
                    <span className="w-14 shrink-0 font-mono text-xs text-muted">
                      {shortDate(attempt.started_at)}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-sm">
                      {attempt.test_forms?.title ?? "Test"}
                    </span>
                    <Badge>Mock</Badge>
                    <span className="display tnum w-10 text-right text-lg">
                      {attempt.attempt_scores?.overall_band
                        ? formatBand(Number(attempt.attempt_scores.overall_band))
                        : "—"}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </AppShell>
  );
}
