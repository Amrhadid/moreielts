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

const PROVIDERS = letters(["Linkwave", "Hometel", "FibreNest", "SkyBridge", "CityConnect"]);

const HEADINGS: QuestionOption[] = [
  { value: "i", label: "i. Taking time off to study" },
  { value: "ii", label: "ii. When decisions are made" },
  { value: "iii", label: "iii. Who is eligible" },
  { value: "iv", label: "iv. Passing on your knowledge" },
  { value: "v", label: "v. What the money can be used for" },
  { value: "vi", label: "vi. Choosing a course provider" },
  { value: "vii", label: "vii. Paying the money back" },
  { value: "viii", label: "viii. Getting your manager's backing" },
];

const ENDINGS = letters([
  "allowed boxes to be handled in ports around the world.",
  "made it possible for manufacturers to use suppliers far away.",
  "have made them popular for new buildings.",
  "may reduce their benefits for the environment.",
  "led to the closure of many railways.",
  "made ships slower but safer.",
]);

const text1: ItemGroup = {
  id: "rg-1",
  partNumber: 1,
  title: "Section 1 — Hillcrest Farmers' Market: new arrangements",
  stimulusKind: "passage",
  instructions:
    "Questions 1-7. Read the notice below. Do the following statements agree with the information given? Write TRUE, FALSE or NOT GIVEN.",
  passageText: [
    `HILLCREST FARMERS' MARKET — NEW ARRANGEMENTS FROM APRIL`,
    `The market will move from the school car park to Victoria Square from Saturday 5 April. It will continue to run every Saturday from 8 am to 1 pm, and a new evening market will be held on the first Thursday of each month from 4 pm to 8 pm.`,
    `All stallholders must be based within 40 miles of Hillcrest and must sell only food they have grown, raised or made themselves. Visitors who would like to know where a product comes from are welcome to ask any stallholder.`,
    `Parking in Victoria Square itself is not permitted on market days. Free parking is available at the Station Road car park, a five-minute walk away, until 2 pm. Cyclists can use the new bike racks beside the fountain.`,
    `Dogs on short leads are welcome in the square, but they are not allowed in the covered food hall at the north end. Water bowls are provided at the information tent.`,
    `Most stalls now accept card payments, although a few smaller stalls still take cash only. There is no cash machine in the square, so please bring cash with you if you need it.`,
    `Shoppers are encouraged to bring their own bags. Paper bags are available for 10p each, and all the money raised goes to the Hillcrest Food Bank.`,
  ].join("\n\n"),
  questions: [
    pick(1, "true_false_notgiven", "From April the market will be held in the same place as before.", TFNG, "FALSE", `The market "will move from the school car park to Victoria Square".`),
    pick(2, "true_false_notgiven", "The evening market will take place once a month.", TFNG, "TRUE", `It will be held "on the first Thursday of each month".`),
    pick(3, "true_false_notgiven", "There will be more stalls than there were last year.", TFNG, "NOT GIVEN", `The notice says stallholders "must be based within 40 miles of Hillcrest" but gives no information about the number of stalls.`),
    pick(4, "true_false_notgiven", "Shoppers can park near the market without paying.", TFNG, "TRUE", `"Free parking is available at the Station Road car park, a five-minute walk away".`),
    pick(5, "true_false_notgiven", "Dogs may enter the covered food hall if they are on a lead.", TFNG, "FALSE", `Dogs on leads are welcome in the square, "but they are not allowed in the covered food hall".`),
    pick(6, "true_false_notgiven", "There is a cash machine at Station Road car park.", TFNG, "NOT GIVEN", `The notice only says "There is no cash machine in the square"; it says nothing about Station Road.`),
    pick(7, "true_false_notgiven", "Money from the sale of paper bags will be spent on market equipment.", TFNG, "FALSE", `"all the money raised goes to the Hillcrest Food Bank."`),
  ],
};

const text2: ItemGroup = {
  id: "rg-2",
  partNumber: 2,
  title: "Section 1 — Choosing a home internet provider",
  stimulusKind: "passage",
  instructions:
    "Questions 8-14. Look at the five internet providers, A-E. For which provider is each statement true? You may use any letter more than once.",
  passageText: [
    `HOME INTERNET IN THE DALTON AREA: YOUR OPTIONS`,
    `A  Linkwave\nLinkwave offers the fastest speeds in the region, up to 900 Mbps, but only to homes in the town centre. Contracts last 24 months, and there is a one-off set-up fee of £40. Every customer receives a free router.`,
    `B  Hometel\nHometel is ideal for light users who mainly send emails and browse the web. Its basic package costs just £18 a month, and there is no minimum contract, so you can leave at any time with 30 days' notice. Its customer helpline is open 24 hours a day.`,
    `C  FibreNest\nFibreNest is a small, locally owned company. Its engineers will connect your home within three days of ordering, and the price is fixed for the whole of an 18-month contract. Customers who refer a friend get a month free.`,
    `D  SkyBridge\nSkyBridge provides internet by satellite, so it is available even in remote villages that cable networks do not reach. The satellite dish must be bought separately for £120. Speeds can be affected during heavy rain.`,
    `E  CityConnect\nCityConnect packages include a TV service with more than 80 channels. Students can get a 30% discount with a valid student card. Contracts last 12 months and can be renewed online.`,
  ].join("\n\n"),
  questions: [
    pick(8, "matching_information", "You can stop using this service without a long commitment.", PROVIDERS, "B", `Hometel has "no minimum contract, so you can leave at any time with 30 days' notice."`),
    pick(9, "matching_information", "This service is suitable for people living in the countryside.", PROVIDERS, "D", `SkyBridge "is available even in remote villages that cable networks do not reach."`),
    pick(10, "matching_information", "This provider also offers television.", PROVIDERS, "E", `CityConnect packages "include a TV service with more than 80 channels."`),
    pick(11, "matching_information", "Customers are rewarded for recommending the service.", PROVIDERS, "C", `FibreNest says "Customers who refer a friend get a month free."`),
    pick(12, "matching_information", "The service may be slower in bad weather.", PROVIDERS, "D", `With SkyBridge, "Speeds can be affected during heavy rain."`),
    pick(13, "matching_information", "Installation is promised within a short time.", PROVIDERS, "C", `FibreNest engineers "will connect your home within three days of ordering".`),
    pick(14, "matching_information", "A charge is made for starting the service.", PROVIDERS, "A", `Linkwave has "a one-off set-up fee of £40."`),
  ],
};

const text3: ItemGroup = {
  id: "rg-3",
  partNumber: 3,
  title: "Section 2 — Harbour Logistics: claiming work expenses",
  stimulusKind: "passage",
  instructions:
    "Questions 15-21. Complete the sentences below. Write NO MORE THAN TWO WORDS from the text for each answer.",
  passageText: [
    `HARBOUR LOGISTICS — STAFF GUIDE TO EXPENSE CLAIMS`,
    `Submitting a claim\nAll expense claims must now be made through the online system, ExpensePoint, which you can reach from the staff intranet. Paper forms will no longer be accepted after 30 June. If you do not yet have an ExpensePoint login, ask the IT helpdesk.`,
    `Time limits\nClaims must be submitted within 60 days of the date on the receipt. Older claims will be paid only in exceptional circumstances, and they must be approved by the finance director.`,
    `Receipts\nEvery claim must be supported by a receipt. Take a clear photograph of each receipt with your phone and upload it with the claim. Please keep the original receipt until the claim has been paid, as the finance team may ask to see it.`,
    `Travel\nStaff who use their own car for work journeys can claim 45p per mile. Mileage claims must include the postcodes of the start and end of each journey. Travel between home and your usual workplace cannot be claimed. Train travel must be standard class unless the journey lasts more than three hours, in which case first class may be booked.`,
    `Meals and accommodation\nWhen you are working away from your usual workplace for more than five hours, you may claim up to £10 for lunch. Alcohol cannot be claimed under any circumstances. Hotels must always be booked through the company's travel desk, and not directly with the hotel, so that our discounted rates can be applied.`,
    `Payment\nOnce submitted, your claim will be checked by your line manager. Approved claims are paid together with your monthly salary.`,
  ].join("\n\n"),
  questions: [
    gap(15, "sentence_completion", "After 30 June, paper ______ cannot be used for claims.", ["forms"], `The guide says "Paper forms will no longer be accepted after 30 June."`),
    gap(16, "sentence_completion", "A claim made more than 60 days late needs the approval of the ______.", ["finance director"], `Older claims "must be approved by the finance director."`),
    gap(17, "sentence_completion", "Staff should upload a ______ of every receipt.", ["photograph", "photo", "clear photograph"], `Staff should "Take a clear photograph of each receipt with your phone and upload it".`),
    gap(18, "sentence_completion", "For mileage, staff must give the ______ where each journey starts and ends.", ["postcodes"], `Claims "must include the postcodes of the start and end of each journey."`),
    gap(19, "sentence_completion", "First-class train tickets are allowed for journeys of over three ______.", ["hours"], `First class may be booked when "the journey lasts more than three hours".`),
    gap(20, "sentence_completion", "Staff can never claim the cost of ______.", ["alcohol"], `The guide says "Alcohol cannot be claimed under any circumstances."`),
    gap(21, "sentence_completion", "Hotel rooms must be reserved through the company's ______.", ["travel desk"], `"Hotels must always be booked through the company's travel desk".`),
  ],
};

const text4: ItemGroup = {
  id: "rg-4",
  partNumber: 4,
  title: "Section 2 — Applying to the Staff Development Fund",
  stimulusKind: "passage",
  instructions:
    "Questions 22-27. The text has six paragraphs, A-F. Choose the correct heading for each paragraph from the list of headings below.",
  passageText: [
    `THE STAFF DEVELOPMENT FUND: A GUIDE FOR EMPLOYEES`,
    `A\nThe Staff Development Fund pays for courses, qualifications and conferences that will help you do your current job better or prepare you for a future role within the company. It also covers the cost of books and exam fees linked to an approved course. It does not pay for hobbies or for courses unrelated to your work, however interesting they may be.`,
    `B\nAny permanent employee who has completed their six-month probation period can apply, whether they work full-time or part-time. Temporary staff and contractors cannot apply to the fund, although they are welcome to attend our free in-house workshops.`,
    `C\nTo apply, complete the form on the intranet and ask your line manager to add a short statement explaining how the course will benefit your team. Applications without this statement of support will be returned to you, so it is worth discussing your plans with your manager early.`,
    `D\nApplications are considered by a panel four times a year, in January, April, July and October. You will normally hear the outcome within two weeks of the panel meeting. Because of this timetable, you should apply at least six weeks before your course is due to begin.`,
    `E\nIf you leave the company within one year of finishing a course that cost more than £1,000, you may be asked to return part of the cost. The amount depends on how long you stay: someone who leaves after six months, for example, would normally repay half.`,
    `F\nWithin a month of completing your course, we ask you to share what you have learned with colleagues. This might mean giving a short presentation to your team, writing an article for the staff newsletter, or running a lunchtime session.`,
  ].join("\n\n"),
  questions: [
    pick(22, "matching_headings", "Paragraph A", HEADINGS, "v", `Paragraph A explains that the fund "pays for courses, qualifications and conferences" and what it does not pay for.`),
    pick(23, "matching_headings", "Paragraph B", HEADINGS, "iii", `Paragraph B says "Any permanent employee who has completed their six-month probation period can apply".`),
    pick(24, "matching_headings", "Paragraph C", HEADINGS, "viii", `Your line manager must "add a short statement explaining how the course will benefit your team."`),
    pick(25, "matching_headings", "Paragraph D", HEADINGS, "ii", `"Applications are considered by a panel four times a year, in January, April, July and October."`),
    pick(26, "matching_headings", "Paragraph E", HEADINGS, "vii", `Staff who leave early "may be asked to return part of the cost."`),
    pick(27, "matching_headings", "Paragraph F", HEADINGS, "iv", `"we ask you to share what you have learned with colleagues."`),
  ],
};

const text5: ItemGroup = {
  id: "rg-5",
  partNumber: 5,
  title: "Section 3 — The box that changed the world",
  stimulusKind: "passage",
  instructions:
    "Questions 28-31: choose the correct letter, A, B, C or D. Questions 32-36: complete the summary using ONE WORD ONLY from the passage. Questions 37-40: complete each sentence with the correct ending, A-F.",
  passageText: [
    `THE BOX THAT CHANGED THE WORLD`,
    `Look at almost anything in your home, from the phone in your pocket to the shoes by the door and the bananas in the kitchen, and there is a good chance that at some point it travelled inside a steel box. The shipping container is so ordinary that it is easy to overlook, yet few inventions have done more to shape the modern economy. Around ninety per cent of the world's traded goods now move by sea, and most of them move in containers.`,
    `Before the container, loading a ship was slow, expensive and dangerous work. Goods arrived at the docks in sacks, barrels, crates and bundles of every shape and size, and each item had to be lifted on board separately by teams of dock workers. A large cargo ship could spend a week or more in port being loaded and unloaded, and it was not unusual for the time in harbour to be longer than the voyage itself. Theft was common, injuries were frequent, and the cost of handling goods at the port could account for half of the total cost of transporting them.`,
    `The man usually credited with changing this was not a sailor but a trucking businessman. Malcom McLean had built up one of the largest road haulage firms in the United States, and he was frustrated by the hours his drivers spent waiting at ports while their loads were moved, piece by piece, onto ships. His idea was simple: instead of unloading the truck, why not lift the whole trailer, or at least the box on top of it, straight onto the ship? In 1956 a converted oil tanker, the Ideal X, sailed from New Jersey to Texas carrying fifty-eight metal boxes on its deck. McLean calculated that loading it had cost less than sixteen cents a ton, compared with more than five dollars a ton for loose cargo.`,
    `McLean was not the first person to put goods in boxes. Railways and some shipping lines had experimented with containers decades earlier. What made his approach different was his insistence on treating the container as part of a complete system. Ships, cranes, trucks and trains all had to be designed around the box, and the box had to be strong enough to be stacked many levels high. Equally important was the decision, after years of argument in the 1960s, to agree international standards for container sizes and for the corner fittings used to lift and lock them. Once a box loaded in Rotterdam could be lifted by a crane in Singapore and placed on a train in Chicago, the container became truly global.`,
    `The effects were dramatic. Ports that could once handle a ship in a week now did so in a day or less. Insurance costs fell because goods were sealed inside the box from factory to destination, which made theft much harder. Above all, the cost of moving goods across oceans dropped so far that it stopped being a major factor in many business decisions. Some economists have argued that the container did more to increase world trade than all the trade agreements of the same period combined.`,
    `Not everyone benefited. Container ships needed deep water, vast areas of flat land for stacking boxes, and good road and rail links. Many old city-centre ports, such as those in London and New York, could provide none of these, and the work moved to new terminals built miles away. Tens of thousands of dock jobs disappeared, and waterfront communities that had depended on them for generations went into decline. In many cities the empty docks lay unused for years before being redeveloped as offices, flats and museums.`,
    `Cheap shipping also changed where things are made. When transport costs were high, it made sense to produce goods close to the people who would buy them. Once those costs became low, manufacturers could take advantage of lower wages or specialist suppliers on the other side of the world. A single product may now contain parts made in a dozen countries, some of which cross the ocean more than once before the finished item reaches a shop. Critics point out that this system is fragile: when one large ship blocked the Suez Canal for six days in 2021, businesses around the world felt the delays for months.`,
    `Today the largest container ships can carry more than twenty-four thousand standard boxes, and the containers themselves have found surprising second lives. Because they are strong, cheap and easy to transport, retired containers have been turned into homes, shops, schools and even swimming pools. Some architects praise them as an efficient way to reuse materials; others argue that the work needed to insulate a steel box properly makes them less environmentally friendly than they first appear. Either way, the humble container shows no sign of disappearing from the world it helped to create.`,
  ].join("\n\n"),
  questions: [
    pick(28, "multiple_choice_single", "What does the writer say about shipping before containers?", letters(["Ships often spent longer in port than at sea.", "Dock workers refused to carry dangerous goods.", "Most goods were packed in barrels.", "Theft from ships was unusual."]), "A", `The writer says "it was not unusual for the time in harbour to be longer than the voyage itself."`),
    pick(29, "multiple_choice_single", "What first led McLean to develop his idea?", letters(["the rising price of oil", "time wasted by his drivers at ports", "his experience as a sailor", "competition from the railways"]), "B", `McLean "was frustrated by the hours his drivers spent waiting at ports".`),
    pick(30, "multiple_choice_single", "According to the fourth paragraph, what was new about McLean's approach?", letters(["He was the first to use boxes for cargo.", "He designed a new kind of crane.", "He saw the container as part of a complete system.", "He persuaded railways to carry his boxes."]), "C", `"What made his approach different was his insistence on treating the container as part of a complete system."`),
    pick(31, "multiple_choice_single", "Why does the writer mention the Suez Canal?", letters(["to show how easily global supply chains can be disrupted", "to argue that ships have become too large", "to explain why goods cross the ocean more than once", "to compare old ports with new terminals"]), "A", `Critics say "this system is fragile", and when a ship blocked the canal "businesses around the world felt the delays for months."`),
    gap(32, "summary_completion", "Containers reduced the time ships spent in port, and ______ costs fell because goods were sealed inside the box.", ["insurance"], `"Insurance costs fell because goods were sealed inside the box from factory to destination".`, 1),
    gap(33, "summary_completion", "Sealing goods in boxes made ______ much harder.", ["theft"], `Sealing the goods "made theft much harder."`, 1),
    gap(34, "summary_completion", "Container ships needed deep water, large areas of flat ______ and good transport links.", ["land"], `Container ships needed "vast areas of flat land for stacking boxes".`, 1),
    gap(35, "summary_completion", "Because many old ports could not provide these, tens of thousands of dock ______ were lost.", ["jobs"], `"Tens of thousands of dock jobs disappeared".`, 1),
    gap(36, "summary_completion", "Empty docks were later redeveloped as offices, flats and ______.", ["museums"], `The docks were "redeveloped as offices, flats and museums."`, 1),
    pick(37, "matching_sentence_endings", "Agreeing international standards for containers", ENDINGS, "A", `Once standards were agreed, "a box loaded in Rotterdam could be lifted by a crane in Singapore and placed on a train in Chicago".`),
    pick(38, "matching_sentence_endings", "The fall in transport costs", ENDINGS, "B", `Once costs became low, "manufacturers could take advantage of lower wages or specialist suppliers on the other side of the world."`),
    pick(39, "matching_sentence_endings", "The strength and low cost of old containers", ENDINGS, "C", `"Because they are strong, cheap and easy to transport, retired containers have been turned into homes, shops, schools and even swimming pools."`),
    pick(40, "matching_sentence_endings", "The work needed to insulate a container", ENDINGS, "D", `Some argue it "makes them less environmentally friendly than they first appear."`),
  ],
};

export const readingSection: Section = {
  code: "reading",
  title: "Reading",
  durationMinutes: 60,
  questionCount: 40,
  itemGroups: [text1, text2, text3, text4, text5],
};
