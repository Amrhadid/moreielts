import { describe, expect, it } from "vitest";
import { checkAnswer } from "~/lib/answer-check";
import { LISTENING_SET, READING_SET, SPEAKING_PROMPTS, WRITING_TASKS } from "./index";

/**
 * Content invariants for the shipped practice sets. These are the rules the
 * runners rely on; a typo in the data should fail here, not in a learner's
 * browser.
 */
describe("practice content", () => {
  it("has exactly five items per section", () => {
    expect(READING_SET.questions).toHaveLength(5);
    expect(LISTENING_SET.questions).toHaveLength(5);
    expect(WRITING_TASKS).toHaveLength(5);
    expect(SPEAKING_PROMPTS).toHaveLength(5);
  });

  for (const set of [READING_SET, LISTENING_SET]) {
    describe(set.title, () => {
      it("numbers questions 1..5 with unique ids", () => {
        expect(set.questions.map((q) => q.number)).toEqual([1, 2, 3, 4, 5]);
        expect(new Set(set.questions.map((q) => q.id)).size).toBe(5);
      });

      it("every choice question's accepted answers are real options", () => {
        for (const q of set.questions.filter((q) => q.kind === "radio")) {
          const values = (q.options ?? []).map((o) => o.value);
          expect(values.length).toBeGreaterThanOrEqual(3);
          for (const a of q.acceptedAnswers) expect(values).toContain(a);
        }
      });

      it("every accepted completion answer passes its own checker", () => {
        for (const q of set.questions.filter((q) => q.kind === "text")) {
          expect(q.acceptedAnswers.length).toBeGreaterThan(0);
          for (const a of q.acceptedAnswers) {
            expect(
              checkAnswer(a, { acceptedAnswers: q.acceptedAnswers, wordLimit: q.wordLimit ?? 0 }),
            ).toMatchObject({ correct: true });
          }
        }
      });

      it("has an explanation for every question", () => {
        for (const q of set.questions) expect(q.explanation.length).toBeGreaterThan(20);
      });
    });
  }

  it("reading completion answers are taken verbatim from the passage", () => {
    const text = READING_SET.passage!.paragraphs.join(" ").toLowerCase();
    for (const q of READING_SET.questions.filter((q) => q.kind === "text")) {
      expect(text).toContain(q.acceptedAnswers[0].toLowerCase());
    }
  });

  it("listening answers can be heard in the transcript", () => {
    const text = LISTENING_SET.audio!.transcript.join(" ").toLowerCase();
    expect(text).toContain("whitfield");
    expect(text).toContain("forty-five pounds");
    expect(text).toContain("outside the library");
    expect(text).toContain("twelve kilometres");
    expect(text).toContain("waterproof jacket");
    for (const line of LISTENING_SET.audio!.transcript) {
      expect(line).toMatch(/^(Narrator|Tom|Emma): /);
    }
  });

  it("listening form answers accept the spoken number words", () => {
    const fee = LISTENING_SET.questions[1];
    const km = LISTENING_SET.questions[3];
    for (const given of ["45", "£45", "forty-five", "forty five"]) {
      expect(checkAnswer(given, { acceptedAnswers: fee.acceptedAnswers, wordLimit: fee.wordLimit })).toMatchObject({ correct: true });
    }
    for (const given of ["12", "twelve"]) {
      expect(checkAnswer(given, { acceptedAnswers: km.acceptedAnswers, wordLimit: km.wordLimit })).toMatchObject({ correct: true });
    }
    expect(checkAnswer("50", { acceptedAnswers: fee.acceptedAnswers, wordLimit: fee.wordLimit })).toMatchObject({ correct: false });
  });

  it("writing tasks carry the IELTS minimums and data for Task 1", () => {
    for (const task of WRITING_TASKS) {
      expect(task.minWords).toBe(task.taskNumber === 1 ? 150 : 250);
      if (task.taskNumber === 1) expect(Boolean(task.chart) || Boolean(task.table)).toBe(true);
      if (task.chart) {
        for (const s of task.chart.series) {
          expect(s.values).toHaveLength(task.chart.categories.length);
          for (const v of s.values) expect(v).toBeLessThanOrEqual(task.chart.max);
        }
      }
    }
    expect(WRITING_TASKS.filter((t) => t.taskNumber === 1)).toHaveLength(2);
    expect(WRITING_TASKS.filter((t) => t.taskNumber === 2)).toHaveLength(3);
  });

  it("speaking prompts follow the test's part order with one cue card", () => {
    expect(SPEAKING_PROMPTS.map((p) => p.part)).toEqual([1, 1, 2, 3, 3]);
    const cue = SPEAKING_PROMPTS.filter((p) => p.cueCard);
    expect(cue).toHaveLength(1);
    expect(cue[0].prepSeconds).toBe(60);
    expect(cue[0].maxSeconds).toBe(120);
  });
});
