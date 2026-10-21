/**
 * OpenAI speech endpoints: transcription of Speaking recordings and
 * text-to-speech for Listening parts. The key lives only in the Edge Function
 * environment (OPENAI_API_KEY).
 */
const API = "https://api.openai.com/v1";
const key = () => {
  const value = Deno.env.get("OPENAI_API_KEY");
  if (!value) throw new Error("openai_key_missing");
  return value;
};

export const TRANSCRIBE_MODEL = Deno.env.get("TRANSCRIBE_MODEL") ?? "whisper-1";
export const TTS_MODEL = Deno.env.get("TTS_MODEL") ?? "gpt-4o-mini-tts";

export interface TranscriptWord {
  word: string;
  start: number;
  end: number;
}

export interface Transcription {
  text: string;
  durationSeconds: number;
  words: TranscriptWord[];
}

/** Fetches a recording by URL and transcribes it with word timings. */
export async function transcribeUrl(audioUrl: string): Promise<Transcription> {
  const audio = await fetch(audioUrl);
  if (!audio.ok) throw new Error(`recording_fetch_failed_${audio.status}`);
  const blob = await audio.blob();
  const extension = (blob.type.split("/")[1] ?? "webm").split(";")[0];

  const form = new FormData();
  form.append("file", blob, `answer.${extension}`);
  form.append("model", TRANSCRIBE_MODEL);
  form.append("language", "en");
  form.append("response_format", "verbose_json");
  form.append("timestamp_granularities[]", "word");
  // Without a prompt Whisper silently drops "um" and "er", which are exactly
  // the hesitations the fluency criterion needs to see.
  form.append("prompt", "Umm, let me think, like, hmm... Er, I mean, you know, uh.");

  const response = await fetch(`${API}/audio/transcriptions`, {
    method: "POST",
    headers: { Authorization: `Bearer ${key()}` },
    body: form,
  });
  if (!response.ok) {
    throw new Error(`openai_transcribe_${response.status}: ${await response.text()}`);
  }
  const body = await response.json();
  return {
    text: String(body.text ?? "").trim(),
    durationSeconds: Number(body.duration ?? 0),
    words: (body.words ?? []) as TranscriptWord[],
  };
}

/** Synthesises one line of speech as MP3 bytes. */
export async function synthesize(
  text: string,
  voice: string,
  instructions?: string,
): Promise<Uint8Array> {
  const response = await fetch(`${API}/audio/speech`, {
    method: "POST",
    headers: { Authorization: `Bearer ${key()}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: TTS_MODEL,
      voice,
      input: text,
      response_format: "mp3",
      ...(instructions ? { instructions } : {}),
    }),
  });
  if (!response.ok) {
    throw new Error(`openai_tts_${response.status}: ${await response.text()}`);
  }
  return new Uint8Array(await response.arrayBuffer());
}
