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
        "Let's talk about food. What kind of food do you enjoy eating most?",
        "Do you usually cook at home or eat out?",
        "Is there any food you did not like as a child but like now?",
        "Now let's talk about weekends. What do you usually do at the weekend?",
        "Do you prefer to spend weekends with friends or with family? Why?",
        "Is there something new you would like to try at the weekend?",
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
        "Describe a park or garden that you enjoy visiting.\n\nYou should say:\n  •  where it is\n  •  how often you go there\n  •  what you usually do there\n\nand explain why you enjoy visiting this place.",
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
        "Why do you think parks are important in cities?",
        "Do people in your country spend enough time outdoors?",
        "Should local governments spend more money on public parks? Why?",
        "How are parks today different from parks in the past?",
        "Do you think cities will have more or fewer green spaces in the future?",
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
