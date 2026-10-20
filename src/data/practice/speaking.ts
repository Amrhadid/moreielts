import type { SpeakingPrompt } from "./types";

/**
 * Speaking practice: two Part 1 questions, one Part 2 cue card with its
 * preparation minute, and two Part 3 discussion questions that follow on
 * from the cue card's theme, exactly as the real test does.
 */
export const SPEAKING_PROMPTS: SpeakingPrompt[] = [
  {
    id: "s1-home",
    part: 1,
    title: "Part 1 · Introduction and interview",
    topic: "Where you live",
    instructions:
      "The examiner asks short questions about familiar topics. Answer naturally in two to four sentences — give a reason or an example, but do not deliver a speech.",
    prompt:
      "Let's talk about where you live. Do you live in a house or an apartment, and what do you like most about it?",
    maxSeconds: 45,
  },
  {
    id: "s1-free-time",
    part: 1,
    title: "Part 1 · Introduction and interview",
    topic: "Free time",
    instructions:
      "The examiner asks short questions about familiar topics. Answer naturally in two to four sentences — give a reason or an example, but do not deliver a speech.",
    prompt: "Do you prefer to spend your free time on your own or with other people? Why?",
    maxSeconds: 45,
  },
  {
    id: "s2-useful-skill",
    part: 2,
    title: "Part 2 · Individual long turn",
    topic: "A useful skill you learned",
    instructions:
      "You have one minute to prepare and may make notes. Then speak for one to two minutes. The recording stops automatically at two minutes.",
    prompt: "Describe a skill you learned that has been useful in your life.",
    cueCard: {
      topic: "Describe a skill you learned that has been useful in your life.",
      bullets: [
        "what the skill is",
        "how and when you learned it",
        "how often you use it now",
      ],
      closing: "and explain why this skill has been so useful to you.",
    },
    maxSeconds: 120,
    prepSeconds: 60,
  },
  {
    id: "s3-practical-skills",
    part: 3,
    title: "Part 3 · Two-way discussion",
    topic: "Learning skills",
    instructions:
      "Part 3 questions are more abstract. Develop your answer: give an opinion, support it with a reason, and consider another side or an example. Aim for 30 to 60 seconds.",
    prompt:
      "Do you think schools should spend more time teaching practical skills, such as cooking or managing money, rather than academic subjects? Why or why not?",
    maxSeconds: 75,
  },
  {
    id: "s3-technology-learning",
    part: 3,
    title: "Part 3 · Two-way discussion",
    topic: "Learning skills",
    instructions:
      "Part 3 questions are more abstract. Develop your answer: give an opinion, support it with a reason, and consider another side or an example. Aim for 30 to 60 seconds.",
    prompt:
      "Some people say that technology has made it much easier to learn new skills than it was in the past. How far do you agree with this view?",
    maxSeconds: 75,
  },
];
