import type { Section } from "../../../../src/types/content";

/**
 * General Training Writing: Task 1 letter (150 words) + Task 2 essay
 * (250 words), 60 minutes across both tasks -- one clock, not two.
 */
export const writingSection: Section = {
  code: "writing",
  title: "Writing",
  durationMinutes: 60,
  questionCount: 2,
  itemGroups: [
    {
      id: "wg-1",
      partNumber: 1,
      title: "Task 1",
      stimulusKind: "writing_task",
      instructions:
        "You should spend about 20 minutes on this task. Write at least 150 words. You do NOT need to write any addresses.",
      passageText:
        "You recently stayed at a hotel and left a valuable item in your room when you checked out.\n\nWrite a letter to the hotel manager. In your letter:\n  \u2022  give details of your stay\n  \u2022  describe the item and explain why it is important to you\n  \u2022  say how you would like the item to be returned\n\nBegin your letter as follows:\n\nDear Sir or Madam,",
      questions: [
        {
          id: "w-t1",
          number: 1,
          type: "short_answer",
          prompt: "Task 1 response",
          acceptedAnswers: [],
          wordLimit: 0,
        },
      ],
    },
    {
      id: "wg-2",
      partNumber: 2,
      title: "Task 2",
      stimulusKind: "writing_task",
      instructions:
        "You should spend about 40 minutes on this task. Write at least 250 words.",
      passageText:
        "In many countries, people are working longer hours than ever before, and some say this has a negative effect on family life.\n\nWhat are the causes of this trend? What can be done to reduce its effects?\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.",
      questions: [
        {
          id: "w-t2",
          number: 2,
          type: "short_answer",
          prompt: "Task 2 response",
          acceptedAnswers: [],
          wordLimit: 0,
        },
      ],
    },
  ],
};
