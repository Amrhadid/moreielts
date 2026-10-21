import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AppShell } from "~/components/layout/AppShell";
import { ObjectiveRunner } from "~/components/practice/ObjectiveRunner";
import { PracticeShell } from "~/components/practice/PracticeShell";
import { SpeakingRunner } from "~/components/practice/SpeakingRunner";
import { WritingRunner } from "~/components/practice/WritingRunner";
import {
  isPracticeSection,
  LISTENING_SET,
  PRACTICE_META,
  READING_SET,
  SPEAKING_PROMPTS,
  WRITING_TASKS,
  type PracticeSection,
} from "~/data/practice";
import { PremiumGate } from "~/lib/auth";

export const Route = createFileRoute("/practice/$section")({
  beforeLoad: ({ params }) => {
    if (!isPracticeSection(params.section)) throw notFound();
  },
  head: ({ params }) => {
    const label = isPracticeSection(params.section)
      ? PRACTICE_META[params.section].label
      : "Practice";
    return {
      meta: [
        { title: `${label} practice — MoreIELTS` },
        {
          name: "description",
          content: `IELTS ${label} practice with instant marking and AI correction.`,
        },
      ],
    };
  },
  notFoundComponent: () => (
    <AppShell>
      <h1 className="text-xl font-semibold tracking-tight">No such practice section</h1>
      <p className="mt-2 text-sm text-muted">
        Choose Listening, Reading, Writing or Speaking.
      </p>
      <Link to="/practice" className="mt-4 inline-block text-sm font-medium text-brand-600">
        ← All practice
      </Link>
    </AppShell>
  ),
  component: PracticeSectionRoute,
});

function PracticeSectionRoute() {
  const { section } = Route.useParams();
  if (!isPracticeSection(section)) return null;
  return (
    <PremiumGate>
      <SectionRunner section={section} />
    </PremiumGate>
  );
}

function SectionRunner({ section }: { section: PracticeSection }) {
  const meta = PRACTICE_META[section];

  switch (section) {
    case "reading":
      return (
        <PracticeShell label="Reading practice" title={READING_SET.title} context={READING_SET.contextLabel}>
          <ObjectiveRunner set={READING_SET} />
        </PracticeShell>
      );
    case "listening":
      return (
        <PracticeShell
          label="Listening practice"
          title={LISTENING_SET.title}
          context={LISTENING_SET.contextLabel}
        >
          <ObjectiveRunner set={LISTENING_SET} />
        </PracticeShell>
      );
    case "writing":
      return (
        <PracticeShell
          label="Writing practice"
          title="Task 1 and Task 2"
          context={`${WRITING_TASKS.length} tasks · ${meta.correction}`}
        >
          <WritingRunner tasks={WRITING_TASKS} />
        </PracticeShell>
      );
    case "speaking":
      return (
        <PracticeShell
          label="Speaking practice"
          title="Parts 1, 2 and 3"
          context={`${SPEAKING_PROMPTS.length} prompts · ${meta.correction}`}
        >
          <SpeakingRunner prompts={SPEAKING_PROMPTS} />
        </PracticeShell>
      );
  }
}
