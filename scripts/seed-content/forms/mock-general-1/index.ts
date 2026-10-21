import type { SeedForm } from "../../../../src/types/content";
import { listeningSection } from "./listeningSection";
import { readingSection } from "./readingSection";
import { speakingSection } from "./speakingSection";
import { writingSection } from "./writingSection";

export const mockGeneral1: SeedForm = {
  slug: "mock-general-1",
  title: "IELTS General Training Mock Exam 1",
  description: "A full, timed IELTS General Training mock exam: Listening, Reading, Writing and Speaking.",
  variant: "general_training",
  difficulty: "standard",
  isPremium: true,
  purpose: "mock",
  sections: [listeningSection, readingSection, writingSection, speakingSection],
};
