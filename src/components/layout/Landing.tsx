import { Link } from "@tanstack/react-router";
import { AppShell } from "./AppShell";
import { Button } from "~/components/ui/Button";
import { Card, CardBody } from "~/components/ui/Card";

const SECTIONS = [
  { label: "Listening", detail: "4 parts · 40 questions · 30 min" },
  { label: "Reading", detail: "3 passages · 40 questions · 60 min" },
  { label: "Writing", detail: "2 tasks · 60 min" },
  { label: "Speaking", detail: "3 parts · 11–14 min" },
] as const;

const FEATURES = [
  {
    icon: "🎯",
    title: "Practise by question type",
    body: "Drill matching, gap fill, multiple choice and the rest until each one stops costing you marks.",
  },
  {
    icon: "📝",
    title: "Full timed mock exams",
    body: "Sit a complete test under exam conditions, with the same timing and navigation as the real thing.",
  },
  {
    icon: "✨",
    title: "Band-scored feedback",
    body: "Get an estimated band per section and see where the gap to your target band actually is.",
  },
] as const;

/**
 * Public homepage. Shown to visitors who are not signed in, so the marketing
 * content is reachable without an account; signing in swaps this for the
 * dashboard.
 */
export function Landing() {
  return (
    <AppShell withSidebar={false}>
      <section className="mx-auto max-w-3xl py-10 text-center sm:py-16">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">
          Practise IELTS the way you will sit it
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg">
          Every question type, full timed mock exams and band-scored feedback —
          so you know your level before test day.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link to="/signup">Get started free</Link>
          </Button>
          {/* Anchor rather than a link to /learn, which is behind the guard. */}
          <Button asChild variant="secondary">
            <a href="#sections">See the test format</a>
          </Button>
        </div>
        <p className="mt-4 text-xs text-muted">
          AI estimated bands — not an official IELTS result.
        </p>
      </section>

      <div className="grid gap-4 sm:grid-cols-3">
        {FEATURES.map((feature) => (
          <Card key={feature.title} className="h-full">
            <CardBody className="pt-5">
              <span aria-hidden className="text-2xl">
                {feature.icon}
              </span>
              <p className="mt-3 font-medium">{feature.title}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{feature.body}</p>
            </CardBody>
          </Card>
        ))}
      </div>

      <h2 id="sections" className="mb-3 mt-12 scroll-mt-24 text-lg font-semibold tracking-tight">
        The four sections
      </h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {SECTIONS.map((section) => (
          <Card key={section.label} className="h-full">
            <CardBody className="pt-5">
              <p className="font-medium">{section.label}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted">{section.detail}</p>
            </CardBody>
          </Card>
        ))}
      </div>

      <Card className="mt-12 border-brand-200 bg-brand-50/40">
        <CardBody className="flex flex-wrap items-center justify-between gap-4 py-6">
          <div>
            <p className="text-lg font-semibold tracking-tight">
              Ready to find your band?
            </p>
            <p className="mt-1 text-sm text-ink-soft">
              Create a free account to save your attempts and track progress.
            </p>
          </div>
          <Button asChild>
            <Link to="/login">Sign in or sign up</Link>
          </Button>
        </CardBody>
      </Card>
    </AppShell>
  );
}
