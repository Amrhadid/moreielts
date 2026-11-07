import { Link } from "@tanstack/react-router";
import { Check, X } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/Button";
import { Card } from "~/components/ui/Card";
import { SectionIcon } from "~/components/ui/SectionIcon";
import { cn } from "~/lib/cn";
import { SECTIONS } from "~/lib/sections";
import { Footer } from "./Footer";
import { MarketingHeader } from "./Header";

/* ------------------------------------------------------------------ *
 * Live demo: one reading passage, three True / False / Not Given items.
 * Static content; the product demonstrates its own question interface
 * without an account or an attempt.
 * ------------------------------------------------------------------ */

const DEMO_PASSAGE =
  "The first public lending libraries in Britain were funded not by the state but by subscription. Members paid an annual fee, and in return could borrow from a collection chosen by a committee of their peers. By 1850 there were more than four hundred such societies, most of them in towns with fewer than ten thousand residents.";

type Choice = "True" | "False" | "Not Given";
const CHOICES: Choice[] = ["True", "False", "Not Given"];

const DEMO_ITEMS: Array<{ statement: string; answer: Choice; why: string }> = [
  {
    statement: "Early lending libraries were paid for by the government.",
    answer: "False",
    why: 'False. They were funded "not by the state but by subscription".',
  },
  {
    statement: "Most subscription libraries were in large cities.",
    answer: "False",
    why: 'False. Most were "in towns with fewer than ten thousand residents".',
  },
  {
    statement: "Members could suggest books for the committee to buy.",
    answer: "Not Given",
    why: "Not Given. The passage says a committee chose the stock, but not how.",
  },
];

function DemoQuestion() {
  const [picked, setPicked] = useState<Array<Choice | null>>([null, null, null]);
  const [checked, setChecked] = useState(false);

  const answeredCount = picked.filter(Boolean).length;
  const correctCount = DEMO_ITEMS.filter((item, i) => picked[i] === item.answer).length;

  function reset() {
    setPicked([null, null, null]);
    setChecked(false);
  }

  return (
    <Card className="overflow-hidden shadow-raised">
      <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-2.5 text-xs text-muted">
        <span>
          <span className="font-semibold text-ink">Try one</span> · Reading · True / False / Not
          Given
        </span>
        <span className="font-mono">no clock</span>
      </div>
      <p className="prose-passage border-b border-line px-4 py-4 text-[0.9375rem] leading-[1.7]">
        {DEMO_PASSAGE}
      </p>
      <div className="grid gap-3 px-4 py-3">
        {DEMO_ITEMS.map((item, i) => {
          const chosen = picked[i];
          return (
            <div key={item.statement}>
              <p className="mb-1.5 flex gap-2 text-sm">
                <span className="font-mono text-brand-600">{i + 1}</span>
                {item.statement}
              </p>
              <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={`Statement ${i + 1}`}>
                {CHOICES.map((choice) => {
                  const selected = chosen === choice;
                  const isAnswer = checked && choice === item.answer;
                  const isWrong = checked && selected && choice !== item.answer;
                  return (
                    <button
                      key={choice}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      disabled={checked}
                      onClick={() =>
                        setPicked((prev) => prev.map((p, j) => (j === i ? choice : p)))
                      }
                      className={cn(
                        "inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-[0.8125rem] transition-colors",
                        "border-line bg-surface text-ink hover:border-line-strong",
                        selected && !checked && "border-brand-500 bg-brand-50 text-brand-700",
                        isAnswer && "border-good bg-good-soft text-good",
                        isWrong && "border-bad bg-bad-soft text-bad",
                        checked && !isAnswer && !isWrong && "opacity-60",
                      )}
                    >
                      <span
                        aria-hidden
                        className={cn(
                          "grid h-3.5 w-3.5 place-items-center rounded-full border",
                          selected || isAnswer ? "border-current" : "border-line-strong",
                        )}
                      >
                        {isAnswer ? (
                          <Check className="h-2.5 w-2.5" strokeWidth={3} />
                        ) : isWrong ? (
                          <X className="h-2.5 w-2.5" strokeWidth={3} />
                        ) : selected ? (
                          <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        ) : null}
                      </span>
                      {choice}
                    </button>
                  );
                })}
              </div>
              {checked && <p className="mt-1.5 text-xs text-ink-soft">{item.why}</p>}
            </div>
          );
        })}
        <div className="flex items-center justify-between gap-3 pt-1 text-xs text-muted">
          <span aria-live="polite">
            {checked ? `${correctCount} of 3 correct` : `${answeredCount} of 3 answered`}
          </span>
          {checked ? (
            <Button size="sm" variant="outline" onClick={reset}>
              Try again
            </Button>
          ) : (
            <Button size="sm" onClick={() => setChecked(true)} disabled={answeredCount === 0}>
              Check answers
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------ *
 * Page
 * ------------------------------------------------------------------ */

const FEATURES = [
  {
    title: "Practise by question type",
    body: "Drill matching headings, gap fills, multiple choice and the rest until each one stops costing you marks.",
  },
  {
    title: "Sit a full timed mock",
    body: "Four sections in the official order, with the same timing and navigation as the computer-delivered test.",
  },
  {
    title: "Band-scored feedback",
    body: "An estimated band per section, the gap to your target, and examiner-style notes that quote your own writing.",
  },
];

/**
 * Public homepage. Shown to visitors without a session; signing in swaps it
 * for the dashboard. Nothing here links into a protected route.
 */
export function Landing() {
  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <MarketingHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-12 pt-12 sm:px-6 md:grid-cols-[1fr_1.05fr] md:gap-14 md:pt-16">
          <div className="animate-rise">
            <p className="text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-brand-600">
              IELTS Academic and General Training
            </p>
            <h1 className="display mt-4 text-[2.5rem] leading-[1.04] tracking-[-0.02em] sm:text-[3.25rem] lg:text-[3.75rem]">
              Rehearse the real test.
            </h1>
            <p className="mt-5 max-w-[42ch] text-[1.0625rem] leading-relaxed text-ink-soft">
              Forty questions, audio that plays once, one clock for both writing tasks. The
              same rules as exam day, with a band estimate at the end.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/signup">Start practising free</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="#sections">See the four sections</a>
              </Button>
            </div>
            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted">
              <li>No card required</li>
              <li>Built to the published format</li>
              <li>Not affiliated with the IELTS partners</li>
            </ul>
          </div>
          <div className="animate-rise-delay">
            <DemoQuestion />
          </div>
        </section>

        {/* Features: parallel, not a sequence, so no numbered markers. */}
        <section
          id="how"
          className="mx-auto grid max-w-6xl scroll-mt-20 gap-8 border-t border-line px-4 py-12 sm:px-6 md:grid-cols-3 md:gap-10"
        >
          {FEATURES.map((feature) => (
            <div key={feature.title}>
              <h2 className="display text-xl">{feature.title}</h2>
              <p className="mt-2 max-w-[36ch] text-sm leading-relaxed text-ink-soft">
                {feature.body}
              </p>
            </div>
          ))}
        </section>

        {/* The four sections */}
        <section id="sections" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-12 sm:px-6">
          <p className="text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-brand-600">
            The four sections
          </p>
          <h2 className="display mt-2 text-[1.75rem] leading-tight sm:text-[2rem]">
            Built to the format, down to the clock.
          </h2>
          <ul className="mt-6 divide-y divide-line border-y border-line">
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
        </section>

        {/* CTA band */}
        <section className="mx-auto max-w-6xl px-4 pb-14 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-5 rounded-[0.875rem] border border-brand-600/40 bg-brand-50 px-6 py-7 sm:px-8">
            <div>
              <h2 className="display text-2xl">Find your band this week.</h2>
              <p className="mt-1 text-sm text-ink-soft">
                Create a free account to save attempts and track progress against your target.
              </p>
            </div>
            <Button asChild size="lg">
              <Link to="/signup">Create a free account</Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
