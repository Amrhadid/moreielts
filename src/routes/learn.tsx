import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "~/components/layout/AppShell";
import { Badge } from "~/components/ui/Badge";
import { Card, CardBody, CardHeader, CardTitle } from "~/components/ui/Card";
import { QUESTION_TYPES } from "~/registry/questionTypes";

export const Route = createFileRoute("/learn")({ component: Learn });

const FORMAT_FACTS = [
  { title: "Listening", body: "4 parts, 40 questions, about 30 minutes. The recording plays once only." },
  { title: "Reading", body: "3 passages, 40 questions, 60 minutes. No extra transfer time on the computer test." },
  { title: "Writing", body: "Task 1 (150 words) and Task 2 (250 words) share a single 60-minute limit." },
  { title: "Speaking", body: "3 parts, 11–14 minutes. Part 2 gives you 1 minute to prepare and 1–2 minutes to talk." },
  { title: "Scoring", body: "Bands 0–9 in half bands. The overall band is the average of the four components, rounded to the nearest half band." },
  { title: "Fixed forms", body: "IELTS is not adaptive. The questions never get harder or easier as you work." },
];

function Learn() {
  return (
    <AppShell>
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Learn</h1>
      <p className="mt-1.5 text-sm text-muted">
        How the exam is built, and what every question type asks of you.
      </p>

      <h2 className="mb-3 mt-8 text-lg font-semibold tracking-tight">The format</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {FORMAT_FACTS.map((fact) => (
          <Card key={fact.title}>
            <CardHeader>
              <CardTitle>{fact.title}</CardTitle>
            </CardHeader>
            <CardBody>
              <p className="text-sm leading-relaxed text-ink-soft">{fact.body}</p>
            </CardBody>
          </Card>
        ))}
      </div>

      <h2 className="mb-3 mt-10 text-lg font-semibold tracking-tight">
        Every question type
      </h2>
      <Card className="overflow-hidden">
        <ul className="divide-y divide-line">
          {QUESTION_TYPES.map((type) => (
            <li key={type.code} className="flex flex-wrap items-center gap-3 px-5 py-4">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{type.label}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted">{type.blurb}</p>
              </div>
              <span className="text-xs capitalize text-muted">
                {type.sections.join(" · ")}
              </span>
              <Badge tone={type.tier === "premium" ? "warn" : "good"}>
                {type.tier === "premium" ? "Premium" : "Free"}
              </Badge>
            </li>
          ))}
        </ul>
      </Card>
    </AppShell>
  );
}
