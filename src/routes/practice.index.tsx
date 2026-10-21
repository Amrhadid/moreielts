import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "~/components/layout/AppShell";
import { Badge } from "~/components/ui/Badge";
import { Card, CardBody, CardHeader, CardTitle } from "~/components/ui/Card";
import { PRACTICE_META, PRACTICE_SECTIONS } from "~/data/practice";
import { Protected, useAuth } from "~/lib/auth";
import {
  fetchHistory,
  formatHistoryScore,
  readHistory,
  type PracticeHistoryEntry,
} from "~/lib/practice/history";

export const Route = createFileRoute("/practice/")({
  head: () => ({
    meta: [
      { title: "Practice — MoreIELTS" },
      {
        name: "description",
        content:
          "Short IELTS Listening, Reading, Writing and Speaking practice sets, marked and explained by an AI examiner.",
      },
    ],
  }),
  component: PracticeRoute,
});

function PracticeRoute() {
  return (
    <Protected>
      <PracticeHome />
    </Protected>
  );
}

function PracticeHome() {
  const { user } = useAuth();
  const [local, setLocal] = useState<PracticeHistoryEntry[]>([]);

  // localStorage is read after mount so the server render matches the client.
  useEffect(() => {
    setLocal(readHistory(user?.id));
  }, [user?.id]);

  // The server copy (ielts_practice_results) wins when it answers; the local
  // mirror covers offline use and a failed query.
  const remote = useQuery({
    queryKey: ["practice-history", user?.id],
    enabled: Boolean(user?.id),
    queryFn: () => fetchHistory(user!.id),
  });
  const history = remote.data ?? local;

  return (
    <AppShell>
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Practice</h1>
      <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted">
        Five questions per skill, untimed. Listening and Reading are marked the moment you
        check them and every answer is explained from the text; Writing and Speaking are
        banded by an AI examiner on the four official criteria, with quotes from your own
        words as evidence.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {PRACTICE_SECTIONS.map((code) => {
          const meta = PRACTICE_META[code];
          const last = history.find((h) => h.section === code);
          return (
            <Link
              key={code}
              to="/practice/$section"
              params={{ section: code }}
              className="group rounded-card border border-line bg-surface p-5 shadow-[0_8px_30px_rgba(20,49,78,0.055)] transition-all hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-[0_14px_40px_rgba(20,49,78,0.09)]"
            >
              <div className="flex items-start justify-between gap-3">
                <span aria-hidden className="text-2xl">
                  {meta.icon}
                </span>
                <Badge tone="brand">AI corrected</Badge>
              </div>
              <h2 className="mt-3 text-lg font-semibold tracking-tight group-hover:text-brand-700">
                {meta.label}
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-ink-soft">{meta.blurb}</p>
              <p className="mt-3 text-xs text-muted">{meta.detail}</p>
              <p className="mt-1 text-xs text-muted">{meta.correction}</p>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="font-semibold text-brand-600">Start →</span>
                {last && (
                  <span className="text-xs text-muted">
                    Last: {formatHistoryScore(last)}
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Recent practice</CardTitle>
        </CardHeader>
        <CardBody>
          {history.length === 0 ? (
            <p className="text-sm text-muted">
              {remote.isLoading
                ? "Loading your results…"
                : "Nothing yet. Your last forty practice results will appear here."}
            </p>
          ) : (
            <ul className="divide-y divide-line">
              {history.slice(0, 8).map((entry) => (
                <li key={entry.id} className="flex items-start justify-between gap-4 py-3 text-sm">
                  <div className="min-w-0">
                    <p className="truncate font-medium">
                      <span className="mr-2 text-xs font-semibold uppercase tracking-wide text-muted">
                        {PRACTICE_META[entry.section].label}
                      </span>
                      {entry.title}
                    </p>
                    {entry.summary && (
                      <p className="mt-0.5 line-clamp-2 text-xs text-muted">{entry.summary}</p>
                    )}
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="font-semibold tabular-nums">{formatHistoryScore(entry)}</p>
                    <p className="text-xs text-muted">
                      {new Date(entry.at).toLocaleDateString(undefined, {
                        day: "numeric",
                        month: "short",
                      })}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardBody>
      </Card>

      <p className="mt-6 text-xs leading-relaxed text-muted">
        Practice sets are fixed and never adaptive. For a full timed section with a band
        score, take the{" "}
        <Link to="/mock" className="font-medium text-brand-600">
          mock test
        </Link>
        .
      </p>
    </AppShell>
  );
}
