import type { ItemGroup, Question, QuestionOption, QuestionTypeCode, Section } from "../../../../src/types/content";

/**
 * Mock General Training Reading: 40 questions, 60 minutes.
 * Section 1 = two everyday texts, Section 2 = two workplace texts,
 * Section 3 = one long general-interest passage.
 */

function gap(
  number: number,
  type: QuestionTypeCode,
  prompt: string,
  answers: string[],
  explanation: string,
  wordLimit = 3,
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

const SHOPS = letters(["Second Life Furniture", "The Oak Barn", "Restore", "Upstairs Downstairs", "Hartley's Auction Rooms"]);

const PEOPLE = letters(["Allen Lane", "George Orwell", "Kurt Enoch", "Richard Hoggart"]);

const text1: ItemGroup = {
  id: "rg-1",
  partNumber: 1,
  title: "Section 1 — Kingsway Dental Practice: information for new patients",
  stimulusKind: "passage",
  instructions:
    "Questions 1-7. Answer the questions below. Write NO MORE THAN THREE WORDS AND/OR A NUMBER from the text for each answer.",
  passageText: [
    `KINGSWAY DENTAL PRACTICE — WELCOME TO NEW PATIENTS`,
    `Registering\nTo register, please complete the medical history form on our website and bring photo identification to your first appointment. Children under 16 must be registered by a parent or guardian.`,
    `Opening hours\nThe practice is open from 8 am to 6 pm, Monday to Friday, and from 9 am to 1 pm on Saturdays. On Wednesdays we stay open until 8 pm for patients who cannot visit during working hours.`,
    `Appointments\nYour first visit will be a full check-up lasting about 40 minutes. After that, most patients are seen every six months. We will send you a text message reminder two days before each appointment.`,
    `Cancellations\nIf you cannot attend, please let us know at least 24 hours in advance. Patients who miss two appointments without telling us may be removed from our list.`,
    `Emergencies\nIf you have severe pain or an injury to your teeth, call us as early as possible in the morning; we keep a number of emergency appointments free each day. Outside opening hours, please phone the NHS helpline on 111.`,
    `Getting here\nThe practice is on the first floor, above the pharmacy. There is a lift for patients who need it. The nearest car park is behind the library on Mount Street.`,
  ].join("\n\n"),
  questions: [
    gap(1, "short_answer", "What must new patients bring to their first appointment?", ["photo identification", "photo ID"], `Patients should "bring photo identification to your first appointment."`),
    gap(2, "short_answer", "Who must register patients under the age of 16?", ["parent or guardian", "a parent", "a guardian"], `"Children under 16 must be registered by a parent or guardian."`),
    gap(3, "short_answer", "On which day is the practice open in the evening?", ["Wednesday", "Wednesdays"], `"On Wednesdays we stay open until 8 pm".`),
    gap(4, "short_answer", "How long does the first check-up take?", ["40 minutes", "about 40 minutes"], `The first visit is "a full check-up lasting about 40 minutes."`),
    gap(5, "short_answer", "How do patients receive a reminder about an appointment?", ["text message", "a text message", "by text message"], `"We will send you a text message reminder two days before each appointment."`),
    gap(6, "short_answer", "What number should patients phone for help when the practice is closed?", ["111"], `"Outside opening hours, please phone the NHS helpline on 111."`),
    gap(7, "short_answer", "What is directly below the practice?", ["the pharmacy", "pharmacy", "a pharmacy"], `"The practice is on the first floor, above the pharmacy."`),
  ],
};

const text2: ItemGroup = {
  id: "rg-2",
  partNumber: 2,
  title: "Section 1 — Second-hand furniture in Eastford",
  stimulusKind: "passage",
  instructions:
    "Questions 8-14. Look at the descriptions of five furniture shops, A-E. Which shop matches each statement? You may use any letter more than once.",
  passageText: [
    `WHERE TO BUY SECOND-HAND FURNITURE IN EASTFORD`,
    `A  Second Life Furniture\nRun by a homelessness charity, Second Life sells donated furniture at very low prices, and all profits go to helping people find homes. It will collect unwanted furniture from your home free of charge, but please note that sofas and armchairs must carry a fire safety label.`,
    `B  The Oak Barn\nThis family business specialises in solid wooden tables, chairs and wardrobes, many of them over a hundred years old. Every item is cleaned and repaired in the workshop behind the shop, and comes with a twelve-month guarantee. Prices are higher than elsewhere, but the quality is excellent.`,
    `C  Restore\nRestore takes old furniture and gives it a new look, painting tired chests of drawers in bright colours and covering chairs in new fabric. It also runs Saturday workshops where you can learn to restore a piece of your own.`,
    `D  Upstairs Downstairs\nThe largest of Eastford's second-hand shops, Upstairs Downstairs fills two floors of a former cinema. It sells everything from office desks to children's beds. Delivery within ten miles costs £15, and the shop is open seven days a week.`,
    `E  Hartley's Auction Rooms\nAt Hartley's you will not pay a fixed price: furniture is sold to the highest bidder at auctions every Thursday. Items can be viewed on the Wednesday before each sale, and you can bid online if you cannot attend in person.`,
  ].join("\n\n"),
  questions: [
    pick(8, "matching_information", "This shop gives its profits to people in need.", SHOPS, "A", `At Second Life "all profits go to helping people find homes."`),
    pick(9, "matching_information", "Customers can learn how to improve furniture themselves.", SHOPS, "C", `Restore "runs Saturday workshops where you can learn to restore a piece of your own."`),
    pick(10, "matching_information", "Prices are decided by buyers competing with each other.", SHOPS, "E", `At Hartley's "furniture is sold to the highest bidder".`),
    pick(11, "matching_information", "This shop offers a guarantee on what it sells.", SHOPS, "B", `Every item at The Oak Barn "comes with a twelve-month guarantee."`),
    pick(12, "matching_information", "This shop is open every day.", SHOPS, "D", `Upstairs Downstairs is "open seven days a week."`),
    pick(13, "matching_information", "This shop will take away furniture you no longer want.", SHOPS, "A", `Second Life "will collect unwanted furniture from your home free of charge".`),
    pick(14, "matching_information", "This shop's building was once used for a different purpose.", SHOPS, "D", `Upstairs Downstairs "fills two floors of a former cinema."`),
  ],
};

const text3: ItemGroup = {
  id: "rg-3",
  partNumber: 3,
  title: "Section 2 — Volunteering leave: a guide for employees",
  stimulusKind: "passage",
  instructions:
    "Questions 15-21. Read the text below. Do the following statements agree with the information given? Write TRUE, FALSE or NOT GIVEN.",
  passageText: [
    `BRAMLEY INSURANCE — VOLUNTEERING LEAVE POLICY`,
    `Bramley Insurance encourages all staff to take part in volunteering in their local community. To support this, every employee is entitled to two days of paid volunteering leave each year, in addition to their normal holiday allowance. Part-time staff receive the same entitlement in proportion to the hours they work.`,
    `The leave can be used for any registered charity, school or community group. It cannot be used for activities connected with a political party, or for work that benefits a member of your own family.`,
    `Volunteering leave may be taken as whole days or as half days. Requests should be made through the HR system at least two weeks in advance, and must be agreed by your line manager, who will consider the needs of your team. Managers should not refuse a request without a good business reason.`,
    `Unused volunteering leave cannot be carried over into the next year, and it cannot be exchanged for payment.`,
    `In addition to individual leave, each department may organise one team volunteering day a year. Recent team days have included painting a community centre and helping at a food bank. Ideas for team days should be sent to the Community Committee, which meets every two months.`,
    `After your volunteering, we would love to hear about it. Photographs and short reports can be sent to the internal communications team for inclusion in the staff magazine.`,
  ].join("\n\n"),
  questions: [
    pick(15, "true_false_notgiven", "Volunteering leave is taken from employees' normal holiday allowance.", TFNG, "FALSE", `The leave is "in addition to their normal holiday allowance."`),
    pick(16, "true_false_notgiven", "Part-time employees are not entitled to volunteering leave.", TFNG, "FALSE", `"Part-time staff receive the same entitlement in proportion to the hours they work."`),
    pick(17, "true_false_notgiven", "Staff may use the leave to help a relative.", TFNG, "FALSE", `It cannot be used "for work that benefits a member of your own family."`),
    pick(18, "true_false_notgiven", "Employees can take volunteering leave in half days.", TFNG, "TRUE", `"Volunteering leave may be taken as whole days or as half days."`),
    pick(19, "true_false_notgiven", "Most employees use all of their volunteering leave each year.", TFNG, "NOT GIVEN", `The text says unused leave "cannot be carried over into the next year" but does not say how many staff use it all.`),
    pick(20, "true_false_notgiven", "Each department can organise one team volunteering day per year.", TFNG, "TRUE", `"each department may organise one team volunteering day a year."`),
    pick(21, "true_false_notgiven", "The Community Committee chooses which charities receive company donations.", TFNG, "NOT GIVEN", `The committee receives "Ideas for team days" and "meets every two months"; nothing is said about donations.`),
  ],
};

const text4: ItemGroup = {
  id: "rg-4",
  partNumber: 4,
  title: "Section 2 — Getting the most from your annual review",
  stimulusKind: "passage",
  instructions:
    "Questions 22-27. Complete the notes below. Write ONE WORD ONLY from the text for each answer.",
  passageText: [
    `PREPARING FOR YOUR ANNUAL PERFORMANCE REVIEW`,
    `Your annual review is a chance to look back at your achievements over the past year and to plan for the year ahead. It is a two-way conversation, not a test, and it works best when both you and your manager have prepared for it.`,
    `Before the meeting\nAbout two weeks before your review, you will receive a self-assessment form. Use it to list your main achievements and any difficulties you have faced. It is helpful to include evidence, such as feedback from customers or figures that show the results of your work. Return the form to your manager at least three days before the meeting, so that they have time to read it.`,
    `During the meeting\nYour manager will discuss your self-assessment and share their own view of your performance. Try to listen to any criticism calmly; if you disagree, explain why, giving examples. The meeting is also the right time to raise any concerns about your workload.`,
    `Setting objectives\nTogether, you will agree three to five objectives for the coming year. Good objectives are specific and measurable, so that both of you will know at the end of the year whether they have been achieved. You should also discuss any training that would help you to meet them.`,
    `After the meeting\nYour manager will write a summary of the discussion and send it to you within ten working days. Read it carefully, and if you think anything important has been left out, you can add your own comments before signing it. A copy is then kept on your personnel file.`,
  ].join("\n\n"),
  questions: [
    gap(22, "note_completion", "The review is a two-way conversation, not a ______.", ["test"], `The review "is a two-way conversation, not a test".`, 1),
    gap(23, "note_completion", "On the self-assessment form, include ______ such as customer feedback.", ["evidence"], `"It is helpful to include evidence, such as feedback from customers".`, 1),
    gap(24, "note_completion", "If you disagree with criticism, give ______.", ["examples"], `"if you disagree, explain why, giving examples."`, 1),
    gap(25, "note_completion", "The meeting is a good time to discuss concerns about your ______.", ["workload"], `It is "the right time to raise any concerns about your workload."`, 1),
    gap(26, "note_completion", "Objectives should be specific and ______.", ["measurable"], `"Good objectives are specific and measurable".`, 1),
    gap(27, "note_completion", "Before signing the summary, you can add your own ______.", ["comments"], `"you can add your own comments before signing it."`, 1),
  ],
};

const text5: ItemGroup = {
  id: "rg-5",
  partNumber: 5,
  title: "Section 3 — The paperback revolution",
  stimulusKind: "passage",
  instructions:
    "Questions 28-31: choose the correct letter, A, B, C or D. Questions 32-36: do the following statements agree with the views of the writer? Write YES, NO or NOT GIVEN. Questions 37-40: match each statement with the correct person, A-D.",
  passageText: [
    `THE PAPERBACK REVOLUTION`,
    `It is hard today to imagine a time when buying a book was a luxury. Yet in Britain in the early 1930s, a new novel in hardback cost around seven shillings and sixpence, a significant part of a working person's weekly wage. Most people who read regularly borrowed books from libraries or bought cheap magazines. Serious literature, for the most part, belonged to those who could afford it.`,
    `Cheap books were not new. Throughout the nineteenth century, publishers had produced inexpensive editions of popular novels, often printed on poor paper and sold at railway stations. But these were widely regarded as disposable and rather vulgar, and respected authors were reluctant to appear in them. What was missing was a cheap book that people would be proud to own.`,
    `The story usually told about how this changed begins on a railway platform. In 1934 the publisher Allen Lane was returning to London after visiting the crime writer Agatha Christie in Devon. Looking for something to read on the journey, he found nothing at the station bookstall except expensive hardbacks and cheap magazines. He decided there and then that good books should be available at the price of a packet of cigarettes. Whether or not the story is entirely true, and Lane enjoyed telling it, the business he founded the following year, Penguin Books, transformed reading in Britain.`,
    `The first ten Penguins appeared in July 1935, priced at sixpence each. They included novels by Ernest Hemingway and Agatha Christie, and they had a simple, striking design: bands of colour, with orange for fiction and green for crime, and a small drawing of a penguin. The other publishers were sceptical. To make a profit at sixpence, Lane needed to sell around seventeen thousand copies of each title, a figure most people in the trade thought impossible. The breakthrough came when the chain store Woolworths placed an order for sixty-three thousand copies. Within a year, Penguin had sold three million books.`,
    `Not everyone was pleased. Some authors feared that cheap books would reduce sales of their hardbacks and lower their income. George Orwell, reviewing some of the early titles, admitted that they were "splendid value for sixpence", but he worried that if other publishers followed Penguin's example, bookshops would be flooded with cheap books, and authors and publishers would earn less. In fact, the opposite seems to have happened. By creating millions of new readers, the paperback expanded the market for books of every kind.`,
    `Lane's most ambitious idea was Pelican, a series of non-fiction paperbacks launched in 1937 on subjects ranging from economics to astronomy. Critics predicted that ordinary readers would never buy serious books about science or history. They were wrong. Pelicans sold in huge numbers, and for many people who had left school at fourteen, they offered the only education they would receive in such subjects. The literary critic Richard Hoggart, who grew up in a poor district of Leeds, later described how these books opened up a world of ideas that would otherwise have been closed to him.`,
    `The Second World War, which might have been expected to ruin a business that depended on paper, in fact strengthened Penguin's position. Paper was rationed according to how much each publisher had used before the war, and Penguin, having printed such large quantities, received a generous share. Soldiers wanted books that were light and fitted in a pocket, and Penguin produced special editions for the armed forces.`,
    `After the war, the paperback became a permanent part of British life. Penguin continued to grow, and other publishers, many of whom had once dismissed the idea, launched paperback lists of their own. By the 1960s it was normal for a successful novel to appear in paperback a year or so after the hardback edition, and for students to buy their set texts in cheap paperback form rather than borrowing them from a library.`,
    `In the United States, paperbacks followed a somewhat different path. There the market was dominated by companies that sold through newsagents and drugstores, and they competed with eye-catching, often sensational covers. Kurt Enoch, a German-born publisher who ran Penguin's American branch before founding his own company, argued that a cheap book could be sold in the same way as any other mass-market product without lowering its quality, and he published serious literature with covers designed to compete for attention on crowded shelves.`,
    `It would be wrong to give Lane all the credit for what followed. Changes in printing technology, rising literacy and the growth of free secondary education all played their part, and in Germany, the publisher Albatross had produced attractive paperbacks, with colour-coded covers, several years before Penguin. But Lane combined these elements at the right moment, and he understood something important: that people would buy serious books if they were cheap, well designed and easy to find. In my view, that insight did more to spread reading than any government policy of the time.`,
  ].join("\n\n"),
  questions: [
    pick(28, "multiple_choice_single", "According to the writer, what was the problem with nineteenth-century cheap books?", letters(["They were sold only at railway stations.", "They were not seen as worth keeping.", "They contained mainly crime stories.", "They were too expensive for most people."]), "B", `Cheap editions "were widely regarded as disposable and rather vulgar"; what was missing was "a cheap book that people would be proud to own."`),
    pick(29, "multiple_choice_single", "What does the writer suggest about the story of Lane at the railway station?", letters(["It was invented by Agatha Christie.", "It may not be completely accurate.", "It happened after Penguin was founded.", "It is not widely known."]), "B", `The writer says "Whether or not the story is entirely true, and Lane enjoyed telling it".`),
    pick(30, "multiple_choice_single", "What made Penguin's early success possible?", letters(["support from other publishers", "a large order from a chain store", "an advertising campaign", "a low price for paper"]), "B", `"The breakthrough came when the chain store Woolworths placed an order for sixty-three thousand copies."`),
    pick(31, "multiple_choice_single", "Why did the Second World War help Penguin?", letters(["Paper was shared out according to pre-war use.", "Soldiers were given books free of charge.", "Other publishers stopped producing paperbacks.", "The government paid for special editions."]), "A", `"Paper was rationed according to how much each publisher had used before the war, and Penguin, having printed such large quantities, received a generous share."`),
    pick(32, "yes_no_notgiven", "In the early 1930s, a new hardback novel was expensive for working people.", YNNG, "YES", `A hardback cost "a significant part of a working person's weekly wage."`),
    pick(33, "yes_no_notgiven", "Orwell's fears about the effect of cheap books turned out to be justified.", YNNG, "NO", `The writer says "In fact, the opposite seems to have happened."`),
    pick(34, "yes_no_notgiven", "Pelican books were more profitable than Penguin's fiction titles.", YNNG, "NOT GIVEN", `The writer says "Pelicans sold in huge numbers" but makes no comparison of profits with fiction.`),
    pick(35, "yes_no_notgiven", "Penguin was the first publisher to use colour-coded paperback covers.", YNNG, "NO", `The writer notes that "the publisher Albatross had produced attractive paperbacks, with colour-coded covers, several years before Penguin."`),
    pick(36, "yes_no_notgiven", "Lane's understanding of readers was more important in spreading reading than government policy.", YNNG, "YES", `"In my view, that insight did more to spread reading than any government policy of the time."`),
    pick(37, "matching_features", "believed that good books should cost no more than an everyday item", PEOPLE, "A", `Lane "decided there and then that good books should be available at the price of a packet of cigarettes."`),
    pick(38, "matching_features", "thought cheap books might reduce what writers earn", PEOPLE, "B", `Orwell "worried that if other publishers followed Penguin's example" then "authors and publishers would earn less."`),
    pick(39, "matching_features", "said that inexpensive books could be marketed like other popular products", PEOPLE, "C", `Enoch "argued that a cheap book could be sold in the same way as any other mass-market product without lowering its quality".`),
    pick(40, "matching_features", "described how cheap non-fiction gave him access to new ideas", PEOPLE, "D", `Hoggart "later described how these books opened up a world of ideas that would otherwise have been closed to him."`),
  ],
};

export const readingSection: Section = {
  code: "reading",
  title: "Reading",
  durationMinutes: 60,
  questionCount: 40,
  itemGroups: [text1, text2, text3, text4, text5],
};
