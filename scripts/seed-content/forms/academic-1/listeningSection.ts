import type { ItemGroup, Question, QuestionTypeCode, Section } from "../../../../src/types/content";

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

const TRANSCRIPT_1 = `RECEPTIONIST: Good morning, Riverside Community Sports Centre, Ellie speaking. How can I help you?
JAMES: Oh, hello. I'm thinking of joining the centre, and I wanted to ask a few questions before I sign up.
RECEPTIONIST: Of course. I can take your details now and register you over the phone, if you like. Could I start with your name?
JAMES: Yes, it's James Whitcombe.
RECEPTIONIST: Could you spell the surname for me, please?
JAMES: Sure. It's W-H-I-T-C-O-M-B-E. People often put an "a" in it, but there isn't one.
RECEPTIONIST: Whitcombe. Thank you. And what kind of membership were you thinking of? We have full membership, which lets you come in at any time, and off-peak, which covers weekdays before four o'clock and all day at weekends.
JAMES: I did look at the full membership, but I work from home most days, so I can come in during the day. I think off-peak membership would suit me better.
RECEPTIONIST: Off-peak it is. And when would you like your membership to start?
JAMES: I was going to say the first of March, but I'm away that week visiting my parents. So could we make it the fourteenth?
RECEPTIONIST: The fourteenth of March. No problem at all. Now, the monthly fee for off-peak membership is thirty-two pounds fifty. Full membership is forty-five pounds, just so you can compare.
JAMES: Thirty-two fifty is fine. Is there a joining fee as well? A friend of mine said he had to pay something extra when he joined.
RECEPTIONIST: Normally there's a joining fee of twenty pounds, but it's waived if you pay by direct debit. If you pay by card each month, or pay for the whole year up front, then the fee still applies, I'm afraid.
JAMES: Well, direct debit is the easiest for me anyway, so I'll do that.
RECEPTIONIST: Lovely. Would you like to know our opening hours?
JAMES: Yes, please. I know you open quite early during the week.
RECEPTIONIST: That's right. Monday to Friday we're open from six in the morning until ten at night. On Saturdays we close at eight in the evening, and on Sundays the centre closes at 6 pm.
JAMES: Six on Sundays. OK, that's useful to know. And what about classes? I saw on your website that there's a yoga class on Tuesdays.
RECEPTIONIST: There was, but yoga moved to Thursdays this term. On Tuesdays we now have circuit training first thing in the morning, and then a badminton class in the early afternoon, which falls within your off-peak hours.
JAMES: Circuit training sounds a bit intense for me. I'd be more interested in the badminton class, actually. I used to play a lot at school.
RECEPTIONIST: It's very popular, so that brings me to booking. All our classes have to be booked in advance, either through the app or here at the desk.
JAMES: How far ahead do I need to book? Twenty-four hours?
RECEPTIONIST: It used to be twenty-four hours, but too many people were booking and then not turning up. So now classes must be booked 48 hours in advance. And if you cancel with less than a day's notice, you lose that class credit.
JAMES: Fair enough. What about parking? I'll probably drive most of the time.
RECEPTIONIST: There's a car park behind the main building. Parking is free for members, but only for 90 minutes. After that it's one pound an hour. You might see a sign saying two hours, but that's out of date and we're replacing it next week.
JAMES: Ninety minutes should be plenty for me.
RECEPTIONIST: Finally, every new member has an induction appointment with one of our instructors, who shows you how to use the equipment safely. Could you come in on the fourteenth at ten o'clock?
JAMES: Ten is perfect.
RECEPTIONIST: Let me see who's available that morning. Sarah is working, but she's fully booked, so I'll put you with Marco. That's Marco Silva. He'll meet you at reception.
JAMES: Marco. Great. Do I need to bring anything with me?
RECEPTIONIST: Just some photo identification and a pair of indoor trainers. We'll email you a confirmation of everything we've discussed today.
JAMES: Brilliant. Thanks very much for your help, Ellie.
RECEPTIONIST: You're welcome, Mr Whitcombe. See you on the fourteenth. Goodbye.`;

const TRANSCRIPT_2 = `HELEN: Good evening, everyone, and welcome to the Depot Arts Centre. My name's Helen Carter, and I'm the centre manager. I'm going to give you a short introduction to the building and what goes on here, and then you're welcome to look around.
HELEN: First, a little history. A lot of visitors assume the building was once a school, because of the tall windows, and some older residents remember the public swimming baths, although those were actually on the other side of the road. In fact, the building was built in 1892 as a railway depot, where steam engines were brought in for repair. It closed in the nineteen sixties, stood empty for many years, and was converted into an arts centre in 2005. You can still see the original rails set into the floor of the main hall.
HELEN: Now, a word about when we're busy. You might expect weekday evenings to be our busiest time, when people come in after work, and they certainly are busy. Weekday mornings and Sunday mornings are fairly quiet. But by far our busiest period is Saturday afternoons, when the family workshops run alongside the regular classes, so if you'd like a quieter visit, avoid those.
HELEN: Membership costs sixty pounds a year. Students with a valid card can get 15 per cent off course fees without joining, and when the scheme started members got 10 per cent off. However, these days members receive a discount of 20 per cent on all courses, workshops and performance tickets, so it pays for itself very quickly.
HELEN: If you're completely new to art or craft, you may be wondering where to start. We run a taster weekend twice a year, and there are online tutorials on our website, and of course our tutors offer private lessons, though those are quite expensive. But my advice to newcomers is always to start with the drop-in session on Wednesday afternoons. You don't need to book, all materials are provided, and you can try a different activity every week.
HELEN: Let me tell you where things are. When you come through the main entrance, reception is directly in front of you. The lockers at reception are quite small, so if you have large bags, please leave them in the equipment store, where there's plenty of space and it's locked at all times. Studio 1 is the large room with the skylights, and that's where we hold the exhibition of members' work, which changes every month. Studio 2 is mainly used for dance and pottery. And in summer we hold the evening performances outdoors, on the outdoor court, weather permitting, of course. If it rains, they move into the café.
HELEN: Now, if you'd like to look at the site plan in your welcome pack, I'll show you how to find these places. You're standing at the main entrance, at the bottom of the plan. The building just north of the entrance is the equipment store, so that's the first one you'll pass. If you walk straight across the courtyard, the building on the far side is the café, which serves lunch until three. And finally, if you follow the path round to the left, the building beside the car park houses the changing rooms, with showers for anyone attending the dance classes.
HELEN: Right, that's all from me. Please do explore, and if you have any questions, the staff at reception will be happy to help.`;

const TRANSCRIPT_3 = `TOMAS: Hi, Priya. Have you had a chance to look at the data from the last site visit?
PRIYA: I have, and I'm a bit worried, Tomas. It's not that we haven't got enough recordings. We've got plenty. The problem is that the sample is unevenly spread across the sites. Nearly two-thirds of the recordings come from the woodland site, and hardly any from the meadow.
TOMAS: Right. I don't think visiting extra sites would help, and we can't extend the survey period because the deadline's fixed. What if we pooled our data with another group? Ana's group recorded at the meadow on the same days, and they said they'd be happy to share.
PRIYA: Pooling our data with Ana's group would definitely even things out. Let's ask her today.
DR WHITFIELD: Good morning, both of you. Sorry I'm late.
PRIYA: Morning, Dr Whitfield. We were just talking about the sample.
DR WHITFIELD: Good, because I wanted to talk about your first draft. The literature review is a little long, but that's easily fixed, and the photographs are lovely. My main objection is the absence of a control site. Without one, you can't show that the changes you recorded have anything to do with the road.
TOMAS: We did think the statistical test might be the problem.
DR WHITFIELD: No, the test is fine. It's the control site that's missing. That's why I arranged access to the second site, the nature reserve. I spoke to the warden last week, and you can go in whenever you like.
PRIYA: That's brilliant, thank you. What should we do with the fieldwork diary? We weren't sure whether to summarise it in the introduction or leave it out.
DR WHITFIELD: Don't rewrite it as a narrative, and please don't leave it out. Examiners like to see it.
TOMAS: So we agree it should be submitted as an appendix?
PRIYA: Yes, as an appendix. That keeps the main report short.
DR WHITFIELD: Good. Now, how did the recording equipment behave?
TOMAS: Not brilliantly. The memory cards were fine, and the tripod was easy to mount. But the battery life was terrible in the cold conditions. On the frosty mornings the batteries died after about an hour.
PRIYA: And the other problem was background noise from the road. On some recordings you can hardly hear the birds over the lorries. We thought the microphone cable was faulty at first, but it turned out to be fine.
DR WHITFIELD: So what will you change before the next visit?
PRIYA: Well, we'll start recording earlier in the day, before the traffic builds up. We considered shortening each recording session, but then we'd lose data.
TOMAS: And we'll borrow a windshield for the microphone from the media department. That should cut some of the noise. We don't need a second observer, and we're definitely keeping the same site.
DR WHITFIELD: Sensible. Let's just check who is doing what. Remind me who proposed the original research question?
TOMAS: That was Priya. She came up with it in the first week.
PRIYA: True, it was my idea. And Tomas will write the methodology section, because he set up all the equipment.
TOMAS: Yes, I'll do the methodology. And we know Dr Whitfield arranged access to the second site.
DR WHITFIELD: I did. And who's responsible for the final proofread?
TOMAS: I offered, but my spelling is awful.
PRIYA: I'll do the final proofread, then. I'm responsible for that.
DR WHITFIELD: Excellent. Send me the next draft by the end of the month.`;

const TRANSCRIPT_4 = `LECTURER: Good morning. Today I want to look at something we all take for granted: the idea that everyone in a country shares the same time.
LECTURER: Before the railways, each town kept its own local time, set by the position of the sun. When the sun was at its highest point, it was noon, and the church clock was adjusted accordingly. Because the sun reaches its highest point later as you travel west, towns only a short distance apart kept different times. In England, the difference between two towns could be as much as twenty minutes. Bristol, for example, was about ten minutes behind London, and towns in the far west were further behind still.
LECTURER: For most people, this hardly mattered, since nobody could travel fast enough to notice. The railways changed that. A traveller arriving in a town by train could find the station clock showing a different time from the one at the departure station, and missed connections were common. So the railway companies began to publish their timetables using a single standard time, which in practice meant London time, taken from the observatory at Greenwich.
LECTURER: This was not universally welcomed. Opposition came mainly from local councils, who saw the change as interference by private companies in matters that were properly theirs to decide. Some refused for years to alter their public clocks, and a few famously displayed two minute hands, one for local time and one for railway time. Critics described the change as a loss of local identity, which suggests how closely people associated the time with the place they lived.
LECTURER: Let's look at some key dates, which you'll find in the table in your handout. In 1840, the Great Western Railway became the first company to adopt standard time across its network. Other companies soon followed, and by the mid-1850s the great majority of public clocks in Britain showed London time. However, the law did not catch up until 1880, when standard time was finally given legal force in Britain. Before that, a court could still rule that an appointment set for ten o'clock meant ten o'clock local time.
LECTURER: Finally, I want to explain how the correct time actually reached the stations, which is shown in the flow-chart. The first step was carried out by astronomers, who determined the reference meridian by observing the stars as they crossed it. This gave them an exact measurement of noon. In the second step, the time signal was distributed by telegraph, along the wires that ran beside the railway lines, to the major stations. And in the third and final step, the station masters reset the platform clock each morning when the signal arrived, so that every train was running to the same time.
LECTURER: Next week, we'll see how this system was extended internationally, with the creation of time zones.`;

const part1: ItemGroup = {
  id: "lg-1",
  partNumber: 1,
  title: "Part 1 — Enquiry about a community sports centre",
  stimulusKind: "audio",
  transcript: TRANSCRIPT_1,
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
  transcript: TRANSCRIPT_2,
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
  transcript: TRANSCRIPT_3,
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
  transcript: TRANSCRIPT_4,
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

const EXPLANATIONS: Record<number, string> = {
  1: 'The caller gives his name and spells it: "It\'s W-H-I-T-C-O-M-B-E."',
  2: 'He rejects full membership because he works from home: "I think off-peak membership would suit me better."',
  3: 'The first of March is ruled out because he is away: "could we make it the fourteenth?"',
  4: 'The receptionist states: "the monthly fee for off-peak membership is thirty-two pounds fifty." The £45 figure is for full membership.',
  5: 'The joining fee "is waived if you pay by direct debit"; paying by card still incurs it.',
  6: 'Saturday closing is eight, but "on Sundays the centre closes at 6 pm."',
  7: 'Yoga has moved to Thursdays; on Tuesdays there is "a badminton class in the early afternoon", and James says "I\'d be more interested in the badminton class."',
  8: 'The old 24-hour rule changed: "now classes must be booked 48 hours in advance."',
  9: 'The two-hour sign is out of date: "Parking is free for members, but only for 90 minutes."',
  10: 'Sarah is fully booked, "so I\'ll put you with Marco. That\'s Marco Silva."',
  11: 'Despite the school and swimming baths, "the building was built in 1892 as a railway depot."',
  12: 'Weekday evenings are busy, "But by far our busiest period is Saturday afternoons."',
  13: 'The 10% and 15% figures are distractors: "these days members receive a discount of 20 per cent."',
  14: 'Helen says "my advice to newcomers is always to start with the drop-in session."',
  15: '"if you have large bags, please leave them in the equipment store."',
  16: '"Studio 1 ... that\'s where we hold the exhibition of members\' work."',
  17: '"in summer we hold the evening performances outdoors, on the outdoor court."',
  18: '"The building just north of the entrance is the equipment store."',
  19: '"If you walk straight across the courtyard, the building on the far side is the café."',
  20: '"the building beside the car park houses the changing rooms."',
  21: 'Priya says "the sample is unevenly spread across the sites", not that it is too small.',
  22: 'Tomas asks "What if we pooled our data with another group?"',
  23: 'Dr Whitfield says "My main objection is the absence of a control site."',
  24: 'They agree "it should be submitted as an appendix", rejecting summarising or leaving it out.',
  25: 'The problems were "the battery life was terrible in the cold conditions" and "background noise from the road"; the cards, tripod and cable were fine.',
  26: 'They will "start recording earlier in the day" and "borrow a windshield for the microphone."',
  27: 'Asked who proposed the research question, Tomas replies "That was Priya."',
  28: 'Priya says "Tomas will write the methodology section."',
  29: 'Dr Whitfield says "I arranged access to the second site, the nature reserve."',
  30: 'Tomas declines, and Priya says "I\'ll do the final proofread, then."',
  31: 'Each town kept "its own local time, set by the position of the sun."',
  32: '"the difference between two towns could be as much as twenty minutes."',
  33: 'Companies published timetables "using a single standard time, which in practice meant London time."',
  34: '"Opposition came mainly from local councils, who saw the change as interference."',
  35: '"Critics described the change as a loss of local identity."',
  36: '"In 1840, the Great Western Railway became the first company to adopt standard time."',
  37: '"in 1880 ... standard time was finally given legal force in Britain."',
  38: '"astronomers, who determined the reference meridian by observing the stars."',
  39: '"the time signal was distributed by telegraph ... to the major stations."',
  40: '"the station masters reset the platform clock each morning."',
};

for (const group of [part1, part2, part3, part4]) {
  for (const question of group.questions) question.explanation = EXPLANATIONS[question.number];
}

export const listeningSection: Section = {
  code: "listening",
  title: "Listening",
  durationMinutes: 30,
  questionCount: 40,
  itemGroups: [part1, part2, part3, part4],
};
