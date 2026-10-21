import type { ItemGroup, Question, QuestionOption, QuestionTypeCode, Section } from "../../../../src/types/content";

/**
 * Mock General Training Listening: 4 parts, 40 questions, ~30 minutes.
 * audioUrl is left undefined until the audio is generated from the transcript.
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

function pick(
  number: number,
  type: QuestionTypeCode,
  prompt: string,
  options: QuestionOption[],
  answer: string,
  explanation: string,
): Question {
  return { id: `l-q${number}`, number, type, prompt, options, acceptedAnswers: [answer], explanation };
}

function pickTwo(number: number, prompt: string, labels: string[], answers: [string, string], explanation: string): Question {
  return {
    id: `l-q${number}`,
    number,
    type: "multiple_choice_multiple",
    prompt,
    options: letters(labels),
    acceptedAnswers: answers,
    explanation,
  };
}

const choice = (n: number, prompt: string, labels: string[], answer: string, explanation: string) =>
  pick(n, "multiple_choice_single", prompt, letters(labels), answer, explanation);

const PLAN = letters(["", "", "", "", "", "", "", ""]).map((o) => ({ value: o.value, label: o.value }));

const DECISIONS = letters([
  "use it as the main evidence",
  "repeat it with more people",
  "leave it out of the report",
  "move it to an appendix",
  "ask the tutor for advice",
  "present it as a chart",
]);

const part1: ItemGroup = {
  id: "lg-1",
  partNumber: 1,
  title: "Part 1 — Renting a self-storage unit",
  stimulusKind: "audio",
  instructions:
    "Questions 1-10. Complete the form below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.",
  transcript: [
    `ANNA: Good afternoon, Keepsafe Storage, Anna speaking. How can I help you?`,
    `MARK: Hi there. I'm looking for a storage unit for a few months while some building work is done on my house. A friend said you might have space.`,
    `ANNA: We certainly do. I'll fill in an enquiry form as we go, if that's all right. Can I start by taking your name?`,
    `MARK: Yes, it's Mark Tremlett.`,
    `ANNA: Could you spell the surname for me, please?`,
    `MARK: Sure. It's T-R-E-M-L-E-T-T.`,
    `ANNA: So two Ts at the end. Thank you, Mr Tremlett. And what's your address?`,
    `MARK: It's 52 Fenwick Road. That's in Ashford.`,
    `ANNA: Sorry, did you say 52 or 62?`,
    `MARK: 52. Five, two.`,
    `ANNA: Got it. And what kind of building work are you having done? I only ask because it helps me estimate how much space you'll need.`,
    `MARK: We're having a new kitchen fitted, and the builders also want to take down the wall between the kitchen and the dining room, so basically the whole ground floor has to be empty.`,
    `ANNA: I see. That's quite a big job. How long do you think you'll need the unit for?`,
    `MARK: The builders say ten weeks, but everyone tells me that building work always takes longer than planned, so I'd say three months to be safe.`,
    `ANNA: Very sensible. Our minimum rental period is one month, and after that you can stay as long as you like, so three months is no problem at all. Now, what will you be storing?`,
    `MARK: Let me think. A dining table and six chairs, a sofa, two bookcases, and quite a lot of boxes, maybe twenty-five or so. Oh, and a washing machine. The fridge is staying in the garage, so that doesn't need to come.`,
    `ANNA: Right. For that amount of furniture I'd suggest our medium unit, which is about the size of a single garage. The small unit is more like a large cupboard, so the table and the sofa wouldn't fit, and the large one would really be more than you need.`,
    `MARK: OK. What does the medium one cost?`,
    `ANNA: The medium unit is ninety-five pounds a month. But at the moment we have an offer for new customers. If you book for three months or more, the first month is half price.`,
    `MARK: Oh, that's good. So the first month would be about forty-seven pounds?`,
    `ANNA: Forty-seven pounds fifty, to be exact, and then the normal ninety-five pounds a month after that.`,
    `MARK: Great. And can I get to the unit whenever I want? I might need to get things out while the work is going on.`,
    `ANNA: The site is open from six in the morning until ten at night, every day of the week, including holidays. You get your own code for the main gate, and you bring your own padlock for the unit. If you don't have one, we sell them at reception for eight pounds.`,
    `MARK: I've got a good one at home that I can use. Do I need insurance?`,
    `ANNA: Yes, all goods have to be insured. If your home insurance doesn't cover items in storage, we offer cover at three pounds a week for goods worth up to five thousand pounds.`,
    `MARK: I'll check with my home insurance company first, then. What about getting everything there? I don't have a van, and my car's far too small.`,
    `ANNA: We can help with that. We have a van that customers can borrow free of charge on the day they move in. The only thing is that you need to bring your driving licence with you when you collect it. We can't let the van go without seeing it, I'm afraid.`,
    `MARK: That's no problem. That saves me a lot of money. I'd like to move in on Saturday the fourteenth, if possible.`,
    `ANNA: Saturday the fourteenth, let me look. I'm sorry, the van's already booked that day. Could you do Sunday the fifteenth instead?`,
    `MARK: Yes, Sunday's actually better. My brother can help me on Sunday.`,
    `ANNA: Lovely, I'll put you down for the fifteenth. Is there anything you'll be storing that we should know about? We don't allow anything that could catch fire, such as paint or gas bottles, and no food of any kind.`,
    `MARK: There might be a few tins of paint in the garage, but I'll leave those with a neighbour.`,
    `ANNA: Thank you. And finally, could I ask how you heard about us? We like to know which of our advertising works.`,
    `MARK: It wasn't an advert, actually. My sister rented a unit here last year when she moved flat, and she recommended you.`,
    `ANNA: That's really nice to hear. I'll email you a confirmation this afternoon with the gate code and a map of the site. Is there anything else I can help with?`,
    `MARK: No, I think that's everything. Thanks very much, Anna.`,
    `ANNA: You're welcome, Mr Tremlett. We'll see you on the fifteenth. Goodbye.`,
  ].join("\n"),
  questions: [
    gap(1, "note_completion", "Customer name: Mark ______", ["Tremlett"], `The caller spells his surname: "It's T-R-E-M-L-E-T-T."`),
    gap(2, "note_completion", "Address: ______ Fenwick Road, Ashford", ["52"], `Mark says "It's 52 Fenwick Road" and then confirms "52. Five, two."`),
    gap(3, "note_completion", "Reason for storage: a new ______ is being fitted", ["kitchen"], `Mark explains "We're having a new kitchen fitted".`),
    gap(4, "note_completion", "Rental period needed: ______ months", ["3", "three"], `The builders say ten weeks, but Mark says "I'd say three months to be safe."`),
    gap(5, "note_completion", "Items include furniture, about 25 boxes and a ______ machine", ["washing"], `Mark adds "Oh, and a washing machine", while the fridge "is staying in the garage".`),
    gap(6, "note_completion", "Unit size: ______ (about the size of a garage)", ["medium"], `Anna suggests "our medium unit, which is about the size of a single garage."`),
    gap(7, "note_completion", "Cost of first month: £______", ["47.50"], `With the offer, the first month is "Forty-seven pounds fifty, to be exact"; £95 is the normal monthly price.`),
    gap(8, "note_completion", "To borrow the free van, bring your ______", ["driving licence", "licence", "driving license", "license"], `Anna says "you need to bring your driving licence with you when you collect it."`),
    gap(9, "note_completion", "Move-in date: Sunday ______", ["15th", "15", "fifteenth"], `The van is booked on the fourteenth, so Anna asks "Could you do Sunday the fifteenth instead?" and Mark agrees.`),
    gap(10, "note_completion", "Heard about the company from his ______", ["sister"], `Mark says "It wasn't an advert, actually. My sister rented a unit here last year".`),
  ],
};

const part2: ItemGroup = {
  id: "lg-2",
  partNumber: 2,
  title: "Part 2 — New volunteers at Greenhaven City Farm",
  stimulusKind: "audio",
  imageUrl: "/mock-images/mock-general-1-plan.svg",
  imageCaption: "Plan of Greenhaven City Farm for Questions 15-20",
  instructions:
    "Questions 11-14: choose the correct letter, A, B or C. Questions 15-20: label the plan. Choose the correct letter, A-H, for each place.",
  transcript: [
    `SPEAKER: Good morning, everyone, and welcome to Greenhaven City Farm. My name is Jo Pearce, and I look after our volunteer programme. Thank you all for giving up your Saturday morning. I'm going to tell you a little about the farm and what we expect from volunteers, and then I'll explain where everything is, using the plan you've been given.`,
    `SPEAKER: First, a bit of history. A lot of visitors assume that the council set the farm up, and the council does give us a small grant these days, but in fact Greenhaven was started in 1987 by a group of parents who wanted their children to see where food comes from. The land had been a railway yard, and it took them three years to clear it before the first animals arrived.`,
    `SPEAKER: Now, on your first day there is one thing every volunteer must do before going near the animals, and that is watch our short safety video. It's only fifteen minutes long, and you can watch it in the visitor centre after this talk. You'll be given a name badge as well, but you can pick that up at any time during the morning.`,
    `SPEAKER: People often ask me where we need the most help. You might think it's feeding the animals, but our staff actually manage that themselves every morning and evening. We have plenty of help with school groups during the week, too, because many of our regular volunteers are retired teachers. Where we're really short of people is at our weekend events, the lambing open days in spring and the harvest fair in the autumn, when we can have two thousand visitors in a single day.`,
    `SPEAKER: A word about the animals themselves. You're welcome to go into the pens with a member of staff, and you can pick up the chickens if they let you, which they usually don't. But please don't feed any of the animals from your hands. Our goats in particular have learned that fingers sometimes come with food, and they can give you a nasty nip.`,
    `SPEAKER: Right, let's look at the plan. You'll see the main entrance at the bottom, on the south side, and the visitor centre just to the left of it as you come in. From the entrance, the main path goes straight up the middle of the farm to the north.`,
    `SPEAKER: Immediately on your right as you come through the entrance, you'll find the café. It's run by volunteers too, and all the eggs and most of the vegetables they use come from the farm.`,
    `SPEAKER: If you walk up the main path, you'll come to a crossroads in the centre of the farm. Turn left there and follow that path all the way to the end, and you'll reach the goat barn. It's the last building on that side, so you can't miss it.`,
    `SPEAKER: The vegetable gardens are on the other side of the main path. If you're walking north from the entrance, they're on your right, just before you reach the crossroads. Don't confuse them with the small building on the left, opposite them, which is the old stable. It's closed at the moment because the roof needs repairing.`,
    `SPEAKER: Go straight over the crossroads and carry on north, and the path bends round to the left. Just after the bend you'll see the tool shed, in the north-west corner of the farm. That's where you'll collect gloves, spades and wheelbarrows, and please return everything there at the end of the day. Right at the top of the main path, at the very north end, is the pig sty, but the pigs are a bit shy with new people, so leave them alone for your first few weeks.`,
    `SPEAKER: If you turn right at the crossroads instead, the path takes you past the pond. Keep going past the pond to the end of the path, on the east side, and that's the composting area. It's where all the manure and garden waste goes, so you'll probably smell it before you see it.`,
    `SPEAKER: And finally, the classroom. That's the newest building on the farm, and it's where school groups have their lessons when the weather is bad. It's in the north-east corner, just above the pond. You get to it by a small path that leads off from the pond on its north side.`,
    `SPEAKER: OK, I think that's everything for now. If you'd like to make your way to the visitor centre for the safety video, I'll join you there in a few minutes and answer any questions.`,
  ].join("\n"),
  questions: [
    choice(11, "Greenhaven City Farm was originally set up by", ["the local council", "a group of parents", "a railway company"], "B", `Jo says "Greenhaven was started in 1987 by a group of parents"; the council only gives "a small grant these days".`),
    choice(12, "What must every volunteer do before working with the animals?", ["collect a name badge", "watch a safety video", "speak to a member of staff"], "B", `Every volunteer must "watch our short safety video"; the badge can be picked up "at any time during the morning."`),
    choice(13, "The farm most needs extra volunteers", ["to feed the animals", "to help with school groups", "at weekend events"], "C", `Jo says "Where we're really short of people is at our weekend events".`),
    choice(14, "Volunteers are asked not to", ["feed animals from their hands", "pick up the chickens", "enter the pens"], "A", `Jo says "please don't feed any of the animals from your hands."`),
    pick(15, "diagram_label", "Goat barn", PLAN, "C", `At the crossroads "Turn left there and follow that path all the way to the end, and you'll reach the goat barn."`),
    pick(16, "diagram_label", "Vegetable gardens", PLAN, "H", `Walking north, the gardens are "on your right, just before you reach the crossroads."`),
    pick(17, "diagram_label", "Café", PLAN, "A", `Jo says "Immediately on your right as you come through the entrance, you'll find the café."`),
    pick(18, "diagram_label", "Tool shed", PLAN, "D", `After the bend "you'll see the tool shed, in the north-west corner of the farm."`),
    pick(19, "diagram_label", "Composting area", PLAN, "G", `Turning right, "Keep going past the pond to the end of the path, on the east side, and that's the composting area."`),
    pick(20, "diagram_label", "Classroom", PLAN, "F", `The classroom is "in the north-east corner, just above the pond."`),
  ],
};

const part3: ItemGroup = {
  id: "lg-3",
  partNumber: 3,
  title: "Part 3 — Discussing a project on second-hand clothes shopping",
  stimulusKind: "audio",
  instructions:
    "Questions 21-24: choose the correct letter, A, B or C. Questions 25-26: choose TWO letters, A-E, for each question. Questions 27-30: what do the students decide to do with each part of their research? Choose from the list A-F.",
  transcript: [
    `TUTOR: Come in, Priya, Tom. Have a seat. So, this is your project on second-hand clothes shopping among students. How's it going?`,
    `PRIYA: Quite well, I think. We've finished collecting data and we've started writing up, but there are a few things we wanted to check with you.`,
    `TUTOR: Fine. Remind me how you chose the topic. I know you started with something different.`,
    `TOM: Yes, originally we were going to look at fast food, but there's already so much research on that. Then Priya noticed that the charity shops near campus were always full of students, and we realised nobody had really asked why.`,
    `PRIYA: We'd assumed it was all about saving money, but when we did a few trial interviews, people kept talking about the environment instead. That's what made us want to study it properly.`,
    `TUTOR: Good, a real question. And who did you survey in the end?`,
    `TOM: We wanted to include students from all three universities in the city, but the other two wouldn't let us send emails to their students, so we only surveyed our own. We got four hundred and six responses.`,
    `TUTOR: That's still a good number. What would you say was your most important finding?`,
    `PRIYA: Well, we expected that students who shop second-hand would buy fewer clothes overall. But actually it was the opposite. They bought more items than anyone else, because each item is so cheap.`,
    `TOM: Which was a bit disappointing from the environmental point of view, but interesting.`,
    `TUTOR: That's worth discussing in your conclusion. Now, what did you want to ask me?`,
    `TOM: The main thing is the literature review. We're not sure how many sources we need.`,
    `TUTOR: It's less about the number and more about how recent they are. This market has changed enormously because of resale apps, so anything more than about ten years old should only be there for background.`,
    `PRIYA: That's helpful. We have quite a few older articles.`,
    `TUTOR: Keep one or two of the classic studies, but build the review around recent work. Now, you said you had problems with the questionnaire. What happened?`,
    `PRIYA: Two things, really. First, it was much too long. A lot of people gave up halfway through, so many of the later questions have very few answers. And second, some of the questions were badly worded. We asked people how often they shop second-hand, but we didn't say whether we meant online or in shops, so the answers are hard to interpret.`,
    `TUTOR: Those are common problems, and it's good that you've noticed them. You weren't sent the wrong version by mistake or anything like that?`,
    `TOM: No, that part went fine, and the response rate was good. It's just the length and the wording.`,
    `TUTOR: And if you did the project again, what would you change?`,
    `TOM: I'd definitely test the questionnaire on a small group before sending it out. We skipped that because we were short of time.`,
    `PRIYA: And I'd interview the shop staff as well as students. The volunteers at the charity shops know a huge amount about who buys what. We'd also run the survey earlier in the year, because we sent it out during exams.`,
    `TUTOR: Both good points. Right, let's go through the parts of your research and decide what goes where. Start with the questionnaire.`,
    `TOM: Despite the problems, I think the questionnaire has to be the main evidence. It's the only source with enough people to show patterns.`,
    `TUTOR: I agree. Just be honest about its weaknesses. What about the trial interviews you did at the start?`,
    `PRIYA: They were only five short conversations, so I don't think they belong in the main report. But they explain why we changed our question, so we thought we'd move them to an appendix.`,
    `TUTOR: That's exactly right. Next, the price survey, where you compared prices in the shops.`,
    `TOM: We visited eight shops and recorded the price of the same items in each one. There are so many numbers that it's very hard to read as a table.`,
    `PRIYA: So we're going to present it as a chart instead. A bar chart, probably.`,
    `TUTOR: Good. And the online observation, where you looked at the resale apps?`,
    `TOM: Honestly, we're not sure about that one. We only looked at two apps for one week, and we don't know whether it's enough to be useful.`,
    `PRIYA: We'd like to hear what you think before we decide.`,
    `TUTOR: All right. Send it to me and I'll give you my opinion by Friday. Don't leave it out yet. Now, when's your deadline?`,
    `PRIYA: The twentieth of next month.`,
    `TUTOR: Then send me a full draft two weeks before that. You're doing well, both of you.`,
  ].join("\n"),
  questions: [
    choice(21, "The students decided to study second-hand clothes shopping because", ["there was little research on fast food", "they noticed many students in charity shops", "their tutor suggested the topic"], "B", `Tom says "Priya noticed that the charity shops near campus were always full of students, and we realised nobody had really asked why."`),
    choice(22, "Why did the students survey only one university?", ["The other universities refused permission.", "They did not have enough time.", "Their tutor advised it."], "A", `Tom says "the other two wouldn't let us send emails to their students, so we only surveyed our own."`),
    choice(23, "What surprised the students about second-hand shoppers?", ["They cared little about the environment.", "They bought more clothes than other students.", "They mostly shopped online."], "B", `Priya says "They bought more items than anyone else, because each item is so cheap."`),
    choice(24, "The tutor says the sources in the literature review should mainly be", ["recent", "numerous", "well known"], "A", `The tutor says "It's less about the number and more about how recent they are", and to "build the review around recent work."`),
    pickTwo(25, "Which TWO problems did the students have with their questionnaire?", ["It was too long.", "It was sent to the wrong people.", "Some questions were unclear.", "Too few people replied.", "It was in the wrong format."], ["A", "C"], `Priya says "it was much too long" and "some of the questions were badly worded"; Tom confirms "the response rate was good."`),
    pickTwo(26, "Which TWO changes would the students make if they did the project again?", ["test the questionnaire first", "survey more universities", "interview shop staff", "shorten the literature review", "use fewer shops"], ["A", "C"], `Tom would "test the questionnaire on a small group before sending it out", and Priya would "interview the shop staff as well as students."`),
    pick(27, "matching_features", "the questionnaire", DECISIONS, "A", `Tom says "I think the questionnaire has to be the main evidence."`),
    pick(28, "matching_features", "the trial interviews", DECISIONS, "D", `Priya says "we thought we'd move them to an appendix", and the tutor agrees.`),
    pick(29, "matching_features", "the price survey", DECISIONS, "F", `Priya says "we're going to present it as a chart instead."`),
    pick(30, "matching_features", "the online observation", DECISIONS, "E", `Priya says "We'd like to hear what you think before we decide", and the tutor adds "Don't leave it out yet."`),
  ],
};

const part4: ItemGroup = {
  id: "lg-4",
  partNumber: 4,
  title: "Part 4 — Lecture: mangrove forests",
  stimulusKind: "audio",
  instructions:
    "Questions 31-40. Complete the notes below. Write ONE WORD ONLY for each answer.",
  transcript: [
    `LECTURER: Good morning. In today's lecture I'm going to talk about mangrove forests, which grow along tropical and subtropical coastlines, where the land meets the sea. They're one of the most productive ecosystems on the planet, and also one of the most threatened.`,
    `LECTURER: Let's start with what a mangrove actually is. The word doesn't refer to a single species. It describes around seventy different kinds of trees and shrubs that have one thing in common: they can survive in salt water. For most plants, salt is a poison. Mangroves deal with it in different ways. Some species stop most of the salt at their roots, while others take it in and then get rid of it through their leaves. If you lick the leaf of certain mangroves, you can actually taste the salt crystals on the surface, though I wouldn't particularly recommend it.`,
    `LECTURER: The second problem mangroves face is the mud they grow in. Coastal mud contains very little oxygen, and roots need oxygen just as leaves do. So many mangroves have developed special roots that grow upwards out of the mud, like small pencils pointing at the sky. These act rather like snorkels, allowing the tree to breathe when the tide is out. Other species have tall, curved roots that hold the trunk above the water, which is why mangrove forests can look as if they are standing on stilts.`,
    `LECTURER: Reproduction is also unusual. In most trees, a seed falls to the ground and then begins to grow. But many mangroves produce seedlings that start growing while they are still attached to the parent tree. When they finally drop, they can float in the sea for months, and some have been known to travel hundreds of kilometres before settling on a new shore.`,
    `LECTURER: Why do mangroves matter? First, they protect coastlines. Their dense roots slow down waves and hold the soil in place, which reduces erosion. After the Indian Ocean tsunami in 2004, several studies found that villages behind healthy mangrove forests often suffered less damage than those where the forests had been cleared, although researchers are careful to say mangroves cannot stop the very largest waves.`,
    `LECTURER: Second, they are nurseries for fish. The tangle of roots underwater gives young fish shelter from larger predators, and many species that are later caught far out at sea spend the first part of their lives among mangroves. In some regions, the majority of the fish caught commercially depend on mangroves at some stage. So when the forests disappear, fishing communities often feel the effects quite quickly.`,
    `LECTURER: Third, and this is what has attracted most attention recently, mangroves store enormous amounts of carbon. Not mainly in the trees themselves, but in the soil beneath them. Because the mud has so little oxygen, dead leaves and roots decay extremely slowly, so the carbon builds up over thousands of years. Hectare for hectare, mangrove soils can hold several times more carbon than a tropical rainforest.`,
    `LECTURER: Unfortunately, the world has lost a large proportion of its mangroves over the last half century. The biggest single cause has been the conversion of coastal land into ponds for farming shrimp, which are sold mainly to wealthy countries. Mangroves have also been cleared for rice fields, for tourist resorts and for the expansion of cities, and in some places the trees have simply been cut for firewood.`,
    `LECTURER: The good news is that the rate of loss has slowed considerably, and there are many restoration projects. But early attempts often failed. Organisations planted millions of seedlings on mudflats where mangroves had never grown, and most of them died. We now know that the most important factor is getting the water right. If the tides can reach an area in the natural way, mangroves will often return by themselves, because the seedlings are carried in by the sea. In those cases, the best thing people can do is remove old walls and channels and then simply wait.`,
    `LECTURER: Successful projects also tend to involve local communities from the start. Where people who live nearby benefit directly, for example through better fishing or through payments for the carbon the forest stores, they have a reason to protect the trees in the long term.`,
    `LECTURER: Next week we'll look at another coastal ecosystem, seagrass meadows, and compare the way they store carbon.`,
  ].join("\n"),
  questions: [
    gap(31, "note_completion", "Mangroves: about 70 species that can survive in ______ water", ["salt", "salty"], `The lecturer says mangroves "can survive in salt water."`, 1),
    gap(32, "note_completion", "Some species remove salt through their ______", ["leaves"], `Some species take salt in "and then get rid of it through their leaves."`, 1),
    gap(33, "note_completion", "Coastal mud contains very little ______", ["oxygen"], `The lecturer says "Coastal mud contains very little oxygen".`, 1),
    gap(34, "note_completion", "Upward-growing roots work like ______, letting the tree breathe", ["snorkels", "snorkel"], `The roots "act rather like snorkels, allowing the tree to breathe when the tide is out."`, 1),
    gap(35, "note_completion", "Seedlings can ______ in the sea for months", ["float"], `When seedlings drop "they can float in the sea for months".`, 1),
    gap(36, "note_completion", "Dense roots slow waves and reduce ______", ["erosion"], `The roots "slow down waves and hold the soil in place, which reduces erosion."`, 1),
    gap(37, "note_completion", "Roots give young fish shelter from ______", ["predators"], `The roots give "young fish shelter from larger predators".`, 1),
    gap(38, "note_completion", "Most carbon is stored in the ______, not the trees", ["soil"], `Carbon is stored "Not mainly in the trees themselves, but in the soil beneath them."`, 1),
    gap(39, "note_completion", "Main cause of loss: ponds for farming ______", ["shrimp", "shrimps"], `The lecturer says "The biggest single cause has been the conversion of coastal land into ponds for farming shrimp".`, 1),
    gap(40, "note_completion", "Restoration: the key factor is getting the ______ right", ["water"], `The lecturer says "the most important factor is getting the water right."`, 1),
  ],
};

export const listeningSection: Section = {
  code: "listening",
  title: "Listening",
  durationMinutes: 30,
  questionCount: 40,
  itemGroups: [part1, part2, part3, part4],
};
