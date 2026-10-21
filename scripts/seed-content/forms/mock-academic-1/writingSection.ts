import type { Section } from "../../../../src/types/content";

/**
 * Mock Exam 1 — Academic Writing: Task 1 (150 words) + Task 2 (250 words), 60 minutes total
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
      imageUrl: "/mock-images/mock-academic-1-task1.svg",
      imageCaption: "Average hours per week spent on four leisure activities, by age group, 2023",
      instructions: "You should spend about 20 minutes on this task. Write at least 150 words.",
      passageText:
        "The bar chart below shows the average number of hours per week that people in four age groups spent on four leisure activities in one country in 2023.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
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
        "Some people believe that city authorities should spend money on improving public transport rather than on building new roads. Others argue that new roads are essential for a growing city.\n\nDiscuss both these views and give your own opinion.\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.",
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
