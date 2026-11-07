import { cn } from "~/lib/cn";
import { formatBand } from "~/lib/scoring";

/**
 * A band on the 0 to 9 scale with the candidate's target marked. Every band in
 * the app is shown relative to the target, never as an absolute red or green.
 */
export function BandRuler({
  band,
  target,
  ticks = false,
  className,
}: {
  band: number | null;
  target: number | null;
  /** Show the 0 to 9 scale under the rule. */
  ticks?: boolean;
  className?: string;
}) {
  const v = band === null ? 0 : Math.max(0, Math.min(9, band));
  const label =
    band === null
      ? "No band yet"
      : `Band ${formatBand(band)}${target !== null ? ` of a ${formatBand(target)} target` : ""}`;
  return (
    <div className={cn("w-full", className)}>
      <div
        role="img"
        aria-label={label}
        className="relative h-2 rounded-full bg-line"
      >
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-brand-600 transition-[width] duration-500"
          style={{ width: `${(v / 9) * 100}%` }}
        />
        {target !== null && (
          <div
            aria-hidden
            className="absolute -top-[5px] h-[18px] w-0.5 -translate-x-px bg-ink"
            style={{ left: `${(Math.max(0, Math.min(9, target)) / 9) * 100}%` }}
          >
            <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[0.6rem] font-semibold uppercase tracking-wider text-muted">
              target
            </span>
          </div>
        )}
      </div>
      {ticks && (
        <div aria-hidden className="mt-1.5 flex justify-between font-mono text-[0.65rem] text-muted">
          {Array.from({ length: 10 }, (_, i) => (
            <span key={i}>{i}</span>
          ))}
        </div>
      )}
    </div>
  );
}

/** Delta chip against the target. Colour encodes distance, not an absolute scale. */
export function bandDelta(band: number | null, target: number | null) {
  if (band === null || target === null) return null;
  const d = Math.round((band - target) * 2) / 2;
  if (d >= 0) return { tone: "good" as const, label: d === 0 ? "at target" : `+${formatBand(d)}` };
  return { tone: "warn" as const, label: `−${formatBand(Math.abs(d))}` };
}
