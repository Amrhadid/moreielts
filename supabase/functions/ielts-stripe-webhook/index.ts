/**
 * stripe-webhook
 *
 * Receives checkout.session.completed from Stripe, verifies the signature
 * (STRIPE_WEBHOOK_SECRET), and grants Premium through grant_paid_premium(),
 * which is idempotent on the session id: Stripe retries are harmless.
 * Deploy with --no-verify-jwt; the signature is the auth.
 */
import { serviceClient } from "../_shared/supabase.ts";
import { isPlan, PLANS } from "../_shared/plans.ts";

const TOLERANCE_SECONDS = 300;

async function verify(payload: string, header: string, secret: string): Promise<boolean> {
  const parts = Object.fromEntries(
    header.split(",").map((kv) => kv.split("=") as [string, string]),
  );
  const timestamp = Number(parts.t);
  const signatures = header
    .split(",")
    .filter((kv) => kv.startsWith("v1="))
    .map((kv) => kv.slice(3));
  if (!timestamp || !signatures.length) return false;
  if (Math.abs(Date.now() / 1000 - timestamp) > TOLERANCE_SECONDS) return false;

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const mac = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`${timestamp}.${payload}`));
  const expected = [...new Uint8Array(mac)].map((b) => b.toString(16).padStart(2, "0")).join("");

  // Constant-time comparison against each v1 signature.
  return signatures.some((sig) => {
    if (sig.length !== expected.length) return false;
    let diff = 0;
    for (let i = 0; i < sig.length; i++) diff |= sig.charCodeAt(i) ^ expected.charCodeAt(i);
    return diff === 0;
  });
}

Deno.serve(async (req) => {
  const secret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  const signature = req.headers.get("stripe-signature");
  const payload = await req.text();
  if (!secret || !signature || !(await verify(payload, signature, secret))) {
    return new Response("invalid signature", { status: 400 });
  }

  const event = JSON.parse(payload);
  if (event.type !== "checkout.session.completed") {
    return new Response("ignored", { status: 200 });
  }

  const session = event.data.object;
  const plan = session.metadata?.plan;
  const userId = session.metadata?.user_id ?? session.client_reference_id;
  if (session.payment_status !== "paid" || !isPlan(plan) || !userId) {
    return new Response("not a paid premium session", { status: 200 });
  }

  const db = serviceClient();
  const { error } = await db.rpc("ielts_grant_paid_premium", {
    p_session_id: session.id,
    p_user: userId,
    p_plan: plan,
    p_days: PLANS[plan].days,
    p_amount: session.amount_total ?? null,
    p_currency: session.currency ?? null,
  });
  if (error) {
    console.error("grant_paid_premium failed", error);
    // Non-2xx makes Stripe retry, which is what we want for a database error.
    return new Response("grant failed", { status: 500 });
  }
  return new Response("ok", { status: 200 });
});
