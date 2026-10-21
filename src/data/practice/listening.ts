import type { ObjectiveSet } from "./types";

/**
 * Listening practice set: a Part 1 style telephone conversation with form
 * completion and one multiple-choice question.
 *
 * The transcript below is the script the audio was generated from (see
 * scripts/generate-practice-audio.ts). Keep the two in step: if a line changes,
 * regenerate the MP3.
 */
export const LISTENING_TRANSCRIPT: string[] = [
  "Narrator: IELTS Listening practice. Part 1. You will hear a woman telephoning a walking club to ask about becoming a member. First, you have some time to look at questions 1 to 5. Now listen carefully and answer questions 1 to 5.",
  "Tom: Good morning, Riverside Ramblers, Tom speaking. How can I help?",
  "Emma: Oh, hello. I've just moved to the area and a friend mentioned your walking club. I was hoping to find out a bit more about joining.",
  "Tom: Of course. Let me take a few details first, if that's all right, and then I can tell you about the walks. Could I have your name, please?",
  "Emma: Yes, it's Emma Whitfield.",
  "Tom: Whitfield. Is that W-H-I-T-F-I-E-L-D?",
  "Emma: That's right.",
  "Tom: Lovely. Now, membership. We used to charge fifty pounds a year, but the committee reduced it in January, so it's now forty-five pounds for the year. That covers your insurance and the monthly newsletter.",
  "Emma: That seems very reasonable. And where do the walks start from?",
  "Tom: Most of them leave from the town centre. We used to gather at the railway station, but the car park there has become so expensive that we now meet outside the library on Market Street. There's free parking behind it on Saturdays.",
  "Emma: Outside the library, got it. And how long are the walks, usually?",
  "Tom: It varies. Our regular Saturday walks are around eight kilometres, but this coming Saturday is one of our longer ones, along the river to Ashford. That's roughly twelve kilometres, so allow about four hours, including a stop for lunch.",
  "Emma: That sounds perfect. Is there anything I should bring?",
  "Tom: Good question. Most people stop at the café in Ashford, so you don't need to carry a packed lunch unless you want to. Some members like walking poles, but the route is quite flat, so they're not really necessary. The one thing I would insist on is a waterproof jacket. The forecast isn't great, and there's very little shelter along the river.",
  "Emma: Right, a waterproof jacket. I'll make sure I pack one.",
  "Tom: Great. Shall I put you down for Saturday, then? We leave at nine thirty sharp.",
  "Emma: Yes, please. Nine thirty, outside the library. Thank you so much for your help, Tom.",
  "Tom: My pleasure, Emma. See you on Saturday.",
  "Narrator: That is the end of Part 1.",
];

export const LISTENING_SET: ObjectiveSet = {
  section: "listening",
  id: "listening-walking-club-1",
  title: "Joining a walking club",
  contextLabel: "Part 1 · telephone conversation · 5 questions",
  instructions:
    "Questions 1–4: complete the form below. Write ONE WORD AND/OR A NUMBER for each answer. Question 5: choose the correct letter, A, B or C. In the real test the recording plays once only; in practice you may replay it.",
  audio: {
    src: "/audio/practice/listening-walking-club-1.mp3",
    durationLabel: "about 2 minutes",
    transcript: LISTENING_TRANSCRIPT,
  },
  questions: [
    {
      id: "l1",
      number: 1,
      kind: "text",
      typeLabel: "Form completion",
      prompt: "Member's surname: ______",
      acceptedAnswers: ["Whitfield"],
      wordLimit: 1,
      explanation:
        "Tom checks the spelling letter by letter: 'W-H-I-T-F-I-E-L-D', and Emma confirms 'That's right'. Spelling must be exact in a form-completion question.",
    },
    {
      id: "l2",
      number: 2,
      kind: "text",
      typeLabel: "Form completion",
      prompt: "Annual membership fee: £ ______",
      acceptedAnswers: ["45", "£45", "forty-five"],
      wordLimit: 2,
      explanation:
        "Fifty pounds is the old price — a distractor. Tom says the committee 'reduced it in January, so it's now forty-five pounds for the year'.",
    },
    {
      id: "l3",
      number: 3,
      kind: "text",
      typeLabel: "Form completion",
      prompt: "Walks meet outside the ______ on Market Street",
      acceptedAnswers: ["library"],
      wordLimit: 2,
      explanation:
        "The railway station is where the club 'used to gather'. The current meeting point is 'outside the library on Market Street'.",
    },
    {
      id: "l4",
      number: 4,
      kind: "text",
      typeLabel: "Form completion",
      prompt: "Length of this Saturday's walk: approximately ______ km",
      acceptedAnswers: ["12", "twelve"],
      wordLimit: 1,
      explanation:
        "Eight kilometres is the length of the regular walks. This Saturday's walk to Ashford is 'roughly twelve kilometres'.",
    },
    {
      id: "l5",
      number: 5,
      kind: "radio",
      typeLabel: "Multiple choice",
      prompt: "What does Tom say Emma must bring on Saturday?",
      options: [
        { value: "A", label: "a packed lunch" },
        { value: "B", label: "a waterproof jacket" },
        { value: "C", label: "walking poles" },
      ],
      acceptedAnswers: ["B"],
      explanation:
        "All three items are mentioned. The lunch is optional ('unless you want to') and the poles are 'not really necessary'; the only thing Tom 'would insist on is a waterproof jacket'.",
    },
  ],
};
