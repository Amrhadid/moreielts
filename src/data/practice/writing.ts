import type { WritingTask } from "./types";

/**
 * Writing practice: two Academic Task 1 prompts (a bar chart and a table) and
 * three Task 2 essay questions covering the common rubric types — discuss both
 * views, causes and solutions, and agree or disagree.
 */
export const WRITING_TASKS: WritingTask[] = [
  {
    id: "w1-internet-access",
    taskNumber: 1,
    title: "Task 1 · Bar chart",
    topic: "Household internet access in four countries",
    instructions: "You should spend about 20 minutes on this task. Write at least 150 words.",
    prompt:
      "The chart below shows the percentage of households with access to the internet in four countries in 2005, 2015 and 2025.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    minWords: 150,
    suggestedMinutes: 20,
    chart: {
      kind: "bar",
      title: "Households with internet access (%)",
      unit: "% of households",
      categories: ["Brazil", "India", "South Korea", "United Kingdom"],
      series: [
        { name: "2005", values: [13, 2, 73, 60] },
        { name: "2015", values: [58, 17, 90, 91] },
        { name: "2025", values: [84, 55, 98, 97] },
      ],
      max: 100,
    },
  },
  {
    id: "w1-visitor-attractions",
    taskNumber: 1,
    title: "Task 1 · Table",
    topic: "Visitors to four types of attraction",
    instructions: "You should spend about 20 minutes on this task. Write at least 150 words.",
    prompt:
      "The table below shows the number of visitors, in millions, to four types of attraction in one European country in 2010 and 2020, and the percentage change over the period.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    minWords: 150,
    suggestedMinutes: 20,
    table: {
      title: "Visitors to attractions (millions)",
      columns: ["Type of attraction", "2010", "2020", "Change"],
      rows: [
        ["Museums and galleries", "24.1", "31.6", "+31%"],
        ["Historic houses and castles", "12.8", "11.9", "−7%"],
        ["Theme parks", "9.4", "15.2", "+62%"],
        ["Botanical gardens", "6.2", "7.0", "+13%"],
        ["Total", "52.5", "65.7", "+25%"],
      ],
    },
  },
  {
    id: "w2-attendance",
    taskNumber: 2,
    title: "Task 2 · Discuss both views",
    topic: "Should university attendance be compulsory?",
    instructions: "You should spend about 40 minutes on this task. Write at least 250 words.",
    prompt:
      "Some people believe that university students should be required to attend all their classes. Others believe that attending classes should be optional for adult learners.\n\nDiscuss both these views and give your own opinion.\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.",
    minWords: 250,
    suggestedMinutes: 40,
  },
  {
    id: "w2-household-waste",
    taskNumber: 2,
    title: "Task 2 · Causes and solutions",
    topic: "Rising household waste",
    instructions: "You should spend about 40 minutes on this task. Write at least 250 words.",
    prompt:
      "In many countries, the amount of waste produced by households is increasing every year.\n\nWhat are the causes of this trend? What measures could governments and individuals take to reduce the amount of household waste?\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.",
    minWords: 250,
    suggestedMinutes: 40,
  },
  {
    id: "w2-free-transport",
    taskNumber: 2,
    title: "Task 2 · Agree or disagree",
    topic: "Free public transport and city traffic",
    instructions: "You should spend about 40 minutes on this task. Write at least 250 words.",
    prompt:
      "Some people think that the most effective way to reduce traffic congestion in cities is to make public transport free of charge.\n\nTo what extent do you agree or disagree?\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.",
    minWords: 250,
    suggestedMinutes: 40,
  },
];
