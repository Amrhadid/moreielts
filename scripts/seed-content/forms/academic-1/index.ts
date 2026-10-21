import type { SeedForm } from "../../../../src/types/content";
import { listeningSection } from "./listeningSection";
import { readingSection } from "./readingSection";
import { speakingSection } from "./speakingSection";
import { writingSection } from "./writingSection";

export const academic1: SeedForm = {
  slug: "academic-1",
  title: "Academic Mock Test 1",
  description: "A full Academic practice test covering all four sections.",
  variant: "academic",
  difficulty: "standard",
  isPremium: false,
  sections: [listeningSection, readingSection, writingSection, speakingSection],
};
