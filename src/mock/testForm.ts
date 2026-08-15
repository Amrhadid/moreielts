import type { SectionCode, TestForm } from "~/types/content";
import { listeningSection } from "./listeningSection";
import { readingSection } from "./readingSection";
import { speakingSection } from "./speakingSection";
import { writingSection } from "./writingSection";

/** The one complete Academic form this UI pass runs on. */
export const mockTestForm: TestForm = {
  id: "form-academic-3",
  title: "Academic Mock Test 3",
  variant: "academic",
  published: true,
  updatedAt: "2026-08-02T11:00:00Z",
  sections: [listeningSection, readingSection, writingSection, speakingSection],
};

export function getSection(code: SectionCode) {
  const section = mockTestForm.sections.find((s) => s.code === code);
  if (!section) throw new Error(`No section ${code} on the mock form`);
  return section;
}

/** Flat, ordered question list for a section — drives the navigator. */
export function flatQuestions(code: SectionCode) {
  return getSection(code).itemGroups.flatMap((g) =>
    g.questions.map((q) => ({ question: q, group: g })),
  );
}

/** Admin test-form list. */
export const mockForms: TestForm[] = [
  mockTestForm,
  {
    id: "form-academic-4",
    title: "Academic Mock Test 4",
    variant: "academic",
    published: false,
    updatedAt: "2026-08-13T15:42:00Z",
    sections: [listeningSection, readingSection, writingSection, speakingSection],
  },
  {
    id: "form-general-1",
    title: "General Training Mock Test 1",
    variant: "general",
    published: true,
    updatedAt: "2026-07-22T09:10:00Z",
    sections: [listeningSection, writingSection, speakingSection],
  },
  {
    id: "form-academic-5",
    title: "Academic Mock Test 5 (draft)",
    variant: "academic",
    published: false,
    updatedAt: "2026-08-15T08:00:00Z",
    sections: [readingSection],
  },
];

/** Admin shells. TODO(backend): replace with real queries. */
export const mockStudents = [
  { id: "s-1", name: "Amira Haddad", email: "amira@example.com", plan: "Free", attempts: 4, lastActive: "2026-08-14", estimated: 6.5 },
  { id: "s-2", name: "Daniel Okonkwo", email: "daniel@example.com", plan: "Premium", attempts: 11, lastActive: "2026-08-15", estimated: 7 },
  { id: "s-3", name: "Wei Chen", email: "wei@example.com", plan: "Premium", attempts: 9, lastActive: "2026-08-12", estimated: 7.5 },
  { id: "s-4", name: "Sofia Marques", email: "sofia@example.com", plan: "Free", attempts: 2, lastActive: "2026-08-03", estimated: 5.5 },
];

export const mockCodes = [
  { id: "c-1", code: "IELTS-2026-ALPHA", plan: "Premium", uses: 24, limit: 50, expires: "2026-12-31", status: "Active" },
  { id: "c-2", code: "SCHOOL-BRIGHT", plan: "Premium", uses: 50, limit: 50, expires: "2026-09-01", status: "Exhausted" },
  { id: "c-3", code: "TRIAL-7DAY", plan: "Trial", uses: 8, limit: 200, expires: "2026-10-15", status: "Active" },
];

export const mockAnalytics = [
  { label: "Attempts this week", value: "312", delta: "+18%" },
  { label: "Mock tests completed", value: "97", delta: "+6%" },
  { label: "Average overall band", value: "6.5", delta: "+0.5" },
  { label: "Active students", value: "148", delta: "+11%" },
];
