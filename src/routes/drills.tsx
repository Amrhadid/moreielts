import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell, PageHeader } from "~/components/layout/AppShell";
import { Button } from "~/components/ui/Button";
import { EmptyState, SkeletonRows } from "~/components/ui/EmptyState";
import { Icon } from "~/components/ui/Icon";
import { Progress } from "~/components/ui/Progress";
import { SectionIcon } from "~/components/ui/SectionIcon";
import { Select } from "~/components/ui/Select";
import { PremiumGate } from "~/lib/auth";
import { cn } from "~/lib/cn";
import { useI18n } from "~/lib/i18n";
import { SECTIONS } from "~/lib/sections";
import { useDrillHistory, useTypeAccuracy } from "~/lib/practice-queries";
import { useQuestionTypes } from "~/lib/queries";

export const Route = createFileRoute("/drills")({ component: PracticeRoute });

function PracticeRoute() {
  return (
    <PremiumGate>
      <AppShell>
        <PracticeHub />
      </AppShell>
    </PremiumGate>
  );
}

type Tab = "listening" | "reading" | "writing" | "speaking";
const DIFFICULTIES = [
  { value: "any", label: "Any difficulty" },
  { value: "foundation", label: "Foundation · band 5 to 6" },
  { value: "standard", label: "Standard · band 6 to 7" },
  { value: "challenge", label: "Challenge · band 7.5 and up" },
];

function PracticeHub() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("reading");
  const [difficulty, setDifficulty] = useState("any");
  const { data: types, isLoading } = useQuestionTypes();
  const { data: accuracy } = useTypeAccuracy();
  const { data: history } = useDrillHistory();

  const cards = useMemo(() => {
    const acc = new Map((accuracy ?? []).map((a) => [a.type_code, a]));
    return (types ?? [])
      .filter((ty) => ty.section === tab)
      .map((ty) => {
        const a = acc.get(ty.code);
        return { ...ty, correct: a?.correct ?? 0, total: a?.total ?? 0 };
      })
      .sort((x, y) => {
        // Weakest first; untried types after tried ones.
        if (!x.total && !y.total) return x.label.localeCompare(y.label);
        if (!x.total) return 1;
        if (!y.total) return -1;
        return x.correct / x.total - y.correct / y.total;
      });
  }, [types, accuracy, tab]);

  return (
    <>
      <PageHeader title={t("practice.title")} subtitle={t("practice.subtitle")} />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div role="tablist" className="inline-flex max-w-full gap-0.5 overflow-x-auto rounded-[0.625rem] border border-line bg-surface p-1">
          {SECTIONS.map((s) => (
            <button
              key={s.code}
              role="tab"
              type="button"
              aria-selected={tab === s.code}
              onClick={() => setTab(s.code)}
              className={cn(
                "flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors",
                tab === s.code ? "bg-brand-600 font-semibold text-on-brand" : "text-ink-soft hover:bg-paper",
              )}
            >
              <Icon name={s.icon} size={15} />
              {s.label}
            </button>
          ))}
        </div>
        {(tab === "listening" || tab === "reading") && (
          <Select
            aria-label="Difficulty"
            value={difficulty}
            onValueChange={setDifficulty}
            options={DIFFICULTIES}
            className="w-auto min-w-[14rem]"
          />
        )}
      </div>

      <section className="mt-6">
        {tab === "writing" ? (
          <EmptyState
            title="Writing is practised in the Writing lab"
            body="Write a Task 1 or Task 2 response and get band-style feedback with corrections and a band+1 rewrite."
            action={
              <Button asChild>
                <Link to={"/writing-lab" as never}>Open the Writing lab</Link>
              </Button>
            }
          />
        ) : tab === "speaking" ? (
          <EmptyState
            title="Speaking is practised in the full mock tests"
            body="All three parts are recorded and assessed together, including the Part 2 cue card."
            action={
              <Button asChild>
                <Link to="/mock">Choose a mock test</Link>
              </Button>
            }
          />
        ) : isLoading ? (
          <SkeletonRows rows={4} />
        ) : cards.length === 0 ? (
          <EmptyState title="No question types to drill in this section yet" />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((c) => {
              const pct = c.total ? Math.round((c.correct / c.total) * 100) : 0;
              return (
                <button
                  key={c.code}
                  type="button"
                  onClick={() =>
                    navigate({
                      to: "/drill/$typeCode",
                      params: { typeCode: c.code },
                      search: (difficulty !== "any" ? { difficulty } : {}) as never,
                    })
                  }
                  className="flex gap-3 rounded-card border border-line bg-surface p-4 text-start transition-colors hover:border-brand-600"
                >
                  <SectionIcon code={c.section} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">{c.label}</p>
                    {c.total ? (
                      <>
                        <div className="mt-2 flex items-baseline justify-between gap-2">
                          <span className="display tnum text-lg">{pct}%</span>
                          <span className="tnum text-xs text-muted">
                            {c.correct} of {c.total}
                          </span>
                        </div>
                        <Progress value={pct} tone={pct >= 70 ? "good" : "brand"} className="mt-1.5" label={`${c.label} accuracy`} />
                      </>
                    ) : (
                      <p className="mt-2 text-xs text-muted">Not tried yet</p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold tracking-tight">Recent drills</h2>
        {!history?.length ? (
          <p className="mt-2 text-sm text-muted">Your finished drills will appear here.</p>
        ) : (
          <ul className="mt-2 divide-y divide-line">
            {history.map((h) => (
              <li key={h.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                <span className="font-medium">{h.question_types?.label ?? h.type_code}</span>
                <span className="flex items-center gap-4 text-muted">
                  <span className="display tnum text-base text-ink">
                    {h.correct}/{h.total}
                  </span>
                  <span className="font-mono text-xs">{new Date(h.submitted_at).toLocaleDateString()}</span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
