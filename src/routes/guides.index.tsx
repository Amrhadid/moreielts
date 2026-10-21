import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "~/components/layout/AppShell";
import { Badge } from "~/components/ui/Badge";
import { Card, CardBody } from "~/components/ui/Card";
import { QUESTION_GUIDES } from "~/data/question-guides";

export const Route = createFileRoute("/guides/")({
  head: () => ({
    meta: [
      { title: "IELTS question type strategies — MoreIELTS" },
      {
        name: "description",
        content:
          "Step-by-step strategies, common traps and worked examples for every IELTS Reading and Listening question type.",
      },
    ],
  }),
  component: GuidesIndex,
});

function GuidesIndex() {
  return (
    <AppShell>
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
        IELTS question type strategies
      </h1>
      <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted">
        How each Reading and Listening question type works, the steps that score marks, and
        the traps that lose them — with a worked example for each.
      </p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {QUESTION_GUIDES.map((guide) => (
          <Link key={guide.slug} to="/guides/$slug" params={{ slug: guide.slug }} className="group">
            <Card className="h-full transition-colors group-hover:border-brand-200">
              <CardBody className="pt-5">
                <div className="flex flex-wrap gap-1.5">
                  {guide.sections.map((s) => (
                    <Badge key={s} tone="neutral">
                      <span className="capitalize">{s}</span>
                    </Badge>
                  ))}
                </div>
                <h2 className="mt-3 font-semibold">{guide.name}</h2>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{guide.summary}</p>
              </CardBody>
            </Card>
          </Link>
        ))}
      </div>
    </AppShell>
  );
}
