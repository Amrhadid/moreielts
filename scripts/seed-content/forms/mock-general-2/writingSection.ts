import type { Section } from "../../../../src/types/content";

/** General Training Writing: Task 1 letter + Task 2 essay, 60 minutes on one clock. */
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
        "A close friend has invited you to stay with them next month, but you have just been asked to look after a neighbour's pet while they are away.\n\nWrite a letter to your friend. In your letter:\n  •  thank your friend for the invitation\n  •  explain why you cannot come on the planned dates\n  •  suggest another time when you could visit\n\nWrite in an informal style.\n\nBegin your letter as follows:\n\nDear ...,",
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
        "These days many people buy most of their goods online instead of from local shops.\n\nDo the advantages of this development outweigh the disadvantages?\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.",
      questions: [
        { id: "w-t2", number: 2, type: "short_answer", prompt: "Task 2 response", acceptedAnswers: [], wordLimit: 0 },
      ],
    },
  ],
};
