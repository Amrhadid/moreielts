import type { ItemGroup, Question, Section } from "../../src/types/content";

/**
 * Academic Reading: 3 passages, 40 questions, 60 minutes.
 * Between them the three passages exercise 11 of the 15 registry types.
 */

const HEADING_OPTIONS = [
  { value: "i", label: "i. A cost that never appears on the balance sheet" },
  { value: "ii", label: "ii. Measuring what the canopy actually does" },
  { value: "iii", label: "iii. Early objections from residents" },
  { value: "iv", label: "iv. The uneven distribution of shade" },
  { value: "v", label: "v. Where the money for planting comes from" },
  { value: "vi", label: "vi. A slow return on a long investment" },
  { value: "vii", label: "vii. Lessons from a single heatwave" },
  { value: "viii", label: "viii. Choosing species for a warmer century" },
];

const PARAGRAPH_OPTIONS = [
  { value: "A", label: "Paragraph A" },
  { value: "B", label: "Paragraph B" },
  { value: "C", label: "Paragraph C" },
  { value: "D", label: "Paragraph D" },
  { value: "E", label: "Paragraph E" },
  { value: "F", label: "Paragraph F" },
];

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

const RESEARCHERS = [
  { value: "A", label: "A. Loftus" },
  { value: "B", label: "B. Bartlett" },
  { value: "C", label: "C. Nadel" },
];

const SENTENCE_ENDINGS = [
  { value: "A", label: "A. because the original trace is overwritten each time." },
  { value: "B", label: "B. because remembering is an act of reconstruction." },
  { value: "C", label: "C. although the witness reports it with great confidence." },
  { value: "D", label: "D. unless the event was rehearsed immediately afterwards." },
  { value: "E", label: "E. which is why juries find such testimony persuasive." },
];

const passage1: ItemGroup = {
  id: "rg-1",
  partNumber: 1,
  title: "Passage 1 — The long flight of the wandering albatross",
  stimulusKind: "passage",
  instructions:
    "You should spend about 20 minutes on Questions 1-13, which are based on Reading Passage 1 below.",
  passageText: `The wandering albatross, Diomedea exulans, has the largest wingspan of any living bird. A mature adult measures up to three and a half metres from tip to tip, and yet the bird is remarkable less for its size than for what it does with it. Satellite tracking has shown individuals covering more than a thousand kilometres in a single day and circling the Southern Ocean in under two months, all while beating their wings only rarely.

The trick is a technique called dynamic soaring. Wind blowing across the open ocean is slowed near the surface by friction with the water, so a bird climbing from the trough of a wave into the faster air above gains speed relative to the ground without expending muscular effort. The albatross rises into the wind, turns, and descends across it, extracting a small amount of energy from the wind gradient on every cycle. Repeated tens of thousands of times a day, these shallow arcs carry the bird enormous distances. A tendon lock in the shoulder holds the wing extended, so that maintaining the spread costs the bird almost nothing.

Measurements bear this out. Researchers who fitted birds with heart-rate loggers found that the metabolic cost of soaring flight was barely higher than that of sitting on the nest. The expensive parts of an albatross's day are take-off and landing, which is why the birds are reluctant to leave the water in calm conditions and may sit out a windless afternoon entirely.

This economy of movement shapes the species' breeding biology. A pair raises a single chick, and the effort takes so long that successful breeders can attempt it only every second year. The male and female take turns at the nest on Southern Ocean islands while the other forages, sometimes as far away as the coast of South America. A foraging trip of a fortnight is unremarkable. The chick, left alone on its nest mound for days at a time, is fed on an irregular schedule and grows slowly, fledging after roughly nine months.

That long, slow schedule is the source of the species' present difficulty. Longline fishing vessels set baited hooks that sink slowly behind the boat, and albatrosses, which follow ships as a matter of course, dive on the bait and are dragged under. Because the birds breed so infrequently, a population cannot absorb additional adult mortality the way a fast-breeding species can. Conservationists have pressed for simple mitigation measures: streamer lines that scare birds away from the sinking hooks, weighted lines that sink faster, and setting gear at night when fewer birds are active.

Where these measures have been adopted and enforced, seabird bycatch has fallen sharply, in some fisheries by more than ninety per cent. The difficulty is that the albatross's range is far larger than any one country's waters. A bird nesting on South Georgia may pass through the jurisdictions of half a dozen states and long stretches of unregulated high seas in a single foraging trip. Protection is therefore a matter of agreement between fleets rather than of any single national rule, and the birds continue to decline in the regions where such agreement has proved hardest to reach.`,
  questions: [
    ...([
      ["The wandering albatross has a greater wingspan than any other bird alive today.", "TRUE"],
      ["Albatrosses flap their wings continuously during long ocean crossings.", "FALSE"],
      ["Dynamic soaring depends on the difference in wind speed at different heights.", "TRUE"],
      ["Young albatrosses learn dynamic soaring from their parents.", "NOT GIVEN"],
      ["Taking off uses more energy than remaining airborne.", "TRUE"],
      ["A breeding pair raises two chicks in a successful season.", "FALSE"],
    ] as const).map(
      ([prompt, answer], i): Question => ({
        id: `r-q${i + 1}`,
        number: i + 1,
        type: "true_false_notgiven",
        prompt,
        options: TFNG,
        acceptedAnswers: [answer],
      }),
    ),
    ...([
      ["A locked ______ in the shoulder holds the wing open at no cost.", ["tendon"]],
      ["Chicks leave the nest after about ______ months.", ["nine", "9"]],
      ["______ lines frighten birds away from hooks as they sink.", ["streamer", "streamer lines"]],
      ["Setting fishing gear at ______ reduces the number of birds caught.", ["night"]],
    ] as const).map(
      ([prompt, answers], i): Question => ({
        id: `r-q${i + 7}`,
        number: i + 7,
        type: "note_completion",
        prompt,
        acceptedAnswers: [...answers],
        wordLimit: 2,
      }),
    ),
    ...([
      ["How often can a successful breeding pair attempt to raise a chick?", ["every second year", "every two years", "biennially"]],
      ["What is added to fishing lines so that they sink more quickly?", ["weights", "weight"]],
      ["By how much has bycatch fallen in some fisheries where measures are enforced?", ["more than ninety per cent", "90%", "ninety per cent", "over 90 per cent"]],
    ] as const).map(
      ([prompt, answers], i): Question => ({
        id: `r-q${i + 11}`,
        number: i + 11,
        type: "short_answer",
        prompt,
        acceptedAnswers: [...answers],
        wordLimit: 3,
      }),
    ),
  ],
};

const passage2: ItemGroup = {
  id: "rg-2",
  partNumber: 2,
  title: "Passage 2 — What a city tree is worth",
  stimulusKind: "passage",
  instructions:
    "You should spend about 20 minutes on Questions 14-26, which are based on Reading Passage 2 below.",
  passageText: `A. For most of the twentieth century, the trees in a city budget appeared only as a cost. They were planted, pruned, cleared of storm damage and eventually removed, and each of those activities had a line item. Nothing on the other side of the ledger recorded what the trees returned. A parks department could therefore demonstrate the expense of its canopy with great precision while being unable to say what the city received for the money.

B. That began to change when researchers started attaching instruments to street trees. A mature plane tree in a temperate city intercepts several thousand litres of rainfall a year, water that would otherwise arrive at the drains during the few minutes of a storm when the system is least able to accept it. The same tree removes measurable quantities of particulate matter from the air and shades enough asphalt to lower the surface temperature beneath it by fifteen degrees or more on a summer afternoon. Each of these effects corresponds to money a city would otherwise spend on drainage capacity, on health care, or on electricity for cooling.

C. Putting a figure on the shade proved the most consequential of these calculations. During a severe heat episode, the difference between a shaded and an unshaded street is not a matter of comfort but of mortality, and it falls unevenly. Surveys of several large cities found canopy cover closely tracking historical patterns of wealth: the wealthiest districts commonly carried two or three times the leaf area of the poorest, and recorded correspondingly lower night-time temperatures. Heat, it turned out, was distributed along the same lines as everything else.

D. The economics of planting, however, are awkward for any elected official. A newly planted street tree delivers very little in its first decade. Its canopy is small, its roots are still establishing, and it requires watering through dry summers to survive at all. The benefits described above accrue to a tree of thirty or forty years' standing. The councillor who authorises the planting will not be in office when the investment matures, and the residents who pay for it are not, in the main, the residents who will sit beneath it.

E. Selecting what to plant has become harder as well. A species that thrives in a city's present climate may be poorly suited to the conditions expected there in fifty years, and the trees being planted now will still be standing then. Some municipal foresters have responded by planting deliberately mixed streets, accepting that a proportion of what goes in will fail, on the argument that a diverse canopy is more likely to survive both a warming climate and the arrival of a new pest. Others have begun sourcing familiar species from populations several hundred kilometres to the south.

F. What has changed, in the end, is not the trees but the accounting. Once a city can state that its canopy returns a given sum per year in avoided drainage, cooling and health costs, the conversation shifts from amenity to infrastructure. Several cities now carry their trees on the asset register alongside the bridges and the drains, which means that removing one is recorded as the disposal of an asset rather than the completion of a job.`,
  questions: [
    ...([
      ["Paragraph A", "i"],
      ["Paragraph B", "ii"],
      ["Paragraph C", "iv"],
      ["Paragraph D", "vi"],
      ["Paragraph E", "viii"],
      ["Paragraph F", "v"],
    ] as const).map(
      ([prompt, answer], i): Question => ({
        id: `r-q${i + 14}`,
        number: i + 14,
        type: "matching_headings",
        prompt: `${prompt} — choose the most suitable heading.`,
        options: HEADING_OPTIONS,
        acceptedAnswers: [answer],
      }),
    ),
    ...([
      ["a comparison of leaf area between richer and poorer districts", "C"],
      ["a reference to trees being listed among a city's permanent assets", "F"],
      ["an explanation of why the timing of the benefit is politically difficult", "D"],
      ["a figure for the volume of rain a single tree can intercept", "B"],
    ] as const).map(
      ([prompt, answer], i): Question => ({
        id: `r-q${i + 20}`,
        number: i + 20,
        type: "matching_information",
        prompt: `Which paragraph contains ${prompt}?`,
        options: PARAGRAPH_OPTIONS,
        acceptedAnswers: [answer],
      }),
    ),
    ...([
      ["Shade from a mature tree can reduce the surface temperature of the road below it by ______ degrees or more.", ["fifteen", "15"]],
      ["A newly planted tree needs ______ in order to survive dry summers.", ["watering", "water"]],
      ["A canopy of mixed species is considered more resistant to a warming climate and to any new ______.", ["pest", "pests"]],
    ] as const).map(
      ([prompt, answers], i): Question => ({
        id: `r-q${i + 24}`,
        number: i + 24,
        type: "summary_completion",
        prompt,
        acceptedAnswers: [...answers],
        wordLimit: 2,
      }),
    ),
  ],
};

const passage3: ItemGroup = {
  id: "rg-3",
  partNumber: 3,
  title: "Passage 3 — The confident witness",
  stimulusKind: "passage",
  instructions:
    "You should spend about 20 minutes on Questions 27-40, which are based on Reading Passage 3 below.",
  passageText: `There is a persistent popular model of memory in which the mind works something like a recording device. Events are captured, filed, and later played back, and the playback may be faint or incomplete but is otherwise faithful to what was captured. Almost everything experimental psychology has learned in the past century contradicts this model, and yet it survives, not least in the courtroom, where a witness who remembers vividly is treated as a witness who remembers accurately.

The early work that unsettled the recording model was done by Frederic Bartlett, who asked English participants to read an unfamiliar Native American folk tale and to reproduce it from memory after intervals of days, weeks and finally years. The reproductions did not simply lose detail. They changed shape. Unfamiliar elements were quietly replaced with familiar ones, the supernatural passages were rationalised, and the whole was reorganised into a narrative that made sense to an English reader of the 1930s. Bartlett's conclusion was that remembering is not retrieval but reconstruction: the mind rebuilds an account from fragments and expectations each time it is asked, and what it produces is shaped by what it expects to find.

Elizabeth Loftus later showed how easily that reconstruction can be steered. Participants who had watched a film of a traffic accident were asked how fast the cars were going when they 'smashed into' each other; others were asked about the same film using the verb 'contacted'. The smashed group reported higher speeds, and, a week later, were substantially more likely to report having seen broken glass at the scene. There had been no broken glass. A single word in a question, asked after the event, had been incorporated into the memory of the event itself.

Lynn Nadel and others have since given this an anatomical account. A memory is not stored as a unit but distributed across the cortex, with the hippocampus binding the elements into a retrievable pattern. Each act of recall reactivates that pattern and, crucially, leaves it briefly labile before it is stabilised again. Whatever is present during that window — a leading question, another witness's account, a photograph in a newspaper — can be bound into the pattern and will subsequently be recalled as part of the original event, indistinguishable to the rememberer from anything else in it.

This last point is the one that matters legally, and it is the one that is hardest to accept. Contaminated memories do not feel contaminated. The witness is not lying and cannot be caught out, because from the inside a reconstructed detail carries exactly the same quality of vividness as an accurate one. Worse, confidence tends to rise with each retelling: the witness who has described the scene four times to investigators is more certain by the fourth telling, and jurors read that certainty as reliability.

The practical response has been procedural rather than psychological. Identification parades are now commonly administered by an officer who does not know which member is the suspect, so that no unconscious cue can be transmitted. Witnesses are asked for a statement of confidence at the moment of first identification, before any feedback, since it is that first figure, and not the one offered in court months later, that carries diagnostic value. None of this makes memory a recording. It simply accepts that it is not one.`,
  questions: [
    ...([
      ["The popular model of memory as a recording device has been largely abandoned outside psychology.", "NO"],
      ["Bartlett's participants altered the structure of the story, not just its details.", "YES"],
      ["Bartlett's study would be considered unethical by modern standards.", "NOT GIVEN"],
      ["The wording of a question asked afterwards can change what a witness remembers seeing.", "YES"],
      ["Jurors are generally able to distinguish a confident witness from an accurate one.", "NO"],
    ] as const).map(
      ([prompt, answer], i): Question => ({
        id: `r-q${i + 27}`,
        number: i + 27,
        type: "yes_no_notgiven",
        prompt,
        options: YNNG,
        acceptedAnswers: [answer],
      }),
    ),
    {
      id: "r-q32",
      number: 32,
      type: "multiple_choice_single",
      prompt: "In Bartlett's experiment, the changes participants made to the folk tale mainly involved",
      options: [
        { value: "A", label: "A. shortening the story to its essential events." },
        { value: "B", label: "B. adapting unfamiliar material to fit familiar expectations." },
        { value: "C", label: "C. adding supernatural elements that were not in the original." },
        { value: "D", label: "D. confusing the story with others they had read." },
      ],
      acceptedAnswers: ["B"],
    },
    {
      id: "r-q33",
      number: 33,
      type: "multiple_choice_single",
      prompt: "The detail of the broken glass is significant because",
      options: [
        { value: "A", label: "A. it was reported immediately after the film was shown." },
        { value: "B", label: "B. it shows that participants misjudged the speed of the cars." },
        { value: "C", label: "C. it was never present in the film the participants watched." },
        { value: "D", label: "D. only participants asked about 'contacted' reported it." },
      ],
      acceptedAnswers: ["C"],
    },
    {
      id: "r-q34",
      number: 34,
      type: "multiple_choice_single",
      prompt: "According to the passage, the hippocampus is described as",
      options: [
        { value: "A", label: "A. the site where complete memories are stored." },
        { value: "B", label: "B. binding distributed elements into a retrievable pattern." },
        { value: "C", label: "C. preventing new information from entering old memories." },
        { value: "D", label: "D. becoming less active with each act of recall." },
      ],
      acceptedAnswers: ["B"],
    },
    ...([
      ["demonstrated that post-event wording alters recall", "A"],
      ["showed that recall reshapes a story toward the familiar", "B"],
      ["described the period of instability that follows retrieval", "C"],
    ] as const).map(
      ([prompt, answer], i): Question => ({
        id: `r-q${i + 35}`,
        number: i + 35,
        type: "matching_features",
        prompt: `Which researcher ${prompt}?`,
        options: RESEARCHERS,
        acceptedAnswers: [answer],
      }),
    ),
    {
      id: "r-q38",
      number: 38,
      type: "matching_sentence_endings",
      prompt: "Bartlett argued that no two recollections of an event are identical",
      options: SENTENCE_ENDINGS,
      acceptedAnswers: ["B"],
    },
    {
      id: "r-q39",
      number: 39,
      type: "matching_sentence_endings",
      prompt: "A detail absorbed from a newspaper photograph may be recalled as part of the original scene",
      options: SENTENCE_ENDINGS,
      acceptedAnswers: ["C"],
    },
    {
      id: "r-q40",
      number: 40,
      type: "multiple_choice_multiple",
      prompt:
        "Which TWO procedural safeguards does the passage say have been adopted? Choose TWO letters.",
      options: [
        { value: "A", label: "A. Recording the witness's confidence at the first identification." },
        { value: "B", label: "B. Excluding witnesses who have spoken to the press." },
        { value: "C", label: "C. Using an officer who does not know which member is the suspect." },
        { value: "D", label: "D. Requiring identification to take place within 24 hours." },
        { value: "E", label: "E. Showing the witness the parade a second time in court." },
      ],
      acceptedAnswers: ["A", "C"],
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
