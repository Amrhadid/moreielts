/**
 * grade-speaking
 *
 * On-demand (re-)grade of one Speaking part of the caller's own attempt. The
 * transcript is produced server-side from the stored recordings; nothing the
 * client sends is graded. Normal grading runs in the background through
 * grading-worker.
 */
import { corsHeaders, json, preflight } from "../_shared/cors.ts";
import { checkRateLimit, getCaller, serviceClient } from "../_shared/supabase.ts";
import { gradeAttemptSpeaking } from "../_shared/grading.ts";
import { scoreAttempt } from "../_shared/attempt-score.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return preflight();

  try {
    const user = await getCaller(req);
    if (!user) return json({ error: "unauthorized" }, 401);

    const { attempt_id, part_number } = await req.json();
    if (!attempt_id || ![1, 2, 3].includes(part_number)) {
      return json({ error: "attempt_id_and_part_number_required" }, 400);
    }

    const db = serviceClient();
    const { data: attempt } = await db
      .from("ielts_attempts")
      .select("user_id")
      .eq("id", attempt_id)
      .single();
    if (!attempt) return json({ error: "attempt_not_found" }, 404);
    if (attempt.user_id !== user.id) return json({ error: "forbidden" }, 403);

    const allowed = await checkRateLimit(db, user.id, "ielts-grade-speaking", 9, 60, attempt_id);
    if (!allowed) return json({ error: "rate_limited", retry_after_minutes: 60 }, 429);

    await gradeAttemptSpeaking(db, attempt_id, part_number);
    await scoreAttempt(db, attempt_id);
    return json({ attempt_id, part_number, status: "graded" });
  } catch (error) {
    console.error("ielts-grade-speaking failed", error);
    return new Response(
      JSON.stringify({ error: String((error as Error).message ?? error) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
