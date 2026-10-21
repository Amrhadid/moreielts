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
      imageUrl: "/mock-images/academic-3-task1.svg",
      imageCaption: "How people travelled to work in Northbridge, 2005 and 2025 (% of workers)",
      instructions: "You should spend about 20 minutes on this task. Write at least 150 words.",
      passageText:
        "The bar chart below shows the percentage of workers in the city of Northbridge who used five different methods of transport to travel to work in 2005 and 2025.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
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
        "More and more university courses are now taught online rather than in a classroom.\n\nDo the advantages of this development outweigh the disadvantages?\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.",
      questions: [
        { id: "w-t2", number: 2, type: "short_answer", prompt: "Task 2 response", acceptedAnswers: [], wordLimit: 0 },
      ],
    },
  ],
};
