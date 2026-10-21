import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AppShell } from "~/components/layout/AppShell";
import { Button } from "~/components/ui/Button";
import { Card, CardBody, CardHeader, CardTitle } from "~/components/ui/Card";
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
      <h1 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">{guide.name}</h1>
      <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft">{guide.summary}</p>
      <p className="mt-2 max-w-2xl text-sm text-muted">
        <strong className="font-semibold text-ink-soft">What it tests:</strong> {guide.tests}
      </p>

      <div className="mt-8 grid gap-4 lg:grid-cols-[2fr_1fr]">
        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle>How to answer</CardTitle>
            </CardHeader>
            <CardBody>
              <ol className="grid list-decimal gap-2.5 ps-5 text-sm leading-relaxed text-ink-soft">
                {guide.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </CardBody>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Common traps</CardTitle>
            </CardHeader>
            <CardBody>
              <ul className="grid list-disc gap-2 ps-5 text-sm leading-relaxed text-ink-soft">
                {guide.traps.map((trap) => (
                  <li key={trap}>{trap}</li>
                ))}
              </ul>
            </CardBody>
          </Card>
          <Card className="border-brand-100 bg-brand-50/40">
            <CardHeader>
              <CardTitle>Worked example</CardTitle>
            </CardHeader>
            <CardBody className="grid gap-2 text-sm leading-relaxed">
              <p className="font-serif text-ink">{guide.example.prompt}</p>
              <p>
                <span className="font-semibold text-good">Answer: {guide.example.answer}</span>
              </p>
              <p className="text-ink-soft">{guide.example.why}</p>
            </CardBody>
          </Card>
        </div>

        <aside className="grid content-start gap-4">
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
            <Card>
              <CardBody className="pt-5">
                <p className="text-sm font-semibold">Related strategies</p>
                <ul className="mt-2 grid gap-1.5 text-sm">
                  {others.map((g) => (
                    <li key={g.slug}>
                      <Link to="/guides/$slug" params={{ slug: g.slug }} className="text-brand-600 hover:underline">
                        {g.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardBody>
            </Card>
          )}
        </aside>
      </div>
    </AppShell>
  );
}
