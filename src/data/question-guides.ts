import type { QuestionTypeCode, SectionCode } from "~/types/content";

/**
 * Public strategy guides, one per question type. These pages are the app's
 * SEO surface (/guides/<slug>) and are linked from Learn and from drills.
 * The type codes match question_types, so a guide links straight to its drill.
 */
export interface QuestionGuide {
  code: QuestionTypeCode;
  slug: string;
  name: string;
  sections: SectionCode[];
  summary: string;
  tests: string;
  steps: string[];
  traps: string[];
  example: { prompt: string; answer: string; why: string };
}

export const QUESTION_GUIDES: QuestionGuide[] = [
  {
    code: "true_false_notgiven",
    slug: "true-false-not-given",
    name: "True / False / Not Given",
    sections: ["reading"],
    summary: "Decide whether each statement agrees with the facts in the passage, contradicts them, or is not covered.",
    tests: "Precise reading of factual claims, and telling a contradiction apart from missing information.",
    steps: [
      "Underline the key content words in the statement, especially qualifiers such as all, some, always, only and numbers.",
      "Scan for the part of the passage that discusses the same idea. Answers come in passage order.",
      "Compare meaning, not words: the passage will paraphrase.",
      "Choose FALSE only if the passage states the opposite. If the passage simply does not say, choose NOT GIVEN.",
    ],
    traps: [
      "Using your own knowledge instead of the passage.",
      "Treating a missing detail as a contradiction.",
      "Missing a qualifier: 'most' in the passage versus 'all' in the statement makes it FALSE.",
    ],
    example: {
      prompt: "Passage: 'Most of the city's trees were planted after 1950.' Statement: All of the city's trees are less than 80 years old.",
      answer: "FALSE",
      why: "'Most' were planted after 1950, so some are older; the statement says 'all'.",
    },
  },
  {
    code: "yes_no_notgiven",
    slug: "yes-no-not-given",
    name: "Yes / No / Not Given",
    sections: ["reading"],
    summary: "Decide whether each statement matches the writer's views or claims, contradicts them, or is not addressed.",
    tests: "Identifying a writer's opinion and attitude, not just facts.",
    steps: [
      "Look for opinion language in the passage: evaluative adjectives, modal verbs, 'I would argue', 'it is misguided to'.",
      "Locate the section in order and decide what the writer believes about that exact point.",
      "YES = the writer agrees; NO = the writer disagrees; NOT GIVEN = the writer gives no view on it.",
    ],
    traps: [
      "Confusing a view the writer reports (someone else's) with the writer's own view.",
      "Answering from a single word match instead of the whole claim.",
    ],
    example: {
      prompt: "Passage: 'Critics claim homework is useless; the evidence suggests they overstate the case.' Statement: The writer thinks homework is useless.",
      answer: "NO",
      why: "The writer says the critics 'overstate the case', so the writer disagrees with the claim.",
    },
  },
  {
    code: "matching_headings",
    slug: "matching-headings",
    name: "Matching Headings",
    sections: ["reading"],
    summary: "Choose the heading that best sums up the main idea of each paragraph.",
    tests: "Finding the main idea of a paragraph as opposed to its details.",
    steps: [
      "Read the headings first and note how they differ from each other.",
      "For each paragraph read the first two sentences and the last one; that is usually where the main idea sits.",
      "Ask 'what is the whole paragraph about?' and pick the heading that covers all of it.",
      "Do the paragraphs you are sure of first to shrink the list.",
    ],
    traps: [
      "Picking a heading because one word appears in the paragraph.",
      "Choosing a heading that only describes an example or detail.",
    ],
    example: {
      prompt: "A paragraph lists the costs of planting street trees, then explains that benefits appear only after decades.",
      answer: "A slow return on a long investment",
      why: "The paragraph's point is the delay between cost and benefit, not the costs themselves.",
    },
  },
  {
    code: "matching_information",
    slug: "matching-information",
    name: "Matching Information",
    sections: ["reading"],
    summary: "Find which paragraph contains a given piece of information, such as an example, a reason or a comparison.",
    tests: "Scanning for specific detail; answers are not in passage order.",
    steps: [
      "Identify the type of information asked for: an example, a definition, a reason, a date.",
      "Turn the key idea into likely paraphrases before scanning.",
      "Work paragraph by paragraph and check each one against all remaining statements.",
    ],
    traps: ["Expecting the answers to follow passage order.", "Forgetting that one paragraph may be used more than once."],
    example: {
      prompt: "Which paragraph mentions a single event that changed public opinion?",
      answer: "Paragraph D",
      why: "Paragraph D describes how one heatwave in 2003 shifted attitudes.",
    },
  },
  {
    code: "matching_features",
    slug: "matching-features",
    name: "Matching Features",
    sections: ["reading", "listening"],
    summary: "Match statements to a list of people, places, dates or categories.",
    tests: "Linking ideas to the right source when several are discussed.",
    steps: [
      "Circle every occurrence of each name or feature in the text before reading the statements closely.",
      "Read what is said around each occurrence and compare it with the statements.",
      "Watch for pronouns (he, she, they, this researcher) that refer back to a name.",
    ],
    traps: ["Matching on topic instead of on the actual claim.", "Missing a later mention of the same person."],
    example: {
      prompt: "Who suggested that memories are rebuilt each time they are recalled?",
      answer: "Bartlett",
      why: "The passage says Bartlett described remembering as 'an act of reconstruction'.",
    },
  },
  {
    code: "matching_sentence_endings",
    slug: "matching-sentence-endings",
    name: "Matching Sentence Endings",
    sections: ["reading"],
    summary: "Complete each sentence beginning with the correct ending from a list.",
    tests: "Understanding cause, effect and condition across a sentence.",
    steps: [
      "Locate the sentence beginning in the passage; answers usually go in order.",
      "Predict how the idea finishes before looking at the endings.",
      "Check grammar and logic: the full sentence must be true to the passage, not just grammatical.",
    ],
    traps: ["Choosing an ending that is true in the passage but answers a different beginning."],
    example: {
      prompt: "Witnesses may report false details with confidence...",
      answer: "...because remembering is an act of reconstruction.",
      why: "The passage links confident false memories to reconstruction, not to rehearsal.",
    },
  },
  {
    code: "multiple_choice_single",
    slug: "multiple-choice",
    name: "Multiple Choice (one answer)",
    sections: ["reading", "listening"],
    summary: "Choose the one option that answers the question or completes the statement.",
    tests: "Detailed understanding, often of a writer's or speaker's main point.",
    steps: [
      "Read the question stem carefully and underline what it actually asks.",
      "Find the relevant part of the text; in Listening, read ahead before the audio reaches it.",
      "Eliminate options that are wrong, too broad, or true but irrelevant.",
    ],
    traps: [
      "In Listening, choosing the first option mentioned: speakers often change their mind.",
      "Options that repeat words from the text but change the meaning.",
    ],
    example: {
      prompt: "The speaker says the busiest period is (A) weekday mornings (B) weekday evenings (C) Saturday afternoons.",
      answer: "C",
      why: "Evenings are described as 'busy', but Saturday afternoons as 'our busiest time'.",
    },
  },
  {
    code: "multiple_choice_multiple",
    slug: "multiple-choice-two-answers",
    name: "Multiple Choice (choose TWO or THREE)",
    sections: ["reading", "listening"],
    summary: "Choose two or three correct options from a longer list.",
    tests: "Picking out several correct details while rejecting close distractors.",
    steps: [
      "Check how many answers you need; each correct letter usually scores one mark.",
      "Tick options as you hear or read evidence, and cross out ones that are rejected.",
      "Order does not matter, but you must not choose more letters than asked.",
    ],
    traps: ["Options that were mentioned but then ruled out.", "Writing extra letters, which costs the mark."],
    example: {
      prompt: "Which TWO problems did the students have with the equipment?",
      answer: "A and C",
      why: "Battery life in the cold and road noise were both confirmed; the cable was checked and was fine.",
    },
  },
  {
    code: "sentence_completion",
    slug: "sentence-completion",
    name: "Sentence Completion",
    sections: ["reading", "listening"],
    summary: "Fill each gap with words taken from the passage or recording, within the word limit.",
    tests: "Locating exact detail and producing it accurately.",
    steps: [
      "Read the instruction for the word limit: NO MORE THAN TWO WORDS means one or two.",
      "Predict the type of word (noun, number, adjective) from the grammar of the gap.",
      "Copy the word exactly as it appears, with correct spelling.",
    ],
    traps: ["Breaking the word limit, which makes the answer wrong.", "Spelling errors, which also lose the mark."],
    example: {
      prompt: "Before the railways, each town kept time by the position of the ______.",
      answer: "sun",
      why: "The lecturer says towns set their clocks 'by the sun at noon'.",
    },
  },
  {
    code: "summary_completion",
    slug: "summary-completion",
    name: "Summary Completion",
    sections: ["reading", "listening"],
    summary: "Complete a summary of part of the text, using words from the text or from a box.",
    tests: "Following the flow of an argument and finding paraphrased detail.",
    steps: [
      "Read the whole summary first to understand what part of the text it covers.",
      "Decide the part of speech for each gap.",
      "If there is a word box, expect synonyms; if not, copy words from the text.",
    ],
    traps: ["Choosing a word that fits grammatically but changes the meaning."],
    example: {
      prompt: "Opposition came mainly from local ______ who saw it as interference.",
      answer: "councils",
      why: "The talk says 'many town councils objected'.",
    },
  },
  {
    code: "note_completion",
    slug: "note-completion",
    name: "Note / Form Completion",
    sections: ["listening", "reading"],
    summary: "Complete notes or a form with details such as names, numbers, dates and times.",
    tests: "Catching specific information, including spelled names and numbers.",
    steps: [
      "Use the reading time to predict each answer: a date, a price, a surname.",
      "Listen for corrections: 'No, sorry, it's the 14th, not the 4th.'",
      "Write numbers as digits and check plural forms.",
    ],
    traps: ["The first number you hear is often corrected.", "Letters that sound alike when names are spelled (B/P, M/N)."],
    example: {
      prompt: "Monthly fee: £______",
      answer: "32.50",
      why: "The receptionist first says £35, then corrects it to £32.50 for off-peak.",
    },
  },
  {
    code: "table_completion",
    slug: "table-completion",
    name: "Table Completion",
    sections: ["listening", "reading"],
    summary: "Fill gaps in a table with words or numbers.",
    tests: "Organising detail into categories and reading across rows and columns.",
    steps: [
      "Read the column and row headings to understand what each cell should contain.",
      "Notice the pattern of completed cells: it tells you the word type.",
      "Move across the table in order; information is usually given row by row.",
    ],
    traps: ["Writing information into the wrong row when the speaker jumps between categories."],
    example: {
      prompt: "1880 — standard time given legal ______ in Britain",
      answer: "force",
      why: "The lecturer says 'in 1880 it was given the force of law'.",
    },
  },
  {
    code: "flowchart_completion",
    slug: "flow-chart-completion",
    name: "Flow-chart Completion",
    sections: ["listening", "reading"],
    summary: "Complete the steps of a process shown as a flow-chart.",
    tests: "Following a sequence of steps and the language of process.",
    steps: [
      "Read the chart top to bottom and note sequence words: first, then, once, finally.",
      "Expect nouns and verbs that describe actions or stages.",
      "Keep to the word limit; most flow-charts want one word.",
    ],
    traps: ["Losing your place in the process when the speaker gives background detail."],
    example: {
      prompt: "Signal distributed by ______ to major stations.",
      answer: "telegraph",
      why: "The time signal was 'sent down the telegraph lines'.",
    },
  },
  {
    code: "diagram_label",
    slug: "diagram-map-labelling",
    name: "Map, Plan and Diagram Labelling",
    sections: ["listening", "reading"],
    summary: "Label parts of a map, plan or diagram from the recording or text.",
    tests: "Following directions and spatial language.",
    steps: [
      "Orient yourself before the audio: find the entrance, the 'you are here' point and north.",
      "Learn the language of direction: opposite, adjacent to, to the left of, at the far end.",
      "Track the speaker's route with your pencil as they move.",
    ],
    traps: ["Confusing left and right when the speaker faces a different direction."],
    example: {
      prompt: "Label 19 on the site plan (across the courtyard).",
      answer: "cafe",
      why: "'Directly across the courtyard from the entrance you'll find the cafe.'",
    },
  },
  {
    code: "short_answer",
    slug: "short-answer-questions",
    name: "Short-answer Questions",
    sections: ["reading", "listening"],
    summary: "Answer questions with a few words from the text, within the word limit.",
    tests: "Locating precise information in response to a direct question.",
    steps: [
      "Underline the question word (what, when, how many) to know what kind of answer you need.",
      "Find the matching part of the text; answers come in order.",
      "Write only the words that answer the question.",
    ],
    traps: ["Adding extra words that push you over the limit."],
    example: {
      prompt: "What is added to fishing lines so that they sink more quickly?",
      answer: "weights",
      why: "The passage mentions 'weighted lines that sink faster'.",
    },
  },
];

export function guideBySlug(slug: string): QuestionGuide | undefined {
  return QUESTION_GUIDES.find((g) => g.slug === slug);
}

export function guideByCode(code: string): QuestionGuide | undefined {
  return QUESTION_GUIDES.find((g) => g.code === code);
}
