import { createFileRoute } from "@tanstack/react-router";
import { Footer } from "~/components/layout/Footer";
import { MarketingHeader } from "~/components/layout/Header";

export const Route = createFileRoute("/privacy")({ component: PrivacyPage });

const SECTIONS: Array<{ title: string; body: string[] }> = [
  {
    title: "What we store",
    body: [
      "Your email address, your name if you give one, your target band, and the plan you are on.",
      "Every attempt you start: which test form, when each section started, and the answers you type or choose.",
      "Your writing responses and your speaking recordings, so they can be graded and shown back to you in your results.",
    ],
  },
  {
    title: "Where it lives",
    body: [
      "Account data, attempts and answers are stored in a Supabase Postgres database protected by row level security. You can only read your own rows.",
      "Speaking recordings and any uploaded images or audio are stored in Cloudflare R2. The browser never receives storage credentials; uploads go through short-lived signed URLs.",
    ],
  },
  {
    title: "AI grading",
    body: [
      "Writing and speaking are graded by an AI model run from our server. Your essay text or a transcript of your recording is sent to the model to produce the four criterion bands and the feedback you see. The model version used is recorded with every score.",
      "These bands are estimates for practice. They are not official IELTS results and are not shared with any test provider.",
    ],
  },
  {
    title: "What we do not do",
    body: [
      "We do not sell your data, and we do not use your writing or recordings to train models.",
      "We do not show your answers to other candidates. Accepted answers are released to you only after you submit an attempt.",
    ],
  },
  {
    title: "Your choices",
    body: [
      "You can sign out at any time from the account menu. To delete your account and everything stored with it, contact us from the email address on your account and we will remove it.",
    ],
  },
];

function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <MarketingHeader />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-12 sm:px-6">
        <p className="text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-brand-600">
          Privacy notice
        </p>
        <h1 className="display mt-2 text-[2rem] leading-tight sm:text-[2.5rem]">
          What MoreIELTS keeps, and why.
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-ink-soft">
          Short version: we keep what is needed to run your practice and show you your results,
          and nothing else.
        </p>
        <p className="mt-3 rounded-lg border border-warn/30 bg-warn-soft px-3 py-2 text-xs text-warn">
          Template. Review with a legal adviser and add the controller's name, contact details
          and retention periods before publishing.
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
