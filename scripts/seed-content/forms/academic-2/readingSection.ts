import type { ItemGroup, Question, QuestionOption, QuestionTypeCode, Section } from "../../../../src/types/content";

/**
 * Academic Reading: 3 passages, 40 questions, 60 minutes.
 * The passages exercise 11 of the 15 registry types between them.
 */

const TFNG: QuestionOption[] = [
  { value: "TRUE", label: "TRUE" },
  { value: "FALSE", label: "FALSE" },
  { value: "NOT GIVEN", label: "NOT GIVEN" },
];

const YNNG: QuestionOption[] = [
  { value: "YES", label: "YES" },
  { value: "NO", label: "NO" },
  { value: "NOT GIVEN", label: "NOT GIVEN" },
];

type Row = readonly [prompt: string, answer: string, explanation: string];
type GapRow = readonly [prompt: string, answers: readonly string[], explanation: string];

function withOptions(start: number, type: QuestionTypeCode, options: QuestionOption[], rows: readonly Row[]): Question[] {
  return rows.map(([prompt, answer, explanation], i) => ({
    id: `r-q${start + i}`,
    number: start + i,
    type,
    prompt,
    options,
    acceptedAnswers: [answer],
    explanation,
  }));
}

function gaps(start: number, type: QuestionTypeCode, wordLimit: number, rows: readonly GapRow[]): Question[] {
  return rows.map(([prompt, answers, explanation], i) => ({
    id: `r-q${start + i}`,
    number: start + i,
    type,
    prompt,
    acceptedAnswers: [...answers],
    wordLimit,
    explanation,
  }));
}

function mcq(number: number, prompt: string, labels: string[], answer: string, explanation: string): Question {
  return {
    id: `r-q${number}`,
    number,
    type: "multiple_choice_single",
    prompt,
    options: labels.map((label, i) => ({
      value: String.fromCharCode(65 + i),
      label: `${String.fromCharCode(65 + i)}. ${label}`,
    })),
    acceptedAnswers: [answer],
    explanation,
  };
}

const passage1: ItemGroup = {
  id: "rg-1",
  partNumber: 1,
  title: "Passage 1 — The making of the modern pencil",
  stimulusKind: "passage",
  instructions:
    "You should spend about 20 minutes on Questions 1-13, which are based on Reading Passage 1 below.",
  passageText: `Few objects are as ordinary as the pencil, and few have a history so closely tied to war, smuggling and industrial secrecy. The story begins in the 1560s in Borrowdale, a remote valley in the north of England, where a violent storm is said to have uprooted a large tree and exposed a seam of a black, greasy mineral beneath its roots. Local shepherds soon discovered that the substance left a dark mark that did not wash off in the rain, and they used it to mark their sheep. They called it wad, or black lead, in the mistaken belief that it was a form of lead. It was in fact graphite, a pure form of carbon, and the Borrowdale deposit remains the only one ever found in which the graphite was solid and pure enough to be sawn directly into sticks.

The mineral was soon found to have more serious uses. It could line the moulds used for casting cannonballs, producing smoother and rounder shot, and its value rose accordingly. The mine came under the control of the Crown, which limited extraction to a few weeks each year in order to keep prices high, and the entrance was guarded by armed men. In 1752, Parliament made the theft of wad a crime punishable by hard labour or transportation to the colonies. Despite this, a flourishing black market grew up around the mine, and stolen graphite was sold in the inns of the nearby town of Keswick.

The earliest pencils were simply sticks of graphite wrapped in string or sheepskin to keep the user's fingers clean. Before long, craftsmen began enclosing the graphite in wood. A groove was cut in a strip of juniper, the stick was laid inside, and a second strip was glued over the top. The basic method of placing the core between two halves of wood is still used today, although juniper has long since given way to cedar, which is softer and easier to sharpen.

England's near-monopoly on solid graphite created a problem for other countries, and the problem became acute in the 1790s, when France found itself at war with Britain and cut off from its supply. The French government turned to Nicolas-Jacques Conté, an engineer and inventor, and asked him to find a substitute. Conté's solution, patented in 1795, was to grind impure graphite into a fine powder and mix it with clay and water. The resulting paste was pressed into long, thin moulds and then fired in a kiln at a high temperature. Once cooled, the rods were waxed so that they would glide smoothly across the paper.

Conté's process was more than a wartime improvisation. By varying the proportion of clay to graphite, he found that he could control the hardness of the finished core: more clay produced a harder, paler line, while more graphite produced a softer, darker one. This is the origin of the grading system that is still printed on pencils today, in which H stands for hard and B for black. Because the process could use powdered graphite of almost any quality, it also freed pencil makers from their dependence on Borrowdale. By the middle of the nineteenth century the Cumbrian mine was nearly exhausted, and it closed for good in 1891.

The centre of the industry then shifted to Germany, and particularly to the region around Nuremberg, where families such as the Fabers and the Staedtlers established factories that are still in operation. In the United States, meanwhile, the writer Henry David Thoreau worked for a time in his father's pencil business in Massachusetts, where he developed an improved method of grinding graphite that made the family's pencils among the best in the country. Mass production arrived in the second half of the century, when machines were introduced that could cut the grooves in the wood and shape finished pencils far faster than any craftsman.

One persistent feature of the pencil, its yellow paint, dates from the 1890s. The finest graphite of the period came from a mine in Siberia, near the border with China, and one manufacturer painted its premium pencils yellow, a colour associated with Chinese imperial authority, to advertise their origin. Rival companies quickly copied the colour so that their own pencils would appear to be of the same quality, and in North America yellow remains by far the most common colour for pencils sold today.

The rubber eraser attached to the end of many pencils has a more contested history. An American stationer, Hymen Lipman, patented the idea in 1858, but the patent was later declared invalid by the Supreme Court on the grounds that it merely combined two existing objects without creating anything new. Perhaps because of this, pencils sold in much of Europe are still commonly made without one.

For all the changes in manufacturing, the pencil has proved remarkably resistant to replacement. Ballpoint pens, typewriters and computers have each been expected to make it obsolete, yet billions are still produced every year. Architects, carpenters and artists continue to prefer it, partly because a pencil line can be erased and partly because it works at any angle and in any temperature, which explains why pencils were carried on early space missions. A tool that began as a shepherd's marker has outlived almost every technology that threatened it.`,
  questions: [
    ...withOptions(1, "true_false_notgiven", TFNG, [
      ["The graphite at Borrowdale was first used by shepherds.", "TRUE", 'Shepherds "used it to mark their sheep" once they found it "left a dark mark that did not wash off in the rain."'],
      ["People in the sixteenth century correctly identified wad as a form of carbon.", "FALSE", 'They called it black lead "in the mistaken belief that it was a form of lead. It was in fact graphite."'],
      ["The Crown allowed the mine to be worked throughout the year.", "FALSE", 'The Crown "limited extraction to a few weeks each year in order to keep prices high."'],
      ["Most of the stolen graphite was eventually exported to France.", "NOT GIVEN", 'The passage says only that stolen graphite "was sold in the inns of the nearby town of Keswick"; its final destination is not mentioned.'],
      ["Cedar replaced juniper because it is easier to sharpen.", "TRUE", '"juniper has long since given way to cedar, which is softer and easier to sharpen."'],
    ]),
    ...gaps(6, "table_completion", 1, [
      ["Table — 1752: theft of wad punishable by hard labour or ______ to the colonies", ["transportation"], '"Parliament made the theft of wad a crime punishable by hard labour or transportation to the colonies."'],
      ["Table — 1795: substitute process patented by Conté, a French ______ and inventor", ["engineer"], 'The French government turned to "Nicolas-Jacques Conté, an engineer and inventor", whose solution was "patented in 1795".'],
      ["Table — 1858: eraser patented by Lipman, later ruled invalid by the Supreme ______", ["Court"], '"the patent was later declared invalid by the Supreme Court."'],
      ["Table — 1891: the ______ mine closed permanently", ["Borrowdale", "Cumbrian"], '"the Cumbrian mine was nearly exhausted, and it closed for good in 1891."'],
    ]),
    ...gaps(10, "flowchart_completion", 1, [
      ["Flow-chart step 1: impure graphite is ground into a fine ______", ["powder"], 'Conté would "grind impure graphite into a fine powder."'],
      ["Flow-chart step 2: the powder is mixed with ______ and water", ["clay"], 'The powder was mixed "with clay and water."'],
      ["Flow-chart step 3: the paste is pressed into moulds and fired in a ______", ["kiln"], 'The paste "was pressed into long, thin moulds and then fired in a kiln."'],
      ["Flow-chart step 4: the cooled rods are coated with ______ so they glide smoothly", ["wax"], '"the rods were waxed so that they would glide smoothly across the paper."'],
    ]),
  ],
};

const HEADINGS: QuestionOption[] = [
  { value: "i", label: "i. An old idea made practical" },
  { value: "ii", label: "ii. A problem left behind in the sea" },
  { value: "iii", label: "iii. The falling price of a once-costly process" },
  { value: "iv", label: "iv. Why rainfall is no longer reliable" },
  { value: "v", label: "v. Using what was once thrown away" },
  { value: "vi", label: "vi. A last resort or a first choice?" },
  { value: "vii", label: "vii. Two ways of separating salt from water" },
  { value: "viii", label: "viii. Opposition from farmers" },
];

const COUNTRIES: QuestionOption[] = [
  { value: "A", label: "A. Saudi Arabia" },
  { value: "B", label: "B. Israel" },
  { value: "C", label: "C. Australia" },
  { value: "D", label: "D. Spain" },
];

const passage2: ItemGroup = {
  id: "rg-2",
  partNumber: 2,
  title: "Passage 2 — Drinking the sea",
  stimulusKind: "passage",
  instructions:
    "You should spend about 20 minutes on Questions 14-26, which are based on Reading Passage 2 below.",
  passageText: `A. Sailors have known for thousands of years that seawater can be made drinkable. Aristotle described how the vapour from boiling seawater condenses into fresh water, and by the nineteenth century many ocean-going ships carried small stills for emergencies. What held the technology back was not understanding but energy: boiling enough water to supply a town requires burning vast quantities of fuel. Only in the second half of the twentieth century, when oil-rich but water-poor states began building large coastal plants, did desalination become a practical source of public water.

B. Two broad methods dominate the industry. The older, thermal desalination, is a refined version of the ship's still: seawater is heated, often in a series of chambers at progressively lower pressures, and the vapour is condensed and collected. The newer method, reverse osmosis, uses no heat at all. Instead, seawater is forced at high pressure through membranes whose pores are small enough to let water molecules pass while holding back the dissolved salt. Thermal plants remain common in the Gulf, where they are often built beside power stations and use their waste heat, but almost all plants built in recent decades use membranes. Membranes have their own difficulties: they are easily blocked by algae, sand and other particles, so the seawater must first be filtered carefully, and the membranes themselves must be cleaned regularly and eventually replaced.

C. The shift to reverse osmosis has transformed the economics of desalination. Early membrane plants consumed large amounts of electricity simply to maintain the pressure required. The decisive innovation was the energy recovery device, which captures the pressure of the concentrated brine leaving the membranes and transfers it to the incoming seawater. Together with better membranes, such devices have cut the energy needed to produce a cubic metre of fresh water by roughly three-quarters since the 1970s. In Israel, the Sorek plant, which opened in 2013, produces water at a price that would have seemed impossible a generation earlier, and the country now obtains most of its household water from the sea.

D. That cost is still higher than that of pumping water from a river or an aquifer, and for many governments desalination has traditionally been the option of last resort, built only when everything else has failed. Australia offers a cautionary example. During a severe drought in the early 2000s, several of its largest cities commissioned desalination plants at great expense. By the time the plants were completed, the rains had returned and reservoirs were full, and some plants were left idle for years while consumers continued to pay for them through their water bills. Critics argued that money would have been better spent on reducing leaks and encouraging households to use less. Supporters replied that a plant that is not needed this year may be indispensable in the next drought, and that its value lies precisely in being independent of the weather.

E. The most serious environmental objection concerns what is left behind. For every litre of fresh water a typical plant produces, it discharges roughly one and a half litres of brine, a concentrated salt solution that may also contain chemicals used to clean the membranes. Because brine is denser than seawater, it tends to sink and spread across the sea floor, where it can harm organisms that are unable to move away. Saudi Arabia, which operates some of the largest plants in the world, discharges much of its brine into the shallow and enclosed waters of the Gulf, where scientists have warned that salinity is rising. Well-designed outlets, which spread the brine through many small openings so that it mixes quickly, can reduce the damage considerably, but they add to the cost.

F. A growing number of researchers argue that brine should be treated not as waste but as a resource. It contains magnesium, lithium and other valuable minerals in higher concentrations than ordinary seawater, and pilot projects in several countries are attempting to extract them profitably. In Spain, where desalinated water is widely used to irrigate greenhouse crops in the dry south-east, engineers have experimented with blending brine back into the processing of salt for sale. None of these schemes is yet operating at scale, and it remains to be seen whether they can be made economic. But if they succeed, the most troublesome by-product of desalination could become one of its sources of income.

G. Whether desalination comes to be seen as a routine part of a water supply, rather than an emergency measure, will depend less on engineering than on politics. A plant takes years to plan and build, and its benefits are greatest in precisely the dry years that are hardest to predict. For a growing number of coastal cities facing a less predictable climate, the question is no longer whether they can afford to build one, but whether they can afford not to.`,
  questions: [
    ...withOptions(14, "matching_headings", HEADINGS, [
      ["Paragraph A — choose the most suitable heading.", "i", 'Paragraph A says the idea was known to Aristotle, but "Only in the second half of the twentieth century ... did desalination become a practical source of public water."'],
      ["Paragraph B — choose the most suitable heading.", "vii", 'Paragraph B begins "Two broad methods dominate the industry" and describes thermal desalination and reverse osmosis.'],
      ["Paragraph C — choose the most suitable heading.", "iii", 'Paragraph C explains how the energy needed has been cut "by roughly three-quarters since the 1970s", lowering the price.'],
      ["Paragraph D — choose the most suitable heading.", "vi", 'Paragraph D describes desalination as "the option of last resort" and the argument that "its value lies precisely in being independent of the weather."'],
      ["Paragraph E — choose the most suitable heading.", "ii", 'Paragraph E concerns "what is left behind": brine that "tends to sink and spread across the sea floor."'],
      ["Paragraph F — choose the most suitable heading.", "v", 'Paragraph F argues "brine should be treated not as waste but as a resource."'],
    ]),
    ...withOptions(20, "matching_features", COUNTRIES, [
      ["Which country obtains most of its household water from desalination?", "B", '"the country now obtains most of its household water from the sea" refers to Israel.'],
      ["Which country built plants that then stood unused for a long period?", "C", 'In Australia "some plants were left idle for years."'],
      ["Which country uses desalinated water for farming?", "D", '"In Spain ... desalinated water is widely used to irrigate greenhouse crops."'],
      ["In which country has brine disposal raised concerns about the sea becoming saltier?", "A", 'Saudi Arabia discharges brine into the Gulf, "where scientists have warned that salinity is rising."'],
    ]),
    ...gaps(24, "sentence_completion", 2, [
      ["Thermal plants in the Gulf often use the waste ______ from nearby power stations.", ["heat"], 'They are "often built beside power stations and use their waste heat."'],
      ["An energy recovery device transfers the pressure of the outgoing ______ to the incoming seawater.", ["brine", "concentrated brine"], 'It "captures the pressure of the concentrated brine leaving the membranes and transfers it to the incoming seawater."'],
      ["Brine sinks to the sea floor because it is ______ than seawater.", ["denser"], '"Because brine is denser than seawater, it tends to sink."'],
    ]),
  ],
};

const ENDINGS: QuestionOption[] = [
  { value: "A", label: "A. because it signals that an activity is not worth continuing." },
  { value: "B", label: "B. because they had nothing else to occupy them." },
  { value: "C", label: "C. unless the task is made more difficult." },
  { value: "D", label: "D. even when they had been warned in advance." },
  { value: "E", label: "E. which explains why it is rarely studied." },
];

const passage3: ItemGroup = {
  id: "rg-3",
  partNumber: 3,
  title: "Passage 3 — The uses of boredom",
  stimulusKind: "passage",
  instructions:
    "You should spend about 20 minutes on Questions 27-40, which are based on Reading Passage 3 below.",
  passageText: `Boredom has never enjoyed a good reputation. Moralists have treated it as a symptom of idleness, teachers as a failure of discipline, and parents as a problem to be solved, ideally by someone else. For most of the twentieth century psychologists showed little interest in it either, perhaps because it seemed too trivial and too familiar to need explaining. That neglect has ended. Over the past two decades boredom has become a serious subject of research, and the picture that has emerged is more interesting, and in some respects more troubling, than its reputation would suggest.

The first task was to define it. Researchers now generally describe boredom as the uncomfortable experience of wanting to engage in satisfying activity while being unable to do so. This definition separates boredom from simple relaxation, which is pleasant, and from apathy, in which the desire to act is absent altogether. The bored person wants something to do; what is missing is a task that can absorb their attention. Situations that produce boredom tend to share two features: they are monotonous, and they are beyond the person's control. Measuring it, however, has proved harder than defining it. Early studies relied on questionnaires asking people how easily they became bored, which revealed stable differences between individuals but said little about particular moments. More recent work asks participants to report their feelings at random points during the day, often through an app on their phone, and suggests that most adults feel bored for several hours each week, most often while waiting, travelling or doing housework.

Some of the most widely discussed findings concern how far people will go to escape it. In a series of studies published in 2014, participants were left alone in an empty room for between six and fifteen minutes with nothing to do but think. The only object in the room was a button that delivered a mild electric shock, and every participant had already experienced the shock and said they would pay money to avoid it. Nevertheless, two-thirds of the men and a quarter of the women pressed the button at least once during the session. One man pressed it 190 times. The researchers concluded that many people find their own thoughts so unrewarding that even an unpleasant stimulus is preferable to none at all.

Results like these have encouraged the view that boredom is simply harmful, and there is evidence to support it. People who report being bored frequently are more likely to eat when they are not hungry, to take risks while driving, and to suffer from depression. Among students, boredom in lessons is a strong predictor of poor results, more so than anxiety. It is tempting, therefore, to see boredom as a condition to be eliminated, and the modern smartphone, which can fill any spare moment with news, games or messages, appears to offer a cure.

A growing number of researchers argue that this conclusion is mistaken. On their account, boredom functions much as pain does: it is unpleasant precisely so that we will pay attention to it. Pain warns us that the body is being damaged; boredom warns us that our current activity is not worth continuing and pushes us to look for a better one. Seen in this way, boredom is not a malfunction but a signal, and the problem lies not in the feeling itself but in how we respond to it. Eating, gambling and reckless driving are poor responses; seeking a more meaningful task is a good one.

There is also some evidence that boredom can foster creativity. In one frequently cited experiment, participants who had first spent fifteen minutes copying numbers from a telephone directory went on to produce more ideas when asked to think of uses for a pair of plastic cups than participants who had moved straight to the creative task. The explanation offered was that a dull task allows the mind to wander, and that wandering thoughts are more likely to make unexpected connections. However, attempts to repeat the experiment have produced mixed results, and the size of the effect, if it exists, appears to be modest.

What does seem clear is that constantly relieving boredom may come at a cost. If every idle moment is filled by a screen, the signal that boredom provides is never heard, and the opportunity to decide what we actually want to do is lost. Some researchers suspect that heavy smartphone use may even lower people's tolerance for ordinary periods of low stimulation, so that they become bored more easily, although this has yet to be firmly established.

None of this means that boredom should be welcomed for its own sake, or that teachers should deliberately make lessons dull. Chronic boredom, the kind experienced by people trapped in monotonous jobs or confined to hospital beds, has real and lasting costs. The point is rather that the brief, everyday boredom of a delayed train or a quiet afternoon need not be treated as an emergency. It may be telling us something worth hearing.`,
  questions: [
    ...withOptions(27, "yes_no_notgiven", YNNG, [
      ["Psychologists in the twentieth century paid boredom little attention.", "YES", '"For most of the twentieth century psychologists showed little interest in it either."'],
      ["Relaxation and boredom are essentially the same experience.", "NO", 'The definition "separates boredom from simple relaxation, which is pleasant."'],
      ["Boredom is more common today than it was a century ago.", "NOT GIVEN", 'The passage never compares how common boredom is now with the past.'],
      ["For students, boredom predicts poor results more strongly than anxiety does.", "YES", '"boredom in lessons is a strong predictor of poor results, more so than anxiety."'],
      ["Teachers should make some lessons dull on purpose.", "NO", '"None of this means ... that teachers should deliberately make lessons dull."'],
    ]),
    mcq(32, "According to the passage, situations that cause boredom are typically", ["new and confusing", "repetitive and outside the person's control", "pleasant but undemanding", "stressful and tiring"], "B", 'Such situations "are monotonous, and they are beyond the person\'s control."'),
    mcq(33, "Before the 2014 experiment began, participants", ["were told they could leave at any time", "had been given a mild shock and said they would pay to avoid it", "were offered money for each button press", "had spent fifteen minutes copying numbers"], "B", '"every participant had already experienced the shock and said they would pay money to avoid it."'),
    mcq(34, "The writer compares boredom to pain in order to show that boredom", ["is a sign of physical illness", "can be ignored without consequence", "has a useful warning function", "is felt more strongly by some people"], "C", '"boredom warns us that our current activity is not worth continuing", just as "Pain warns us that the body is being damaged."'),
    mcq(35, "What does the writer say about the experiment with the plastic cups?", ["Its findings have not been consistently repeated.", "It proved that boredom improves creativity.", "It used too few participants.", "Its participants were already bored before it began."], "A", '"attempts to repeat the experiment have produced mixed results, and the size of the effect ... appears to be modest."'),
    ...gaps(36, "summary_completion", 1, [
      ["Summary: Frequent boredom has been linked to eating without hunger, risky driving and ______.", ["depression"], 'Bored people are more likely "to take risks while driving, and to suffer from depression."'],
      ["Summary: The ______ seems to offer a way to fill every spare moment.", ["smartphone"], '"the modern smartphone, which can fill any spare moment ... appears to offer a cure."'],
      ["Summary: A dull task may let the mind ______, making unexpected connections more likely.", ["wander"], '"a dull task allows the mind to wander."'],
    ]),
    {
      id: "r-q39",
      number: 39,
      type: "matching_sentence_endings",
      prompt: "Many participants in the empty room gave themselves electric shocks",
      options: ENDINGS,
      acceptedAnswers: ["B"],
      explanation: 'They had "nothing to do but think", and "even an unpleasant stimulus is preferable to none at all."',
    },
    {
      id: "r-q40",
      number: 40,
      type: "matching_sentence_endings",
      prompt: "Some researchers argue that boredom is useful",
      options: ENDINGS,
      acceptedAnswers: ["A"],
      explanation: '"boredom warns us that our current activity is not worth continuing and pushes us to look for a better one."',
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
