import type { Section } from "~/types/content";

/**
 * Speaking: 3 parts, 11-14 minutes in total.
 * Part 2 is a cue card with 1 minute of preparation and 1-2 minutes of talk.
 */
export const speakingSection: Section = {
  code: "speaking",
  title: "Speaking",
  durationMinutes: 14,
  questionCount: 12,
  itemGroups: [
    {
      id: "sg-1",
      partNumber: 1,
      title: "Part 1 — Introduction and familiar topics",
      stimulusKind: "none",
      instructions:
        "The examiner asks about yourself, your home, work or studies and other familiar topics. 4-5 minutes.",
      questions: [
        "Let's talk about where you live. Do you live in a house or an apartment?",
        "What do you like most about the area you live in?",
        "Would you like to move somewhere else in the future? Why?",
        "Now let's talk about journeys. How do you usually travel to work or college?",
        "Has the way you travel changed in the last few years?",
        "Do you enjoy travelling by train? Why or why not?",
      ].map((prompt, i) => ({
        id: `s-p1-q${i + 1}`,
        number: i + 1,
        type: "short_answer" as const,
        prompt,
        acceptedAnswers: [],
      })),
    },
    {
      id: "sg-2",
      partNumber: 2,
      title: "Part 2 — Individual long turn",
      stimulusKind: "cue_card",
      instructions:
        "You have one minute to prepare. You may make notes. Then talk for one to two minutes. The examiner will tell you when to stop.",
      passageText:
        "Describe a skill you learned that took a long time to develop.\n\nYou should say:\n  •  what the skill was\n  •  why you decided to learn it\n  •  how you went about learning it\n\nand explain how you felt once you had developed it.",
      questions: [
        {
          id: "s-p2-q1",
          number: 7,
          type: "short_answer",
          prompt: "Long turn response",
          acceptedAnswers: [],
        },
      ],
    },
    {
      id: "sg-3",
      partNumber: 3,
      title: "Part 3 — Two-way discussion",
      stimulusKind: "none",
      instructions:
        "The examiner asks further questions connected to the topic in Part 2. 4-5 minutes.",
      questions: [
        "Why do you think some people give up on a skill before they master it?",
        "Should schools spend more time teaching practical skills? Why?",
        "Do you think it is harder to learn new skills as an adult?",
        "How has technology changed the way people acquire skills?",
        "Will some skills disappear entirely in the next fifty years?",
      ].map((prompt, i) => ({
        id: `s-p3-q${i + 1}`,
        number: i + 8,
        type: "short_answer" as const,
        prompt,
        acceptedAnswers: [],
      })),
    },
  ],
};
