import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Logo } from "~/components/layout/Logo";
import { Button } from "~/components/ui/Button";
import { Card, CardBody } from "~/components/ui/Card";
import { useAuth } from "~/lib/auth";
import { supabase } from "~/lib/supabase";

export const Route = createFileRoute("/login")({
  /** `oauth_error` is set by /auth/callback when Google sign-in fails, so the
   *  reason is shown. Optional, so plain links to /login need no search. */
  validateSearch: (s: Record<string, unknown>): { oauth_error?: string } =>
    typeof s.oauth_error === "string" ? { oauth_error: s.oauth_error } : {},
  component: LoginPage,
});

/**
 * Google is the only way in: accounts are shared with MoreTOEFL, and Google
 * sign-in means no passwords to manage or reset. New users are created on
 * their first Google sign-in, so there is no separate sign-up form.
 */
function LoginPage() {
  const navigate = useNavigate();
  const { oauth_error } = Route.useSearch();
  const { session } = useAuth();
  const [googleError, setGoogleError] = useState<string | null>(oauth_error ?? null);
  const [googleBusy, setGoogleBusy] = useState(false);

  useEffect(() => {
    if (session) navigate({ to: "/" });
  }, [session, navigate]);

  async function signInWithGoogle() {
    setGoogleError(null);
    setGoogleBusy(true);
    try {
      // Supabase only honours redirectTo when the origin is listed under
      // Authentication → URL Configuration → Redirect URLs for the project;
      // otherwise it falls back to the project's Site URL and the PKCE
      // verifier stored on this origin is never found. See the README.
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent("/")}`,
        },
      });
      if (error) throw error;
      // The browser is now on its way to Google; leave the button busy.
    } catch (err) {
      setGoogleError(
        err instanceof Error ? err.message : "Google sign-in failed. Please try again.",
      );
      setGoogleBusy(false);
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-paper px-4 py-10">
      <div className="w-full max-w-sm">
        <Link to="/" className="mb-6 flex justify-center">
          <Logo />
        </Link>
        <Card>
          <CardBody className="pt-6">
            <h1 className="text-xl font-semibold tracking-tight">Sign in to MoreIELTS</h1>
            <p className="mt-1 text-sm text-muted">
              Use your Google account. New here? Signing in creates your account.
            </p>

            <Button
              variant="outline"
              size="lg"
              className="mt-6 w-full"
              onClick={signInWithGoogle}
              disabled={googleBusy}
            >
              <GoogleIcon />
              {googleBusy ? "Opening Google…" : "Continue with Google"}
            </Button>
            {googleError && (
              <p
                role="alert"
                className="mt-3 rounded-lg border border-bad/20 bg-bad-soft px-3 py-2 text-sm text-bad"
              >
                {googleError}
              </p>
            )}

            <p className="mt-5 text-center text-xs leading-relaxed text-muted">
              Your MoreTOEFL Google account works here too.
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  );
}
