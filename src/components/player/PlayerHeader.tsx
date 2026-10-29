import { cn } from "~/lib/cn";
import { formatClock } from "~/lib/text";
import { ExitButton } from "./ExitButton";

/** Sticky test-player header: identity on the left, clock on the right. */
export function PlayerHeader({
  sectionName,
  contextLabel,
  remaining,
  right,
}: {
  sectionName: string;
  contextLabel: string;
  remaining: number;
  right?: React.ReactNode;
}) {
  const low = remaining <= 300;
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-surface/95 shadow-[0_4px_20px_rgba(20,49,78,.05)] backdrop-blur">
      <div className="flex h-16 items-center gap-3 px-3 sm:px-5">
        <ExitButton remaining={remaining} className="hidden sm:block" />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{sectionName}</p>
          <p className="truncate text-xs text-muted">{contextLabel}</p>
        </div>
        <div className="ms-auto flex items-center gap-3">
          {right}
          <div
            aria-live="polite"
            className={cn(
              "rounded-lg border px-3 py-1.5 font-mono text-sm tabular-nums",
              low
                ? "border-bad/30 bg-bad-soft text-bad"
                : "border-line-strong bg-paper text-ink",
            )}
          >
            {formatClock(remaining)}
          </div>
        </div>
      </div>
    </header>
  );
}
