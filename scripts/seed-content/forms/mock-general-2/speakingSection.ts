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
      questions: ["Let's talk about food. What kind of food do you usually eat at home?", "Do you enjoy cooking? Why or why not?", "Is there any food you disliked as a child but enjoy now?", "Now let's talk about the weather. What is the weather usually like where you live?", "Does the weather affect how you feel?", "What do you like to do on a rainy day?"].map((prompt, i) => ({
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
        "Describe a journey you remember well.\n\nYou should say:\n  •  where you were going\n  •  who you travelled with\n  •  how you travelled\n\nand explain why you remember this journey so well.",
      questions: [{ id: "s-p2-q1", number: 7, type: "short_answer", prompt: "Long turn response", acceptedAnswers: [] }],
    },
    {
      id: "sg-3",
      partNumber: 3,
      title: "Part 3 — Two-way discussion",
      stimulusKind: "none",
      instructions: "The examiner asks further questions connected to the topic in Part 2. 4-5 minutes.",
      questions: ["Why do some people enjoy long journeys while others find them tiring?", "How has public transport changed in your country in recent years?", "Should governments spend more money on trains or on roads? Why?", "Do you think people travel too much these days?", "How might the way people travel change in the next twenty years?"].map((prompt, i) => ({
        id: `s-p3-q${i + 1}`,
        number: i + 8,
        type: "short_answer" as const,
        prompt,
        acceptedAnswers: [],
      })),
    },
  ],
};
