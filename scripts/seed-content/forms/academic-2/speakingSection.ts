import type { Section } from "../../../../src/types/content";

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
        "Let's talk about your work or studies. What do you do?",
        "What do you find most interesting about it?",
        "Is there anything you would like to change about it?",
        "Now let's talk about food. What kind of food do you enjoy cooking or eating?",
        "Did you eat the same things when you were a child?",
        "Do you prefer eating at home or in restaurants? Why?",
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
        "Describe a place you visited that was very different from where you live.\n\nYou should say:\n  •  where the place was\n  •  when and why you went there\n  •  what was different about it\n\nand explain how you felt about the experience.",
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
        "Why do you think people enjoy visiting places that are unfamiliar to them?",
        "What can young people learn from travelling to other countries?",
        "Has tourism done more good or harm to the places people visit?",
        "Do you think virtual travel could ever replace real travel?",
        "How might the way people take holidays change in the future?",
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
