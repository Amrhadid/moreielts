import type { ItemGroup, Question, QuestionOption, QuestionTypeCode, Section } from "../../../../src/types/content";

/**
 * General Training Reading: 40 questions, 60 minutes.
 * Section 1 = two everyday texts, Section 2 = one workplace text,
 * Section 3 = one longer general-interest passage.
 */

function gap(
  number: number,
  type: QuestionTypeCode,
  prompt: string,
  answers: string[],
  explanation: string,
  wordLimit = 2,
): Question {
  return { id: `r-q${number}`, number, type, prompt, acceptedAnswers: answers, wordLimit, explanation };
}

function pick(
  number: number,
  type: QuestionTypeCode,
  prompt: string,
  options: QuestionOption[],
  answer: string,
  explanation: string,
): Question {
  return { id: `r-q${number}`, number, type, prompt, options, acceptedAnswers: [answer], explanation };
}

function letters(labels: string[]): QuestionOption[] {
  return labels.map((label, i) => ({
    value: String.fromCharCode(65 + i),
    label: `${String.fromCharCode(65 + i)}. ${label}`,
  }));
}


const TFNG: QuestionOption[] = [
  { value: "TRUE", label: "TRUE" },
  { value: "FALSE", label: "FALSE" },
  { value: "NOT GIVEN", label: "NOT GIVEN" },
];

const STAYS: QuestionOption[] = [
  { value: "A", label: "A. Brook Farm Cottage" },
  { value: "B", label: "B. The Harbour Lofts" },
  { value: "C", label: "C. Pinewood Cabins" },
  { value: "D", label: "D. St Clement's Guesthouse" },
];

const PARAGRAPHS: QuestionOption[] = ["A", "B", "C", "D", "E", "F", "G"].map((v) => ({
  value: v,
  label: `Paragraph ${v}`,
}));

const ENDINGS = letters([
  "because the work required little physical strength.",
  "so that ships could identify the light at night.",
  "since the light could now be checked from far away.",
  "which made the keepers' isolation easier to bear.",
  "although the towers were rarely visited by inspectors.",
  "because keepers were paid according to their results.",
]);

const text1: ItemGroup = {
  id: "rg-1",
  partNumber: 1,
  title: "Section 1 — Route 12 bus: summer timetable changes",
  stimulusKind: "passage",
  instructions:
    "Questions 1-6. Read the notice below and answer the questions. Write NO MORE THAN THREE WORDS AND/OR A NUMBER from the text for each answer.",
  passageText: [
    "VALLEY BUSES — ROUTE 12 (Town Centre to Kingsley Hospital)",
    "Owing to road resurfacing on Station Road, the following changes will apply from Monday 16 June until Friday 25 July.",
    "Diversion: Buses will not stop at the railway station. A temporary stop has been placed outside the post office on Queen Street, a two-minute walk away.",
    "Frequency: Monday to Saturday, buses will run every 20 minutes (normally every 15 minutes) between 7 am and 7 pm, and every hour in the evening. The last bus from the hospital will leave at 10.40 pm. There is no change to the Sunday service.",
    "Fares: Fares are unchanged. Passengers with a monthly pass may also use Route 14 at no extra charge during the works, as it serves the hospital via the ring road.",
    "Accessibility: All Route 12 buses have a ramp and a space for one wheelchair. If you need help boarding, please tell the driver.",
    "Live departure times can be found on the Valley Buses app. For questions, call the customer line on 0800 412 7700 (8 am to 8 pm daily).",
  ].join("\n\n"),
  questions: [
    gap(1, "short_answer", "What is the reason for the changes?", ["road resurfacing"], 'The changes are "Owing to road resurfacing on Station Road."', 3),
    gap(2, "short_answer", "Where is the temporary stop located?", ["the post office", "post office", "Queen Street"], 'The notice says "A temporary stop has been placed outside the post office on Queen Street."', 3),
    gap(3, "short_answer", "How often will buses run during the day on weekdays?", ["every 20 minutes", "20 minutes"], 'Buses "will run every 20 minutes (normally every 15 minutes) between 7 am and 7 pm."', 3),
    gap(4, "short_answer", "At what time does the last bus leave the hospital?", ["10.40 pm", "10.40", "10:40 pm", "10:40"], 'The notice says "The last bus from the hospital will leave at 10.40 pm."', 3),
    gap(5, "short_answer", "Which other route can monthly pass holders use for free?", ["Route 14", "14"], 'Pass holders "may also use Route 14 at no extra charge during the works."', 3),
    gap(6, "short_answer", "Where can passengers find live departure times?", ["Valley Buses app", "the app"], 'The notice says "Live departure times can be found on the Valley Buses app."', 3),
  ],
};

const text2: ItemGroup = {
  id: "rg-2",
  partNumber: 2,
  title: "Section 1 — Holiday accommodation in the Dene Valley",
  stimulusKind: "passage",
  instructions:
    "Questions 7-14. Look at the four advertisements A-D. Which place to stay is described in each statement? Choose the correct letter, A-D. You may use any letter more than once.",
  passageText: [
    "A. Brook Farm Cottage\nA restored stone cottage on a working sheep farm, sleeping up to six. Guests are welcome to help feed the lambs in spring. Well-behaved dogs are allowed for a small extra charge. Minimum stay: one week, Saturday to Saturday. The nearest shop is four miles away, so bring supplies.",
    "B. The Harbour Lofts\nStylish apartments for two above a former fish market, just a minute from the beach and the town's restaurants. No car needed: the train station is a short walk away. Sorry, no pets or children under twelve. Stays from two nights.",
    "C. Pinewood Cabins\nWooden cabins in a quiet forest, each with its own hot tub. A shared games room and a children's play area make this ideal for families. Bicycles can be hired on site. Breakfast hampers are delivered to your door each morning for an extra fee.",
    "D. St Clement's Guesthouse\nA family-run guesthouse in the old town with eight en-suite rooms. A full cooked breakfast is included in every booking. Our owners have lived in the valley all their lives and are happy to plan walking routes for guests. Private parking for four cars only; please reserve a space.",
  ].join("\n\n"),
  questions: [
    pick(7, "matching_information", "Guests can bring their pets for an additional cost.", STAYS, "A", 'At Brook Farm "Well-behaved dogs are allowed for a small extra charge."'),
    pick(8, "matching_information", "Guests can reach it easily without a car.", STAYS, "B", 'The Harbour Lofts say "No car needed: the train station is a short walk away."'),
    pick(9, "matching_information", "The price includes a morning meal.", STAYS, "D", 'At St Clement\'s "A full cooked breakfast is included in every booking."'),
    pick(10, "matching_information", "Guests can take part in farm activities.", STAYS, "A", 'At Brook Farm "Guests are welcome to help feed the lambs in spring."'),
    pick(11, "matching_information", "Guests must stay for at least seven nights.", STAYS, "A", 'Brook Farm has a "Minimum stay: one week, Saturday to Saturday."'),
    pick(12, "matching_information", "Young children cannot stay here.", STAYS, "B", 'The Harbour Lofts say "no pets or children under twelve."'),
    pick(13, "matching_information", "Guests can get help planning walks.", STAYS, "D", 'The owners "are happy to plan walking routes for guests."'),
    pick(14, "matching_information", "Cycles are available to rent.", STAYS, "C", 'At Pinewood "Bicycles can be hired on site."'),
  ],
};

const text3: ItemGroup = {
  id: "rg-3",
  partNumber: 3,
  title: "Section 2 — Marlow & Finch: flexible working policy",
  stimulusKind: "passage",
  instructions:
    "Questions 15-21. Read the policy below. Do the following statements agree with the information given? Write TRUE, FALSE or NOT GIVEN.",
  passageText: [
    "Marlow & Finch recognises that flexible working can help employees balance their work with other responsibilities. This policy explains the options available and how to apply.",
    "Who can apply: Any employee who has completed their six-month probation period may make a request. Employees may make one request in any twelve-month period.",
    "Options available: Depending on the needs of the team, employees may request compressed hours (working full-time hours over four days), part-time hours, or hybrid working, where up to three days a week may be spent working from home. Staff in customer-facing roles at our branches are not eligible for hybrid working, but may apply for the other options.",
    "Core hours: All staff working flexibly must be available between 10 am and 3 pm on their working days, so that meetings can be arranged.",
    "How to apply: Complete the request form on the staff intranet and send it to your line manager, who will arrange a meeting with you within two weeks. You may bring a colleague to this meeting if you wish. A decision will be given in writing within one month of your application.",
    "Trial periods: Most new arrangements begin with a three-month trial. At the end of the trial, you and your manager will review whether the arrangement is working.",
    "If your request is refused: You may appeal to the HR department within ten working days of receiving the decision. The appeal will be heard by a manager from a different department.",
    "Equipment: Employees approved for hybrid working will be provided with a laptop and headset. The company does not pay for home internet costs.",
  ].join("\n\n"),
  questions: [
    pick(15, "true_false_notgiven", "New employees can apply for flexible working in their first month.", TFNG, "FALSE", 'The policy says "Any employee who has completed their six-month probation period may make a request."'),
    pick(16, "true_false_notgiven", "Employees can make two requests per year.", TFNG, "FALSE", 'The policy says "Employees may make one request in any twelve-month period."'),
    pick(17, "true_false_notgiven", "Branch staff who deal with customers can request part-time hours.", TFNG, "TRUE", 'Customer-facing staff "are not eligible for hybrid working, but may apply for the other options", which include part-time hours.'),
    pick(18, "true_false_notgiven", "Flexible workers must be available from 10 am to 3 pm.", TFNG, "TRUE", 'Staff "must be available between 10 am and 3 pm on their working days."'),
    pick(19, "true_false_notgiven", "Most requests are approved.", TFNG, "NOT GIVEN", 'The policy says "A decision will be given in writing within one month" but gives no figure for how many are approved.'),
    pick(20, "true_false_notgiven", "Appeals are heard by the employee's own line manager.", TFNG, "FALSE", 'The appeal "will be heard by a manager from a different department."'),
    pick(21, "true_false_notgiven", "Hybrid workers receive money towards their internet bills.", TFNG, "FALSE", 'The policy says "The company does not pay for home internet costs."'),
  ],
};

const text4: ItemGroup = {
  id: "rg-4",
  partNumber: 4,
  title: "Section 2 — First Aid at Work: course information for staff",
  stimulusKind: "passage",
  instructions:
    "Questions 22-27. Complete the notes below. Write ONE WORD ONLY from the text for each answer.",
  passageText: [
    "Every workplace with more than 25 employees must have at least one trained first-aider on site during working hours. To meet this requirement, we are inviting volunteers to attend a First Aid at Work course, paid for by the company.",
    "The course lasts three days and is delivered at the Riverside Training Centre by qualified paramedics. It combines short classroom sessions with practical exercises, using life-size models to practise techniques such as resuscitation. No previous experience is needed, but participants should be reasonably fit, as some exercises involve kneeling for long periods.",
    "At the end of the course, participants take a practical assessment. There is no written examination. Those who pass receive a certificate, which is valid for three years. Before it expires, first-aiders must attend a two-day refresher course to keep their qualification.",
    "Staff who become first-aiders receive an extra payment of £300 a year, added to their salary in monthly instalments. They will also be given a green badge so that colleagues can easily identify them.",
    "Lunch is provided on each day of the course. Please wear comfortable clothing. If you would like to take part, email the Health and Safety Officer, Grace Nwosu, before the end of the month. Places are limited to twelve per course.",
  ].join("\n\n"),
  questions: [
    gap(22, "note_completion", "Course length: three ______", ["days"], 'The text says "The course lasts three days."', 1),
    gap(23, "note_completion", "Trainers: qualified ______", ["paramedics"], 'The course "is delivered ... by qualified paramedics."', 1),
    gap(24, "note_completion", "Participants practise on life-size ______", ["models"], 'Exercises use "life-size models to practise techniques such as resuscitation."', 1),
    gap(25, "note_completion", "Assessment: practical only, no written ______", ["examination", "exam"], 'The text says "There is no written examination."', 1),
    gap(26, "note_completion", "Before the certificate expires, attend a ______ course", ["refresher"], 'First-aiders "must attend a two-day refresher course to keep their qualification."', 1),
    gap(27, "note_completion", "First-aiders wear a green ______", ["badge"], 'They "will also be given a green badge so that colleagues can easily identify them."', 1),
  ],
};

const text5: ItemGroup = {
  id: "rg-5",
  partNumber: 5,
  title: "Section 3 — The last lighthouse keepers",
  stimulusKind: "passage",
  instructions:
    "Questions 28-40. Read the passage below. Questions 28-33: which paragraph, A-G, contains the following information? You may use any letter more than once. Questions 34-37: complete each sentence with the correct ending, A-F. Questions 38-40: answer the questions using NO MORE THAN TWO WORDS from the passage.",
  passageText: [
    "A. For centuries, the lighthouse keeper was one of the most romantic figures of the coast. Living alone or with a small crew on a rock far out at sea, the keeper's job was to make sure that the light never went out. Today that figure has almost vanished. In Britain, the last lighthouse to be staffed by keepers was converted to automatic operation in 1998, and similar changes have taken place around the world. Yet the history of the keepers tells us a great deal about work, technology and isolation. It is also a history that survives largely in the memories of a few hundred people, many of them now elderly, and in the logbooks they left behind.",
    "B. The earliest lights were simply fires, lit on hilltops or towers near dangerous rocks or harbour entrances. Keeping such a fire burning through a stormy night required huge quantities of wood or coal, and the work was exhausting. By the eighteenth century, candles and then oil lamps had replaced open fires, and a lighthouse could be run by a much smaller team. The invention of the Fresnel lens in the 1820s, which concentrated light into a powerful beam, meant that a relatively small flame could be seen more than twenty miles away.",
    "C. Each lighthouse was given its own pattern of flashes, so that ships could identify the light at night and work out exactly where they were. Keeping that pattern accurate was the keeper's most important duty. Clockwork machinery turned the lens, and it had to be wound by hand every few hours. Keepers also cleaned the glass, trimmed the wicks and kept a detailed log of the weather and passing ships.",
    "D. Life on an offshore lighthouse was strictly organised. A typical station had three keepers, who worked in shifts so that one was always on watch. They spent several weeks on the rock followed by a shorter period ashore with their families. Supplies arrived by boat, but in bad weather the relief boat might be delayed for weeks, and keepers sometimes ran low on food. Many kept small gardens, fished or baked their own bread. Rules were strict: keepers could be dismissed for neglecting the light, and inspectors made surprise visits to check that the brass was polished and the logbook up to date. Relations between the men mattered enormously, since three people sharing a narrow tower for weeks had little chance of avoiding one another after a disagreement.",
    "E. Isolation was the greatest challenge. Accounts written by former keepers describe long periods of boredom broken by moments of danger, when waves broke over the tower. Some found the solitude difficult, and there are records of keepers who became ill from the strain. Others valued it. Many took up hobbies, such as painting, model-making or playing musical instruments, which made the keepers' isolation easier to bear. Radio, when it arrived, was welcomed as a link with the mainland. Families ashore would sometimes send messages through local radio programmes, and keepers listened eagerly for news from home.",
    "F. The job was also surprisingly well suited to people from different backgrounds. In the early days it was often passed from father to son, and keepers' wives frequently took on duties at shore stations. Because the work required little physical strength once oil lamps had replaced fires, some stations were run by women for many years, a rare opportunity at the time. Several became well known for their courage in rescuing sailors from wrecks.",
    "G. Automation came gradually. Electric lamps, which could be switched on and off by a light-sensitive switch, removed the need to tend a flame. Later, remote monitoring meant that a single control centre could watch over dozens of lights, since the light could now be checked from far away. Today, many former lighthouses are museums or holiday homes, and their lights are maintained by technicians who visit only a few times a year. Some people regret the loss of the keepers, arguing that a person on watch could also raise the alarm when a ship was in trouble. But few doubt that the change was inevitable. Automated lights are cheaper to run, they do not need relief boats, and modern satellite navigation means that most ships now rely on lighthouses far less than they once did. What remains is a remarkable record, kept in logbooks, letters and photographs, of a way of life that lasted for more than two hundred years and then disappeared within a single generation.",
  ].join("\n\n"),
  questions: [
    pick(28, "matching_information", "the date when the last staffed lighthouse in Britain was automated", PARAGRAPHS, "A", 'Paragraph A says "the last lighthouse to be staffed by keepers was converted to automatic operation in 1998."'),
    pick(29, "matching_information", "a reference to keepers running short of food", PARAGRAPHS, "D", 'Paragraph D says "keepers sometimes ran low on food" when the relief boat was delayed.'),
    pick(30, "matching_information", "an invention that made a small flame visible over a long distance", PARAGRAPHS, "B", 'Paragraph B says the Fresnel lens "meant that a relatively small flame could be seen more than twenty miles away."'),
    pick(31, "matching_information", "a list of tasks that keepers carried out", PARAGRAPHS, "C", 'Paragraph C lists that keepers "cleaned the glass, trimmed the wicks and kept a detailed log."'),
    pick(32, "matching_information", "the current uses of some old lighthouse buildings", PARAGRAPHS, "G", 'Paragraph G says "many former lighthouses are museums or holiday homes."'),
    pick(33, "matching_information", "an argument against removing the keepers", PARAGRAPHS, "G", 'Paragraph G says some argue "that a person on watch could also raise the alarm when a ship was in trouble."'),
    pick(34, "matching_sentence_endings", "Each lighthouse had its own pattern of flashes", ENDINGS, "B", 'Paragraph C: each lighthouse had its own pattern "so that ships could identify the light at night."'),
    pick(35, "matching_sentence_endings", "Hobbies such as painting were common", ENDINGS, "D", 'Paragraph E says hobbies "made the keepers\' isolation easier to bear."'),
    pick(36, "matching_sentence_endings", "Women were able to run some stations", ENDINGS, "A", 'Paragraph F says "the work required little physical strength once oil lamps had replaced fires."'),
    pick(37, "matching_sentence_endings", "One control centre could look after many lights", ENDINGS, "C", 'Paragraph G says this was possible "since the light could now be checked from far away."'),
    gap(38, "short_answer", "What turned the lens in early lighthouses?", ["clockwork machinery", "clockwork"], 'Paragraph C says "Clockwork machinery turned the lens."'),
    gap(39, "short_answer", "How many keepers worked at a typical offshore station?", ["three", "3"], 'Paragraph D says "A typical station had three keepers."'),
    gap(40, "short_answer", "What was welcomed as a connection with the mainland?", ["radio"], 'Paragraph E says "Radio, when it arrived, was welcomed as a link with the mainland."'),
  ],
};

export const readingSection: Section = {
  code: "reading",
  title: "Reading",
  durationMinutes: 60,
  questionCount: 40,
  itemGroups: [text1, text2, text3, text4, text5],
};
