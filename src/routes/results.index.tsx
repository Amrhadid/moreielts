import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "~/components/layout/AppShell";
import { Badge } from "~/components/ui/Badge";
import { Card } from "~/components/ui/Card";
import { formatBand } from "~/lib/band";
import { mockAttempts, mockInProgress } from "~/mock/user";

export const Route = createFileRoute("/results/")({ component: ResultsList });

function ResultsList() {
  const all = [mockInProgress, ...mockAttempts];
  return (
    <AppShell>
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">My results</h1>
      <p className="mt-1.5 text-sm text-muted">
        Every practice set and mock test you have taken.
      </p>

      <Card className="mt-6 overflow-hidden">
        <ul className="divide-y divide-line">
          {all.map((attempt) => (
            <li key={attempt.id}>
              <Link
                to="/results/$attemptId"
                params={{ attemptId: attempt.id }}
                className="flex flex-wrap items-center gap-3 px-5 py-4 hover:bg-paper"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{attempt.formTitle}</p>
                  <p className="mt-0.5 text-xs capitalize text-muted">
                    {new Date(attempt.takenAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}{" "}
                    · {attempt.section === "full" ? "All sections" : attempt.section}
                  </p>
                </div>
                {attempt.status === "in_progress" ? (
                  <Badge tone="warn">In progress</Badge>
                ) : (
                  <Badge tone={attempt.mode === "mock" ? "brand" : "neutral"}>
                    {attempt.mode === "mock" ? "Mock" : "Practice"}
                  </Badge>
                )}
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
