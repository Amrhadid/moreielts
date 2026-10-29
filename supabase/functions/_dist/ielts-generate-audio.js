// supabase/functions/_shared/cors.ts
var ALLOWED_ORIGIN = Deno.env.get("SITE_URL") ?? "*";
var corsHeaders = {
  "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};
function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
}
function preflight() {
  return new Response("ok", { headers: corsHeaders });
}

// supabase/functions/_shared/supabase.ts
import { createClient } from "jsr:@supabase/supabase-js@2";
function serviceClient() {
  return createClient(
    Deno.env.get("SUPABASE_URL"),
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"),
    { auth: { persistSession: false } }
  );
}
async function getCaller(req) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  const anon = createClient(
    Deno.env.get("SUPABASE_URL"),
    Deno.env.get("SUPABASE_ANON_KEY"),
    { global: { headers: { Authorization: authHeader } }, auth: { persistSession: false } }
  );
  const { data, error } = await anon.auth.getUser();
  if (error || !data.user) return null;
  return data.user;
}

// supabase/functions/_shared/speech.ts
var API = "https://api.elevenlabs.io/v1";
var key = () => {
  const value = Deno.env.get("ELEVENLABS_API_KEY");
  if (!value) throw new Error("elevenlabs_key_missing");
  return value;
};
var TRANSCRIBE_MODEL = Deno.env.get("IELTS_STT_MODEL") ?? "scribe_v1";
var TTS_MODEL = Deno.env.get("IELTS_TTS_MODEL") ?? "eleven_multilingual_v2";
async function synthesize(text, voiceId, speed = 0.95) {
  const response = await fetch(`${API}/text-to-speech/${voiceId}?output_format=mp3_44100_128`, {
    method: "POST",
    headers: { "xi-api-key": key(), "Content-Type": "application/json", Accept: "audio/mpeg" },
    body: JSON.stringify({
      text,
      model_id: TTS_MODEL,
      voice_settings: { stability: 0.5, similarity_boost: 0.75, style: 0, use_speaker_boost: true, speed }
    })
  });
  if (!response.ok) {
    throw new Error(`elevenlabs_tts_${response.status}: ${(await response.text()).slice(0, 300)}`);
  }
  return new Uint8Array(await response.arrayBuffer());
}

// src/lib/script-lines.ts
function parseScript(script) {
  const turns = [];
  for (const raw of script.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line) continue;
    const match = /^([A-Z][A-Za-z .'-]{0,40}):\s*(.+)$/.exec(line);
    if (match) {
      turns.push({ speaker: match[1].trim(), text: match[2].trim() });
    } else if (turns.length) {
      turns[turns.length - 1].text += ` ${line}`;
    } else {
      turns.push({ speaker: "NARRATOR", text: line });
    }
  }
  return turns;
}
var FEMALE_NAMES = new Set(
  "anna ana alice amy amelia ann anne beth bella carla carol caroline charlotte chloe claire diana ella ellie emily emma eva fatima grace hannah helen holly isabel jane jasmine jenny jess jessica julia karen kate katie laura layla leila lily linda lisa lucy maria mary maya mia molly nadia nina nora olivia paula priya rachel rebecca rosa ruth sally sara sarah sophie susan tara una vanessa zara zoe clare gemma harriet imogen joanna kirsty lauren megan natalie sian tanya yasmin zainab aisha amira beatrice eleanor fiona georgia heather iris joy louise martha naomi phoebe rita shona tessa violet wendy abigail alison bridget catherine deborah esther freya gloria hazel ingrid janet kim lena margaret noor olga pam ruby sophia vera".split(" ")
);
var MALE_HINTS = /* @__PURE__ */ new Set(["mr", "sir", "man", "father", "dad", "boy"]);
var FEMALE_HINTS = /* @__PURE__ */ new Set(["mrs", "ms", "miss", "woman", "mother", "mum", "girl", "lady"]);
function guessGender(speaker) {
  const words = speaker.toLowerCase().replace(/[^a-z\s-]/g, " ").split(/\s+/).filter(Boolean);
  if (words.some((w) => FEMALE_HINTS.has(w))) return "female";
  if (words.some((w) => MALE_HINTS.has(w))) return "male";
  const first = words.find((w) => !["dr", "prof", "professor"].includes(w));
  if (!first) return null;
  if (FEMALE_NAMES.has(first)) return "female";
  return /^(tutor|lecturer|narrator|announcer|receptionist|guide|presenter|manager|officer|agent|speaker)$/.test(first) ? null : "male";
}
var ELEVEN_VOICES = {
  female: [
    { id: "Xb7hH8MSUJpSbSDYk0k2", accent: "British" },
    // Alice
    { id: "EXAVITQu4vr4xnSDxMaL", accent: "American" },
    // Sarah
    { id: "pFZP5JQG7iQjIQuC4Bku", accent: "British" },
    // Lily
    { id: "21m00Tcm4TlvDq8ikWAM", accent: "American" }
    // Rachel
  ],
  male: [
    { id: "JBFqnCBsd6RMkjVDRZzb", accent: "British" },
    // George
    { id: "nPczCjzI2devNBz1zQrb", accent: "American" },
    // Brian
    { id: "onwK4e9ZLuTAKqWW03F9", accent: "British" },
    // Daniel
    { id: "iP95p4xoKVk53GoZ742B", accent: "American" }
    // Chris
  ]
};
var OPENAI_VOICES = {
  female: ["coral", "nova", "shimmer", "sage"],
  male: ["onyx", "ash", "echo", "ballad"]
};
var ACCENTS = ["British (southern England)", "Australian", "North American", "British (northern England)", "New Zealand", "Canadian"];
function castSpeakers(turns, partNumber = 1) {
  const cast = /* @__PURE__ */ new Map();
  const used = { female: 0, male: 0 };
  for (const { speaker } of turns) {
    if (cast.has(speaker)) continue;
    const gender = guessGender(speaker) ?? (used.female <= used.male ? "female" : "male");
    const n = used[gender]++ + partNumber;
    const eleven = ELEVEN_VOICES[gender][n % ELEVEN_VOICES[gender].length];
    cast.set(speaker, {
      gender,
      voice: OPENAI_VOICES[gender][n % OPENAI_VOICES[gender].length],
      elevenVoice: eleven.id,
      accent: n % 2 === 0 ? eleven.accent : ACCENTS[(cast.size + partNumber) % ACCENTS.length]
    });
  }
  return cast;
}
function chunkText(text, max = 3500) {
  if (text.length <= max) return [text];
  const sentences = text.match(/[^.!?]+[.!?]+["')\]]*\s*|[^.!?]+$/g) ?? [text];
  const chunks = [];
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

// supabase/functions/ielts-generate-audio/index.ts
async function sha1(text) {
  const digest = await crypto.subtle.digest("SHA-1", new TextEncoder().encode(text));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return preflight();
  try {
    const db = serviceClient();
    const user = await getCaller(req);
    if (!user) return json({ error: "unauthorized" }, 401);
    const { data: profile } = await db.from("profiles").select("role").eq("id", user.id).single();
    if (profile?.role !== "admin") return json({ error: "forbidden" }, 403);
    const { group_id, force } = await req.json();
    if (!group_id) return json({ error: "group_id_required" }, 400);
    const { data: group } = await db.from("ielts_item_groups").select("id, part_number, audio_url, test_sections:ielts_test_sections!inner ( section )").eq("id", group_id).single();
    if (!group || group.test_sections.section !== "listening") {
      return json({ error: "listening_part_not_found" }, 404);
    }
    const { data: script } = await db.from("ielts_item_group_scripts").select("transcript, audio_script_hash").eq("group_id", group_id).maybeSingle();
    if (!script?.transcript) return json({ error: "no_script" }, 400);
    const hash = await sha1(`${TTS_MODEL}
${script.transcript}`);
    if (!force && group.audio_url && script.audio_script_hash === hash) {
      return json({ group_id, audio_url: group.audio_url, skipped: true });
    }
    const turns = parseScript(script.transcript);
    const cast = castSpeakers(turns, group.part_number);
    const pieces = [];
    for (const turn of turns) {
      const { elevenVoice } = cast.get(turn.speaker);
      for (const chunk of chunkText(turn.text, 2500)) {
        pieces.push(await synthesize(chunk, elevenVoice));
      }
    }
    const total = pieces.reduce((n, p) => n + p.length, 0);
    const audio = new Uint8Array(total);
    let at = 0;
    for (const p of pieces) {
      audio.set(p, at);
      at += p.length;
    }
    const path = `audio/generated/${group_id}-${hash.slice(0, 10)}.mp3`;
    const { error: uploadError } = await db.storage.from("ielts-media").upload(path, audio, { contentType: "audio/mpeg", upsert: true });
    if (uploadError) throw uploadError;
    const url = db.storage.from("ielts-media").getPublicUrl(path).data.publicUrl;
    await db.from("ielts_item_groups").update({ audio_url: url }).eq("id", group_id);
    await db.from("ielts_item_group_scripts").update({ audio_script_hash: hash }).eq("group_id", group_id);
    return json({
      group_id,
      audio_url: url,
      turns: turns.length,
      speakers: Object.fromEntries(cast),
      bytes: total
    });
  } catch (error) {
    console.error("generate-audio failed", error);
    return new Response(
      JSON.stringify({ error: String(error.message ?? error) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
