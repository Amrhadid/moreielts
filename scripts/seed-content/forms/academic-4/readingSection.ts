import type { ItemGroup, Question, Section } from "../../../../src/types/content";

/**
 * Academic Reading: 3 passages, 40 questions, 60 minutes. Challenge level:
 * dense academic prose, indirect paraphrase and close distractors.
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

const SCHOLARS = [
  { value: "A", label: "A. Arthur Evans" },
  { value: "B", label: "B. Alice Kober" },
  { value: "C", label: "C. Michael Ventris" },
  { value: "D", label: "D. Carl Blegen" },
];

const passage1: ItemGroup = {
  id: "rg-1",
  partNumber: 1,
  title: "Passage 1 — Reading Linear B",
  stimulusKind: "passage",
  instructions:
    "You should spend about 20 minutes on Questions 1-13, which are based on Reading Passage 1 below.",
  passageText: `When Arthur Evans began excavating at Knossos on Crete in 1900, he expected to find evidence of a literate Bronze Age civilisation, and within weeks he had it: clay tablets incised with an unfamiliar script. Over the following decades some three thousand tablets emerged from the site, most of them bearing the script Evans named Linear B, to distinguish it from an older and still undeciphered system he called Linear A. Their decipherment, achieved half a century later, is often narrated as the triumph of a single gifted amateur. The truth is more interesting, and more instructive about how such problems are actually solved.

Evans himself was, paradoxically, the principal obstacle. Convinced that the palace culture he had uncovered, which he christened Minoan, was entirely distinct from that of mainland Greece, he dismissed any suggestion that the tablets might record an early form of Greek. His authority in the field was immense, and his reluctance to publish more than a fraction of the inscriptions meant that for forty years scholars worked from a sample too small to support serious analysis. Only after his death in 1941 did a fuller corpus become available.

By then the problem had been transformed by events on the mainland. In 1939 Carl Blegen, an American archaeologist, uncovered an archive of some six hundred tablets at Pylos in the western Peloponnese, written in the same script. Blegen did not attempt a decipherment himself, but the discovery was fatal to the assumption that Linear B was exclusively Cretan. If the script had been used in a Greek-speaking region, the possibility that it recorded Greek could no longer be dismissed out of hand.

The most important analytical work was done by Alice Kober, a classicist at Brooklyn College, who in the 1940s approached the script without committing herself to any hypothesis about its language. Working through the inscriptions by hand and recording each sign on index cards, she noticed that certain words appeared in three related forms, sharing a common stem but ending differently. These sets, later called "Kober's triplets", indicated that the language was inflected: like Latin or Greek, it changed the endings of words to mark grammatical case. More subtly, she observed that the final sign of the stem sometimes changed as well, which implied that some signs represented a consonant and a vowel together, and that signs sharing a consonant could be grouped. Kober refused to speculate about what the language was; she insisted that the structure had to be established first. She died in 1950, two years before the breakthrough her method made possible.

It was Michael Ventris, a British architect who had been fascinated by the script since hearing Evans lecture when he was fourteen, who turned Kober's insight into a working system. Ventris constructed a grid in which signs that appeared to share a consonant were placed in the same row and those that appeared to share a vowel in the same column. Crucially, the grid could be filled in without knowing the actual sound of any sign: it recorded relationships, not values. Ventris circulated his progress in a series of "work notes" to other scholars, and for most of this period he believed, as Evans had, that the language was probably related to Etruscan.

The decisive step came in 1952, when Ventris experimented with assigning sound values to a few signs on the basis of place names. Certain words occurred frequently in the Knossos tablets but not at Pylos, which suggested they were local names. If one of them was read as ko-no-so, Knossos, and another as a-mi-ni-so, the nearby harbour of Amnisos, the values thus fixed could be carried across the grid to other signs. Ventris found, to his own surprise, that words began to emerge that were recognisably Greek, albeit an archaic Greek some five centuries older than Homer. He announced the result in a radio broadcast in July 1952, describing it with characteristic caution as a working hypothesis.

Ventris then sought the collaboration of John Chadwick, a Cambridge philologist with expertise in early Greek dialects, and together they published the full case in 1953. Confirmation arrived almost immediately. A tablet newly excavated by Blegen at Pylos showed pictures of tripod cauldrons alongside a word that, read by the Ventris grid, spelled ti-ri-po, tripod. Sceptics persisted for some years, but the weight of such independent checks eventually silenced them. Ventris did not live to see the consensus fully established; he was killed in a road accident in 1956, at the age of thirty-four.

What the tablets contain has disappointed those who hoped for poetry or history. They are almost entirely administrative: inventories of livestock, rations for workers, lists of bronze and textiles, records of offerings to deities. Yet that is precisely their value. They reveal a highly centralised economy in which palace scribes tracked goods with remarkable precision, and they push the written history of the Greek language back by several centuries. The decipherment also stands as a model of method. It was achieved not by inspired guesswork but by the patient establishment of internal structure, followed by a hypothesis that could be tested against evidence its author had not yet seen.`,
  questions: [
    ...([
      ["Evans named the Linear B script in order to separate it from another writing system.", "TRUE", 'Evans named it Linear B "to distinguish it from an older and still undeciphered system he called Linear A."'],
      ["Evans published most of the Knossos inscriptions during his lifetime.", "FALSE", 'Evans showed "reluctance to publish more than a fraction of the inscriptions"; a fuller corpus appeared only "after his death".'],
      ["Blegen proposed that the Pylos tablets were written in Greek.", "FALSE", 'The passage says "Blegen did not attempt a decipherment himself".'],
      ["Kober's index cards were later donated to a university archive.", "NOT GIVEN", 'The passage says she recorded "each sign on index cards" but says nothing about what happened to them.'],
      ["Ventris believed for some time that the language was linked to Etruscan.", "TRUE", 'For most of this period "he believed, as Evans had, that the language was probably related to Etruscan."'],
      ["The language of the tablets is older than that of Homer.", "TRUE", 'The words were "an archaic Greek some five centuries older than Homer."'],
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
      ["Kober's triplets showed that the language was ______, changing its word endings.", ["inflected"], 'The triplets "indicated that the language was inflected".'],
      ["Ventris's grid recorded relationships between signs rather than their ______.", ["values"], 'The grid "recorded relationships, not values."'],
      ["Ventris first assigned sounds to signs using ______.", ["place names"], 'He assigned "sound values to a few signs on the basis of place names."'],
    ] as const).map(
      ([prompt, answers, explanation], i): Question => ({
        id: `r-q${i + 7}`,
        number: i + 7,
        type: "sentence_completion",
        prompt: `${prompt} (NO MORE THAN TWO WORDS)`,
        acceptedAnswers: [...answers],
        wordLimit: 2,
        explanation,
      }),
    ),
    ...([
      ["found tablets that showed the script was not used only on Crete", "D", 'Blegen\'s Pylos archive "was fatal to the assumption that Linear B was exclusively Cretan."'],
      ["refused to guess the language before analysing its structure", "B", 'Kober "refused to speculate about what the language was; she insisted that the structure had to be established first."'],
      ["excavated a tablet that confirmed the decipherment", "D", 'Confirmation came from "A tablet newly excavated by Blegen at Pylos" spelling "ti-ri-po, tripod."'],
      ["shared unfinished findings with other researchers", "C", 'Ventris "circulated his progress in a series of" work notes "to other scholars".'],
    ] as const).map(
      ([prompt, answer, explanation], i): Question => ({
        id: `r-q${i + 10}`,
        number: i + 10,
        type: "matching_features",
        prompt: `Which person ${prompt}? (You may use any letter more than once.)`,
        options: SCHOLARS,
        acceptedAnswers: [answer],
        explanation,
      }),
    ),
  ],
};

const HEADINGS = [
  { value: "i", label: "i. A hidden partnership beneath the crop" },
  { value: "ii", label: "ii. Why conventional measurement missed most of the picture" },
  { value: "iii", label: "iii. The unintended cost of feeding plants directly" },
  { value: "iv", label: "iv. Commercial products that have yet to deliver" },
  { value: "v", label: "v. A substance that holds the soil together" },
  { value: "vi", label: "vi. The superior yields of organic farming" },
  { value: "vii", label: "vii. Practices that rebuild underground life" },
  { value: "viii", label: "viii. Signals that warn of attack" },
];

const passage2: ItemGroup = {
  id: "rg-2",
  partNumber: 2,
  title: "Passage 2 — The economy beneath our feet",
  stimulusKind: "passage",
  instructions:
    "You should spend about 20 minutes on Questions 14-26, which are based on Reading Passage 2 below.",
  passageText: `A. For most of the history of soil science, the living component of soil was studied by growing it. Microbiologists took a sample, spread it on a nutrient medium and counted the colonies that appeared. The method was reproducible and cheap, but it had a fundamental flaw that became apparent only when DNA sequencing allowed organisms to be identified without being cultured at all. It turned out that the overwhelming majority of soil microbes, by some estimates more than ninety-nine per cent, will not grow on any standard laboratory medium. A gram of fertile soil may contain billions of bacterial cells belonging to tens of thousands of species, and the culturing tradition had been describing a vanishingly small and unrepresentative fraction of them.

B. Among the most consequential of these organisms are the mycorrhizal fungi, which colonise the roots of around eighty per cent of land plants. The fungi extend fine threads, or hyphae, far beyond the reach of the roots themselves, effectively enlarging the plant's absorptive surface many times over. Through this network they deliver phosphorus and other nutrients that the plant would struggle to obtain on its own, and in exchange they receive sugars, which plants may surrender in substantial quantities, sometimes a fifth or more of the carbon they fix by photosynthesis. The relationship is ancient; fossil evidence suggests that it may have been instrumental in allowing plants to colonise land in the first place.

C. The hyphae perform a second function that is less widely appreciated. Many mycorrhizal fungi secrete a sticky glycoprotein known as glomalin, which binds mineral particles and organic matter into crumbs, or aggregates. Aggregated soil has a network of pores that allows water to infiltrate rather than run off and air to reach the roots, and it is markedly more resistant to erosion. Glomalin is also remarkably persistent, remaining in the soil for years or even decades, and it may account for a significant share of the carbon stored in some soils, a fact that has drawn the attention of researchers concerned with climate mitigation.

D. Modern intensive agriculture has, in many cases, inadvertently undermined these relationships. When phosphorus is supplied abundantly as soluble fertiliser, plants have little incentive to sustain a costly partnership with fungi, and colonisation of their roots declines. Repeated ploughing physically severs the hyphal network, and long periods of bare soil between crops deprive the fungi of the living roots on which they depend. The result is a soil that may produce high yields as long as inputs are maintained but has lost much of its capacity to supply nutrients and retain water unaided, a dependency that becomes expensive when fertiliser prices rise. Compaction by heavy machinery compounds the problem, squeezing out the pore spaces in which fungi and bacteria live.

E. Agronomists have accordingly begun to promote practices designed to rebuild soil biology. Reduced tillage or direct drilling, in which seed is inserted into undisturbed ground, leaves fungal networks largely intact. Cover crops, sown after the main harvest, keep living roots in the ground through the winter, and diverse rotations support a broader range of microbial partners than a single crop grown year after year. The evidence that such measures increase microbial activity is strong. The evidence that they raise yields is more mixed: benefits often take several years to appear and depend heavily on soil type and climate, which partly explains why adoption has been uneven.

F. Industry has responded with a growing market in microbial inoculants, products containing selected bacteria or fungal spores that are applied to seed or soil. Some have performed well in controlled trials, particularly in degraded soils with depleted native populations. In healthy field soils, however, results have frequently been disappointing. Introduced strains must compete with an established and highly adapted community, and many simply fail to persist. A recent review of several hundred field trials concluded that the average yield benefit was modest and highly variable, and warned that products were often marketed with claims that the evidence did not support.

G. Perhaps the most intriguing recent research concerns the role of fungal networks in communication between plants. In experiments with tomato plants connected by a shared mycorrhizal network, plants that had not themselves been attacked by a fungal pathogen began to activate defensive genes after a connected neighbour was infected. Similar effects have been reported in response to insect pests. The mechanism remains uncertain, and some researchers caution that popular accounts of a "wood wide web" have run well ahead of the data. Other researchers point out that plants connected in this way also compete for the same nutrients, so the network may carry rivalry as well as cooperation, and that the direction of benefit can change with the season and with the age of the plants involved. Nonetheless, the finding hints that the soil beneath a field may be not merely a store of nutrients but an active system of exchange whose workings agriculture is only beginning to understand.`,
  questions: [
    ...([
      ["Paragraph A", "ii", 'Paragraph A explains that "the overwhelming majority of soil microbes" will not grow in the laboratory, so culturing described "a vanishingly small and unrepresentative fraction".'],
      ["Paragraph B", "i", 'Paragraph B describes how fungi deliver nutrients to roots and "in exchange they receive sugars".'],
      ["Paragraph C", "v", 'Paragraph C describes glomalin, "which binds mineral particles and organic matter into crumbs".'],
      ["Paragraph D", "iii", 'Paragraph D says that when phosphorus "is supplied abundantly as soluble fertiliser", colonisation of roots "declines".'],
      ["Paragraph E", "vii", 'Paragraph E describes "practices designed to rebuild soil biology".'],
      ["Paragraph F", "iv", 'Paragraph F says that in field soils "results have frequently been disappointing" for inoculants.'],
      ["Paragraph G", "viii", 'Paragraph G describes unattacked plants that "began to activate defensive genes after a connected neighbour was infected."'],
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
      ["What proportion of land plants have roots colonised by mycorrhizal fungi?", ["80 per cent", "eighty per cent", "80%"], 'The fungi "colonise the roots of around eighty per cent of land plants."'],
      ["Which nutrient is named as one the fungi deliver to plants?", ["phosphorus"], 'The fungi "deliver phosphorus and other nutrients that the plant would struggle to obtain on its own".'],
      ["In which plant were signals through a shared fungal network observed?", ["tomato", "tomatoes", "tomato plants"], 'The paragraph refers to "experiments with tomato plants connected by a shared mycorrhizal network".'],
    ] as const).map(
      ([prompt, answers, explanation], i): Question => ({
        id: `r-q${i + 21}`,
        number: i + 21,
        type: "short_answer",
        prompt: `${prompt} Write NO MORE THAN THREE WORDS AND/OR A NUMBER.`,
        acceptedAnswers: [...answers],
        wordLimit: 3,
        explanation,
      }),
    ),
    ...([
      ["Repeated ploughing cuts through the fungal ______.", ["network", "hyphal network"], 'The passage says "Repeated ploughing physically severs the hyphal network".'],
      ["Under direct drilling, seed is placed into ______ ground.", ["undisturbed"], 'In direct drilling "seed is inserted into undisturbed ground".'],
      ["Cover crops keep living ______ in the soil over winter.", ["roots"], 'Cover crops "keep living roots in the ground through the winter".'],
    ] as const).map(
      ([prompt, answers, explanation], i): Question => ({
        id: `r-q${i + 24}`,
        number: i + 24,
        type: "summary_completion",
        prompt: `${prompt} (NO MORE THAN TWO WORDS)`,
        acceptedAnswers: [...answers],
        wordLimit: 2,
        explanation,
      }),
    ),
  ],
};

const ENDINGS = [
  { value: "A", label: "A. because its usefulness depends on what it leaves out." },
  { value: "B", label: "B. since every simplification is eventually replaced by a truer one." },
  { value: "C", label: "C. provided that its predictions are confirmed by experiment." },
  { value: "D", label: "D. even though no one believes it describes the system literally." },
  { value: "E", label: "E. unless its assumptions are stated explicitly." },
];

const passage3: ItemGroup = {
  id: "rg-3",
  partNumber: 3,
  title: "Passage 3 — The uses of falsehood in science",
  stimulusKind: "passage",
  instructions:
    "You should spend about 20 minutes on Questions 27-40, which are based on Reading Passage 3 below.",
  passageText: `It is a commonplace of popular writing about science that its theories aim at truth, and that progress consists in replacing false accounts of the world with accurate ones. There is something right about this picture, but it sits uneasily with the actual practice of the sciences, in which a great deal of the most productive work is done with models that everyone involved knows to be false. The ideal gas, the frictionless plane, the perfectly rational economic agent, the infinitely large population of population genetics: none of these exists, and no competent scientist supposes that they do. The question of why such fictions are so useful, and what their usefulness implies about scientific knowledge, deserves more attention than it usually receives.

One tempting answer treats idealisation as a temporary expedient. On this view, scientists simplify because the full truth is too complicated to handle, and each idealised model is a stage on the way to a more complete description that will eventually replace it. The history of physics offers some support: the simple pendulum of the introductory textbook can indeed be corrected, step by step, for air resistance, the mass of the string and the finite amplitude of the swing. But I think this answer misdescribes the situation in most fields. In population genetics, the assumption of an infinite population is not a stopgap awaiting correction; it is precisely what makes the effects of selection visible by removing the noise of chance. Restoring the missing detail would not improve the model so much as obscure the very thing it was built to reveal.

A better account, I suggest, holds that a model is valuable for what it omits. To explain why some phenomenon occurs is in large part to identify which of the countless features of a situation make a difference to it, and which do not. A model that included everything would be as uninformative as a map drawn at a scale of one to one. The idealised model, by contrast, makes a claim of relevance: it says, in effect, that these factors matter and the rest may be disregarded for the purpose at hand. When such a model successfully reproduces the behaviour of the real system, it vindicates that judgement of relevance, and this is a genuine piece of knowledge, even though the model's literal description of the system is false.

This view has a consequence that some find uncomfortable. If models are tools tailored to particular questions, then there is no reason to expect a single model of a complex system to serve all purposes, and some sciences routinely use several models of the same phenomenon that are mutually inconsistent. Hydrologists may treat water in one context as a continuous fluid and in another as a collection of discrete molecules; ecologists may model the same population with and without spatial structure, depending on what they wish to understand. Critics have argued that this pluralism is a symptom of immaturity, and that a fully developed science would unify its models into one consistent theory. I see no good reason to believe this. The expectation of eventual unification is an article of faith rather than a conclusion drawn from the history of science, which shows as many cases of proliferating models as of convergence.

None of this means that anything goes. A model's idealisations must be chosen so that the factors it neglects really are negligible for the question asked, and this is an empirical matter that can be investigated and, in principle, found wanting. The economist's rational agent offers a cautionary example. For explaining the behaviour of large markets under stable conditions it has often served well; for explaining financial panics, in which the systematic departures of real people from rationality are precisely what drive events, it has proved seriously misleading. The fault in such cases lies not in idealisation itself but in its application beyond the domain where its omissions are harmless.

There is a further and more practical lesson here, which concerns how science is communicated. When the public is told that a model "predicts" a certain outcome, it is rarely told which features of the world the model has set aside, and so it has no means of judging whether those omissions matter for the question at hand. The disputes over epidemiological modelling during recent pandemics showed how damaging this can be: models designed to compare policy options under explicit simplifying assumptions were reported, and sometimes attacked, as if they were forecasts of what would actually happen. Greater candour about idealisation would not weaken public trust in science; if anything, it would protect that trust against the disappointment that follows when a misunderstood prediction fails to come true.

The philosopher Nancy Cartwright once remarked that the laws of physics lie, in the sense that the simple regularities they describe are rarely, if ever, observed in nature. Her point was not that physics is unreliable but that its reliability has a different source from the one usually supposed. The same might be said of scientific models generally. Their success does not show that the world is as simple as they portray it. It shows that their makers have correctly judged which complications can, for a given purpose, be safely ignored.`,
  questions: [
    ...([
      ["Most scientists who use idealised models believe they describe real systems.", "NO", 'The writer says of these fictions that "no competent scientist supposes that they do" exist.'],
      ["Correcting the simple pendulum model step by step is possible.", "YES", 'The simple pendulum "can indeed be corrected, step by step, for air resistance".'],
      ["The assumption of an infinite population is a stopgap that will eventually be corrected.", "NO", 'The writer says the assumption "is not a stopgap awaiting correction".'],
      ["A fully developed science would inevitably unify its models into one theory.", "NO", 'The writer says "I see no good reason to believe this" and calls unification "an article of faith".'],
      ["Ecology uses more mutually inconsistent models than any other science.", "NOT GIVEN", 'The writer says "some sciences routinely use several models" and gives ecology as an example, but makes no comparison of numbers.'],
      ["Being open about idealisation would reduce public confidence in science.", "NO", 'The writer says "Greater candour about idealisation would not weaken public trust in science".'],
    ] as const).map(
      ([prompt, answer, explanation], i): Question => ({
        id: `r-q${i + 27}`,
        number: i + 27,
        type: "yes_no_notgiven",
        prompt: `Do the following statements agree with the claims of the writer? ${prompt}`,
        options: YNNG,
        acceptedAnswers: [answer],
        explanation,
      }),
    ),
    {
      id: "r-q33",
      number: 33,
      type: "multiple_choice_single",
      prompt: "Why does the writer mention a map drawn at a scale of one to one?",
      options: [
        { value: "A", label: "A. to show that complete accuracy is technically impossible" },
        { value: "B", label: "B. to illustrate that including every detail would explain nothing" },
        { value: "C", label: "C. to argue that models should be judged by their visual clarity" },
        { value: "D", label: "D. to contrast physical maps with mathematical models" },
      ],
      acceptedAnswers: ["B"],
      explanation: 'The writer says "A model that included everything would be as uninformative as a map drawn at a scale of one to one."',
    },
    {
      id: "r-q34",
      number: 34,
      type: "multiple_choice_single",
      prompt: "According to the writer, when an idealised model reproduces the behaviour of a real system, it",
      options: [
        { value: "A", label: "A. proves that its literal description is approximately true." },
        { value: "B", label: "B. shows that further detail would make it more accurate." },
        { value: "C", label: "C. confirms a judgement about which factors are relevant." },
        { value: "D", label: "D. can be applied with confidence to other systems." },
      ],
      acceptedAnswers: ["C"],
      explanation: 'Such success "vindicates that judgement of relevance, and this is a genuine piece of knowledge".',
    },
    {
      id: "r-q35",
      number: 35,
      type: "multiple_choice_single",
      prompt: "What does the writer conclude from the example of the rational economic agent?",
      options: [
        { value: "A", label: "A. Idealised models should be abandoned in economics." },
        { value: "B", label: "B. The model fails when used where its omissions matter." },
        { value: "C", label: "C. Financial panics cannot be modelled at all." },
        { value: "D", label: "D. Large markets behave more rationally than individuals." },
      ],
      acceptedAnswers: ["B"],
      explanation: 'The fault lies "not in idealisation itself but in its application beyond the domain where its omissions are harmless."',
    },
    {
      id: "r-q36",
      number: 36,
      type: "multiple_choice_single",
      prompt: "What problem with pandemic modelling does the writer identify?",
      options: [
        { value: "A", label: "A. The models relied on unreliable data." },
        { value: "B", label: "B. The models were designed by non-specialists." },
        { value: "C", label: "C. Comparisons of policies were treated as forecasts." },
        { value: "D", label: "D. Policymakers ignored the models' conclusions." },
      ],
      acceptedAnswers: ["C"],
      explanation: 'Models built "to compare policy options" were reported "as if they were forecasts of what would actually happen."',
    },
    ...([
      ["The simple regularities described by the laws of physics are rarely observed in nature", "D", 'Cartwright said the laws of physics "lie", yet "Her point was not that physics is unreliable".'],
      ["In population genetics the infinite-population model reveals the effects of selection", "A", 'The assumption "makes the effects of selection visible by removing the noise of chance", and restoring detail "would not improve the model".'],
    ] as const).map(
      ([prompt, answer, explanation], i): Question => ({
        id: `r-q${i + 37}`,
        number: i + 37,
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
      type: "multiple_choice_multiple",
      prompt: "Which TWO of the following does the writer present as examples of a science using inconsistent models of one phenomenon? Choose TWO letters.",
      options: [
        { value: "A", label: "A. physicists modelling a pendulum" },
        { value: "B", label: "B. hydrologists modelling water" },
        { value: "C", label: "C. economists modelling markets" },
        { value: "D", label: "D. ecologists modelling a population" },
        { value: "E", label: "E. epidemiologists modelling a pandemic" },
      ],
      acceptedAnswers: ["B", "D"],
      explanation: '"Hydrologists may treat water in one context as a continuous fluid and in another as a collection of discrete molecules; ecologists may model the same population with and without spatial structure".',
    },
    {
      id: "r-q40",
      number: 40,
      type: "multiple_choice_single",
      prompt: "What is the writer's main purpose in the passage?",
      options: [
        { value: "A", label: "A. to argue that scientific theories cannot be true" },
        { value: "B", label: "B. to explain how false models can yield genuine knowledge" },
        { value: "C", label: "C. to trace the history of idealisation in physics" },
        { value: "D", label: "D. to criticise the way economists use models" },
      ],
      acceptedAnswers: ["B"],
      explanation: 'The writer asks "why such fictions are so useful" and concludes that success shows makers "have correctly judged which complications can, for a given purpose, be safely ignored."',
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
