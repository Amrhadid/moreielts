import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "~/lib/supabase";

/**
 * OAuth landing route. Supabase sends the browser here with `?code=` (PKCE)
 * after Google sign-in; the client swaps the code for a session and we forward
 * to `next`. A provider error in the URL, or a failed exchange, is carried back
 * to /login so the learner sees why instead of a silent bounce.
 */
export const Route = createFileRoute("/auth/callback")({
  head: () => ({ meta: [{ name: "robots", content: "noindex, nofollow" }] }),
  validateSearch: (s: Record<string, unknown>) => ({
    next: typeof s.next === "string" ? s.next : undefined,
    code: typeof s.code === "string" ? s.code : undefined,
    error: typeof s.error === "string" ? s.error : undefined,
    error_description: typeof s.error_description === "string" ? s.error_description : undefined,
  }),
  component: AuthCallback,
});

/** Only same-origin paths are honoured, so `next` cannot bounce off-site. */
function safeNext(next: string | undefined): string {
  if (!next || !next.startsWith("/") || next.startsWith("//")) return "/";
  return next;
}

/**
 * The exchange fails with this message when the PKCE verifier is missing from
 * this origin's storage: the flow was started on a different origin, or the
 * provider redirected to a different URL than the one that started it.
 */
function describeExchangeError(message: string): string {
  if (/code verifier|both auth code and code verifier/i.test(message)) {
    return "Google sent you back to a different address than the one you started from, so the sign-in could not be completed. Check that this site's URL is listed under Redirect URLs in the Supabase project, then try again.";
  }
  return message;
}

function AuthCallback() {
  const { next, code, error, error_description } = Route.useSearch();
  const navigate = useNavigate();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const target = safeNext(next);

    const fail = (message: string) => {
      if (cancelled) return;
      setFailed(true);
      navigate({ to: "/login", search: { oauth_error: message }, replace: true });
    };

    if (error) {
      fail(error_description ?? error);
      return;
    }

    (async () => {
      // detectSessionInUrl normally exchanges the code before this runs; fall
      // back to an explicit exchange if no session is in place yet.
      const { data } = await supabase.auth.getSession();
      if (!data.session && code) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        if (exchangeError) {
          fail(describeExchangeError(exchangeError.message));
          return;
        }
      } else if (!data.session && !code) {
        fail("Google sign-in did not complete. Please try again.");
        return;
      }
      if (!cancelled) navigate({ to: target, replace: true });
    })();

    return () => {
      cancelled = true;
    };
  }, [next, code, error, error_description, navigate]);

  return (
    <div className="grid min-h-screen place-items-center bg-paper">
      <p className="text-sm text-muted">{failed ? "Returning to sign in…" : "Signing you in…"}</p>
    </div>
  );
}
