import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AppShell } from "~/components/layout/AppShell";
import { Button } from "~/components/ui/Button";
import { Card, CardBody } from "~/components/ui/Card";
import { Icon } from "~/components/ui/Icon";
import { SectionIcon } from "~/components/ui/SectionIcon";
import { guideBySlug, QUESTION_GUIDES } from "~/data/question-guides";

export const Route = createFileRoute("/guides/$slug")({
  loader: ({ params }) => {
    const guide = guideBySlug(params.slug);
    if (!guide) throw notFound();
    return guide;
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `IELTS ${loaderData.name}: strategy, traps and example — MoreIELTS` },
          { name: "description", content: `${loaderData.summary} ${loaderData.tests}` },
          { property: "og:title", content: `IELTS ${loaderData.name} strategy` },
        ]
      : [],
  }),
  component: GuidePage,
});

function GuidePage() {
  const guide = Route.useLoaderData();
  const others = QUESTION_GUIDES.filter(
    (g) => g.slug !== guide.slug && g.sections.some((s) => guide.sections.includes(s)),
  ).slice(0, 4);

  return (
    <AppShell>
      <nav className="text-sm text-muted" aria-label="Breadcrumb">
        <Link to="/guides" className="hover:text-ink">
          Strategies
        </Link>{" "}
        / <span className="text-ink">{guide.name}</span>
      </nav>
      <div className="mt-4 flex items-start gap-4">
        <SectionIcon code={guide.sections[0]} size="lg" className="mt-1 hidden sm:grid" />
        <div className="min-w-0">
          <p className="text-xs capitalize text-muted">{guide.sections.join(" · ")}</p>
          <h1 className="display mt-1 text-[1.75rem] leading-tight sm:text-[2.25rem]">{guide.name}</h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-soft">{guide.summary}</p>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            <strong className="font-semibold text-ink-soft">What it tests:</strong> {guide.tests}
          </p>
        </div>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[2fr_1fr] lg:gap-12">
        <article className="grid gap-10">
          <section aria-labelledby="steps">
            <h2 id="steps" className="text-lg font-semibold tracking-tight">
              How to answer
            </h2>
            <ol className="mt-3 grid gap-3">
              {guide.steps.map((step, i) => (
                <li key={step} className="flex gap-3 text-sm leading-relaxed text-ink-soft">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-50 font-mono text-xs font-semibold text-brand-700">
                    {i + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </section>
          <section aria-labelledby="traps">
            <h2 id="traps" className="text-lg font-semibold tracking-tight">
              Common traps
            </h2>
            <ul className="mt-3 grid gap-2.5">
              {guide.traps.map((trap) => (
                <li key={trap} className="flex gap-3 text-sm leading-relaxed text-ink-soft">
                  <Icon name="x" size={16} className="mt-0.5 shrink-0 text-bad" />
                  <span>{trap}</span>
                </li>
              ))}
            </ul>
          </section>
          <section aria-labelledby="example">
            <h2 id="example" className="text-lg font-semibold tracking-tight">
              Worked example
            </h2>
            <Card className="mt-3 border-brand-600/40">
              <CardBody className="grid gap-3 pt-5 text-sm leading-relaxed">
                <p className="prose-passage text-[1rem]">{guide.example.prompt}</p>
                <p className="flex items-center gap-2 font-semibold text-good">
                  <Icon name="check" size={16} />
                  Answer: {guide.example.answer}
                </p>
                <p className="text-ink-soft">{guide.example.why}</p>
              </CardBody>
            </Card>
          </section>
        </article>

        <aside className="grid content-start gap-6">
          <Card>
            <CardBody className="pt-5">
              <p className="font-semibold">Practise {guide.name}</p>
              <p className="mt-1 text-sm text-muted">
                A short set from a real-format test, marked instantly with an explanation for
                every answer.
              </p>
              <Button asChild className="mt-4 w-full">
                {/* Drills need an account; the route asks visitors to sign in. */}
                <a href={`/drill/${guide.code}`}>Start a drill</a>
              </Button>
            </CardBody>
          </Card>
          {others.length > 0 && (
            <div>
              <p className="text-sm font-semibold">Related strategies</p>
              <ul className="mt-2 divide-y divide-line border-y border-line">
                {others.map((g) => (
                  <li key={g.slug}>
                    <Link
                      to="/guides/$slug"
                      params={{ slug: g.slug }}
                      className="flex items-center justify-between gap-3 py-2.5 text-sm font-medium text-ink hover:text-brand-700"
                    >
                      {g.name}
                      <Icon name="arrowRight" size={14} className="shrink-0 text-muted rtl:rotate-180" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </AppShell>
  );
}
