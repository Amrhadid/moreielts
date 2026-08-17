import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "~/lib/auth";

export const Route = createFileRoute("/auth/callback")({ component: AuthCallback });

/**
 * OAuth landing route. The Supabase client picks the session out of the URL
 * (detectSessionInUrl), so this only has to wait and then redirect.
 */
function AuthCallback() {
  const navigate = useNavigate();
  const { session, loading } = useAuth();

  useEffect(() => {
    if (!loading) navigate({ to: session ? "/" : "/login" });
  }, [session, loading, navigate]);

  return (
    <div className="grid min-h-screen place-items-center bg-paper">
      <p className="text-sm text-muted">Signing you in…</p>
    </div>
  );
}
