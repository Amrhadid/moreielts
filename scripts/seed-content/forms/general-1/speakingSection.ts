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
        "Let's talk about your work or studies. What do you do?",
        "What do you enjoy most about it?",
        "Is there anything you would like to change about it?",
        "Now let's talk about weekends. What do you usually do at the weekend?",
        "Did you spend your weekends differently as a child?",
        "Do you prefer busy or relaxing weekends? Why?"
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
        "Describe a neighbour you know well.\n\nYou should say:\n  •  who this person is\n  •  how long you have known them\n  •  what you usually do or talk about together\n\nand explain why you get on well with this person.",
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
        "Do people know their neighbours as well as they did in the past?",
        "What can people do to build a sense of community where they live?",
        "Is it better to live in a large city or a small town? Why?",
        "How do you think neighbourhoods will change in the future?",
        "Should local governments organise events for residents? Why?"
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
