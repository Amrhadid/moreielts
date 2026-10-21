import type { ItemGroup, Question, QuestionOption, QuestionTypeCode, Section } from "../../../../src/types/content";

/**
 * Mock Exam 1 — Listening: 4 parts, 40 questions, ~30 minutes. Each part's
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

const TRANSCRIPT_1 = `CLERK: Good morning, Westline Railways lost property office, Sarah speaking. How can I help you?
DANIEL: Oh, hello. I left a bag on one of your trains, and I'm hoping someone might have handed it in.
CLERK: I'm sorry to hear that. Nothing has been matched to a description yet this morning, but things come in from all over the network, so let me take some details and I'll create a report. Can I start with your name?
DANIEL: Yes, it's Daniel Thewlis.
CLERK: Could you spell the surname for me?
DANIEL: Sure. T-H-E-W-L-I-S.
CLERK: T-H-E-W-L-I-S. Thank you. And you lost the bag yesterday?
DANIEL: Well, actually, no, sorry, I'm getting confused. I phoned my sister yesterday to tell her about it, but the journey itself was the day before. So that would be the fourteenth of October.
CLERK: The fourteenth. That was a Tuesday. And where did you get on the train?
DANIEL: I live in Millford, but the trains from there are so slow that I drove to Stanton and caught the eight fifteen from there.
CLERK: So the train departed from Stanton. Is that S-T-A-N-T-O-N?
DANIEL: That's right.
CLERK: And it was the direct service to the city, was it?
DANIEL: Yes, I got off at Central Station at about half past nine.
CLERK: Do you remember which carriage you were sitting in? It really helps the cleaning teams when they search.
DANIEL: I think it was carriage C. Hang on, no, it can't have been, because I specifically went to the quiet coach to do some reading, and on that train the quiet coach is carriage D. Yes, it was D.
CLERK: Carriage D. And what exactly did you leave behind?
DANIEL: A bag. It's not a suitcase or anything like that. It's a canvas rucksack, a fairly big one.
CLERK: A rucksack. And the colour?
DANIEL: It's green, a dark green, although under the lights on the train it can look almost grey. It has brown leather straps, which are quite distinctive.
CLERK: Dark green with brown straps. Is there a brand name on it?
DANIEL: There's a small label on the front, but it's worn away, so I'm afraid I can't tell you what it says.
CLERK: Not to worry. And what was inside the bag?
DANIEL: The thing I'm most worried about is my camera. It's in a black case with a shoulder strap. There's also a waterproof jacket, which doesn't matter so much, and a book.
CLERK: Can you tell me anything about the book? If it has a name inside, that could help us identify the bag.
DANIEL: It's a library book, actually, so it has the library stamp in it. It's about astronomy. I'm doing an evening course on the night sky, and it's the main text for the course.
CLERK: Astronomy. Okay. And roughly what would you say the whole bag and its contents are worth? We ask for an estimate for insurance purposes.
DANIEL: Well, the camera cost me four hundred pounds new, but that was a few years ago, so it wouldn't be worth that now. Altogether, including the bag and the jacket, I'd say about three hundred and fifty pounds.
CLERK: Three hundred and fifty. Fine. Now, there is a small fee if we do find it. It's a fixed charge of fifteen pounds, which covers storage, and if you want it posted to you, there's a postage charge as well, depending on the size.
DANIEL: I'd rather come and collect it, if that's possible. I work near Central Station.
CLERK: That's fine. The office is on the lower ground floor, next to platform one, and we're open from seven in the morning until seven in the evening, Monday to Saturday.
DANIEL: Great.
CLERK: And how would you like us to contact you if the bag turns up? We can phone, email or send a text message.
DANIEL: Email's no good, I'm afraid, as I don't check my personal account at work. And I often can't answer the phone in meetings. So a text message would be best.
CLERK: A text it is. Could I have your mobile number?
DANIEL: It's oh seven seven double oh, nine one four, three eight two.
CLERK: Thank you. I'll read it back to you. Oh seven seven double oh, nine one four, three eight two.
DANIEL: That's right.
CLERK: Lovely. Your report reference is L P six four seven. If you need to call us again, please quote that number and it'll save time.
DANIEL: L P six four seven. Let me write that down. And how long do you keep things for?
CLERK: We hold items for one month. After that, anything unclaimed is given to charity, except for valuables like phones and cameras, which are handed to the police.
DANIEL: Okay. And do most things get found?
CLERK: A surprising number do. Rucksacks especially, because they're easy to spot. The cleaning team will have searched that train at the end of the line, so if it was still on board, it'll be on its way to us. It can take up to three days for items to reach this office.
DANIEL: Three days. All right, I'll try to be patient. Thank you so much for your help.
CLERK: You're welcome, Mr Thewlis. We'll be in touch as soon as we have any news.`;

const TRANSCRIPT_2 = `ROSA: Hello everyone, and welcome to Greenhill City Farm. My name's Rosa and I'm one of the education officers here. Before you go off and explore, I'd like to tell you a little about the farm and show you where everything is on the plan you were given at reception.
ROSA: First, a bit of history. A lot of visitors assume that the farm was built on the site of the old brick factory, because the chimney you can see from the car park belonged to it. In fact, the factory stood on the land just next door, which is now housing. This site was the town's rubbish tip until the nineteen seventies. When it closed, a group of local parents cleared the ground, brought in topsoil, and opened the farm with just two goats and a few chickens in nineteen seventy-eight.
ROSA: We're a charity, so people often ask how we pay for everything. We do get donations from visitors, and we're very grateful for them, but they only make up a small part of our budget. The café helps too, and it's getting busier every year. But by far the largest share of our income comes from school visits. We host around twelve thousand children a year, and the fees schools pay keep the farm running.
ROSA: Now, a few rules. Dogs are welcome on the farm, as long as they're kept on a lead at all times and they don't go into the animal barns. You're also very welcome to take photographs, and we love it when people share them online. What we do ask is that you don't give the animals any food you've brought with you. Even a small piece of bread can make a goat or a pig quite ill. If you'd like to feed them, you can buy bags of suitable food at reception for one pound.
ROSA: We've also got some new things happening this year. Some of you may remember that we used to offer pony riding lessons. Sadly we had to stop those last year, when our insurance costs went up. We had also hoped to launch a monthly weekend market for local producers this spring, but that's been put back until next year. What is going ahead, starting in May, is a cheese-making course, using milk from our own goats. It runs on Saturday mornings, and there are still a few places left.
ROSA: Right, let's look at the plan. We're standing at reception, just inside the main entrance, at the bottom of the plan. You'll see the café is on your left as you face into the farm, and the main path goes straight ahead, north, up to the yard in the middle of the site.
ROSA: When you reach the yard, look to your left, that's to the west, and you'll find the goat pens. They're the most popular part of the farm with children, so they can get crowded around feeding time at two o'clock.
ROSA: Behind the goat pens, right up in the north-west corner of the site, is the orchard. We grow apples, pears and plums there, and in autumn visitors can pick their own fruit.
ROSA: If you'd like to see the pond, head for the top right-hand corner of the farm, in the north-east. Follow the path that runs alongside the stream, and the pond is at the very end of it. Please keep young children close to you there, as the water is quite deep in places.
ROSA: Back at the entrance, the building on your right as you come in, directly opposite the café, is the farm shop. It sells our own eggs, honey and vegetables, and it will sell the cheese too, once the course is under way.
ROSA: The pigs are a short walk away. Go straight ahead past the yard, keep going north, and the pig sties are at the top of the main path. The sows had piglets last month, so do go and have a look.
ROSA: And finally, the picnic area. The leaflets you may have picked up in town still show it down by the pond, but we've moved it because of the ducks, which kept stealing people's sandwiches. It's now on the east side of the yard, opposite the goat pens, so it's nice and central, and there's plenty of shade from the trees.
ROSA: Toilets are next to reception and in the corner of the café. If you have any questions, just ask anyone wearing a green sweatshirt. Enjoy your visit.`;

const TRANSCRIPT_3 = `MASON: Come in, Amy, Joel. Have a seat. So, you wanted to talk about how the noise project is going.
AMY: Yes, thanks, Dr Mason. We've finished most of the fieldwork, and we wanted to check a few things before we start writing up.
MASON: Good. Remind me first why you chose noise. It's not one of the topics on the list I gave out.
JOEL: Well, I'd read a council report on noise complaints, and I mentioned it to Amy. But honestly, that came later. It was really Amy's flat that started it.
AMY: That's right. My flat's on a busy road near the ring road, and I wasn't sleeping well. I started wondering whether the noise levels were actually as high as they felt, and that turned into the project.
MASON: Personal experience is a perfectly good starting point. And how did the recording go?
JOEL: We'd planned to record for a full week at each site. In the end we cut it to three days.
MASON: Was that the batteries? That's usually the problem.
JOEL: We thought it would be, but they were fine. And residents didn't object to the microphones at all, which surprised us. The real issue was that a week of recordings produced so much data that it would have taken months to analyse.
MASON: That's a sensible decision. Three days, including a weekend day, should still give you a reasonable sample. Now, you also measured how annoyed people were by noise. How did you do that?
AMY: We asked people at each site to describe how much the noise bothered them, and we put their answers into categories afterwards.
MASON: I see. The number of people sounds fine, but I'm less happy with the questions. If everyone answers in their own words, it's very hard to compare one site with another. There's a standard annoyance scale used in most of the published studies, with eleven points from not at all to extremely. I'd strongly recommend you use that for the remaining interviews.
AMY: Okay, we can do that.
MASON: And what's come out so far? Anything unexpected?
JOEL: We expected the park to be quiet, and it was, so no surprise there. Night noise was a bit higher at weekends, which again we'd predicted. The thing that really surprised us was that people living on quiet streets made more complaints than people on the main roads.
AMY: We think it might be because they're not used to noise, so any sudden sound stands out.
MASON: That's an interesting finding, and it fits some of the literature. Make sure you discuss it. Any problems with the equipment?
AMY: A couple. The main one was wind. On exposed sites, the wind hitting the microphone pushed the readings up, so we had to buy foam covers for them.
JOEL: And halfway through, we discovered the meters needed recalibrating. Two of them were giving readings about three decibels too high.
MASON: Did you lose much data?
JOEL: Only a day's worth. We were worried at the start that a meter might be stolen, but nothing like that happened. And the memory cards were never a problem. They hold far more than we needed.
MASON: Good. Now, let's go through the sites. Which ones are you unsure about?
AMY: The railway bridge, first. The readings there are huge whenever a freight train goes past, and we're not sure they're accurate.
MASON: The council has a permanent monitor near that bridge, doesn't it? I'd check your figures against the council data before you decide anything.
AMY: Okay, we'll do that. Then there's the shopping centre. We thought about adding a second microphone inside, but the management have now said we can't record there at all.
JOEL: So we'll just have to drop it from the study. It's a pity, but we have enough other sites.
MASON: Fine. What about the university library?
JOEL: It's the quietest place we measured, by a long way. We were going to leave it out, because it isn't residential.
MASON: Actually, that's exactly why it's useful. You could use it as your control site, so you have a baseline to compare everything else with.
JOEL: Oh, good idea. We'll do that.
AMY: And the last one is the hospital. We only recorded there during the day, but most complaints from patients are about noise at night, from ambulances and deliveries.
MASON: Then you need to record there again at night. Otherwise your data won't match the complaints you're analysing.
AMY: Right. Finally, the report. We were thinking about what to include beyond the basic results.
JOEL: I'd like to include photos of all the sites.
MASON: I'd avoid that. People's houses and faces would be in them, and you'd need everyone's permission.
JOEL: Fair enough. What about a map, with the noise levels shown in colour?
MASON: Yes, a map would work well. It shows the pattern at a glance.
AMY: We also talked about comparing our results with another city, but that seems too big.
MASON: It is, for a project of this size. And you've already got interviews with residents in your methods section, so they're covered. What I'd really like to see at the end is a set of recommendations for the council. That gives the project a practical purpose.
AMY: Great. So a map and recommendations.
MASON: Exactly. Send me a draft in two weeks, and we'll talk again then.`;

const TRANSCRIPT_4 = `LECTURER: Good morning. Today we're continuing our series on technologies that changed the way information is stored, and our subject is paper. It's so common that we rarely think about it, but its history stretches over nearly two thousand years and several continents.
LECTURER: Let's begin in China. Before paper, Chinese scribes wrote on two main surfaces. One was silk, which was light and pleasant to write on but far too expensive for everyday use. The other was strips of bamboo, tied together with cord. Bamboo was cheap, but it was very heavy. There's a famous story of an emperor who had to read through more than a hundred kilograms of bamboo documents every day.
LECTURER: The invention of paper is traditionally credited to a court official named Cai Lun, who presented it to the emperor in the year one hundred and five. In fact, archaeologists have found fragments of paper that are older than that, so Cai Lun probably improved an existing process rather than inventing it. What we do know is the recipe he's said to have used: tree bark, hemp, old rags and fishing nets. These were soaked, then beaten into a pulp, and the pulp was spread across a screen made of cloth stretched on a frame. As the water drained away, the fibres matted together into a sheet, which was then dried in the sun.
LECTURER: For several centuries, the Chinese kept the method largely to themselves. It spread to Korea and Japan, but not to the west. That changed in the year seven hundred and fifty-one, after a battle between Chinese and Arab armies in Central Asia. Among the Chinese prisoners taken in the battle were men who knew how to make paper, and it was through these prisoners that papermaking reached the city of Samarkand. Now, some historians question this story, and the knowledge may well have travelled along trade routes too, but it's the version most sources give.
LECTURER: From Samarkand, paper spread to Baghdad, where a paper mill was established at the end of the eighth century. Here it had an important administrative use. Government records had previously been kept on parchment, which is made from animal skin. The problem with parchment was that ink could be scraped off it and the document rewritten, so it was easy to forge. Writing on paper couldn't be removed without leaving obvious damage, so paper replaced parchment for official records.
LECTURER: Paper reached Europe through Spain and Italy. By the late thirteenth century, the town of Fabriano in Italy had become a major centre, and the papermakers there introduced two important innovations. First, instead of beating the rags by hand, they used hammers driven by water wheels, which were far faster. Second, they began to press a design into each sheet while it was still wet. These designs, which we call watermarks, identified the maker, and they're still used today, on banknotes for example.
LECTURER: The arrival of printing in the fifteenth century made demand for paper rise enormously. And this created a problem, because European paper was made almost entirely from rags, mainly linen and cotton. By the eighteenth century there was a serious shortage of rags. Papermakers advertised for them in newspapers, and in some places it was even made illegal to bury the dead in cotton or linen, so that the cloth could be saved for paper.
LECTURER: The solution came from an unexpected source. In the early eighteenth century, a French scientist noticed that wasps build their nests by chewing wood into a kind of paper. He suggested that humans could do the same, but it took more than a century for anyone to make it work on a commercial scale. In the eighteen forties, inventors in Germany and Canada independently developed machines that ground wood into pulp, and paper made from wood gradually replaced rag paper.
LECTURER: Wood pulp made paper cheap enough for mass newspapers and paperback books, but it came with a hidden cost. The chemicals used to process the pulp left the paper containing acid, and over time this acid breaks down the fibres. That's why so many books from the late nineteenth century are now yellow and brittle, while some much older books printed on rag paper are still in excellent condition. Libraries spend large sums today trying to slow this process down.
LECTURER: Since the nineteen eighties, most book paper has been made acid-free, which should mean that today's books will last far longer. Next week we'll look at the printing press itself, and at how it changed not just books but the very idea of authorship.`;

const part1: ItemGroup = {
  id: "lg-1",
  partNumber: 1,
  title: "Part 1 — Reporting a lost bag to a rail company",
  stimulusKind: "audio",
  transcript: TRANSCRIPT_1,
  instructions:
    "Questions 1-10. Complete the lost property form below. Write ONE WORD AND/OR A NUMBER for each answer.",
  questions: [
    gap(1, "note_completion", "Name: Daniel ______", ["Thewlis"], `The surname is spelt "T-H-E-W-L-I-S."`),
    gap(2, "note_completion", "Date of journey: ______ October", ["14th", "14", "fourteenth"], `Not yesterday: "the journey itself was the day before. So that would be the fourteenth of October."`),
    gap(3, "note_completion", "Train departed from: ______", ["Stanton"], `He lives in Millford but "drove to Stanton and caught the eight fifteen from there."`),
    gap(4, "note_completion", "Carriage: ______", ["D"], `He first says C, then corrects himself: "the quiet coach is carriage D. Yes, it was D."`),
    gap(5, "note_completion", "Item lost: a canvas ______", ["rucksack", "backpack"], `"It's not a suitcase or anything like that. It's a canvas rucksack".`),
    gap(6, "note_completion", "Colour: ______, with brown leather straps", ["green", "dark green"], `"It's green, a dark green, although under the lights on the train it can look almost grey."`),
    gap(7, "note_completion", "Contents: a ______ in a black case", ["camera"], `"The thing I'm most worried about is my camera. It's in a black case".`),
    gap(8, "note_completion", "Contents: a library book about ______", ["astronomy"], `"It's a library book, actually" and "It's about astronomy."`),
    gap(9, "note_completion", "Estimated value of bag and contents: £______", ["350"], `The camera cost four hundred new, but "Altogether, including the bag and the jacket, I'd say about three hundred and fifty pounds."`),
    gap(10, "note_completion", "Preferred contact method: ______", ["text", "text message", "texts"], `Email and phone are rejected: "So a text message would be best."`),
  ],
};

const PLAN_LETTERS: QuestionOption[] = ["A", "B", "C", "D", "E", "F", "G", "H"].map((l) => ({ value: l, label: l }));

const part2: ItemGroup = {
  id: "lg-2",
  partNumber: 2,
  title: "Part 2 — Welcome talk at Greenhill City Farm",
  stimulusKind: "audio",
  transcript: TRANSCRIPT_2,
  imageUrl: "/mock-images/mock-academic-1-plan.svg",
  imageCaption: "Plan of Greenhill City Farm for Questions 15-20",
  instructions:
    "Questions 11-20. For Questions 11-14, choose the correct letter, A, B or C. For Questions 15-20, label the plan: choose the correct letter, A-H, for each place.",
  questions: [
    choice(11, "Before the farm opened, the site was", ["a brick factory", "a rubbish tip", "housing"], "B", `"This site was the town's rubbish tip until the nineteen seventies." The factory "stood on the land just next door".`),
    choice(12, "Most of the farm's income comes from", ["visitors' donations", "the café", "school visits"], "C", `"by far the largest share of our income comes from school visits."`),
    choice(13, "Visitors are asked not to", ["bring dogs onto the farm", "give the animals food they have brought", "take photographs of the animals"], "B", `Dogs and photographs are allowed; "What we do ask is that you don't give the animals any food you've brought with you."`),
    choice(14, "What is new at the farm this year?", ["pony riding lessons", "a weekend market", "a cheese-making course"], "C", `Riding lessons stopped and the market has "been put back until next year." "What is going ahead, starting in May, is a cheese-making course".`),
    match(15, "diagram_label", "Goat pens", PLAN_LETTERS, "C", `"When you reach the yard, look to your left, that's to the west, and you'll find the goat pens."`),
    match(16, "diagram_label", "Orchard", PLAN_LETTERS, "B", `"Behind the goat pens, right up in the north-west corner of the site, is the orchard."`),
    match(17, "diagram_label", "Pond", PLAN_LETTERS, "E", `"Follow the path that runs alongside the stream, and the pond is at the very end of it", in "the north-east."`),
    match(18, "diagram_label", "Farm shop", PLAN_LETTERS, "G", `"the building on your right as you come in, directly opposite the café, is the farm shop."`),
    match(19, "diagram_label", "Pig sties", PLAN_LETTERS, "D", `"Go straight ahead past the yard, keep going north, and the pig sties are at the top of the main path."`),
    match(20, "diagram_label", "Picnic area", PLAN_LETTERS, "F", `Old leaflets show it by the pond, but "It's now on the east side of the yard, opposite the goat pens".`),
  ],
};

const SITE_DECISIONS = letters([
  "remove it from the study",
  "record there again at night",
  "add a second microphone",
  "compare readings with council data",
  "use it as a control site",
  "interview more residents",
]);

const part3: ItemGroup = {
  id: "lg-3",
  partNumber: 3,
  title: "Part 3 — Tutorial on a project about urban noise",
  stimulusKind: "audio",
  transcript: TRANSCRIPT_3,
  instructions:
    "Questions 21-30. For Questions 21-24, choose the correct letter, A, B or C. For Questions 25-26, choose TWO letters, A-E. For Questions 27-30, what do the students decide to do about each location? Choose the correct letter, A-F.",
  questions: [
    choice(21, "The students chose noise as their topic mainly because of", ["a council report on complaints", "Amy's experience at home", "a list of topics from their tutor"], "B", `The report "came later. It was really Amy's flat that started it."`),
    choice(22, "Why did the students shorten the recording period at each site?", ["The batteries did not last long enough.", "Residents objected to the microphones.", "There would have been too much data to analyse."], "C", `"The real issue was that a week of recordings produced so much data that it would have taken months to analyse."`),
    choice(23, "Dr Mason advises the students to", ["interview more people at each site", "use a standard scale for measuring annoyance", "stop asking people about annoyance"], "B", `"There's a standard annoyance scale used in most of the published studies" and "I'd strongly recommend you use that for the remaining interviews."`),
    choice(24, "What surprised the students most?", ["The park was quieter than expected.", "Night noise was higher at weekends.", "Residents of quiet streets complained more."], "C", `"The thing that really surprised us was that people living on quiet streets made more complaints than people on the main roads."`),
    multi(25, "Which TWO problems did the students have with the equipment? Choose TWO letters.", ["wind affected the readings", "a sound meter was stolen", "some meters needed recalibrating", "the memory cards filled up", "rain damaged a microphone"], ["A", "C"], `"The main one was wind" and "we discovered the meters needed recalibrating." Nothing was stolen and "the memory cards were never a problem."`),
    multi(26, "Which TWO things will the students add to their report? Choose TWO letters.", ["photographs of each site", "a colour map of noise levels", "interviews with residents", "a comparison with another city", "recommendations for the council"], ["B", "E"], `Photos are rejected, but "a map would work well", and "What I'd really like to see at the end is a set of recommendations for the council."`),
    match(27, "matching_features", "The railway bridge", SITE_DECISIONS, "D", `"I'd check your figures against the council data before you decide anything."`),
    match(28, "matching_features", "The shopping centre", SITE_DECISIONS, "A", `A second microphone was considered, but "we'll just have to drop it from the study."`),
    match(29, "matching_features", "The university library", SITE_DECISIONS, "E", `"You could use it as your control site, so you have a baseline to compare everything else with."`),
    match(30, "matching_features", "The hospital", SITE_DECISIONS, "B", `"Then you need to record there again at night."`),
  ],
};

const part4: ItemGroup = {
  id: "lg-4",
  partNumber: 4,
  title: "Part 4 — Lecture: a history of paper",
  stimulusKind: "audio",
  transcript: TRANSCRIPT_4,
  instructions: "Questions 31-40. Complete the notes below. Write ONE WORD ONLY for each answer.",
  questions: [
    gap(31, "note_completion", "Before paper, Chinese scribes used silk (expensive) or strips of ______ (heavy)", ["bamboo"], `"The other was strips of bamboo" and "Bamboo was cheap, but it was very heavy."`, 1),
    gap(32, "note_completion", "Cai Lun's recipe: tree bark, hemp, old rags and fishing ______", ["nets", "net"], `"tree bark, hemp, old rags and fishing nets."`, 1),
    gap(33, "note_completion", "Pulp spread across a cloth ______ on a frame", ["screen"], `"the pulp was spread across a screen made of cloth stretched on a frame."`, 1),
    gap(34, "note_completion", "751: papermaking reached Samarkand, probably through ______ taken in a battle", ["prisoners"], `"it was through these prisoners that papermaking reached the city of Samarkand."`, 1),
    gap(35, "note_completion", "Baghdad: paper replaced ______ for official records, as it was harder to forge", ["parchment"], `Ink on parchment could be scraped off, "so paper replaced parchment for official records."`, 1),
    gap(36, "note_completion", "Fabriano: rags beaten by ______ driven by water wheels", ["hammers"], `"they used hammers driven by water wheels, which were far faster."`, 1),
    gap(37, "note_completion", "Fabriano: ______ pressed into wet sheets to identify the maker", ["watermarks", "watermark"], `"These designs, which we call watermarks, identified the maker".`, 1),
    gap(38, "note_completion", "18th century: serious shortage of ______", ["rags"], `"By the eighteenth century there was a serious shortage of rags."`, 1),
    gap(39, "note_completion", "Idea of using wood came from watching ______ build nests", ["wasps"], `"a French scientist noticed that wasps build their nests by chewing wood into a kind of paper."`, 1),
    gap(40, "note_completion", "Wood-pulp paper contains ______, so it turns yellow and brittle", ["acid"], `"The chemicals used to process the pulp left the paper containing acid".`, 1),
  ],
};

export const listeningSection: Section = {
  code: "listening",
  title: "Listening",
  durationMinutes: 30,
  questionCount: 40,
  itemGroups: [part1, part2, part3, part4],
};
