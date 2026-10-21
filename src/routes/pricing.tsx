import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Badge } from "~/components/ui/Badge";
import { Button } from "~/components/ui/Button";
import { Card, CardBody, CardDescription, CardHeader, CardTitle } from "~/components/ui/Card";
import { Input, Label } from "~/components/ui/Field";
import { Icon } from "~/components/ui/Icon";
import { useAuth } from "~/lib/auth";
import { useI18n } from "~/lib/i18n";
import { useCheckout } from "~/lib/practice-queries";
import { useRedeemCode } from "~/lib/queries";

export const Route = createFileRoute("/pricing")({
  validateSearch: (s: Record<string, unknown>): { paid?: 1; cancelled?: 1 } => ({
    paid: s.paid === 1 || s.paid === "1" ? 1 : undefined,
    cancelled: s.cancelled === 1 || s.cancelled === "1" ? 1 : undefined,
  }),
  component: Pricing,
});

/** What Premium includes. MoreIELTS has no free tier: this is the product. */
const FEATURES = [
  "Four full timed mock exams (Academic and General Training) with band scores",
  "Skill practice for Listening, Reading, Writing and Speaking with AI correction",
  "Question-type drills with explanations and a spaced-repetition mistake notebook",
  "Writing lab: examiner-style feedback, corrections and a band+1 rewrite",
  "Speaking feedback from your own recordings: fluency, vocabulary, grammar",
  "Topic vocabulary with Arabic meanings, a daily study plan and progress tracking",
];

/** Online card payments stay hidden until Stripe is configured for the site. */
const STRIPE_ENABLED = import.meta.env.VITE_STRIPE_ENABLED === "true";

function Pricing() {
  const { t } = useI18n();
  const { user, profile, isPremium } = useAuth();
  const search = Route.useSearch();
  const checkout = useCheckout();
  const queryClient = useQueryClient();

  // After Stripe returns, the webhook may land a moment later: poll the profile.
  useEffect(() => {
    if (!search.paid || isPremium) return;
    let count = 0;
    const timer = window.setInterval(() => {
      count += 1;
      void queryClient.invalidateQueries({ queryKey: ["profile"] });
      if (count >= 6) window.clearInterval(timer);
    }, 3000);
    return () => window.clearInterval(timer);
  }, [search.paid, isPremium, queryClient]);

  const expires = profile?.premium_expires_at
    ? new Date(profile.premium_expires_at).toLocaleDateString(undefined, { dateStyle: "long" })
    : null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">{t("pricing.title")}</h1>
      <p className="mt-2 text-muted">MoreIELTS is for Premium members. Unlock everything with an access code.</p>

      {search.paid && (
        <div role="status" className="mt-6 rounded-lg border border-good/20 bg-good-soft px-4 py-3 text-sm text-good">
          {isPremium
            ? "Payment received — Premium is active. Enjoy!"
            : "Payment received — Premium is being activated. This usually takes a few seconds."}
        </div>
      )}
      {search.cancelled && (
        <div role="status" className="mt-6 rounded-lg border border-warn/20 bg-warn-soft px-4 py-3 text-sm text-warn">
          Checkout was cancelled. You have not been charged.
        </div>
      )}

      {isPremium && (
        <div className="mt-6 flex flex-wrap items-center gap-2 rounded-lg border border-brand-100 bg-brand-50 px-4 py-3 text-sm text-brand-700">
          <Icon name="crown" size={18} />
          You are on Premium{expires ? ` until ${expires}` : ""}. Another code extends it.
        </div>
      )}

      {user ? (
        <RedeemBox />
      ) : (
        <Card className="mt-8">
          <CardBody className="flex flex-wrap items-center justify-between gap-3 pt-5">
            <p className="text-sm text-ink-soft">Sign in, then enter your access code to unlock Premium.</p>
            <Button asChild>
              <Link to="/login">Sign in</Link>
            </Button>
          </CardBody>
        </Card>
      )}

      <Card className="mt-6 border-brand-200">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle>Premium</CardTitle>
            <Badge tone="brand">Everything included</Badge>
          </div>
          <CardDescription>
            All MoreIELTS exams, practice and feedback are for Premium members. Ask your
            teacher or the MoreIELTS team for an access code.
          </CardDescription>
        </CardHeader>
        <CardBody>
          <ul className="grid gap-2 text-sm sm:grid-cols-2">
            {FEATURES.map((f) => (
              <li key={f} className="flex gap-2">
                <Icon name="check" size={18} className="shrink-0 text-brand-600" />
                {f}
              </li>
            ))}
          </ul>
          {STRIPE_ENABLED && user && (
            <>
              <div className="mt-6 grid gap-2 sm:grid-cols-2">
                <Button disabled={checkout.isPending} onClick={() => checkout.mutate("month")}>
                  Buy 30 days
                </Button>
                <Button
                  variant="secondary"
                  disabled={checkout.isPending}
                  onClick={() => checkout.mutate("quarter")}
                >
                  Buy 90 days
                </Button>
              </div>
              <p className="mt-2 text-xs text-muted">See price at checkout. One-off payment, no auto-renewal.</p>
              {checkout.isError && (
                <p className="mt-2 text-xs text-bad">
                  {(checkout.error as Error).message || "Could not start checkout."}
                </p>
              )}
            </>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

function RedeemBox() {
  const redeem = useRedeemCode();
  const [code, setCode] = useState("");
  return (
    <Card className="mt-8">
      <CardBody className="pt-5">
        <form
          className="flex flex-wrap items-end gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (code.trim()) redeem.mutate(code.trim(), { onSuccess: () => setCode("") });
          }}
        >
          <div className="min-w-56 flex-1">
            <Label htmlFor="redeem-code">Have an access code?</Label>
            <Input
              id="redeem-code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="XXXX-XXXX"
              autoComplete="off"
            />
          </div>
          <Button type="submit" variant="outline" disabled={redeem.isPending || !code.trim()}>
            {redeem.isPending ? "Redeeming…" : "Redeem"}
          </Button>
        </form>
        {redeem.isSuccess && <p className="mt-2 text-sm text-good">Code redeemed — your access is updated.</p>}
        {redeem.isError && (
          <p className="mt-2 text-sm text-bad">{(redeem.error as Error).message || "That code is not valid."}</p>
        )}
      </CardBody>
    </Card>
  );
}
