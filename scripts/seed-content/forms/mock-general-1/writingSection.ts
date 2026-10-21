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
        "You live in a residential area where a public footpath has been in poor condition for several months, and it has become dangerous.\n\nWrite a letter to your local council. In your letter:\n  •  describe where the footpath is and what is wrong with it\n  •  explain how the problem is affecting local people\n  •  suggest what the council should do\n\nWrite in a formal style.\n\nBegin your letter as follows:\n\nDear Sir or Madam,",
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
        "Some people believe that schools should teach children how to manage money, for example how to save and how to plan a budget. Others think this is the responsibility of parents.\n\nDiscuss both these views and give your own opinion.\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.",
      questions: [
        { id: "w-t2", number: 2, type: "short_answer", prompt: "Task 2 response", acceptedAnswers: [], wordLimit: 0 },
      ],
    },
  ],
};
