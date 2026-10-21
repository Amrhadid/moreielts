import type { SeedForm } from "../../../../src/types/content";
import { listeningSection } from "./listeningSection";
import { readingSection } from "./readingSection";
import { speakingSection } from "./speakingSection";
import { writingSection } from "./writingSection";

export const general2: SeedForm = {
  slug: "general-2",
  title: "General Training Mock Test 2",
  description: "A full General Training practice test covering all four sections.",
  variant: "general_training",
  difficulty: "standard",
  isPremium: true,
  sections: [listeningSection, readingSection, writingSection, speakingSection],
};
