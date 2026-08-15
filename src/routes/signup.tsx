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
    <div className="grid min-h-screen place-items-center bg-paper px-4 py-10">
      <div className="w-full max-w-sm">
        <Link to="/" className="mb-6 flex justify-center">
          <Logo />
        </Link>
        <Card>
          <CardBody className="pt-6">
            {needsConfirmation ? (
              <>
                <h1 className="text-xl font-semibold tracking-tight">Check your email</h1>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  We sent a confirmation link. Open it to finish creating your
                  account, then sign in.
                </p>
                <Button asChild variant="outline" className="mt-5 w-full">
                  <Link to="/login">Back to sign in</Link>
                </Button>
              </>
            ) : (
              <>
                <h1 className="text-xl font-semibold tracking-tight">Create an account</h1>
                <p className="mt-1 text-sm text-muted">
                  Free practice, band-scored feedback and full mock tests.
                </p>

                <form onSubmit={handleSubmit(onSubmit)} className="mt-6 grid gap-4">
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
                    <p className="rounded-lg border border-bad/20 bg-bad-soft px-3 py-2 text-sm text-bad">
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

                <p className="mt-5 text-center text-sm text-muted">
                  Already registered?{" "}
                  <Link to="/login" className="font-medium text-brand-600">
                    Sign in
                  </Link>
                </p>
              </>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
