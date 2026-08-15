import type { ComponentProps } from "react";
import { cn } from "~/lib/cn";

export function Input({ className, ...props }: ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "h-10 w-full rounded-lg border border-line-strong bg-surface px-3 text-sm",
        "placeholder:text-muted/70 focus:border-brand-500",
        className,
      )}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "w-full rounded-lg border border-line-strong bg-surface px-3 py-2 text-sm leading-relaxed",
        "placeholder:text-muted/70 focus:border-brand-500",
        className,
      )}
      {...props}
    />
  );
}

export function Label({ className, ...props }: ComponentProps<"label">) {
  return (
    <label
      className={cn("mb-1.5 block text-sm font-medium text-ink-soft", className)}
      {...props}
    />
  );
}
