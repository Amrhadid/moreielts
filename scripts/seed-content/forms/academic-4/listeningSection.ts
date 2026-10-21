import type { ItemGroup, Question, QuestionTypeCode, Section } from "../../../../src/types/content";

/**
 * Listening: 4 parts, 40 questions, ~30 minutes. Challenge level: answers are
 * paraphrased, speakers correct themselves, and distractors are mentioned
 * close to the keyed answer. audioUrl is left undefined until generate-audio
 * writes the R2 URL.
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

function choice(number: number, prompt: string, options: string[], answer: string, explanation: string): Question {
  return {
    id: `l-q${number}`,
    number,
    type: "multiple_choice_single",
    prompt,
    options: options.map((label, i) => ({
      value: String.fromCharCode(65 + i),
      label: `${String.fromCharCode(65 + i)}. ${label}`,
    })),
    acceptedAnswers: [answer],
    explanation,
  };
}

function match(
  number: number,
  prompt: string,
  options: { value: string; label: string }[],
  answer: string,
  explanation: string,
): Question {
  return { id: `l-q${number}`, number, type: "matching_features", prompt, options, acceptedAnswers: [answer], explanation };
}

const part1: ItemGroup = {
  id: "lg-1",
  partNumber: 1,
  title: "Part 1 — Volunteering at a wildlife rescue centre",
  stimulusKind: "audio",
  instructions:
    "Questions 1-10. Complete the application notes below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.",
  transcript: `HANNAH: Hello, Fernhill Wildlife Rescue, Hannah speaking.
RAVI: Hi, Hannah. I saw your appeal for volunteers in the local paper and I'd like to find out whether I could help.
HANNAH: That's wonderful, we're always short of people. I can take some details over the phone and start an application now, if that suits you.
RAVI: Yes, please.
HANNAH: Could I have your full name?
RAVI: Ravi Thakkar. That's T-H-A-K-K-A-R.
HANNAH: Double K?
RAVI: That's right. People usually put a C in there somewhere, but it's just the two Ks.
HANNAH: Got it. And your postcode?
RAVI: It's BS7 4QD. Sorry, I've just moved, so let me think. No, that was my old one. The new one is BS7 4QB.
HANNAH: B for bravo at the end?
RAVI: Yes, B for bravo.
HANNAH: Thanks. Now, availability. Most of our volunteers come in on a regular morning each week, because that's when the animals are cleaned and fed.
RAVI: I'd originally thought Tuesdays, because I don't start work until midday then. But my manager has just moved our team meeting to Tuesday mornings, so it would have to be Thursday mornings instead.
HANNAH: Thursday is actually ideal, we're quite thin on the ground that day. Have you done any work with animals before?
RAVI: Not with wild animals. I helped out at a dog rescue charity for a few months when I was a student, mainly walking the dogs, but the longest I've done anything was two years at a riding school, mucking out the stables and leading the ponies.
HANNAH: The riding school is probably the most relevant, so I'll put that down. Handling large animals safely is a good skill to have. Do you have a preference for which unit you'd like to work in?
RAVI: I'd been hoping for the bird unit, if I'm honest.
HANNAH: I'm afraid that's the one area where we have a waiting list. It's very popular. But the hedgehog unit is crying out for help at this time of year, because so many young ones are found underweight in the autumn.
RAVI: Hedgehogs would be great, actually. I'd be happy with that.
HANNAH: Lovely. Everyone starts with an induction session, which covers hygiene, handling and what to do if you're bitten or scratched. It used to be a two-hour session, but we've added a practical element, so it now takes three hours, usually on a Saturday.
RAVI: That's fine. Is there anything I need to bring or wear?
HANNAH: Old clothes, definitely, and we'll provide gloves and overalls. The one thing we insist on is waterproof boots, because the floors in the units are hosed down several times a day. Trainers just get soaked.
RAVI: I've got a pair of wellingtons, so that's no problem.
HANNAH: Good. There's also a health requirement. You don't need rabies cover or anything like that, but you must be up to date with your tetanus vaccination, because of the risk from scratches and bites.
RAVI: I think I had one about five years ago, but I'll check with my doctor.
HANNAH: Please do. We'll ask to see a record. Lastly, we need one reference. Many people give us a tutor or a friend, but we specifically ask for someone who has supervised you at work, ideally your line manager.
RAVI: That's easy, my line manager will be happy to do it.
HANNAH: Excellent. So, if the reference and the vaccination record arrive in time, you could start in the first week of October. Let's say Thursday the second of October.
RAVI: The second of October. Perfect. Thanks very much, Hannah.
HANNAH: Thank you, Ravi. I'll email you the forms today.`,
  questions: [
    gap(1, "note_completion", "Surname: ______", ["Thakkar"], 'Ravi spells it "T-H-A-K-K-A-R" and confirms "it\'s just the two Ks."'),
    gap(2, "note_completion", "Postcode: ______", ["BS7 4QB"], 'BS7 4QD "was my old one. The new one is BS7 4QB."'),
    gap(3, "note_completion", "Available on ______ mornings", ["Thursday", "Thursdays"], 'Tuesdays are no longer possible, "so it would have to be Thursday mornings instead."'),
    gap(4, "note_completion", "Most relevant experience: two years at a ______", ["riding school"], 'Hannah says "The riding school is probably the most relevant, so I\'ll put that down."'),
    gap(5, "note_completion", "Unit: ______ unit", ["hedgehog"], 'The bird unit has a waiting list; Ravi agrees, "Hedgehogs would be great, actually."'),
    gap(6, "note_completion", "Induction session lasts ______ hours", ["3", "three"], 'It "used to be a two-hour session" but "it now takes three hours".'),
    gap(7, "note_completion", "Must wear ______ boots", ["waterproof"], 'Hannah says "The one thing we insist on is waterproof boots".'),
    gap(8, "note_completion", "Must be up to date with ______ vaccination", ["tetanus"], 'Rabies cover is not needed, but "you must be up to date with your tetanus vaccination".'),
    gap(9, "note_completion", "Reference from: ______", ["line manager", "manager"], 'Not a tutor or friend: "ideally your line manager."'),
    gap(10, "note_completion", "Start date: Thursday ______ October", ["2nd", "2", "second"], 'Hannah says "Let\'s say Thursday the second of October."'),
  ],
};

const FEATURES = [
  { value: "A", label: "A. It was rebuilt using the original stone." },
  { value: "B", label: "B. It is now used for training volunteers." },
  { value: "C", label: "C. It has been fitted with a modern mechanism." },
  { value: "D", label: "D. It provides a habitat for a protected species." },
  { value: "E", label: "E. It was funded entirely by local businesses." },
  { value: "F", label: "F. It is closed to the public for part of the year." },
  { value: "G", label: "G. It contains an exhibition about canal workers." },
];

const part2: ItemGroup = {
  id: "lg-2",
  partNumber: 2,
  title: "Part 2 — Talk on the restoration of the Harnley Canal",
  stimulusKind: "audio",
  instructions:
    "Questions 11-20. Choose the correct letter for Questions 11-14. For Questions 15-20, choose the feature (A-G) that matches each site on the canal.",
  transcript: `SPEAKER: Good evening, and thank you for coming. I'm Clare Sowerby, chair of the Harnley Canal Trust, and tonight I want to give you an overview of where the restoration stands, twenty years after we began.
SPEAKER: Let me start with a little history, because there's a common misconception. People often assume the canal fell out of use because of the railways. The railway certainly took some of its trade, but the canal carried coal profitably right up until 1936. What actually finished it was a breach near Ellerby, where the bank collapsed after a winter of heavy rain. The company simply couldn't afford the repair, and the water was drained.
SPEAKER: When the Trust was founded, our first instinct was to raise money through grants. In the end, though, the single biggest contribution has not been money at all. Grants have covered around a third of the cost, and fundraising events much less. What has really made the difference is volunteer labour. We estimate that volunteers have given over two hundred thousand hours, and if we'd had to pay for that, the project would never have happened.
SPEAKER: People also ask why it has taken so long. Finance is part of it, and so is the sheer amount of silt we've had to remove. But the main delay, and I don't think anyone foresaw this, has been the planning and environmental approvals. Every section has needed its own survey, and some have taken several years to be signed off.
SPEAKER: Looking ahead, our priority for the next five years is not, as some members would like, to extend the canal further west. Nor is it to build the new visitor centre, although that remains a long-term ambition. The board has agreed that what matters most is securing the water supply, because without a reliable reservoir the restored sections will not stay navigable through a dry summer.
SPEAKER: Now let me take you along the canal, from east to west, and describe some of the sites you can visit.
SPEAKER: We start at Bramley Lock. When we began, there was almost nothing left of it but a hole in the ground. The original stone had long since been taken away for local buildings, so we had to source new stone from a quarry in the next valley. What's special about Bramley is the gates. Instead of the traditional wooden beams that boaters push by hand, they're operated hydraulically, at the touch of a button, which makes the lock usable by people with limited strength.
SPEAKER: A little further on is the Ellerby Aqueduct, where the canal crosses the river. This is the site of the breach I mentioned. The engineers wanted to replace it with concrete, but the planners insisted that the aqueduct be rebuilt using the original stone, and every block was numbered, recovered from the river bed and put back in its place. It took four years.
SPEAKER: Next is the old Toll House. For a while we used it as our office, and many people think it still is. But since the office moved into town, the Toll House has become our training base. Every new volunteer spends their first day there, learning about safety and tools.
SPEAKER: Then we come to Haddon Tunnel. The tunnel is around eight hundred metres long and, I should warn you, there's no towpath through it. It's also home to a colony of bats, and because bats are a protected species, the tunnel is closed to boats and walkers from November to March while they hibernate. So if you want to see it, come in the summer.
SPEAKER: Beyond the tunnel is Carver's Wharf. People sometimes think the restoration there was paid for by the council. In fact the council gave us the land, but the work itself was paid for entirely by a group of businesses in the town, who wanted a place to hold markets.
SPEAKER: And finally, at the western end, the Lock Keeper's Cottage. It's been restored as it would have looked in the 1890s, and upstairs there's a small exhibition about the lives of the people who worked on the canal, the boatmen, the lock keepers and their families. I'd really recommend it.
SPEAKER: Now, before I take questions, let me say a few words about how you can get involved.`,
  questions: [
    choice(11, "According to the speaker, the canal closed mainly because of", ["competition from the railways", "damage caused by bad weather", "a fall in demand for coal"], "B", 'The speaker says "What actually finished it was a breach near Ellerby, where the bank collapsed after a winter of heavy rain."'),
    choice(12, "What has contributed most to the restoration?", ["grants", "fundraising events", "unpaid work"], "C", 'Grants covered "around a third", but "What has really made the difference is volunteer labour."'),
    choice(13, "The main cause of delay has been", ["obtaining official permission", "a shortage of money", "the removal of silt"], "A", 'The speaker says the main delay "has been the planning and environmental approvals."'),
    choice(14, "The Trust's priority for the next five years is to", ["extend the canal westwards", "build a visitor centre", "ensure a reliable supply of water"], "C", 'The board agreed "what matters most is securing the water supply".'),
    match(15, "Bramley Lock", FEATURES, "C", 'The original stone was gone, and the gates are "operated hydraulically, at the touch of a button".'),
    match(16, "Ellerby Aqueduct", FEATURES, "A", 'The planners insisted "that the aqueduct be rebuilt using the original stone".'),
    match(17, "Toll House", FEATURES, "B", 'It is no longer the office: "the Toll House has become our training base."'),
    match(18, "Haddon Tunnel", FEATURES, "F", 'Because of the bats, "the tunnel is closed to boats and walkers from November to March".'),
    match(19, "Carver's Wharf", FEATURES, "E", 'The council gave the land, "but the work itself was paid for entirely by a group of businesses in the town".'),
    match(20, "Lock Keeper's Cottage", FEATURES, "G", 'Upstairs "there\'s a small exhibition about the lives of the people who worked on the canal".'),
  ],
};

const VIEWS = [
  { value: "A", label: "A. Lena only" },
  { value: "B", label: "B. Omar only" },
  { value: "C", label: "C. both Lena and Omar" },
];

const part3: ItemGroup = {
  id: "lg-3",
  partNumber: 3,
  title: "Part 3 — Tutorial on a dissertation about behavioural 'nudges'",
  stimulusKind: "audio",
  instructions:
    "Questions 21-30. Choose the correct letter for Questions 21-25. For Questions 26-30, decide who expresses each view: A Lena only, B Omar only, or C both Lena and Omar.",
  transcript: `PROF GRANT: Right, Lena, Omar, thanks for coming. You've sent me a joint proposal on nudges in pension saving. Before we get into detail, tell me in a sentence what you're actually trying to find out.
LENA: We started with the question of whether automatic enrolment increases saving, but that's been answered many times. So what we're really asking is whether the effect lasts, whether people who were enrolled by default are still saving at the same rate five or ten years later.
PROF GRANT: Persistence, then, not the initial effect. Good, that's a much better question. Where's your data coming from?
OMAR: We'd hoped to run our own survey, but realistically we'd never get the sample size. Then we looked at government statistics, but they're only published in aggregate. What we've managed to get is access to an anonymised dataset from a large employer's pension provider, covering about forty thousand employees over twelve years.
PROF GRANT: That's a real coup. Has the ethics committee approved it?
LENA: Provisionally. They want us to confirm how the data will be stored before final approval.
PROF GRANT: Fine. Now, I read your literature review, and frankly it's thorough, perhaps too thorough. The issue isn't that you've missed anything important, and the writing is clear. The problem is that you summarise each study in turn without ever saying how they relate to each other. I want to see you comparing and evaluating, not listing.
OMAR: So we should organise it by theme rather than by author?
PROF GRANT: Exactly. Now, the critics. You mention that nudges have been accused of being manipulative. What's your position?
OMAR: I'm honestly not sure the manipulation argument holds up. You can always opt out of a default, so nobody's choice is being removed.
LENA: I'd go further than that, actually. The alternative to a default isn't neutrality. There's always some default, even if it's not enrolling. So the question is only which default is set.
PROF GRANT: That's a well-known argument. But you might also consider that people rarely notice a default, which is the whole reason it works.
LENA: That's fair. I still think it's justified when the default clearly serves people's interests.
PROF GRANT: And methodology. Why not a randomised trial?
OMAR: The employer changed its policy in a single year, so we can compare people hired just before and just after. It's not randomised, but it's close.
PROF GRANT: A natural experiment. Good. Just be careful about what else changed that year.
PROF GRANT: Finally, which journal articles will you lean on most? You cite Madrian and Shea a great deal.
LENA: Their study is the foundation, but it only covers about a year. The paper we'll rely on most is the Danish one by Chetty and colleagues, because it follows people for much longer.
PROF GRANT: Sensible. Now, before you go, let's talk about the risks to the project. Talk me through what each of you is worried about.
OMAR: For me, it's the data. Twelve years sounds like a lot, but people change jobs, so a lot of them will drop out of the records. If too many leave, we can't really say anything about persistence.
LENA: I'm worried about that too, yes. Attrition is a genuine risk for both of us. The other thing on my mind is the word limit. There's so much we could say about the policy implications that I can see us running over.
OMAR: I'm less concerned about that. We can always move material into an appendix.
PROF GRANT: What about the statistical side? Panel data can be tricky.
OMAR: That doesn't worry me. I took the advanced econometrics module last year, and we used this kind of model all the time.
LENA: I haven't done that module, so I'll need to read up, but between us I think we're covered.
PROF GRANT: And the timetable?
LENA: I think we're fine for time, provided the ethics approval comes through this month.
OMAR: Agreed. The real pressure point is getting the dataset cleaned. I'd say that will take at least six weeks, and I think we've both underestimated it so far.
LENA: Yes, I'd accept that. We probably have.
PROF GRANT: Good. Honesty about that now will save you a lot of trouble later. Let's meet again in a fortnight.`,
  questions: [
    choice(21, "What is the main research question of the dissertation?", ["whether automatic enrolment increases saving", "whether the effect of automatic enrolment is long-lasting", "why some employees opt out of pension schemes"], "B", 'Lena says they are asking "whether the effect lasts", and the professor sums it up as "Persistence, then, not the initial effect."'),
    choice(22, "The students will obtain their data from", ["their own survey", "published government statistics", "a pension provider"], "C", 'Omar says they have "access to an anonymised dataset from a large employer\'s pension provider".'),
    choice(23, "What is Professor Grant's criticism of the literature review?", ["It leaves out key studies.", "It describes studies without connecting them.", "It is not clearly written."], "B", 'He says "you summarise each study in turn without ever saying how they relate to each other."'),
    choice(24, "Why do the students not use a randomised trial?", ["The ethics committee would not allow it.", "A policy change provides a comparable situation.", "The employer refused to take part."], "B", 'Omar explains "The employer changed its policy in a single year, so we can compare people hired just before and just after."'),
    choice(25, "Which study will the students depend on most?", ["one that covers a longer period", "the original study of automatic enrolment", "one that uses a randomised design"], "A", 'Lena says they will "rely on most" the Danish paper "because it follows people for much longer."'),
    match(26, "Default options are not necessarily manipulative.", VIEWS, "C", 'Omar is "not sure the manipulation argument holds up" and Lena says "I\'d go further than that, actually."'),
    match(27, "Many people may disappear from the dataset.", VIEWS, "C", 'Omar fears people "will drop out of the records" and Lena says "Attrition is a genuine risk for both of us."'),
    match(28, "Keeping within the word limit could be a problem.", VIEWS, "A", 'Lena worries "I can see us running over", but Omar says "I\'m less concerned about that."'),
    match(29, "The statistical analysis will not be difficult.", VIEWS, "B", 'Omar says "That doesn\'t worry me", while Lena says she will "need to read up".'),
    match(30, "Preparing the data will take longer than expected.", VIEWS, "C", 'Omar says "we\'ve both underestimated it so far" and Lena agrees, "Yes, I\'d accept that. We probably have."'),
  ],
};

const part4: ItemGroup = {
  id: "lg-4",
  partNumber: 4,
  title: "Part 4 — Lecture: life around deep-sea hydrothermal vents",
  stimulusKind: "audio",
  instructions:
    "Questions 31-40. Complete the notes below. Write ONE WORD ONLY for each answer.",
  transcript: `LECTURER: Good morning. Today we turn to one of the most significant discoveries in twentieth-century biology, the ecosystems that surround hydrothermal vents on the deep ocean floor, and what they have done to our ideas about where life can exist.
LECTURER: Hydrothermal vents form along mid-ocean ridges, where tectonic plates are pulling apart. Seawater seeps down through cracks in the crust, is heated by magma beneath, and rises again carrying dissolved minerals. When this superheated fluid, which can exceed four hundred degrees Celsius, meets the near-freezing water of the deep sea, the minerals precipitate out and build tall chimneys. The darkest of these are known as black smokers, the colour coming from iron sulphide particles.
LECTURER: The vents themselves were predicted by geologists before they were observed. What nobody predicted was the life around them. In 1977, a team diving in the submersible Alvin near the Galápagos Islands went down expecting to measure water temperature and chemistry. They had brought no biologists at all. What they found were dense communities of clams, mussels and, most strikingly, giant tube worms more than two metres long.
LECTURER: The puzzle was obvious. At these depths there is no sunlight, so there can be no photosynthesis. Until then it had been assumed that virtually all life on Earth ultimately depended on the sun, with the deep sea surviving on a slow rain of organic debris from above. That debris is far too sparse to support communities this dense.
LECTURER: The answer turned out to be chemosynthesis. Certain bacteria are able to obtain energy by oxidising hydrogen sulphide, the chemical that gives the vent fluid its smell of rotten eggs, and they use that energy to make organic compounds from carbon dioxide. These bacteria are the primary producers of the vent ecosystem, playing the role that plants play on land.
LECTURER: The giant tube worm, Riftia, illustrates this beautifully. As an adult it has no mouth and no gut. Instead, it has an organ called the trophosome, packed with billions of symbiotic bacteria. The worm's bright red plume, which gets its colour from a specialised form of haemoglobin, absorbs sulphide and oxygen from the water and delivers them to the bacteria, which in return supply the worm with food. It's a partnership so complete that neither can survive without the other.
LECTURER: Vent communities are also remarkably unstable. A vent may remain active for only a few decades before the flow of fluid shifts or stops, and when it does, the community around it dies. This raises a question that occupied researchers for years: how do animals colonise new vents, which may be hundreds of kilometres apart? The current view is that their larvae drift in deep ocean currents, sometimes for weeks, and that only a tiny proportion happen to settle at a new site.
LECTURER: One recent finding concerns a snail found in the Indian Ocean, which has gone a step further than most vent animals. It builds scales on its foot out of iron sulphide drawn from the vent fluid, effectively a coat of metal armour. Engineers have studied the structure of these scales because of its ability to absorb impacts.
LECTURER: Why does all this matter beyond biology? Partly because of the origin of life. Some researchers argue that life on Earth may have begun not in a warm surface pool, as Darwin suggested, but around vents like these, where chemical energy was plentiful. And partly because of the search for life elsewhere. Jupiter's moon Europa and Saturn's moon Enceladus both appear to have liquid oceans beneath their ice, and there is evidence of vent activity on Enceladus in particular.
LECTURER: Finally, a note of concern. Many vent fields contain valuable metals such as copper, zinc and gold, and several companies have applied for licences to mine them. Because vent species are often found nowhere else, scientists have called for a moratorium on mining until the ecosystems are better understood.
LECTURER: That's all for today. Next week we'll look at cold seeps, which are related but rather different.`,
  questions: [
    gap(31, "note_completion", "Vents form where tectonic plates are separating along mid-ocean ______", ["ridges"], 'The lecturer says "Hydrothermal vents form along mid-ocean ridges".', 1),
    gap(32, "note_completion", "Black smokers get their colour from particles of iron ______", ["sulphide", "sulfide"], 'He says "the colour coming from iron sulphide particles."', 1),
    gap(33, "note_completion", "The 1977 Alvin expedition included no ______", ["biologists"], 'The team "had brought no biologists at all."', 1),
    gap(34, "note_completion", "Before 1977, deep-sea life was thought to depend on organic ______ falling from above", ["debris"], 'It was assumed the deep sea survived "on a slow rain of organic debris from above."', 1),
    gap(35, "note_completion", "Vent bacteria gain energy by oxidising hydrogen ______", ["sulphide", "sulfide"], 'Bacteria "obtain energy by oxidising hydrogen sulphide".', 1),
    gap(36, "note_completion", "Adult Riftia lacks a mouth and a ______", ["gut"], 'As an adult it "has no mouth and no gut."', 1),
    gap(37, "note_completion", "The red plume contains a special form of ______", ["haemoglobin", "hemoglobin"], 'The plume "gets its colour from a specialised form of haemoglobin".', 1),
    gap(38, "note_completion", "New vents are colonised by ______ carried in ocean currents", ["larvae"], 'The current view is "that their larvae drift in deep ocean currents".', 1),
    gap(39, "note_completion", "An Indian Ocean snail has iron scales on its ______", ["foot"], 'The snail "builds scales on its foot out of iron sulphide".', 1),
    gap(40, "note_completion", "Scientists have called for a ______ on mining vent fields", ["moratorium"], 'Scientists "have called for a moratorium on mining until the ecosystems are better understood."', 1),
  ],
};

export const listeningSection: Section = {
  code: "listening",
  title: "Listening",
  durationMinutes: 30,
  questionCount: 40,
  itemGroups: [part1, part2, part3, part4],
};
