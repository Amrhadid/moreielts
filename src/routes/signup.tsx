import { createFileRoute, redirect } from "@tanstack/react-router";

/**
 * Sign-in is Google-only and creates the account on first use, so there is no
 * separate sign-up form. Old links to /signup land on /login.
 */
export const Route = createFileRoute("/signup")({
  beforeLoad: () => {
    throw redirect({ to: "/login" });
  },
});
