import type { ItemGroup, Question, QuestionOption, QuestionTypeCode, Section } from "../../../../src/types/content";

/**
 * Mock Exam 1 — Academic Reading: 3 passages, 40 questions, 60 minutes.
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
  title: "Passage 1 — How the cat came in from the wild",
  stimulusKind: "passage",
  instructions:
    "You should spend about 20 minutes on Questions 1-13, which are based on Reading Passage 1 below.",
  passageText: `For an animal that shares homes with hundreds of millions of people, the domestic cat has been remarkably reluctant to reveal its origins. Dogs, cattle and sheep were transformed by domestication into animals that look and behave very differently from their wild ancestors. Cats, by contrast, have changed so little that experts still struggle to tell a domestic cat from a wildcat by its skeleton alone. For much of the twentieth century this made the history of the cat a matter of guesswork. Over the past two decades, however, advances in genetics and archaeology have begun to fill in the story.

The first step was to identify the ancestor. Wildcats are found across Europe, Africa and Asia, and they are divided into several subspecies. In 2007 a team led by the geneticist Carlos Driscoll compared the DNA of nearly a thousand cats, both domestic and wild, from around the world. Every domestic cat in the sample, from the pedigree Siamese to the ordinary farm cat, could be traced back to a single subspecies, Felis silvestris lybica, the wildcat of the Near East and North Africa. The European wildcat, which still survives in parts of Scotland and Germany, made no contribution at all.

The genetic evidence pointed to a region, and archaeology suggested a time. For many years the earliest evidence of cats living alongside humans came from ancient Egypt, where they were painted on tomb walls and, in their millions, mummified as offerings to the goddess Bastet. It was widely assumed that the Egyptians had been the first to tame the cat, perhaps around four thousand years ago. In 2004, however, archaeologists excavating a village on the island of Cyprus found the skeleton of a cat buried close to that of a human, in a grave dated to around 9,500 years ago. Since there are no native wildcats on Cyprus, the animal, or its ancestors, must have been carried there by boat. This discovery pushed the relationship between cats and people back more than five thousand years before the Egyptian evidence.

The date is significant because it coincides with the beginnings of farming in the region known as the Fertile Crescent. Once people began to grow and store grain, their villages attracted mice and rats in large numbers, and the rodents in turn attracted wildcats. Most researchers now believe that domestication was not something humans deliberately set out to achieve. Instead, cats domesticated themselves. The bolder individuals, those that tolerated human presence, could exploit a rich and reliable source of food, and over many generations natural selection favoured animals that were calmer around people. Farmers, for their part, had little reason to drive away an animal that kept down the pests eating their harvest.

This process explains one of the cat's most distinctive features: its independence. Most domestic animals were selected by humans for specific purposes, such as pulling ploughs, producing milk or guarding flocks, and were bred under close control. Cats, which already did the one job people wanted, were largely left to breed as they pleased. Even today, the great majority of cats choose their own mates, and only a small proportion belong to recognised breeds. Most of the breeds we know were developed within the past 150 years, beginning with the cat shows held in Victorian England.

Genetics has also revealed how cats spread across the world. A study published in 2017 analysed DNA from the remains of more than 200 cats found at archaeological sites spanning 9,000 years. It identified two main waves of expansion. The first carried cats from the Near East into Europe along with early farmers. The second, which began much later, spread cats from Egypt, and these animals travelled along trade routes by sea. Cats were valued on ships for controlling rats, and the remains of Egyptian-type cats have been found at a Viking port on the Baltic coast, dated to between the eighth and the eleventh centuries.

The same study produced a further surprise. Researchers were able to track a genetic variant responsible for the blotched tabby coat, in which the familiar stripes are replaced by swirling patches. This pattern, now extremely common, did not appear until the Middle Ages, which suggests that people only began choosing cats for their appearance comparatively recently. For thousands of years, it seems, what mattered was not how a cat looked but how well it hunted.

Some biologists argue that the cat is still only partly domesticated. Unlike dogs, which depend almost entirely on humans, many cats can survive perfectly well without them, and feral populations live successfully on every continent except Antarctica. Domestic cats also interbreed readily with wildcats, which has created a serious conservation problem in Scotland, where very few genetically pure wildcats remain. Yet the cat has made one notable adjustment to life with humans. Adult wildcats rarely miaow to one another; the sound is mainly used by kittens to call their mothers. Domestic cats, by contrast, miaow frequently at their owners, and studies suggest that they adjust the sound to each household, producing calls that their own owners can interpret but strangers often cannot. Whether this counts as domestication or as clever manipulation is, perhaps, a matter of opinion.`,
  questions: [
    ...withOptions(1, "true_false_notgiven", TFNG, [
      ["It is easy to distinguish the skeleton of a domestic cat from that of a wildcat.", "FALSE", `"experts still struggle to tell a domestic cat from a wildcat by its skeleton alone."`],
      ["Driscoll's study included cats from several parts of the world.", "TRUE", `The team compared nearly a thousand cats "from around the world."`],
      ["The European wildcat is an ancestor of some modern domestic cats.", "FALSE", `"The European wildcat, which still survives in parts of Scotland and Germany, made no contribution at all."`],
      ["The cat found on Cyprus was buried with valuable objects.", "NOT GIVEN", `The passage says only that it was "buried close to that of a human"; nothing is said about objects in the grave.`],
      ["Cyprus has its own native population of wildcats.", "FALSE", `"there are no native wildcats on Cyprus", so the cat "must have been carried there by boat."`],
      ["Cats were more common than dogs in early farming villages.", "NOT GIVEN", `The passage explains that grain "attracted mice and rats" and then wildcats, but never compares the numbers of cats and dogs.`],
      ["Most modern cat breeds are less than two hundred years old.", "TRUE", `"Most of the breeds we know were developed within the past 150 years".`],
    ]),
    ...gaps(8, "note_completion", 1, [
      ["The 2017 study — first wave: cats moved from the Near East into Europe with early ______", ["farmers"], `"The first carried cats from the Near East into Europe along with early farmers."`],
      ["Second wave: cats from Egypt travelled along trade routes by ______", ["sea"], `"these animals travelled along trade routes by sea."`],
      ["Cats were kept on ships because they controlled ______", ["rats"], `"Cats were valued on ships for controlling rats".`],
      ["Egyptian-type cat remains were found at a Viking ______ on the Baltic", ["port"], `remains "have been found at a Viking port on the Baltic coast".`],
      ["The blotched tabby coat first appeared in the ______ Ages", ["Middle"], `"This pattern, now extremely common, did not appear until the Middle Ages".`],
      ["Domestic cats miaow mainly to communicate with their ______", ["owners"], `"Domestic cats, by contrast, miaow frequently at their owners".`],
    ]),
  ],
};

const HEADINGS: QuestionOption[] = [
  { value: "i", label: "i. A practical solution that depends on people" },
  { value: "ii", label: "ii. Recovery from the edge of extinction" },
  { value: "iii", label: "iii. How one animal remakes a river" },
  { value: "iv", label: "iv. Making room along the riverbanks" },
  { value: "v", label: "v. Gains for communities downstream" },
  { value: "vi", label: "vi. The high financial cost of releases" },
  { value: "vii", label: "vii. Damage and a disputed response" },
  { value: "viii", label: "viii. A surge in other forms of life" },
  { value: "ix", label: "ix. Why fish numbers have fallen" },
];

const PEOPLE: QuestionOption[] = [
  { value: "A", label: "A. Richard Brazier" },
  { value: "B", label: "B. Robert Needham" },
  { value: "C", label: "C. Gerhard Schwab" },
];

const passage2: ItemGroup = {
  id: "rg-2",
  partNumber: 2,
  title: "Passage 2 — The return of the beaver",
  stimulusKind: "passage",
  instructions:
    "You should spend about 20 minutes on Questions 14-26, which are based on Reading Passage 2 below.",
  passageText: `A. In 2009, after an absence of some four hundred years, beavers were officially returned to the wild in Britain. Eleven animals from Norway were released into Knapdale Forest in western Scotland as part of a five-year trial. By then, however, they were not the only beavers in the country. Escaped or illegally released animals had already been living for years on the River Tay, further east, and their numbers were growing rapidly. Similar stories can be told across Europe. In 1900 the Eurasian beaver, hunted for its fur, its meat and its scent glands, had been reduced to perhaps 1,200 animals in a handful of isolated populations. Today, thanks to legal protection and more than two hundred reintroduction projects, there are well over a million.

B. What makes the beaver unusual among returning species is the scale of its effect on the landscape. Few animals other than humans reshape their surroundings so thoroughly. Beavers fell trees with their teeth, and on smaller streams they use the timber, along with mud and stones, to build dams. The dams create ponds deep enough for the animals to build lodges with underwater entrances, which protect them from predators. A single family may build a series of dams along a stream, turning a narrow, fast-flowing channel into a chain of pools, wetlands and slow-moving side channels. Ecologists describe such animals as ecosystem engineers. The term reflects the fact that their influence on other species comes less from what they eat than from the physical changes they make to the places where those species live. A beaver pond may persist for decades after its builders have moved on, gradually filling with sediment and turning into a meadow.

C. The consequences for wildlife can be striking. In a study at an enclosed site in Devon, in south-west England, researchers led by Professor Richard Brazier found that the area of open water increased from a single small pond to thirteen ponds within five years of beavers arriving. Over the same period the number of clumps of frog spawn rose from ten to more than five hundred. Because the dead trees left standing in the water are ideal for insects, and because the insects attract bats and birds, the benefits extend well beyond aquatic species. Fish, which some anglers feared would be blocked by the dams, generally appear to cope well; a review by the ecologist Robert Needham concluded that most species can pass over or around dams, particularly during high water.

D. Perhaps the most important benefits, from a human point of view, concern water. Beaver dams hold water back in the landscape and release it gradually. Brazier's team measured the flow of water leaving the Devon site during storms and found that peak flows were, on average, about thirty per cent lower than those entering it. Communities downstream that suffer from flooding stand to gain, and in several English villages beavers have been released with this in mind. The ponds also act as filters: soil and agricultural chemicals washed off fields settle out behind the dams, so that the water leaving a beaver site is noticeably cleaner. In dry summers, the same stored water keeps streams flowing that might otherwise run dry.

E. Not everyone welcomes the beaver's return. Farmers in the Tay valley report that beavers have dug burrows into the banks that protect fields from flooding, causing them to collapse, and that dams have flooded valuable farmland. Beavers also fell trees in gardens and orchards, and their habit of blocking drainage pipes and culverts can cause problems for roads and railways. In Scotland, where beavers became a protected species in 2019, licences were issued in the first year allowing more than eighty animals to be shot, a decision that conservation groups strongly criticised. Critics argue that moving problem animals to new areas would be better than killing them; supporters of the policy reply that suitable sites are limited.

F. Much of the debate turns on how such conflicts should be managed. Experience in Bavaria, in southern Germany, where beavers have been back for half a century, suggests that most problems can be solved with relatively simple measures. Wire mesh wrapped around valuable trees prevents them from being felled, and flow devices, which are essentially pipes passed through a dam, can keep the water behind it at an acceptable level without destroying the dam itself. Gerhard Schwab, who has managed beavers in Bavaria for more than thirty years, believes that the crucial factor is not the technology but having a trained adviser who can visit a farm quickly when a problem arises. Where landowners feel ignored, he says, tolerance soon disappears.

G. A further option is to give the beaver space. Most conflicts occur within twenty metres of a riverbank, and some ecologists have proposed that strips of land along rivers be taken out of farming altogether, with farmers paid to let them return to wetland. Such strips would reduce conflict while providing many of the benefits described above. Whether governments will be willing to pay for them remains to be seen. What is clear is that the beaver is back to stay, and that Britain's rivers, for better or worse, will look rather different as a result.`,
  questions: [
    ...withOptions(14, "matching_headings", HEADINGS, [
      ["Paragraph B — choose the most suitable heading.", "iii", `Beavers turn "a narrow, fast-flowing channel into a chain of pools, wetlands and slow-moving side channels."`],
      ["Paragraph C — choose the most suitable heading.", "viii", `Frog spawn "rose from ten to more than five hundred", and "the benefits extend well beyond aquatic species."`],
      ["Paragraph D — choose the most suitable heading.", "v", `"Communities downstream that suffer from flooding stand to gain".`],
      ["Paragraph E — choose the most suitable heading.", "vii", `Farmers report collapsed banks and flooded land, and licences to shoot animals were "a decision that conservation groups strongly criticised."`],
      ["Paragraph F — choose the most suitable heading.", "i", `Simple measures work, but "the crucial factor is not the technology but having a trained adviser who can visit a farm quickly".`],
      ["Paragraph G — choose the most suitable heading.", "iv", `"A further option is to give the beaver space", using "strips of land along rivers".`],
    ]),
    ...withOptions(20, "matching_features", PEOPLE, [
      ["Beaver dams reduce the peak flow of water during storms.", "A", `"Brazier's team" found peak flows "about thirty per cent lower than those entering it."`],
      ["Most fish are able to get past beaver dams.", "B", `"a review by the ecologist Robert Needham concluded that most species can pass over or around dams".`],
      ["Landowners need fast, personal support when problems occur.", "C", `Schwab believes the key is "having a trained adviser who can visit a farm quickly when a problem arises."`],
      ["The arrival of beavers greatly increased the number of frogs at one site.", "A", `In the study "led by Professor Richard Brazier", "the number of clumps of frog spawn rose from ten to more than five hundred."`],
    ]),
    ...gaps(24, "summary_completion", 2, [
      ["Summary: Beaver ponds clean the water, because soil and ______ washed off fields settle behind the dams.", ["agricultural chemicals", "chemicals"], `"soil and agricultural chemicals washed off fields settle out behind the dams".`],
      ["Summary: In dry summers, water stored by the dams keeps ______ flowing.", ["streams"], `"the same stored water keeps streams flowing that might otherwise run dry."`],
      ["Summary: Some ecologists suggest paying farmers to let riverside strips return to ______.", ["wetland"], `"with farmers paid to let them return to wetland."`],
    ]),
  ],
};

const passage3: ItemGroup = {
  id: "rg-3",
  partNumber: 3,
  title: "Passage 3 — The myth of multitasking",
  stimulusKind: "passage",
  instructions:
    "You should spend about 20 minutes on Questions 27-40, which are based on Reading Passage 3 below.",
  passageText: `Ask anyone who works in an office how they spend their day and the answer is likely to involve doing several things at once: answering emails during meetings, listening to a podcast while writing a report, glancing at a phone between paragraphs. Job advertisements routinely ask for candidates who can multitask, as though it were a skill like typing or speaking a foreign language. Yet among the psychologists who study attention, there is a broad consensus that, for most tasks that require thought, multitasking in the strict sense barely exists. What we call multitasking is usually something else: switching rapidly from one task to another, and paying a price each time we do.

The evidence for this goes back further than one might expect. In the 1930s the American psychologist John Ridley Stroop showed that people take longer to name the colour of ink in which a word is printed when the word itself names a different colour; reading, which is automatic for literate adults, interferes with the slower task of naming. Research in the 1990s measured what are now called switch costs. When participants alternated between two simple tasks, such as classifying numbers as odd or even and classifying letters as vowels or consonants, they were consistently slower and made more errors than when they performed either task in a block on its own. The cost of each switch was small, often only a fraction of a second, but it accumulated, and it increased with the complexity of the tasks.

The explanation most researchers favour is that the brain has a limited capacity for what is sometimes called executive control: the processes that select a goal, retrieve the rules for achieving it, and keep irrelevant information out. These processes cannot easily serve two demanding goals at once. When we switch, the rules for the old task must be put aside and those for the new task loaded, and traces of the previous task tend to linger. The organisational psychologist Sophie Leroy has called this lingering "attention residue", and her experiments suggest that people who move to a new task before finishing the previous one perform the new task noticeably worse.

There are genuine exceptions. Activities that have become automatic through long practice, such as walking, can be combined with others with little loss. An experienced driver can hold a conversation on an empty motorway. The difficulty arises when both activities make demands on the same mental resources, or when an automatic task suddenly requires attention, as happens when traffic ahead stops without warning. Studies in driving simulators have found that drivers talking on a telephone, even a hands-free one, are slower to brake than drivers who are silent. Interestingly, talking to a passenger has a smaller effect, apparently because passengers can see the road and tend to stop talking when conditions become difficult.

One of the most surprising findings concerns the people who multitask most. In a widely reported study published in 2009, researchers at Stanford University compared students who reported heavy use of several media at once, such as messaging while watching video, with students who seldom did so. The researchers expected the heavy multitaskers to be better at switching between tasks. They were in fact worse, and they were also more easily distracted by irrelevant information. The study could not show which came first: whether multitasking weakens attention, or whether people who are already easily distracted are drawn to multitasking. Later studies have produced mixed results, and the effect may be smaller than first thought, but none has found that heavy multitaskers perform better.

Why, then, is multitasking so popular? Part of the answer may be that it feels productive. In one study, students who watched television while studying reported feeling more satisfied with their session, even though they had learned less. Switching tasks also provides frequent small rewards, such as the arrival of a new message, which the brain finds hard to resist. And people are poor judges of their own abilities: those who rate themselves as good multitaskers tend, if anything, to perform below average when tested.

None of this means that workplaces should ban email or that students should study in silence. Some background noise appears to have little effect on simple tasks, and music without lyrics may even help some people concentrate. The point is that attention is a limited resource, and that the costs of dividing it are largely invisible to the person doing the dividing. Practical advice from researchers tends to be modest: deal with messages at set times rather than as they arrive, finish one piece of work before starting the next where possible, and keep phones out of sight during tasks that require concentration. Even a phone that is switched off, one study found, can reduce performance on a memory test if it is lying on the desk.

Perhaps the most useful change is one of language. If we described what we do not as multitasking but as task switching, we might be less inclined to boast about it, and more inclined to ask whether each switch is really worth its cost.`,
  questions: [
    mcq(27, "In the first paragraph, the writer suggests that what people call multitasking", ["is a skill employers are right to value", "is usually rapid switching between tasks", "is becoming less common in offices", "is easier for people who type well"], "B", `"What we call multitasking is usually something else: switching rapidly from one task to another".`),
    mcq(28, "Research on switch costs in the 1990s found that", ["the costs disappeared with practice", "each switch wasted several seconds", "the costs rose as tasks became more complex", "letters were harder to classify than numbers"], "C", `The cost "accumulated, and it increased with the complexity of the tasks."`),
    mcq(29, "Sophie Leroy's experiments suggest that", ["leaving a task unfinished harms performance on the next one", "people forget the rules of a task very quickly", "executive control improves with training", "switching tasks is less costly for experts"], "A", `"people who move to a new task before finishing the previous one perform the new task noticeably worse."`),
    mcq(30, "According to the writer, talking to a passenger affects driving less than using a phone because passengers", ["speak more quietly", "usually talk about the journey", "can see when the road conditions change", "are often experienced drivers themselves"], "C", `"passengers can see the road and tend to stop talking when conditions become difficult."`),
    mcq(31, "What does the writer say about the 2009 Stanford study?", ["It proved that multitasking damages attention.", "It could not establish cause and effect.", "Its results have been confirmed by every later study.", "It found heavy multitaskers switched tasks faster."], "B", `"The study could not show which came first".`),
    ...withOptions(32, "yes_no_notgiven", YNNG, [
      ["Employers are right to treat multitasking as a skill like speaking a foreign language.", "NO", `Adverts ask for it "as though it were a skill like typing or speaking a foreign language", but the writer says multitasking "barely exists."`],
      ["People are generally unaware of the cost of dividing their attention.", "YES", `"the costs of dividing it are largely invisible to the person doing the dividing."`],
      ["Students who study in front of the television tend to overestimate their progress.", "YES", `They "reported feeling more satisfied with their session, even though they had learned less."`],
      ["Heavy multitaskers are usually less successful in their careers.", "NOT GIVEN", `The passage discusses attention tests, not careers; it only says "none has found that heavy multitaskers perform better."`],
      ["Workplaces should stop employees from using email.", "NO", `"None of this means that workplaces should ban email".`],
    ]),
    ...gaps(37, "sentence_completion", 1, [
      ["In Stroop's experiment, ______ slowed down the naming of colours because it is automatic.", ["reading"], `"reading, which is automatic for literate adults, interferes with the slower task of naming."`],
      ["Long-practised activities such as ______ can be combined with other tasks.", ["walking"], `"Activities that have become automatic through long practice, such as walking, can be combined with others".`],
      ["People who believe they are good multitaskers often score below ______.", ["average"], `They "tend, if anything, to perform below average when tested."`],
      ["A switched-off phone on the desk can lower scores on a ______ test.", ["memory"], `It "can reduce performance on a memory test if it is lying on the desk."`],
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
