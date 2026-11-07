import { createFileRoute, redirect } from "@tanstack/react-router";

/**
 * Enhance folded into Today as the "Focus this week" block. The route stays
 * so old links keep working.
 */
export const Route = createFileRoute("/enhance")({
  beforeLoad: () => {
    throw redirect({ to: "/" });
  },
  component: () => null,
});
