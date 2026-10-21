import type { ItemGroup, Question, QuestionTypeCode, Section } from "../../../../src/types/content";

/**
 * Listening: 4 parts, 40 questions, ~30 minutes. Foundation level: clear
 * speech, answers stated plainly with one simple distractor each.
 * audioUrl is left undefined until generate-audio writes the R2 URL.
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

function choice(number: number, prompt: string, options: string[], answer: string, explanation: string): Question {
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
    explanation,
  };
}

function match(
  number: number,
  prompt: string,
  options: { value: string; label: string }[],
  answer: string,
  explanation: string,
): Question {
  return { id: `l-q${number}`, number, type: "matching_features", prompt, options, acceptedAnswers: [answer], explanation };
}

const part1: ItemGroup = {
  id: "lg-1",
  partNumber: 1,
  title: "Part 1 — Hiring bicycles for a family holiday",
  stimulusKind: "audio",
  instructions:
    "Questions 1-10. Complete the booking form below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.",
  transcript: `LUCY: Good morning, Greenway Cycle Hire, Lucy speaking. How can I help you?
DANIEL: Oh, hello. I'm calling because my family and I are coming to the area on holiday next month, and we'd like to hire some bikes while we're there.
LUCY: Lovely. I can certainly help with that. Can I start by taking your name?
DANIEL: Yes, it's Daniel Ferris.
LUCY: Is that F-A-R-R-I-S?
DANIEL: No, it's F-E-R-R-I-S. Ferris.
LUCY: Thank you, Mr Ferris. And how many bikes will you need?
DANIEL: Well, when I first looked at your website I thought we'd need four, but my mother has decided she'd rather walk, so it's just three bikes now. One for me, one for my wife and one for our son.
LUCY: Three bikes, then. Do you know what kind of bikes you'd like? We have road bikes, hybrid bikes, mountain bikes and electric bikes.
DANIEL: My wife and I are happy with hybrid bikes, I think. We're not planning anything too difficult.
LUCY: That's what most people choose. And your son?
DANIEL: He's fourteen, and he's very keen on going off the paths into the woods, so he's asked for a mountain bike.
LUCY: No problem, we have plenty of those in his size. Now, when would you like to start the hire?
DANIEL: We arrive on the tenth of July, but that's a Saturday and we'll be tired from the drive, and on the Sunday we're visiting friends. So could we start on Monday, the twelfth of July?
LUCY: Yes, the twelfth is fine. And for how long?
DANIEL: We're staying a full week, but I think five days of cycling will be enough for us.
LUCY: Five days, starting on the twelfth. Let me tell you about the prices. The hybrid and mountain bikes are eighteen pounds per bike per day. The electric bikes are more expensive, at twenty-two pounds a day.
DANIEL: Eighteen pounds is fine. We don't need electric ones. What about helmets? Do we have to pay extra for those?
LUCY: No, helmets are free with every bike. We also have child seats and baskets, but there is a small charge for those.
DANIEL: We won't need child seats, but a basket might be useful. I'll think about it.
LUCY: You can decide on the day. Now, where would you like to collect the bikes? We have two shops. The main one is in the town centre, next to the post office, but most visitors use our smaller shop, which is right next to the station.
DANIEL: We'll be driving, but I think the shop next to the station is closer to our cottage, so we'll collect them from there.
LUCY: That's fine. There's a car park just behind it too. When you come, please remember to bring some identification with you.
DANIEL: Would my driving licence be OK?
LUCY: I'm afraid we can't accept driving licences any more, because so many people use digital ones now. We need to see a passport.
DANIEL: Right, I'll make sure I bring my passport. Is there anything else?
LUCY: Not for the booking, but can I recommend a route? Lots of families enjoy the Castle Trail, but it's quite hilly and there's a lot of traffic in the summer.
DANIEL: That doesn't sound ideal.
LUCY: No. For you I'd really recommend the Riverside Trail. It's completely flat, it follows the river for twenty kilometres, and there's a lovely café halfway along.
DANIEL: The Riverside Trail sounds perfect. Thank you so much.
LUCY: You're welcome. I'll email you the booking details this afternoon.
DANIEL: Great. Goodbye.
LUCY: Goodbye, Mr Ferris.`,
  questions: [
    gap(1, "note_completion", "Customer name: Daniel ______", ["Ferris"], 'Daniel spells his name: "No, it\'s F-E-R-R-I-S. Ferris."'),
    gap(2, "note_completion", "Number of bikes needed: ______", ["3", "three"], 'He first thought four but says "so it\'s just three bikes now."'),
    gap(3, "note_completion", "Type of bike for son: ______ bike", ["mountain"], 'Daniel says "he\'s asked for a mountain bike."'),
    gap(4, "note_completion", "Hire starts on: ______ July", ["12th", "12", "twelfth"], 'They arrive on the tenth but ask to start "on Monday, the twelfth of July".'),
    gap(5, "note_completion", "Length of hire: ______ days", ["5", "five"], 'Daniel says "five days of cycling will be enough for us."'),
    gap(6, "note_completion", "Cost per bike per day: £______", ["18", "eighteen"], 'Lucy says hybrid and mountain bikes "are eighteen pounds per bike per day"; the electric bikes are the distractor.'),
    gap(7, "note_completion", "Helmets are ______", ["free", "included"], 'Lucy confirms "helmets are free with every bike."'),
    gap(8, "note_completion", "Collection point: the shop next to the ______", ["station", "railway station"], 'Daniel chooses to collect "from there", "the shop next to the station".'),
    gap(9, "note_completion", "Identification required: a ______", ["passport"], 'A driving licence is refused: "We need to see a passport."'),
    gap(10, "note_completion", "Recommended route: the ______ Trail", ["Riverside"], 'Lucy says "For you I\'d really recommend the Riverside Trail."'),
  ],
};

const AREAS = [
  { value: "A", label: "A. a children's play area" },
  { value: "B", label: "B. guided talks" },
  { value: "C", label: "C. seating in the shade" },
  { value: "D", label: "D. plants for sale" },
  { value: "E", label: "E. a café" },
  { value: "F", label: "F. an exhibition of sculptures" },
];

const part2: ItemGroup = {
  id: "lg-2",
  partNumber: 2,
  title: "Part 2 — Welcome talk at a botanical garden",
  stimulusKind: "audio",
  instructions:
    "Questions 11-20. Choose the correct letter for Questions 11-14. For Questions 15-18, choose what each area of the garden offers (A-F). For Questions 19-20, write NO MORE THAN TWO WORDS AND/OR A NUMBER.",
  transcript: `GUIDE: Good morning, everyone, and welcome to Ashford Botanical Garden. My name is Peter, and I'll be your guide this morning. Before we set off, I'd like to tell you a little about the garden and explain what you can see today.
GUIDE: Many visitors think the garden is much older than it really is, because some of the trees here are more than two hundred years old. In fact, those trees belonged to a private estate. The land was bought by the town council in 1872, but it took almost twenty years to design and plant the gardens, so the garden was first opened to the public in 1890. The large glasshouse you can see behind me was added much later, in 1925.
GUIDE: Now, today's tour. The programme says that it lasts one hour, but that information is out of date. We've added a visit to the new glasshouse, so the tour now lasts an hour and a half. If anyone needs to leave early, that's no problem at all, just let me know.
GUIDE: A few simple rules before we start. You are very welcome to take photographs anywhere in the garden, including inside the glasshouses. You may also touch most of the plants, except the ones with red labels, which can be harmful. The one thing we do ask is that you don't feed the birds. The ducks and swans on the lake become ill if they eat bread, so please keep your sandwiches to yourselves.
GUIDE: Our newest attraction is the Tropical House, which opened last spring. Many people expect it to be full of cactus plants, but those are in our desert collection in the old glasshouse. The Tropical House is warm and very humid, because it contains plants from rainforests in South America and Asia, including some very rare orchids.
GUIDE: Let me now tell you about the four main areas of the garden. First, the Rose Garden. This is our most famous area, and in June it's full of colour. This year it's also where you'll find an exhibition of sculptures by local artists, so do take your time walking around it. The sculptures will be there until the end of September.
GUIDE: Next to the Rose Garden is the lake. People often ask if there's a play area for children near the water, but for safety reasons there isn't one. The play area is at the main entrance. What you will find by the lake is our café, which serves hot meals and has a terrace looking over the water.
GUIDE: Then there's the Herb Garden. It was planted by monks hundreds of years ago, although what you see today is a modern copy. Every plant is labelled with its traditional uses in cooking and medicine. If you like what you see, the small shed at the gate sells plants grown here in the garden, so you can take some home.
GUIDE: Finally, the Japanese Garden. It's the quietest part of the garden. We used to give guided talks there on Sunday afternoons, but those have stopped for this year. However, it's a wonderful place to rest, because there's plenty of seating in the shade under the maple trees, which is very welcome on a hot day.
GUIDE: Just two more practical points. The gift shop is beside the main entrance. The sign on the door says it closes at half past four, but in summer it stays open until 5 pm, so you have plenty of time after the tour.
GUIDE: And if you enjoy your visit today, you might like to buy an annual pass. A single ticket costs eight pounds, but an annual pass costs just forty pounds and lets you visit as often as you like for twelve months. You can buy one in the gift shop.
GUIDE: Right, if everyone's ready, let's start by walking down to the Rose Garden.`,
  questions: [
    choice(11, "The garden was first opened to the public in", ["1872", "1890", "1925"], "B", 'The guide says "the garden was first opened to the public in 1890"; 1872 is when the land was bought.'),
    choice(12, "How long does today's tour last?", ["45 minutes", "one hour", "an hour and a half"], "C", 'The programme is out of date: "the tour now lasts an hour and a half."'),
    choice(13, "Visitors are asked not to", ["feed the birds", "touch any plants", "take photographs in the glasshouses"], "A", 'The guide says "The one thing we do ask is that you don\'t feed the birds."'),
    choice(14, "The Tropical House contains plants from", ["deserts", "rainforests", "mountains"], "B", 'The Tropical House "contains plants from rainforests in South America and Asia".'),
    match(15, "Rose Garden", AREAS, "F", 'The guide says the Rose Garden "it\'s also where you\'ll find an exhibition of sculptures by local artists".'),
    match(16, "Lake", AREAS, "E", 'There is no play area by the lake; "What you will find by the lake is our café".'),
    match(17, "Herb Garden", AREAS, "D", 'At the Herb Garden "the small shed at the gate sells plants grown here in the garden".'),
    match(18, "Japanese Garden", AREAS, "C", 'Guided talks "have stopped", but "there\'s plenty of seating in the shade under the maple trees".'),
    gap(19, "note_completion", "In summer the gift shop closes at ______", ["5 pm", "5pm", "5", "five", "17:00"], 'The sign says half past four, "but in summer it stays open until 5 pm".'),
    gap(20, "note_completion", "An annual pass costs £______", ["40", "forty"], 'The guide says "an annual pass costs just forty pounds".'),
  ],
};

const PEOPLE = [
  { value: "A", label: "A. Maya" },
  { value: "B", label: "B. Ben" },
  { value: "C", label: "C. both Maya and Ben" },
];

const part3: ItemGroup = {
  id: "lg-3",
  partNumber: 3,
  title: "Part 3 — Planning a presentation on campus recycling",
  stimulusKind: "audio",
  instructions:
    "Questions 21-30. Choose the correct letter for Questions 21-25. For Questions 26-30, decide who will do each task: A Maya, B Ben, or C both.",
  transcript: `DR HOLT: Come in, Maya, Ben. So, you wanted to talk about your presentation for the environmental studies module.
MAYA: Yes, thank you, Dr Holt. We've chosen the topic of recycling on campus, and we'd like your advice before we go much further.
DR HOLT: Good. Can I ask why you chose that topic? There were quite a few on the list.
BEN: Well, it wasn't because there's lots of research on it. Actually, there's very little. It's more that we both work part-time in the student café, and we see so much plastic thrown away every day. We wanted to understand why.
MAYA: Yes, it's a personal interest really. We see the problem with our own eyes.
DR HOLT: That's a good reason. What have you done so far?
MAYA: We've carried out a survey. We hoped to get two hundred responses, but in the end a hundred and twenty students completed it.
DR HOLT: A hundred and twenty is perfectly acceptable for a project of this size. What did you find?
BEN: The first thing was that most students say they recycle regularly. About eighty per cent said they always or usually recycle.
DR HOLT: That doesn't surprise me. People tend to report good behaviour in surveys.
MAYA: No, but what really surprised us was that most students didn't know which bin to use. When we showed them pictures of common items, like coffee cups and sandwich boxes, more than half chose the wrong bin.
DR HOLT: That is interesting. So they want to recycle, but they don't know how.
BEN: Exactly. We also wanted to compare students and staff, but not enough staff answered, so we've left that out.
DR HOLT: Sensible. Now, I've looked at your draft slides. The visuals are clear, and you have plenty of statistics, perhaps even too many. What it needs is more focus on solutions. At the moment you describe the problem very well, but you don't say what the university could do about it.
MAYA: That's true. We spent most of our time on the survey results.
DR HOLT: The audience will want to know what should change. Remember, you have fifteen minutes in total. Some groups have asked for twenty, but I'm afraid fifteen is the limit, including questions.
BEN: OK, fifteen minutes. So we'll need to cut some of the numbers.
DR HOLT: Yes. Now, have you decided who's doing what?
MAYA: Mostly. Ben is much better at design than I am, so he's going to do the slides.
BEN: I'm happy to do that. I'll make them simpler, too.
DR HOLT: And the solutions section? You'll need some information from the university.
MAYA: I'll contact the facilities manager. I met her at an open day, so I'll email her this week and ask what the university is planning.
DR HOLT: Good. Will you give the audience a handout?
BEN: I was going to write it, but Maya's notes are much better organised than mine.
MAYA: That's fine, I'll write the handout. Ben, you've got enough to do with the slides.
DR HOLT: What about rehearsing? Timing is where most groups go wrong.
BEN: We'll practise the timing together. We've booked a seminar room for next Thursday so we can run through it twice.
MAYA: Yes, we'll both be there.
DR HOLT: Excellent. And who's preparing the conclusion?
MAYA: I thought I'd do it, but I'll be busy with the handout and the facilities manager.
BEN: So I'll prepare the conclusion. It should link closely to the slides anyway.
DR HOLT: That sounds like a sensible division. Send me the new slides by Friday and I'll give you some quick feedback.
MAYA: Thank you, Dr Holt. That's really helpful.`,
  questions: [
    choice(21, "Why did the students choose recycling as their topic?", ["Their tutor suggested it.", "It relates to their part-time job.", "A lot of research is available on it."], "B", 'Ben says "we both work part-time in the student café, and we see so much plastic thrown away every day."'),
    choice(22, "How many students completed the survey?", ["80", "120", "200"], "B", 'Maya says "in the end a hundred and twenty students completed it"; two hundred was only their hope.'),
    choice(23, "What surprised the students most?", ["Students did not know which bin to use.", "Students hardly ever recycled.", "Staff recycled less than students."], "A", 'Maya says "what really surprised us was that most students didn\'t know which bin to use."'),
    choice(24, "Dr Holt says the presentation needs more", ["visuals", "statistics", "focus on solutions"], "C", 'Dr Holt says "What it needs is more focus on solutions."'),
    choice(25, "How long can the presentation last?", ["10 minutes", "15 minutes", "20 minutes"], "B", 'Dr Holt says "you have fifteen minutes in total" and "fifteen is the limit".'),
    match(26, "design the slides", PEOPLE, "B", 'Maya says "Ben is much better at design than I am, so he\'s going to do the slides."'),
    match(27, "contact the facilities manager", PEOPLE, "A", 'Maya says "I\'ll contact the facilities manager."'),
    match(28, "write the handout", PEOPLE, "A", 'Ben suggests Maya, and she agrees: "That\'s fine, I\'ll write the handout."'),
    match(29, "practise the timing", PEOPLE, "C", 'Ben says "We\'ll practise the timing together" and Maya adds "we\'ll both be there."'),
    match(30, "prepare the conclusion", PEOPLE, "B", 'Maya is too busy, so Ben says "So I\'ll prepare the conclusion."'),
  ],
};

const part4: ItemGroup = {
  id: "lg-4",
  partNumber: 4,
  title: "Part 4 — Lecture: how honeybees communicate",
  stimulusKind: "audio",
  instructions:
    "Questions 31-40. Complete the notes below. Write ONE WORD AND/OR A NUMBER for each answer.",
  transcript: `LECTURER: Good afternoon. In today's lecture I'm going to talk about one of the most remarkable animals in the natural world, the honeybee, and in particular about how honeybees share information with each other. Then, at the end, I'll say something about the problems bees face today.
LECTURER: Let's begin with communication. A honeybee colony depends on finding food, which means nectar and pollen from flowers. But flowers may be several kilometres away from the hive. So when a worker bee, which we call a forager, finds a good source of food, she needs a way to tell the other bees where it is. She does this by dancing.
LECTURER: The most famous of these dances is called the waggle dance. The bee walks forward in a straight line on the wall of the hive, shaking her body from side to side, and then circles back to the start and repeats the movement many times.
LECTURER: There is also a simpler dance, called the round dance. In the round dance the bee simply runs in small circles. It tells the other bees that there is food close to the hive, within about fifty metres, but it doesn't say in which direction. The other bees just fly out and search the area nearby.
LECTURER: The waggle dance is much more informative. It gives both direction and distance. Direction is shown by the angle of the straight run. If the bee runs straight up the wall of the hive, the food is in the same direction as the sun. If she runs at an angle to the right, the food is at that same angle to the right of the sun. So the dance is always relative to the sun, which is quite extraordinary when you think that it happens in the dark inside the hive.
LECTURER: What about distance? You might expect the speed of the dance to show this, but in fact it's the length of the waggle run that shows the distance. A longer waggle means the food is further away.
LECTURER: This system was discovered by an Austrian scientist called Karl von Frisch. He studied bees for many years, starting in the 1920s, and he was awarded the Nobel Prize in 1973 for this work. At first many scientists didn't believe him, but later experiments with robotic bees confirmed that he was right.
LECTURER: Dancing isn't the only way bees share information, though. When a forager returns, she carries the scent of the flowers on her body. The other bees smell this, so they use scent to identify the right kind of flower when they arrive at the location.
LECTURER: Let me now say a little about the colony itself. A colony may contain up to sixty thousand bees, but there is only one queen. She is the only female who lays eggs, and in summer she can lay up to two thousand eggs a day. The workers, who are all female, do everything else. They clean the hive, feed the young, and collect food. Because they work so hard, a worker bee in summer lives for only about six weeks. Bees born in autumn live much longer, because they rest through the winter.
LECTURER: Finally, the problems. You've probably heard that bee numbers are falling in many countries. There are several causes. Some people think pesticides are the main problem, and they certainly play a part. Disease, especially a small parasite called the varroa mite, is another. But most researchers now agree that the biggest single threat is loss of habitat. Modern farms grow huge areas of one crop, and there are fewer hedges and meadows, so bees simply can't find enough different flowers through the year.
LECTURER: Fortunately, there are simple solutions. In many countries, farmers are now paid to plant wildflowers at the edges of their fields. These strips of flowers give bees food from spring to autumn, and studies show that bee numbers recover quite quickly where this is done.
LECTURER: Next week we'll look at how other insects, such as ants, communicate. Thank you.`,
  questions: [
    gap(31, "note_completion", "The main dance used to show where food is: the ______ dance", ["waggle"], 'The lecturer says "The most famous of these dances is called the waggle dance."', 1),
    gap(32, "note_completion", "Round dance: food is within about ______ metres of the hive", ["50", "fifty"], 'The round dance means food is "close to the hive, within about fifty metres".', 1),
    gap(33, "note_completion", "Direction is shown relative to the ______", ["sun"], 'The lecturer says "the dance is always relative to the sun".', 1),
    gap(34, "note_completion", "The length of the waggle run shows the ______", ["distance"], 'Not the speed: "it\'s the length of the waggle run that shows the distance."', 1),
    gap(35, "note_completion", "Karl von Frisch received the Nobel Prize in ______", ["1973"], 'Von Frisch "was awarded the Nobel Prize in 1973 for this work"; the 1920s is when he started.', 1),
    gap(36, "note_completion", "Bees also use ______ to identify the right flower", ["scent", "smell"], 'The other bees "use scent to identify the right kind of flower".', 1),
    gap(37, "note_completion", "In summer the queen can lay up to ______ eggs a day", ["2000", "2,000"], 'The queen "can lay up to two thousand eggs a day"; sixty thousand is the colony size.', 1),
    gap(38, "note_completion", "A summer worker bee lives for about six ______", ["weeks"], 'The lecturer says "a worker bee in summer lives for only about six weeks."', 1),
    gap(39, "note_completion", "The biggest single threat to bees: loss of ______", ["habitat"], 'Pesticides and mites are mentioned, but "the biggest single threat is loss of habitat."', 1),
    gap(40, "note_completion", "Farmers are paid to plant ______ at field edges", ["wildflowers"], 'Farmers "are now paid to plant wildflowers at the edges of their fields."', 1),
  ],
};

export const listeningSection: Section = {
  code: "listening",
  title: "Listening",
  durationMinutes: 30,
  questionCount: 40,
  itemGroups: [part1, part2, part3, part4],
};
