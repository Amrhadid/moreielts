import { getQuestionType } from "~/registry/questionTypes";
import { overallBand, rawScoreToBand } from "~/lib/band";
import type { ItemGroup, Section } from "~/types/content";
import type {
  AccuracyRow,
  AnswerReviewRow,
  AttemptResult,
  ObjectiveSectionResult,
} from "~/types/result";
import { listeningSection } from "./listeningSection";
import { readingSection } from "./readingSection";

/**
 * A finished attempt, derived from the mock form so the answer review always
 * lines up with the questions the player showed.
 *
 * TODO(backend): the real result comes from marking the submitted answer sheet
 * server-side; Writing and Speaking bands come from the AI grader.
 */

/** Deterministic stand-in for "what the candidate actually typed". */
function isMarkedCorrect(section: "reading" | "listening", n: number): boolean {
  const seed = section === "reading" ? 3 : 4;
  return (n * seed) % 7 !== 0 && n % 9 !== 0;
}

function wrongAnswerFor(correct: string, hasOptions: boolean): string {
  if (!correct) return "—";
  if (hasOptions) {
    const alt = correct === "A" ? "B" : "A";
    return correct.length === 1 ? alt : "NOT GIVEN";
  }
  return correct.slice(0, Math.max(3, correct.length - 2));
}

function buildReview(
  section: Section,
  code: "reading" | "listening",
): AnswerReviewRow[] {
  return section.itemGroups.flatMap((group: ItemGroup) =>
    group.questions.map((q): AnswerReviewRow => {
      const correctAnswer = q.acceptedAnswers.join(" / ");
      const correct = isMarkedCorrect(code, q.number);
      return {
        questionId: q.id,
        number: q.number,
        section: code,
        type: q.type,
        prompt: q.prompt,
        correctAnswer,
        correct,
        userAnswer: correct
          ? (q.acceptedAnswers[0] ?? "")
          : wrongAnswerFor(q.acceptedAnswers[0] ?? "", Boolean(q.options)),
      };
    }),
  );
}

function tally(rows: AnswerReviewRow[], key: (r: AnswerReviewRow) => string) {
  const map = new Map<string, AccuracyRow>();
  for (const row of rows) {
    const k = key(row);
    const entry = map.get(k) ?? { label: k, correct: 0, total: 0 };
    entry.total += 1;
    if (row.correct) entry.correct += 1;
    map.set(k, entry);
  }
  return [...map.values()];
}

function objectiveResult(
  section: Section,
  code: "reading" | "listening",
): { result: ObjectiveSectionResult; rows: AnswerReviewRow[] } {
  const rows = buildReview(section, code);
  const rawScore = rows.filter((r) => r.correct).length;

  const byQuestionType = tally(rows, (r) => r.type).map((row) => ({
    ...row,
    code: row.label as ObjectiveSectionResult["byQuestionType"][number]["code"],
    label: getQuestionType(row.label as never).label,
  }));

  const partLabel = code === "reading" ? "Passage" : "Part";
  const numberToPart = new Map<number, number>();
  section.itemGroups.forEach((g) =>
    g.questions.forEach((q) => numberToPart.set(q.number, g.partNumber)),
  );
  const byPart = tally(
    rows,
    (r) => `${partLabel} ${numberToPart.get(r.number) ?? 1}`,
  );

  return {
    rows,
    result: {
      section: code,
      band: rawScoreToBand(rawScore),
      rawScore,
      rawTotal: 40,
      byQuestionType,
      byPart,
    },
  };
}

const reading = objectiveResult(readingSection, "reading");
const listening = objectiveResult(listeningSection, "listening");

const writingBand = 6;
const speakingBand = 6.5;

export const mockResult: AttemptResult = {
  attemptId: "a-104",
  formTitle: "Academic Mock Test 3",
  variant: "academic",
  takenAt: "2026-08-11T09:20:00Z",
  overall: overallBand([
    listening.result.band,
    reading.result.band,
    writingBand,
    speakingBand,
  ]),
  listening: listening.result,
  reading: reading.result,
  writing: {
    section: "writing",
    band: writingBand,
    criteria: [
      {
        criterion: "Task Achievement / Response",
        band: 6,
        feedback:
          "Task 1 covers the main trends but the overview is buried in the third paragraph rather than stated early. Task 2 addresses both views, though the second view is developed more thinly than the first.",
      },
      {
        criterion: "Coherence and Cohesion",
        band: 6,
        feedback:
          "Paragraphing is logical. Cohesive devices are present but repetitive — 'moreover' and 'in addition' carry most of the linking work, and referencing between sentences is occasionally unclear.",
      },
      {
        criterion: "Lexical Resource",
        band: 6,
        feedback:
          "Sufficient range for the task with some good topic vocabulary ('end use', 'per capita'). Errors in collocation appear when you reach for less familiar phrasing, but meaning stays clear.",
      },
      {
        criterion: "Grammatical Range and Accuracy",
        band: 5.5,
        feedback:
          "A mix of simple and complex sentences. Article use and subject–verb agreement slip in longer sentences, and comma splices occur in the Task 2 body paragraphs.",
      },
    ],
  },
  speaking: {
    section: "speaking",
    band: speakingBand,
    criteria: [
      {
        criterion: "Fluency and Coherence",
        band: 7,
        feedback:
          "You speak at length without noticeable effort. Some self-correction and repetition in Part 3, but it rarely interrupts the flow of the argument.",
      },
      {
        criterion: "Lexical Resource",
        band: 6.5,
        feedback:
          "Flexible enough to discuss unfamiliar topics with some paraphrase. Idiomatic language is attempted and mostly successful.",
      },
      {
        criterion: "Grammatical Range and Accuracy",
        band: 6,
        feedback:
          "A range of structures is used. Conditional and perfect forms are attempted, with errors that occasionally require the listener to reinterpret.",
      },
      {
        criterion: "Pronunciation",
        band: 6.5,
        feedback:
          "Generally clear and easy to follow. Word stress in longer academic words is inconsistent, which slightly reduces clarity in Part 2.",
      },
    ],
  },
  answerReview: [...listening.rows, ...reading.rows],
};
