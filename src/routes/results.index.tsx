import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "~/components/layout/AppShell";
import { Badge } from "~/components/ui/Badge";
import { Card } from "~/components/ui/Card";
import { formatBand } from "~/lib/scoring";
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
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">My results</h1>
      <p className="mt-1.5 text-sm text-muted">
        Every practice set and mock test you have taken.
      </p>

      <Card className="mt-6 overflow-hidden">
        {isLoading ? (
          <div className="px-5 py-10 text-center text-sm text-muted">Loading…</div>
        ) : !attempts?.length ? (
          <div className="px-5 py-10 text-center text-sm text-muted">
            You have not taken a test yet.
          </div>
        ) : (
          <ul className="divide-y divide-line">
            {attempts.map((attempt) => (
              <li key={attempt.id}>
                <Link
                  to="/results/$attemptId"
                  params={{ attemptId: attempt.id }}
                  className="flex flex-wrap items-center gap-3 px-5 py-4 hover:bg-paper"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {attempt.test_forms?.title ?? "Test"}
                    </p>
                    <p className="mt-0.5 text-xs capitalize text-muted">
                      {new Date(attempt.started_at).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                      {attempt.current_section ? ` · ${attempt.current_section}` : ""}
                    </p>
                  </div>
                  {attempt.status === "completed" ? (
                    <Badge tone="brand">Mock</Badge>
                  ) : (
                    <Badge tone="warn">
                      {attempt.status === "awaiting_speaking" ? "Awaiting speaking" : "In progress"}
                    </Badge>
                  )}
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
