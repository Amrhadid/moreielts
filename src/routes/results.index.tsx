import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, PageHeader } from "~/components/layout/AppShell";
import { Badge } from "~/components/ui/Badge";
import { Button } from "~/components/ui/Button";
import { EmptyState, SkeletonRows } from "~/components/ui/EmptyState";
import { longDate } from "~/components/dashboard/attempts";
import { formatBand } from "~/lib/scoring";
import { sectionMeta } from "~/lib/sections";
import { Protected, useAuth } from "~/lib/auth";
import { useAttempts } from "~/lib/queries";

export const Route = createFileRoute("/results/")({ component: ResultsRoute });

function ResultsRoute() {
  return (
    <Protected>
      <ResultsList />
    </Protected>
  );
}

function ResultsList() {
  const { user } = useAuth();
  const { data: attempts, isLoading } = useAttempts(user?.id);

  return (
    <AppShell>
      <PageHeader
        title="Results"
        subtitle="Every practice set and mock test you have taken."
      />

      {isLoading ? (
        <SkeletonRows rows={5} />
      ) : !attempts?.length ? (
        <EmptyState
          title="No attempts yet"
          body="Sit a mock test or a practice set and your results appear here."
          action={
            <Button asChild>
              <Link to="/mock">Start a mock</Link>
            </Button>
          }
        />
      ) : (
        <ul className="divide-y divide-line">
          {attempts.map((attempt) => (
            <li key={attempt.id}>
              <Link
                to="/results/$attemptId"
                params={{ attemptId: attempt.id }}
                className="-mx-2 flex flex-wrap items-center gap-3 rounded-lg px-2 py-3.5 transition-colors hover:bg-surface"
              >
                <span className="w-24 shrink-0 font-mono text-xs text-muted">
                  {longDate(attempt.started_at)}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">
                    {attempt.test_forms?.title ?? "Test"}
                  </span>
                  {attempt.status !== "completed" && attempt.current_section && (
                    <span className="block text-xs text-muted">
                      Up to {sectionMeta(attempt.current_section).label}
                    </span>
                  )}
                </span>
                {attempt.status === "completed" ? (
                  <Badge>Mock</Badge>
                ) : (
                  <Badge tone="warn">
                    {attempt.status === "awaiting_speaking" ? "Awaiting speaking" : "In progress"}
                  </Badge>
                )}
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
    </AppShell>
  );
}
