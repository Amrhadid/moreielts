import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "~/components/layout/AppShell";
import { Badge } from "~/components/ui/Badge";
import { Button } from "~/components/ui/Button";
import { Card, CardBody, CardHeader, CardTitle } from "~/components/ui/Card";
import { mockTestForm } from "~/mock/testForm";

export const Route = createFileRoute("/mock")({ component: MockTest });

const ORDER = [
  { code: "listening", to: "/test/listening", detail: "4 parts · 40 questions · audio plays once" },
  { code: "reading", to: "/test/reading", detail: "3 passages · 40 questions" },
  { code: "writing", to: "/test/writing", detail: "Task 1 (150 words) + Task 2 (250 words)" },
  { code: "speaking", to: "/test/speaking", detail: "3 parts · recorded responses" },
] as const;

function MockTest() {
  return (
    <AppShell>
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Mock test</h1>
      <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted">
        A full timed exam under test conditions. Sections run in the official order
        and each one is submitted before the next begins — you cannot return to a
        section once it is done.
      </p>

      <Card className="mt-6 border-brand-200 bg-brand-50/40">
        <CardHeader>
          <div className="flex flex-wrap items-center gap-3">
            <CardTitle>{mockTestForm.title}</CardTitle>
            <Badge tone="brand" className="capitalize">{mockTestForm.variant}</Badge>
          </div>
        </CardHeader>
        <CardBody>
          <p className="text-sm text-ink-soft">
            Approximately 2 hours 45 minutes including the speaking test. Fixed test
            form — the difficulty does not change as you work.
          </p>
          <Button asChild size="lg" className="mt-4">
            <Link to="/test/listening">Begin with Listening</Link>
          </Button>
        </CardBody>
      </Card>

      <h2 className="mb-3 mt-8 text-lg font-semibold tracking-tight">Test order</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {ORDER.map((section, i) => {
          const meta = mockTestForm.sections.find((s) => s.code === section.code);
          return (
            <Card key={section.code}>
              <CardBody className="pt-5">
                <div className="flex items-start gap-3">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-paper text-xs font-semibold text-muted">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="font-medium capitalize">{section.code}</p>
                      <span className="text-xs text-muted">
                        {meta?.durationMinutes} min
                      </span>
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-muted">
                      {section.detail}
                    </p>
                    <Link
                      to={section.to}
                      className="mt-3 inline-block text-sm font-medium text-brand-600"
                    >
                      Open section →
                    </Link>
                  </div>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>
    </AppShell>
  );
}
