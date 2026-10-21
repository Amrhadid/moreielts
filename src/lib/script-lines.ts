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

const VOICES = ["coral", "onyx", "nova", "ash", "sage", "echo", "shimmer", "ballad", "fable", "alloy"];
const ACCENTS = ["British (southern England)", "Australian", "North American", "British (northern England)", "New Zealand", "Canadian"];

export interface Casting {
  voice: string;
  accent: string;
}

/**
 * Speakers are cast in order of first appearance so two speakers in one part
 * never share a voice; the accent rotates with an offset from the part so a
 * whole test hears the mix of accents IELTS uses.
 */
export function castSpeakers(turns: ScriptTurn[], partNumber = 1): Map<string, Casting> {
  const cast = new Map<string, Casting>();
  for (const { speaker } of turns) {
    if (cast.has(speaker)) continue;
    const i = cast.size;
    cast.set(speaker, {
      voice: VOICES[(i + partNumber * 3) % VOICES.length],
      accent: ACCENTS[(i + partNumber) % ACCENTS.length],
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
