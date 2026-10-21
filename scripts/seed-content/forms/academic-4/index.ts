import type { SeedForm } from "../../../../src/types/content";
import { listeningSection } from "./listeningSection";
import { readingSection } from "./readingSection";
import { speakingSection } from "./speakingSection";
import { writingSection } from "./writingSection";

export const academic4: SeedForm = {
  slug: "academic-4",
  title: "Academic Mock Test 4",
  description: "A challenge-level Academic practice test (band 7.5+) covering all four sections.",
  variant: "academic",
  difficulty: "challenge",
  isPremium: true,
  sections: [listeningSection, readingSection, writingSection, speakingSection],
};
