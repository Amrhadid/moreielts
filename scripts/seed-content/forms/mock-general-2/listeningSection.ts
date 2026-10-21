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

const FEATURES = letters([
  "a picnic area",
  "a gift shop",
  "a tour of the engine sheds",
  "a walk to a waterfall",
  "a signalling museum",
  "a café in an old carriage",
  "a children's playground",
]);

const part1: ItemGroup = {
  id: "lg-1",
  partNumber: 1,
  title: "Part 1 — Joining a car-sharing club",
  stimulusKind: "audio",
  instructions:
    "Questions 1-6: complete the form. Questions 7-10: complete the table. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.",
  transcript: [
    `CLARE: Hello, Streetcar Share, Clare speaking. How can I help?`,
    `RAJ: Hi. I'm thinking of joining your car club, and I'd like some information, please. I sold my own car last month, and I've realised I still need one now and then.`,
    `CLARE: That's what most of our members say. I can go through the plans with you and take your details at the same time, if you like. That way you can join straight away if you decide to.`,
    `RAJ: Great, let's do that.`,
    `CLARE: Could I have your name first?`,
    `RAJ: It's Raj Bhandari.`,
    `CLARE: How do you spell your surname?`,
    `RAJ: B-H-A-N-D-A-R-I.`,
    `CLARE: Thank you. And your postcode?`,
    `RAJ: It's LS6 4QT.`,
    `CLARE: LS6 4QT. Now, all members need to have held a full driving licence for at least two years. How long have you had yours?`,
    `RAJ: Let me think. I passed my test when I was nineteen, and I'm twenty-six now, so seven years.`,
    `CLARE: Seven years, that's fine. We also ask about occupation, because it affects the insurance. What do you do?`,
    `RAJ: I'm a pharmacist. I work at the hospital in the city centre.`,
    `CLARE: Thanks. And what would you mainly use the car for? Commuting?`,
    `RAJ: No, I cycle to work. It'd mostly be for visiting my grandmother. She lives out in the country, about forty minutes away, and there's no train. Maybe the odd trip to the furniture shop too.`,
    `CLARE: OK. And which of our car locations is nearest to you? There's one on Hyde Park Road and another in the car park on Brunswick Street.`,
    `RAJ: Brunswick Street is closer. It's just round the corner from my flat.`,
    `CLARE: Lovely. Now let me explain the three plans, and you can tell me which suits you best. The first is the Occasional plan. There's no monthly fee at all, and you pay eight pounds fifty an hour when you use a car.`,
    `RAJ: Eight fifty. That sounds reasonable.`,
    `CLARE: It is, if you only drive a few times a year. The second plan is called Regular. With that, you pay a monthly fee of twelve pounds, and the hourly rate goes down to six pounds. And Regular members also get one free hour every Sunday, which is popular with families.`,
    `RAJ: Every Sunday? I'd probably visit my grandmother on Sundays, so that would be useful.`,
    `CLARE: Then the third plan is Frequent. That costs fifty-five pounds a month, and it includes ten free hours each month. After those ten hours, you pay five pounds an hour.`,
    `RAJ: Hmm. I don't think I'd use it that much. Is fuel included in all of these?`,
    `CLARE: Yes, fuel and insurance are included on every plan. There's a fuel card in each car, so if the tank gets low, you just fill it up and the club pays. The only thing we ask is that you return the car with at least a quarter of a tank.`,
    `RAJ: That's very easy. What happens if I'm late bringing a car back?`,
    `CLARE: If you know you'll be late, you can extend your booking on the app, as long as nobody else has booked the car. If you're late without telling us, there's a charge of fifteen pounds.`,
    `RAJ: Fair enough. I think the Regular plan makes most sense for me, with the free hour on Sundays.`,
    `CLARE: Good choice. There's also a one-off joining fee, which covers checking your licence and sending out your membership card. That's twenty-five pounds. It used to be forty, but we reduced it this year.`,
    `RAJ: OK, twenty-five is fine. How do I get the membership card?`,
    `CLARE: We'll send it by post, and it should arrive within five working days. Until then, you can use the app to unlock the cars.`,
    `RAJ: Perfect. Can I pay the joining fee now, by card?`,
    `CLARE: Of course. I'll just transfer you to our secure payment line. Thanks for joining, Mr Bhandari.`,
    `RAJ: Thanks for your help, Clare.`,
  ].join("\n"),
  questions: [
    gap(1, "note_completion", "Name: Raj ______", ["Bhandari"], `Raj spells his surname: "B-H-A-N-D-A-R-I."`),
    gap(2, "note_completion", "Postcode: ______", ["LS6 4QT", "LS64QT"], `Raj says "It's LS6 4QT", and Clare repeats it.`),
    gap(3, "note_completion", "Years with a full driving licence: ______", ["7", "seven"], `Raj passed at nineteen and is twenty-six, "so seven years."`),
    gap(4, "note_completion", "Occupation: ______", ["pharmacist"], `Raj says "I'm a pharmacist. I work at the hospital in the city centre."`),
    gap(5, "note_completion", "Main use: visiting his ______", ["grandmother", "grandma"], `He doesn't commute; "It'd mostly be for visiting my grandmother."`),
    gap(6, "note_completion", "Nearest car location: ______ Street car park", ["Brunswick"], `Raj says "Brunswick Street is closer."`),
    gap(7, "table_completion", "Occasional plan: no monthly fee; £______ per hour", ["8.50"], `Clare says "you pay eight pounds fifty an hour when you use a car."`),
    gap(8, "table_completion", "Regular plan: £______ per month; £6 per hour", ["12", "twelve"], `With the Regular plan "you pay a monthly fee of twelve pounds, and the hourly rate goes down to six pounds."`),
    gap(9, "table_completion", "Regular plan extra: one free hour every ______", ["Sunday"], `"Regular members also get one free hour every Sunday".`),
    gap(10, "table_completion", "Frequent plan: £55 per month, including ______ free hours", ["10", "ten"], `The Frequent plan "costs fifty-five pounds a month, and it includes ten free hours each month."`),
  ],
};

const part2: ItemGroup = {
  id: "lg-2",
  partNumber: 2,
  title: "Part 2 — A guide to the Hartmoor Valley Railway",
  stimulusKind: "audio",
  instructions:
    "Questions 11-15: choose the correct letter, A, B or C. Questions 16-20: what can visitors find at each station? Choose from the list A-G.",
  transcript: [
    `SPEAKER: Good morning, and welcome aboard the Hartmoor Valley Railway. My name's Gareth, and I'm one of the volunteers here. Before we set off, I'd like to tell you a bit about the line and about the stations where you can get off during the day.`,
    `SPEAKER: The railway first opened in 1872 to carry stone from the quarries at the top of the valley down to the river. Passengers were really an afterthought. The line closed in 1963, like many small railways at that time, and for almost twenty years the tracks were left to rust. Then in 1981 a group of local enthusiasts bought the line from the government for a single pound, on the condition that they would repair it at their own expense. It took them eleven years to reopen the first section.`,
    `SPEAKER: Today the railway is run almost entirely by volunteers. We have about four hundred of them, and only six paid staff. People often imagine that our volunteers are all retired railway workers, but in fact very few of them ever worked on the railways. Most are simply people who enjoy being outdoors and working with their hands, and we have a growing number of students, too.`,
    `SPEAKER: The locomotive pulling us today is called Lady Margaret. She was built in 1924, and she's the oldest engine we still use. She uses about a tonne of coal on a full day, which is one of the reasons tickets cost what they do. We don't receive any money from the government, so every ticket, and every cup of tea you buy, helps to keep the line running.`,
    `SPEAKER: Your ticket today is a day rover, which means you can get on and off as many times as you like. Trains run in each direction every ninety minutes, so do check the timetable at each station before you wander off. The last train back leaves Kingsmead at half past four, and if you miss it, I'm afraid it's a very long walk.`,
    `SPEAKER: One request: please keep your head and arms inside the windows. The line goes through two narrow tunnels, and the walls are much closer than they look.`,
    `SPEAKER: Right, the stations. We start, of course, here at Hartmoor Junction. Before you leave, it's well worth looking into the gift shop on platform one. All the profits go to repairing carriages, and it has a very good selection of books about the area.`,
    `SPEAKER: The first stop is Elder Bridge. There's not much in the village itself, but the station has kept its original signal box, and inside it there's a small museum about railway signalling. Volunteers are on hand to show you how the levers work, and children are allowed to pull them, under supervision.`,
    `SPEAKER: After that we come to Fenley. Fenley is where our engines are repaired and maintained, and on the hour, every hour, one of our engineers takes visitors round the engine sheds. You'll see locomotives in pieces, which is quite a sight. Unfortunately the tour isn't suitable for children under eight, because of the machinery.`,
    `SPEAKER: The next station is Copse Halt. It's a tiny station in the middle of the woods, and there's no café or shop there, but it is the starting point for a lovely walk to Hartmoor Falls, a waterfall about two kilometres from the station. The path can be muddy, so wear good shoes.`,
    `SPEAKER: And finally, at the top of the valley, we reach Kingsmead. A lot of people expect Kingsmead to have the playground, because it's the biggest station, but that was moved to Hartmoor Junction last year. What Kingsmead does have is our café, which is inside an old first-class carriage from the 1930s. They do excellent soup and homemade cakes, and you can watch the engine being turned round while you eat.`,
    `SPEAKER: I should mention that the picnic area that used to be at Kingsmead is closed this summer while new toilets are built, so if you've brought sandwiches, there are benches on the platform at Copse Halt instead.`,
    `SPEAKER: OK, we'll be leaving in about two minutes. Enjoy your journey, and if you have any questions, just ask any of the volunteers in the green jackets.`,
  ].join("\n"),
  questions: [
    choice(11, "The railway was first built to carry", ["passengers", "stone", "coal"], "B", `The railway "first opened in 1872 to carry stone from the quarries"; "Passengers were really an afterthought."`),
    choice(12, "What condition was attached to the sale of the line in 1981?", ["It had to reopen within eleven years.", "The buyers had to pay for repairs.", "It could only be run by volunteers."], "B", `The enthusiasts bought it "on the condition that they would repair it at their own expense."`),
    choice(13, "Most of the railway's volunteers", ["used to work on the railways", "are university students", "like outdoor practical work"], "C", `"Most are simply people who enjoy being outdoors and working with their hands".`),
    choice(14, "The speaker says the railway's income comes from", ["visitors' spending", "a government grant", "local businesses"], "A", `"We don't receive any money from the government, so every ticket, and every cup of tea you buy, helps to keep the line running."`),
    choice(15, "Passengers are warned about", ["the time of the last train", "low bridges", "crowded platforms"], "A", `Gareth says "The last train back leaves Kingsmead at half past four, and if you miss it, I'm afraid it's a very long walk."`),
    pick(16, "matching_features", "Hartmoor Junction", FEATURES, "B", `At Hartmoor Junction "it's well worth looking into the gift shop on platform one."`),
    pick(17, "matching_features", "Elder Bridge", FEATURES, "E", `Inside the signal box "there's a small museum about railway signalling."`),
    pick(18, "matching_features", "Fenley", FEATURES, "C", `At Fenley "one of our engineers takes visitors round the engine sheds."`),
    pick(19, "matching_features", "Copse Halt", FEATURES, "D", `Copse Halt "is the starting point for a lovely walk to Hartmoor Falls, a waterfall".`),
    pick(20, "matching_features", "Kingsmead", FEATURES, "F", `The playground moved, but Kingsmead has "our café, which is inside an old first-class carriage".`),
  ],
};

const part3: ItemGroup = {
  id: "lg-3",
  partNumber: 3,
  title: "Part 3 — Preparing a presentation on handwriting in schools",
  stimulusKind: "audio",
  instructions:
    "Questions 21-24: choose the correct letter, A, B or C. Questions 25-26: choose TWO letters, A-E, for each question. Questions 27-30: complete the flow chart. Write ONE WORD ONLY for each answer.",
  transcript: [
    `TUTOR: Hello, Maya, Ethan. So you're presenting next week on handwriting in schools. Where have you got to?`,
    `MAYA: We've done most of the reading, and we've agreed on the main argument, but we're not sure how to organise it.`,
    `TUTOR: Let's hear the argument first, then.`,
    `ETHAN: Basically, a lot of schools are spending less time on handwriting because children use keyboards so much. We wanted to know whether that matters. At first I thought the answer would just be that handwriting is old-fashioned, but the research is much more interesting than that.`,
    `MAYA: Yes. The studies we found suggest that writing by hand helps children learn to read. When they form the letters themselves, they seem to recognise them more quickly.`,
    `TUTOR: That's the key finding in this area, I'd agree. What was the most useful source you found?`,
    `ETHAN: There was a big review article from last year, which brought together about forty studies. The newspaper articles we found at the start were quite one-sided, and the government report was mostly about funding, so the review was much more helpful.`,
    `TUTOR: Good. Now, I wanted to ask about the study on note-taking at university. Are you including that?`,
    `MAYA: We are. It found that students who took notes by hand remembered the lecture better than those who typed. But we noticed that later researchers couldn't always get the same result.`,
    `TUTOR: That's an important point. You should say so. Don't present it as if it were certain. What do you think the main weakness of the research is in general?`,
    `ETHAN: Most of the studies are very small. Some only had twenty or thirty children.`,
    `MAYA: And they're nearly all from just two or three countries, so we don't know if the results apply everywhere.`,
    `TUTOR: Fair. Now, how are you going to begin the presentation? You only have fifteen minutes.`,
    `MAYA: I wanted to start with some statistics about how much time schools spend on handwriting now, but Ethan thinks that's boring.`,
    `ETHAN: I thought we could ask the audience to write a sentence by hand and then type the same sentence, and see which they remember. It gets everyone involved.`,
    `TUTOR: I like that, though keep it short. Two minutes at most. Then give your statistics afterwards. Now, have you thought about the visual side?`,
    `ETHAN: We'll have slides, obviously. And we thought we'd bring some examples of children's writing, from my younger sister's class. The teacher said that was fine.`,
    `MAYA: And a short video clip of a teacher talking about it. We filmed her ourselves.`,
    `TUTOR: Good. I'd avoid too much text on the slides, though. People read instead of listening.`,
    `MAYA: OK. And we wanted to finish by talking about what schools should actually do.`,
    `TUTOR: That's a sensible way to end. Now, how are you going to divide the speaking between you? Examiners like to see that both of you have contributed equally.`,
    `ETHAN: We thought Maya would do the first half, because she found most of the research, and I'd do the second half, including the recommendations.`,
    `TUTOR: That's fine, but make sure the change from one speaker to the other is smooth. Practise it a few times, and time yourselves. Most groups find their first practice runs well over the limit.`,
    `MAYA: We'll do a full practice on Thursday evening.`,
    `TUTOR: Fine. Let's go over the order of the whole thing, so it's clear. You'll start with the activity.`,
    `ETHAN: Yes, the writing and typing activity. Then the statistics on time spent in schools. Then we explain the main research finding, the link between handwriting and learning to read.`,
    `MAYA: After that, we describe the note-taking study, and then we discuss the limitations of the research, the small size of the studies and so on.`,
    `TUTOR: And then the recommendations?`,
    `ETHAN: Yes, we'll finish with recommendations for schools. We think the main one is that handwriting shouldn't be dropped completely, especially in the first years of school.`,
    `TUTOR: And after that, you'll take questions. Leave at least three minutes for those. People always have something to say about handwriting.`,
    `MAYA: Will do. Thanks for your help.`,
    `TUTOR: You're welcome. I'm looking forward to it.`,
  ].join("\n"),
  questions: [
    choice(21, "What does the research suggest about handwriting?", ["It is becoming old-fashioned.", "It helps children learn to read.", "It improves children's spelling."], "B", `Maya says "writing by hand helps children learn to read."`),
    choice(22, "Which source did the students find most useful?", ["a review article", "newspaper articles", "a government report"], "A", `Ethan says the newspaper articles were "one-sided" and the government report was about funding, "so the review was much more helpful."`),
    choice(23, "What does the tutor say about the note-taking study?", ["It should be left out.", "Its uncertainty should be mentioned.", "It is the most important study."], "B", `The students say later researchers "couldn't always get the same result", and the tutor says "Don't present it as if it were certain."`),
    choice(24, "How will the presentation begin?", ["with some statistics", "with an activity for the audience", "with a video clip"], "B", `The tutor approves the writing and typing activity and says "give your statistics afterwards."`),
    pickTwo(25, "Which TWO weaknesses of the research do the students mention?", ["The studies are old.", "The studies are small.", "The studies come from few countries.", "The studies use only older children.", "The studies were paid for by companies."], ["B", "C"], `Ethan says "Most of the studies are very small", and Maya adds "they're nearly all from just two or three countries".`),
    pickTwo(26, "Which TWO visual materials will the students use, apart from slides?", ["examples of children's writing", "a poster", "a video clip", "a handout", "photographs of classrooms"], ["A", "C"], `Ethan will "bring some examples of children's writing", and Maya mentions "a short video clip of a teacher talking about it."`),
    gap(27, "flowchart_completion", "Writing and typing activity → statistics on time spent in schools → the link between handwriting and learning to ______", ["read", "reading"], `Ethan says they will explain "the link between handwriting and learning to read."`, 1),
    gap(28, "flowchart_completion", "→ the ______ study", ["note-taking", "notetaking"], `Maya says "we describe the note-taking study".`, 1),
    gap(29, "flowchart_completion", "→ the ______ of the research", ["limitations", "weaknesses"], `"then we discuss the limitations of the research, the small size of the studies and so on."`, 1),
    gap(30, "flowchart_completion", "→ ______ for schools → questions", ["recommendations"], `Ethan says "we'll finish with recommendations for schools."`, 1),
  ],
};

const part4: ItemGroup = {
  id: "lg-4",
  partNumber: 4,
  title: "Part 4 — Lecture: how desert plants survive",
  stimulusKind: "audio",
  instructions:
    "Questions 31-40. Complete the notes below. Write ONE WORD ONLY for each answer.",
  transcript: [
    `LECTURER: Good afternoon, everyone. Today we're going to look at how plants survive in deserts, which are among the harshest environments on Earth. A desert is usually defined as a place that receives less than two hundred and fifty millimetres of rain a year. But it isn't only the lack of rain that makes life difficult. Plants also have to cope with intense heat during the day, sometimes freezing temperatures at night, and soils that are often salty and poor in nutrients.`,
    `LECTURER: Broadly speaking, desert plants follow one of three strategies. They either escape the dry conditions, store water, or reduce the amount of water they lose.`,
    `LECTURER: Let's start with escape. Many desert plants are annuals, meaning they complete their whole life cycle within a single year, and often within a few weeks. Their seeds can lie in the ground for years, waiting. When enough rain finally falls, they germinate, grow, flower and produce new seeds very quickly, before the soil dries out again. This is what produces the famous desert blooms, when an apparently empty landscape is suddenly covered in flowers. Interestingly, the seeds of some species contain a chemical that stops them germinating after a light shower. Only heavy rain washes it away, which ensures that the seeds don't start growing unless there is enough water for the plant to survive.`,
    `LECTURER: The second strategy is storage, and the best-known example is the cactus. A cactus stores water in its thick stem, which is made of a spongy tissue. Many cacti have folds, rather like the folds of a curtain, which allow the stem to expand when it fills with water after rain and to shrink again during dry periods. A large saguaro cactus in Arizona can take in hundreds of litres of water after a single storm.`,
    `LECTURER: Of course, a plant full of water is an attractive target for thirsty animals. That's one reason why cacti have spines. But the spines have other functions too. They provide a little shade for the stem, and they trap a thin layer of still air around the plant, which reduces water loss. In fact, the spines are a kind of leaf. By having spines rather than broad leaves, cacti greatly reduce the surface area through which water can escape.`,
    `LECTURER: That brings us to the third strategy, reducing water loss. Plants lose water mainly through tiny pores, mostly on their leaves, which they open to take in carbon dioxide. Many desert plants have a special system: they keep their pores closed during the heat of the day and open them only at night, when it is cooler and the air is more humid. They store the carbon dioxide overnight and use it for photosynthesis the next day. This system is very efficient, although it means the plants tend to grow slowly.`,
    `LECTURER: Other plants have leaves covered with a thick coating of wax, which acts as a barrier to evaporation. And some have leaves covered in fine white hairs. These hairs reflect sunlight, keeping the leaf cooler.`,
    `LECTURER: Roots, too, are important. Desert plants generally have one of two root systems. Some, like the mesquite tree, send a single root very deep into the ground to reach water far below the surface. Mesquite roots have been found more than fifty metres down. Cacti, on the other hand, usually have shallow roots that spread out widely just below the surface, so that they can absorb as much water as possible from even a brief shower before it evaporates.`,
    `LECTURER: Finally, I want to mention why this matters to us. As the climate changes, many farming regions are becoming hotter and drier. Scientists are studying desert plants to understand which of their features could be bred into food crops. Some of the most promising research involves the night-time system I described, which researchers hope to introduce into crops such as rice. It is still at an early stage, but if it succeeds, it could allow food to be grown with far less water.`,
    `LECTURER: For next week, please read the chapter on plants in polar regions, which face a surprisingly similar set of problems.`,
  ].join("\n"),
  questions: [
    gap(31, "note_completion", "Desert: less than 250 mm of ______ per year", ["rain", "rainfall"], `A desert "receives less than two hundred and fifty millimetres of rain a year."`, 1),
    gap(32, "note_completion", "Desert soils are often salty and poor in ______", ["nutrients"], `Desert soils "are often salty and poor in nutrients."`, 1),
    gap(33, "note_completion", "Escape: annuals germinate only after heavy rain washes away a ______ in the seed", ["chemical"], `Some seeds "contain a chemical that stops them germinating after a light shower."`, 1),
    gap(34, "note_completion", "Storage: a cactus keeps water in its ______", ["stem"], `"A cactus stores water in its thick stem".`, 1),
    gap(35, "note_completion", "Folds allow the stem to ______ after rain", ["expand"], `The folds "allow the stem to expand when it fills with water after rain".`, 1),
    gap(36, "note_completion", "Spines give the stem some ______ and trap still air", ["shade"], `The spines "provide a little shade for the stem".`, 1),
    gap(37, "note_completion", "Many desert plants open their pores only at ______", ["night"], `They "open them only at night, when it is cooler".`, 1),
    gap(38, "note_completion", "Some leaves have a coating of ______ to prevent evaporation", ["wax"], `Some plants "have leaves covered with a thick coating of wax".`, 1),
    gap(39, "note_completion", "White hairs on leaves reflect ______", ["sunlight", "light"], `"These hairs reflect sunlight, keeping the leaf cooler."`, 1),
    gap(40, "note_completion", "Researchers hope to introduce the night-time system into crops such as ______", ["rice"], `Researchers "hope to introduce into crops such as rice."`, 1),
  ],
};

export const listeningSection: Section = {
  code: "listening",
  title: "Listening",
  durationMinutes: 30,
  questionCount: 40,
  itemGroups: [part1, part2, part3, part4],
};
