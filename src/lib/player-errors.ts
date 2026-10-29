import type { SectionCode } from "~/types/content";

/** The official order; the server enforces it (ielts_start_section, 0015). */
const SECTION_ORDER: SectionCode[] = ["listening", "reading", "writing", "speaking"];
const PLAYER_ROUTE: Record<SectionCode, string> = {
  listening: "/test/listening",
  reading: "/test/reading",
  writing: "/test/writing",
  speaking: "/test/speaking",
};

export interface StartupAction {
  label: string;
  to: string;
  search?: Record<string, unknown>;
}

/**
 * Turns the start_section error codes into something a learner can act on:
 * which section to go to, rather than a raw "section_out_of_order".
 */
export function describeStartupError(
  message: string,
  section: SectionCode,
  formId: string | undefined,
  sectionsDone: string[],
): { text: string; action: StartupAction | null } {
  const search = formId ? { form: formId } : undefined;
  const label = (s: SectionCode) => s.charAt(0).toUpperCase() + s.slice(1);
  if (message.includes("section_out_of_order")) {
    const next = SECTION_ORDER.find((s) => !sectionsDone.includes(s)) ?? "listening";
    return {
      text: `A mock exam runs in the official order: Listening, Reading, Writing, then Speaking. Finish ${label(next)} before opening ${label(section)}.`,
      action: { label: `Go to ${label(next)}`, to: PLAYER_ROUTE[next], search },
    };
  }
  if (message.includes("section_already_submitted")) {
    const idx = SECTION_ORDER.indexOf(section);
    const next = SECTION_ORDER.slice(idx + 1).find((s) => !sectionsDone.includes(s));
    return {
      text: `You have already submitted ${label(section)} for this exam, and a submitted section cannot be reopened.`,
      action: next
        ? { label: `Continue to ${label(next)}`, to: PLAYER_ROUTE[next], search }
        : { label: "See your results", to: "/results" },
    };
  }
  if (message.includes("premium_required")) {
    return {
      text: "Mock exams are part of Premium. Enter your access code to unlock them.",
      action: { label: "Enter a code", to: "/pricing" },
    };
  }
  if (message.includes("attempt_not_active")) {
    return {
      text: "This exam has already been submitted.",
      action: { label: "See your results", to: "/results" },
    };
  }
  return { text: message || "Could not start the attempt", action: null };
}
