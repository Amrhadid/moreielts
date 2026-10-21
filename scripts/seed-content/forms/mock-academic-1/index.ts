import type { SeedForm } from "../../../../src/types/content";
import { listeningSection } from "./listeningSection";
import { readingSection } from "./readingSection";
import { speakingSection } from "./speakingSection";
import { writingSection } from "./writingSection";

export const mockAcademic1: SeedForm = {
  slug: "mock-academic-1",
  title: "IELTS Academic Mock Exam 1",
  description: "A full timed IELTS Academic mock exam: Listening, Reading, Writing and Speaking.",
  variant: "academic",
  difficulty: "standard",
  isPremium: true,
  purpose: "mock",
  sections: [listeningSection, readingSection, writingSection, speakingSection],
};
