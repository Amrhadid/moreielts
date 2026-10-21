import type { Section } from "../../../../src/types/content";

/**
 * Speaking: 3 parts, 11-14 minutes in total (same for both variants).
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
        "Let's talk about your hometown. Where is your hometown?",
        "What is the best thing about living there?",
        "Has your hometown changed much since you were a child?",
        "Now let's talk about cooking. Do you enjoy cooking?",
        "Who usually cooks in your home?",
        "Is there a dish you would like to learn to make?"
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
        "Describe a time when you helped someone.\n\nYou should say:\n  •  who you helped\n  •  what the situation was\n  •  what you did to help\n\nand explain how you felt about helping this person.",
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
        "Why do some people find it difficult to ask for help?",
        "Should children be taught to help others at school?",
        "Do people help each other less in modern cities?",
        "What kinds of volunteer work are popular in your country?",
        "Is it the government's responsibility to help people in need, or the community's?"
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
