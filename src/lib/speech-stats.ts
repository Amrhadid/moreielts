/**
 * Fluency statistics from a word-timed transcript. Shared by the grading
 * worker (the numbers are handed to the examiner prompt as evidence) and the
 * results page (shown to the learner). Pure, no dependencies.
 */

export interface TimedWord {
  word: string;
  start: number;
  end: number;
}

export interface SpeechStats {
  wordCount: number;
  /** Speaking time in seconds, first word start to last word end. */
  speakingSeconds: number;
  wordsPerMinute: number;
  fillerCount: number;
  /** Fillers per 100 words. */
  fillerRate: number;
  /** Gaps of two seconds or more between consecutive words. */
  longPauses: number;
  /** The fillers actually heard, most frequent first. */
  topFillers: Array<{ filler: string; count: number }>;
}

const SINGLE_FILLERS = new Set(["um", "umm", "uh", "uhm", "er", "erm", "ah", "hmm", "mm"]);
const DOUBLE_FILLERS = new Set(["you know", "i mean", "sort of", "kind of"]);

function clean(word: string): string {
  return word.toLowerCase().replace(/[^a-z']/g, "");
}

export function speechStats(words: TimedWord[], fallbackText = ""): SpeechStats {
  const tokens = words.length
    ? words.map((w) => clean(w.word)).filter(Boolean)
    : fallbackText.split(/\s+/).map(clean).filter(Boolean);

  const counts = new Map<string, number>();
  const bump = (filler: string) => counts.set(filler, (counts.get(filler) ?? 0) + 1);
  for (let i = 0; i < tokens.length; i++) {
    const pair = `${tokens[i]} ${tokens[i + 1] ?? ""}`;
    if (DOUBLE_FILLERS.has(pair)) {
      bump(pair);
      i++;
    } else if (SINGLE_FILLERS.has(tokens[i])) {
      bump(tokens[i]);
    }
  }
  const fillerCount = [...counts.values()].reduce((a, b) => a + b, 0);

  let longPauses = 0;
  for (let i = 1; i < words.length; i++) {
    if (words[i].start - words[i - 1].end >= 2) longPauses++;
  }

  const speakingSeconds = words.length
    ? Math.max(0, words[words.length - 1].end - words[0].start)
    : 0;
  const wordCount = tokens.length;

  return {
    wordCount,
    speakingSeconds: Math.round(speakingSeconds),
    wordsPerMinute: speakingSeconds > 0 ? Math.round((wordCount / speakingSeconds) * 60) : 0,
    fillerCount,
    fillerRate: wordCount ? Math.round((fillerCount / wordCount) * 1000) / 10 : 0,
    longPauses,
    topFillers: [...counts.entries()]
      .map(([filler, count]) => ({ filler, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5),
  };
}
