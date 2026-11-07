import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, PageHeader } from "~/components/layout/AppShell";
import { Badge } from "~/components/ui/Badge";
import { Button } from "~/components/ui/Button";
import { EmptyState, SkeletonRows } from "~/components/ui/EmptyState";
import { longDate, overallOf, type AttemptListRow } from "~/components/dashboard/attempts";
import { Protected, useAuth } from "~/lib/auth";
import { useAttempts } from "~/lib/queries";
import { formatBand } from "~/lib/scoring";
import { sectionMeta } from "~/lib/sections";

export const Route = createFileRoute("/results/")({ component: ResultsRoute });

function ResultsRoute() {
  return (
    <Protected>
      <ResultsList />
    </Protected>
  );
}

function statusBadge(a: AttemptListRow) {
  if (a.status === "completed") return <Badge>Mock</Badge>;
  if (a.status === "awaiting_speaking")
    return <Badge tone="warn">{a.submitted_at ? "Grading" : "Awaiting speaking"}</Badge>;
  if (a.status === "abandoned") return <Badge>Abandoned</Badge>;
  return <Badge tone="brand">In progress</Badge>;
}

function ResultsList() {
  const { user } = useAuth();
  const { data, isLoading } = useAttempts(user?.id);
  const attempts = (data ?? []) as AttemptListRow[];

  return (
    <AppShell>
      <PageHeader title="My results" subtitle="Every mock test you have taken." />

      {isLoading ? (
        <SkeletonRows rows={5} />
      ) : attempts.length === 0 ? (
        <EmptyState
          title="You have not taken a test yet"
          body="Your first mock gives you a band for every section and an overall estimate."
          action={
            <Button asChild size="sm">
              <Link to="/mock">Start a mock</Link>
            </Button>
          }
        />
      ) : (
        <ul className="divide-y divide-line border-t border-line">
          {attempts.map((attempt) => {
            const band = overallOf(attempt);
            return (
              <li key={attempt.id}>
                <Link
                  to="/results/$attemptId"
                  params={{ attemptId: attempt.id }}
                  className="flex flex-wrap items-center gap-x-4 gap-y-1 py-3.5 hover:bg-paper"
                >
                  <span className="w-24 shrink-0 font-mono text-xs text-muted">{longDate(attempt.started_at)}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">{attempt.test_forms?.title ?? "Test"}</span>
                    {attempt.status !== "completed" && attempt.current_section && (
                      <span className="block text-xs text-muted">{sectionMeta(attempt.current_section).label} section</span>
                    )}
                  </span>
                  {statusBadge(attempt)}
                  <span className="display tnum w-12 text-end text-lg">
                    {band !== null ? formatBand(band) : "—"}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </AppShell>
  );
}
