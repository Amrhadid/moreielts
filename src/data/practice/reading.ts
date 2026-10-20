import type { ObjectiveSet } from "./types";

/**
 * Reading practice set: one Academic passage, five questions across three
 * question types (True/False/Not Given, multiple choice, sentence completion).
 */
export const READING_SET: ObjectiveSet = {
  section: "reading",
  id: "reading-tree-rings-1",
  title: "Reading the Rings",
  contextLabel: "Academic passage · 5 questions · about 12 minutes",
  instructions:
    "Read the passage and answer questions 1–5. For questions 1 and 2 choose TRUE if the statement agrees with the information, FALSE if it contradicts the information, or NOT GIVEN if there is no information on this. For question 5, write NO MORE THAN TWO WORDS from the passage.",
  passage: {
    title: "Reading the Rings: what trees remember",
    paragraphs: [
      "A. Cut through the trunk of a temperate tree and you will see a series of concentric rings, each one the record of a single growing season. In spring, when water is plentiful, the tree produces large, thin-walled cells that appear pale; as summer gives way to autumn, growth slows and the cells become small and dense, forming a darker band. Together, one pale band and one dark band make a year. The width of that year's ring depends on how kind the season was: a warm, wet year leaves a broad ring, while a cold or dry year leaves a narrow one. Trees, in other words, keep a diary, and the science of reading it is called dendrochronology.",
      "B. The discipline was founded almost by accident. In the early twentieth century the American astronomer Andrew Ellicott Douglass was looking for evidence of the eleven-year sunspot cycle in the growth of pine trees in Arizona. He never found the clean signal he hoped for, but he noticed something else: trees growing many kilometres apart showed the same sequence of wide and narrow rings. The pattern was being dictated by the regional climate, and because every tree in the region recorded the same pattern, a sequence from one tree could be matched to a sequence from another. Douglass called this technique cross-dating, and it remains the foundation of the field.",
      "C. Cross-dating is what allows the record to reach back beyond the lifespan of any single tree. A living tree supplies a sequence whose final ring is known to be the present year. Its early rings overlap with the late rings of an older, dead tree, perhaps a beam in a historic building, and that beam's early rings overlap in turn with a log preserved in a riverbed. By chaining overlapping sequences together, researchers have assembled continuous regional chronologies covering thousands of years. The longest, built from oak and pine in central Europe, now stretches back more than 12,000 years without a gap.",
      "D. The method's first celebrated success was archaeological. In 1929 Douglass used a chronology built from beams in Pueblo Bonito, a vast stone settlement in New Mexico, to show that its roof timbers had been felled between the years 828 and 1130. For the first time, a prehistoric site in the Americas had been given calendar dates rather than estimates. The same approach has since fixed the construction year of Viking ships, medieval cathedrals and the panels on which Dutch masters painted, where the youngest ring in the oak gives the earliest possible date for the picture.",
      "E. Tree rings also underpin a dating technique that most people assume is independent of them. Radiocarbon dating measures the decay of carbon-14 in organic material, but the amount of carbon-14 in the atmosphere has not been constant over time, so a raw radiocarbon age can be several centuries out. Because each ring is wood of a known calendar year, scientists can measure its carbon-14 content and build a calibration curve that converts raw radiocarbon ages into true ages. Every radiocarbon date published today is corrected against a curve that rests, ultimately, on tree rings.",
      "F. The record is not universal. Dendrochronology works best where there is a single, pronounced growing season, which is why its heartlands are the temperate and boreal zones. In the humid tropics, many trees grow continuously throughout the year and so produce no clear annual boundary, although recent work on species that respond to a distinct dry season is beginning to change that picture. Even in ideal regions the rings must be read with care: a late frost can produce a false ring, and a severe drought can mean no ring at all, so a single sample is never trusted on its own.",
      "G. What the rings are increasingly asked to reveal is climate. The eruption of Mount Tambora in Indonesia in 1815 threw so much ash into the atmosphere that the following year became known in Europe and North America as the 'year without a summer', and trees across the northern hemisphere recorded it as a year of unusually narrow rings. Reconstructions built from thousands of such samples now give researchers a season-by-season picture of temperature and rainfall long before the first thermometer, and with it a way of judging how exceptional the warming of the past century really is. The trees, it turns out, have been keeping notes all along.",
    ],
  },
  questions: [
    {
      id: "r1",
      number: 1,
      kind: "radio",
      typeLabel: "True / False / Not Given",
      prompt: "Douglass began studying tree rings because he wanted to learn about past climates.",
      options: [
        { value: "TRUE", label: "True" },
        { value: "FALSE", label: "False" },
        { value: "NOT GIVEN", label: "Not Given" },
      ],
      acceptedAnswers: ["FALSE"],
      explanation:
        "Paragraph B says Douglass was an astronomer 'looking for evidence of the eleven-year sunspot cycle' — his aim was astronomical, not climatic, so the statement contradicts the passage.",
    },
    {
      id: "r2",
      number: 2,
      kind: "radio",
      typeLabel: "True / False / Not Given",
      prompt: "The timbers at Pueblo Bonito were cut using stone tools.",
      options: [
        { value: "TRUE", label: "True" },
        { value: "FALSE", label: "False" },
        { value: "NOT GIVEN", label: "Not Given" },
      ],
      acceptedAnswers: ["NOT GIVEN"],
      explanation:
        "Paragraph D gives the felling dates of the timbers (828–1130) but says nothing about the tools used to cut them, so there is no information either way.",
    },
    {
      id: "r3",
      number: 3,
      kind: "radio",
      typeLabel: "Multiple choice",
      prompt: "According to the writer, cross-dating is important because it",
      options: [
        { value: "A", label: "proves that the sunspot cycle affects tree growth." },
        { value: "B", label: "makes it possible to build records longer than a single tree's life." },
        { value: "C", label: "shows that trees in different regions grow at the same rate." },
        { value: "D", label: "removes the need to examine living trees." },
      ],
      acceptedAnswers: ["B"],
      explanation:
        "Paragraph C: cross-dating 'allows the record to reach back beyond the lifespan of any single tree' by chaining overlapping sequences. A is contradicted (Douglass never found the sunspot signal), C generalises wrongly across regions, and D is wrong because the living tree anchors the chain.",
    },
    {
      id: "r4",
      number: 4,
      kind: "radio",
      typeLabel: "Multiple choice",
      prompt: "Why is dendrochronology difficult to apply in the humid tropics?",
      options: [
        { value: "A", label: "Trees there are rarely preserved after they die." },
        { value: "B", label: "The growing season is too short to form a ring." },
        { value: "C", label: "Many trees grow all year and do not form distinct annual rings." },
        { value: "D", label: "Droughts there frequently produce false rings." },
      ],
      acceptedAnswers: ["C"],
      explanation:
        "Paragraph F: in the humid tropics 'many trees grow continuously throughout the year and so produce no clear annual boundary'. False rings (D) are mentioned for frosts in ideal regions, not for the tropics.",
    },
    {
      id: "r5",
      number: 5,
      kind: "text",
      typeLabel: "Sentence completion",
      prompt:
        "Raw radiocarbon ages are converted into true calendar ages using a ______ constructed from tree rings.",
      acceptedAnswers: ["calibration curve"],
      wordLimit: 2,
      explanation:
        "Paragraph E: scientists 'build a calibration curve that converts raw radiocarbon ages into true ages'. The answer must be taken from the passage, so 'calibration curve' is the only two-word answer that fits.",
    },
  ],
};
