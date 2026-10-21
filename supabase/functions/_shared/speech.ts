/**
 * Speech for MoreIELTS on ElevenLabs, whose key (ELEVENLABS_API_KEY) the shared
 * project already holds for MoreTOEFL: transcription of Speaking answers
 * (Scribe, word timings) and narration of Listening scripts.
 */
const API = "https://api.elevenlabs.io/v1";
const key = () => {
  const value = Deno.env.get("ELEVENLABS_API_KEY");
  if (!value) throw new Error("elevenlabs_key_missing");
  return value;
};

export const TRANSCRIBE_MODEL = Deno.env.get("IELTS_STT_MODEL") ?? "scribe_v1";
export const TTS_MODEL = Deno.env.get("IELTS_TTS_MODEL") ?? "eleven_multilingual_v2";

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

/** Transcribes one recording, keeping hesitations ("um", "er") verbatim. */
export async function transcribe(audio: Blob): Promise<Transcription> {
  const form = new FormData();
  const extension = (audio.type.split("/")[1] ?? "webm").split(";")[0];
  form.append("file", audio, `answer.${extension}`);
  form.append("model_id", TRANSCRIBE_MODEL);
  form.append("language_code", "en");
  form.append("timestamps_granularity", "word");
  form.append("tag_audio_events", "false");

  const response = await fetch(`${API}/speech-to-text`, {
    method: "POST",
    headers: { "xi-api-key": key() },
    body: form,
  });
  if (!response.ok) {
    throw new Error(`elevenlabs_stt_${response.status}: ${(await response.text()).slice(0, 300)}`);
  }
  const body = await response.json();
  const words = ((body.words ?? []) as Array<{ text: string; start: number; end: number; type?: string }>)
    .filter((w) => (w.type ?? "word") === "word")
    .map((w) => ({ word: w.text, start: Number(w.start), end: Number(w.end) }));
  return {
    text: String(body.text ?? "").trim(),
    durationSeconds: words.length ? words[words.length - 1].end : 0,
    words,
  };
}

/** Narrates one turn as MP3 bytes with the given ElevenLabs voice. */
export async function synthesize(text: string, voiceId: string, speed = 0.95): Promise<Uint8Array> {
  const response = await fetch(`${API}/text-to-speech/${voiceId}?output_format=mp3_44100_128`, {
    method: "POST",
    headers: { "xi-api-key": key(), "Content-Type": "application/json", Accept: "audio/mpeg" },
    body: JSON.stringify({
      text,
      model_id: TTS_MODEL,
      voice_settings: { stability: 0.5, similarity_boost: 0.75, style: 0, use_speaker_boost: true, speed },
    }),
  });
  if (!response.ok) {
    throw new Error(`elevenlabs_tts_${response.status}: ${(await response.text()).slice(0, 300)}`);
  }
  return new Uint8Array(await response.arrayBuffer());
}
