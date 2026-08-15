import type { Session, User } from "@supabase/supabase-js";
import { Link } from "@tanstack/react-router";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "./supabase";
import type { ProfileRow } from "~/types/database";

interface AuthState {
  session: Session | null;
  user: User | null;
  profile: ProfileRow | null;
  /** True until the initial session lookup settles. */
  loading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthState>({
  session: null,
  user: null,
  profile: null,
  loading: true,
  isAdmin: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      setLoading(false);
      // A different user must never see the previous user's cached rows.
      queryClient.clear();
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, [queryClient]);

  const { data: profile } = useQuery({
    queryKey: ["profile", session?.user.id],
    enabled: Boolean(session?.user.id),
    queryFn: async (): Promise<ProfileRow | null> => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session!.user.id)
        .single();
      if (error) throw error;
      return data as unknown as ProfileRow;
    },
  });

  const value = useMemo<AuthState>(
    () => ({
      session,
      user: session?.user ?? null,
      profile: profile ?? null,
      loading,
      isAdmin: profile?.role === "admin",
    }),
    [session, profile, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

export async function signOut() {
  await supabase.auth.signOut();
}

/* ------------------------------------------------------------------ *
 * Route guards
 * ------------------------------------------------------------------ */

function Centered({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-[60vh] place-items-center px-4">
      <div className="text-center">{children}</div>
    </div>
  );
}

/**
 * Guards are rendered rather than run in beforeLoad because the Supabase
 * session lives in the browser: on an SSR pass there is no session to read, so
 * a loader-based redirect would bounce every signed-in user to /login.
 */
export function Protected({ children }: { children: ReactNode }) {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <Centered>
        <p className="text-sm text-muted">Loading…</p>
      </Centered>
    );
  }

  if (!session) {
    return (
      <Centered>
        <h1 className="text-xl font-semibold tracking-tight">Sign in to continue</h1>
        <p className="mt-2 text-sm text-muted">
          Your attempts, results and progress are tied to your account.
        </p>
        <Link
          to="/login"
          className="mt-5 inline-flex h-10 items-center rounded-lg bg-brand-600 px-4 text-sm font-medium text-white hover:bg-brand-700"
        >
          Sign in
        </Link>
      </Centered>
    );
  }

  return <>{children}</>;
}

/** Admin route guard. Checks profiles.role, which RLS also enforces. */
export function AdminOnly({ children }: { children: ReactNode }) {
  const { session, profile, loading, isAdmin } = useAuth();

  if (loading || (session && !profile)) {
    return (
      <Centered>
        <p className="text-sm text-muted">Loading…</p>
      </Centered>
    );
  }

  if (!session || !isAdmin) {
    return (
      <Centered>
        <h1 className="text-xl font-semibold tracking-tight">Admins only</h1>
        <p className="mt-2 text-sm text-muted">
          This area is restricted. Every admin query is also blocked server-side
          by row level security.
        </p>
        <Link to="/" className="mt-5 inline-block text-sm font-medium text-brand-600">
          Back to dashboard
        </Link>
      </Centered>
    );
  }

  return <>{children}</>;
}
