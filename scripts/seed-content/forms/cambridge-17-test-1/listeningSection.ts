import type { ItemGroup, Question, QuestionOption, Section } from "../../../../src/types/content";

/**
 * Cambridge IELTS 17 (Academic, 2022) — Test 1, Listening: 4 parts, 40
 * questions, ~30 minutes. Past paper transcribed from the public archive.org
 * scan; answers verified against the book's answer key and audioscript.
 *
 * The original recordings are bundled at public/audio/mock/<slug>-part-N.mp3,
 * so generate-seed.ts picks the audioUrl up automatically. The transcripts
 * below are the book's audioscripts, in "NAME: line" form; a handful of
 * speaker labels in Part 3's module-feedback exchange were inferred from
 * context (the scan drops those labels).
 */

function gap(
  number: number,
  prompt: string,
  answers: string[],
  explanation: string,
  wordLimit = 1,
): Question {
  return {
    id: `c17t1-l-q${number}`,
    number,
    type: "note_completion",
    prompt,
    acceptedAnswers: answers,
    wordLimit,
    explanation,
  };
}

function letters(labels: string[]): QuestionOption[] {
  return labels.map((label, i) => ({
    value: String.fromCharCode(65 + i),
    label: `${String.fromCharCode(65 + i)}. ${label}`,
  }));
}

function choice(
  number: number,
  prompt: string,
  options: string[],
  answer: string,
  explanation: string,
): Question {
  return {
    id: `c17t1-l-q${number}`,
    number,
    type: "multiple_choice_single",
    prompt,
    options: letters(options),
    acceptedAnswers: [answer],
    explanation,
  };
}

/**
 * Cambridge "Questions X and Y — choose TWO letters" items are one answer box
 * per number on the real answer sheet, with the two letters accepted in either
 * order. Modelled as one single-choice question per number whose accepted set
 * holds both letters, so numbering stays 1-40 and each number scores its mark.
 */
function eitherOrder(
  number: number,
  prompt: string,
  options: string[],
  answers: [string, string],
  explanation: string,
): Question {
  return {
    id: `c17t1-l-q${number}`,
    number,
    type: "multiple_choice_single",
    prompt,
    options: letters(options),
    acceptedAnswers: [...answers],
    explanation,
  };
}

function match(
  number: number,
  prompt: string,
  options: QuestionOption[],
  answer: string,
  explanation: string,
): Question {
  return {
    id: `c17t1-l-q${number}`,
    number,
    type: "matching_features",
    prompt,
    options,
    acceptedAnswers: [answer],
    explanation,
  };
}

const TRANSCRIPT_1 = `PETER: Hello?
JAN: Oh hello. My name's Jan. Are you the right person to talk to about the Buckworth Conservation Group?
PETER: Yes, I'm Peter. I'm the secretary.
JAN: Good. I've just moved to this area, and I'm interested in getting involved. I was in a similar group where I used to live. Could you tell me something about your activities, please?
PETER: Of course. Well, we have a mixture of regular activities and special events. One of the regular ones is trying to keep the beach free of litter. A few of us spend a couple of hours a month on it, and it's awful how much there is to clear. I wish people would be more responsible and take it home with them.
JAN: I totally agree. I'd be happy to help with that. Is it OK to take dogs?
PETER: I'm afraid not, as they're banned from the beach itself. You can take them along the cliffs, though. And children are welcome.
JAN: Right.
PETER: We also manage a nature reserve, and there's a lot to do there all year round. For example, because it's a popular place to visit, we spend a lot of time looking after the paths and making sure they're in good condition for walking.
JAN: I could certainly help with that.
PETER: Good. And we have a programme of creating new habitats there. We've just finished making and installing nesting boxes for birds to use, and next we're going to work on encouraging insects — they're important for the biodiversity of the reserve.
JAN: They certainly are.
PETER: Oh, and we're also running a project to identify the different species of butterflies that visit the reserve. You might be interested in taking part in that.
JAN: Sure. I was involved in something similar where I used to live, counting all the species of moths. I'd enjoy that.
PETER: Another job we're doing at the reserve is replacing the wall on the southern side, between the parking area and our woodshed. It was badly damaged in a storm last month.
JAN: OK.
PETER: Then as I said, we have a programme of events as well, both at the weekend, and during the week.
JAN: Right. I presume you have guided walks? I'd like to get to know the local countryside, as I'm new to the area.
PETER: Yes, we do. The next walk is to Ruston Island, a week on Saturday. We'll be meeting in the car park at Dunsmore Beach at low tide — that's when the sands are dry enough for us to walk to the island without getting wet.
JAN: Sounds good.
PETER: The island's a great place to explore. It's quite small, and it's got a range of habitats. It's also an ideal location for seeing seals just off the coast, or even on the beach.
JAN: OK. And is there anything we should bring, like a picnic, for instance?
PETER: Yes, do bring one, as it's a full-day walk. And of course it'll be wet walking across and back, so make sure your boots are waterproof.
JAN: I must buy a new pair — there's a hole in one of my current ones! Well, I'd definitely like to come on the walk.
PETER: Great. Then later this month we're having a one-day woodwork session in Hopton Wood.
JAN: I've never tried that before. Is it OK for beginners to take part?
PETER: Definitely. There'll be a couple of experts leading the session, and we keep the number of participants down, so you'll get as much help as you need.
JAN: Excellent! I'd love to be able to make chairs.
PETER: That's probably too ambitious for one day! You'll be starting with wooden spoons, and of course learning how to use the tools. And anything you make is yours to take home with you.
JAN: That sounds like fun. When is it?
PETER: It's on the 17th, from 10 a.m. until 3. There's a charge of £35, including lunch, or £40 if you want to camp in the wood.
JAN: I should think I'll come home the same day. Well, I'd certainly like to join the group.`;

const TRANSCRIPT_2 = `LOU: So, hello everyone. My name's Lou Miller and I'm going to be your tour guide today as we take this fantastic boat trip around the Tasmanian coast. Before we set off, I just want to tell you a few things about our journey.
LOU: Our boats aren't huge as you can see. We already have three staff members on board and on top of that, we can transport a further fifteen people — that's you — around the coastline. But please note if there are more than nine people on either side of the boat, we'll move some of you over, otherwise all eighteen of us will end up in the sea!
LOU: We've recently upgraded all our boats. They used to be jet black, but our new ones now have these comfortable dark red seats and a light-green exterior in order to stand out from others and help promote our company. This gives our boats a rather unique appearance, don't you think?
LOU: We offer you a free lunchbox during the trip and we have three types. Lunchbox 1 contains ham and tomato sandwiches. Lunchbox 2 contains a cheddar cheese roll and Lunchbox 3 is salad-based and also contains eggs and tuna. All three lunchboxes also have a packet of crisps and chocolate bar inside. Please let staff know which lunchbox you prefer.
LOU: I'm sure I don't have to ask you not to throw anything into the sea. We don't have any bins to put litter in, but Jess, myself or Ray, our other guide, will collect it from you after lunch and put it all in a large plastic sack.
LOU: The engine on the boat makes quite a lot of noise so before we head off, let me tell you a few things about what you're going to see.
LOU: This area is famous for its ancient lighthouse, which you'll see from the boat as we turn past the first little island. It was built in 1838 to protect sailors as a number of shipwrecks had led to significant loss of life. The construction itself was complicated as some of the original drawings kept by the local council show. It sits right on top of the cliffs in a very isolated spot. In the nineteenth century there were many jobs there, such as polishing the brass lamps, chopping firewood and cleaning windows, that kept lighthouse keepers busy. These workers were mainly prison convicts until the middle of that century when ordinary families willing to live in such circumstances took over.
LOU: Some of you have asked me what creatures we can expect to see. I know everyone loves the penguins, but they're very shy and, unfortunately, tend to hide from passing boats, but you might see birds in the distance, such as sea eagles, flying around the cliff edges where they nest. When we get to the rocky area inhabited by fur seals, we'll stop and watch them swimming around the coast. They're inquisitive creatures so don't be surprised if one pops up right in front of you. Their predators, orca whales, hunt along the coastline too, but spotting one of these is rare. Dolphins, on the other hand, can sometimes approach on their own or in groups as they ride the waves beside us.
LOU: Lastly, I want to mention the caves. Tasmania is famous for its caves and the ones we'll pass by are so amazing that people are lost for words when they see them. They can only be approached by sea, but if you feel that you want to see more than we're able to show you, then you can take a kayak into the area on another day and one of our staff will give you more information on that. What we'll do is to go through a narrow channel, past some incredible rock formations and from there we'll be able to see the openings to the caves, and at that point we'll talk to you about what lies beyond.`;

const TRANSCRIPT_3 = `DIANA: So, Tim, we have to do a short summary of our work experience on a farm.
TIM: Right. My farm was great, but arranging the work experience was hard. One problem was it was miles away and I don't drive. And also, I'd really wanted a placement for a month, but I could only get one for two weeks.
DIANA: I was lucky, the farmer let me stay on the farm so I didn't have to travel. But finding the right sort of farm to apply to wasn't easy.
TIM: No, they don't seem to have websites, do they. I found mine through a friend of my mother's, but it wasn't easy.
DIANA: No.
TIM: My farm was mostly livestock, especially sheep. I really enjoyed helping out with them. I was up most of one night helping a sheep deliver a lamb ...
DIANA: On your own?
TIM: No, the farmer was there, and he told me what to do. It wasn't a straightforward birth, but I managed. It was a great feeling to see the lamb stagger to its feet and start feeding almost straightaway, and to know that it was OK.
DIANA: Mm.
TIM: Then another time a lamb had broken its leg, and they got the vet in to set it, and he talked me through what he was doing. That was really useful.
DIANA: Yes, my farm had sheep too. The farm was in a valley and they had a lowland breed called Suffolks, although the farmer said they'd had other breeds in the past.
TIM: So were they bred for their meat?
DIANA: Mostly, yes. They're quite big and solid.
TIM: My farm was up in the hills and they had a different breed of sheep, they were Cheviots.
DIANA: Oh, I heard their wool's really sought after.
TIM: Yes. It's very hardwearing and they use it for carpets.
DIANA: Right.
TIM: I was interested in the amount of supplements they add to animals' feed nowadays. Like, even the chickens got extra vitamins and electrolytes in their feed.
DIANA: Yes, I found that too. And they're not cheap. But my farmer said some are overpriced for what they are. And he didn't give them as a matter of routine, just at times when the chickens seemed to particularly require them.
TIM: Yes, mine said the same. He said certain breeds of chickens might need more supplements than the others, but the cheap and expensive ones are all basically the same.
DIANA: Mm.
TIM: So did your farm have any other livestock, Diana?
DIANA: Yes, dairy cows. I made a really embarrassing mistake when I was working in the milk shed. Some cows had been treated with antibiotics, so their milk wasn't suitable for human consumption, and it had to be put in a separate container. But I got mixed up, and I poured some milk from the wrong cow in with the milk for humans, so the whole lot had to be thrown away. The farmer wasn't too happy with me.
TIM: I asked my farmer how much he depended on the vet to deal with health problems. I'd read reports that the livestock's health is being affected as farmers are under pressure to increase production. Well, he didn't agree with that, but he said that actually some of the stuff the vets do, like minor operations, he'd be quite capable of doing himself.
DIANA: Yeah. My farmer said the same. But he reckons vets' skills are still needed.
DIANA: Now we've got to give a bit of feedback about last term's modules — just short comments, apparently. Shall we do that now?
TIM: OK. So medical terminology.
DIANA: Well, my heart sank when I saw that, especially right at the beginning of the course. And I did struggle with it.
TIM: I'd thought it'd be hard, but actually I found it all quite straightforward.
TIM: What did you think about diet and nutrition?
DIANA: OK, I suppose.
TIM: Do you remember what they told us about pet food and the fact that there's such limited checking into whether or not it's contaminated? I mean in comparison with the checks on food for humans — I thought that was terrible.
DIANA: Mm. I think the module that really impressed me was the animal disease one, when we looked at domesticated animals in different parts of the world, like camels and water buffalo and alpaca. The economies of so many countries depend on these, but scientists don't know much about the diseases that affect them.
TIM: Yes, I thought they'd know a lot about ways of controlling and eradicating those diseases, but that's not the case at all.
TIM: I loved the wildlife medication unit. Things like helping birds that have been caught in oil spills. That's something I hadn't thought about before.
DIANA: Yeah, I thought I might write my dissertation on something connected with that.
TIM: Right. So ...`;

const TRANSCRIPT_4 = `Labyrinths have existed for well over 4,000 years. Labyrinths and labyrinthine symbols have been found in regions as diverse as modern-day Turkey, Ireland, Greece, and India. There are various designs of labyrinth but what they all have in common is a winding spiral path which leads to a central area. There is one starting point at the entrance and the goal is to reach the central area. Finding your way through a labyrinth involves many twists and turns, but it's not possible to get lost as there is only one single path.
In modern times, the word labyrinth has taken on a different meaning and is often used as a synonym for a maze. A maze is quite different as it is a kind of puzzle with an intricate network of paths. Mazes became fashionable in the 15th and 16th centuries in Europe, and can still be found in the gardens of great houses and palaces. The paths are usually surrounded by thick, high hedges so that it's not possible to see over them. Entering a maze usually involves getting lost a few times before using logic to work out the pattern and find your way to the centre and then out again. There are lots of dead ends and paths which lead you back to where you started. The word 'maze' is believed to come from a Scandinavian word for a state of confusion. This is where the word 'amazing' comes from.
Labyrinths, on the other hand, have a very different function. Although people now often refer to things they find complicated as labyrinths, this is not how they were seen in the past. The winding spiral of the labyrinth has been used for centuries as a metaphor for life's journey. It served as a spiritual reminder that there is purpose and meaning to our lives and helped to give people a sense of direction. Labyrinths are thought to encourage a feeling of calm and have been used as a meditation and prayer tool in many cultures over many centuries.
The earliest examples of the labyrinth spiral pattern have been found carved into stone, from Sardinia to Scandinavia, from Arizona to India to Africa. In Europe, these spiral carvings date from the late Bronze Age. The Native American Pima tribe wove baskets with a circular labyrinth design that depicted their own cosmology. In Ancient Greece, the labyrinth spiral was used on coins around four thousand years ago. Labyrinths made of mosaics were commonly found in bathhouses, villas and tombs throughout the Roman Empire.
In Northern Europe, there were actual physical labyrinths designed for walking on. These were cut into the turf or grass, usually in a circular pattern. The origin of these walking labyrinths remains unclear, but they were probably used for fertility rites which may date back thousands of years. Eleven examples of turf labyrinths survive today, including the largest one at Saffron Walden, England, which used to have a large tree in the middle of it.
More recently labyrinths have experienced something of a revival. Some believe that walking a labyrinth promotes healing and mindfulness, and there are those who believe in its emotional and physical benefits, which include slower breathing and a restored sense of balance and perspective. This idea has become so popular that labyrinths have been laid into the floors of spas, wellness centres and even prisons in recent years.
A pamphlet at Colorado Children's Hospital informs patients that 'walking a labyrinth can often calm people in the midst of a crisis'. And apparently, it's not only patients who benefit. Many visitors find walking a labyrinth less stressful than sitting in a corridor or waiting room. Some doctors even walk the labyrinth during their breaks. In some hospitals, patients who can't walk can have a paper 'finger labyrinth' brought to their bed. The science behind the theory is a little sketchy, but there are dozens of small-scale studies which support claims about the benefits of labyrinths. For example, one study found that walking a labyrinth provided 'short-term calming, relaxation, and relief from anxiety' for Alzheimer's patients.`;

const part1: ItemGroup = {
  id: "c17t1-lg-1",
  partNumber: 1,
  title: "Part 1 — Buckworth Conservation Group",
  stimulusKind: "audio",
  instructions:
    "Questions 1-10. Complete the notes below. Write ONE WORD AND/OR A NUMBER for each answer.",
  transcript: TRANSCRIPT_1,
  questions: [
    gap(1, "Beach: making sure the beach does not have ______ on it", ["litter"], "Peter: 'trying to keep the beach free of litter'."),
    // Prompt line was unreadable in the source scan; reconstructed from the
    // audioscript ("they're banned from the beach itself").
    gap(2, "Beach: ______ are banned from the beach itself", ["dogs"], "Jan asks 'Is it OK to take dogs?' and Peter says they are 'banned from the beach itself'."),
    gap(3, "Nature reserve: next task is taking action to attract ______ to the place", ["insects"], "Peter: 'next we're going to work on encouraging insects'."),
    gap(4, "Nature reserve: identifying types of ______", ["butterflies"], "Peter: 'a project to identify the different species of butterflies'."),
    gap(5, "Nature reserve: building a new ______", ["wall"], "Peter: 'replacing the wall on the southern side'."),
    gap(6, "Saturday walk: walk across the sands and reach the ______", ["island"], "Peter: 'the sands are dry enough for us to walk to the island'."),
    gap(7, "Saturday walk: wear appropriate ______", ["boots"], "Peter: 'make sure your boots are waterproof'."),
    gap(8, "Woodwork session: suitable for ______ to participate in", ["beginners"], "Jan: 'Is it OK for beginners to take part?' Peter: 'Definitely.'"),
    gap(9, "Woodwork session: making ______ out of wood", ["spoons"], "Peter: 'You'll be starting with wooden spoons'."),
    gap(10, "Woodwork session: cost of session (no camping): £______", ["35"], "Peter: 'a charge of £35, including lunch, or £40 if you want to camp'."),
  ],
};

const LIGHTHOUSE = [
  "why it was built",
  "who built it",
  "how long it took to build",
  "who staffed it",
  "what it was built with",
];

const CREATURES = [
  "sea eagles",
  "fur seals",
  "dolphins",
  "whales",
  "penguins",
];

const CAVES = [
  "Only large tourist boats can visit them.",
  "The entrances to them are often blocked.",
  "It is too dangerous for individuals to go near them.",
  "Someone will explain what is inside them.",
  "They cannot be reached on foot.",
];

const part2: ItemGroup = {
  id: "c17t1-lg-2",
  partNumber: 2,
  title: "Part 2 — Boat trip round Tasmania",
  stimulusKind: "audio",
  instructions:
    "Questions 11-20. Choose the correct letter, A, B or C, for Questions 11-14. For Questions 15-20, choose TWO letters, A-E, for each pair; the two answers may be written in either order.",
  transcript: TRANSCRIPT_2,
  questions: [
    choice(11, "What is the maximum number of people who can stand on each side of the boat?", ["9", "15", "18"], "A", "'if there are more than nine people on either side of the boat, we'll move some of you over'."),
    choice(12, "What colour are the tour boats?", ["dark red", "jet black", "light green"], "C", "'a light-green exterior'; dark red is the seats, jet black the old boats."),
    choice(13, "Which lunchbox is suitable for someone who doesn't eat meat or fish?", ["Lunchbox 1", "Lunchbox 2", "Lunchbox 3"], "B", "Lunchbox 2 is 'a cheddar cheese roll'; 1 has ham, 3 has tuna."),
    choice(14, "What should people do with their litter?", ["take it home", "hand it to a member of staff", "put it in the bins provided on the boat"], "B", "'Jess, myself or Ray ... will collect it from you after lunch'."),
    eitherOrder(15, "Questions 15 and 16: Which TWO features of the lighthouse does Lou mention?", LIGHTHOUSE, ["A", "D"], "Built in 1838 'to protect sailors' (why); keepers 'mainly prison convicts until ... ordinary families ... took over' (who staffed it)."),
    eitherOrder(16, "Questions 15 and 16: Which TWO features of the lighthouse does Lou mention?", LIGHTHOUSE, ["A", "D"], "Built in 1838 'to protect sailors' (why); keepers 'mainly prison convicts until ... ordinary families ... took over' (who staffed it)."),
    eitherOrder(17, "Questions 17 and 18: Which TWO types of creature might come close to the boat?", CREATURES, ["B", "C"], "Fur seals 'don't be surprised if one pops up right in front of you'; dolphins 'can sometimes approach ... beside us'."),
    eitherOrder(18, "Questions 17 and 18: Which TWO types of creature might come close to the boat?", CREATURES, ["B", "C"], "Fur seals 'don't be surprised if one pops up right in front of you'; dolphins 'can sometimes approach ... beside us'."),
    eitherOrder(19, "Questions 19 and 20: Which TWO points does Lou make about the caves?", CAVES, ["D", "E"], "'we'll talk to you about what lies beyond' (someone explains inside); 'They can only be approached by sea' (not on foot)."),
    eitherOrder(20, "Questions 19 and 20: Which TWO points does Lou make about the caves?", CAVES, ["D", "E"], "'we'll talk to you about what lies beyond' (someone explains inside); 'They can only be approached by sea' (not on foot)."),
  ],
};

const OPINIONS: QuestionOption[] = [
  { value: "A", label: "A. Tim found this easier than expected." },
  { value: "B", label: "B. Tim thought this was not very clearly organised." },
  { value: "C", label: "C. Diana may do some further study on this." },
  { value: "D", label: "D. They both found the reading required for this was difficult." },
  { value: "E", label: "E. Tim was shocked at something he learned on this module." },
  { value: "F", label: "F. They were both surprised how little is known about some aspects of this." },
];

const part3: ItemGroup = {
  id: "c17t1-lg-3",
  partNumber: 3,
  title: "Part 3 — Work experience for veterinary science students",
  stimulusKind: "audio",
  instructions:
    "Questions 21-30. Choose the correct letter, A, B or C, for Questions 21-26. For Questions 27-30, choose the opinion, A-F, that the students give about each module.",
  transcript: TRANSCRIPT_3,
  questions: [
    choice(21, "What problem did both Diana and Tim have when arranging their work experience?", ["making initial contact with suitable farms", "organising transport to and from the farm", "finding a placement for the required length of time"], "A", "Diana: 'finding the right sort of farm to apply to wasn't easy'; Tim: 'they don't seem to have websites ... it wasn't easy'."),
    choice(22, "Tim was pleased to be able to help", ["a lamb that had a broken leg.", "a sheep that was having difficulty giving birth.", "a newly born lamb that was having trouble feeding."], "B", "'I was up most of one night helping a sheep deliver a lamb ... It wasn't a straightforward birth'."),
    choice(23, "Diana says the sheep on her farm", ["were of various different varieties.", "were mainly reared for their meat.", "had better quality wool than sheep on the hills."], "B", "Tim: 'So were they bred for their meat?' Diana: 'Mostly, yes.'"),
    choice(24, "What did the students learn about adding supplements to chicken feed?", ["These should only be given if specially needed.", "It is worth paying extra for the most effective ones.", "The amount given at one time should be limited."], "A", "'he didn't give them as a matter of routine, just at times when the chickens seemed to particularly require them'."),
    choice(25, "What happened when Diana was working with dairy cows?", ["She identified some cows incorrectly.", "She accidentally threw some milk away.", "She made a mistake when storing milk."], "B", "'I poured some milk from the wrong cow in with the milk for humans, so the whole lot had to be thrown away'."),
    choice(26, "What did both farmers mention about vets and farming?", ["Vets are failing to cope with some aspects of animal health.", "There needs to be a fundamental change in the training of vets.", "Some jobs could be done by the farmer rather than by a vet."], "C", "'some of the stuff the vets do, like minor operations, he'd be quite capable of doing himself' — 'My farmer said the same.'"),
    match(27, "Medical terminology", OPINIONS, "A", "Tim: 'I'd thought it'd be hard, but actually I found it all quite straightforward.'"),
    match(28, "Diet and nutrition", OPINIONS, "E", "Tim on pet-food contamination checks: 'I thought that was terrible.'"),
    match(29, "Animal disease", OPINIONS, "F", "Diana: 'scientists don't know much about the diseases'; Tim: 'I thought they'd know a lot ... that's not the case at all.'"),
    match(30, "Wildlife medication", OPINIONS, "C", "Diana: 'I thought I might write my dissertation on something connected with that.'"),
  ],
};

const part4: ItemGroup = {
  id: "c17t1-lg-4",
  partNumber: 4,
  title: "Part 4 — Labyrinths",
  stimulusKind: "audio",
  instructions:
    "Questions 31-40. Complete the notes below. Write ONE WORD ONLY for each answer.",
  transcript: TRANSCRIPT_4,
  questions: [
    gap(31, "Labyrinths compared with mazes: mazes are a type of ______", ["puzzle"], "'A maze is quite different as it is a kind of puzzle'."),
    gap(32, "______ is needed to navigate through a maze", ["logic"], "'using logic to work out the pattern and find your way to the centre'."),
    gap(33, "The word 'maze' is derived from a word meaning a feeling of ______", ["confusion"], "'believed to come from a Scandinavian word for a state of confusion'."),
    gap(34, "Labyrinths have frequently been used in ______ and prayer", ["meditation"], "'used as a meditation and prayer tool in many cultures'."),
    gap(35, "Early examples: ancient carvings on ______ have been found across many cultures", ["stone"], "'The earliest examples ... have been found carved into stone'."),
    gap(36, "Ancient Greeks used the symbol on ______", ["coins"], "'In Ancient Greece, the labyrinth spiral was used on coins'."),
    gap(37, "The largest surviving example of a turf labyrinth once had a big ______ in its centre", ["tree"], "'the largest one at Saffron Walden ... used to have a large tree in the middle of it'."),
    gap(38, "Walking a labyrinth can reduce a person's ______ rate", ["breathing"], "'emotional and physical benefits, which include slower breathing'."),
    gap(39, "Patients who can't walk can use 'finger labyrinths' made from ______", ["paper"], "'a paper \"finger labyrinth\" brought to their bed'."),
    gap(40, "Research has shown that Alzheimer's sufferers experience less ______", ["anxiety"], "'short-term calming, relaxation, and relief from anxiety for Alzheimer's patients'."),
  ],
};

export const listeningSection: Section = {
  code: "listening",
  title: "Listening",
  durationMinutes: 30,
  questionCount: 40,
  itemGroups: [part1, part2, part3, part4],
};
