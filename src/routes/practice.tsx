import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AppShell, PageHeader } from "~/components/layout/AppShell";
import { Button } from "~/components/ui/Button";
import { Card } from "~/components/ui/Card";
import { EmptyState, SkeletonRows } from "~/components/ui/EmptyState";
import { SectionIcon } from "~/components/ui/SectionIcon";
import { isCompleted } from "~/components/dashboard/attempts";
import {
  SPEAKING_CHOICES,
  WRITING_CHOICES,
  whatItAsks,
} from "~/components/dashboard/questionTypes";
import { cn } from "~/lib/cn";
import { Protected, useAuth } from "~/lib/auth";
import { useAttemptReview, useAttempts, useQuestionTypes } from "~/lib/queries";
import { SECTIONS, sectionMeta } from "~/lib/sections";
import type { Difficulty, SectionCode } from "~/types/content";

const SECTION_CODES: SectionCode[] = ["listening", "reading", "writing", "speaking"];

interface PracticeSearch {
  section?: SectionCode;
  type?: string;
}

export const Route = createFileRoute("/practice")({
  validateSearch: (search: Record<string, unknown>): PracticeSearch => ({
    section: SECTION_CODES.includes(search.section as SectionCode)
      ? (search.section as SectionCode)
      : undefined,
    type: typeof search.type === "string" && search.type ? search.type : undefined,
  }),
  component: PracticeRoute,
});

function PracticeRoute() {
  return (
    <Protected>
      <PracticePicker />
    </Protected>
  );
}

const DIFFICULTIES: Array<{ code: Difficulty; label: string; detail: string }> = [
  { code: "foundation", label: "Foundation", detail: "band 5 to 6" },
  { code: "standard", label: "Standard", detail: "band 6 to 7" },
  { code: "challenge", label: "Challenge", detail: "band 7.5 and up" },
];

const ESTIMATE: Record<SectionCode, string> = {
  listening: "1 part · 10 questions · about 8 minutes",
  reading: "1 passage · up to 13 questions · about 15 minutes",
  writing: "1 task · 20 to 40 minutes",
  speaking: "1 part · about 4 minutes · recorded",
};

interface Choice {
  code: string;
  label: string;
  asks: string;
  wordLimit?: number;
}

function PracticePicker() {
  const navigate = useNavigate({ from: "/practice" });
  const search = Route.useSearch();
  const { user } = useAuth();
  const { data: allTypes, isLoading } = useQuestionTypes();

  // Accuracy per type comes from the latest completed attempt's review rows.
  const { data: attempts } = useAttempts(user?.id);
  const latest = attempts?.find(isCompleted);
  const { data: review } = useAttemptReview(latest?.id, Boolean(latest));

  const [section, setSection] = useState<SectionCode>(search.section ?? "reading");
  const [type, setType] = useState<string | null>(search.type ?? null);
  const [difficulty, setDifficulty] = useState<Difficulty>("standard");

  // A deep link from Today or a result carries section and type.
  useEffect(() => {
    if (search.section) setSection(search.section);
    if (search.type) setType(search.type);
  }, [search.section, search.type]);

  const choices: Choice[] = useMemo(() => {
    if (section === "writing") return WRITING_CHOICES.map((c) => ({ ...c }));
    if (section === "speaking") return SPEAKING_CHOICES.map((c) => ({ ...c }));
    return (allTypes ?? [])
      .filter((t) =>
        section === "listening"
          ? t.section === "listening" || t.renderer === "text_input"
          : t.section === "reading",
      )
      .map((t) => ({
        code: t.code,
        label: t.label,
        asks: whatItAsks(t.code, section),
        wordLimit: t.default_word_limit,
      }));
  }, [allTypes, section]);

  // Fall back to the first choice whenever the selection is not in this section.
  const selected = choices.find((c) => c.code === type) ?? choices[0] ?? null;
  useEffect(() => {
    if (selected && selected.code !== type) setType(selected.code);
  }, [selected, type]);

  const accuracy = useMemo(() => {
    const map = new Map<string, { correct: number; total: number }>();
    for (const r of review ?? []) {
      if (r.section !== section) continue;
      const cur = map.get(r.type_code) ?? { correct: 0, total: 0 };
      cur.total += 1;
      if (r.is_correct === true) cur.correct += 1;
      map.set(r.type_code, cur);
    }
    return map;
  }, [review, section]);

  const meta = sectionMeta(section);

  return (
    <AppShell>
      <PageHeader title="Practice" subtitle="Untimed. Answers revealed at the end." />

      <div className="grid items-start gap-7 lg:grid-cols-[minmax(0,1fr)_18.75rem]">
        <div>
          <div
            role="tablist"
            aria-label="Section"
            className="thin-scroll inline-flex max-w-full gap-0.5 overflow-x-auto rounded-[0.625rem] border border-line bg-surface p-[3px]"
          >
            {SECTIONS.map((s) => (
              <button
                key={s.code}
                type="button"
                role="tab"
                aria-selected={section === s.code}
                onClick={() => {
                  setSection(s.code);
                  setType(null);
                  navigate({ search: { section: s.code }, replace: true });
                }}
                className={cn(
                  "shrink-0 rounded-[0.4375rem] px-3.5 py-1.5 text-sm font-medium transition-colors",
                  section === s.code
                    ? "bg-brand-600 font-semibold text-on-brand"
                    : "text-ink-soft hover:bg-paper",
                )}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className="mt-4 grid gap-2">
            {isLoading && section !== "writing" && section !== "speaking" ? (
              <SkeletonRows rows={5} />
            ) : choices.length === 0 ? (
              <EmptyState
                title="No question types yet"
                body="An admin can add question types from the admin console."
              />
            ) : (
              choices.map((c) => {
                const acc = accuracy.get(c.code);
                const pct = acc && acc.total > 0 ? Math.round((acc.correct / acc.total) * 100) : null;
                const on = selected?.code === c.code;
                return (
                  <button
                    key={c.code}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setType(c.code)}
                    className={cn(
                      "flex w-full items-center gap-3.5 rounded-card border bg-surface px-4 py-3.5 text-left transition-colors",
                      on
                        ? "border-brand-600 shadow-[inset_3px_0_0_var(--color-brand-600)]"
                        : "border-line hover:border-line-strong",
                    )}
                  >
                    <SectionIcon code={section} />
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold">{c.label}</span>
                      <span className="block text-[0.8125rem] text-muted">
                        {c.asks}
                        {c.wordLimit ? ` Up to ${c.wordLimit} ${c.wordLimit === 1 ? "word" : "words"}.` : ""}
                      </span>
                    </span>
                    <span className="shrink-0 text-right">
                      {pct !== null ? (
                        <>
                          <span
                            className={cn(
                              "display tnum block text-[1.1875rem] leading-tight",
                              pct < 60 && "text-warn",
                            )}
                          >
                            {pct}%
                          </span>
                          <span className="block text-[0.6875rem] text-muted">your accuracy</span>
                        </>
                      ) : (
                        <span className="block text-xs text-muted">not tried yet</span>
                      )}
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </div>

        <Card className="p-[1.125rem] lg:sticky lg:top-6">
          <p className="text-[0.6875rem] font-bold uppercase tracking-[0.1em] text-muted">Your set</p>
          <p className="mt-1.5 font-semibold">
            {meta.label}
            {selected ? ` · ${selected.label}` : ""}
          </p>
          <p className="mb-4 text-[0.8125rem] text-muted">{ESTIMATE[section]}</p>

          <p className="mb-1.5 text-xs font-semibold text-muted">Difficulty</p>
          <div className="mb-[1.125rem] grid gap-1.5" role="radiogroup" aria-label="Difficulty">
            {DIFFICULTIES.map((d) => {
              const on = difficulty === d.code;
              return (
                <button
                  key={d.code}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => setDifficulty(d.code)}
                  className={cn(
                    "flex items-center justify-between rounded-lg border px-3 py-2.5 text-left text-sm transition-colors",
                    on
                      ? "border-brand-600 bg-brand-50 font-semibold text-brand-700"
                      : "border-line bg-surface text-ink hover:border-line-strong",
                  )}
                >
                  <span>{d.label}</span>
                  <span className={on ? "text-brand-700" : "text-muted"}>{d.detail}</span>
                </button>
              );
            })}
          </div>

          <Button
            className="w-full"
            disabled={!selected}
            onClick={() => navigate({ to: meta.player })}
          >
            Start practice
          </Button>
          <p className="mt-2.5 text-[0.6875rem] leading-snug text-muted">
            Fixed set. The questions do not change as you work.
          </p>
        </Card>
      </div>
    </AppShell>
  );
}
