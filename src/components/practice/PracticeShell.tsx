import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { AppShell } from "~/components/layout/AppShell";
import { Badge } from "~/components/ui/Badge";
import { Button } from "~/components/ui/Button";
import { Icon } from "~/components/ui/Icon";

/**
 * Chrome for a practice runner: back link, section title, context line and
 * the AI badge. Runs wide so a passage and its questions have room side by
 * side.
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
    <AppShell wide>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <Link
            to="/practice"
            className="inline-flex items-center gap-1 text-sm font-medium text-muted transition-colors hover:text-ink"
          >
            <Icon name="arrowRight" size={14} className="rotate-180 rtl:rotate-0" />
            All practice
          </Link>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-600">{label}</p>
            <Badge tone="brand">AI corrected</Badge>
          </div>
          <h1 className="display mt-1 text-[1.75rem] leading-tight sm:text-[2rem]">{title}</h1>
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
        className="flex items-center gap-3 rounded-card border border-brand-200 bg-brand-50 px-4 py-3 text-sm text-brand-700"
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
        className="flex flex-wrap items-center justify-between gap-3 rounded-card border border-bad/30 bg-bad-soft px-4 py-3 text-sm text-bad"
      >
        <p className="min-w-0 flex-1">{error}</p>
        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry} className="text-bad">
            Try again
          </Button>
        )}
      </div>
    );
  }
  return null;
}
