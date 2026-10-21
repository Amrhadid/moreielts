/**
 * grading-worker
 *
 * Drains grading_jobs. Called by the grading-sweep cron (every minute) and by
 * submit-attempt right after a submission, always with the x-grade-key header
 * (GRADING_WORKER_KEY). Deploy with --no-verify-jwt: the key is the auth.
 *
 * Each job is claimed with SKIP LOCKED, so overlapping invocations never grade
 * the same job twice. A failure leaves the job pending for the next sweep;
 * after five tries it is marked failed.
 */
import { json } from "../_shared/cors.ts";
import { serviceClient } from "../_shared/supabase.ts";
import { gradeAttemptSpeaking, gradeAttemptWriting, gradeEssay } from "../_shared/grading.ts";
import { scoreAttempt } from "../_shared/attempt-score.ts";

interface Job {
  id: string;
  kind: "writing" | "speaking" | "essay";
  attempt_id: string | null;
  submission_id: string | null;
  part_number: number | null;
  tries: number;
}

Deno.serve(async (req) => {
  const key = Deno.env.get("GRADING_WORKER_KEY");
  if (!key || req.headers.get("x-grade-key") !== key) {
    return json({ error: "forbidden" }, 403);
  }

  const body = await req.json().catch(() => ({}));
  const db = serviceClient();
  const { data: jobs, error } = await db.rpc("ielts_claim_grading_jobs", {
    p_limit: Math.min(Number(body.limit ?? 5), 10),
    p_job: body.job_id ?? null,
  });
  if (error) return json({ error: error.message }, 500);

  const results = await Promise.all(
    ((jobs ?? []) as Job[]).map(async (job) => {
      try {
        if (job.kind === "writing") {
          await gradeAttemptWriting(db, job.attempt_id!, job.part_number as 1 | 2);
        } else if (job.kind === "speaking") {
          await gradeAttemptSpeaking(db, job.attempt_id!, job.part_number as 1 | 2 | 3);
        } else {
          await gradeEssay(db, job.submission_id!);
        }
        await db
          .from("ielts_grading_jobs")
          .update({ status: "done", finished_at: new Date().toISOString(), last_error: null })
          .eq("id", job.id);
        return { id: job.id, ok: true };
      } catch (err) {
        const message = String((err as Error).message ?? err).slice(0, 1000);
        console.error("grading job failed", job.id, message);
        const exhausted = job.tries >= 5;
        await db
          .from("ielts_grading_jobs")
          .update({
            status: exhausted ? "failed" : "pending",
            last_error: message,
            ...(exhausted ? { finished_at: new Date().toISOString() } : {}),
          })
          .eq("id", job.id);
        if (exhausted && job.kind === "essay") {
          await db.from("ielts_writing_submissions").update({ status: "failed" }).eq("id", job.submission_id!);
        }
        return { id: job.id, ok: false, error: message };
      }
    }),
  );

  // Re-score every attempt touched, so the overall band appears as soon as
  // its last job lands.
  const attemptIds = new Set(
    ((jobs ?? []) as Job[]).filter((j) => j.attempt_id).map((j) => j.attempt_id!),
  );
  for (const attemptId of attemptIds) {
    try {
      await scoreAttempt(db, attemptId);
    } catch (err) {
      console.error("rescore failed", attemptId, err);
    }
  }

  return json({ processed: results.length, results });
});
