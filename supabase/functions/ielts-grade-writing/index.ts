/**
 * grade-writing
 *
 * On-demand (re-)grade of one Writing task of the caller's own attempt.
 * Normal grading happens in the background via grading-worker; this endpoint
 * is rate limited and exists for re-grades. The grading itself lives in
 * _shared/grading.ts.
 */
import { corsHeaders, json, preflight } from "../_shared/cors.ts";
import { checkRateLimit, getCaller, serviceClient } from "../_shared/supabase.ts";
import { gradeAttemptWriting } from "../_shared/grading.ts";
import { scoreAttempt } from "../_shared/attempt-score.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return preflight();

  try {
    const user = await getCaller(req);
    if (!user) return json({ error: "unauthorized" }, 401);

    const { attempt_id, task_number } = await req.json();
    if (!attempt_id || (task_number !== 1 && task_number !== 2)) {
      return json({ error: "attempt_id_and_task_number_required" }, 400);
    }

    const db = serviceClient();
    const { data: attempt } = await db
      .from("ielts_attempts")
      .select("user_id")
      .eq("id", attempt_id)
      .single();
    if (!attempt) return json({ error: "attempt_not_found" }, 404);
    if (attempt.user_id !== user.id) return json({ error: "forbidden" }, 403);

    const allowed = await checkRateLimit(db, user.id, "ielts-grade-writing", 6, 60, attempt_id);
    if (!allowed) return json({ error: "rate_limited", retry_after_minutes: 60 }, 429);

    const grade = await gradeAttemptWriting(db, attempt_id, task_number);
    await scoreAttempt(db, attempt_id);
    return json({ attempt_id, task_number, ...grade });
  } catch (error) {
    console.error("ielts-grade-writing failed", error);
    return new Response(
      JSON.stringify({ error: String((error as Error).message ?? error) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
