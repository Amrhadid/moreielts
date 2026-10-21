import type { IconName } from "~/components/ui/Icon";
import type { TypeAccuracyRow } from "./practice-queries";

/**
 * Today's study plan, as a pure function of the learner's goals and history.
 * Deterministic per date: anything that rotates does so by day-of-year, never
 * by Math.random, so a reload shows the same list and checks stay attached.
 */

export type PlanPhase = "foundation" | "build" | "exam-ready" | "final-week";

export interface PlanTask {
  /** Stable for the day; used as study_plan_checks.task_key. */
  key: string;
  title: string;
  detail: string;
  minutes: number;
  to: string;
  search?: Record<string, unknown>;
  icon: IconName;
}

export interface DailyPlan {
  phase: PlanPhase;
  daysToExam: number | null;
  tasks: PlanTask[];
}

export interface PlanInput {
  today: string;
  examDate: string | null;
  targetBand: number | null;
  currentBand: number | null;
  dailyGoalMinutes: number;
  typeAccuracy: TypeAccuracyRow[];
  dueCards: number;
  completedMocks: number;
  lastMockDaysAgo: number | null;
  isPremium: boolean;
}

/** Objective question types a drill can be built from (migration 0005). */
export const DRILL_TYPES: Array<{ code: string; label: string; section: "listening" | "reading" }> = [
  { code: "true_false_notgiven", label: "True / False / Not Given", section: "reading" },
  { code: "matching_headings", label: "Matching headings", section: "reading" },
  { code: "note_completion", label: "Note completion", section: "listening" },
  { code: "multiple_choice_single", label: "Multiple choice (one answer)", section: "reading" },
  { code: "sentence_completion", label: "Sentence completion", section: "reading" },
  { code: "table_completion", label: "Table completion", section: "listening" },
  { code: "yes_no_notgiven", label: "Yes / No / Not Given", section: "reading" },
  { code: "matching_information", label: "Matching information", section: "reading" },
  { code: "summary_completion", label: "Summary completion", section: "reading" },
  { code: "flowchart_completion", label: "Flow-chart completion", section: "listening" },
  { code: "matching_features", label: "Matching features", section: "reading" },
  { code: "diagram_label", label: "Diagram labelling", section: "listening" },
  { code: "multiple_choice_multiple", label: "Multiple choice (several answers)", section: "reading" },
  { code: "matching_sentence_endings", label: "Matching sentence endings", section: "reading" },
  { code: "short_answer", label: "Short answer", section: "reading" },
];

const MIN_ATTEMPTS = 3;
const MOCK_MINUTES = 165;

function parseDay(day: string): number {
  const [y, m, d] = day.split("-").map(Number);
  return Date.UTC(y, (m ?? 1) - 1, d ?? 1);
}

export function daysBetween(from: string, to: string): number {
  return Math.round((parseDay(to) - parseDay(from)) / 86_400_000);
}

export function dayOfYear(day: string): number {
  const year = Number(day.slice(0, 4));
  return daysBetween(`${year}-01-01`, day) + 1;
}

/** Local calendar day as YYYY-MM-DD. */
export function localDay(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function phaseFor(daysToExam: number | null, completedMocks: number, currentBand: number | null): PlanPhase {
  if (daysToExam === null) {
    return completedMocks === 0 || currentBand === null ? "foundation" : "build";
  }
  if (daysToExam <= 7) return "final-week";
  if (daysToExam <= 21) return "exam-ready";
  if (daysToExam <= 56) return "build";
  return "foundation";
}

function accuracy(row: TypeAccuracyRow): number {
  return row.total ? row.correct / row.total : 0;
}

export function buildDailyPlan(input: PlanInput): DailyPlan {
  const doy = dayOfYear(input.today);

  let daysToExam: number | null = null;
  if (input.examDate) {
    const d = daysBetween(input.today, input.examDate);
    daysToExam = d >= 0 ? d : null;
  }
  const phase = phaseFor(daysToExam, input.completedMocks, input.currentBand);
  const finalWeek = phase === "final-week";
  const goal = Math.max(10, input.dailyGoalMinutes || 30);
  const budget = Math.round(finalWeek ? goal * 0.6 : goal);

  const tasks: PlanTask[] = [];
  let used = 0;

  // 1. Due mistake cards always come first.
  if (input.dueCards > 0) {
    const minutes = Math.min(20, Math.max(5, Math.ceil(input.dueCards * 1.5)));
    tasks.push({
      key: "review",
      title: "Review your mistake cards",
      detail: `${input.dueCards} card${input.dueCards === 1 ? "" : "s"} due today`,
      minutes,
      to: "/review",
      icon: "repeat",
    });
    used += minutes;
  }

  // 2. A full mock when none in 14 days (weekly in the last three weeks).
  //    Exam day itself is for rest, not a mock.
  const mockInterval = phase === "exam-ready" || finalWeek ? 7 : 14;
  const mockDue =
    daysToExam !== 0 &&
    (input.lastMockDaysAgo === null || input.lastMockDaysAgo >= mockInterval);
  if (mockDue) {
    tasks.push({
      key: "mock",
      title: "Sit a full mock test",
      detail:
        input.completedMocks === 0
          ? "Get your first band estimate under real timing"
          : `Your last mock was ${input.lastMockDaysAgo} days ago`,
      minutes: MOCK_MINUTES,
      to: "/mock",
      icon: "clipboard",
    });
    tasks.push(vocabTask(5));
    return { phase, daysToExam, tasks };
  }

  // 3. Drill candidates: the two weakest measured types, plus one untried
  //    type introduced per day (rotating by day-of-year).
  const measured = input.typeAccuracy
    .filter((r) => r.total >= MIN_ATTEMPTS)
    .sort((a, b) => accuracy(a) - accuracy(b) || a.type_code.localeCompare(b.type_code));
  const measuredCodes = new Set(measured.map((r) => r.type_code));
  const untried = DRILL_TYPES.filter((t) => !measuredCodes.has(t.code));

  const drills: Array<{ code: string; label: string; detail: string }> = measured.slice(0, 2).map((r) => ({
    code: r.type_code,
    label: r.type_label,
    detail: `Weak spot · ${Math.round(accuracy(r) * 100)}% over ${r.total} questions`,
  }));
  if (untried.length > 0 && (drills.length < 2 || doy % 2 === 0)) {
    const intro = untried[doy % untried.length];
    drills.push({ code: intro.code, label: intro.label, detail: "New for you · try this question type" });
  }

  // 4. Vocabulary, 10 words.
  const vocab = vocabTask(finalWeek ? 5 : 10);
  used += vocab.minutes;

  // 5. Writing on alternating days (every fourth day on the free plan);
  //    Task 2 twice as often as Task 1.
  let writing: PlanTask | null = null;
  const writingEvery = input.isPremium ? 2 : 4;
  if (doy % writingEvery === 0 && budget - used >= 30) {
    const slot = Math.floor(doy / writingEvery) % 3;
    const taskNumber = slot === 2 || budget - used < 45 ? 1 : 2;
    const minutes = taskNumber === 2 ? 40 : 20;
    writing = {
      key: `writing:task${taskNumber}`,
      title: `Write a Task ${taskNumber} ${taskNumber === 2 ? "essay" : "response"}`,
      detail: input.isPremium
        ? "Get band-scored feedback in the writing lab"
        : "Write it under time, then check it against the criteria",
      minutes,
      to: "/writing-lab",
      search: { task: taskNumber },
      icon: "pen",
    };
    used += minutes;
  }

  // 6. Drills share whatever time is left, 5–25 minutes each.
  let remaining = Math.max(0, budget - used);
  // Long goals: add more types (next weakest, then other untried) so no drill runs past 25 minutes.
  const extra = [
    ...measured.slice(2).map((r) => ({
      code: r.type_code,
      label: r.type_label,
      detail: `Keep sharp · ${Math.round(accuracy(r) * 100)}% over ${r.total} questions`,
    })),
    ...untried
      .filter((t) => !drills.some((d) => d.code === t.code))
      .map((t) => ({ code: t.code, label: t.label, detail: "New for you · try this question type" })),
  ];
  while (drills.length < 4 && remaining > drills.length * 25 && extra.length) drills.push(extra.shift()!);
  while (drills.length > 1 && drills.length * 5 > remaining) drills.pop();
  const per = Math.min(25, Math.max(5, Math.round(remaining / Math.max(1, drills.length) / 5) * 5));
  for (const d of drills) {
    tasks.push({
      key: `drill:${d.code}`,
      title: `Drill: ${d.label}`,
      detail: d.detail,
      minutes: per,
      to: `/drill/${d.code}`,
      icon: "target",
    });
    remaining -= per;
  }

  tasks.push(vocab);
  if (writing) tasks.push(writing);

  return { phase, daysToExam, tasks };
}

function vocabTask(minutes: number): PlanTask {
  return {
    key: "vocab",
    title: "Learn 10 new words",
    detail: "Academic vocabulary with examples",
    minutes,
    to: "/vocabulary",
    icon: "language",
  };
}
