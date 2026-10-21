import type { Section } from "../../../../src/types/content";

/** Speaking: 3 parts, 11-14 minutes. Part 2 is a cue card with 1 minute to prepare. */
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
      questions: ["Let's talk about where you live. Do you live in a house or a flat?", "What do you like most about the area you live in?", "Has your area changed much in recent years?", "Now let's talk about music. What kind of music do you enjoy?", "Did you learn to play an instrument when you were a child?", "Do you prefer listening to music alone or with other people? Why?"].map((prompt, i) => ({
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
        "Describe a skill you learned as an adult.\n\nYou should say:\n  •  what the skill is\n  •  when and where you learned it\n  •  how you learned it\n\nand explain how this skill has been useful to you.",
      questions: [{ id: "s-p2-q1", number: 7, type: "short_answer", prompt: "Long turn response", acceptedAnswers: [] }],
    },
    {
      id: "sg-3",
      partNumber: 3,
      title: "Part 3 — Two-way discussion",
      stimulusKind: "none",
      instructions: "The examiner asks further questions connected to the topic in Part 2. 4-5 minutes.",
      questions: ["Is it harder for adults to learn new skills than it is for children? Why?", "What skills do young people need most when they start work today?", "Should employers pay for their staff to learn new skills?", "How has the internet changed the way people learn practical skills?", "Do you think people will need to keep retraining throughout their lives in the future?"].map((prompt, i) => ({
        id: `s-p3-q${i + 1}`,
        number: i + 8,
        type: "short_answer" as const,
        prompt,
        acceptedAnswers: [],
      })),
    },
  ],
};
