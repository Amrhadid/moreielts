import { describe, expect, it } from "vitest";
import {
  checkAnswer,
  checkMultiAnswer,
  countWords,
  normalizeText,
  wordsToNumber,
  type CheckableQuestion,
} from "./answer-check";

/** Question factory — defaults mirror the column defaults in the migration. */
function q(overrides: Partial<CheckableQuestion> = {}): CheckableQuestion {
  return {
    acceptedAnswers: [],
    wordLimit: 0,
    spellingPolicy: "lenient",
    acceptsPlural: true,
    caseSensitive: false,
    scoringRules: {},
    ...overrides,
  };
}

describe("rule 1 — normalisation", () => {
  it("trims and collapses internal whitespace", () => {
    expect(normalizeText("  the   grey   whale ")).toBe("the grey whale");
  });

  it("folds curly quotes onto ASCII", () => {
    expect(normalizeText("‘shepherd’s’")).toBe("'shepherd's'");
  });

  it("folds en and em dashes onto a hyphen", () => {
    expect(normalizeText("nineteen–twenty")).toBe("nineteen-twenty");
  });

  it("treats a non-breaking space as whitespace", () => {
    expect(normalizeText("off peak")).toBe("off peak");
  });

  it("matches an answer typed with a curly apostrophe", () => {
    const result = checkAnswer("‘tendon’", q({ acceptedAnswers: ["tendon"] }));
    expect(result.correct).toBe(true);
  });

  it("rejects an empty answer with reason empty", () => {
    expect(checkAnswer("   ", q({ acceptedAnswers: ["tendon"] }))).toEqual({
      correct: false,
      reason: "empty",
    });
  });
});

describe("rule 2 — word limit", () => {
  it("counts a hyphenated word as one word", () => {
    expect(countWords("off-peak membership")).toBe(2);
  });

  it("counts a decimal number as one word", () => {
    expect(countWords("32.50")).toBe(1);
  });

  it("counts a number with a thousands separator as one word", () => {
    expect(countWords("1,200 litres")).toBe(2);
  });

  it("accepts an answer exactly at the limit", () => {
    const result = checkAnswer(
      "direct debit",
      q({ acceptedAnswers: ["direct debit"], wordLimit: 2 }),
    );
    expect(result.correct).toBe(true);
  });

  it("rejects an over-long answer with word_limit_exceeded", () => {
    const result = checkAnswer(
      "by a direct debit payment",
      q({ acceptedAnswers: ["direct debit"], wordLimit: 2 }),
    );
    expect(result).toEqual({ correct: false, reason: "word_limit_exceeded" });
  });

  it("rejects on the limit even when the text would otherwise match", () => {
    const result = checkAnswer(
      "the streamer lines",
      q({ acceptedAnswers: ["streamer lines"], wordLimit: 2 }),
    );
    expect(result.reason).toBe("word_limit_exceeded");
  });

  it("applies no limit when wordLimit is 0", () => {
    const result = checkAnswer(
      "every second year",
      q({ acceptedAnswers: ["every second year"], wordLimit: 0 }),
    );
    expect(result.correct).toBe(true);
  });

  it("counts a hyphenated compound as one against a one-word limit", () => {
    const result = checkAnswer(
      "off-peak",
      q({ acceptedAnswers: ["off-peak"], wordLimit: 1 }),
    );
    expect(result.correct).toBe(true);
  });
});

describe("rule 3 — case", () => {
  it("is case insensitive by default", () => {
    expect(checkAnswer("TENDON", q({ acceptedAnswers: ["tendon"] })).correct).toBe(true);
  });

  it("accepts mixed case by default", () => {
    expect(checkAnswer("Direct Debit", q({ acceptedAnswers: ["direct debit"] })).correct).toBe(true);
  });

  it("enforces case when caseSensitive is true", () => {
    const question = q({ acceptedAnswers: ["Whitcombe"], caseSensitive: true });
    expect(checkAnswer("whitcombe", question).correct).toBe(false);
    expect(checkAnswer("Whitcombe", question).correct).toBe(true);
  });
});

describe("rule 4 — spelling policy", () => {
  it("accepts the US spelling of a UK answer when lenient", () => {
    expect(checkAnswer("color", q({ acceptedAnswers: ["colour"] })).correct).toBe(true);
  });

  it("accepts the UK spelling of a US answer when lenient", () => {
    expect(checkAnswer("centre", q({ acceptedAnswers: ["center"] })).correct).toBe(true);
  });

  it("accepts organize for organise", () => {
    expect(checkAnswer("organize", q({ acceptedAnswers: ["organise"] })).correct).toBe(true);
  });

  it("accepts traveling for travelling", () => {
    expect(checkAnswer("traveling", q({ acceptedAnswers: ["travelling"] })).correct).toBe(true);
  });

  it("accepts a productive -ization form", () => {
    expect(checkAnswer("organization", q({ acceptedAnswers: ["organisation"] })).correct).toBe(true);
  });

  it("rejects a spelling variant under a strict policy", () => {
    const result = checkAnswer(
      "color",
      q({ acceptedAnswers: ["colour"], spellingPolicy: "strict" }),
    );
    expect(result).toEqual({ correct: false, reason: "no_match" });
  });

  it("still accepts the exact spelling under a strict policy", () => {
    const result = checkAnswer(
      "colour",
      q({ acceptedAnswers: ["colour"], spellingPolicy: "strict" }),
    );
    expect(result.correct).toBe(true);
  });

  it("does not treat an unrelated misspelling as a variant", () => {
    expect(checkAnswer("collor", q({ acceptedAnswers: ["colour"] })).correct).toBe(false);
  });
});

describe("rule 5 — plurals", () => {
  it("accepts a regular +s plural", () => {
    expect(checkAnswer("clocks", q({ acceptedAnswers: ["clock"] })).correct).toBe(true);
  });

  it("accepts a regular +es plural", () => {
    expect(checkAnswer("boxes", q({ acceptedAnswers: ["box"] })).correct).toBe(true);
  });

  it("accepts a -ies plural", () => {
    expect(checkAnswer("libraries", q({ acceptedAnswers: ["library"] })).correct).toBe(true);
  });

  it("accepts a singular where the answer is plural", () => {
    expect(checkAnswer("clock", q({ acceptedAnswers: ["clocks"] })).correct).toBe(true);
  });

  it("rejects a plural when acceptsPlural is false", () => {
    const result = checkAnswer(
      "clocks",
      q({ acceptedAnswers: ["clock"], acceptsPlural: false }),
    );
    expect(result).toEqual({ correct: false, reason: "no_match" });
  });

  it("does not strip the s from a word ending in ss", () => {
    expect(checkAnswer("gla", q({ acceptedAnswers: ["glass"] })).correct).toBe(false);
  });
});

describe("rule 6 — articles", () => {
  it("accepts an answer with a leading 'the'", () => {
    expect(checkAnswer("the telegraph", q({ acceptedAnswers: ["telegraph"] })).correct).toBe(true);
  });

  it("accepts an answer missing a leading 'a'", () => {
    expect(checkAnswer("meridian", q({ acceptedAnswers: ["a meridian"] })).correct).toBe(true);
  });

  it("accepts a leading 'an'", () => {
    expect(checkAnswer("an albatross", q({ acceptedAnswers: ["albatross"] })).correct).toBe(true);
  });

  it("enforces the article when requireArticle is set", () => {
    const question = q({
      acceptedAnswers: ["the telegraph"],
      scoringRules: { requireArticle: true },
    });
    expect(checkAnswer("telegraph", question).correct).toBe(false);
    expect(checkAnswer("the telegraph", question).correct).toBe(true);
  });

  it("does not strip a word that merely starts with the letters 'the'", () => {
    expect(checkAnswer("theatre", q({ acceptedAnswers: ["theatre"] })).correct).toBe(true);
  });
});

describe("rule 7 — numbers, currency and dates", () => {
  it("converts a number word to a numeral", () => {
    expect(wordsToNumber("twenty")).toBe(20);
  });

  it("converts a hyphenated compound number", () => {
    expect(wordsToNumber("forty-eight")).toBe(48);
  });

  it("returns null for a non-number word", () => {
    expect(wordsToNumber("telegraph")).toBeNull();
  });

  it("treats 20 and twenty as equal", () => {
    expect(checkAnswer("twenty", q({ acceptedAnswers: ["20"] })).correct).toBe(true);
  });

  it("treats a numeral answer against a written accepted answer as equal", () => {
    expect(checkAnswer("48", q({ acceptedAnswers: ["forty-eight"] })).correct).toBe(true);
  });

  it("accepts a spelled-out ordinal for a numeric day", () => {
    expect(checkAnswer("fourteenth", q({ acceptedAnswers: ["14"] })).correct).toBe(true);
  });

  it("ignores an ordinal suffix on a numeral", () => {
    expect(checkAnswer("14th", q({ acceptedAnswers: ["14"] })).correct).toBe(true);
  });

  it("normalises a currency symbol against a currency word", () => {
    expect(checkAnswer("£32.50", q({ acceptedAnswers: ["32.50 pounds"] })).correct).toBe(true);
  });

  it("strips a thousands separator", () => {
    expect(checkAnswer("1,200", q({ acceptedAnswers: ["1200"] })).correct).toBe(true);
  });

  it("treats a trailing .00 as equal to the whole number", () => {
    expect(checkAnswer("20.00", q({ acceptedAnswers: ["20"] })).correct).toBe(true);
  });

  it("accepts either ordering of a day and month", () => {
    expect(checkAnswer("March 14", q({ acceptedAnswers: ["14 March"] })).correct).toBe(true);
  });

  it("accepts an ordinal date against a plain one", () => {
    expect(checkAnswer("14th March", q({ acceptedAnswers: ["14 March"] })).correct).toBe(true);
  });

  it("does not equate different numbers", () => {
    expect(checkAnswer("thirty", q({ acceptedAnswers: ["20"] })).correct).toBe(false);
  });

  it("enforces the exact number form when the rule is set", () => {
    const question = q({
      acceptedAnswers: ["20"],
      scoringRules: { requireExactNumberForm: true },
    });
    expect(checkAnswer("twenty", question).correct).toBe(false);
    expect(checkAnswer("20", question).correct).toBe(true);
  });
});

describe("rule 8 — multiple accepted answers", () => {
  it("matches the first accepted variant", () => {
    const result = checkAnswer(
      "every second year",
      q({ acceptedAnswers: ["every second year", "every two years", "biennially"] }),
    );
    expect(result.correct).toBe(true);
    expect(result.matched).toBe("every second year");
  });

  it("matches a later accepted variant", () => {
    const result = checkAnswer(
      "biennially",
      q({ acceptedAnswers: ["every second year", "every two years", "biennially"] }),
    );
    expect(result).toMatchObject({ correct: true, matched: "biennially" });
  });

  it("combines rules across a variant — plural plus US spelling", () => {
    const result = checkAnswer(
      "theaters",
      q({ acceptedAnswers: ["theatre"] }),
    );
    expect(result.correct).toBe(true);
  });

  it("returns no_match when nothing matches", () => {
    expect(
      checkAnswer("albatross", q({ acceptedAnswers: ["tendon", "ligament"] })),
    ).toEqual({ correct: false, reason: "no_match" });
  });

  it("returns no_match against an empty accepted list", () => {
    expect(checkAnswer("anything", q({ acceptedAnswers: [] })).reason).toBe("no_match");
  });
});

describe("multi-select questions", () => {
  it("accepts the correct set in any order", () => {
    expect(checkMultiAnswer(["C", "A"], q({ acceptedAnswers: ["A", "C"] })).correct).toBe(true);
  });

  it("rejects a partial selection", () => {
    expect(checkMultiAnswer(["A"], q({ acceptedAnswers: ["A", "C"] })).correct).toBe(false);
  });

  it("rejects an over-selection", () => {
    expect(
      checkMultiAnswer(["A", "B", "C"], q({ acceptedAnswers: ["A", "C"] })).correct,
    ).toBe(false);
  });

  it("rejects an empty selection with reason empty", () => {
    expect(checkMultiAnswer([], q({ acceptedAnswers: ["A", "C"] }))).toEqual({
      correct: false,
      reason: "empty",
    });
  });
});
