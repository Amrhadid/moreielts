import type { Section } from "../../../../src/types/content";

/**
 * Cambridge IELTS 17 (Academic, 2022) — Test 1, Speaking: 3 parts, 11-14
 * minutes. Part 2 is a cue card with 1 minute of preparation and 1-2 minutes
 * of talk. Questions transcribed from the public archive.org scan.
 */
export const speakingSection: Section = {
  code: "speaking",
  title: "Speaking",
  durationMinutes: 14,
  questionCount: 11,
  itemGroups: [
    {
      id: "c17t1-sg-1",
      partNumber: 1,
      title: "Part 1 — Introduction and familiar topics",
      stimulusKind: "none",
      instructions:
        "The examiner asks about yourself, your home, work or studies and other familiar topics. 4-5 minutes. Topic: History.",
      questions: [
        "What did you study in history lessons when you were at school?",
        "Did you enjoy studying history at school? [Why/Why not?]",
        "How often do you watch TV programmes about history now? [Why/Why not?]",
        "What period in history would you like to learn more about? [Why?]",
      ].map((prompt, i) => ({
        id: `c17t1-s-p1-q${i + 1}`,
        number: i + 1,
        type: "short_answer" as const,
        prompt,
        acceptedAnswers: [],
      })),
    },
    {
      id: "c17t1-sg-2",
      partNumber: 2,
      title: "Part 2 — Individual long turn",
      stimulusKind: "cue_card",
      instructions:
        "You will have to talk about the topic for one to two minutes. You have one minute to think about what you are going to say. You can make some notes to help you if you wish.",
      passageText:
        "Describe the neighbourhood you lived in when you were a child.\n\nYou should say:\n- where in your town/city the neighbourhood was\n- what kind of people lived there\n- what it was like to live in this neighbourhood\n\nand explain whether you would like to live in this neighbourhood in the future.",
      questions: [
        {
          id: "c17t1-s-p2-q1",
          number: 5,
          type: "short_answer",
          prompt: "Part 2 talk (1-2 minutes)",
          acceptedAnswers: [],
        },
      ],
    },
    {
      id: "c17t1-sg-3",
      partNumber: 3,
      title: "Part 3 — Discussion",
      stimulusKind: "none",
      instructions:
        "Discussion topics: Neighbours, and Facilities in cities. 4-5 minutes.",
      questions: [
        "What sort of things can neighbours do to help each other?",
        "How well do people generally know their neighbours in your country?",
        "How important do you think it is to have good neighbours?",
        "Which facilities are most important to people living in cities?",
        "How does shopping in small local shops differ from shopping in large city centre shops?",
        "Do you think that children should always go to the school nearest to where they live?",
      ].map((prompt, i) => ({
        id: `c17t1-s-p3-q${i + 1}`,
        number: i + 6,
        type: "short_answer" as const,
        prompt,
        acceptedAnswers: [],
      })),
    },
  ],
};
