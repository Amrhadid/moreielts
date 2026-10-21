/**
 * generate-audio
 *
 * Narrates one listening part from its script (item_group_scripts) with
 * OpenAI text-to-speech, uploads the MP3 to R2 and stores the URL on
 * item_groups.audio_url. Each speaker gets their own voice and accent
 * (src/lib/script-lines.ts). An unchanged script is skipped unless forced.
 *
 * Auth: an admin session, or the x-grade-key header for batch runs.
 * Body: { group_id, force? }. One part per call keeps each run well inside
 * the Edge Function time limit; /admin loops over a form's parts.
 */
import { corsHeaders, json, preflight } from "../_shared/cors.ts";
import { getCaller, serviceClient } from "../_shared/supabase.ts";
import { synthesize, TTS_MODEL } from "../_shared/openai.ts";
import { putObject } from "../_shared/r2.ts";
import { castSpeakers, chunkText, parseScript } from "../../../src/lib/script-lines.ts";

async function sha1(text: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-1", new TextEncoder().encode(text));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return preflight();

  try {
    const db = serviceClient();
    const key = Deno.env.get("GRADING_WORKER_KEY");
    if (!(key && req.headers.get("x-grade-key") === key)) {
      const user = await getCaller(req);
      if (!user) return json({ error: "unauthorized" }, 401);
      const { data: profile } = await db.from("profiles").select("role").eq("id", user.id).single();
      if (profile?.role !== "admin") return json({ error: "forbidden" }, 403);
    }

    const { group_id, force } = await req.json();
    if (!group_id) return json({ error: "group_id_required" }, 400);

    const { data: group } = await db
      .from("ielts_item_groups")
      .select("id, part_number, audio_url, test_sections:ielts_test_sections!inner ( section )")
      .eq("id", group_id)
      .single();
    // deno-lint-ignore no-explicit-any
    if (!group || (group as any).test_sections.section !== "listening") {
      return json({ error: "listening_part_not_found" }, 404);
    }

    const { data: script } = await db
      .from("ielts_item_group_scripts")
      .select("transcript, audio_script_hash")
      .eq("group_id", group_id)
      .maybeSingle();
    if (!script?.transcript) return json({ error: "no_script" }, 400);

    const hash = await sha1(`${TTS_MODEL}\n${script.transcript}`);
    if (!force && group.audio_url && script.audio_script_hash === hash) {
      return json({ group_id, audio_url: group.audio_url, skipped: true });
    }

    const turns = parseScript(script.transcript);
    const cast = castSpeakers(turns, group.part_number);

    // MP3 frames concatenate cleanly, so the part is the turns end to end.
    const pieces: Uint8Array[] = [];
    for (const turn of turns) {
      const { voice, accent } = cast.get(turn.speaker)!;
      for (const chunk of chunkText(turn.text)) {
        pieces.push(
          await synthesize(
            chunk,
            voice,
            `Speak with a natural ${accent} accent at a calm, clear pace, like a recording in an English listening exam. Do not add or drop words.`,
          ),
        );
      }
    }
    const total = pieces.reduce((n, p) => n + p.length, 0);
    const audio = new Uint8Array(total);
    let at = 0;
    for (const p of pieces) {
      audio.set(p, at);
      at += p.length;
    }

    const url = await putObject(`audio/generated/${group_id}-${hash.slice(0, 10)}.mp3`, audio, "audio/mpeg");

    await db.from("ielts_item_groups").update({ audio_url: url }).eq("id", group_id);
    await db.from("ielts_item_group_scripts").update({ audio_script_hash: hash }).eq("group_id", group_id);

    return json({
      group_id,
      audio_url: url,
      turns: turns.length,
      speakers: Object.fromEntries(cast),
      bytes: total,
    });
  } catch (error) {
    console.error("generate-audio failed", error);
    return new Response(
      JSON.stringify({ error: String((error as Error).message ?? error) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
