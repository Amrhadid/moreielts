import type { Section } from "../../../../src/types/content";

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
      imageUrl: "/mock-images/academic-4-task1.svg",
      imageCaption: "Share of electricity generated from renewable sources in four countries, 2000-2025 (%)",
      instructions: "You should spend about 20 minutes on this task. Write at least 150 words.",
      passageText:
        "The line graph below shows the percentage of electricity generated from renewable sources in Denmark, Spain, Japan and Canada between 2000 and 2025.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
      questions: [
        { id: "w-t1", number: 1, type: "short_answer", prompt: "Task 1 response", acceptedAnswers: [], wordLimit: 0 },
      ],
    },
    {
      id: "wg-2",
      partNumber: 2,
      title: "Task 2",
      stimulusKind: "writing_task",
      instructions: "You should spend about 40 minutes on this task. Write at least 250 words.",
      passageText:
        "Some argue that personal genetic data, such as the results of commercial DNA tests, should be available to medical researchers without individual consent because the benefits to public health are so great. Others believe that such data must always remain under the control of the individual.\n\nDiscuss both these views and give your own opinion.\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.",
      questions: [
        { id: "w-t2", number: 2, type: "short_answer", prompt: "Task 2 response", acceptedAnswers: [], wordLimit: 0 },
      ],
    },
  ],
};
