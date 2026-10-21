/**
 * Premium passes sold through Stripe Checkout. One-time payments that extend
 * Premium like a redemption code does, so there is no subscription state to
 * keep in sync. Prices are Stripe Price ids from the environment.
 */
export const PLANS = {
  month: { days: 30, priceEnv: "STRIPE_PRICE_MONTH" },
  quarter: { days: 90, priceEnv: "STRIPE_PRICE_QUARTER" },
} as const;

export type PlanCode = keyof typeof PLANS;

export function isPlan(value: unknown): value is PlanCode {
  return typeof value === "string" && value in PLANS;
}
