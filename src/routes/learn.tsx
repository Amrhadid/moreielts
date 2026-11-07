import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "~/components/layout/AppShell";
import { Badge } from "~/components/ui/Badge";
import { SkeletonRows } from "~/components/ui/EmptyState";
import { SectionIcon } from "~/components/ui/SectionIcon";
import { SPEAKING_CHOICES, WRITING_CHOICES, whatItAsks } from "~/components/dashboard/questionTypes";
import { Protected } from "~/lib/auth";
import { useQuestionTypes } from "~/lib/queries";
import { SECTIONS } from "~/lib/sections";

export const Route = createFileRoute("/learn")({ component: LearnRoute });

function LearnRoute() {
  return (
    <Protected>
      <Learn />
    </Protected>
  );
}

const FORMAT_FACTS = [
  { title: "Listening", body: "4 parts, 40 questions, about 30 minutes. The recording plays once only." },
  { title: "Reading", body: "3 passages, 40 questions, 60 minutes. No extra transfer time on the computer test." },
  { title: "Writing", body: "Task 1 (150 words) and Task 2 (250 words) share a single 60-minute limit." },
  { title: "Speaking", body: "3 parts, 11 to 14 minutes. Part 2 gives you 1 minute to prepare and up to 2 minutes to talk." },
  { title: "Scoring", body: "Bands 0 to 9 in half bands. The overall band is the mean of the four components, rounded to the nearest half band." },
  { title: "Fixed forms", body: "IELTS is not adaptive. The questions never get harder or easier as you work." },
];

function Learn() {
  const { data: types, isLoading } = useQuestionTypes();

  return (
    <AppShell>
      <PageHeader
        title="Learn"
        subtitle="How the exam is built, and what every question type asks of you."
      />

      <h2 className="mb-3 text-[1.0625rem] font-semibold tracking-tight">The format</h2>
      <dl className="grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
        {FORMAT_FACTS.map((fact) => (
          <div key={fact.title}>
            <dt className="display text-[1.125rem]">{fact.title}</dt>
            <dd className="mt-1 text-sm text-ink-soft">{fact.body}</dd>
          </div>
        ))}
      </dl>

      <h2 className="mb-1 mt-10 text-[1.0625rem] font-semibold tracking-tight">
        Every question type
      </h2>
      {isLoading ? (
        <SkeletonRows rows={6} />
      ) : (
        SECTIONS.map((s) => {
          const rows =
            s.code === "writing"
              ? WRITING_CHOICES.map((c) => ({ code: c.code, label: c.label, asks: c.asks, limit: 0 }))
              : s.code === "speaking"
                ? SPEAKING_CHOICES.map((c) => ({ code: c.code, label: c.label, asks: c.asks, limit: 0 }))
                : (types ?? [])
                    .filter((t) => t.section === s.code)
                    .map((t) => ({
                      code: t.code,
                      label: t.label,
                      asks: whatItAsks(t.code, s.code),
                      limit: t.default_word_limit,
                    }));
          if (rows.length === 0) return null;
          return (
            <section key={s.code} className="mt-5">
              <h3 className="mb-1 text-[0.6875rem] font-bold uppercase tracking-[0.1em] text-muted">
                {s.label}
              </h3>
              <ul className="divide-y divide-line">
                {rows.map((row) => (
                  <li key={row.code} className="flex items-center gap-3 py-3">
                    <SectionIcon code={s.code} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold">{row.label}</p>
                      <p className="text-[0.8125rem] text-muted">
                        {row.asks}
                        {row.limit > 0 ? ` Up to ${row.limit} ${row.limit === 1 ? "word" : "words"}.` : ""}
                      </p>
                    </div>
                    <Badge>{s.label}</Badge>
                  </li>
                ))}
              </ul>
            </section>
          );
        })
      )}
    </AppShell>
  );
}
