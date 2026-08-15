import * as P from "@radix-ui/react-progress";
import { cn } from "~/lib/cn";

export function Progress({
  value,
  className,
  tone = "brand",
}: {
  value: number;
  className?: string;
  tone?: "brand" | "good" | "muted";
}) {
  const bar =
    tone === "good" ? "bg-good" : tone === "muted" ? "bg-line-strong" : "bg-brand-600";
  return (
    <P.Root
      value={value}
      className={cn("h-2 w-full overflow-hidden rounded-full bg-line", className)}
    >
      <P.Indicator
        className={cn("h-full transition-[width] duration-500", bar)}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </P.Root>
  );
}
