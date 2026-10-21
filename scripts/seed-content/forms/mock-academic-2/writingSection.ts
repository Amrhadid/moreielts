import type { Section } from "../../../../src/types/content";

/**
 * Mock Exam 2 — Academic Writing: Task 1 (150 words) + Task 2 (250 words), 60 minutes total
 * across both tasks -- one clock, not two.
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
      imageUrl: "/mock-images/mock-academic-2-task1.svg",
      imageCaption: "The centre of Larkfield in 2000 and today",
      instructions: "You should spend about 20 minutes on this task. Write at least 150 words.",
      passageText:
        "The maps below show the centre of the town of Larkfield in 2000 and as it is today.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
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
      instructions: "You should spend about 40 minutes on this task. Write at least 250 words.",
      passageText:
        "Some people argue that universities should make all of their courses available online free of charge, so that anyone can study regardless of income or location.\n\nTo what extent do you agree or disagree?\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.",
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
