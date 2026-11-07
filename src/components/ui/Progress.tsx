import * as P from "@radix-ui/react-progress";
import { cn } from "~/lib/cn";

export function Progress({
  value,
  className,
  tone = "brand",
  label,
}: {
  value: number;
  className?: string;
  tone?: "brand" | "good" | "muted";
  /** Accessible name. Pass it whenever the bar stands alone. */
  label?: string;
}) {
  const bar =
    tone === "good" ? "bg-good" : tone === "muted" ? "bg-line-strong" : "bg-brand-600";
  return (
    <P.Root
      value={value}
      aria-label={label}
      className={cn("h-1.5 w-full overflow-hidden rounded-full bg-line", className)}
    >
      <P.Indicator
        className={cn("h-full transition-[width] duration-500", bar)}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </P.Root>
  );
}
