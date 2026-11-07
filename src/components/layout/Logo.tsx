import { cn } from "~/lib/cn";

export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span
        aria-hidden
        className="display grid h-8 w-8 place-items-center rounded-lg bg-brand-600 text-[0.9375rem] text-on-brand"
      >
        M
      </span>
      {!compact && (
        <span className="text-[1.0625rem] font-bold tracking-[-0.01em] text-ink">MoreIELTS</span>
      )}
    </span>
  );
}
