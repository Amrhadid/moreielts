import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "~/components/layout/AppShell";
import { Badge } from "~/components/ui/Badge";
import { Button } from "~/components/ui/Button";
import { Card, CardBody } from "~/components/ui/Card";
import { cn } from "~/lib/cn";
import { questionTypesForSection } from "~/registry/questionTypes";
import type { Difficulty, QuestionTypeCode, SectionCode } from "~/types/content";

export const Route = createFileRoute("/practice")({ component: PracticePicker });

const SECTIONS: Array<{ code: SectionCode; label: string; detail: string }> = [
  { code: "listening", label: "Listening", detail: "4 parts · audio plays once" },
  { code: "reading", label: "Reading", detail: "3 passages · 60 minutes" },
  { code: "writing", label: "Writing", detail: "Task 1 and Task 2" },
  { code: "speaking", label: "Speaking", detail: "3 parts · recorded" },
];

const DIFFICULTIES: Array<{ code: Difficulty; label: string; detail: string }> = [
  { code: "foundation", label: "Foundation", detail: "Around band 5–6" },
  { code: "standard", label: "Standard", detail: "Around band 6–7" },
  { code: "challenge", label: "Challenge", detail: "Around band 7.5+" },
];

/** Writing and Speaking are practised whole, not by question type. */
const PLAYER_ROUTE: Record<SectionCode, string> = {
  listening: "/test/listening",
  reading: "/test/reading",
  writing: "/test/writing",
  speaking: "/test/speaking",
};

function Step({ n, title, hint }: { n: number; title: string; hint?: string }) {
  return (
    <div className="mb-3 flex items-baseline gap-2.5">
      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-600 text-xs font-semibold text-white">
        {n}
      </span>
      <h2 className="text-base font-semibold tracking-tight">{title}</h2>
      {hint && <span className="text-xs text-muted">{hint}</span>}
    </div>
  );
}

function PracticePicker() {
  const navigate = useNavigate();
  const [section, setSection] = useState<SectionCode>("reading");
  const [type, setType] = useState<QuestionTypeCode | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>("standard");

  const types = questionTypesForSection(section);
  const typeRequired = section === "reading" || section === "listening";
  const ready = !typeRequired || type !== null;

  return (
    <AppShell>
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Practice</h1>
      <p className="mt-1.5 text-sm text-muted">
        Drill a single question type, untimed, with answers revealed at the end.
      </p>

      <section className="mt-8">
        <Step n={1} title="Choose a section" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {SECTIONS.map((s) => (
            <button
              key={s.code}
              type="button"
              onClick={() => {
                setSection(s.code);
                setType(null);
              }}
              className={cn(
                "rounded-card border p-4 text-left transition-colors",
                section === s.code
                  ? "border-brand-500 bg-brand-50"
                  : "border-line bg-surface hover:border-line-strong",
              )}
            >
              <p className="font-medium">{s.label}</p>
              <p className="mt-1 text-xs text-muted">{s.detail}</p>
            </button>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <Step
          n={2}
          title="Choose a question type"
          hint={typeRequired ? undefined : "Not applicable for this section"}
        />
        {typeRequired ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {types.map((t) => (
              <button
                key={t.code}
                type="button"
                onClick={() => setType(t.code)}
                className={cn(
                  "rounded-card border p-4 text-left transition-colors",
                  type === t.code
                    ? "border-brand-500 bg-brand-50"
                    : "border-line bg-surface hover:border-line-strong",
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium">{t.label}</p>
                  <Badge tone={t.tier === "premium" ? "warn" : "good"}>
                    {t.tier === "premium" ? "Premium" : "Free"}
                  </Badge>
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-muted">{t.blurb}</p>
              </button>
            ))}
          </div>
        ) : (
          <Card>
            <CardBody className="pt-5 text-sm text-muted">
              {section === "writing"
                ? "Writing practice runs a full Task 1 or Task 2 prompt with the live word count."
                : "Speaking practice runs all three parts, including the Part 2 cue card."}
            </CardBody>
          </Card>
        )}
      </section>

      <section className="mt-8">
        <Step n={3} title="Choose a difficulty" />
        <div className="grid gap-3 sm:grid-cols-3">
          {DIFFICULTIES.map((d) => (
            <button
              key={d.code}
              type="button"
              onClick={() => setDifficulty(d.code)}
              className={cn(
                "rounded-card border p-4 text-left transition-colors",
                difficulty === d.code
                  ? "border-brand-500 bg-brand-50"
                  : "border-line bg-surface hover:border-line-strong",
              )}
            >
              <p className="font-medium">{d.label}</p>
              <p className="mt-1 text-xs text-muted">{d.detail}</p>
            </button>
          ))}
        </div>
        <p className="mt-3 text-xs text-muted">
          Difficulty selects which fixed practice set you receive. The test itself is
          never adaptive — questions do not change while you work.
        </p>
      </section>

      <div className="sticky bottom-0 mt-10 border-t border-line bg-paper/95 py-4 backdrop-blur">
        <div className="flex flex-wrap items-center gap-3">
          <Button
            size="lg"
            disabled={!ready}
            onClick={() => navigate({ to: PLAYER_ROUTE[section] })}
          >
            Start practice
          </Button>
          <p className="text-sm text-muted">
            {ready
              ? `${SECTIONS.find((s) => s.code === section)?.label} · ${difficulty}`
              : "Select a question type to continue"}
          </p>
        </div>
      </div>
    </AppShell>
  );
}
