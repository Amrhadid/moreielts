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

const FLOORS = letters(["basement", "ground floor", "first floor", "second floor", "third floor", "roof terrace"]);

const part1: ItemGroup = {
  id: "lg-1",
  partNumber: 1,
  title: "Part 1 — Enrolling a child in a holiday activity club",
  stimulusKind: "audio",
  instructions:
    "Questions 1-10. Complete the notes below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.",
  transcript: [
    "MAN: Good afternoon, Oakfield Holiday Club. This is Raj. How can I help you?",
    "WOMAN: Hi. I'm calling about your summer club. I'd like to book a place for my son.",
    "MAN: Of course. Let me open a new form. What's your son's name?",
    "WOMAN: It's Leo Brannigan. B-R-A-N-N-I-G-A-N.",
    "MAN: Thank you. And how old is Leo?",
    "WOMAN: He's nine now, but he'll be ten in August, during the club.",
    "MAN: That's fine. We go by age on the first day, so I'll put him in the nine-to-eleven group. Which weeks are you interested in?",
    "WOMAN: We're away at the start of the holidays, so I was thinking of the third and fourth weeks.",
    "MAN: OK. Week three starts on the twenty-eighth of July, and week four on the fourth of August. Would he do full days?",
    "WOMAN: What are the times?",
    "MAN: Full days are from half past eight until five. Half days are mornings only, finishing at half past twelve.",
    "WOMAN: Full days, please. I'm working. Is there any flexibility at the end of the day? Sometimes I finish late.",
    "MAN: We do offer a late pick-up until six o'clock, but it has to be arranged the day before, and there's a small charge. Most parents don't need it, but it's there if you do.",
    "WOMAN: That's good to know. I'll probably manage without it.",
    "MAN: Right. Full days are thirty-two pounds a day, or a hundred and fifty pounds for a whole week of five days.",
    "WOMAN: So the weekly price is cheaper. I'll book both full weeks, then.",
    "MAN: Lovely. Now, every week has a theme. In week three the theme is space, and in week four it's... let me see... it was going to be pirates, but we've changed that to the Olympics, because of the sports facilities we've got this year.",
    "WOMAN: Oh, he'll love that. He's very sporty.",
    "MAN: In that case he'll have a great time. There's a mini sports day on the Friday, and parents are invited to watch in the afternoon.",
    "WOMAN: Wonderful. I'll try to take the afternoon off.",
    "MAN: Great. Is there anything we should know about his health? Allergies, for example?",
    "WOMAN: He's allergic to nuts. Not severely, but he can't eat anything containing them.",
    "MAN: OK, I'll put that down. We're a nut-free site anyway, but it's good for staff to know. Does he need to bring any medication?",
    "WOMAN: No, nothing like that.",
    "MAN: And will he bring a packed lunch, or have the hot lunch? The hot lunch is an extra four pounds a day.",
    "WOMAN: He's quite fussy, so he'll bring his own.",
    "MAN: Packed lunch, then. Now, every child needs to bring a few things each day. A water bottle, sun cream, and a hat. And on Wednesdays in week four, he'll need a swimming costume, because we're taking them to the leisure centre pool.",
    "WOMAN: Swimming costume on Wednesday, got it.",
    "MAN: Now, who will collect him at the end of the day? We need a name for anyone other than parents.",
    "WOMAN: Usually it'll be me, but on some days his grandfather will collect him. His name is Patrick Hale.",
    "MAN: Patrick Hale. I'll add him. He'll need to bring some ID the first time. And finally, how did you hear about us?",
    "WOMAN: A friend recommended you. Well, actually, I first saw a leaflet at the dentist's, and then a friend said her daughter had a great time.",
    "MAN: So the leaflet came first. I'll put that. And how would you like to pay?",
    "WOMAN: Can I pay online?",
    "MAN: Yes, I'll send you a link by email. Payment is due by the first of July, otherwise we can't hold the place.",
    "WOMAN: The first of July. That's fine. Thank you so much.",
    "MAN: You're welcome. We look forward to meeting Leo.",
  ].join("\n"),
  questions: [
    gap(1, "note_completion", "Child's name: Leo ______", ["Brannigan"], 'The mother spells the surname: "It\'s Leo Brannigan. B-R-A-N-N-I-G-A-N."'),
    gap(2, "note_completion", "Age group: ______ to eleven", ["nine", "9"], 'Raj says "I\'ll put him in the nine-to-eleven group."'),
    gap(3, "note_completion", "Week three starts: ______ July", ["28th", "28", "twenty-eighth"], 'Raj says "Week three starts on the twenty-eighth of July."'),
    gap(4, "note_completion", "Cost of a full week: £______", ["150"], 'A full week is "a hundred and fifty pounds for a whole week"; £32 is the daily price.'),
    gap(5, "note_completion", "Theme of week four: the ______", ["Olympics", "Olympic Games"], 'Raj says the week-four theme "was going to be pirates, but we\'ve changed that to the Olympics."'),
    gap(6, "note_completion", "Allergy: ______", ["nuts", "nut"], 'The mother says "He\'s allergic to nuts."', 1),
    gap(7, "note_completion", "Lunch: ______ lunch", ["packed"], 'He will bring his own, so Raj notes "Packed lunch, then."', 1),
    gap(8, "note_completion", "Bring a ______ on Wednesdays in week four", ["swimming costume", "swimsuit"], 'Raj says "on Wednesdays in week four, he\'ll need a swimming costume."'),
    gap(9, "note_completion", "Other person collecting: Patrick ______ (grandfather)", ["Hale"], 'The mother says "his grandfather will collect him. His name is Patrick Hale."', 1),
    gap(10, "note_completion", "Heard about the club from a ______", ["leaflet"], 'She "first saw a leaflet at the dentist\'s", and Raj says "So the leaflet came first."', 1),
  ],
};

const part2: ItemGroup = {
  id: "lg-2",
  partNumber: 2,
  title: "Part 2 — Welcome talk at the Harbourside Museum of Making",
  stimulusKind: "audio",
  instructions:
    "Questions 11-14: choose the correct letter, A, B or C. Questions 15-20: on which floor can visitors find each of the following? Choose from the list A-F. You may use any letter more than once.",
  transcript: [
    "GUIDE: Hello everyone, and welcome to the Harbourside Museum of Making. I'm Sam, and I'll be giving you a quick introduction before you explore on your own.",
    "GUIDE: This building has had a long history. It was built in 1902 as a warehouse for storing grain that arrived by ship. Later it was used as a furniture factory, and it's that period, the factory years, that gave us the idea for a museum about making things. It opened as a museum only four years ago.",
    "GUIDE: Our aim is a little different from most museums. We do display objects, of course, but what we really want is for visitors to try making things themselves. That's why you'll see workshops on almost every floor, and why we say on our posters that this is a museum where you are allowed to touch.",
    "GUIDE: A few practical things. Entry to the permanent galleries is free, but the temporary exhibition this season, on the history of the bicycle, has a charge of six pounds for adults. Children under sixteen go in free. Tickets for workshops are sold at the information desk, not online, and they do sell out quickly, so I'd suggest booking as soon as you finish here.",
    "GUIDE: We are very popular with school groups on weekday mornings, so if you'd like a quieter visit another time, I'd recommend coming in the late afternoon. And on the first Thursday of every month, we stay open until nine in the evening, with music and talks.",
    "GUIDE: Right, let me tell you where things are. We're standing on the ground floor now, in the main hall. Here you'll find the information desk and also the shop, which sells materials and kits so you can continue making at home.",
    "GUIDE: If you've brought coats or bags, the cloakroom is downstairs, in the basement, next to the toilets. The basement is also where we have our largest machine, an old steam engine from the factory days, which is run for visitors every hour on the hour.",
    "GUIDE: On the first floor you'll find the textile gallery, with weaving looms and sewing machines. The children's workshop used to be on this floor too, but we found it got very noisy, so it's now on the second floor, where there's more space.",
    "GUIDE: Also on the second floor is a small study room, where you can look at our collection of tools and design drawings. It's open to everyone, but please ask a member of staff before handling anything there.",
    "GUIDE: The second floor is also home to the woodwork gallery, which shows furniture made in this building over seventy years.",
    "GUIDE: The temporary exhibition I mentioned, the bicycles, is on the third floor. You'll need to show your ticket at the entrance there.",
    "GUIDE: And finally, the café. Many people expect it to be on the ground floor, but it's actually right at the top, on the roof terrace, with wonderful views of the harbour. There's a lift as well as the stairs. On sunny days it gets very busy around lunchtime, so you might like to go a bit earlier.",
    "GUIDE: Before I let you go, a word about photography. You're very welcome to take photos in all the galleries, but please don't use a flash, because some of our textiles are fragile and can fade. In the bicycle exhibition, photography isn't allowed at all, as several of the bicycles are on loan from private collectors.",
    "GUIDE: And if you're interested in volunteering with us, we're always looking for people to help run the workshops. You don't need to be an expert, just enthusiastic. There's a form at the information desk.",
    "GUIDE: If you have any questions, the staff in green T-shirts are happy to help. Enjoy your visit.",
  ].join("\n"),
  questions: [
    choice(11, "The idea for the museum came from the building's time as", ["a grain warehouse", "a furniture factory", "a shipyard"], "B", 'Sam says "it\'s that period, the factory years, that gave us the idea for a museum about making things."'),
    choice(12, "What does the museum mainly want visitors to do?", ["make things themselves", "learn about the harbour", "buy craft kits"], "A", 'Sam says "what we really want is for visitors to try making things themselves."'),
    choice(13, "Workshop tickets can be bought", ["online", "at the information desk", "at each workshop"], "B", 'Sam says "Tickets for workshops are sold at the information desk, not online."'),
    choice(14, "For a quieter visit, Sam recommends coming", ["on weekday mornings", "in the late afternoon", "on the first Thursday of the month"], "B", 'Sam says "I\'d recommend coming in the late afternoon."'),
    pick(15, "matching_features", "the shop", FLOORS, "B", 'On the ground floor "you\'ll find the information desk and also the shop."'),
    pick(16, "matching_features", "the cloakroom", FLOORS, "A", 'Sam says "the cloakroom is downstairs, in the basement."'),
    pick(17, "matching_features", "the steam engine", FLOORS, "A", 'The basement "is also where we have our largest machine, an old steam engine."'),
    pick(18, "matching_features", "the children's workshop", FLOORS, "D", 'The children\'s workshop "is now on the second floor, where there\'s more space."'),
    pick(19, "matching_features", "the bicycle exhibition", FLOORS, "E", 'Sam says "the bicycles, is on the third floor."'),
    pick(20, "matching_features", "the café", FLOORS, "F", 'The café is "right at the top, on the roof terrace."'),
  ],
};

const part3: ItemGroup = {
  id: "lg-3",
  partNumber: 3,
  title: "Part 3 — Planning a presentation on food waste",
  stimulusKind: "audio",
  instructions:
    "Questions 21-25: choose the correct letter, A, B or C. Questions 26-30: complete the sentences below. Write NO MORE THAN TWO WORDS for each answer.",
  transcript: [
    "MAYA: Right, Tom, we need to plan the presentation on food waste in the college canteen. It's on Friday, so we haven't got long.",
    "TOM: I know. Shall we start with what we found? I think the most important result is that most of the waste isn't from the kitchen at all. It's food left on plates.",
    "MAYA: Yes, about sixty per cent, wasn't it? The kitchen waste was much smaller than I expected.",
    "TOM: And the item thrown away most often was bread, which surprised me. I'd have guessed vegetables.",
    "MAYA: Me too. Though when you think about it, everyone gets a bread roll with their meal whether they want it or not.",
    "TOM: Exactly. So that's one of our recommendations: only give bread if students ask for it.",
    "MAYA: Good. Now, how should we open the presentation? Professor Hughes said it's important to get the audience's attention.",
    "TOM: We could start with a statistic, the national figure on food waste.",
    "MAYA: Everyone starts with a statistic. What about a photograph? We took that picture of one day's waste piled on a table. It's quite shocking.",
    "TOM: That's better. Let's open with the photo, then give the numbers afterwards.",
    "MAYA: OK. How are we dividing the talking?",
    "TOM: I'm happy to do the methods, since I designed the weighing system. Could you present the results?",
    "MAYA: Sure. And let's both do the recommendations, taking turns.",
    "TOM: Fine. What about the interview with the canteen manager? She was really helpful.",
    "MAYA: She was. What I found most interesting was that she wants to reduce waste, but she's worried about complaints if portions get smaller.",
    "TOM: Right, so the problem isn't that she doesn't care. It's the fear of complaints.",
    "MAYA: Yes. We should say that clearly. Now, the recommendations. We have the bread one. What else?",
    "TOM: Smaller plates. Research shows people take less food if the plate is smaller.",
    "MAYA: And the menu. If the canteen published the menu a week in advance, they could estimate numbers better.",
    "TOM: Good. And what about leftovers? Some colleges give unsold food to a local charity at the end of the day.",
    "MAYA: The manager said there's a food bank in the town that would take it, but they'd need a fridge to store it overnight.",
    "TOM: So we recommend the college buys a fridge for that. It's not expensive.",
    "MAYA: OK. What about visual aids? I don't want too many slides.",
    "TOM: Agreed. Professor Hughes said no more than ten slides for a fifteen-minute talk.",
    "MAYA: And let's use a bar chart for the waste by category. A pie chart would be too hard to read with so many categories.",
    "TOM: Bar chart, fine. Now, practice. When can we rehearse?",
    "MAYA: Thursday afternoon? The library has rooms you can book.",
    "TOM: Let's book one for two o'clock. And we should time ourselves, because the professor stops people when they run over.",
    "MAYA: Right. One last thing: the handout. Should we give one?",
    "TOM: Yes, a single page with our main recommendations, so the canteen manager can share it with her staff.",
    "MAYA: Perfect. I'll write the handout tonight.",
    "TOM: And I'll make the slides tomorrow morning. Should we send the slides to the professor in advance?",
    "MAYA: She didn't ask for them, but it can't hurt. Let's send them on Thursday evening, after we've rehearsed and made any changes.",
    "TOM: Good idea. Then we'll know they're the final version. I think we're in good shape.",
  ].join("\n"),
  questions: [
    choice(21, "Most of the canteen's waste came from", ["the kitchen", "students' plates", "unsold food"], "B", 'Tom says most of the waste "isn\'t from the kitchen at all. It\'s food left on plates."'),
    choice(22, "Which item was thrown away most often?", ["vegetables", "bread", "rice"], "B", 'Tom says "the item thrown away most often was bread."'),
    choice(23, "They decide to begin the presentation with", ["a national statistic", "a photograph", "a question to the audience"], "B", 'Tom agrees "Let\'s open with the photo, then give the numbers afterwards."'),
    choice(24, "Who will present the methods?", ["Tom", "Maya", "both of them"], "A", 'Tom says "I\'m happy to do the methods, since I designed the weighing system."'),
    choice(25, "The canteen manager's main concern is", ["the cost of changes", "complaints about smaller portions", "a lack of staff"], "B", 'Maya says the manager is "worried about complaints if portions get smaller."'),
    gap(26, "sentence_completion", "The students will recommend using smaller ______.", ["plates"], 'Tom suggests "Smaller plates", since "people take less food if the plate is smaller."', 1),
    gap(27, "sentence_completion", "Giving leftovers to the food bank would require a ______.", ["fridge"], 'The food bank would take it, "but they\'d need a fridge to store it overnight."', 1),
    gap(28, "sentence_completion", "Waste by category will be shown in a ______.", ["bar chart"], 'Maya says "let\'s use a bar chart for the waste by category."'),
    gap(29, "sentence_completion", "They will rehearse in a room in the ______.", ["library"], 'Maya says "The library has rooms you can book."', 1),
    gap(30, "sentence_completion", "The handout will list the main ______.", ["recommendations"], 'The handout will be "a single page with our main recommendations."', 1),
  ],
};

const part4: ItemGroup = {
  id: "lg-4",
  partNumber: 4,
  title: "Part 4 — Lecture: beekeeping in cities",
  stimulusKind: "audio",
  instructions:
    "Questions 31-40. Complete the notes below. Write ONE WORD ONLY for each answer.",
  transcript: [
    "LECTURER: Good morning. In this session I'm going to talk about urban beekeeping: the practice of keeping honeybees in towns and cities, which has grown remarkably over the past twenty years.",
    "LECTURER: Let's begin with the obvious question. Why would bees do well in a city? Most people imagine that the countryside, with its fields and hedgerows, would be a far better home. In fact, modern farmland is often surprisingly poor for bees. Large areas are planted with a single crop, which flowers for only a few weeks, and the use of chemicals can harm insects. Cities, by contrast, offer an enormous variety of plants in gardens, parks and even along railway lines, flowering at different times across the year.",
    "LECTURER: Temperature also plays a part. Cities are usually a few degrees warmer than the surrounding countryside, so the bees' season starts earlier and finishes later.",
    "LECTURER: Where are city hives kept? Rooftops are the most common location, partly because they are out of the way of the public. Hotels, offices and even museums now keep hives on their roofs, and some use the honey in their restaurants. Allotments and community gardens are also popular sites.",
    "LECTURER: The honey itself is interesting. Because bees in cities visit so many different plants, urban honey tends to have a more complex flavour than honey from a single crop. Some beekeepers even sell honey labelled by neighbourhood. And tests have shown that, despite the traffic, city honey is generally clean, since the bees filter out most pollution.",
    "LECTURER: However, I want to spend most of today on the problems, because urban beekeeping is not as straightforward as it sounds.",
    "LECTURER: The first problem is simply numbers. In some cities, the number of hives has increased so quickly that there may not be enough flowers to go round. Researchers in London, for example, found that in some central areas there were more hives than the available plants could support. This is called overcrowding, and it can lead to hungry, weakened colonies.",
    "LECTURER: The second problem is competition. Honeybees are just one of many kinds of bee. There are hundreds of species of wild bee, most of which live alone rather than in hives, and they depend on the same flowers. A single hive can contain fifty thousand honeybees, so a large number of hives can push wild bees out. Ironically, people who start keeping bees to help nature may actually be harming wild species.",
    "LECTURER: Third, disease. When hives are close together, diseases and parasites spread easily from one colony to another. Experienced beekeepers inspect their hives regularly, but new beekeepers may not recognise the signs.",
    "LECTURER: Finally, there's the question of neighbours. Most people are happy to have bees nearby, but a swarm, when thousands of bees leave a hive together, can be frightening if it lands in a busy street. Good management can reduce swarming, but not prevent it entirely.",
    "LECTURER: So what can be done? Many experts now argue that the best way to help bees in cities is not to add more hives, but to plant more flowers. Planting is something everyone can do, even on a balcony, and it benefits wild bees as well as honeybees. Several cities now encourage this through what they call pollinator corridors: chains of gardens, parks and green roofs that allow insects to move across the city.",
    "LECTURER: Some local councils have also introduced registration, so that they know how many hives exist and where. And training courses for beginners are increasingly common, often run by local beekeeping associations.",
    "LECTURER: Before we finish, I want to stress one point. None of this means that urban beekeeping is a bad thing. Many hobby beekeepers are careful and well informed, and city hives have done a great deal to raise public interest in insects. Schools that keep bees, for example, report that pupils become far more curious about plants and the natural world. The question is one of balance: how many hives a particular area can support, and whether we are also providing for the wild species that cannot speak up for themselves.",
    "LECTURER: In the next session we'll look in more detail at the wild bee species I mentioned, and at how scientists count them.",
  ].join("\n"),
  questions: [
    gap(31, "note_completion", "Farmland is often planted with a single ______.", ["crop"], 'The lecturer says "Large areas are planted with a single crop."', 1),
    gap(32, "note_completion", "Cities offer flowers in gardens, parks and along ______ lines.", ["railway", "rail"], 'Plants grow "in gardens, parks and even along railway lines."', 1),
    gap(33, "note_completion", "Cities are warmer, so the bees' ______ is longer.", ["season"], 'Because cities are warmer, "the bees\' season starts earlier and finishes later."', 1),
    gap(34, "note_completion", "The most common location for city hives is on ______.", ["rooftops", "roofs"], 'The lecturer says "Rooftops are the most common location."', 1),
    gap(35, "note_completion", "Urban honey has a more complex ______.", ["flavour", "flavor"], 'Urban honey "tends to have a more complex flavour than honey from a single crop."', 1),
    gap(36, "note_completion", "Bees filter out most ______, so city honey is clean.", ["pollution"], 'Tests show city honey "is generally clean, since the bees filter out most pollution."', 1),
    gap(37, "note_completion", "Problem 1: too many hives, known as ______.", ["overcrowding"], 'The lecturer says "This is called overcrowding."', 1),
    gap(38, "note_completion", "Problem 2: honeybees compete with ______ bees.", ["wild"], 'Large numbers of hives "can push wild bees out."', 1),
    gap(39, "note_completion", "Problem 4: a ______ in a busy street can frighten people.", ["swarm"], 'The lecturer says "a swarm ... can be frightening if it lands in a busy street."', 1),
    gap(40, "note_completion", "Pollinator ______ link gardens, parks and green roofs.", ["corridors"], 'Cities encourage "pollinator corridors: chains of gardens, parks and green roofs."', 1),
  ],
};

export const listeningSection: Section = {
  code: "listening",
  title: "Listening",
  durationMinutes: 30,
  questionCount: 40,
  itemGroups: [part1, part2, part3, part4],
};
