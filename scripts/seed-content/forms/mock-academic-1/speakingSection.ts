import type { Section } from "../../../../src/types/content";

/**
 * Mock Exam 1 — Speaking: 3 parts, 11-14 minutes in total.
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
        "Let's talk about where you live. Do you live in a house or a flat?",
        "What do you like most about the area where you live?",
        "Would you like to move somewhere else in the future? Why?",
        "Now let's talk about the weather. What kind of weather do you enjoy most?",
        "Does the weather ever affect your mood?",
        "Has the weather in your country changed since you were a child?",
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
        "Describe a skill that took you a long time to learn.\n\nYou should say:\n  •  what the skill was\n  •  when and why you started learning it\n  •  what made it difficult to learn\n\nand explain how you feel about this skill now.",
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
        "Why do some people give up when they are learning a new skill?",
        "Is it better to learn a skill from a teacher or by yourself, for example online?",
        "Which skills do you think schools should spend more time teaching?",
        "Do you think older people find it harder to learn new skills than young people?",
        "How might technology change the skills people need for work in the future?",
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
