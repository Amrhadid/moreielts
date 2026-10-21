import type { ItemGroup, Question, Section } from "../../../../src/types/content";

/**
 * Academic Reading: 3 passages, 40 questions, 60 minutes. Foundation level:
 * clear prose and fairly direct paraphrase between questions and text.
 */

const TFNG = [
  { value: "TRUE", label: "TRUE" },
  { value: "FALSE", label: "FALSE" },
  { value: "NOT GIVEN", label: "NOT GIVEN" },
];

const YNNG = [
  { value: "YES", label: "YES" },
  { value: "NO", label: "NO" },
  { value: "NOT GIVEN", label: "NOT GIVEN" },
];

const HEADINGS = [
  { value: "i", label: "i. Saving money on heating and cooling" },
  { value: "ii", label: "ii. An old idea in a new setting" },
  { value: "iii", label: "iii. Why many buildings cannot carry a garden" },
  { value: "iv", label: "iv. Helping wildlife in the city" },
  { value: "v", label: "v. Food grown close to the people who eat it" },
  { value: "vi", label: "vi. Slowing the flow of rainwater" },
  { value: "vii", label: "vii. Laws that require green roofs" },
  { value: "viii", label: "viii. The high price of fresh vegetables" },
];

const PARAGRAPHS = ["A", "B", "C", "D", "E", "F"].map((p) => ({ value: p, label: `Paragraph ${p}` }));

const passage1: ItemGroup = {
  id: "rg-1",
  partNumber: 1,
  title: "Passage 1 — The rise of the bicycle",
  stimulusKind: "passage",
  instructions:
    "You should spend about 20 minutes on Questions 1-13, which are based on Reading Passage 1 below.",
  passageText: `Today the bicycle is so familiar that it is easy to forget it is a fairly recent invention. People were building steam engines and printing newspapers long before anyone found a practical way to travel on two wheels. The story of how the bicycle developed is a story of many small improvements made by different people in different countries over about seventy years.

The first machine that most historians accept as an early bicycle was built in 1817 by Karl von Drais, a German official. It was made almost entirely of wood and had no pedals. The rider sat on a seat between two wheels and pushed the ground with his feet, rather like a child on a modern balance bike. Drais called it a "running machine", and on its first journey he travelled about fourteen kilometres in under an hour, which was faster than walking. Drais hoped that his machine would be useful at a time when horses were expensive to feed, because poor harvests had made oats very costly. The idea was copied quickly in France and Britain, where the machines were known as "hobby horses". However, they were expensive, uncomfortable on rough roads and dangerous on hills, and the fashion lasted only a few years.

The next important step came in the 1860s in France, when pedals were attached directly to the front wheel. This machine, called the velocipede, could be ridden without the feet touching the ground. It became popular in Paris, and riding schools opened where wealthy young men paid to learn. But the velocipede had a serious problem. It had iron tyres and a heavy frame, and the ride was so rough that the British gave it the nickname "boneshaker".

Because the pedals turned the front wheel directly, one turn of the pedals moved the machine only as far as the wheel travelled in one turn. The obvious way to go faster was to make the front wheel larger. By the 1870s, makers in Britain were producing bicycles with front wheels as large as one and a half metres across and a tiny rear wheel. These machines, later called "penny-farthings" after two British coins of different sizes, were fast and surprisingly efficient. They also had rubber tyres, which made them more comfortable. However, the rider sat very high above the ground, and a stone in the road could throw him forward over the handlebars. Riding a penny-farthing was therefore mostly a sport for brave young men, and very few women rode them.

The machine that changed everything was the "safety bicycle", which appeared in the 1880s. The best-known early design was the Rover, produced in 1885 by John Kemp Starley in the English city of Coventry. The safety bicycle had two wheels of the same size and a chain that connected the pedals to the rear wheel. Because of the chain, a small wheel could still turn quickly, so the rider could sit lower and put his or her feet on the ground when stopping. Three years later, in 1888, John Boyd Dunlop, a Scottish vet living in Ireland, developed a tyre filled with air for his son's tricycle. Air-filled tyres were soon fitted to safety bicycles, and the ride became smooth for the first time.

The result was a cycling boom in the 1890s. Factories in Britain, France and the United States produced bicycles in huge numbers, and prices fell until ordinary workers could afford one. For many people, the bicycle was the first machine that allowed them to travel independently beyond their own town or village. It had a particularly strong effect on the lives of women. Cycling required practical clothing, and the long, heavy skirts of the time were gradually replaced by shorter skirts and loose trousers. The American campaigner Susan B. Anthony said in 1896 that the bicycle had "done more to emancipate women than anything else in the world".

The bicycle also helped to prepare the way for other forms of transport. Cyclists in Britain and the United States formed clubs that campaigned for better roads, and many of the skills and factories of the bicycle industry were later used to make motor cars and even aircraft. The Wright brothers, who made the first powered flight in 1903, ran a bicycle shop in Ohio, and they used the money from that business to pay for their experiments.

Although the basic design of the safety bicycle has hardly changed in more than a century, the bicycle continues to develop. Gears, lighter materials such as aluminium and carbon fibre, and more recently electric motors have all made cycling easier. Bicycles are also very popular in developing countries, where they are often the cheapest way to carry goods to market. Many cities are now building cycle lanes to reduce traffic and pollution, so the machine that began as a wooden toy may have an important part to play in the future.`,
  questions: [
    ...([
      ["The bicycle was invented after the steam engine.", "TRUE", 'The passage says "People were building steam engines and printing newspapers long before anyone found a practical way to travel on two wheels."'],
      ["Drais's running machine was moved by pedals.", "FALSE", 'The machine "had no pedals" and the rider "pushed the ground with his feet".'],
      ["Drais sold hundreds of running machines in Germany.", "NOT GIVEN", 'The passage says the idea "was copied quickly in France and Britain" but gives no sales figures for Drais.'],
      ["Hobby horses remained fashionable for several decades.", "FALSE", 'The passage says "the fashion lasted only a few years."'],
      ["The velocipede got its British nickname because it was uncomfortable to ride.", "TRUE", 'The ride was "so rough that the British gave it the nickname" boneshaker.'],
      ["Penny-farthings were ridden by women as often as by men.", "FALSE", 'Riding one was "mostly a sport for brave young men, and very few women rode them."'],
      ["Starley later opened a second factory outside Coventry.", "NOT GIVEN", 'The passage only says the Rover was "produced in 1885 by John Kemp Starley in the English city of Coventry"; no second factory is mentioned.'],
    ] as const).map(
      ([prompt, answer, explanation], i): Question => ({
        id: `r-q${i + 1}`,
        number: i + 1,
        type: "true_false_notgiven",
        prompt,
        options: TFNG,
        acceptedAnswers: [answer],
        explanation,
      }),
    ),
    ...([
      ["Velocipede (1860s): pedals fixed to the ______ wheel", ["front"], 'In the 1860s "pedals were attached directly to the front wheel."'],
      ["Penny-farthing (1870s): made more comfortable by ______ tyres", ["rubber"], 'Penny-farthings "also had rubber tyres, which made them more comfortable."'],
      ["Safety bicycle (1880s): a ______ linked the pedals to the rear wheel", ["chain"], 'It had "a chain that connected the pedals to the rear wheel."'],
      ["Dunlop first made his air-filled tyre for his son's ______", ["tricycle"], 'Dunlop "developed a tyre filled with air for his son\'s tricycle."'],
      ["1890s: bicycles became cheap enough for ordinary ______ to buy", ["workers"], 'Prices "fell until ordinary workers could afford one."'],
      ["The Wright brothers paid for their experiments with money from a bicycle ______", ["shop"], 'They "ran a bicycle shop in Ohio" and "used the money from that business to pay for their experiments."'],
    ] as const).map(
      ([prompt, answers, explanation], i): Question => ({
        id: `r-q${i + 8}`,
        number: i + 8,
        type: "note_completion",
        prompt: `${prompt} (ONE WORD ONLY)`,
        acceptedAnswers: [...answers],
        wordLimit: 1,
        explanation,
      }),
    ),
  ],
};

const passage2: ItemGroup = {
  id: "rg-2",
  partNumber: 2,
  title: "Passage 2 — Gardens on the rooftops",
  stimulusKind: "passage",
  instructions:
    "You should spend about 20 minutes on Questions 14-26, which are based on Reading Passage 2 below.",
  passageText: `A. Planting gardens on top of buildings is not a modern invention. In Scandinavia, farmhouses were covered with grass roofs for hundreds of years because the thick layer of soil kept the houses warm in winter. What is new is the idea of putting gardens on the flat roofs of offices, shops and apartment blocks in large modern cities. Over the past thirty years, this kind of "green roof" has spread from a few experimental buildings in Germany to thousands of cities around the world.

B. One of the main reasons city governments support green roofs is water. In a city, most surfaces are hard, so when it rains heavily the water runs straight off roofs and roads into the drains. If the drains cannot cope, streets flood. A green roof works like a sponge. The plants and soil hold much of the rain and release it slowly, and some of it simply evaporates back into the air. Studies in Germany have found that a typical green roof can hold between fifty and ninety per cent of the rain that falls on it in summer, which greatly reduces the pressure on the drains. In winter, when plants grow more slowly, the figure is lower, but it is still significant. The water that does leave the roof is also cleaner, because the soil filters out some of the dust and pollution it has collected.

C. Green roofs can also reduce energy costs for the people inside the building. A normal dark roof becomes extremely hot in summer, sometimes reaching more than seventy degrees Celsius, and this heat passes into the rooms below. A roof covered in plants stays much cooler, so less air conditioning is needed. In winter the soil acts as an extra layer of insulation, keeping heat inside. A study of one shopping centre in Canada found that its green roof reduced the energy used for cooling by about a quarter. Green roofs also help to cool the city as a whole. Large cities are often several degrees warmer than the countryside around them, because concrete and tarmac absorb heat during the day and release it at night. Plants cool the air as water evaporates from their leaves, so a city with many green roofs can be noticeably more comfortable during a heatwave.

D. A third benefit is for nature. Cities have lost large areas of grassland and woodland, and many birds and insects have lost their homes as a result. Green roofs can give them a place to feed and rest. In London, some roofs have been specially designed for a rare bird called the black redstart, using gravel and local plants that copy its natural habitat. Bees and butterflies also visit roof gardens, even on buildings more than ten floors high. Some building owners now place beehives on their roofs and sell the honey to staff and visitors.

E. Some rooftop gardens go one step further and produce food. In New York, one company runs two large farms on the roofs of old industrial buildings and sells vegetables to local restaurants and shops. Because the food travels only a short distance, it can be picked when it is ripe and reach customers on the same day. Supporters say rooftop farms can also teach city children where food comes from, and many of them run regular visits for school groups.

F. Despite these advantages, green roofs are still unusual in most cities, and the main reason is weight. Wet soil is very heavy, and many older buildings were not designed to carry this load. Before a garden can be added, an engineer must check that the roof is strong enough, and in many cases it is not. Strengthening a roof is expensive, so most green roofs are built on new buildings, where the extra weight can be included in the design from the start. Lighter systems, which use a thin layer of special soil and small, tough plants called sedums, can be fitted to some older roofs, but they hold less water and support fewer kinds of wildlife.

G. Several cities have now decided that the benefits are worth the cost. Since 2009 Toronto has required most new large buildings to include a green roof, and cities such as Copenhagen and Paris have introduced similar rules. Other cities prefer to encourage owners with money rather than force them, by paying part of the cost of construction. Builders also point out that a green roof needs care. Weeds must be removed, dead plants replaced and drains kept clear, and on a tall building this work can only be done by trained staff, which adds to the yearly cost. Either way, as cities grow hotter and storms become heavier, it seems likely that more and more of the view from a high window will be green.`,
  questions: [
    ...([
      ["Paragraph A", "ii", 'Paragraph A explains that grass roofs existed "for hundreds of years" and that "What is new is the idea of putting gardens on the flat roofs" of city buildings.'],
      ["Paragraph B", "vi", 'Paragraph B says "A green roof works like a sponge" and the plants "release it slowly", reducing flooding.'],
      ["Paragraph C", "i", 'Paragraph C says "Green roofs can also reduce energy costs" in summer and winter.'],
      ["Paragraph D", "iv", 'Paragraph D says "A third benefit is for nature" and describes roofs for birds, bees and butterflies.'],
      ["Paragraph E", "v", 'Paragraph E describes rooftop farms where "the food travels only a short distance".'],
      ["Paragraph F", "iii", 'Paragraph F explains "the main reason is weight" and "many older buildings were not designed to carry this load."'],
    ] as const).map(
      ([prompt, answer, explanation], i): Question => ({
        id: `r-q${i + 14}`,
        number: i + 14,
        type: "matching_headings",
        prompt: `${prompt} — choose the most suitable heading.`,
        options: HEADINGS,
        acceptedAnswers: [answer],
        explanation,
      }),
    ),
    ...([
      ["the temperature that an ordinary roof can reach", "C", 'Paragraph C says a dark roof can reach "more than seventy degrees Celsius".'],
      ["an example of a roof designed for one particular species", "D", 'Paragraph D mentions roofs "specially designed for a rare bird called the black redstart".'],
      ["educational visits for young people", "E", 'Paragraph E says rooftop farms "run regular visits for school groups."'],
    ] as const).map(
      ([prompt, answer, explanation], i): Question => ({
        id: `r-q${i + 20}`,
        number: i + 20,
        type: "matching_information",
        prompt: `Which paragraph, A-F, contains ${prompt}?`,
        options: PARAGRAPHS,
        acceptedAnswers: [answer],
        explanation,
      }),
    ),
    ...([
      ["Green roofs first spread from experimental buildings in ______.", ["Germany"], 'Green roofs spread "from a few experimental buildings in Germany".'],
      ["Before a garden is added, an ______ must check the strength of the roof.", ["engineer"], 'The passage says "an engineer must check that the roof is strong enough".'],
      ["Lighter systems use small, tough plants known as ______.", ["sedums"], 'Lighter systems use "small, tough plants called sedums".'],
      ["Instead of making rules, some cities offer owners ______ towards the cost.", ["money"], 'Some cities "encourage owners with money rather than force them".'],
    ] as const).map(
      ([prompt, answers, explanation], i): Question => ({
        id: `r-q${i + 23}`,
        number: i + 23,
        type: "summary_completion",
        prompt: `${prompt} (ONE WORD ONLY)`,
        acceptedAnswers: [...answers],
        wordLimit: 1,
        explanation,
      }),
    ),
  ],
};

const ENDINGS = [
  { value: "A", label: "A. because their body clock changes during puberty." },
  { value: "B", label: "B. because they spend too long on homework." },
  { value: "C", label: "C. which shows that a later start can improve results." },
  { value: "D", label: "D. which is why light from screens is a particular problem." },
  { value: "E", label: "E. unless parents set a fixed bedtime." },
];

const passage3: ItemGroup = {
  id: "rg-3",
  partNumber: 3,
  title: "Passage 3 — Should school start later?",
  stimulusKind: "passage",
  instructions:
    "You should spend about 20 minutes on Questions 27-40, which are based on Reading Passage 3 below.",
  passageText: `Parents of teenagers often complain that their children stay up too late at night and are impossible to wake in the morning. For a long time this was seen as a question of discipline: young people, it was thought, simply needed to go to bed earlier. Over the past thirty years, however, sleep scientists have collected a great deal of evidence that the problem is mainly biological, and some of them now argue that it is schools, rather than teenagers, that should change their habits. In my view, that argument is largely correct.

The key to the problem is the body clock, the internal system that tells us when to feel sleepy and when to feel alert. One of the main signals in this system is a hormone called melatonin, which the body releases in the evening to prepare us for sleep. In young children, melatonin is released quite early, which is why they are usually ready for bed by eight o'clock. During puberty, however, the body clock shifts. Teenagers begin to release melatonin as much as two hours later than they did as children. As a result, a typical sixteen-year-old does not feel sleepy until around eleven o'clock at night, however early he or she goes to bed.

At the same time, teenagers still need a lot of sleep, between eight and ten hours a night according to most experts. A teenager who falls asleep at eleven therefore needs to sleep until at least seven, and ideally later. Yet in many countries secondary schools begin at around eight o'clock, and some students must leave home before seven to catch a bus. Surveys in the United States suggest that most high-school students sleep less than eight hours on school nights, and many sleep less than seven.

The effects of this lost sleep are serious. Tired students find it harder to concentrate and remember what they have learned, and they are more likely to feel anxious or depressed. Sleepy teenage drivers are also more likely to have accidents. Some people blame mobile phones and computers for the problem, and it is true that the bright light from screens can delay the release of melatonin even further. But teenagers were sleeping late long before smartphones were invented, and taking away their phones does not change the body clock itself.

What happens when schools start later? Several studies suggest the results can be impressive. In one well-known study in the American city of Seattle, two high schools moved their start time from 7.50 to 8.45 in the morning. Researchers measured students' sleep with wrist monitors before and after the change. They found that students slept, on average, thirty-four minutes longer each night, and their grades in biology rose by about four and a half per cent. Attendance also improved, especially in the first lesson of the day. Similar results have been reported in Britain and Australia. Teachers in several of these schools also said that students seemed more awake and took a more active part in lessons, although this is harder to measure.

Not everyone is convinced. Some critics argue that if school starts later, students will simply go to bed later, and so gain no extra sleep. The Seattle study, however, found that bedtimes stayed roughly the same while waking times moved later, which is exactly what the body clock theory predicts. A more practical objection is cost. A later start can make it harder to organise school buses, especially where the same buses carry younger children to primary schools. It can also cause difficulties for parents who need to leave for work early, and for students who have part-time jobs or sports training after school.

These problems are real, but I do not believe they are a good reason to do nothing. Bus timetables can be changed, and many schools have found that the difficulties are smaller in practice than they expected. Moreover, the cost of tired students is also real, even if it does not appear in a school's budget. It is paid in lower grades, poorer health and, in the worst cases, road accidents.

Some schools have tried a compromise, keeping the same start time but moving the most demanding lessons, such as mathematics, away from the first hour of the day. The early results of this approach are encouraging, though less impressive than those of a genuinely later start. It would be wrong to suggest that a later start will solve every problem. Teenagers still benefit from good habits, such as keeping screens out of the bedroom and going to bed at a similar time each night. But schools are in the unusual position of being able to give millions of young people more sleep with a single decision. In the United States, the American Academy of Pediatrics has recommended that secondary schools should start no earlier than 8.30. I believe more education authorities around the world should follow that advice.`,
  questions: [
    ...([
      ["Teenagers' sleep problems are mainly caused by a lack of discipline.", "NO", 'The writer reports evidence "that the problem is mainly biological" and says that argument "is largely correct".'],
      ["Most teenagers need at least eight hours of sleep a night.", "YES", 'Teenagers need "between eight and ten hours a night according to most experts."'],
      ["Teenagers who use phones at night sleep worse than those who read books.", "NOT GIVEN", 'The writer says light from screens "can delay the release of melatonin" but makes no comparison with reading books.'],
      ["Removing teenagers' phones will correct their body clocks.", "NO", 'The writer says "taking away their phones does not change the body clock itself."'],
      ["The practical difficulties of a later start are a good reason to keep early start times.", "NO", 'The writer says "I do not believe they are a good reason to do nothing."'],
    ] as const).map(
      ([prompt, answer, explanation], i): Question => ({
        id: `r-q${i + 27}`,
        number: i + 27,
        type: "yes_no_notgiven",
        prompt: `Do the following statements agree with the views of the writer? ${prompt}`,
        options: YNNG,
        acceptedAnswers: [answer],
        explanation,
      }),
    ),
    {
      id: "r-q32",
      number: 32,
      type: "multiple_choice_single",
      prompt: "According to the passage, melatonin is",
      options: [
        { value: "A", label: "A. a hormone that helps the body prepare for sleep." },
        { value: "B", label: "B. released earlier in teenagers than in children." },
        { value: "C", label: "C. produced only when it is completely dark." },
        { value: "D", label: "D. the main cause of anxiety in young people." },
      ],
      acceptedAnswers: ["A"],
      explanation: 'Melatonin is "a hormone" which "the body releases in the evening to prepare us for sleep."',
    },
    {
      id: "r-q33",
      number: 33,
      type: "multiple_choice_single",
      prompt: "In the Seattle study, the school start time was moved",
      options: [
        { value: "A", label: "A. about thirty minutes later." },
        { value: "B", label: "B. nearly an hour later." },
        { value: "C", label: "C. to 8.30 in the morning." },
        { value: "D", label: "D. to after nine o'clock." },
      ],
      acceptedAnswers: ["B"],
      explanation: 'The schools "moved their start time from 7.50 to 8.45 in the morning", which is 55 minutes later.',
    },
    {
      id: "r-q34",
      number: 34,
      type: "multiple_choice_single",
      prompt: "After the change in Seattle, students",
      options: [
        { value: "A", label: "A. went to bed much later than before." },
        { value: "B", label: "B. slept over an hour longer each night." },
        { value: "C", label: "C. went to bed at about the same time but woke later." },
        { value: "D", label: "D. improved their grades in every subject." },
      ],
      acceptedAnswers: ["C"],
      explanation: 'The study "found that bedtimes stayed roughly the same while waking times moved later".',
    },
    {
      id: "r-q35",
      number: 35,
      type: "multiple_choice_single",
      prompt: "Which problem with a later start does the writer mention?",
      options: [
        { value: "A", label: "A. Teachers would have to work longer hours." },
        { value: "B", label: "B. Organising school buses could be more difficult." },
        { value: "C", label: "C. Primary schools would also have to start later." },
        { value: "D", label: "D. Students would have less time for homework." },
      ],
      acceptedAnswers: ["B"],
      explanation: 'The writer says "A later start can make it harder to organise school buses".',
    },
    ...([
      ["A typical sixteen-year-old does not feel sleepy until about eleven at night", "A", 'During puberty "the body clock shifts", so a sixteen-year-old "does not feel sleepy until around eleven o\'clock at night".'],
      ["Bright light in the evening can make teenagers' sleep problems worse", "D", 'The passage says "the bright light from screens can delay the release of melatonin even further."'],
      ["Grades and attendance rose after the Seattle schools changed their timetable", "C", 'After the later start "their grades in biology rose" and "Attendance also improved".'],
    ] as const).map(
      ([prompt, answer, explanation], i): Question => ({
        id: `r-q${i + 36}`,
        number: i + 36,
        type: "matching_sentence_endings",
        prompt,
        options: ENDINGS,
        acceptedAnswers: [answer],
        explanation,
      }),
    ),
    {
      id: "r-q39",
      number: 39,
      type: "short_answer",
      prompt:
        "Which organisation recommends that secondary schools start no earlier than 8.30? Write NO MORE THAN FIVE WORDS.",
      acceptedAnswers: ["American Academy of Pediatrics", "the American Academy of Pediatrics"],
      wordLimit: 5,
      explanation: 'The passage says "the American Academy of Pediatrics has recommended that secondary schools should start no earlier than 8.30."',
    },
    {
      id: "r-q40",
      number: 40,
      type: "multiple_choice_multiple",
      prompt: "Which TWO effects of lost sleep does the writer mention? Choose TWO letters.",
      options: [
        { value: "A", label: "A. difficulty concentrating" },
        { value: "B", label: "B. weight gain" },
        { value: "C", label: "C. a higher risk of road accidents" },
        { value: "D", label: "D. arguments with parents" },
        { value: "E", label: "E. poorer eyesight" },
      ],
      acceptedAnswers: ["A", "C"],
      explanation: 'Tired students "find it harder to concentrate" and "Sleepy teenage drivers are also more likely to have accidents."',
    },
  ],
};

export const readingSection: Section = {
  code: "reading",
  title: "Reading",
  durationMinutes: 60,
  questionCount: 40,
  itemGroups: [passage1, passage2, passage3],
};
