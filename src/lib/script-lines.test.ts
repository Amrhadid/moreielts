import { describe, expect, it } from "vitest";
import { castSpeakers, chunkText, guessGender, parseScript } from "./script-lines";

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

describe("guessGender", () => {
  it("reads names and titles", () => {
    expect(guessGender("HELEN")).toBe("female");
    expect(guessGender("MRS OKAFOR")).toBe("female");
    expect(guessGender("MR BROWN")).toBe("male");
    expect(guessGender("TOMAS")).toBe("male");
    expect(guessGender("LECTURER")).toBeNull();
  });

  it("never gives a woman a man's voice", () => {
    const cast = castSpeakers(parseScript("HELEN: Hi\nJAMES: Hello\nPRIYA: Hey"), 2);
    expect(cast.get("HELEN")!.gender).toBe("female");
    expect(cast.get("PRIYA")!.gender).toBe("female");
    expect(cast.get("HELEN")!.elevenVoice).not.toBe(cast.get("PRIYA")!.elevenVoice);
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
