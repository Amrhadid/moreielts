/**
 * Generates the listening practice MP3 from the transcript in
 * src/data/practice/listening.ts, so the audio and the transcript the learner
 * reviews can never drift apart.
 *
 * Run with:  npm run practice:audio
 *
 * Each line is synthesised separately (one voice per speaker) with the OpenAI
 * speech API, and the segments are joined with short pauses using ffmpeg. The
 * API key is read from OPENAI_API_KEY. The output is committed under
 * public/audio/practice, so this only needs re-running when a line changes.
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { LISTENING_SET, LISTENING_TRANSCRIPT } from "../src/data/practice/listening";

const VOICES: Record<string, string> = {
  Narrator: "sage",
  Tom: "onyx",
  Emma: "nova",
};

const INSTRUCTIONS: Record<string, string> = {
  Narrator:
    "Neutral British English announcer. Calm, clear, unhurried, like the introduction to an exam listening recording.",
  Tom: "Friendly middle-aged man with a natural southern British English accent, speaking on the telephone at a relaxed, clear conversational pace. Spell letters out individually and distinctly.",
  Emma: "Polite young woman with a natural British English accent, speaking on the telephone at a clear conversational pace.",
};

/** Seconds of silence inserted after each line. */
function pauseAfter(speaker: string, index: number): number {
  if (speaker === "Narrator") return index === 0 ? 4 : 1;
  return 0.6;
}

async function synthesise(speaker: string, text: string, out: string) {
  // The speech endpoint occasionally answers 5xx; one retry with a short
  // back-off is enough in practice.
  for (let attempt = 1; ; attempt++) {
    try {
      await synthesiseOnce(speaker, text, out);
      return;
    } catch (error) {
      if (attempt >= 4) throw error;
      console.warn(`  retrying (${(error as Error).message})`);
      await new Promise((r) => setTimeout(r, 1500 * attempt));
    }
  }
}

async function synthesiseOnce(speaker: string, text: string, out: string) {
  const response = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${process.env.OPENAI_API_KEY ?? ""}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini-tts",
      voice: VOICES[speaker] ?? "alloy",
      input: text,
      instructions: INSTRUCTIONS[speaker],
      response_format: "mp3",
      speed: 1.0,
    }),
  });
  if (!response.ok) {
    throw new Error(`tts_${response.status}: ${await response.text()}`);
  }
  writeFileSync(out, Buffer.from(await response.arrayBuffer()));
}

async function main() {
  // The script is bundled into node_modules/.cache before it runs, so the
  // repository root is the working directory, not a path relative to this file.
  const root = process.cwd();
  const target = path.join(root, "public", LISTENING_SET.audio!.src);
  mkdirSync(path.dirname(target), { recursive: true });

  const work = mkdtempSync(path.join(tmpdir(), "practice-audio-"));
  const inputs: string[] = [];
  const filters: string[] = [];

  for (let i = 0; i < LISTENING_TRANSCRIPT.length; i++) {
    const line = LISTENING_TRANSCRIPT[i];
    const colon = line.indexOf(":");
    const speaker = line.slice(0, colon).trim();
    const text = line.slice(colon + 1).trim();
    const file = path.join(work, `${String(i).padStart(2, "0")}.mp3`);
    process.stdout.write(`${speaker}: ${text.slice(0, 60)}…\n`);
    await synthesise(speaker, text, file);
    inputs.push(file);
    // Pad each segment with its trailing pause, resampled to one format so the
    // concat filter accepts every stream.
    filters.push(
      `[${i}:a]aformat=sample_rates=24000:channel_layouts=mono,apad=pad_dur=${pauseAfter(speaker, i)}[a${i}]`,
    );
  }

  const concat =
    filters.join(";") +
    ";" +
    inputs.map((_, i) => `[a${i}]`).join("") +
    `concat=n=${inputs.length}:v=0:a=1[out]`;

  execFileSync(
    "ffmpeg",
    [
      "-y",
      ...inputs.flatMap((f) => ["-i", f]),
      "-filter_complex",
      concat,
      "-map",
      "[out]",
      "-codec:a",
      "libmp3lame",
      "-b:a",
      "96k",
      target,
    ],
    { stdio: "inherit" },
  );

  rmSync(work, { recursive: true, force: true });
  const seconds = execFileSync("ffprobe", [
    "-v",
    "error",
    "-show_entries",
    "format=duration",
    "-of",
    "csv=p=0",
    target,
  ])
    .toString()
    .trim();
  console.log(`Wrote ${path.relative(root, target)} (${Number(seconds).toFixed(0)} s)`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
