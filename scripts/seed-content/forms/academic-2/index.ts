import type { SeedForm } from "../../../../src/types/content";
import { listeningSection } from "./listeningSection";
import { readingSection } from "./readingSection";
import { speakingSection } from "./speakingSection";
import { writingSection } from "./writingSection";

export const academic2: SeedForm = {
  slug: "academic-2",
  title: "Academic Mock Test 2",
  description: "A second full Academic practice test covering all four sections.",
  variant: "academic",
  difficulty: "standard",
  isPremium: false,
  sections: [listeningSection, readingSection, writingSection, speakingSection],
};
