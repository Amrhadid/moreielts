export function Logo({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className ?? ""}`}>
      <span
        aria-hidden
        className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 text-sm font-bold text-white"
      >
        M
      </span>
      <span className="text-[1.0625rem] font-semibold tracking-tight">
        More<span className="text-brand-600">IELTS</span>
      </span>
    </span>
  );
}
