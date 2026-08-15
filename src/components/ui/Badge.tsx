import type { ComponentProps } from "react";
import { cn } from "~/lib/cn";

type Tone = "neutral" | "brand" | "good" | "warn" | "bad";

const TONES: Record<Tone, string> = {
  neutral: "bg-paper text-muted border-line-strong",
  brand: "bg-brand-50 text-brand-700 border-brand-100",
  good: "bg-good-soft text-good border-good/20",
  warn: "bg-warn-soft text-warn border-warn/20",
  bad: "bg-bad-soft text-bad border-bad/20",
};

export function Badge({
  tone = "neutral",
  className,
  ...props
}: ComponentProps<"span"> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium",
        TONES[tone],
        className,
      )}
      {...props}
    />
  );
}
