import { cn } from "~/lib/cn";

/**
 * Loading, startup-error and save-status chrome for the test players. Kept in
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
    if (!saveError && !saving) return null;
    return (
      <div
        aria-live="polite"
        className={cn(
          "border-b px-4 py-2 text-center text-xs",
          saveError
            ? "border-bad/20 bg-bad-soft text-bad"
            : "border-line bg-surface text-muted",
        )}
      >
        {saveError ?? "Saving…"}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-paper">
        <p className="text-sm text-muted">Preparing your test…</p>
      </div>
    );
  }

  return (
    <div className="grid min-h-screen place-items-center bg-paper px-4">
      <div className="max-w-md text-center">
        <h1 className="text-lg font-semibold tracking-tight">
          This test could not be started
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">{error}</p>
        <a href="/" className="mt-5 inline-block text-sm font-medium text-brand-600">
          Back to dashboard
        </a>
      </div>
    </div>
  );
}
