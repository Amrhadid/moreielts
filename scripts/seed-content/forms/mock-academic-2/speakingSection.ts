import type { Section } from "../../../../src/types/content";

/**
 * Mock Exam 2 — Speaking: 3 parts, 11-14 minutes in total.
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
        "Let's talk about music. What kind of music do you listen to?",
        "When do you usually listen to music?",
        "Did you learn to play a musical instrument when you were younger?",
        "Now let's talk about handwriting. Do you write by hand much these days?",
        "Do you think handwriting is still important for children to learn?",
        "What can a person's handwriting tell you about them?",
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
        "Describe a time when you changed your opinion about something.\n\nYou should say:\n  •  what your original opinion was\n  •  what made you change your mind\n  •  how long it took you to change it\n\nand explain how you felt after changing your opinion.",
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
        "Why do some people find it difficult to change their opinions?",
        "How much are people's opinions influenced by the media they use?",
        "Is it a sign of weakness or strength when a politician changes their mind?",
        "Should children be taught at school how to evaluate different points of view?",
        "Do you think people's views are becoming more divided than in the past? Why?",
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
