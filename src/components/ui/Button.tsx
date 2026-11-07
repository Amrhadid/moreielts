import { Slot } from "@radix-ui/react-slot";
import type { ComponentProps } from "react";
import { cn } from "~/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-brand-600 text-on-brand hover:bg-brand-700 border border-transparent",
  secondary: "bg-brand-50 text-brand-700 hover:bg-brand-100 border border-transparent",
  outline: "bg-surface text-ink hover:bg-paper border border-line-strong",
  ghost: "bg-transparent text-ink-soft hover:bg-paper border border-transparent",
  danger: "bg-bad text-white hover:opacity-90 border border-transparent",
};

const SIZES: Record<Size, string> = {
  sm: "h-8 px-3 text-[0.8125rem] gap-1.5 rounded-lg",
  md: "h-10 px-4 text-sm gap-2 rounded-[0.5625rem]",
  lg: "h-12 px-6 text-[0.9375rem] gap-2 rounded-[0.625rem]",
};

/**
 * Buttons change colour on hover, never position: a control that moves under
 * the pointer is a distraction inside the test players.
 */
export function Button({
  variant = "primary",
  size = "md",
  asChild,
  className,
  ...props
}: ComponentProps<"button"> & {
  variant?: Variant;
  size?: Size;
  asChild?: boolean;
}) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(
        "inline-flex shrink-0 items-center justify-center whitespace-nowrap font-semibold transition-colors duration-150",
        "disabled:pointer-events-none disabled:opacity-50",
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...props}
    />
  );
}
