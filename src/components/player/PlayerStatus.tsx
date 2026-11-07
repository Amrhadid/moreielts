import { Link } from "@tanstack/react-router";
import { AlertCircle } from "lucide-react";
import { Skeleton } from "~/components/ui/EmptyState";
import { cn } from "~/lib/cn";

/**
 * Loading, startup-error and save-error chrome for the test players. Kept in
 * one place so all four players report the same way.
 */
export function PlayerStatus({
  loading,
  error,
  saving,
  saveError,
  inline,
}: {
  loading?: boolean;
  error?: string | null;
  saving?: boolean;
  saveError?: string | null;
  inline?: boolean;
}) {
  if (inline) {
    if (!saveError) return null;
    return (
      <div
        role="alert"
        className="fixed inset-x-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 mx-auto flex max-w-md items-start gap-2.5 rounded-xl bg-bad px-4 py-3 text-sm text-white shadow-raised"
      >
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
        <span>{saveError}</span>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-screen flex-col bg-paper" role="status" aria-label="Preparing your test">
        <div className="grid h-14 grid-cols-[1fr_auto_1fr] items-center border-b border-line bg-surface px-4">
          <div className="flex items-center gap-2.5">
            <Skeleton className="h-7 w-7 rounded-lg" />
            <Skeleton className="h-3.5 w-24" />
          </div>
          <Skeleton className="h-8 w-24 rounded-lg" />
          <div className="flex justify-end">
            <Skeleton className="h-8 w-28 rounded-lg" />
          </div>
        </div>
        <div className="grid flex-1 md:grid-cols-2">
          <div className="hidden border-r border-line bg-surface px-8 py-7 md:block">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="mt-4 h-6 w-3/4" />
            <div className="mt-5 grid gap-2.5">
              {Array.from({ length: 9 }, (_, i) => (
                <Skeleton key={i} className={cn("h-3.5", i % 4 === 3 ? "w-2/3" : "w-full")} />
              ))}
            </div>
          </div>
          <div className="grid content-start gap-2.5 px-5 py-6">
            <Skeleton className="h-12 w-full rounded-lg" />
            {Array.from({ length: 4 }, (_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-[0.625rem]" />
            ))}
          </div>
        </div>
        <p className="sr-only">Preparing your test…</p>
      </div>
    );
  }

  return (
    <div className="grid min-h-screen place-items-center bg-paper px-4">
      <div className="max-w-md text-center">
        <h1 className="display text-2xl">This test could not be started</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">{error}</p>
        <Link to="/" className="mt-5 inline-block text-sm font-semibold text-brand-600">
          Back to the dashboard
        </Link>
      </div>
    </div>
  );
}

/** Subtle "Saving… / Saved" indicator for places that show it inline. */
export function SaveIndicator({ saving }: { saving: boolean }) {
  return (
    <span
      className={cn("flex items-center gap-1.5 text-xs", saving ? "text-muted" : "text-good")}
      aria-live="polite"
    >
      <i
        aria-hidden
        className={cn("h-1.5 w-1.5 rounded-full", saving ? "animate-pulse bg-muted" : "bg-good")}
      />
      {saving ? "Saving…" : "Saved"}
    </span>
  );
}
