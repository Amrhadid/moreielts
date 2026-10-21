import { describe, expect, it } from "vitest";
import { castSpeakers, chunkText, parseScript } from "./script-lines";

describe("parseScript", () => {
  it("splits speaker turns and joins wrapped lines", () => {
    const turns = parseScript("ANNA: Hello there.\nThis continues.\n\nMR BROWN: Hi, Anna.");
    expect(turns).toEqual([
      { speaker: "ANNA", text: "Hello there. This continues." },
      { speaker: "MR BROWN", text: "Hi, Anna." },
    ]);
  });

  it("treats an unlabelled opening as narration", () => {
    expect(parseScript("You will hear a talk.")[0].speaker).toBe("NARRATOR");
  });
});

describe("castSpeakers", () => {
  it("never gives two speakers in a part the same voice", () => {
    const cast = castSpeakers(parseScript("A: x\nB: y\nC: z\nA: w"), 3);
    const voices = [...cast.values()].map((c) => c.voice);
    expect(new Set(voices).size).toBe(3);
  });
});

describe("chunkText", () => {
  it("keeps every chunk under the limit at sentence boundaries", () => {
    const text = Array.from({ length: 50 }, (_, i) => `Sentence number ${i} is here.`).join(" ");
    const chunks = chunkText(text, 200);
    expect(chunks.every((c) => c.length <= 200)).toBe(true);
    expect(chunks.join(" ")).toBe(text);
  });
});
