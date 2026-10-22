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
import { WhatsAppPremiumButton } from "~/components/WhatsApp";
import type { LearnerRow, ProfileRow } from "~/types/database";

/** One ProfileRow for the app, from the shared account and the learner row. */
export function mergeProfile(
  userId: string,
  email: string,
  account: Partial<ProfileRow> | null,
  learner: LearnerRow | null,
): ProfileRow {
  const premium = Boolean(
    learner?.premium_expires_at && new Date(learner.premium_expires_at) > new Date(),
  );
  return {
    id: userId,
    email: account?.email ?? email,
    full_name: learner?.full_name ?? account?.full_name ?? null,
    role: account?.role === "admin" ? "admin" : "user",
    tier: premium ? "premium" : "free",
    premium_expires_at: learner?.premium_expires_at ?? null,
    target_band: learner?.target_band ?? null,
    current_band: learner?.current_band ?? null,
    exam_date: learner?.exam_date ?? null,
    daily_goal_minutes: learner?.daily_goal_minutes ?? 20,
    locale: learner?.locale ?? "en",
    reminder_emails: learner?.reminder_emails ?? true,
    nationality: learner?.nationality ?? null,
    // Falls back to the MoreTOEFL number, so onboarding can pre-fill it.
    whatsapp: learner?.whatsapp ?? account?.whatsapp ?? null,
    onboarded_at: learner?.onboarded_at ?? null,
    created_at: learner?.created_at ?? account?.created_at ?? new Date().toISOString(),
    updated_at: learner?.updated_at ?? new Date().toISOString(),
  };
}

interface AuthState {
  session: Session | null;
  user: User | null;
  profile: ProfileRow | null;
  /** True until the initial session lookup settles. */
  loading: boolean;
  isAdmin: boolean;
  /** Premium and not past premium_expires_at (the server checks the same). */
  isPremium: boolean;
}

const AuthContext = createContext<AuthState>({
  session: null,
  user: null,
  profile: null,
  loading: true,
  isAdmin: false,
  isPremium: false,
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
    // The account (name, email, admin role) is the shared MoreTOEFL profile;
    // everything IELTS-specific, Premium included, is the learner row, which
    // ielts_ensure_learner() creates on the first visit.
    queryFn: async (): Promise<ProfileRow | null> => {
      const [account, learner] = await Promise.all([
        supabase
          .from("profiles")
          .select("id, email, full_name, role, whatsapp, created_at")
          .eq("id", session!.user.id)
          .maybeSingle(),
        supabase.rpc("ielts_ensure_learner"),
      ]);
      if (account.error) throw account.error;
      if (learner.error) throw learner.error;
      return mergeProfile(
        session!.user.id,
        session!.user.email ?? "",
        account.data as Partial<ProfileRow> | null,
        learner.data as LearnerRow,
      );
    },
  });

  const value = useMemo<AuthState>(
    () => ({
      session,
      user: session?.user ?? null,
      profile: profile ?? null,
      loading,
      isAdmin: profile?.role === "admin",
      // Mirrors ielts_is_premium(): admins always count as Premium.
      isPremium: profile?.tier === "premium" || profile?.role === "admin",
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

/**
 * MoreIELTS is Premium-only. Wraps every content page: signed-out visitors
 * are asked to sign in, signed-in learners without Premium see how to get a
 * code. The server enforces the same rule (ielts_is_premium in RLS and RPCs),
 * so this gate is about the experience, not the security.
 */
export function PremiumGate({ children }: { children: ReactNode }) {
  const { session, profile, loading, isPremium } = useAuth();

  if (loading || (session && !profile)) {
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
          MoreIELTS practice, mock exams and feedback are for Premium members.
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

  if (!isPremium) {
    return (
      <Centered>
        <span aria-hidden className="text-3xl">🔒</span>
        <h1 className="mt-3 text-xl font-semibold tracking-tight">Premium members only</h1>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">
          Every MoreIELTS mock exam, practice set and AI correction is part of Premium.
          Message us on WhatsApp to get an access code, or enter the code you have.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <WhatsAppPremiumButton />
          <Link
            to="/pricing"
            className="inline-flex h-11 items-center rounded-xl border border-line-strong bg-surface px-5 text-sm font-semibold text-ink hover:bg-paper"
          >
            I have a code
          </Link>
        </div>
      </Centered>
    );
  }

  return <>{children}</>;
}
