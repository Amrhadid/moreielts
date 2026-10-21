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
        "A friend from another country is planning to visit your town for a week next month and has asked for your advice.\n\nWrite a letter to your friend. In your letter:\n  \u2022  suggest the best places to stay\n  \u2022  recommend some things to do during the visit\n  \u2022  offer to help in some way\n\nBegin your letter as follows:\n\nDear ...,",
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
        "Some people think that young people should be required to do unpaid community work in their free time. Others believe this should be a personal choice.\n\nTo what extent do you agree or disagree that community work should be compulsory for young people?\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.",
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
