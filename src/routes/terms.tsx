import { createFileRoute } from "@tanstack/react-router";
import { Footer } from "~/components/layout/Footer";
import { MarketingHeader } from "~/components/layout/Header";

export const Route = createFileRoute("/terms")({ component: TermsPage });

const SECTIONS: Array<{ title: string; body: string[] }> = [
  {
    title: "What MoreIELTS is",
    body: [
      "MoreIELTS is a practice service. It gives you timed mock tests and drills built to the published IELTS format, and an estimated band for each section.",
      "It is not affiliated with, endorsed by, or connected to the IELTS partners. Nothing here is an official result, and a band shown here is no guarantee of a band in the real test.",
    ],
  },
  {
    title: "Your account",
    body: [
      "Keep your sign-in details to yourself. You are responsible for what happens under your account.",
      "One account per person. Attempts, results and recordings are tied to the account that made them.",
    ],
  },
  {
    title: "Fair use",
    body: [
      "Do not copy, redistribute or sell the test content. Do not try to read accepted answers before you submit, extend your own deadline, or interfere with the service for other candidates. The server enforces timing and marking regardless of what a client does.",
    ],
  },
  {
    title: "Grading",
    body: [
      "Listening and Reading are marked automatically against the accepted answers. Writing and Speaking are graded by an AI model and can be wrong. Treat the feedback as a study aid, not a verdict.",
    ],
  },
  {
    title: "Plans and changes",
    body: [
      "Free features may change. If a paid plan is offered, its price and what it includes will be shown before you pay.",
      "We may update these terms. The date below changes when we do, and continued use after that date means you accept the new terms.",
    ],
  },
  {
    title: "Liability",
    body: [
      "The service is provided as is. To the extent the law allows, MoreIELTS is not liable for a test outcome, lost study time, or loss of data caused by events outside its control.",
    ],
  },
];

function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <MarketingHeader />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-12 sm:px-6">
        <p className="text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-brand-600">
          Terms of use
        </p>
        <h1 className="display mt-2 text-[2rem] leading-tight sm:text-[2.5rem]">
          The rules for using MoreIELTS.
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-ink-soft">
          Plain language, kept short. If something here is unclear, ask before you rely on it.
        </p>
        <p className="mt-3 rounded-lg border border-warn/30 bg-warn-soft px-3 py-2 text-xs text-warn">
          Template. Review with a legal adviser and add the operating entity, governing law and
          contact details before publishing.
        </p>

        <div className="mt-10 grid gap-8">
          {SECTIONS.map((section) => (
            <section key={section.title}>
              <h2 className="display text-xl">{section.title}</h2>
              <div className="mt-2 grid gap-2 text-[0.9375rem] leading-relaxed text-ink-soft">
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <p className="mt-10 text-xs text-muted">Last updated 7 November 2026.</p>
      </main>
      <Footer />
    </div>
  );
}
