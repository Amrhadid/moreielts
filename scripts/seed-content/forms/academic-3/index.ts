import type { SeedForm } from "../../../../src/types/content";
import { listeningSection } from "./listeningSection";
import { readingSection } from "./readingSection";
import { speakingSection } from "./speakingSection";
import { writingSection } from "./writingSection";

export const academic3: SeedForm = {
  slug: "academic-3",
  title: "Academic Mock Test 3",
  description: "A foundation-level Academic practice test (around band 5-6) covering all four sections.",
  variant: "academic",
  difficulty: "foundation",
  isPremium: false,
  sections: [listeningSection, readingSection, writingSection, speakingSection],
};
