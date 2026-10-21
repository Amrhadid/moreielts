import { createClient } from "@supabase/supabase-js";

/**
 * Browser Supabase client.
 *
 * Only the publishable (anon) key is ever exposed here — every rule that
 * matters is enforced by RLS and by the SECURITY DEFINER RPCs, not by this
 * client. The service-role key exists only inside Edge Functions.
 */
/**
 * The project MoreIELTS shares with MoreTOEFL (accounts, Google sign-in, the
 * claude-completion function). Both values are publishable, so they are safe
 * to ship as defaults; a build that sets VITE_SUPABASE_URL and
 * VITE_SUPABASE_ANON_KEY still overrides them.
 */
export const DEFAULT_SUPABASE_URL = "https://nlsuvapjkznatczghvay.supabase.co";
export const DEFAULT_SUPABASE_ANON_KEY = "sb_publishable_7ehXXiaMvUlfBQX_zMbDbw_ppOo0lxc";

const url: string = import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const anonKey: string = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

if (url !== DEFAULT_SUPABASE_URL) {
  // A stale VITE_SUPABASE_URL in the deployment's build settings has pointed
  // production at a project that no longer exists; make that visible.
  console.warn(
    `Supabase client is configured for ${url}, not the shared project ${DEFAULT_SUPABASE_URL}. ` +
      "Check VITE_SUPABASE_URL in the build environment.",
  );
}

/*
 * Deliberately untyped: the generated Database type is not available until the
 * project is linked, and a hand-written stub would give false confidence. The
 * row shapes in ~/types/database are applied at each call site instead.
 */
export const supabase = createClient(url, anonKey, {
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
