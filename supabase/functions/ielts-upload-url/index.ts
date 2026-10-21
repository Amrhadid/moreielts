/**
 * upload-url
 *
 * Issues a short-lived presigned PUT URL for Cloudflare R2. The R2 access key
 * never leaves this function: the client receives only a URL that is valid for
 * one object key, one method, and a few minutes.
 *
 * Three kinds of upload are allowed:
 *   item_audio  — listening part audio      (admin only)
 *   item_image  — charts, maps, diagrams    (admin only)
 *   response_audio — a candidate's speaking recording (own attempt only)
 */
import { corsHeaders, json, preflight } from "../_shared/cors.ts";
import { getCaller, serviceClient } from "../_shared/supabase.ts";
import { EXPIRY_SECONDS, presignPut, publicUrl } from "../_shared/r2.ts";

type UploadKind = "item_audio" | "item_image" | "response_audio";

const ALLOWED_CONTENT_TYPES: Record<UploadKind, string[]> = {
  item_audio: ["audio/mpeg", "audio/mp4", "audio/aac", "audio/ogg"],
  item_image: ["image/png", "image/jpeg", "image/webp", "image/svg+xml"],
  response_audio: ["audio/webm", "audio/mp4", "audio/ogg", "audio/mpeg"],
};

const MAX_BYTES: Record<UploadKind, number> = {
  item_audio: 40 * 1024 * 1024,
  item_image: 8 * 1024 * 1024,
  response_audio: 25 * 1024 * 1024,
};

/* ------------------------------------------------------------------ *
 * Handler
 * ------------------------------------------------------------------ */

interface UploadBody {
  kind: UploadKind;
  content_type: string;
  file_size?: number;
  /** Required for response_audio, so ownership can be checked. */
  attempt_id?: string;
  question_id?: string;
  /** Optional label used to build a readable object key. */
  slug?: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return preflight();

  try {
    const user = await getCaller(req);
    if (!user) return json({ error: "unauthorized" }, 401);

    const body: UploadBody = await req.json();
    const { kind, content_type, file_size, attempt_id, question_id } = body;

    if (!kind || !(kind in ALLOWED_CONTENT_TYPES)) {
      return json({ error: "invalid_kind" }, 400);
    }
    if (!ALLOWED_CONTENT_TYPES[kind].includes(content_type)) {
      return json({ error: "content_type_not_allowed", allowed: ALLOWED_CONTENT_TYPES[kind] }, 400);
    }
    if (file_size && file_size > MAX_BYTES[kind]) {
      return json({ error: "file_too_large", max_bytes: MAX_BYTES[kind] }, 413);
    }

    const db = serviceClient();
    let objectKey: string;

    if (kind === "response_audio") {
      if (!attempt_id || !question_id) {
        return json({ error: "attempt_id_and_question_id_required" }, 400);
      }
      const { data: attempt } = await db
        .from("ielts_attempts")
        .select("id, user_id, status")
        .eq("id", attempt_id)
        .single();

      if (!attempt) return json({ error: "attempt_not_found" }, 404);
      if (attempt.user_id !== user.id) return json({ error: "forbidden" }, 403);
      if (!["in_progress", "awaiting_speaking"].includes(attempt.status)) {
        return json({ error: "attempt_not_active" }, 409);
      }

      objectKey = `responses/${attempt_id}/${question_id}-${Date.now()}.webm`;
    } else {
      // Content uploads are an admin operation.
      const { data: profile } = await db
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile?.role !== "admin") return json({ error: "forbidden" }, 403);

      const safeSlug = (body.slug ?? "asset")
        .toLowerCase()
        .replace(/[^a-z0-9-]+/g, "-")
        .slice(0, 60);
      const folder = kind === "item_audio" ? "audio" : "images";
      const extension = content_type.split("/")[1].replace("svg+xml", "svg");
      objectKey = `${folder}/${safeSlug}-${crypto.randomUUID()}.${extension}`;
    }

    const uploadUrl = await presignPut(objectKey, content_type);

    return json({
      upload_url: uploadUrl,
      object_key: objectKey,
      // Stored on item_groups.audio_url / image_url or responses.audio_url
      // once the PUT succeeds.
      public_url: publicUrl(objectKey),
      expires_in: EXPIRY_SECONDS,
      required_headers: { "Content-Type": content_type },
    });
  } catch (error) {
    console.error("upload-url failed", error);
    return new Response(
      JSON.stringify({ error: String((error as Error).message ?? error) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
