import { describe, expect, it } from "vitest";
import { LISTENING_SET, READING_SET, WRITING_TASKS } from "~/data/practice";
import { assertBand, parseStrictJson } from "./ai";
import { describeTaskData, markObjective, normaliseFeedback } from "./grading";

describe("markObjective", () => {
  it("marks a perfect reading sheet 5/5", () => {
    const answers = Object.fromEntries(
      READING_SET.questions.map((q) => [q.id, q.acceptedAnswers[0]]),
    );
    const marked = markObjective(READING_SET, answers);
    expect(marked.every((m) => m.result.correct)).toBe(true);
  });

  it("treats blanks and distractors as incorrect with a reason", () => {
    const marked = markObjective(LISTENING_SET, { l1: "Whitfeild", l5: "A" });
    expect(marked[0].result).toMatchObject({ correct: false, reason: "no_match" });
    expect(marked[1].result).toMatchObject({ correct: false, reason: "empty" });
    expect(marked[4].result).toMatchObject({ correct: false, reason: "no_match" });
  });

  it("applies the word limit to completion answers", () => {
    const marked = markObjective(READING_SET, { r5: "a calibration curve that" });
    expect(marked[4].result).toMatchObject({ correct: false, reason: "word_limit_exceeded" });
  });

  it("is lenient on case and surrounding whitespace", () => {
    const marked = markObjective(LISTENING_SET, { l1: "  whitfield ", l3: "LIBRARY" });
    expect(marked[0].result.correct).toBe(true);
    expect(marked[2].result.correct).toBe(true);
  });
});

describe("parseStrictJson", () => {
  it("accepts a fenced or prose-wrapped object", () => {
    expect(parseStrictJson<{ a: number }>('```json\n{"a": 1}\n```').a).toBe(1);
    expect(parseStrictJson<{ a: number }>('Here you go: {"a": 2} hope that helps').a).toBe(2);
  });

  it("throws a readable error on garbage", () => {
    expect(() => parseStrictJson("no json here")).toThrow(/unreadable/);
  });
});

describe("assertBand", () => {
  it("accepts half bands only", () => {
    expect(assertBand(6.5, "x")).toBe(6.5);
    expect(assertBand("7", "x")).toBe(7);
    expect(() => assertBand(6.25, "x")).toThrow();
    expect(() => assertBand(9.5, "x")).toThrow();
    expect(() => assertBand("high", "x")).toThrow();
  });
});

describe("normaliseFeedback", () => {
  it("fills missing criteria so the UI never reads undefined", () => {
    const fb = normaliseFeedback(
      { lexical_resource: { comment: "ok", evidence: "one quote" }, summary: 5 },
      ["task_achievement", "lexical_resource"] as const,
    );
    expect(fb.task_achievement).toEqual({ comment: "", evidence: [] });
    expect(fb.lexical_resource).toEqual({ comment: "ok", evidence: ["one quote"] });
    expect(fb.summary).toBe("5");
  });
});

describe("describeTaskData", () => {
  it("renders the chart and the table as text for the examiner", () => {
    const chart = describeTaskData(WRITING_TASKS[0]);
    expect(chart).toContain("South Korea | 73 | 90 | 98");
    const table = describeTaskData(WRITING_TASKS[1]);
    expect(table).toContain("Theme parks | 9.4 | 15.2 | +62%");
    expect(describeTaskData(WRITING_TASKS[2])).toBe("");
  });
});
