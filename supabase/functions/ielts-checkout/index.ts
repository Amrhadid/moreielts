/**
 * checkout
 *
 * Creates a Stripe Checkout Session for a Premium pass and returns its URL.
 * The learner's id travels as client_reference_id and in metadata; Premium is
 * granted only by stripe-webhook once Stripe confirms the payment.
 */
import { corsHeaders, json, preflight } from "../_shared/cors.ts";
import { getCaller } from "../_shared/supabase.ts";
import { isPlan, PLANS } from "../_shared/plans.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return preflight();

  try {
    const user = await getCaller(req);
    if (!user) return json({ error: "unauthorized" }, 401);

    const { plan } = await req.json();
    if (!isPlan(plan)) return json({ error: "unknown_plan" }, 400);

    const secret = Deno.env.get("STRIPE_SECRET_KEY");
    const price = Deno.env.get(PLANS[plan].priceEnv);
    if (!secret || !price) return json({ error: "payments_not_configured" }, 503);

    const site = (Deno.env.get("SITE_URL") ?? "").replace(/\/$/, "");
    const form = new URLSearchParams({
      mode: "payment",
      "line_items[0][price]": price,
      "line_items[0][quantity]": "1",
      client_reference_id: user.id,
      "metadata[user_id]": user.id,
      "metadata[plan]": plan,
      success_url: `${site}/pricing?paid=1`,
      cancel_url: `${site}/pricing?cancelled=1`,
      allow_promotion_codes: "true",
    });
    if (user.email) form.set("customer_email", user.email);

    const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secret}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: form,
    });
    const session = await response.json();
    if (!response.ok) {
      console.error("stripe checkout failed", session);
      return json({ error: "stripe_error" }, 502);
    }
    return json({ url: session.url });
  } catch (error) {
    console.error("ielts-checkout failed", error);
    return new Response(
      JSON.stringify({ error: String((error as Error).message ?? error) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
