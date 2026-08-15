import type { Section } from "~/types/content";

/**
 * Academic Writing: Task 1 (150 words) + Task 2 (250 words), 60 minutes total
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
      // TODO(backend): Academic Task 1 charts are uploaded images stored in R2.
      imageUrl: "/mock-images/task1-chart.svg",
      imageCaption:
        "Household water consumption by end use in three cities, 2010 and 2024",
      instructions:
        "You should spend about 20 minutes on this task. Write at least 150 words.",
      passageText:
        "The chart below shows household water consumption by end use in three cities in 2010 and 2024.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
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
        "Some people believe that public money spent on the arts would be better directed towards healthcare and education. Others argue that a society without publicly funded culture is poorer in ways that are not easily measured.\n\nDiscuss both these views and give your own opinion.\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.",
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
