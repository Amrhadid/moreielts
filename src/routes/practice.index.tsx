import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell, PageHeader } from "~/components/layout/AppShell";
import { Badge } from "~/components/ui/Badge";
import { Card } from "~/components/ui/Card";
import { EmptyState, SkeletonRows } from "~/components/ui/EmptyState";
import { SectionIcon } from "~/components/ui/SectionIcon";
import { PRACTICE_META, PRACTICE_SECTIONS } from "~/data/practice";
import { PremiumGate, useAuth } from "~/lib/auth";
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
    <PremiumGate>
      <PracticeHome />
    </PremiumGate>
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
      <PageHeader
        title="Practice"
        subtitle="Five questions per skill, untimed. Listening and Reading are marked the moment you check them and every answer is explained from the text. Writing and Speaking are banded by an AI examiner on the four official criteria, with quotes from your own words as evidence."
      />

      <div className="grid gap-3 sm:grid-cols-2">
        {PRACTICE_SECTIONS.map((code) => {
          const meta = PRACTICE_META[code];
          const last = history.find((h) => h.section === code);
          return (
            <Link key={code} to="/practice/$section" params={{ section: code }} className="group block">
              <Card className="flex h-full gap-4 p-5 hover:border-brand-600">
                <SectionIcon code={code} size="lg" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h2 className="text-lg font-semibold tracking-tight group-hover:text-brand-700">
                      {meta.label}
                    </h2>
                    <Badge tone="brand">AI corrected</Badge>
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-ink-soft">{meta.blurb}</p>
                  <p className="mt-3 text-xs text-muted">
                    {meta.detail} · {meta.correction}
                  </p>
                  <div className="mt-4 flex items-center justify-between text-sm">
                    <span className="font-semibold text-brand-600">Start</span>
                    {last && (
                      <span className="text-xs text-muted">
                        Last: <span className="tnum">{formatHistoryScore(last)}</span>
                      </span>
                    )}
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="mt-10 mb-3 flex items-baseline justify-between">
        <h2 className="text-lg font-semibold tracking-tight">Recent practice</h2>
        <span className="text-xs text-muted">Your last forty results</span>
      </div>
      {history.length === 0 ? (
        remote.isLoading ? (
          <SkeletonRows rows={3} />
        ) : (
          <EmptyState
            title="Nothing yet"
            body="Finish a practice set and its score and the examiner's summary will appear here."
          />
        )
      ) : (
        <ul className="divide-y divide-line">
          {history.slice(0, 8).map((entry) => (
            <li key={entry.id} className="flex items-center gap-4 py-3 text-sm">
              <SectionIcon code={entry.section} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{entry.title}</p>
                {entry.summary && (
                  <p className="mt-0.5 line-clamp-2 text-xs text-muted">{entry.summary}</p>
                )}
              </div>
              <div className="shrink-0 text-end">
                <p className="display tnum text-lg">{formatHistoryScore(entry)}</p>
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

      <p className="mt-8 text-xs leading-relaxed text-muted">
        Practice sets are fixed and never adaptive. For a full timed section with a band score,
        take the{" "}
        <Link to="/mock" className="font-medium text-brand-600">
          mock test
        </Link>
        .
      </p>
    </AppShell>
  );
}
