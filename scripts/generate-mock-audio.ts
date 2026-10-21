/**
 * Narrates the Listening parts of every mock exam (purpose "mock") from their
 * scripts, so the audio and the transcript learners review can never drift
 * apart. Output: public/audio/mock/<slug>-part-<n>.mp3 (with --all, practice
 * forms into public/audio/forms), which generate-seed uses as audio_url.
 *
 *   OPENAI_API_KEY=... npm run mock:audio            # only missing parts
 *   OPENAI_API_KEY=... npm run mock:audio -- --force # regenerate everything
 *
 * Each turn is synthesised with the speaker's own voice (gender from the
 * label, accent rotated across parts) and the turns are joined with short
 * pauses by ffmpeg, after a spoken "Part N" announcement as in the real test.
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { FORMS } from "./seed-content/forms";
import { castSpeakers, chunkText, parseScript } from "../src/lib/script-lines";

const ROOT = process.cwd();
const FORCE = process.argv.includes("--force");
/** --all also narrates the skill-practice forms (into public/audio/forms). */
const ALL = process.argv.includes("--all");
const outDir = (purpose: string | undefined) =>
  path.join(ROOT, "public", "audio", purpose === "mock" ? "mock" : "forms");
const PART_WORDS = ["one", "two", "three", "four"];

async function speak(text: string, voice: string, instructions: string, out: string) {
  for (let attempt = 1; ; attempt++) {
    try {
      const response = await fetch("https://api.openai.com/v1/audio/speech", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${process.env.OPENAI_API_KEY ?? ""}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini-tts",
          voice,
          input: text,
          instructions,
          response_format: "mp3",
        }),
      });
      if (!response.ok) throw new Error(`tts_${response.status}: ${await response.text()}`);
      writeFileSync(out, Buffer.from(await response.arrayBuffer()));
      return;
    } catch (error) {
      if (attempt >= 5) throw error;
      await new Promise((r) => setTimeout(r, 2000 * attempt));
    }
  }
}

async function narratePart(dir: string, slug: string, partNumber: number, script: string) {
  const target = path.join(dir, `${slug}-part-${partNumber}.mp3`);
  if (existsSync(target) && !FORCE) {
    console.log(`skip ${path.relative(ROOT, target)}`);
    return;
  }
  const turns = parseScript(script);
  const cast = castSpeakers(turns, partNumber);
  const work = mkdtempSync(path.join(tmpdir(), `${slug}-${partNumber}-`));

  const clips: Array<{ file: string; pause: number }> = [];
  const intro = path.join(work, "000.mp3");
  await speak(
    `Part ${PART_WORDS[partNumber - 1] ?? partNumber}.`,
    "sage",
    "Neutral British English exam announcer. Calm and clear.",
    intro,
  );
  clips.push({ file: intro, pause: 2 });

  let n = 1;
  for (const turn of turns) {
    const { voice, accent, gender } = cast.get(turn.speaker)!;
    const chunks = chunkText(turn.text, 3500);
    for (let c = 0; c < chunks.length; c++) {
      const file = path.join(work, `${String(n++).padStart(3, "0")}.mp3`);
      await speak(
        chunks[c],
        voice,
        `A ${gender === "female" ? "woman" : "man"} with a natural ${accent} English accent, ` +
          "speaking at a clear, natural pace as in an IELTS listening recording. " +
          "Read the text exactly as written; spell out letters one by one when a word is spelled.",
        file,
      );
      clips.push({ file, pause: c === chunks.length - 1 ? 0.6 : 0.2 });
    }
  }

  const filters = clips.map(
    (clip, i) => `[${i}:a]aformat=sample_rates=24000:channel_layouts=mono,apad=pad_dur=${clip.pause}[a${i}]`,
  );
  const graph =
    filters.join(";") + ";" + clips.map((_, i) => `[a${i}]`).join("") + `concat=n=${clips.length}:v=0:a=1[out]`;
  execFileSync(
    "ffmpeg",
    ["-y", "-loglevel", "error", ...clips.flatMap((c) => ["-i", c.file]), "-filter_complex", graph,
     "-map", "[out]", "-codec:a", "libmp3lame", "-b:a", "64k", target],
  );
  rmSync(work, { recursive: true, force: true });
  const seconds = execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", target])
    .toString()
    .trim();
  console.log(`wrote ${path.relative(ROOT, target)} · ${turns.length} turns · ${Math.round(Number(seconds))} s · ${[...cast.entries()].map(([s, c]) => `${s}=${c.voice}`).join(", ")}`);
}

async function main() {
  if (!process.env.OPENAI_API_KEY && !process.env.OPENAI_PROXY_INJECTED) {
    console.warn("OPENAI_API_KEY is not set; requests will fail unless a proxy injects it.");
  }
  const jobs: Array<() => Promise<void>> = [];
  for (const form of FORMS.filter((f) => ALL || f.purpose === "mock")) {
    const dir = outDir(form.purpose);
    mkdirSync(dir, { recursive: true });
    const listening = form.sections.find((s) => s.code === "listening");
    for (const group of listening?.itemGroups ?? []) {
      if (group.transcript) jobs.push(() => narratePart(dir, form.slug, group.partNumber, group.transcript!));
    }
  }
  // Four parts at a time: fast, and well inside the API's rate limits.
  let next = 0;
  await Promise.all(
    Array.from({ length: 4 }, async () => {
      while (next < jobs.length) await jobs[next++]();
    }),
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
