import { describe, expect, it } from "vitest";
import { buildDailyPlan, dayOfYear, type PlanInput } from "./study-plan";

const base: PlanInput = {
  today: "2026-03-10",
  examDate: null,
  targetBand: 7,
  currentBand: 6,
  dailyGoalMinutes: 30,
  typeAccuracy: [],
  dueCards: 0,
  completedMocks: 2,
  lastMockDaysAgo: 3,
  isPremium: true,
};

const row = (type_code: string, correct: number, total: number) => ({
  type_code,
  type_label: type_code,
  section: "reading" as const,
  correct,
  total,
});

describe("buildDailyPlan", () => {
  it("is deterministic per date", () => {
    expect(buildDailyPlan(base)).toEqual(buildDailyPlan(base));
  });

  it("puts due review first", () => {
    const plan = buildDailyPlan({ ...base, dueCards: 6 });
    expect(plan.tasks[0].key).toBe("review");
  });

  it("drills the two weakest types with enough attempts", () => {
    const plan = buildDailyPlan({
      ...base,
      today: "2026-03-12", // odd day: no new-type intro once two are measured
      dailyGoalMinutes: 30,
      typeAccuracy: [row("a", 9, 10), row("b", 2, 10), row("c", 1, 2), row("d", 5, 10)],
    });
    expect(dayOfYear("2026-03-12") % 2).toBe(1);
    const drills = plan.tasks.filter((t) => t.key.startsWith("drill:")).map((t) => t.key);
    expect(drills).toEqual(["drill:b", "drill:d"]);
  });

  it("introduces one untried type when little is measured", () => {
    const plan = buildDailyPlan({ ...base, typeAccuracy: [] });
    expect(plan.tasks.filter((t) => t.key.startsWith("drill:"))).toHaveLength(1);
    expect(plan.tasks.some((t) => t.key === "vocab")).toBe(true);
  });

  it("roughly fills the daily goal", () => {
    for (const goal of [20, 30, 60, 90]) {
      const plan = buildDailyPlan({ ...base, dailyGoalMinutes: goal, typeAccuracy: [row("a", 1, 5), row("b", 2, 5)] });
      const total = plan.tasks.reduce((s, t) => s + t.minutes, 0);
      expect(total).toBeGreaterThanOrEqual(goal * 0.7);
      expect(total).toBeLessThanOrEqual(goal * 1.35);
    }
  });

  it("schedules writing on alternating days, Task 2 more often", () => {
    const days = Array.from({ length: 30 }, (_, i) => `2026-04-${String(i + 1).padStart(2, "0")}`);
    const writing = days
      .map((today) => buildDailyPlan({ ...base, today, dailyGoalMinutes: 90 }).tasks.find((t) => t.key.startsWith("writing")))
      .filter(Boolean);
    expect(writing.length).toBe(15);
    const t2 = writing.filter((t) => t!.key === "writing:task2").length;
    expect(t2).toBeGreaterThan(writing.length - t2);
  });

  it("asks for a mock when none in 14 days", () => {
    expect(buildDailyPlan({ ...base, lastMockDaysAgo: 15 }).tasks.some((t) => t.key === "mock")).toBe(true);
    expect(buildDailyPlan({ ...base, lastMockDaysAgo: null, completedMocks: 0 }).tasks.some((t) => t.key === "mock")).toBe(true);
    expect(buildDailyPlan({ ...base, lastMockDaysAgo: 10 }).tasks.some((t) => t.key === "mock")).toBe(false);
  });

  it("goes weekly on mocks in the final three weeks", () => {
    const plan = buildDailyPlan({ ...base, examDate: "2026-03-25", lastMockDaysAgo: 8 });
    expect(plan.phase).toBe("exam-ready");
    expect(plan.daysToExam).toBe(15);
    expect(plan.tasks.some((t) => t.key === "mock")).toBe(true);
  });

  it("lightens the load in the final week", () => {
    const input = { ...base, dailyGoalMinutes: 60, typeAccuracy: [row("a", 1, 5), row("b", 2, 5)] };
    const normal = buildDailyPlan(input).tasks.reduce((s, t) => s + t.minutes, 0);
    const final = buildDailyPlan({ ...input, examDate: "2026-03-14" });
    expect(final.phase).toBe("final-week");
    expect(final.tasks.reduce((s, t) => s + t.minutes, 0)).toBeLessThan(normal);
  });

  it("picks phases from the exam date", () => {
    expect(buildDailyPlan({ ...base, examDate: "2026-06-30" }).phase).toBe("foundation");
    expect(buildDailyPlan({ ...base, examDate: "2026-04-20" }).phase).toBe("build");
    expect(buildDailyPlan({ ...base, examDate: "2026-01-01" }).daysToExam).toBeNull();
    expect(buildDailyPlan({ ...base, completedMocks: 0, currentBand: null }).phase).toBe("foundation");
  });
});
