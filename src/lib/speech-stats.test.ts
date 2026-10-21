import { describe, expect, it } from "vitest";
import { speechStats } from "./speech-stats";

const timed = (text: string, gap = 0.1, pauseAt?: number) => {
  let t = 0;
  return text.split(" ").map((word, i) => {
    if (i === pauseAt) t += 3;
    const w = { word, start: t, end: t + 0.3 };
    t += 0.3 + gap;
    return w;
  });
};

describe("speechStats", () => {
  it("counts single and two-word fillers once each", () => {
    const s = speechStats(timed("um I think you know it is er quite like good"));
    expect(s.fillerCount).toBe(3);
    expect(s.topFillers.map((f) => f.filler)).toContain("you know");
  });

  it("measures pace over speaking time", () => {
    // 10 words, 0.4 s apart: 3.9 s of speech ≈ 154 wpm.
    const s = speechStats(timed("one two three four five six seven eight nine ten"));
    expect(s.wordsPerMinute).toBeGreaterThan(140);
    expect(s.wordsPerMinute).toBeLessThan(170);
  });

  it("flags gaps of two seconds or more", () => {
    expect(speechStats(timed("I went to the market", 0.1, 3)).longPauses).toBe(1);
  });

  it("falls back to plain text when there are no timings", () => {
    const s = speechStats([], "Well, um, I like it");
    expect(s.wordCount).toBe(5);
    expect(s.wordsPerMinute).toBe(0);
    // "like" is a verb here; it is never counted as a filler.
    expect(s.fillerCount).toBe(1);
  });
});
