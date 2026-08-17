import { createClient } from "@supabase/supabase-js";

/**
 * Browser Supabase client.
 *
 * Only the publishable (anon) key is ever exposed here — every rule that
 * matters is enforced by RLS and by the SECURITY DEFINER RPCs, not by this
 * client. The service-role key exists only inside Edge Functions.
 */
const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  // Fail loudly at startup rather than with a confusing 401 later.
  console.error(
    "Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. See the README env var table.",
  );
}

/*
 * Deliberately untyped: the generated Database type is not available until the
 * project is linked, and a hand-written stub would give false confidence. The
 * row shapes in ~/types/database are applied at each call site instead.
 */
export const supabase = createClient(url ?? "", anonKey ?? "", {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

/** Invoke an Edge Function with the caller's access token attached. */
export async function invokeFunction<T>(
  name: string,
  body: Record<string, unknown>,
): Promise<T> {
  const { data, error } = await supabase.functions.invoke<T>(name, { body });
  if (error) throw error;
  return data as T;
}
