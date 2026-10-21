import type { ItemGroup, Question, QuestionOption, QuestionTypeCode, Section } from "../../../../src/types/content";

/**
 * Listening: 4 parts, 40 questions, ~30 minutes. The audio for each part plays
 * once and cannot be replayed or scrubbed. audioUrl is left unset until the
 * audio is generated from the transcripts.
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

function match(number: number, prompt: string, options: QuestionOption[], answer: string, explanation: string): Question {
  return { id: `l-q${number}`, number, type: "matching_features", prompt, options, acceptedAnswers: [answer], explanation };
}

const TRANSCRIPT_1 = `AGENT: Good afternoon, Fellside Walking Holidays, Mark speaking. How can I help?
LINDA: Hello. I'm interested in booking one of your self-guided walking holidays, and I'd like to check a few details first.
AGENT: Certainly. I'll fill in a booking form as we go, and you can confirm at the end. Could I take your name, please?
LINDA: Yes, it's Linda Fairbrother.
AGENT: Is that Fairbrother as in F-A-I-R-B-R-O-T-H-E-R?
LINDA: That's right, all one word.
AGENT: Thank you. And your postcode?
LINDA: It's BS8 4RT. Sorry, I've just moved, so I nearly gave you my old one, which was BS6.
AGENT: BS8 4RT. Got it. Now, which holiday were you thinking of?
LINDA: I was looking at the Coastal Path walk at first, but some of the cliff sections look quite steep. A friend recommended the Larch Valley walk instead.
AGENT: The Larch Valley walk is lovely, and much gentler. That's L-A-R-C-H. We offer it as a four-night, six-night or eight-night trip.
LINDA: Four nights seems too short to travel all that way, and eight is more than I can take off work. So six nights, please.
AGENT: Six nights. And when would you like to set off? We run it from May to September.
LINDA: I was hoping for the sixteenth of June, but I imagine that's busy.
AGENT: I'm afraid the sixteenth is full. The next available departure is the twenty-third of June.
LINDA: The twenty-third is fine. That's a Saturday, isn't it?
AGENT: It is. Now, accommodation. On this route we can put you in small hotels, bed and breakfasts or farmhouses.
LINDA: I stayed in hotels on my last trip and found them rather impersonal. B and Bs can be nice, but I'd really prefer farmhouse accommodation, if possible. I love the idea of a big breakfast in a farm kitchen.
AGENT: Farmhouses are available every night on that route, so that's no problem. The price for six nights, sharing a room, is four hundred and ninety pounds per person, but as you're travelling alone there's a supplement, which brings it to five hundred and forty pounds per person.
LINDA: Five hundred and forty. That's a little more than I expected, but it's all right. Does that include moving my luggage between farmhouses?
AGENT: Luggage transfer isn't included, I'm afraid. It's an extra twelve pounds per day. Some people manage with a large rucksack, but most clients find it worth paying.
LINDA: Twelve pounds a day. Yes, I'll definitely have that. I don't want to carry everything up hills.
AGENT: Sensible. Do you have any dietary requirements? The farmhouses provide breakfast and an evening meal.
LINDA: I don't have any allergies, but I am vegetarian. I eat fish occasionally, but please just put vegetarian.
AGENT: Vegetarian. I'll pass that on to each farmhouse. And finally, may I ask how you heard about us? We like to know which advertising works.
LINDA: Well, a friend has mentioned you a few times, and I've looked at your website, of course. But it was actually an article in a walking magazine that made me ring. There was a whole page about your Larch Valley route.
AGENT: Oh, that's good to hear. I'll put magazine. Right, I'll email you the booking form now, and once you've paid the deposit, your place is confirmed.
LINDA: Wonderful. Thanks for your help, Mark.
AGENT: You're welcome, Ms Fairbrother. Enjoy your walk.`;

const TRANSCRIPT_2 = `OFFICER: Good morning. My name is Rachel Osei, and I'm the waste services officer for the city council. I've been invited onto the programme this morning to explain the new food waste collection scheme, which will change how every household in the city deals with its rubbish.
OFFICER: Let's start with the date. Some of you may have read that the scheme was going to start on the first of March. That was the original plan, but delivering equipment to every household took longer than we expected, so the scheme now starts on the first of April. There will be a review after the first two months, at the beginning of June.
OFFICER: People often ask me why we're doing this. Yes, there's a national target for recycling, and we're close to meeting it already. And it's true that some residents have been asking for food collections for years. But the main reason is cost. Every tonne of rubbish we send to landfill costs the city over a hundred pounds, and food makes up about a third of the average bin. Reducing landfill costs means more money for other services. As a bonus, the compost produced will be used in the city's parks.
OFFICER: So, what do you need to do? Every household will get two containers: a small kitchen caddy to keep by the sink and a larger outdoor bin. You don't need to buy anything, and you don't need to go and collect them from your local library, as some people have suggested. The caddies will be delivered to homes over the next three weeks, and they'll be left on your doorstep.
OFFICER: Food waste will be collected weekly, on the same day as your other rubbish. We did consider collecting it twice a week in summer, but in practice a weekly service is enough if the lid is kept closed. Your general waste will now go fortnightly.
OFFICER: Now, what can go into the caddy? Almost any food, cooked or raw: fruit and vegetable peelings, tea bags, meat, cooked bones and eggshells are all fine. However, please don't put plastic bags in the caddy, even if they claim to be biodegradable, because they jam our machinery. And cooking oil should never go in either. Small amounts can be soaked up with kitchen paper and put in general waste.
OFFICER: To keep the caddy clean, you can line it with compostable liners. A roll of these will be supplied free for the first year, along with your caddy. After that, you'll need to buy them, and they're on sale in most supermarkets, although you don't have to use any particular brand. Alternatively, and this is what I do, you can simply wrap your food waste in newspaper. Any newspaper is acceptable, and it works just as well.
OFFICER: Finally, I know people are confused about where other items should go, so here are a few examples. Pizza boxes cause a lot of arguments. As long as they're clean, they go in your recycling box with other cardboard. Any leftover pizza goes in the food caddy, of course. Garden waste, such as grass and hedge cuttings, goes in the garden bin, not the food caddy, because the woody material takes too long to break down. Broken glass is dangerous for our crews to sort, so please don't put it in the recycling box. Wrap it carefully and put it in general waste. And old batteries must not go in any of your bins at home, because they can start fires in the lorries. Please take them to the recycling centre on Mill Road, or to a supermarket collection point.
OFFICER: If you have any more questions, the full details are on the council website. Thank you.`;

const TRANSCRIPT_3 = `KATE: Thanks for seeing us, Professor Lane. We wanted to talk about our presentation on urban beekeeping.
PROFESSOR LANE: Of course. Remind me why you chose the topic, Kate?
KATE: Well, people assume it's because my uncle keeps bees, and he does, but that wasn't really it. And we'd both seen the news stories about bees declining. But it was the lecture last term on pollinators in cities that got us interested. That's what made us want to find out more.
PROFESSOR LANE: Good. And how has the research gone, Omar?
OMAR: Mostly well. Interviewing the beekeepers was easier than I expected, actually, because they love talking about their hives. The chemistry of honey was quite complicated, but we got there. The hardest part was finding recent data. Most of the figures on city hives are more than ten years old.
PROFESSOR LANE: That's a common problem. I've looked at your draft slides, by the way. The length is about right, and you've got plenty of visuals, and the structure is clear. My concern is that it's too technical at the moment. Your audience are first-year students, and some of the material on hive biology will lose them.
KATE: OK, we can simplify that section. We were also wondering how to open the presentation. I suggested starting with a short video of a rooftop hive.
OMAR: And I thought we could ask the audience a question, or show a statistic about how many hives there are in London.
PROFESSOR LANE: Those would all work, but I think something people can see and touch is more memorable.
KATE: In that case, why don't we open with a jar of honey from a city hive? We could pass it round.
OMAR: Yes, let's open with the jar of honey. It's much more memorable than a statistic.
PROFESSOR LANE: Excellent. Now, on sources. You've cited a textbook and a few blogs, which is fine for background, and there's a government report from 2008. But the one I'd really recommend you cite is the 2019 survey of urban beekeepers. It's the most recent large study.
OMAR: We'll add the 2019 survey. Can we quickly go through the other sources with you?
PROFESSOR LANE: Go ahead.
OMAR: First, the city council report. It's very reliable, but it's outdated now, because it was published before the hive registration scheme started.
PROFESSOR LANE: Fair. And the beekeepers' association website?
KATE: That has lots of information, but it's biased. The association wants more people to keep bees, so it tends to play down the problems, like the competition with wild bees.
PROFESSOR LANE: Right. What about the journal article by Moreno?
OMAR: That's definitely been the most useful. It compares hive health in twelve cities, and it has the exact data we need for the main section.
KATE: Then there's the documentary we watched. It was enjoyable, but too general for us. It covered bees all over the world and only mentioned cities for a few minutes.
PROFESSOR LANE: And the university's own hive records?
OMAR: We'd love to use those, but they're hard to obtain. They're kept in paper files in the biology department, and we need special permission to see them.
PROFESSOR LANE: I can help you with that. Send me an email and I'll speak to the department.
KATE: Thank you, that would be great.`;

const TRANSCRIPT_4 = `LECTURER: Good morning, everyone. In today's lecture on the history of materials, we're going to look at glass, which is one of the oldest manufactured materials and still one of the most important.
LECTURER: The earliest glass objects we know of were made in Mesopotamia, roughly four and a half thousand years ago. They weren't windows or vessels. Glass was first used for beads, which were valued as highly as precious stones, and were often traded over long distances.
LECTURER: The basic recipe has changed surprisingly little since then. The main raw material is sand, which is mostly silica. On its own, silica melts only at an extremely high temperature, far beyond what early furnaces could reach. So glassmakers added plant ash, which lowers the melting temperature to a level that a wood fire can manage. Lime was also added to make the glass stable, so that it didn't dissolve in water.
LECTURER: For centuries, glass was shaped by pouring it into moulds or winding it around a core, which was slow and expensive. The real breakthrough came from the Romans, who invented glass blowing around fifty BC. A worker could now inflate a bubble of molten glass on the end of a pipe and shape it in minutes, and glass vessels became cheap enough for ordinary households.
LECTURER: Let's move forward to medieval Venice, which became the centre of European glassmaking. In 1291, the city's glassmakers were ordered to move their furnaces to the island of Murano. The official reason was the risk of fire, since the city was built largely of wood and the furnaces burned day and night. But there was another benefit for the authorities: it was easier to keep the glassmakers' secrets on a small island.
LECTURER: Those secrets were valuable. In the fifteenth century, Venetian workers developed an almost perfectly clear glass called cristallo. Ordinary glass had a greenish tint caused by iron in the sand, so they added manganese to remove the colour. Cristallo was so profitable that glassmakers were forbidden to leave the republic, and those who did could face severe punishment.
LECTURER: In England, the most important development came in the 1670s, when George Ravenscroft added lead oxide to the mixture. Lead glass was heavier and more brilliant than cristallo, and easier to cut, which is why it is still used for fine crystal today.
LECTURER: Flat glass for windows remained difficult to make until the twentieth century. Then, in the 1950s, Alastair Pilkington developed the float process. Molten glass is poured onto a bath of liquid tin. Because the glass floats on the surface of the tin, it spreads out into a perfectly flat, even sheet, with no need for grinding or polishing.
LECTURER: That brings us to the present. You might expect most glass to go into bottles and jars, or into screens for phones and computers. In fact, the largest share of glass produced today, by a considerable margin, is used in construction, mainly for windows and the glass walls of office buildings. And that's what we'll look at next week, when we discuss energy efficiency in buildings.`;

const part1: ItemGroup = {
  id: "lg-1",
  partNumber: 1,
  title: "Part 1 — Booking a walking holiday",
  stimulusKind: "audio",
  transcript: TRANSCRIPT_1,
  instructions:
    "Questions 1-10. Complete the booking form below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.",
  questions: [
    gap(1, "note_completion", "Customer's name: Linda ______", ["Fairbrother"], 'The agent spells it: "F-A-I-R-B-R-O-T-H-E-R", and Linda confirms "all one word."'),
    gap(2, "note_completion", "Postcode: ______", ["BS8 4RT"], 'Linda says "It\'s BS8 4RT"; BS6 was her old postcode.'),
    gap(3, "note_completion", "Holiday chosen: the ______ Valley walk", ["Larch"], 'She rejects the Coastal Path walk: "A friend recommended the Larch Valley walk instead."'),
    gap(4, "note_completion", "Length of trip: ______ nights", ["six", "6"], 'Four is too short and eight too long: "So six nights, please."'),
    gap(5, "note_completion", "Departure date: ______ June", ["23rd", "23", "twenty-third"], 'The sixteenth is full: "The next available departure is the twenty-third of June."'),
    gap(6, "note_completion", "Type of accommodation: ______", ["farmhouse", "farmhouses"], 'She found hotels impersonal: "I\'d really prefer farmhouse accommodation."'),
    gap(7, "note_completion", "Price per person (including supplement): £______", ["540"], 'The supplement "brings it to five hundred and forty pounds per person"; £490 is the sharing price.'),
    gap(8, "note_completion", "Luggage transfer: £______ per day extra", ["12", "twelve"], '"It\'s an extra twelve pounds per day."'),
    gap(9, "note_completion", "Dietary requirement: ______", ["vegetarian"], 'Linda says "please just put vegetarian."'),
    gap(10, "note_completion", "Heard about the company from: a ______", ["magazine", "walking magazine"], 'Not the friend or website: "it was actually an article in a walking magazine that made me ring."'),
  ],
};

const BINS = [
  { value: "A", label: "A. Food caddy" },
  { value: "B", label: "B. Garden bin" },
  { value: "C", label: "C. Recycling box" },
  { value: "D", label: "D. General waste" },
  { value: "E", label: "E. Recycling centre" },
];

const part2: ItemGroup = {
  id: "lg-2",
  partNumber: 2,
  title: "Part 2 — A radio talk about a food waste scheme",
  stimulusKind: "audio",
  transcript: TRANSCRIPT_2,
  instructions:
    "Questions 11-20. Choose the correct letter for Questions 11-14, choose TWO letters for Questions 15-16, and for Questions 17-20 say where each item should go.",
  questions: [
    choice(11, "The food waste scheme will start on", ["1 March", "1 April", "1 May", "1 June"], "B", 'March was the original plan, but "the scheme now starts on the first of April."'),
    choice(12, "According to the speaker, the main reason for the scheme is to", ["reduce the cost of landfill", "meet a national recycling target", "respond to residents' requests", "produce compost for the parks"], "A", '"the main reason is cost ... Reducing landfill costs means more money for other services."'),
    choice(13, "Kitchen caddies will be", ["delivered to homes", "collected from libraries", "bought from the council", "sold in supermarkets"], "A", '"The caddies will be delivered to homes over the next three weeks."'),
    choice(14, "Food waste will be collected", ["twice a week", "every week", "every two weeks", "once a month"], "B", '"Food waste will be collected weekly"; it is general waste that goes fortnightly.'),
    multi(15, "Which TWO items should NOT be put in the food caddy? Choose TWO letters.", ["tea bags", "cooked bones", "plastic bags", "eggshells", "cooking oil"], ["C", "E"], '"please don\'t put plastic bags in the caddy" and "cooking oil should never go in either"; tea bags, bones and eggshells "are all fine."'),
    multi(16, "Which TWO things does the speaker say about caddy liners? Choose TWO letters.", ["They are free for the first year.", "Newspaper can be used instead.", "They can be collected from libraries.", "Only the council's own brand may be used.", "They are delivered every month."], ["A", "B"], 'Liners "will be supplied free for the first year", and "Any newspaper is acceptable"; "you don\'t have to use any particular brand."'),
    match(17, "Clean pizza boxes", BINS, "C", '"As long as they\'re clean, they go in your recycling box with other cardboard."'),
    match(18, "Hedge cuttings", BINS, "B", '"grass and hedge cuttings, goes in the garden bin, not the food caddy."'),
    match(19, "Broken glass", BINS, "D", '"Wrap it carefully and put it in general waste."'),
    match(20, "Old batteries", BINS, "E", '"Please take them to the recycling centre on Mill Road."'),
  ],
};

const SOURCE_COMMENTS = [
  { value: "A", label: "A. reliable but out of date" },
  { value: "B", label: "B. too general" },
  { value: "C", label: "C. the most useful" },
  { value: "D", label: "D. biased" },
  { value: "E", label: "E. difficult to obtain" },
  { value: "F", label: "F. too short" },
];

const part3: ItemGroup = {
  id: "lg-3",
  partNumber: 3,
  title: "Part 3 — Planning a presentation on urban beekeeping",
  stimulusKind: "audio",
  transcript: TRANSCRIPT_3,
  instructions:
    "Questions 21-30. Choose the correct letter for Questions 21-25. For Questions 26-30, what do the students say about each source? Choose the correct letter, A-F.",
  questions: [
    choice(21, "The students chose the topic mainly because of", ["Kate's uncle's hives", "a lecture they attended", "news stories about bee decline", "a visit to a rooftop garden"], "B", 'Kate says "it was the lecture last term on pollinators in cities that got us interested."'),
    choice(22, "Omar says the most difficult part of the research was", ["finding recent data", "interviewing beekeepers", "understanding the chemistry of honey", "keeping within the time limit"], "A", '"The hardest part was finding recent data."'),
    choice(23, "Professor Lane thinks the presentation is currently", ["too long", "short of visuals", "too technical", "poorly structured"], "C", '"My concern is that it\'s too technical at the moment."'),
    choice(24, "The students decide to open the presentation with", ["a short video", "a question for the audience", "a statistic about London", "a jar of honey"], "D", 'Omar agrees: "Yes, let\'s open with the jar of honey."'),
    choice(25, "Professor Lane recommends that they cite", ["a government report", "the 2019 survey", "a textbook", "a beekeeping blog"], "B", '"the one I\'d really recommend you cite is the 2019 survey of urban beekeepers."'),
    match(26, "The city council report", SOURCE_COMMENTS, "A", '"It\'s very reliable, but it\'s outdated now."'),
    match(27, "The beekeepers' association website", SOURCE_COMMENTS, "D", '"That has lots of information, but it\'s biased."'),
    match(28, "The journal article by Moreno", SOURCE_COMMENTS, "C", '"That\'s definitely been the most useful."'),
    match(29, "The documentary", SOURCE_COMMENTS, "B", '"It was enjoyable, but too general for us."'),
    match(30, "The university's hive records", SOURCE_COMMENTS, "E", '"We\'d love to use those, but they\'re hard to obtain."'),
  ],
};

const part4: ItemGroup = {
  id: "lg-4",
  partNumber: 4,
  title: "Part 4 — Lecture on the history of glass",
  stimulusKind: "audio",
  transcript: TRANSCRIPT_4,
  instructions: "Questions 31-40. Complete the notes below. Write ONE WORD ONLY for each answer.",
  questions: [
    gap(31, "note_completion", "Early glass (Mesopotamia): first used for making ______", ["beads"], '"Glass was first used for beads, which were valued as highly as precious stones."', 1),
    gap(32, "note_completion", "Main raw material: ______ (mostly silica)", ["sand"], '"The main raw material is sand, which is mostly silica."', 1),
    gap(33, "note_completion", "Plant ash added to lower the melting ______", ["temperature", "point"], 'Glassmakers "added plant ash, which lowers the melting temperature."', 1),
    gap(34, "note_completion", "Romans: invented glass ______ around 50 BC", ["blowing"], '"the Romans, who invented glass blowing around fifty BC."', 1),
    gap(35, "note_completion", "Venice, 1291: furnaces moved to Murano because of the risk of ______", ["fire", "fires"], '"The official reason was the risk of fire."', 1),
    gap(36, "note_completion", "Cristallo: ______ added to remove the green colour", ["manganese"], '"they added manganese to remove the colour."', 1),
    gap(37, "note_completion", "Glassmakers were not allowed to ______ the republic", ["leave"], '"glassmakers were forbidden to leave the republic."', 1),
    gap(38, "note_completion", "Ravenscroft (1670s): added ______ oxide", ["lead"], '"George Ravenscroft added lead oxide to the mixture."', 1),
    gap(39, "note_completion", "Float process (1950s): molten glass poured onto liquid ______", ["tin"], '"Molten glass is poured onto a bath of liquid tin."', 1),
    gap(40, "note_completion", "Today the largest share of glass is used in ______", ["construction", "buildings"], 'Not bottles or screens: "the largest share of glass produced today ... is used in construction."', 1),
  ],
};

export const listeningSection: Section = {
  code: "listening",
  title: "Listening",
  durationMinutes: 30,
  questionCount: 40,
  itemGroups: [part1, part2, part3, part4],
};
