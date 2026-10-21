import type { ItemGroup, Question, QuestionOption, QuestionTypeCode, Section } from "../../../../src/types/content";

/**
 * General Training Listening: identical in format to Academic -- 4 parts,
 * 40 questions, ~30 minutes. audioUrl is left undefined until generated.
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

const choice = (n: number, prompt: string, labels: string[], answer: string, explanation: string) =>
  pick(n, "multiple_choice_single", prompt, letters(labels), answer, explanation);

const TASKS = letters([
  "clearing litter",
  "planting bulbs",
  "repairing benches",
  "painting the boathouse",
  "serving refreshments",
  "guiding visitors",
  "recording wildlife",
]);

const OPINIONS = letters([
  "It was the most reliable source of data.",
  "It took longer than expected.",
  "It produced surprising results.",
  "It should be left out of the report.",
  "It needs to be checked by the tutor.",
  "It was easier than the students thought.",
]);

const part1: ItemGroup = {
  id: "lg-1",
  partNumber: 1,
  title: "Part 1 — Booking a house removal",
  stimulusKind: "audio",
  instructions:
    "Questions 1-10. Complete the booking form below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.",
  transcript: [
    "HELEN: Good morning, Swift Move Removals, Helen speaking. How can I help?",
    "DAVID: Hello. I'm moving house next month and I'd like to book a van and some help with the furniture.",
    "HELEN: Certainly. I'll take a few details first. Could I have your name, please?",
    "DAVID: Yes, it's David Okafor. That's O-K-A-F-O-R.",
    "HELEN: Thank you, Mr Okafor. And where are you moving from?",
    "DAVID: From a flat at 27 Linden Road, here in town. It's on the second floor, and I should warn you there's no lift.",
    "HELEN: No lift, that's useful to know. And the new address?",
    "DAVID: It's a house in Barton, 14 Mill Lane. It's about twenty miles away.",
    "HELEN: Lovely. And what date were you thinking of?",
    "DAVID: Well, I'd originally hoped for Friday the fifth of June, but my landlord has asked me to leave a few days later, so let's say Tuesday the ninth of June.",
    "HELEN: The ninth. Let me check... yes, we have a team free that day. Now, how big is the move? How many bedrooms?",
    "DAVID: Two bedrooms. There's a fair amount of furniture, but the biggest thing is a piano.",
    "HELEN: A piano. Is that an upright or a grand?",
    "DAVID: An upright. It belonged to my grandmother.",
    "HELEN: That's fine, but a piano needs an extra person on the team, and there's a charge for that. Shall I put it down?",
    "DAVID: Yes, please. What's the charge for that?",
    "HELEN: For an upright piano it's an additional sixty-five pounds.",
    "DAVID: OK. And the basic price for the move?",
    "HELEN: For a two-bedroom flat with a midweek date, the standard price is three hundred and forty pounds. If it were a Friday or Saturday it would be three hundred and ninety.",
    "DAVID: Good thing I changed the date, then. Do you provide boxes?",
    "HELEN: We do. We can deliver up to forty cardboard boxes a week before, free of charge, and we collect them afterwards. We also sell packing paper and tape, but most people find the boxes are enough.",
    "DAVID: Forty free boxes is great. I won't need the paper, thanks.",
    "HELEN: Now, do you want us to pack for you, or will you do the packing yourself?",
    "DAVID: I'll pack the boxes myself, but I'd like someone to take the beds apart and put them back together.",
    "HELEN: That's our dismantling service. It's included for up to two beds, so no extra charge there.",
    "DAVID: Excellent. What about insurance? I have quite a lot of glass ornaments.",
    "HELEN: Our basic cover is included and protects items up to a total value of five thousand pounds. If you think your belongings are worth more, you can upgrade to full cover for twenty pounds.",
    "DAVID: I think five thousand is enough, to be honest.",
    "HELEN: Fine. And how would you like to pay the deposit? We take a deposit of fifty pounds to confirm the booking.",
    "DAVID: Can I pay by bank transfer? I don't really like giving card details over the phone.",
    "HELEN: Of course, bank transfer is fine. I'll email you our account details. What's the best email address?",
    "DAVID: It's d.okafor@mailbox.net.",
    "HELEN: Thank you. And a phone number in case the team needs to contact you on the day?",
    "DAVID: My mobile is 07946 318 552.",
    "HELEN: Lovely. One more thing: is there anywhere for the van to park near your flat? It's a large vehicle.",
    "DAVID: There's a car park behind the building. The van could go there, I think, though the street at the front is very narrow.",
    "HELEN: Then I'll note the car park. Our team will arrive between eight and half past eight in the morning.",
    "DAVID: That early? Well, I suppose it's better to start early.",
    "HELEN: It is, especially with the stairs. And the team leader that day will be Marcus. He's very experienced with pianos, so you're in good hands.",
    "DAVID: Marcus. Great. Is there anything else I need to do?",
    "HELEN: Just pay the deposit within seven days and you'll receive a confirmation. If you need to cancel, please give us at least forty-eight hours' notice.",
    "DAVID: Understood. Thank you very much, Helen.",
    "HELEN: You're welcome, Mr Okafor. Goodbye.",
  ].join("\n"),
  questions: [
    gap(1, "note_completion", "Customer name: David ______", ["Okafor"], 'The caller spells his surname: "it\'s David Okafor. That\'s O-K-A-F-O-R."'),
    gap(2, "note_completion", "Moving from: flat on the ______ floor, no lift", ["second", "2nd"], 'David says the flat "is on the second floor" and "there\'s no lift."'),
    gap(3, "note_completion", "Moving to: 14 ______, Barton", ["Mill Lane"], 'The new address is "a house in Barton, 14 Mill Lane."'),
    gap(4, "note_completion", "Date of move: Tuesday ______ June", ["9th", "9", "ninth"], 'He hoped for the fifth, but settles on "Tuesday the ninth of June."'),
    gap(5, "note_completion", "Special item: upright ______ (extra charge £65)", ["piano"], 'David says "the biggest thing is a piano", and Helen adds "For an upright piano it\'s an additional sixty-five pounds."'),
    gap(6, "note_completion", "Standard price (midweek): £______", ["340"], 'Helen says "the standard price is three hundred and forty pounds"; £390 is the weekend price.'),
    gap(7, "note_completion", "Free delivery of up to ______ boxes", ["40", "forty"], 'Helen says "We can deliver up to forty cardboard boxes a week before, free of charge."'),
    gap(8, "note_completion", "Deposit paid by ______", ["bank transfer", "transfer"], 'David asks "Can I pay by bank transfer?" and Helen replies "bank transfer is fine."'),
    gap(9, "note_completion", "Van to park in the ______ behind the building", ["car park", "carpark"], 'David says "There\'s a car park behind the building", and Helen says "I\'ll note the car park."'),
    gap(10, "note_completion", "Team leader: ______", ["Marcus"], 'Helen says "the team leader that day will be Marcus."'),
  ],
};

const part2: ItemGroup = {
  id: "lg-2",
  partNumber: 2,
  title: "Part 2 — Volunteer day at Elmbridge Riverside Park",
  stimulusKind: "audio",
  instructions:
    "Questions 11-15: choose the correct letter, A, B or C. Questions 16-20: which task will each group do? Choose from the list A-G.",
  transcript: [
    "SPEAKER: Good morning, everyone, and thank you for coming along to the Elmbridge Riverside Park volunteer day. My name's Fiona Grant, and I'm the volunteer coordinator here. Before we split into groups, I want to give you a little background and go through the plan for the day.",
    "SPEAKER: Many of you will know the park as it is now, but it's actually quite new. The land was used as a timber yard for almost a century, and it was only when the yard closed that the council bought the site. People often assume it was farmland, because of the open meadows, but those were created by us after the old sheds were cleared. The park opened to the public eleven years ago.",
    "SPEAKER: Today's event is the biggest we've ever organised. We usually have about thirty volunteers, but this morning we have more than eighty of you, which is fantastic. The main reason for the numbers, I think, is that a local radio station mentioned us last week. We did put posters up in the library, and of course we post on social media, but the radio seems to have made the difference.",
    "SPEAKER: Now, some practical points. Please make sure you've signed in at the green tent. If you haven't brought gloves, don't worry, we have plenty, but we don't have spare boots, so if you're wearing trainers, please stay on the paths and away from the riverbank. Lunch will be provided at one o'clock. It was going to be in the visitor centre, but because it's such a lovely day we've moved it to the picnic lawn beside the bandstand.",
    "SPEAKER: At the end of the day, around four, there'll be a short talk from our ecologist about the otters that have recently returned to this stretch of the river. She'll be speaking at the bird hide rather than at the café, because that's where you're most likely to spot them.",
    "SPEAKER: One more thing before the groups. Some of you have asked how to stay involved. We run a volunteer session on the first Saturday of every month, and you don't need to book. Just turn up. We used to ask people to register online, but we found it put people off.",
    "SPEAKER: Right, let me explain what each group will be doing. You'll see you've each been given a coloured sticker.",
    "SPEAKER: The Red group will be working along the river path. Normally I'd ask this group to pick up litter, but the Scouts did a brilliant job of that last weekend, so instead the Red group will be planting bulbs along the path edges. We've got about two thousand daffodil bulbs to get in the ground.",
    "SPEAKER: The Blue group, you'll be at the boathouse. The rowing club has asked for help, and I know some of you were hoping to paint, but the paint hasn't dried on the primer coat yet, so painting will have to wait for another day. Instead, you'll be repairing the benches along the jetty, many of which have loose or broken slats.",
    "SPEAKER: The Yellow group will be based at the main entrance. This is a large group, because we expect a lot of visitors today. You'll be guiding visitors, giving out maps and answering questions. Some of you have offered to serve refreshments too, but the café staff are handling that, so please concentrate on helping people find their way.",
    "SPEAKER: The Green group is a small group, and you've been chosen because several of you have experience with nature surveys. You'll be recording wildlife in the wetland area, counting birds and insects. Please take a clipboard from the tent. This information goes straight to the county wildlife trust.",
    "SPEAKER: And finally, the Purple group. You'll start in the meadow. There's been a problem with people leaving rubbish after picnics, so your job is clearing litter from the meadow and the area around the bandstand, so it's tidy before lunch. Litter pickers and bags are in the blue container next to the tent.",
    "SPEAKER: If anyone is unsure which group they're in, check the colour of your sticker or come and find me. I'll be wearing this orange vest all day. Right, let's get started, and thank you again.",
  ].join("\n"),
  questions: [
    choice(11, "Before it became a park, the site was", ["farmland", "a timber yard", "a sports ground"], "B", 'Fiona says "The land was used as a timber yard for almost a century", and that people only "assume it was farmland."'),
    choice(12, "The speaker thinks so many volunteers came because of", ["posters in the library", "social media posts", "a radio mention"], "C", 'She says "a local radio station mentioned us last week" and "the radio seems to have made the difference."'),
    choice(13, "Volunteers wearing trainers should", ["borrow boots from the tent", "stay on the paths", "work near the visitor centre"], "B", 'She says "we don\'t have spare boots, so if you\'re wearing trainers, please stay on the paths."'),
    choice(14, "Lunch will be served", ["in the visitor centre", "beside the bandstand", "at the café"], "B", 'Lunch has been "moved ... to the picnic lawn beside the bandstand."'),
    choice(15, "To join the monthly sessions, people should", ["register online", "telephone the coordinator", "simply arrive"], "C", 'She says "you don\'t need to book. Just turn up."'),
    pick(16, "matching_features", "Red group", TASKS, "B", 'The Red group "will be planting bulbs along the path edges" because the Scouts already picked up the litter.'),
    pick(17, "matching_features", "Blue group", TASKS, "C", 'Painting has to wait, so the Blue group "will be repairing the benches along the jetty."'),
    pick(18, "matching_features", "Yellow group", TASKS, "F", 'The Yellow group "will be guiding visitors", while "the café staff are handling" refreshments.'),
    pick(19, "matching_features", "Green group", TASKS, "G", 'The Green group "will be recording wildlife in the wetland area."'),
    pick(20, "matching_features", "Purple group", TASKS, "A", 'The Purple group\'s job "is clearing litter from the meadow."'),
  ],
};

const part3: ItemGroup = {
  id: "lg-3",
  partNumber: 3,
  title: "Part 3 — Discussing a survey on commuting habits",
  stimulusKind: "audio",
  instructions:
    "Questions 21-25: choose the correct letter, A, B or C. Questions 26-30: what do the students say about each part of their research? Choose from the list A-F.",
  transcript: [
    "TUTOR: Come in, Leila, Owen. So, you wanted to talk about your project on how staff at the hospital get to work?",
    "LEILA: Yes. We've collected all our data now and we're starting on the report, but we've got a few questions.",
    "TUTOR: Fine. Remind me first why you chose the hospital.",
    "OWEN: Well, at first we thought about the shopping centre, because it's so big, but the managers wouldn't give us permission. The hospital was keen, mainly because they're planning a new car park and wanted to know whether it's really needed.",
    "LEILA: So they had a practical reason to help us, which made it much easier.",
    "TUTOR: Good. And how many people took part in the end?",
    "LEILA: We hoped for five hundred. We sent the questionnaire to about nine hundred staff, and we got three hundred and twelve replies.",
    "TUTOR: That's a decent response. What was the most interesting finding?",
    "OWEN: I expected the night-shift workers to drive more than anyone, and they do, but what surprised us was that cycling was much more common among senior doctors than among junior staff.",
    "LEILA: Yes, we'd assumed it would be the younger staff on bikes.",
    "TUTOR: Interesting. Did you find out why?",
    "OWEN: Partly because many senior staff live closer to the hospital, in the older neighbourhoods. Junior staff tend to rent further out, where it's cheaper.",
    "TUTOR: That makes sense. Now, what did you want to ask me?",
    "LEILA: Mostly about the structure. Should we present the interviews before the questionnaire results, or after?",
    "TUTOR: After. The questionnaire gives the overall picture, and the interviews explain it. Readers need the picture first.",
    "OWEN: OK. And the other thing is length. We're well over the word limit.",
    "TUTOR: Then look at your literature review. Students usually write too much there. Keep the methods section as it is, because that's where examiners check your work is reliable.",
    "LEILA: Right. Let's go through each part of the research quickly, then. The questionnaire first.",
    "OWEN: I'd say the questionnaire was easily the most reliable source of data we had. The numbers were large and the questions were the same for everyone.",
    "TUTOR: I'd agree. What about the interviews?",
    "LEILA: The interviews took far longer than we'd planned. We'd scheduled twenty minutes each, but people kept talking for nearly an hour.",
    "OWEN: Which was lovely, but it meant we only managed twelve.",
    "TUTOR: Twelve is enough. And the traffic count at the main gate?",
    "OWEN: That one gave us surprising results. We counted cars at the gate for a week, and there were far fewer cars at peak times than the hospital thought, because so many staff arrive outside normal rush hours.",
    "TUTOR: That's very useful for the car park question. Make it prominent. And the map you made of where staff live?",
    "LEILA: We were worried about the map. We thought plotting postcodes would be really technical, but actually there's free software that does it in minutes. It was easier than we thought.",
    "TUTOR: Good. Anything else?",
    "OWEN: There's the cost comparison, where we worked out what each type of commute costs per month. To be honest, I'm not sure it fits.",
    "LEILA: I think it does, but we used fuel prices from last year, so the figures may be wrong.",
    "TUTOR: Hmm. Let me look at it before you decide. Send me that section and I'll check the figures myself before you include it.",
    "OWEN: So that one needs to be checked by you.",
    "TUTOR: Exactly. And I don't think anything should be left out completely. Now, when is your deadline?",
    "LEILA: The fourteenth of next month.",
    "TUTOR: Then send me a draft a week before. Good work, both of you.",
  ].join("\n"),
  questions: [
    choice(21, "The students chose the hospital because", ["it is the largest employer", "it wanted information about parking", "the shopping centre was too far away"], "B", 'Owen says the hospital was keen "because they\'re planning a new car park and wanted to know whether it\'s really needed."'),
    choice(22, "How many completed questionnaires did they receive?", ["312", "500", "900"], "A", 'Leila says "we got three hundred and twelve replies"; five hundred was only what they "hoped for."'),
    choice(23, "What surprised the students?", ["how many night-shift staff drive", "how many senior doctors cycle", "how many junior staff live nearby"], "B", 'Owen says "cycling was much more common among senior doctors than among junior staff."'),
    choice(24, "The tutor advises them to put the interviews", ["before the questionnaire results", "after the questionnaire results", "in an appendix"], "B", 'Asked "before ... or after?", the tutor answers "After."'),
    choice(25, "To reduce the length, the tutor suggests shortening the", ["literature review", "methods section", "conclusion"], "A", 'The tutor says "look at your literature review. Students usually write too much there."'),
    pick(26, "matching_features", "the questionnaire", OPINIONS, "A", 'Owen says "the questionnaire was easily the most reliable source of data we had."'),
    pick(27, "matching_features", "the interviews", OPINIONS, "B", 'Leila says "The interviews took far longer than we\'d planned."'),
    pick(28, "matching_features", "the traffic count", OPINIONS, "C", 'Owen says the traffic count "gave us surprising results."'),
    pick(29, "matching_features", "the map", OPINIONS, "F", 'Leila says of the map "It was easier than we thought."'),
    pick(30, "matching_features", "the cost comparison", OPINIONS, "E", 'The tutor says "I\'ll check the figures myself before you include it", and Owen confirms "that one needs to be checked by you."'),
  ],
};

const part4: ItemGroup = {
  id: "lg-4",
  partNumber: 4,
  title: "Part 4 — Lecture: the history of the public library",
  stimulusKind: "audio",
  instructions:
    "Questions 31-40. Complete the notes below. Write ONE WORD ONLY for each answer.",
  transcript: [
    "LECTURER: Good afternoon. Today I want to look at the history of the public library, an institution most of us take for granted, but which is surprisingly recent in its modern form.",
    "LECTURER: Collections of books and documents are, of course, ancient. The great libraries of the ancient world, such as the one at Alexandria, were impressive, but they were not public in our sense. They served scholars and rulers. Access was a privilege, not a right.",
    "LECTURER: For much of the Middle Ages, books in Europe were kept mainly in monasteries. Because each book was copied by hand, they were extremely valuable, and in many libraries the books were actually attached to the shelves with a chain, so that they could be read but not removed. Some of these chained libraries survive today and can still be visited.",
    "LECTURER: The invention of printing changed things enormously. Books became cheaper, and literacy slowly spread. But for most working people, books were still too expensive to buy. In the eighteenth century, a solution appeared in the form of the subscription library. Members paid a yearly fee, and in return they could borrow books from a shared collection. These were popular with the middle classes, but the fee still excluded the poor.",
    "LECTURER: Another important development was the circulating library, often run by a bookseller, which lent novels for a small charge per book. Critics at the time complained that these libraries encouraged people, especially young women, to read nothing but romantic fiction. We might smile at that now, but it shows that people already argued about what libraries should be for.",
    "LECTURER: The real turning point came in the middle of the nineteenth century. In Britain, an Act of Parliament in 1850 allowed towns to raise money through local taxes to build free libraries. At first, the amount they could raise was very small, and many towns chose not to bother. The movement grew slowly until wealthy individuals began to help.",
    "LECTURER: The most famous of these was the industrialist Andrew Carnegie, who paid for more than two and a half thousand library buildings around the world. Carnegie had an interesting condition, though. He paid for the building, but the town had to provide the land and promise to fund the books and staff every year. In other words, he wanted the community to take responsibility.",
    "LECTURER: Early public libraries looked quite different from today's. In most of them, readers were not allowed to touch the shelves. You looked up a book in a catalogue, wrote its number on a slip, and handed it to a member of staff, who fetched it for you. The idea of open shelves, where readers could browse freely, was controversial. Librarians feared that books would be stolen or put back in the wrong place. In fact, when open access was introduced, it was so popular that it spread rapidly.",
    "LECTURER: Libraries also became places of quiet study, and in many towns the reading room, where newspapers were laid out, was used by people who could not afford to buy a daily paper. For job seekers in particular, the newspaper advertisements were essential.",
    "LECTURER: In the twentieth century, libraries extended their services in new directions. Children's libraries became common after the First World War. In rural areas, where people lived far from any town, mobile libraries were introduced. At first these were horse-drawn carts, later vans, carrying several thousand books from village to village.",
    "LECTURER: Today, of course, libraries face a new challenge from digital technology. Some people predicted that the internet would make them unnecessary. But visitor numbers in many places show a different story. Libraries now lend e-books, offer free computer access and run classes in digital skills, particularly for older people. Many also act as community hubs, hosting everything from job clubs to toddler groups.",
    "LECTURER: If there is one theme running through this history, it is the idea of equality. Each stage, from the subscription library to the free library to free internet access, has widened access to knowledge. And that, I would argue, is why the public library still matters. Next week we'll look at the architecture of library buildings.",
  ].join("\n"),
  questions: [
    gap(31, "note_completion", "Ancient libraries served scholars and ______.", ["rulers"], 'The lecturer says ancient libraries "served scholars and rulers."', 1),
    gap(32, "note_completion", "Medieval books were often attached to shelves with a ______.", ["chain"], 'Books were "attached to the shelves with a chain."', 1),
    gap(33, "note_completion", "Subscription library members paid a yearly ______.", ["fee"], 'In subscription libraries "Members paid a yearly fee."', 1),
    gap(34, "note_completion", "Circulating libraries were often run by a ______.", ["bookseller"], 'The circulating library was "often run by a bookseller."', 1),
    gap(35, "note_completion", "From 1850, towns could use local ______ to build free libraries.", ["taxes", "tax"], 'The 1850 Act "allowed towns to raise money through local taxes."', 1),
    gap(36, "note_completion", "Carnegie's condition: the town provided the ______ and paid for books and staff.", ["land"], 'Carnegie paid for the building, "but the town had to provide the land."', 1),
    gap(37, "note_completion", "Readers used a ______ to find a book's number.", ["catalogue", "catalog"], 'The lecturer explains "You looked up a book in a catalogue, wrote its number on a slip."', 1),
    gap(38, "note_completion", "Reading-room newspapers were especially important for ______ seekers.", ["job"], 'The lecturer says "For job seekers in particular, the newspaper advertisements were essential."', 1),
    gap(39, "note_completion", "The first mobile libraries were horse-drawn ______.", ["carts", "cart"], 'Of mobile libraries the lecturer says "At first these were horse-drawn carts, later vans."', 1),
    gap(40, "note_completion", "The theme running through library history is ______.", ["equality"], 'The lecturer says the theme "is the idea of equality."', 1),
  ],
};

export const listeningSection: Section = {
  code: "listening",
  title: "Listening",
  durationMinutes: 30,
  questionCount: 40,
  itemGroups: [part1, part2, part3, part4],
};
