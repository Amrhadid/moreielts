import { describe, expect, it } from "vitest";
import {
  formatBand,
  overallBand,
  rawScore,
  rawScoreToBand,
  roundToHalfBand,
  speakingBand,
  speakingSectionBand,
  tallyBy,
  writingSectionBand,
  writingTaskBand,
  type BandConversionRow,
} from "./scoring";

const TABLE: BandConversionRow[] = [
  { variant: "academic", section: "reading", raw_min: 39, raw_max: 40, band: 9, version: "v1" },
  { variant: "academic", section: "reading", raw_min: 30, raw_max: 32, band: 7, version: "v1" },
  { variant: "academic", section: "reading", raw_min: 23, raw_max: 26, band: 6, version: "v1" },
  { variant: "academic", section: "listening", raw_min: 30, raw_max: 31, band: 7, version: "v1" },
  { variant: "general_training", section: "reading", raw_min: 30, raw_max: 31, band: 6, version: "v1" },
];

describe("roundToHalfBand", () => {
  it("leaves an exact half band alone", () => {
    expect(roundToHalfBand(6.5)).toBe(6.5);
  });

  it("rounds .25 up to the half", () => {
    expect(roundToHalfBand(6.25)).toBe(6.5);
  });

  it("rounds .24 down to the whole", () => {
    expect(roundToHalfBand(6.24)).toBe(6);
  });

  it("rounds .49 up to the half", () => {
    expect(roundToHalfBand(6.49)).toBe(6.5);
  });

  it("rounds .75 up to the whole", () => {
    expect(roundToHalfBand(6.75)).toBe(7);
  });

  it("rounds .74 down to the half", () => {
    expect(roundToHalfBand(6.74)).toBe(6.5);
  });

  it("rounds .99 up to the whole", () => {
    expect(roundToHalfBand(6.99)).toBe(7);
  });

  it("clamps above 9", () => {
    expect(roundToHalfBand(9.6)).toBe(9);
  });

  it("clamps below 0", () => {
    expect(roundToHalfBand(-1)).toBe(0);
  });

  it("handles a value produced by floating-point division", () => {
    // (6 + 6.5 + 6.5 + 6) / 4 = 6.25 exactly, but via division.
    expect(roundToHalfBand((6 + 6.5 + 6.5 + 6) / 4)).toBe(6.5);
  });
});

describe("formatBand", () => {
  it("renders a whole band with one decimal", () => {
    expect(formatBand(7)).toBe("7.0");
  });

  it("renders a half band", () => {
    expect(formatBand(6.5)).toBe("6.5");
  });
});

describe("rawScoreToBand", () => {
  it("converts a raw score inside a band range", () => {
    expect(rawScoreToBand(31, "reading", "academic", TABLE)).toBe(7);
  });

  it("converts at the lower bound of a range", () => {
    expect(rawScoreToBand(30, "reading", "academic", TABLE)).toBe(7);
  });

  it("converts at the upper bound of a range", () => {
    expect(rawScoreToBand(32, "reading", "academic", TABLE)).toBe(7);
  });

  it("uses a different range for a different section", () => {
    expect(rawScoreToBand(30, "listening", "academic", TABLE)).toBe(7);
  });

  it("uses a different table for General Training", () => {
    expect(rawScoreToBand(30, "reading", "general_training", TABLE)).toBe(6);
  });

  it("throws when no conversion row covers the score", () => {
    expect(() => rawScoreToBand(35, "reading", "academic", TABLE)).toThrow(
      /No band_conversion row/,
    );
  });
});

describe("writing", () => {
  it("averages the four criteria for a task band", () => {
    expect(
      writingTaskBand({
        task_achievement: 6,
        coherence_cohesion: 6,
        lexical_resource: 6,
        grammatical_range: 6,
      }),
    ).toBe(6);
  });

  it("rounds a task band up to the half", () => {
    expect(
      writingTaskBand({
        task_achievement: 6,
        coherence_cohesion: 6.5,
        lexical_resource: 6.5,
        grammatical_range: 6,
      }),
    ).toBe(6.5);
  });

  it("rounds a task band with a .75 mean up to the whole", () => {
    expect(
      writingTaskBand({
        task_achievement: 7,
        coherence_cohesion: 7,
        lexical_resource: 7,
        grammatical_range: 6,
      }),
    ).toBe(7);
  });

  it("weights Task 2 double in the section band", () => {
    // (5 + 2*7) / 3 = 6.33 -> 6.5
    expect(writingSectionBand(5, 7)).toBe(6.5);
  });

  it("returns the shared band when both tasks match", () => {
    expect(writingSectionBand(6.5, 6.5)).toBe(6.5);
  });

  it("is pulled towards Task 2 rather than the mean", () => {
    // Plain mean would be 6.5; weighted is (7 + 2*6)/3 = 6.33 -> 6.5
    expect(writingSectionBand(7, 6)).toBe(6.5);
    // And the reverse weighting differs: (6 + 2*7)/3 = 6.67 -> 6.5
    expect(writingSectionBand(6, 7)).toBe(6.5);
    // A wider gap shows the asymmetry clearly.
    expect(writingSectionBand(4, 7)).toBe(6);
    expect(writingSectionBand(7, 4)).toBe(5);
  });
});

describe("speaking", () => {
  it("averages the four criteria", () => {
    expect(
      speakingBand({
        fluency_coherence: 7,
        lexical_resource: 6.5,
        grammatical_range: 6,
        pronunciation: 6.5,
      }),
    ).toBe(6.5);
  });

  it("rounds a .25 mean up to the half", () => {
    expect(
      speakingBand({
        fluency_coherence: 7,
        lexical_resource: 6,
        grammatical_range: 6,
        pronunciation: 6,
      }),
    ).toBe(6.5);
  });

  it("averages part bands for a section band", () => {
    expect(speakingSectionBand([6, 6.5, 7])).toBe(6.5);
  });

  it("returns 0 for no parts", () => {
    expect(speakingSectionBand([])).toBe(0);
  });
});

describe("overallBand", () => {
  it("averages the four components", () => {
    const result = overallBand({ listening: 7, reading: 7, writing: 6, speaking: 6.5 });
    expect(result.band).toBe(6.5);
  });

  it("stores the unrounded mean to two decimals", () => {
    const result = overallBand({ listening: 7, reading: 7, writing: 6, speaking: 6.5 });
    expect(result.unrounded).toBe(6.63);
  });

  it("rounds a .25 mean up to the half", () => {
    const result = overallBand({ listening: 6.5, reading: 6.5, writing: 6, speaking: 6 });
    expect(result).toEqual({ unrounded: 6.25, band: 6.5 });
  });

  it("rounds a .75 mean up to the whole", () => {
    const result = overallBand({ listening: 7, reading: 7, writing: 6.5, speaking: 6.5 });
    expect(result).toEqual({ unrounded: 6.75, band: 7 });
  });

  it("rounds a .125 mean down", () => {
    const result = overallBand({ listening: 6.5, reading: 6, writing: 6, speaking: 6 });
    expect(result.band).toBe(6);
  });

  it("handles identical components", () => {
    const result = overallBand({ listening: 8, reading: 8, writing: 8, speaking: 8 });
    expect(result).toEqual({ unrounded: 8, band: 8 });
  });
});

describe("tallies", () => {
  const responses = [
    { questionId: "1", typeCode: "true_false_notgiven", partNumber: 1, isCorrect: true },
    { questionId: "2", typeCode: "true_false_notgiven", partNumber: 1, isCorrect: false },
    { questionId: "3", typeCode: "short_answer", partNumber: 2, isCorrect: true },
  ];

  it("counts the raw score", () => {
    expect(rawScore(responses)).toBe(2);
  });

  it("groups by question type", () => {
    expect(tallyBy(responses, (r) => r.typeCode)).toEqual([
      { key: "true_false_notgiven", correct: 1, total: 2 },
      { key: "short_answer", correct: 1, total: 1 },
    ]);
  });

  it("groups by part", () => {
    expect(tallyBy(responses, (r) => String(r.partNumber))).toEqual([
      { key: "1", correct: 1, total: 2 },
      { key: "2", correct: 1, total: 1 },
    ]);
  });
});
