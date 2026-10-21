import type { ItemGroup, Question, QuestionOption, QuestionTypeCode, Section } from "../../../../src/types/content";

/**
 * Mock Exam 2 — Listening: 4 parts, 40 questions, ~30 minutes. Each part's
 * audio plays once. audioUrl stays unset until audio is generated from the
 * transcripts.
 */

function gap(
  number: number,
  type: QuestionTypeCode,
  prompt: string,
  answers: string[],
  explanation: string,
  wordLimit = 2,
): Question {
  return { id: `l-q${number}`, number, type, prompt, acceptedAnswers: answers, wordLimit, explanation };
}

function letters(labels: string[]): QuestionOption[] {
  return labels.map((label, i) => ({
    value: String.fromCharCode(65 + i),
    label: `${String.fromCharCode(65 + i)}. ${label}`,
  }));
}

function choice(number: number, prompt: string, options: string[], answer: string, explanation: string): Question {
  return {
    id: `l-q${number}`,
    number,
    type: "multiple_choice_single",
    prompt,
    options: letters(options),
    acceptedAnswers: [answer],
    explanation,
  };
}

function multi(number: number, prompt: string, options: string[], answers: string[], explanation: string): Question {
  return {
    id: `l-q${number}`,
    number,
    type: "multiple_choice_multiple",
    prompt,
    options: letters(options),
    acceptedAnswers: answers,
    explanation,
  };
}

function match(
  number: number,
  type: QuestionTypeCode,
  prompt: string,
  options: QuestionOption[],
  answer: string,
  explanation: string,
): Question {
  return { id: `l-q${number}`, number, type, prompt, options, acceptedAnswers: [answer], explanation };
}

const TRANSCRIPT_1 = `OWEN: Good morning, Hollins Hall, Owen speaking. How can I help?
PRIYA: Hello. I'm organising a party for my parents' fortieth wedding anniversary, and a friend said your hall might be suitable. I'd like to make a provisional booking, if that's possible.
OWEN: Of course. Let me open a booking form. Could I have your name first?
PRIYA: It's Priya Ravindran.
OWEN: And how do you spell your surname?
PRIYA: R-A-V-I-N-D-R-A-N.
OWEN: R-A-V-I-N-D-R-A-N. Thanks. And what date were you thinking of?
PRIYA: Their actual anniversary is on the tenth of May, so I was hoping for Saturday the tenth.
OWEN: Let me have a look. I'm afraid the tenth has already gone. There's a wedding in both rooms that day. The following Saturday, the seventeenth, is free, though.
PRIYA: The seventeenth. That should be fine, actually. Several relatives are flying in from abroad, and the extra week will help them. Let's say the seventeenth.
OWEN: Lovely. And how many guests are you expecting?
PRIYA: Well, my first list had about seventy people, but then my mother added all her cousins, so we sent out ninety invitations. So far eighty-five have said yes, and I don't think anyone else will reply now. So eighty-five.
OWEN: Eighty-five. That affects which room you can have. Our Oak Room is lovely, with a wooden floor and a view of the river, but it only holds sixty people seated. With eighty-five you'd need the Garden Room, which takes up to a hundred and twenty.
PRIYA: The Garden Room. Does that have access outside?
OWEN: Yes, there are glass doors that open onto the lawn, so guests can go out in the evening if the weather's good.
PRIYA: That sounds perfect. What's the cost?
OWEN: For a Saturday evening, from six until midnight, the Garden Room is six hundred and fifty pounds. To secure the date we ask for a deposit of two hundred pounds, which is deducted from the final bill.
PRIYA: Two hundred. And when do you need that?
OWEN: Within fourteen days of today. If we don't receive it by then, the provisional booking is cancelled and the date goes back on the system. The balance is due a month before the event.
PRIYA: Fourteen days. That's fine. I'll pay it this week. Now, about food. Do you provide catering, or do we need to bring in our own?
OWEN: We have our own caterers, and we don't allow outside catering, I'm afraid, for insurance reasons. There are two main options: a cold buffet, or a hot buffet, which is more popular for evening events.
PRIYA: The hot buffet, I think. My father always says sandwiches aren't a proper meal. Is there a choice of dishes?
OWEN: There are three main dishes: usually one meat, one fish, and a vegan option. The vegan option is suitable for vegetarians too, of course.
PRIYA: Good, because quite a few of our relatives don't eat meat. And music? We've booked a DJ.
OWEN: That's fine, but because of our licence and the houses nearby, all music must stop at eleven p.m. People sometimes ask for half past eleven, but we can't make any exceptions.
PRIYA: Eleven. Okay, I'll let the DJ know. What about parking? Some of the older guests can't walk very far.
OWEN: Our own car park is small, only about fifteen spaces, and it fills up quickly. But the church car park behind the hall is free in the evenings, and it has around sixty spaces. It's a two-minute walk.
PRIYA: The church car park. I'll put that on the invitations. And can we decorate the room?
OWEN: Yes, you can come in from four o'clock to set up. Balloons and banners are fine, and flowers, of course. The only thing we don't permit is candles, even small ones in jars, because of the fire regulations.
PRIYA: Oh, that's a shame. My sister was planning to put candles on every table.
OWEN: A lot of people use battery-powered lights instead. They look very similar.
PRIYA: Good idea. I'll tell her. Is there anything else I should know?
OWEN: Only that the hall must be cleared by midnight, so ask your DJ to pack up quickly. I'll email you a confirmation now with all the details.
PRIYA: Thank you, Owen. You've been very helpful.`;

const TRANSCRIPT_2 = `GRACE: Good evening, everyone, and thank you all for coming to this briefing. My name's Grace Whitlock and I'm the volunteer coordinator for the Meadowbank Music Festival. Some of you have volunteered with us before, but for many of you this is your first year, so I'll go through the basics and then explain what each team will be doing.
GRACE: A little background first. A lot of people assume the festival started as a student concert, probably because two of the founders were students at the time. In fact, the very first event, in nineteen ninety-four, was a one-day charity concert to raise money for the town's hospital, which was threatened with closure. The hospital survived, and the concert grew into the three-day festival we have today, with around twenty thousand visitors.
GRACE: This year we're staying on the same site, at Meadowbank Farm, so if you've been before you'll know your way around. We did discuss letting the music run later on Saturday night, but the neighbours objected, so it will still finish at eleven. The biggest change this year is that we've banned single-use cups. Every drink will be served in a reusable cup, which visitors pay a two-pound deposit on, and they get the money back when they return it. That's going to mean a lot more work for some of you, as you'll hear.
GRACE: Now, what you get in return. Every volunteer gets a festival T-shirt, which you must wear on shift so that visitors can recognise you. Everyone also gets free meals in the crew canteen while they're working. And if you complete three full shifts, you'll receive a free ticket for next year's festival. That's our way of saying thank you.
GRACE: There are a couple of things you need to bring. Please don't forget photo ID, because you'll need it to collect your wristband, and without a wristband you can't get on site. And bring waterproof clothing. It's been dry all week, but the forecast is uncertain, and you'll be outside for hours. You don't need to bring food, as I've said, and if you're working after dark we'll give you a torch. You don't need a mobile phone either, because supervisors carry radios.
GRACE: A few rules. Visitors will ask you all sorts of questions about the programme, who's playing where and when, and please do answer them. That's a big part of the job. If you want to swap a shift with another volunteer, that's fine too, as long as you tell the volunteer office. But visitors sometimes try to give volunteers money, especially if you've helped them out, and you mustn't accept tips under any circumstances. And if a journalist approaches you, which does happen, please don't speak to them. Send them to the press office instead.
GRACE: Right, the teams. You'll find your team colour on the letter we sent you.
GRACE: The Green team, as you might guess, is mainly about the environment. In previous years you've been picking up litter, but this year, with the new cups, your main job will be collecting cups for reuse, from the bins and from the field, and taking them back to the washing station.
GRACE: The Blue team used to look after the car parks, and some of you have been asking me about that. But we've moved the Blue team this year. You'll be running the information tent by the main entrance, giving out maps and handling lost property.
GRACE: The car parks are now the responsibility of the Orange team. It's a busy job on Friday afternoon, when most people arrive, but much quieter after that.
GRACE: The Purple team will be assisting disabled visitors. That includes running the viewing platform beside the main stage and helping people get to and from the accessible car park. You'll have had some extra training for this already.
GRACE: And finally the Yellow team. In the past, Yellow team volunteers checked tickets at the gates, but that's now done by professional security staff. So this year you'll be helping at the campsite, showing people where to pitch their tents and making sure the fire lanes stay clear.
GRACE: That's everything for now. Your supervisors will meet you at your team points in ten minutes. Thank you again, and enjoy the festival.`;

const TRANSCRIPT_3 = `OKAFOR: Hello, Lucy, Sam. Come in. So, this is our second meeting about your project on bilingual children. How are things going?
LUCY: Quite well, thanks. We've finished testing at the school, so we've got most of the data now.
OKAFOR: Good. Before we go into that, remind me how the project came about. I know Sam speaks two languages at home.
SAM: I do, and people assume that's why we chose it. But actually, it was Lucy's old primary school that got us started.
LUCY: Yes, the head teacher there contacted the department. About a third of their pupils speak another language at home, and some parents had asked whether that might hold their children back. The school wanted someone to look into it, and we volunteered.
OKAFOR: That's a nice practical origin. Now, I've read your literature review. It's thorough, and the length is fine. The studies you've used are mostly recent, too, which is good. My main concern is that nearly all of them are from North America. There's been a lot of research in Europe and Asia, and bilingualism in Canada is quite a different situation from bilingualism here.
SAM: We noticed that, but we weren't sure where to find the others.
OKAFOR: I'll send you a couple of review articles that will point you in the right direction. So, the results. What did you expect to find?
LUCY: Our hypothesis was that the bilingual children would be better at switching between tasks, because they're used to switching between languages.
OKAFOR: And were they?
LUCY: Not exactly. They weren't any faster than the monolingual children, which was a bit disappointing. But they did make noticeably fewer errors on the switching task.
SAM: So it seems they're more accurate rather than quicker.
OKAFOR: That's actually consistent with quite a lot of recent work, so I wouldn't be disappointed. Now, the sample. You tested forty-two children altogether?
SAM: Yes. We know that's quite small.
OKAFOR: For an undergraduate project, forty-two is perfectly respectable. What worries me more is the age range. You've got children from five to eleven in the same group, and a five-year-old and an eleven-year-old are very different on tasks like these. I'd discuss that carefully as a limitation, or even split them into younger and older groups.
LUCY: We could do that. We've got roughly equal numbers in each half.
OKAFOR: Good. Talk me through the procedure, because I want to make sure the method section is clear.
SAM: Okay. First, before any testing, parents filled in a questionnaire about which languages were used at home and how often. That's how we classified the children.
OKAFOR: Did most parents return it?
SAM: Almost all of them, yes. Then we tested each child individually. We were originally given a classroom to work in, but it was next to the music room, and it was far too noisy, so the school let us use the library instead.
OKAFOR: Sensible.
LUCY: The first task was a vocabulary test. We showed the children pictures and asked them to name what they could see. We'd thought about using written words, but the younger children can't read well enough.
SAM: Then came the main task, the card sorting. The children sort cards first by colour, and then we change the rule and they have to sort them by shape. That's the switch we measure.
OKAFOR: And at the end?
LUCY: At the end each child chose a sticker as a reward. We'd wanted to give them sweets, but the school doesn't allow them.
OKAFOR: Fine. That's all very clear. One last thing: who are you going to share the results with first?
SAM: We'd thought about writing something for parents.
LUCY: The school has a newsletter, so that could come later. But the head teacher asked if we'd present the findings to the teachers first, at a staff meeting, so they can decide what to tell parents.
OKAFOR: I think that's the right order. Teachers will have the best sense of how to explain it. Well, you're in good shape. Send me the revised literature review by the end of the month.
LUCY: We will. Thanks, Dr Okafor.`;

const TRANSCRIPT_4 = `LECTURER: This afternoon I want to talk about one of the most remarkable journeys in the animal world: the autumn migration of the monarch butterfly in North America. Every year, millions of these orange and black butterflies fly from Canada and the northern United States to a small area of mountain forest in central Mexico, a journey of up to four thousand kilometres.
LECTURER: What makes this migration so extraordinary is not just the distance but the fact that no individual butterfly makes the round trip. A monarch that hatches in summer normally lives for only a few weeks. But the generation that emerges in late summer is different. These butterflies delay reproduction, and they can live for up to eight months. It's this long-lived generation that flies south. In spring, they begin the journey north, but they breed on the way and die, and it takes three or four generations to get back to Canada. So the butterflies that arrive in Mexico each autumn have never been there before. Their great-grandparents were the last to make the trip.
LECTURER: How, then, do they find their way? For a long time it was assumed that they used landmarks, such as mountain ranges and coastlines. But experiments have shown that the main tool is the sun. Monarchs have what's called a time-compensated sun compass. Because the sun moves across the sky during the day, a butterfly needs to know the time in order to use it for direction, and it does this with a body clock located, surprisingly, in its antennae. When researchers painted the antennae of migrating monarchs with black paint, blocking the light, the butterflies lost their sense of direction.
LECTURER: On cloudy days, when the sun isn't visible, monarchs appear to rely on a second system: they can sense the Earth's magnetic field. This was shown in flight simulators, in which butterflies changed direction when the magnetic field was reversed. However, this magnetic compass only works when the butterflies are exposed to a particular kind of ultraviolet light, which is why it's thought to act as a backup rather than the main system.
LECTURER: Once they arrive in Mexico, the monarchs gather in huge clusters on the trunks and branches of oyamel fir trees, at altitudes of around three thousand metres. A single hectare of forest can hold tens of millions of butterflies. The conditions there are ideal: cool enough that the butterflies use very little energy, but not so cold that they freeze. The trees act like a blanket and protect them from rain and frost.
LECTURER: Let's turn now to the threats. The number of monarchs reaching Mexico has fallen dramatically since the nineteen nineties. Scientists measure the population not by counting butterflies, which would be impossible, but by measuring the area of forest they cover. In the winter of nineteen ninety-six, the colonies covered about eighteen hectares. In recent years, it's often been under three.
LECTURER: The causes are debated, but several factors are clear. The most important is probably the loss of milkweed, the only plant on which monarch caterpillars can feed. Milkweed used to grow widely among crops in the American Midwest, but the use of herbicides on farmland has removed much of it. Logging in the Mexican forests has also been a problem, although protection has improved since a reserve was established there. And climate change brings more extreme weather. A single severe storm in two thousand and two killed an estimated eighty per cent of the butterflies in two of the largest colonies.
LECTURER: So what's being done? One of the most effective measures has been encouraging people to plant milkweed in gardens, schools and along roadsides. In Mexico, local communities are paid to protect the forest rather than cut it down, and tourism brings in money too, as visitors come to see the colonies in winter. And thousands of volunteers help scientists by attaching tiny tags to the butterflies' wings, which allows their routes to be traced when they're found again.
LECTURER: In the next session, we'll compare the monarch with other insect migrations, including the painted lady butterfly, which crosses the Sahara.`;

const part1: ItemGroup = {
  id: "lg-1",
  partNumber: 1,
  title: "Part 1 — Booking a hall for an anniversary party",
  stimulusKind: "audio",
  transcript: TRANSCRIPT_1,
  instructions:
    "Questions 1-10. Complete the booking form (Questions 1-6) and the table of arrangements (Questions 7-10). Write ONE WORD AND/OR A NUMBER for each answer.",
  questions: [
    gap(1, "note_completion", "Name: Priya ______", ["Ravindran"], `She spells it: "R-A-V-I-N-D-R-A-N."`),
    gap(2, "note_completion", "Date of party: Saturday ______ May", ["17th", "17", "seventeenth"], `"the tenth has already gone", so "Let's say the seventeenth."`),
    gap(3, "note_completion", "Number of guests: ______", ["85", "eighty-five"], `Seventy were planned and ninety invited, but "So far eighty-five have said yes".`),
    gap(4, "note_completion", "Room: the ______ Room", ["Garden"], `The Oak Room "only holds sixty people seated", so "you'd need the Garden Room".`),
    gap(5, "note_completion", "Deposit: £______", ["200"], `"we ask for a deposit of two hundred pounds".`),
    gap(6, "note_completion", "Deposit must be paid within ______ days", ["14", "fourteen"], `"Within fourteen days of today."`),
    gap(7, "table_completion", "Food — hot buffet: one meat, one fish and one ______ dish", ["vegan"], `"usually one meat, one fish, and a vegan option."`),
    gap(8, "table_completion", "Music — must stop at ______ p.m.", ["11", "eleven"], `"all music must stop at eleven p.m." Half past eleven is refused.`),
    gap(9, "table_completion", "Parking — free in the ______ car park behind the hall", ["church"], `The hall's own car park is small, "But the church car park behind the hall is free in the evenings".`),
    gap(10, "table_completion", "Decorations — ______ are not permitted", ["candles"], `"The only thing we don't permit is candles".`),
  ],
};

const TEAM_TASKS = letters([
  "checking tickets at the gates",
  "collecting cups for reuse",
  "running the information tent",
  "managing the car parks",
  "helping at the campsite",
  "assisting disabled visitors",
  "selling programmes",
]);

const part2: ItemGroup = {
  id: "lg-2",
  partNumber: 2,
  title: "Part 2 — Briefing for music festival volunteers",
  stimulusKind: "audio",
  transcript: TRANSCRIPT_2,
  instructions:
    "Questions 11-20. For Questions 11-13, choose the correct letter, A, B or C. For Questions 14-15, choose TWO letters, A-E. For Questions 16-20, what task will each team do? Choose the correct letter, A-G.",
  questions: [
    choice(11, "The festival was first held as", ["a charity concert for a hospital", "a student concert", "a three-day event on a farm"], "A", `"the very first event, in nineteen ninety-four, was a one-day charity concert to raise money for the town's hospital".`),
    choice(12, "What is the most significant change this year?", ["The festival has moved to a new site.", "Single-use cups are no longer allowed.", "The music will finish later on Saturday."], "B", `The site is the same and the late finish was rejected; "The biggest change this year is that we've banned single-use cups."`),
    choice(13, "Volunteers who complete three shifts will receive", ["a festival T-shirt", "free meals", "a ticket for next year"], "C", `T-shirts and meals are for everyone; "if you complete three full shifts, you'll receive a free ticket for next year's festival."`),
    multi(14, "Which TWO things must volunteers bring? Choose TWO letters.", ["photo ID", "waterproof clothing", "their own food", "a torch", "a mobile phone"], ["A", "B"], `"Please don't forget photo ID" and "bring waterproof clothing." Food and torches are provided, and "You don't need a mobile phone".`),
    multi(15, "Which TWO things are volunteers told NOT to do? Choose TWO letters.", ["answer questions about the programme", "accept tips from visitors", "speak to journalists", "swap shifts with other volunteers", "wear their T-shirt off duty"], ["B", "C"], `"you mustn't accept tips under any circumstances" and if a journalist approaches, "please don't speak to them."`),
    match(16, "matching_features", "Green team", TEAM_TASKS, "B", `"your main job will be collecting cups for reuse".`),
    match(17, "matching_features", "Blue team", TEAM_TASKS, "C", `They "used to look after the car parks", but now "You'll be running the information tent by the main entrance".`),
    match(18, "matching_features", "Orange team", TEAM_TASKS, "D", `"The car parks are now the responsibility of the Orange team."`),
    match(19, "matching_features", "Purple team", TEAM_TASKS, "F", `"The Purple team will be assisting disabled visitors."`),
    match(20, "matching_features", "Yellow team", TEAM_TASKS, "E", `Ticket checks are "now done by professional security staff. So this year you'll be helping at the campsite".`),
  ],
};

const part3: ItemGroup = {
  id: "lg-3",
  partNumber: 3,
  title: "Part 3 — Tutorial on a study of bilingual children",
  stimulusKind: "audio",
  transcript: TRANSCRIPT_3,
  instructions:
    "Questions 21-30. For Questions 21-25, choose the correct letter, A, B or C. For Questions 26-30, complete the flow-chart. Write ONE WORD ONLY for each answer.",
  questions: [
    choice(21, "How did the project begin?", ["Sam wanted to study his own experience.", "A school asked for the research.", "Dr Okafor suggested the topic."], "B", `"it was Lucy's old primary school that got us started" and "The school wanted someone to look into it".`),
    choice(22, "Dr Okafor's main criticism of the literature review is that it", ["is too long", "relies on old studies", "focuses on one region"], "C", `"My main concern is that nearly all of them are from North America."`),
    choice(23, "Compared with monolingual children, the bilingual children", ["switched tasks more quickly", "made fewer mistakes", "performed in the same way"], "B", `"They weren't any faster" but "they did make noticeably fewer errors on the switching task."`),
    choice(24, "What does Dr Okafor think is the main weakness of the study?", ["the small number of children", "the wide range of ages", "the difficulty of the tasks"], "B", `"forty-two is perfectly respectable. What worries me more is the age range."`),
    choice(25, "The students will present their results first to", ["parents", "the school's teachers", "the children"], "B", `The newsletter "could come later", and the head teacher "asked if we'd present the findings to the teachers first".`),
    gap(26, "flowchart_completion", "Step 1: parents complete a ______ about languages used at home", ["questionnaire"], `"parents filled in a questionnaire about which languages were used at home".`, 1),
    gap(27, "flowchart_completion", "Step 2: each child is tested individually in the school ______", ["library"], `The classroom "was far too noisy, so the school let us use the library instead."`, 1),
    gap(28, "flowchart_completion", "Step 3: vocabulary test — children name what they see in ______", ["pictures"], `"We showed the children pictures and asked them to name what they could see."`, 1),
    gap(29, "flowchart_completion", "Step 4: card sorting — first by colour, then by ______", ["shape"], `"The children sort cards first by colour" and then "sort them by shape."`, 1),
    gap(30, "flowchart_completion", "Step 5: each child chooses a ______ as a reward", ["sticker"], `"each child chose a sticker as a reward." Sweets are not allowed.`, 1),
  ],
};

const part4: ItemGroup = {
  id: "lg-4",
  partNumber: 4,
  title: "Part 4 — Lecture: the migration of the monarch butterfly",
  stimulusKind: "audio",
  transcript: TRANSCRIPT_4,
  instructions:
    "Questions 31-40. Complete the sentences (Questions 31-35) and the notes (Questions 36-40). Write ONE WORD AND/OR A NUMBER for each answer.",
  questions: [
    gap(31, "sentence_completion", "The generation that flies south can live for up to ______ months.", ["eight", "8"], `"they can live for up to eight months."`, 1),
    gap(32, "sentence_completion", "The return journey to Canada takes three or four ______.", ["generations"], `"it takes three or four generations to get back to Canada."`, 1),
    gap(33, "sentence_completion", "Rather than landmarks, monarchs mainly navigate by the ______.", ["sun"], `Landmarks were assumed, "But experiments have shown that the main tool is the sun."`, 1),
    gap(34, "sentence_completion", "The butterfly's body clock is located in its ______.", ["antennae"], `"a body clock located, surprisingly, in its antennae."`, 1),
    gap(35, "sentence_completion", "The magnetic compass works only when the butterflies are exposed to ultraviolet ______.", ["light"], `It "only works when the butterflies are exposed to a particular kind of ultraviolet light".`, 1),
    gap(36, "note_completion", "Winter in Mexico: clusters on oyamel ______ trees", ["fir"], `"the monarchs gather in huge clusters on the trunks and branches of oyamel fir trees".`, 1),
    gap(37, "note_completion", "Population measured by the area of ______ covered", ["forest"], `Scientists measure "the area of forest they cover."`, 1),
    gap(38, "note_completion", "Main cause of decline: loss of ______, the caterpillars' only food", ["milkweed"], `"The most important is probably the loss of milkweed".`, 1),
    gap(39, "note_completion", "2002: a severe ______ killed about 80% of two colonies", ["storm"], `"A single severe storm in two thousand and two killed an estimated eighty per cent".`, 1),
    gap(40, "note_completion", "Volunteers attach ______ to wings so routes can be traced", ["tags"], `volunteers help "by attaching tiny tags to the butterflies' wings".`, 1),
  ],
};

export const listeningSection: Section = {
  code: "listening",
  title: "Listening",
  durationMinutes: 30,
  questionCount: 40,
  itemGroups: [part1, part2, part3, part4],
};
