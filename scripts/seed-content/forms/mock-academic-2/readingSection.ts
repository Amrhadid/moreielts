import type { ItemGroup, Question, QuestionOption, QuestionTypeCode, Section } from "../../../../src/types/content";

/**
 * Mock Exam 2 — Academic Reading: 3 passages, 40 questions, 60 minutes.
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

function lettered(labels: string[]): QuestionOption[] {
  return labels.map((label, i) => ({
    value: String.fromCharCode(65 + i),
    label: `${String.fromCharCode(65 + i)}. ${label}`,
  }));
}

const PARAGRAPHS: QuestionOption[] = ["A", "B", "C", "D", "E", "F", "G"].map((l) => ({ value: l, label: `Paragraph ${l}` }));

const passage1: ItemGroup = {
  id: "rg-1",
  partNumber: 1,
  title: "Passage 1 — The Antikythera mechanism",
  stimulusKind: "passage",
  instructions:
    "You should spend about 20 minutes on Questions 1-13, which are based on Reading Passage 1 below.",
  passageText: `A. In the spring of 1900, a group of sponge divers sheltering from a storm off the small Greek island of Antikythera discovered the wreck of a Roman-era cargo ship at a depth of around forty-five metres. Over the following year, in one of the first major underwater archaeological operations, divers working without modern equipment brought up bronze and marble statues, glassware, pottery and coins. One of the divers died and two were paralysed by decompression sickness, a condition that was then poorly understood. Among the finds was a lump of corroded bronze and wood about the size of a shoebox, which attracted little attention at first. Several months later, as the wood dried and shrank, the lump split apart, and a museum curator noticed a gearwheel embedded inside it.

B. The object, now known as the Antikythera mechanism, has been called the world's oldest analogue computer. It survives in eighty-two fragments, the largest of which is about eighteen centimetres across, and it originally contained at least thirty interlocking bronze gearwheels, some with teeth only a millimetre and a half long. Nothing of comparable complexity is known from anywhere in the world for more than a thousand years afterwards. Its age is still debated. Coins found on the wreck suggest that the ship sank in the first half of the first century BC, but some scholars, on the basis of the inscriptions and astronomical calculations, believe the mechanism itself may have been made several decades earlier. Either way, it was probably already old, and perhaps much repaired, when it went down with the ship.

C. For half a century, the mechanism defeated attempts to understand it. The gears were fused together by corrosion, and most of the inscriptions were too worn to read. The first serious study was made by the British historian of science Derek de Solla Price, who in the 1950s and 1970s used X-rays to look inside the fragments and proposed that the device was a calendar computer, used to calculate the positions of the sun and moon. Price's reconstruction was a remarkable achievement, but it contained errors, and he was unable to see many of the smaller gears. Michael Wright, a curator at the Science Museum in London, later spent years building working models and corrected several of Price's assumptions, particularly about the gears at the front of the device.

D. The breakthrough came in 2005, when an international team known as the Antikythera Mechanism Research Project brought an eight-tonne X-ray scanner to the National Archaeological Museum in Athens. Using a technique called computed tomography, which builds up three-dimensional images from many X-ray slices, the team was able to count the teeth on individual gears and to read more than 3,000 characters of text, many of them hidden inside the fragments, that had not been seen for two thousand years. A second technique, which photographs the surface under light from many different angles, revealed faint inscriptions on the outer plates.

E. What emerged was a device of extraordinary sophistication. Turning a handle on the side moved a set of pointers on the front dial, which showed the positions of the sun and moon against the zodiac and the date in the Egyptian calendar of 365 days. A small rotating ball, half silver and half black, showed the phase of the moon. Most ingeniously, a pair of gears, one mounted slightly off-centre on the other and connected by a pin in a slot, made the moon's pointer speed up and slow down, reproducing the variation in the moon's speed across the sky that the astronomer Hipparchus had described. On the back, two spiral dials predicted eclipses and tracked the four-year cycle of athletic games, including the Olympics.

F. Several questions remain unanswered. The text on the front plate refers to the planets, and most researchers believe that the device also showed the positions of the five planets known in antiquity. However, almost none of the gears for this part survives, so any reconstruction of it is necessarily speculative. In 2021 a team at University College London published a model that reproduced the planetary display using gear trains consistent with the surviving inscriptions, but they acknowledged that it was only one of several possible solutions. Nor is it clear who made the mechanism, or for whom. The names of the months on the back dial are those used in Corinth and its colonies, which has led some to suggest a connection with Syracuse, the city of Archimedes, although he died more than a century before the ship sank.

G. Perhaps the most puzzling question is why nothing like it survives. It seems unlikely that such a refined device was the first of its kind; the precision of its gears suggests a tradition of instrument-making that had developed over generations. Ancient writers, including Cicero, mention bronze spheres that showed the movements of the heavens, but these descriptions were long dismissed as exaggerations. Cicero even credited one such sphere to Archimedes himself. The likeliest explanation is simply that bronze was valuable, and that any such instruments that remained on land were eventually melted down and reused. The Antikythera mechanism survived only because it was lost at sea.`,
  questions: [
    ...withOptions(1, "matching_information", PARAGRAPHS, [
      ["Which paragraph contains an explanation of why so few similar objects have been found?", "G", `"bronze was valuable, and that any such instruments that remained on land were eventually melted down and reused."`],
      ["Which paragraph contains a reference to the dangers faced by those who recovered the finds?", "A", `"One of the divers died and two were paralysed by decompression sickness".`],
      ["Which paragraph contains a description of how the device imitated the changing speed of the moon?", "E", `A pin-and-slot gear pair "made the moon's pointer speed up and slow down".`],
      ["Which paragraph contains a mention of a researcher correcting an earlier interpretation?", "C", `Michael Wright "corrected several of Price's assumptions".`],
      ["Which paragraph contains the amount of text revealed by modern imaging?", "D", `The team could "read more than 3,000 characters of text".`],
    ]),
    ...withOptions(6, "true_false_notgiven", TFNG, [
      ["The importance of the mechanism was recognised as soon as it was brought to the surface.", "FALSE", `The lump "attracted little attention at first."`],
      ["Coins recovered from the wreck help to date the sinking of the ship.", "TRUE", `"Coins found on the wreck suggest that the ship sank in the first half of the first century BC".`],
      ["Price's reconstruction of the mechanism was free of mistakes.", "FALSE", `"Price's reconstruction was a remarkable achievement, but it contained errors".`],
      ["The scanner used in 2005 had been built specially for the project.", "NOT GIVEN", `The passage says the team "brought an eight-tonne X-ray scanner" to Athens, but not whether it was built for the project.`],
    ]),
    ...gaps(10, "short_answer", 3, [
      ["What did the user turn to operate the mechanism?", ["a handle", "handle"], `"Turning a handle on the side moved a set of pointers on the front dial".`],
      ["What part of the device showed the phase of the moon?", ["a rotating ball", "ball", "rotating ball"], `"A small rotating ball, half silver and half black, showed the phase of the moon."`],
      ["Apart from athletic games, what did the spiral dials on the back predict?", ["eclipses"], `"two spiral dials predicted eclipses".`],
      ["Which material's value probably explains the loss of similar instruments?", ["bronze"], `"The likeliest explanation is simply that bronze was valuable".`],
    ]),
  ],
};

const ENDINGS: QuestionOption[] = lettered([
  "because its grains are too smooth to bind together.",
  "because the faster-flowing river erodes the banks.",
  "because it is heavy and has little value.",
  "that extraction should be measured and planned.",
  "to reduce the amount of concrete that buildings require.",
  "to a country that has expanded its territory into the sea.",
  "because dams release sediment too quickly.",
  "that desert sand should replace river sand.",
]);

const passage2: ItemGroup = {
  id: "rg-2",
  partNumber: 2,
  title: "Passage 2 — The sand beneath everything",
  stimulusKind: "passage",
  instructions:
    "You should spend about 20 minutes on Questions 14-26, which are based on Reading Passage 2 below.",
  passageText: `Of all the raw materials consumed by modern civilisation, none is used in greater quantities than sand. Water aside, it is the most widely extracted natural resource on the planet, and the volume taken each year, estimated by the United Nations Environment Programme at around fifty billion tonnes, would be enough to build a wall twenty-seven metres high and twenty-seven metres wide around the equator. Most of it disappears into concrete, of which sand and gravel make up roughly three-quarters by weight, but it is also used in glass, in the silicon chips of electronic devices, in land reclamation, and in the fluids used to extract oil and gas from rock. For a substance that seems so abundant, it may come as a surprise that sand is now being described as a resource under threat.

The paradox is easily explained. Not all sand is equally useful. The vast deserts of the Sahara and the Arabian peninsula contain enormous quantities, but desert sand is of little value to builders. Its grains have been rounded by thousands of years of wind erosion, so that they are smooth and almost spherical, and they do not lock together to form strong concrete. The angular grains that construction needs are found mainly in rivers, lakes, beaches and the sea floor, where water rather than wind has shaped them. It is these sources that are being exploited, and in many places they are being removed faster than natural processes can replace them. Rivers deliver new sediment only slowly, and dams, of which there are now tens of thousands on the world's major rivers, trap much of it before it can reach the sea.

The consequences of over-extraction are increasingly visible. When sand is dredged from a riverbed, the river deepens and flows faster, eroding its banks and undermining bridges; in Taiwan in 2000, the collapse of a bridge was blamed in part on sand mining. Lowering the riverbed can also lower the surrounding water table, so that wells run dry and farmland suffers. In the Mekong Delta in Vietnam, which produces around half of the country's rice, large-scale dredging upstream has contributed to the sinking and shrinking of the delta, allowing salt water from the sea to reach further inland and damage crops. On coastlines, the removal of beach sand leaves shores exposed to storms, and several small islands in Indonesia are reported to have disappeared altogether after their sand was taken to supply construction projects abroad.

Demand is driven above all by urbanisation. China alone used more cement in the three years from 2011 to 2013 than the United States did in the entire twentieth century, and the expansion of cities across Asia and Africa shows no sign of slowing. Singapore, which has increased its land area by around a quarter since independence through reclamation from the sea, has been one of the world's largest importers of sand, and several neighbouring countries have restricted or banned exports to it. Concrete is not the only driver. The artificial islands built off the coast of Dubai required hundreds of millions of tonnes of sand, much of it dredged from the floor of the Gulf, because the desert sand close at hand was unsuitable. Where demand is high and regulation weak, the trade has also attracted organised crime. In India, illegal sand mining is widespread, and journalists and officials who have tried to investigate it have been threatened and, in some cases, killed.

Part of the difficulty is that sand is so cheap. Because it is heavy and low in value, it is usually extracted as close as possible to where it will be used, and the costs of damage to rivers and coasts are rarely included in its price. Monitoring is also extremely limited. Few governments know how much sand is being extracted within their borders, and the international trade is poorly recorded. Without reliable figures, it is impossible to know where extraction is sustainable and where it is not, and difficult for governments to set limits that can be enforced. A 2019 report by the UN Environment Programme argued that sand should be recognised as a strategic resource, and that its extraction should be properly measured and planned.

There are alternatives, although none is a complete solution. Crushed rock can replace natural sand in concrete, and is already widely used in some countries, though it requires energy to produce. Concrete from demolished buildings can be ground down and reused, and researchers have experimented with adding ash from power stations and even crushed glass. Engineers have also tried to make desert sand usable, for example by mixing it with other materials, but so far with limited success. Each of these substitutes brings costs of its own, and none is yet available in the quantities that the construction industry consumes. In the longer term, perhaps the most effective approach is to use less: to design buildings that need less concrete, and to make them last longer.

Sand, in short, is a resource that has been taken for granted precisely because it seemed limitless. The challenge now is to treat it as what it is: a finite material, renewed only slowly, on which the modern world quite literally rests.`,
  questions: [
    ...gaps(14, "table_completion", 1, [
      ["Desert sand — grains rounded by ______ erosion", ["wind"], `"Its grains have been rounded by thousands of years of wind erosion".`],
      ["Construction sand — found in rivers, lakes, beaches and the sea ______", ["floor"], `"found mainly in rivers, lakes, beaches and the sea floor".`],
      ["Rivers — much new sediment trapped by ______", ["dams"], `"dams, of which there are now tens of thousands on the world's major rivers, trap much of it".`],
      ["Mekong Delta — ______ water now reaches further inland", ["salt"], `dredging is "allowing salt water from the sea to reach further inland and damage crops."`],
      ["Indonesia — several small ______ have reportedly vanished", ["islands"], `"several small islands in Indonesia are reported to have disappeared altogether".`],
    ]),
    {
      id: "r-q19",
      number: 19,
      type: "multiple_choice_multiple",
      prompt: "Which TWO effects of dredging sand from rivers are mentioned in the passage? Choose TWO letters.",
      options: lettered([
        "erosion of the riverbanks",
        "a fall in the water table",
        "a decline in fish populations",
        "more frequent flooding of towns",
        "a shallower river channel",
      ]),
      acceptedAnswers: ["A", "B"],
      explanation: `The river "deepens and flows faster, eroding its banks", and dredging "can also lower the surrounding water table".`,
    },
    {
      id: "r-q20",
      number: 20,
      type: "multiple_choice_multiple",
      prompt: "Which TWO statements about alternatives to natural sand are made in the passage? Choose TWO letters.",
      options: lettered([
        "Crushed rock is already in wide use in some countries.",
        "Recycled concrete cannot be reused a second time.",
        "Treated desert sand is now common in construction.",
        "Crushed glass has been tried as an ingredient.",
        "Crushed rock can be produced without energy.",
      ]),
      acceptedAnswers: ["A", "D"],
      explanation: `Crushed rock "is already widely used in some countries", and researchers have experimented with "even crushed glass."`,
    },
    ...withOptions(21, "matching_sentence_endings", ENDINGS, [
      ["Desert sand is of little use to builders", "A", `Its grains "are smooth and almost spherical, and they do not lock together to form strong concrete."`],
      ["Dredging a riverbed can undermine bridges", "B", `"the river deepens and flows faster, eroding its banks and undermining bridges".`],
      ["Several neighbouring countries have restricted sand exports", "F", `Singapore "has increased its land area by around a quarter" through "reclamation from the sea".`],
      ["Sand is normally extracted close to where it will be used", "C", `"Because it is heavy and low in value, it is usually extracted as close as possible to where it will be used".`],
      ["A 2019 UN report argued", "D", `"its extraction should be properly measured and planned."`],
      ["In the long term, the best approach may be", "E", `"to design buildings that need less concrete, and to make them last longer."`],
    ]),
  ],
};

const SUMMARY_BOX: QuestionOption[] = lettered([
  "correlated",
  "last",
  "gathered",
  "random",
  "identical",
  "first",
  "diverse",
  "confident",
  "expert",
]);

const passage3: ItemGroup = {
  id: "rg-3",
  partNumber: 3,
  title: "Passage 3 — The wisdom and folly of crowds",
  stimulusKind: "passage",
  instructions:
    "You should spend about 20 minutes on Questions 27-40, which are based on Reading Passage 3 below.",
  passageText: `In 1906 the statistician Francis Galton visited a livestock fair in Plymouth, in the south-west of England, where visitors were paying a small fee to guess the weight of an ox once it had been slaughtered and dressed. Galton, who had a low opinion of the intelligence of ordinary people, collected the 787 legible tickets afterwards, expecting to demonstrate how poor the guesses were. Instead he found that the middle value of all the estimates was 1,207 pounds, within one per cent of the true weight of 1,198 pounds. Galton published the result in the journal Nature, and conceded that it reflected better on the trustworthiness of democratic judgment than he might have expected.

The phenomenon Galton stumbled upon has since become known as the wisdom of crowds, after a popular book of that name by the journalist James Surowiecki, published in 2004. Its logic is essentially statistical. Each individual estimate contains some truth and some error. If the errors are random, some guesses will be too high and others too low, and when they are combined, the errors tend to cancel out, leaving the truth behind. The more estimates there are, the more reliable the average becomes. The principle has been demonstrated many times: crowds of students guessing the number of sweets in a jar, or the temperature of a room, routinely outperform all but a handful of their members. Galton's ox was a case in point: although few of the visitors were experts, their individual errors, high and low, largely balanced one another.

Crucially, however, the effect depends on certain conditions, and Surowiecki identified several of them. The members of the crowd must have some relevant knowledge, however slight; a crowd asked about something of which it knows nothing will produce an average that is no better than a random number. Their opinions must also be diverse, drawing on different information and perspectives. Most important of all, they must be independent. If people are influenced by one another, their errors are no longer random but correlated, and instead of cancelling out, they accumulate.

The fragility of independence was demonstrated in an experiment conducted in Zurich in 2011. Participants were asked factual questions, such as the population density of Switzerland or the number of murders in the country in a given year, and were rewarded for accurate answers. Some participants answered in isolation; others were shown, after each round, the estimates given by the rest of their group. Social information, it turned out, made the crowd worse. The range of answers narrowed, as people adjusted their estimates towards those of others, but the average did not move closer to the truth. More troubling still, the participants who had seen others' answers became more confident in their estimates, even though these were no more accurate. The researchers described a combination of reduced diversity and increased confidence that left groups more certain and less correct.

This finding has uncomfortable implications for organisations. Committees and boards are often assumed to make better decisions than individuals, because they pool the knowledge of several people. Yet in a typical meeting, members do not form their views independently. The most senior or most confident person often speaks first, and others, consciously or not, adjust their views accordingly. The psychologist Daniel Kahneman, among others, has recommended a simple remedy: before any discussion, each member should write down his or her own judgment. The discussion that follows can then draw on genuinely independent opinions, rather than a chorus of echoes.

Markets have sometimes been presented as the purest expression of crowd wisdom, since prices aggregate the beliefs of large numbers of buyers and sellers. Prediction markets, in which participants buy and sell contracts that pay out if a particular event occurs, have produced forecasts of elections and sales figures that compare well with those of experts. But financial history also contains many examples of crowds going badly wrong. In speculative bubbles, from the tulip mania of seventeenth-century Holland to the internet boom of the late 1990s, rising prices attract buyers precisely because others are buying, and the independence on which collective judgment depends breaks down entirely.

The internet has created new opportunities for harnessing crowds, and new risks. Online reviews and ratings are, in principle, a means of aggregating the experiences of thousands of customers. In practice, a study of a news website in 2013 found that giving a comment a single artificial positive vote at random made it significantly more likely to receive further positive votes from later readers, and the effect was still visible months later. Early opinions, in other words, can shape later ones, and an apparently independent crowd may in fact be following a small number of initial voices. Some platforms have responded by hiding existing scores until a user has submitted a rating of their own.

None of this means that crowds cannot be trusted. It means that their wisdom is not a natural property of groups but a product of the way in which their judgments are gathered. A crowd of independent, moderately informed people can be remarkably accurate. A crowd whose members are watching one another is merely a larger version of the individual, and sometimes a less reliable one.`,
  questions: [
    ...withOptions(27, "yes_no_notgiven", YNNG, [
      ["Galton expected the visitors' guesses to be inaccurate.", "YES", `He collected the tickets "expecting to demonstrate how poor the guesses were."`],
      ["A crowd with no knowledge of a subject can still produce an accurate average.", "NO", `Such a crowd "will produce an average that is no better than a random number."`],
      ["In the Zurich experiment, seeing others' estimates improved the accuracy of the group average.", "NO", `"Social information, it turned out, made the crowd worse."`],
      ["Independence matters more than diversity for the accuracy of a crowd.", "YES", `Opinions must be diverse, but "Most important of all, they must be independent."`],
      ["The tulip mania was caused by a genuine shortage of tulips.", "NOT GIVEN", `The tulip mania is named only as one of several "speculative bubbles"; its cause is not discussed.`],
    ]),
    mcq(32, "What happened to the Zurich participants who saw the other group members' estimates?", ["Their answers moved closer to the true values.", "They became more confident without becoming more accurate.", "They gave a wider range of answers.", "They refused to change their original estimates."], "B", `They "became more confident in their estimates, even though these were no more accurate."`),
    mcq(33, "Kahneman's remedy for poor decisions in meetings is to", ["let the most senior member speak last", "hold smaller meetings with fewer members", "ask everyone to record a view before discussion", "replace discussion with an anonymous vote"], "C", `"before any discussion, each member should write down his or her own judgment."`),
    mcq(34, "The writer mentions the internet boom of the late 1990s as an example of", ["an accurate forecast made by a prediction market", "independent judgment breaking down in a market", "experts outperforming the crowd", "a market with too few buyers"], "B", `In bubbles, "rising prices attract buyers precisely because others are buying, and the independence on which collective judgment depends breaks down entirely."`),
    mcq(35, "The 2013 study of a news website showed that", ["an early positive vote influenced later readers", "most readers ignored votes on comments", "artificial votes were quickly detected", "the effect of a single vote disappeared within days"], "A", `A single artificial vote "made it significantly more likely to receive further positive votes from later readers".`),
    ...withOptions(36, "summary_completion", SUMMARY_BOX, [
      ["Summary: A crowd's average can be accurate because, if individual errors are ______, they tend to cancel out.", "D", `"If the errors are random", some guesses are too high and others too low, and "the errors tend to cancel out".`],
      ["Summary: When people influence one another, their errors become ______ and accumulate.", "A", `"their errors are no longer random but correlated, and instead of cancelling out, they accumulate."`],
      ["Summary: The opinions in a crowd also need to be ______, drawing on different perspectives.", "G", `"Their opinions must also be diverse, drawing on different information and perspectives."`],
      ["Summary: In meetings, the most senior person often speaks ______, and others adjust their views.", "F", `"The most senior or most confident person often speaks first".`],
      ["Summary: The writer concludes that crowd wisdom depends on how judgments are ______.", "C", `It is "a product of the way in which their judgments are gathered."`],
    ]),
  ],
};

export const readingSection: Section = {
  code: "reading",
  title: "Reading",
  durationMinutes: 60,
  questionCount: 40,
  itemGroups: [passage1, passage2, passage3],
};
