import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { z } from "zod";
import { Logo } from "~/components/layout/Logo";
import { Button } from "~/components/ui/Button";
import { Card, CardBody } from "~/components/ui/Card";
import { Input, Label } from "~/components/ui/Field";
import { useAuth } from "~/lib/auth";
import { supabase } from "~/lib/supabase";

export const Route = createFileRoute("/login")({
  /** `oauth_error` is set by /auth/callback when Google sign-in fails, so the
   *  reason is shown. Optional, so plain links to /login need no search. */
  validateSearch: (s: Record<string, unknown>): { oauth_error?: string } =>
    typeof s.oauth_error === "string" ? { oauth_error: s.oauth_error } : {},
  component: LoginPage,
});

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Passwords are at least 8 characters"),
});

type FormValues = z.infer<typeof schema>;

function LoginPage() {
  const navigate = useNavigate();
  const { oauth_error } = Route.useSearch();
  const { session } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  const [googleError, setGoogleError] = useState<string | null>(oauth_error ?? null);
  const [googleBusy, setGoogleBusy] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (session) navigate({ to: "/" });
  }, [session, navigate]);

  async function onSubmit(values: FormValues) {
    setServerError(null);
    const { error } = await supabase.auth.signInWithPassword(values);
    if (error) {
      setServerError(error.message);
      return;
    }
    navigate({ to: "/" });
  }

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
            <h1 className="text-xl font-semibold tracking-tight">Sign in</h1>
            <p className="mt-1 text-sm text-muted">
              Continue your practice where you left off.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 grid gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" autoComplete="email" {...register("email")} />
                {errors.email && (
                  <p className="mt-1 text-xs text-bad">{errors.email.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="mt-1 text-xs text-bad">{errors.password.message}</p>
                )}
              </div>

              {serverError && (
                <p className="rounded-lg border border-bad/20 bg-bad-soft px-3 py-2 text-sm text-bad">
                  {serverError}
                </p>
              )}

              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Signing in…" : "Sign in"}
              </Button>
            </form>

            <div className="my-5 flex items-center gap-3 text-xs text-muted">
              <span className="h-px flex-1 bg-line" />
              or
              <span className="h-px flex-1 bg-line" />
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={signInWithGoogle}
              disabled={googleBusy}
            >
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

            <p className="mt-5 text-center text-sm text-muted">
              No account?{" "}
              <Link to="/signup" className="font-medium text-brand-600">
                Create one
              </Link>
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
