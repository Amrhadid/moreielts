import type { SeedForm } from "../../../../src/types/content";
import { listeningSection } from "./listeningSection";
import { readingSection } from "./readingSection";
import { speakingSection } from "./speakingSection";
import { writingSection } from "./writingSection";

export const mockAcademic2: SeedForm = {
  slug: "mock-academic-2",
  title: "IELTS Academic Mock Exam 2",
  description: "A second full timed IELTS Academic mock exam at a challenging level, covering all four sections.",
  variant: "academic",
  difficulty: "challenge",
  isPremium: true,
  purpose: "mock",
  sections: [listeningSection, readingSection, writingSection, speakingSection],
};
