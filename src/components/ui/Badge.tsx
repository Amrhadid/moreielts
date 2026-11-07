import type { ComponentProps } from "react";
import { cn } from "~/lib/cn";

type Tone = "neutral" | "brand" | "good" | "warn" | "bad";

const TONES: Record<Tone, string> = {
  neutral: "bg-surface text-ink-soft border-line",
  brand: "bg-brand-50 text-brand-700 border-transparent",
  good: "bg-good-soft text-good border-transparent",
  warn: "bg-warn-soft text-warn border-transparent",
  bad: "bg-bad-soft text-bad border-transparent",
};

export function Badge({
  tone = "neutral",
  className,
  ...props
}: ComponentProps<"span"> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        "inline-flex h-[1.375rem] items-center gap-1 whitespace-nowrap rounded-full border px-2 text-[0.6875rem] font-semibold",
        TONES[tone],
        className,
      )}
      {...props}
    />
  );
}
