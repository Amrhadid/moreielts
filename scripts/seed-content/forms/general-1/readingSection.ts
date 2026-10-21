import type { ItemGroup, Question, QuestionOption, QuestionTypeCode, Section } from "../../../../src/types/content";

/**
 * General Training Reading: 40 questions, 60 minutes.
 * Section 1 = two everyday texts, Section 2 = one workplace text,
 * Section 3 = one longer general-interest passage.
 */

function gap(
  number: number,
  type: QuestionTypeCode,
  prompt: string,
  answers: string[],
  explanation: string,
  wordLimit = 2,
): Question {
  return { id: `r-q${number}`, number, type, prompt, acceptedAnswers: answers, wordLimit, explanation };
}

function pick(
  number: number,
  type: QuestionTypeCode,
  prompt: string,
  options: QuestionOption[],
  answer: string,
  explanation: string,
): Question {
  return { id: `r-q${number}`, number, type, prompt, options, acceptedAnswers: [answer], explanation };
}

function letters(labels: string[]): QuestionOption[] {
  return labels.map((label, i) => ({
    value: String.fromCharCode(65 + i),
    label: `${String.fromCharCode(65 + i)}. ${label}`,
  }));
}

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

const CLASSES: QuestionOption[] = [
  { value: "A", label: "A. Spice Route Kitchen" },
  { value: "B", label: "B. The Weekend Baker" },
  { value: "C", label: "C. Fresh Start Cooking" },
  { value: "D", label: "D. Green Table" },
  { value: "E", label: "E. Knife Skills Masterclass" },
];

const HEADINGS: QuestionOption[] = [
  { value: "i", label: "i. Before your first day" },
  { value: "ii", label: "ii. Keeping yourself and others safe" },
  { value: "iii", label: "iii. Getting paid" },
  { value: "iv", label: "iv. Opportunities for promotion" },
  { value: "v", label: "v. Who to ask for help" },
  { value: "vi", label: "vi. When you cannot come to work" },
  { value: "vii", label: "vii. Looking the part" },
  { value: "viii", label: "viii. Social events for staff" },
];

const text1: ItemGroup = {
  id: "rg-1",
  partNumber: 1,
  title: "Section 1 — Westfield Leisure Centre: changes to opening hours",
  stimulusKind: "passage",
  instructions:
    "Questions 1-7. Read the notice below. Do the following statements agree with the information given? Write TRUE, FALSE or NOT GIVEN.",
  passageText: [
    "WESTFIELD LEISURE CENTRE — IMPORTANT NOTICE TO ALL MEMBERS",
    "From Monday 3 March the main pool will close for six weeks while the changing rooms are refurbished. During this time the learner pool will remain open, and adult lane swimming will move there from 6.30 am to 8.30 am on weekdays only.",
    "Swimming lessons for children will continue as normal in the learner pool. Parents are reminded that children under eight must be accompanied in the water by an adult at all times outside lessons.",
    "The gym and fitness studios are not affected and will keep their usual hours (6 am to 10 pm, Monday to Friday; 8 am to 6 pm at weekends). Temporary changing facilities will be available in the sports hall. Please note that these have no showers, so members may wish to shower at home.",
    "Members who use only the main pool may freeze their membership during the closure at no cost. To do this, speak to a member of staff at reception; requests cannot be made online. Frozen memberships will restart automatically when the pool reopens.",
    "The café will offer a 10% discount to all members throughout the refurbishment as a thank-you for your patience. We apologise for any inconvenience.",
  ].join("\n\n"),
  questions: [
    pick(1, "true_false_notgiven", "The main pool will be closed for more than a month.", TFNG, "TRUE", 'The notice says "the main pool will close for six weeks", which is more than a month.'),
    pick(2, "true_false_notgiven", "Adult lane swimming will be available at weekends during the closure.", TFNG, "FALSE", 'Lane swimming moves to the learner pool "on weekdays only."'),
    pick(3, "true_false_notgiven", "Children's swimming lessons will be cancelled during the work.", TFNG, "FALSE", 'The notice says "Swimming lessons for children will continue as normal in the learner pool."'),
    pick(4, "true_false_notgiven", "The gym will open later than usual during the refurbishment.", TFNG, "FALSE", 'The gym is "not affected and will keep their usual hours."'),
    pick(5, "true_false_notgiven", "The temporary changing area includes showers.", TFNG, "FALSE", 'The temporary facilities "have no showers."'),
    pick(6, "true_false_notgiven", "Members can freeze their membership by visiting reception.", TFNG, "TRUE", 'Members should "speak to a member of staff at reception; requests cannot be made online."'),
    pick(7, "true_false_notgiven", "The café will extend its opening hours during the closure.", TFNG, "NOT GIVEN", 'The notice mentions only "a 10% discount" at the café, and says nothing about its opening hours.'),
  ],
};

const text2: ItemGroup = {
  id: "rg-2",
  partNumber: 2,
  title: "Section 1 — Cooking classes in the city",
  stimulusKind: "passage",
  instructions:
    "Questions 8-14. Look at the five advertisements A-E. For which class are the following statements true? Choose the correct letter, A-E. You may use any letter more than once.",
  passageText: [
    "A. Spice Route Kitchen\nDiscover the flavours of South Asia in our friendly evening classes, held every Wednesday from 7 pm. Each session ends with a shared meal at a long table. All ingredients are supplied, but please bring a container to take your leftovers home. £35 per session.",
    "B. The Weekend Baker\nSpend a Saturday morning learning to make bread, pastry and cakes with a professional baker. Classes are limited to six people so everyone receives individual attention. Children aged twelve and over are welcome with a paying adult. £60 per morning.",
    "C. Fresh Start Cooking\nNever cooked before? This six-week course for complete beginners covers the basics, from boiling an egg to roasting a chicken. Run by the city council, it is free to anyone receiving unemployment benefits, and £15 per week for others.",
    "D. Green Table\nOur plant-based cooking classes show you how to prepare tasty meals without meat or dairy. Held online, so you can join from your own kitchen. A shopping list is emailed to you a week before each class. £20 per session.",
    "E. Knife Skills Masterclass\nA single three-hour workshop for people who already cook but want to work faster and more safely. You will learn to chop, slice and fillet like a chef. Every participant takes home a professional cook's knife, included in the price of £85.",
  ].join("\n\n"),
  questions: [
    pick(8, "matching_information", "You do not need to leave home to attend this class.", CLASSES, "D", 'Green Table is "Held online, so you can join from your own kitchen."'),
    pick(9, "matching_information", "Participants receive a piece of equipment to keep.", CLASSES, "E", 'In the masterclass "Every participant takes home a professional cook\'s knife."'),
    pick(10, "matching_information", "This class is suitable for people with no cooking experience.", CLASSES, "C", 'Fresh Start is a course "for complete beginners."'),
    pick(11, "matching_information", "Some people can attend this class without paying.", CLASSES, "C", 'Fresh Start "is free to anyone receiving unemployment benefits."'),
    pick(12, "matching_information", "Participants eat together at the end of the class.", CLASSES, "A", 'At Spice Route "Each session ends with a shared meal at a long table."'),
    pick(13, "matching_information", "Young people may attend with an adult.", CLASSES, "B", 'At The Weekend Baker "Children aged twelve and over are welcome with a paying adult."'),
    pick(14, "matching_information", "Participants must buy their own ingredients.", CLASSES, "D", 'For Green Table "A shopping list is emailed to you a week before each class", whereas Spice Route says "All ingredients are supplied."'),
  ],
};

const text3: ItemGroup = {
  id: "rg-3",
  partNumber: 3,
  title: "Section 2 — Northgate Distribution: guide for new warehouse staff",
  stimulusKind: "passage",
  instructions:
    "Questions 15-20: the guide has six sections, A-F. Choose the correct heading for each section from the list of headings i-viii. Questions 21-27: complete the sentences below. Write NO MORE THAN TWO WORDS from the text for each answer.",
  passageText: [
    "A. Welcome to Northgate Distribution. Before you start, please make sure you have returned your signed contract and a copy of your bank details to the HR office. You will also need to bring photo identification on your first morning so that your security pass can be printed. Your first shift will begin with a two-hour induction in the training room on the ground floor.",
    "B. All warehouse staff must wear the high-visibility jacket and steel-toed boots provided by the company. These are issued during induction and remain company property. Personal jewellery, other than a plain wedding ring, must be removed before entering the warehouse floor. Long hair should be tied back.",
    "C. Forklift trucks operate in all areas of the warehouse, so walk only along the marked yellow pathways. Never use a mobile phone while walking on the warehouse floor. If you see a spillage, report it immediately to your shift supervisor and stay beside it to warn others until it has been cleaned up. First-aid kits are located beside every fire exit.",
    "D. Wages are paid every two weeks, on a Friday, directly into your bank account. Overtime is paid at one and a half times your normal hourly rate and must be approved in advance by your shift supervisor. Your payslip can be viewed on the staff portal, where you can also update your address.",
    "E. If you are ill and unable to attend, you must telephone the absence line at least one hour before your shift starts. Text messages and emails are not accepted. For absences of more than seven days, a doctor's note is required. Holiday requests should be made through the staff portal at least four weeks in advance.",
    "F. Your shift supervisor is your first point of contact for any question about your work. For questions about contracts or pay, contact HR, which is open from 9 am to 5 pm on weekdays. Every new employee is also given a buddy, an experienced colleague who will work alongside you during your first fortnight.",
  ].join("\n\n"),
  questions: [
    pick(15, "matching_headings", "Section A", HEADINGS, "i", 'Section A lists what to do "Before you start", such as returning "your signed contract."'),
    pick(16, "matching_headings", "Section B", HEADINGS, "vii", 'Section B covers clothing: staff "must wear the high-visibility jacket and steel-toed boots."'),
    pick(17, "matching_headings", "Section C", HEADINGS, "ii", 'Section C is about safety: "walk only along the marked yellow pathways" and report spillages.'),
    pick(18, "matching_headings", "Section D", HEADINGS, "iii", 'Section D explains that "Wages are paid every two weeks, on a Friday."'),
    pick(19, "matching_headings", "Section E", HEADINGS, "vi", 'Section E covers absence: "If you are ill and unable to attend, you must telephone the absence line."'),
    pick(20, "matching_headings", "Section F", HEADINGS, "v", 'Section F says "Your shift supervisor is your first point of contact for any question."'),
    gap(21, "sentence_completion", "New staff need ______ on their first morning so a security pass can be made.", ["photo identification"], 'Staff must "bring photo identification on your first morning so that your security pass can be printed."'),
    gap(22, "sentence_completion", "The induction takes place in the ______.", ["training room"], 'The first shift begins "with a two-hour induction in the training room."'),
    gap(23, "sentence_completion", "The only jewellery allowed on the warehouse floor is a plain ______.", ["wedding ring"], 'Jewellery, "other than a plain wedding ring, must be removed."'),
    gap(24, "sentence_completion", "First-aid kits can be found next to each ______.", ["fire exit"], 'The guide says "First-aid kits are located beside every fire exit."'),
    gap(25, "sentence_completion", "Overtime must be approved beforehand by the ______.", ["shift supervisor", "supervisor"], 'Overtime "must be approved in advance by your shift supervisor."'),
    gap(26, "sentence_completion", "Staff who are absent for over a week must provide a ______.", ["doctor's note"], '"For absences of more than seven days, a doctor\'s note is required."'),
    gap(27, "sentence_completion", "During their first two weeks, new staff work with a ______.", ["buddy"], 'Each new employee "is also given a buddy, an experienced colleague who will work alongside you during your first fortnight."', 1),
  ],
};

const text4: ItemGroup = {
  id: "rg-4",
  partNumber: 4,
  title: "Section 3 — The quiet comeback of the repair shop",
  stimulusKind: "passage",
  instructions:
    "Questions 28-40. Read the passage below. Questions 28-32: choose the correct letter, A, B, C or D. Questions 33-36: do the statements agree with the views of the writer? Write YES, NO or NOT GIVEN. Questions 37-40: complete the summary using ONE WORD ONLY from the passage.",
  passageText: [
    "Walk down almost any high street fifty years ago and you would have found a shoe repairer, a watchmender and a shop that fixed radios and televisions. Repair was simply part of ordinary life. When a kettle stopped working, the obvious thing to do was to take it to someone who could mend it. By the end of the twentieth century, most of those shops had disappeared. Manufactured goods had become so cheap that buying a new toaster often cost less than paying someone to repair the old one, and many products were designed in ways that made repair difficult or impossible.",
    "Yet in the past decade something unexpected has happened. In towns and cities across Europe and North America, repair is making a comeback. Some of this activity takes the form of traditional businesses, but much of it is happening in a newer and more informal setting: the repair café. The first repair café was organised in Amsterdam in 2009 by a journalist, Martine Postma, who wanted to do something practical about waste. The idea was simple. Once a month, in a community hall, volunteers with practical skills would sit at tables with their tools, and members of the public would bring in broken items to be fixed for free. Today there are more than two thousand repair cafés worldwide.",
    "What is striking about these events is that they are not only about fixing things. Visitors are expected to stay with their item and watch, or even help, while it is repaired. The aim is to pass on knowledge, so that next time the owner might be able to do the job themselves. Many volunteers say that this teaching is the most rewarding part of the experience. As one retired electrician put it, 'Anyone can replace a fuse. What I enjoy is the look on someone's face when they realise they could have done it all along.'",
    "The success of repair cafés reflects a wider change in attitudes. Surveys suggest that younger consumers in particular are increasingly uncomfortable with the idea of throwing things away. Concern about the environment is part of the explanation: electronic waste is now one of the fastest-growing kinds of rubbish, and much of it contains valuable metals that are rarely recovered. But money matters too. During periods of rising prices, people are more willing to extend the life of what they already own.",
    "Governments have started to take notice. Several countries have introduced what are known as 'right to repair' laws, which require manufacturers of certain products, such as washing machines and refrigerators, to make spare parts available for a number of years after a model is sold. Some laws also require that products can be opened with ordinary tools rather than special ones that only the manufacturer possesses. France has gone further, requiring sellers of some electronic goods to display a repairability score, from one to ten, so that shoppers can compare products before they buy.",
    "Not everyone is enthusiastic. Some manufacturers argue that allowing untrained people to open devices raises safety concerns, particularly with products containing powerful batteries. Others point out that making products easy to take apart can make them heavier or more expensive. These arguments are not without merit, but in my view they are frequently exaggerated. Many of the design features that prevent repair, such as glued-in batteries, exist mainly to make products thinner or cheaper to assemble, not to protect the user.",
    "There are also practical limits to what repair cafés can achieve. Volunteers are often older people whose skills were learned on simpler machines, and modern electronics, with their tiny components and specialist software, can defeat even the most experienced fixer. Some cafés have responded by recruiting younger volunteers who are comfortable with smartphones and laptops, and by sharing repair guides online.",
    "Whether repair will ever return to the central place it once held in daily life is uncertain. Manufactured goods remain cheap, and convenience is a powerful force. But the repair movement has already achieved something important. It has reminded large numbers of people that the objects around them are not mysterious, and that a broken thing is not necessarily a finished one. That change of attitude may turn out to matter more than any number of mended kettles.",
    "Perhaps the most hopeful sign is how ordinary repair has begun to seem again. Libraries lend tools, schools run workshops where pupils take apart old radios, and online videos show millions of viewers how to replace a cracked phone screen or a worn bicycle chain. None of this will bring back the high street of fifty years ago, but it suggests that the habit of fixing things has not been lost, only forgotten for a while.",
  ].join("\n\n"),
  questions: [
    pick(28, "multiple_choice_single", "According to the writer, why did many repair shops close?", letters(["Customers no longer trusted repairers.", "New goods were often cheaper than repairs.", "Repairers retired without training others.", "High street rents increased sharply."]), "B", 'The writer says "buying a new toaster often cost less than paying someone to repair the old one."'),
    pick(29, "multiple_choice_single", "Martine Postma started the first repair café because she wanted to", letters(["write a newspaper story", "create jobs for volunteers", "take practical action on waste", "raise money for a community hall"]), "C", 'Postma "wanted to do something practical about waste."'),
    pick(30, "multiple_choice_single", "Visitors to a repair café are expected to", letters(["leave their item for collection later", "pay a small fee for parts", "stay and learn from the repair", "bring their own tools"]), "C", 'Visitors "are expected to stay with their item and watch, or even help", because "The aim is to pass on knowledge."'),
    pick(31, "multiple_choice_single", "The retired electrician enjoys", letters(["solving difficult technical problems", "showing people they are capable", "replacing parts quickly", "meeting other volunteers"]), "B", 'He enjoys "the look on someone\'s face when they realise they could have done it all along."'),
    pick(32, "multiple_choice_single", "In France, some electronic goods must show", letters(["the cost of spare parts", "the expected lifetime of the product", "a score for how easy they are to repair", "the nearest repair café"]), "C", 'France requires sellers "to display a repairability score, from one to ten."'),
    pick(33, "yes_no_notgiven", "Younger consumers are more comfortable throwing things away than older consumers.", YNNG, "NO", 'The writer says "younger consumers in particular are increasingly uncomfortable with the idea of throwing things away."'),
    pick(34, "yes_no_notgiven", "Manufacturers' safety concerns are often overstated.", YNNG, "YES", 'The writer says "in my view they are frequently exaggerated."'),
    pick(35, "yes_no_notgiven", "Glued-in batteries are mainly intended to protect the user.", YNNG, "NO", 'Such features "exist mainly to make products thinner or cheaper to assemble, not to protect the user."'),
    pick(36, "yes_no_notgiven", "Repair cafés should receive funding from local councils.", YNNG, "NOT GIVEN", 'The writer discusses "right to repair" laws but gives no view on councils funding repair cafés.'),
    gap(37, "summary_completion", "Electronic waste often contains valuable ______ that are seldom recovered.", ["metals"], 'Much electronic waste "contains valuable metals that are rarely recovered."', 1),
    gap(38, "summary_completion", "Right to repair laws require manufacturers to supply spare ______ for several years.", ["parts"], 'The laws require manufacturers "to make spare parts available for a number of years."', 1),
    gap(39, "summary_completion", "Many volunteers learned their skills on ______ machines.", ["simpler"], 'Volunteers\' "skills were learned on simpler machines."', 1),
    gap(40, "summary_completion", "Some cafés now share repair ______ online.", ["guides"], 'Some cafés responded "by sharing repair guides online."', 1),
  ],
};

export const readingSection: Section = {
  code: "reading",
  title: "Reading",
  durationMinutes: 60,
  questionCount: 40,
  itemGroups: [text1, text2, text3, text4],
};
