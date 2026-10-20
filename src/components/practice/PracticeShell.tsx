import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { AppShell } from "~/components/layout/AppShell";
import { Badge } from "~/components/ui/Badge";

/**
 * Chrome for a practice runner: back link, section title, context line and
 * the AI badge. Runs without the sidebar so a passage and its questions have
 * room side by side.
 */
export function PracticeShell({
  label,
  title,
  context,
  right,
  children,
}: {
  label: string;
  title: string;
  context: string;
  right?: ReactNode;
  children: ReactNode;
}) {
  return (
    <AppShell withSidebar={false}>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <Link
            to="/practice"
            className="text-sm font-medium text-muted transition-colors hover:text-ink"
          >
            ← All practice
          </Link>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">{label}</p>
            <Badge tone="brand">AI corrected</Badge>
          </div>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
          <p className="mt-1 text-sm text-muted">{context}</p>
        </div>
        {right}
      </div>
      {children}
    </AppShell>
  );
}

/** Loading / error state for the AI step, with a retry. */
export function AiStatus({
  loading,
  error,
  onRetry,
  loadingLabel = "The examiner is reading your answer…",
}: {
  loading: boolean;
  error: string | null;
  onRetry?: () => void;
  loadingLabel?: string;
}) {
  if (loading) {
    return (
      <div
        role="status"
        className="flex items-center gap-3 rounded-card border border-brand-100 bg-brand-50 px-5 py-4 text-sm text-brand-700"
      >
        <span aria-hidden className="h-2.5 w-2.5 animate-breathe rounded-full bg-brand-600" />
        {loadingLabel}
      </div>
    );
  }
  if (error) {
    return (
      <div
        role="alert"
        className="flex flex-wrap items-center justify-between gap-3 rounded-card border border-bad/20 bg-bad-soft px-5 py-4 text-sm text-bad"
      >
        <p className="min-w-0 flex-1">{error}</p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="rounded-lg border border-bad/30 bg-surface px-3 py-1.5 text-xs font-semibold text-bad hover:bg-paper"
          >
            Try again
          </button>
        )}
      </div>
    );
  }
  return null;
}
