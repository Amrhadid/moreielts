import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, PageHeader } from "~/components/layout/AppShell";
import { Badge } from "~/components/ui/Badge";
import { Icon } from "~/components/ui/Icon";
import { SectionIcon } from "~/components/ui/SectionIcon";
import { QUESTION_GUIDES } from "~/data/question-guides";
import { SECTIONS } from "~/lib/sections";

export const Route = createFileRoute("/learn")({ component: LearnRoute });

// Public: the format facts and strategy links are useful before signing up.
function LearnRoute() {
  return <Learn />;
}

const SCORING_FACTS = [
  {
    title: "Scoring",
    body: "Bands 0 to 9 in half bands. The overall band is the mean of the four components, rounded to the nearest half band.",
  },
  {
    title: "Fixed forms",
    body: "IELTS is not adaptive. The questions never get harder or easier as you work.",
  },
];

function Learn() {
  return (
    <AppShell>
      <PageHeader
        title="Learn"
        subtitle="How the exam is built, and what every question type asks of you."
      />

      <section aria-labelledby="format">
        <h2 id="format" className="text-lg font-semibold tracking-tight">
          The format
        </h2>
        <ul className="mt-3 divide-y divide-line border-y border-line">
          {SECTIONS.map((section) => (
            <li key={section.code} className="flex items-start gap-4 py-4 sm:items-center">
              <SectionIcon code={section.code} />
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{section.label}</p>
                <ul className="mt-0.5 flex flex-wrap gap-x-4 gap-y-1 text-[0.8125rem] text-muted">
                  {section.facts.map((fact) => (
                    <li key={fact}>{fact}</li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
        <dl className="mt-6 grid gap-6 sm:grid-cols-2">
          {SCORING_FACTS.map((fact) => (
            <div key={fact.title}>
              <dt className="display text-lg">{fact.title}</dt>
              <dd className="mt-1 text-sm leading-relaxed text-ink-soft">{fact.body}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="types" className="mt-12">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 id="types" className="text-lg font-semibold tracking-tight">
            Every question type
          </h2>
          <Link to="/guides" className="text-sm font-medium text-brand-600">
            All strategy guides
          </Link>
        </div>
        <ul className="mt-3 divide-y divide-line border-y border-line">
          {QUESTION_GUIDES.map((guide) => (
            <li key={guide.slug}>
              <Link
                to="/guides/$slug"
                params={{ slug: guide.slug }}
                className="-mx-2 flex items-center gap-4 rounded-lg px-2 py-3.5 hover:bg-surface"
              >
                <SectionIcon code={guide.sections[0]} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">{guide.name}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted">{guide.summary}</p>
                </div>
                <div className="hidden items-center gap-1.5 sm:flex">
                  {guide.sections.map((s) => (
                    <Badge key={s} tone="neutral">
                      <span className="capitalize">{s}</span>
                    </Badge>
                  ))}
                </div>
                <Icon name="arrowRight" size={16} className="shrink-0 text-muted rtl:rotate-180" />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </AppShell>
  );
}
