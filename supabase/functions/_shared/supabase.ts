import { createClient, type SupabaseClient } from "jsr:@supabase/supabase-js@2";

/**
 * Service-role client. Bypasses RLS and is the ONLY writer of is_correct and
 * of every score table. Never returned to, or constructed from, the client.
 */
export function serviceClient(): SupabaseClient {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } },
  );
}

/**
 * Resolves the caller from the Authorization header. Returns null when the
 * token is missing or invalid; every function treats that as a 401.
 */
export async function getCaller(req: Request) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  const anon = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: authHeader } }, auth: { persistSession: false } },
  );

  const { data, error } = await anon.auth.getUser();
  if (error || !data.user) return null;
  return data.user;
}

/**
 * Fixed-window rate limit backed by ai_grading_usage. Returns true when the
 * call is allowed and records it.
 */
export async function checkRateLimit(
  db: SupabaseClient,
  userId: string,
  functionName: string,
  limit: number,
  windowMinutes: number,
  attemptId?: string,
): Promise<boolean> {
  const since = new Date(Date.now() - windowMinutes * 60_000).toISOString();

  const { count, error } = await db
    .from("ai_grading_usage")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("function_name", functionName)
    .gte("created_at", since);

  if (error) throw error;
  if ((count ?? 0) >= limit) return false;

  await db.from("ai_grading_usage").insert({
    user_id: userId,
    function_name: functionName,
    attempt_id: attemptId ?? null,
  });
  return true;
}
