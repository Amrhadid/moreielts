import type { SeedForm } from "../../../../src/types/content";
import { listeningSection } from "./listeningSection";
import { readingSection } from "./readingSection";
import { speakingSection } from "./speakingSection";
import { writingSection } from "./writingSection";

export const mockGeneral2: SeedForm = {
  slug: "mock-general-2",
  title: "IELTS General Training Mock Exam 2",
  description: "A full, timed IELTS General Training mock exam: Listening, Reading, Writing and Speaking.",
  variant: "general_training",
  difficulty: "standard",
  isPremium: true,
  purpose: "mock",
  sections: [listeningSection, readingSection, writingSection, speakingSection],
};
