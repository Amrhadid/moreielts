import type { ItemGroup, Question, QuestionTypeCode, Section } from "../../src/types/content";

/**
 * Listening: 4 parts, 40 questions, ~30 minutes. The audio for each part plays
 * once and cannot be replayed or scrubbed.
 *
 * TODO(backend): audioUrl values are placeholders. Real forms store the R2
 * object URL of the part's MP3 on the item group.
 */

function gap(
  number: number,
  type: QuestionTypeCode,
  prompt: string,
  answers: string[],
  wordLimit = 2,
): Question {
  return {
    id: `l-q${number}`,
    number,
    type,
    prompt,
    acceptedAnswers: answers,
    wordLimit,
  };
}

function choice(
  number: number,
  prompt: string,
  options: string[],
  answer: string,
): Question {
  return {
    id: `l-q${number}`,
    number,
    type: "multiple_choice_single",
    prompt,
    options: options.map((label, i) => ({
      value: String.fromCharCode(65 + i),
      label: `${String.fromCharCode(65 + i)}. ${label}`,
    })),
    acceptedAnswers: [answer],
  };
}

function match(
  number: number,
  prompt: string,
  options: { value: string; label: string }[],
  answer: string,
  type: QuestionTypeCode = "matching_features",
): Question {
  return {
    id: `l-q${number}`,
    number,
    type,
    prompt,
    options,
    acceptedAnswers: [answer],
  };
}

const FACILITIES = [
  { value: "A", label: "A. Reception" },
  { value: "B", label: "B. Equipment store" },
  { value: "C", label: "C. Studio 1" },
  { value: "D", label: "D. Studio 2" },
  { value: "E", label: "E. Cafe" },
  { value: "F", label: "F. Changing rooms" },
  { value: "G", label: "G. Outdoor court" },
];

const SPEAKERS = [
  { value: "A", label: "A. Priya" },
  { value: "B", label: "B. Tomas" },
  { value: "C", label: "C. Dr Whitfield" },
];

const part1: ItemGroup = {
  id: "lg-1",
  partNumber: 1,
  title: "Part 1 — Enquiry about a community sports centre",
  stimulusKind: "audio",
  audioUrl: "/mock-audio/part-1.mp3",
  instructions:
    "Questions 1-10. Complete the form below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.",
  questions: [
    gap(1, "note_completion", "Caller's surname: ______", ["Whitcombe"]),
    gap(2, "note_completion", "Membership type required: ______ membership", ["off-peak", "offpeak"]),
    gap(3, "note_completion", "Preferred start date: ______ March", ["14th", "14", "fourteenth"]),
    gap(4, "note_completion", "Monthly fee: £______", ["32.50", "32,50"]),
    gap(5, "note_completion", "Joining fee is waived for members who pay by ______", ["direct debit"]),
    gap(6, "note_completion", "Centre closes at ______ on Sundays", ["6pm", "6 pm", "18:00"]),
    gap(7, "note_completion", "Caller is interested in the ______ class on Tuesdays", ["badminton"]),
    gap(8, "note_completion", "Classes must be booked ______ hours in advance", ["48", "forty-eight"]),
    gap(9, "note_completion", "Free parking is limited to ______ minutes", ["90", "ninety"]),
    gap(10, "note_completion", "Induction appointment booked with ______", ["Marco", "Marco Silva"]),
  ],
};

const part2: ItemGroup = {
  id: "lg-2",
  partNumber: 2,
  title: "Part 2 — Introductory talk at an arts centre",
  stimulusKind: "audio",
  audioUrl: "/mock-audio/part-2.mp3",
  imageUrl: "/mock-images/site-plan.svg",
  imageCaption: "Site plan referred to in Questions 18-20",
  instructions:
    "Questions 11-20. Choose the correct letter for Questions 11-14, match the facilities for Questions 15-17, and label the plan for Questions 18-20.",
  questions: [
    choice(11, "The arts centre was originally built as", ["a school", "a railway depot", "a public library", "a swimming baths"], "B"),
    choice(12, "The speaker says the busiest period is", ["weekday mornings", "weekday evenings", "Saturday afternoons", "Sunday mornings"], "C"),
    choice(13, "Members receive a discount of", ["10 per cent", "15 per cent", "20 per cent", "25 per cent"], "C"),
    choice(14, "The speaker advises newcomers to start with", ["the drop-in session", "a taster weekend", "the online tutorials", "a private lesson"], "A"),
    match(15, "Where can visitors leave large bags?", FACILITIES, "B"),
    match(16, "Where is the exhibition of members' work held?", FACILITIES, "C"),
    match(17, "Where do the summer evening performances take place?", FACILITIES, "G"),
    gap(18, "diagram_label", "Label 18 on the site plan (building north of the entrance)", ["equipment store", "store"]),
    gap(19, "diagram_label", "Label 19 on the site plan (across the courtyard)", ["cafe", "café"]),
    gap(20, "diagram_label", "Label 20 on the site plan (beside the car park)", ["changing rooms", "changing room"]),
  ],
};

const part3: ItemGroup = {
  id: "lg-3",
  partNumber: 3,
  title: "Part 3 — Two students discuss a field-work project",
  stimulusKind: "audio",
  audioUrl: "/mock-audio/part-3.mp3",
  instructions:
    "Questions 21-30. Choose the correct letter for Questions 21-24, choose TWO letters for Questions 25-26, and match the speakers for Questions 27-30.",
  questions: [
    choice(21, "Priya is concerned that their sample size is", ["too small to be meaningful", "larger than they can process", "unevenly spread across sites", "drawn from a single season"], "C"),
    choice(22, "Tomas suggests solving the problem by", ["visiting two additional sites", "pooling data with another group", "extending the survey period", "reducing the number of variables"], "B"),
    choice(23, "Their supervisor's main objection to the first draft was", ["the length of the literature review", "the absence of a control site", "the choice of statistical test", "the quality of the photographs"], "B"),
    choice(24, "They agree that the fieldwork diary should be", ["submitted as an appendix", "summarised in the introduction", "left out of the report", "rewritten as a narrative"], "A"),
    {
      id: "l-q25",
      number: 25,
      type: "multiple_choice_multiple",
      prompt: "Which TWO problems did the students have with the recording equipment? Choose TWO letters.",
      options: [
        { value: "A", label: "A. Battery life in cold conditions" },
        { value: "B", label: "B. Incompatible memory cards" },
        { value: "C", label: "C. Background noise from the road" },
        { value: "D", label: "D. A faulty microphone cable" },
        { value: "E", label: "E. Difficulty mounting the tripod" },
      ],
      acceptedAnswers: ["A", "C"],
    },
    {
      id: "l-q26",
      number: 26,
      type: "multiple_choice_multiple",
      prompt: "Which TWO changes will they make before the next visit? Choose TWO letters.",
      options: [
        { value: "A", label: "A. Start recording earlier in the day" },
        { value: "B", label: "B. Bring a second observer" },
        { value: "C", label: "C. Use a different site entirely" },
        { value: "D", label: "D. Shorten each recording session" },
        { value: "E", label: "E. Borrow a windshield for the microphone" },
      ],
      acceptedAnswers: ["A", "E"],
    },
    match(27, "Who proposed the original research question?", SPEAKERS, "A"),
    match(28, "Who will write the methodology section?", SPEAKERS, "B"),
    match(29, "Who arranged access to the second site?", SPEAKERS, "C"),
    match(30, "Who is responsible for the final proofread?", SPEAKERS, "A"),
  ],
};

const part4: ItemGroup = {
  id: "lg-4",
  partNumber: 4,
  title: "Part 4 — Lecture on the history of standardised time",
  stimulusKind: "audio",
  audioUrl: "/mock-audio/part-4.mp3",
  instructions:
    "Questions 31-40. Complete the notes, table and flow-chart below. Write ONE WORD ONLY for each answer.",
  questions: [
    gap(31, "sentence_completion", "Before the railways, each town kept time by the position of the ______.", ["sun"], 1),
    gap(32, "sentence_completion", "The difference between two English towns could be as much as twenty ______.", ["minutes"], 1),
    gap(33, "sentence_completion", "Railway companies published timetables using a single ______ time.", ["London", "standard"], 1),
    gap(34, "summary_completion", "Opposition came mainly from local ______ who saw it as interference.", ["councils", "authorities"], 1),
    gap(35, "summary_completion", "The change was described by critics as a loss of local ______.", ["identity", "character"], 1),
    gap(36, "table_completion", "Table: 1840 — first company to adopt standard time: Great ______ Railway", ["Western"], 1),
    gap(37, "table_completion", "Table: 1880 — standard time given legal ______ in Britain", ["force", "status"], 1),
    gap(38, "flowchart_completion", "Flow-chart step 1: Astronomers determine the reference ______.", ["meridian"], 1),
    gap(39, "flowchart_completion", "Flow-chart step 2: Signal distributed by ______ to major stations.", ["telegraph"], 1),
    gap(40, "flowchart_completion", "Flow-chart step 3: Station masters reset the platform ______ each morning.", ["clock", "clocks"], 1),
  ],
};

export const listeningSection: Section = {
  code: "listening",
  title: "Listening",
  durationMinutes: 30,
  questionCount: 40,
  itemGroups: [part1, part2, part3, part4],
};
