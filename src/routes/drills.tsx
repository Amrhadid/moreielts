import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "~/components/layout/AppShell";
import { Card, CardBody } from "~/components/ui/Card";
import { Icon } from "~/components/ui/Icon";
import { Protected } from "~/lib/auth";
import { cn } from "~/lib/cn";
import { useI18n } from "~/lib/i18n";
import { useDrillHistory, useTypeAccuracy } from "~/lib/practice-queries";
import { useQuestionTypes } from "~/lib/queries";

export const Route = createFileRoute("/drills")({ component: PracticeRoute });

function PracticeRoute() {
  return (
    <Protected>
      <AppShell>
        <PracticeHub />
      </AppShell>
    </Protected>
  );
}

type Tab = "listening" | "reading" | "writing" | "speaking";
const TABS: Array<{ code: Tab; label: string; icon: string }> = [
  { code: "listening", label: "Listening", icon: "headphones" },
  { code: "reading", label: "Reading", icon: "book" },
  { code: "writing", label: "Writing", icon: "pen" },
  { code: "speaking", label: "Speaking", icon: "mic" },
];
const DIFFICULTIES = [
  { code: "", label: "Any difficulty" },
  { code: "foundation", label: "Foundation" },
  { code: "standard", label: "Standard" },
  { code: "challenge", label: "Challenge" },
];

function PracticeHub() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("reading");
  const [difficulty, setDifficulty] = useState("");
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
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{t("practice.title")}</h1>
      <p className="mt-1.5 text-sm text-muted">{t("practice.subtitle")}</p>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div role="tablist" className="flex flex-wrap gap-1 rounded-card border border-line bg-surface p-1">
          {TABS.map((s) => (
            <button
              key={s.code}
              role="tab"
              type="button"
              aria-selected={tab === s.code}
              onClick={() => setTab(s.code)}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium",
                tab === s.code ? "bg-brand-600 text-white" : "text-ink-soft hover:bg-paper",
              )}
            >
              <Icon name={s.icon as never} className="h-4 w-4" />
              {s.label}
            </button>
          ))}
        </div>
        {(tab === "listening" || tab === "reading") && (
          <select
            aria-label="Difficulty"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="h-9 rounded-md border border-line-strong bg-surface px-2 text-sm"
          >
            {DIFFICULTIES.map((d) => (
              <option key={d.code} value={d.code}>
                {d.label}
              </option>
            ))}
          </select>
        )}
      </div>

      <section className="mt-6">
        {tab === "writing" ? (
          <Card>
            <CardBody className="pt-5">
              <p className="font-medium">Writing is practised in the Writing lab</p>
              <p className="mt-1 text-sm text-muted">
                Write a Task 1 or Task 2 response and get band-style feedback with corrections.
              </p>
              <Link to={"/writing-lab" as never} className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-brand-700">
                Open the Writing lab <Icon name="arrowRight" className="h-4 w-4 rtl:rotate-180" />
              </Link>
            </CardBody>
          </Card>
        ) : tab === "speaking" ? (
          <Card>
            <CardBody className="pt-5 text-sm text-muted">
              Speaking is practised in the full mock tests, where all three parts are recorded
              and assessed together, including the Part 2 cue card.
            </CardBody>
          </Card>
        ) : isLoading ? (
          <p className="text-sm text-muted">Loading question types…</p>
        ) : cards.length === 0 ? (
          <p className="text-sm text-muted">No question types to drill in this section yet.</p>
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
                      search: (difficulty ? { difficulty } : {}) as never,
                    })
                  }
                  className="rounded-card border border-line bg-surface p-4 text-start transition-colors hover:border-brand-500"
                >
                  <p className="text-sm font-medium">{c.label}</p>
                  {c.total ? (
                    <>
                      <p className="mt-2 text-xs text-muted">
                        {c.correct}/{c.total} · {pct}%
                      </p>
                      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-paper">
                        <div
                          className={cn("h-full rounded-full", pct >= 70 ? "bg-good" : pct >= 50 ? "bg-warn" : "bg-bad")}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </>
                  ) : (
                    <p className="mt-2 text-xs text-muted">Not tried yet</p>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </section>

      <section className="mt-10">
        <h2 className="text-base font-semibold tracking-tight">Recent drills</h2>
        {!history?.length ? (
          <p className="mt-2 text-sm text-muted">Your finished drills will appear here.</p>
        ) : (
          <ul className="mt-3 divide-y divide-line rounded-card border border-line bg-surface">
            {history.map((h) => (
              <li key={h.id} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
                <span className="font-medium">{h.question_types?.label ?? h.type_code}</span>
                <span className="flex items-center gap-3 text-muted">
                  <span>
                    {h.correct}/{h.total}
                  </span>
                  <span className="text-xs">{new Date(h.submitted_at).toLocaleDateString()}</span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
