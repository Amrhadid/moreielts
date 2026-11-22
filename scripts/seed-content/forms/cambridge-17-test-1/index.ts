import type { SeedForm } from "../../../../src/types/content";
import { listeningSection } from "./listeningSection";
import { readingSection } from "./readingSection";
import { speakingSection } from "./speakingSection";
import { writingSection } from "./writingSection";

export const cambridge17Test1: SeedForm = {
  slug: "cambridge-17-test-1",
  title: "Cambridge 17 Academic — Test 1 (past paper)",
  description:
    "Authentic past paper from Cambridge IELTS 17 (2022): full Listening, Reading, Writing and Speaking, with the original recordings.",
  variant: "academic",
  difficulty: "standard",
  isPremium: true,
  purpose: "mock",
  sections: [listeningSection, readingSection, writingSection, speakingSection],
};
