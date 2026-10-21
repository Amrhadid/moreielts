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
        "Let's talk about your studies or work. What do you find most demanding about it?",
        "Has the subject you study or the job you do changed the way you think?",
        "Would you consider retraining in a completely different field? Why?",
        "Now let's talk about museums. How often do you visit museums?",
        "Do you prefer museums about history or about science? Why?",
        "Do you think museums should be free to enter?",
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
        "Describe a time when you changed your mind about something important.\n\nYou should say:\n  •  what your original opinion was\n  •  what made you reconsider it\n  •  how long the change took\n\nand explain what you learned from the experience.",
      questions: [
        { id: "s-p2-q1", number: 7, type: "short_answer", prompt: "Long turn response", acceptedAnswers: [] },
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
        "Why do people often find it difficult to change long-held beliefs?",
        "To what extent should public figures be criticised for changing their positions?",
        "Has the internet made people more or less open to opposing views?",
        "How far is it the role of education to teach people to question what they believe?",
        "Do you think societies change their values faster now than in the past? Why?",
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
