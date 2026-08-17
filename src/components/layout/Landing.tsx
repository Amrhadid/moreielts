import { Link } from "@tanstack/react-router";
import { AppShell } from "./AppShell";
import { Button } from "~/components/ui/Button";
import { Card, CardBody } from "~/components/ui/Card";

const SECTIONS = [
  { icon: "◉", label: "Listening", detail: "4 parts · 40 questions · 30 min", color: "text-[#607eea] bg-[#eef1ff]" },
  { icon: "▤", label: "Reading", detail: "3 passages · 40 questions · 60 min", color: "text-[#07966f] bg-[#e8f8f2]" },
  { icon: "✎", label: "Writing", detail: "2 tasks · 60 min", color: "text-[#c47918] bg-[#fff4df]" },
  { icon: "◌", label: "Speaking", detail: "3 parts · 11–14 min", color: "text-[#a055c9] bg-[#f7ecfc]" },
] as const;

const FEATURES = [
  {
    icon: "01",
    title: "Practise by question type",
    body: "Drill matching, gap fill, multiple choice and the rest until each one stops costing you marks.",
  },
  {
    icon: "02",
    title: "Full timed mock exams",
    body: "Sit a complete test under exam conditions, with the same timing and navigation as the real thing.",
  },
  {
    icon: "03",
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
      <section className="relative isolate grid min-h-[570px] items-center gap-10 overflow-hidden rounded-[2rem] border border-brand-100 bg-surface px-6 py-10 shadow-[0_24px_70px_rgba(20,75,120,.09)] md:grid-cols-[1.02fr_.98fr] md:px-12 lg:px-16">
        <div className="pointer-events-none absolute -left-20 -top-24 -z-10 h-72 w-72 rounded-full bg-brand-50" />
        <div className="pointer-events-none absolute bottom-8 left-[47%] -z-10 h-20 w-20 rounded-full border-[18px] border-warn-soft animate-breathe" />
        <div className="animate-rise">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1.5 text-xs font-bold uppercase tracking-[.14em] text-brand-700">
            <span className="h-2 w-2 rounded-full bg-good" /> IELTS Academic preparation
          </span>
          <h1 className="mt-6 max-w-xl text-4xl font-extrabold leading-[1.08] tracking-[-.035em] sm:text-5xl lg:text-6xl">
            Your target band is <span className="text-brand-600">closer than you think.</span>
          </h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-ink-soft sm:text-lg">
            Practise every question type, sit realistic timed mocks and receive clear feedback that turns your next study session into a plan.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg"><Link to="/signup">Start practising free <span aria-hidden>→</span></Link></Button>
            <Button asChild size="lg" variant="outline"><a href="#sections">Explore the test</a></Button>
          </div>
          <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-muted">
            <span>✓ No card required</span><span>✓ Real exam timing</span><span>✓ AI band estimate</span>
          </div>
        </div>
        <div className="relative animate-rise-delay">
          <div className="absolute right-2 top-5 z-10 rounded-card border border-line bg-surface px-4 py-3 shadow-lg animate-float">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted">Target band</p>
            <p className="text-3xl font-extrabold tabular-nums text-warn">7.5</p>
          </div>
          <div className="overflow-hidden rounded-[2rem] bg-[#0d2742] shadow-[0_20px_50px_rgba(10,35,60,.22)]">
            <img src="/assets/moreielts-hero.png" alt="Student preparing confidently for her English test" className="aspect-[3/2] w-full object-cover" />
          </div>
        </div>
      </section>

      <div className="mt-14 grid gap-4 sm:grid-cols-3">
        {FEATURES.map((feature) => (
          <Card key={feature.title} className="group h-full hover:-translate-y-1 hover:border-brand-200 hover:shadow-[0_16px_36px_rgba(20,75,120,.10)]">
            <CardBody className="pt-5">
              <span aria-hidden className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-xs font-extrabold text-brand-700 transition-transform group-hover:rotate-3 group-hover:scale-105">
                {feature.icon}
              </span>
              <p className="mt-3 font-medium">{feature.title}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{feature.body}</p>
            </CardBody>
          </Card>
        ))}
      </div>

      <div className="mt-16 text-center"><p className="text-xs font-bold uppercase tracking-[.16em] text-brand-600">Complete preparation</p><h2 id="sections" className="mt-2 scroll-mt-24 text-2xl font-bold tracking-tight sm:text-3xl">Master all four skills</h2></div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {SECTIONS.map((section) => (
          <Card key={section.label} className="mt-5 h-full hover:-translate-y-1 hover:border-brand-200">
            <CardBody className="pt-5">
              <span className={`grid h-12 w-12 place-items-center rounded-xl text-xl font-bold ${section.color}`}>{section.icon}</span>
              <p className="mt-4 font-semibold">{section.label}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted">{section.detail}</p>
            </CardBody>
          </Card>
        ))}
      </div>

      <Card className="mt-16 overflow-hidden border-brand-200 bg-brand-50/60">
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
