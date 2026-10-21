/**
 * Parses a listening script written as "NAME: line" turns, and casts each
 * speaker to a voice and accent. Shared by generate-audio (Edge Function) and
 * the admin builder preview. Pure, no dependencies.
 */

export interface ScriptTurn {
  speaker: string;
  text: string;
}

export function parseScript(script: string): ScriptTurn[] {
  const turns: ScriptTurn[] = [];
  for (const raw of script.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line) continue;
    const match = /^([A-Z][A-Za-z .'-]{0,40}):\s*(.+)$/.exec(line);
    if (match) {
      turns.push({ speaker: match[1].trim(), text: match[2].trim() });
    } else if (turns.length) {
      // A wrapped line continues the previous turn.
      turns[turns.length - 1].text += ` ${line}`;
    } else {
      turns.push({ speaker: "NARRATOR", text: line });
    }
  }
  return turns;
}

export type Gender = "female" | "male";

const FEMALE_NAMES = new Set(
  ("anna ana alice amy amelia ann anne beth bella carla carol caroline charlotte chloe claire " +
   "diana ella ellie emily emma eva fatima grace hannah helen holly isabel jane jasmine jenny jess " +
   "jessica julia karen kate katie laura layla leila lily linda lisa lucy maria mary maya mia molly " +
   "nadia nina nora olivia paula priya rachel rebecca rosa ruth sally sara sarah sophie susan " +
   "tara una vanessa zara zoe narrator-f receptionist-f mrs ms miss").split(" "),
);
const MALE_HINTS = new Set(["mr", "sir", "man", "father", "dad", "boy"]);
const FEMALE_HINTS = new Set(["mrs", "ms", "miss", "woman", "mother", "mum", "girl", "lady"]);

/**
 * Best guess at a speaker's gender from the label ("HELEN", "MR BROWN",
 * "DR PATEL"), so a woman's lines are never read by a man's voice. Unknown
 * labels return null and are assigned to balance the cast.
 */
export function guessGender(speaker: string): Gender | null {
  const words = speaker.toLowerCase().replace(/[^a-z\s-]/g, " ").split(/\s+/).filter(Boolean);
  if (words.some((w) => FEMALE_HINTS.has(w))) return "female";
  if (words.some((w) => MALE_HINTS.has(w))) return "male";
  const first = words.find((w) => !["dr", "prof", "professor"].includes(w));
  if (!first) return null;
  if (FEMALE_NAMES.has(first)) return "female";
  return /^(tutor|lecturer|narrator|announcer|receptionist|guide|presenter|manager|officer|agent|speaker)$/.test(first)
    ? null
    : "male";
}

/** ElevenLabs premade voices, the same ones MoreTOEFL's listening tests use. */
export const ELEVEN_VOICES: Record<Gender, Array<{ id: string; accent: string }>> = {
  female: [
    { id: "Xb7hH8MSUJpSbSDYk0k2", accent: "British" }, // Alice
    { id: "EXAVITQu4vr4xnSDxMaL", accent: "American" }, // Sarah
    { id: "pFZP5JQG7iQjIQuC4Bku", accent: "British" }, // Lily
    { id: "21m00Tcm4TlvDq8ikWAM", accent: "American" }, // Rachel
  ],
  male: [
    { id: "JBFqnCBsd6RMkjVDRZzb", accent: "British" }, // George
    { id: "nPczCjzI2devNBz1zQrb", accent: "American" }, // Brian
    { id: "onwK4e9ZLuTAKqWW03F9", accent: "British" }, // Daniel
    { id: "iP95p4xoKVk53GoZ742B", accent: "American" }, // Chris
  ],
};

/** OpenAI voices by gender, for the local generator script. */
const OPENAI_VOICES: Record<Gender, string[]> = {
  female: ["coral", "nova", "shimmer", "sage"],
  male: ["onyx", "ash", "echo", "ballad"],
};
const ACCENTS = ["British (southern England)", "Australian", "North American", "British (northern England)", "New Zealand", "Canadian"];

export interface Casting {
  gender: Gender;
  /** OpenAI voice name. */
  voice: string;
  /** ElevenLabs voice id. */
  elevenVoice: string;
  accent: string;
}

/**
 * Speakers are cast in order of first appearance: each gets a voice of the
 * right gender that no one else in the part has, and the accent rotates with
 * the part number so a whole test hears the mix IELTS uses.
 */
export function castSpeakers(turns: ScriptTurn[], partNumber = 1): Map<string, Casting> {
  const cast = new Map<string, Casting>();
  const used: Record<Gender, number> = { female: 0, male: 0 };
  for (const { speaker } of turns) {
    if (cast.has(speaker)) continue;
    const gender = guessGender(speaker) ?? (used.female <= used.male ? "female" : "male");
    const n = used[gender]++ + partNumber;
    const eleven = ELEVEN_VOICES[gender][n % ELEVEN_VOICES[gender].length];
    cast.set(speaker, {
      gender,
      voice: OPENAI_VOICES[gender][n % OPENAI_VOICES[gender].length],
      elevenVoice: eleven.id,
      accent: n % 2 === 0 ? eleven.accent : ACCENTS[(cast.size + partNumber) % ACCENTS.length],
    });
  }
  return cast;
}

/** TTS calls take at most 4096 characters; split long turns at sentences. */
export function chunkText(text: string, max = 3500): string[] {
  if (text.length <= max) return [text];
  const sentences = text.match(/[^.!?]+[.!?]+["')\]]*\s*|[^.!?]+$/g) ?? [text];
  const chunks: string[] = [];
  let current = "";
  for (const s of sentences) {
    if ((current + s).length > max && current) {
      chunks.push(current.trim());
      current = "";
    }
    current += s;
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks;
}
