import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { z } from "zod";
import { Logo } from "~/components/layout/Logo";
import { Button } from "~/components/ui/Button";
import { Card, CardBody } from "~/components/ui/Card";
import { Input, Label } from "~/components/ui/Field";
import { supabase } from "~/lib/supabase";

export const Route = createFileRoute("/signup")({ component: SignupPage });

const schema = z.object({
  fullName: z.string().min(2, "Enter your name"),
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Use at least 8 characters"),
});

type FormValues = z.infer<typeof schema>;

function SignupPage() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    setServerError(null);
    // The profiles row is created by the on_auth_user_created trigger, so
    // there is nothing to insert here.
    const { data, error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: { data: { full_name: values.fullName } },
    });
    if (error) {
      setServerError(error.message);
      return;
    }
    if (!data.session) {
      setNeedsConfirmation(true);
      return;
    }
    navigate({ to: "/" });
  }

  async function signUpWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) setServerError(error.message);
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-paper px-4 py-10 sm:justify-center">
      <div className="w-full max-w-sm">
        <Link to="/" className="mb-8 flex justify-center" aria-label="MoreIELTS home">
          <Logo />
        </Link>

        {needsConfirmation ? (
          <>
            <h1 className="display text-center text-[1.75rem] leading-tight">Check your email</h1>
            <p className="mt-1.5 text-center text-sm text-muted">
              We sent a confirmation link. Open it to finish creating your account, then sign
              in.
            </p>
            <Button asChild variant="outline" className="mt-6 w-full">
              <Link to="/login">Back to sign in</Link>
            </Button>
          </>
        ) : (
          <>
            <h1 className="display text-center text-[1.75rem] leading-tight">
              Create your account
            </h1>
            <p className="mt-1.5 text-center text-sm text-muted">
              Free practice, band-scored feedback and full mock tests.
            </p>

            <Card className="mt-6">
              <CardBody className="pt-5">
                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4" noValidate>
                  <div>
                    <Label htmlFor="fullName">Full name</Label>
                    <Input id="fullName" autoComplete="name" {...register("fullName")} />
                    {errors.fullName && (
                      <p className="mt-1 text-xs text-bad">{errors.fullName.message}</p>
                    )}
                  </div>
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
                      autoComplete="new-password"
                      {...register("password")}
                    />
                    {errors.password && (
                      <p className="mt-1 text-xs text-bad">{errors.password.message}</p>
                    )}
                  </div>

                  {serverError && (
                    <p
                      role="alert"
                      className="rounded-lg border border-bad/20 bg-bad-soft px-3 py-2 text-sm text-bad"
                    >
                      {serverError}
                    </p>
                  )}

                  <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? "Creating account…" : "Create account"}
                  </Button>
                </form>

                <div className="my-5 flex items-center gap-3 text-xs text-muted">
                  <span className="h-px flex-1 bg-line" />
                  or
                  <span className="h-px flex-1 bg-line" />
                </div>

                <Button variant="outline" className="w-full" onClick={signUpWithGoogle}>
                  Continue with Google
                </Button>
              </CardBody>
            </Card>

            <p className="mt-5 text-center text-sm text-muted">
              Already registered?{" "}
              <Link to="/login" className="font-semibold text-brand-600">
                Sign in
              </Link>
            </p>
            <p className="mt-3 text-center text-xs text-muted">
              By creating an account you agree to the{" "}
              <Link to="/terms" className="underline hover:text-ink">
                terms
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="underline hover:text-ink">
                privacy notice
              </Link>
              .
            </p>
          </>
        )}
      </div>
    </div>
  );
}
