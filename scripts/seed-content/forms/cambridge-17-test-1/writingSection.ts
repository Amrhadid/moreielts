import type { Section } from "../../../../src/types/content";

/**
 * Cambridge IELTS 17 (Academic, 2022) — Test 1, Writing: Task 1 (150 words)
 * + Task 2 (250 words), 60 minutes across both tasks, one clock.
 * Task 1 is a map task; the map image is bundled at
 * public/mock-images/cambridge-17-test-1-task1.png.
 */
export const writingSection: Section = {
  code: "writing",
  title: "Writing",
  durationMinutes: 60,
  questionCount: 2,
  itemGroups: [
    {
      id: "c17t1-wg-1",
      partNumber: 1,
      title: "Task 1",
      stimulusKind: "writing_task",
      imageUrl: "/mock-images/cambridge-17-test-1-task1.png",
      imageCaption:
        "Norbiton industrial area now, and planned future development of the site",
      instructions:
        "You should spend about 20 minutes on this task. Write at least 150 words.",
      passageText:
        "The maps below show an industrial area in the town of Norbiton, and planned future development of the site.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
      questions: [
        {
          id: "c17t1-w-t1",
          number: 1,
          type: "short_answer",
          prompt: "Task 1 response",
          acceptedAnswers: [],
          wordLimit: 0,
        },
      ],
    },
    {
      id: "c17t1-wg-2",
      partNumber: 2,
      title: "Task 2",
      stimulusKind: "writing_task",
      instructions:
        "You should spend about 40 minutes on this task. Write at least 250 words.",
      passageText:
        "It is important for people to take risks, both in their professional lives and their personal lives.\n\nDo you think the advantages of taking risks outweigh the disadvantages?\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.",
      questions: [
        {
          id: "c17t1-w-t2",
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
