export function Logo({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className ?? ""}`}>
      <span aria-hidden className="relative grid h-9 w-9 place-items-center rounded-xl bg-brand-600 text-sm font-black text-white shadow-[0_4px_0_#075ea2]">
        M<span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-surface bg-warn" />
      </span>
      <span className="text-[1.125rem] font-extrabold tracking-tight">
        More<span className="text-brand-600">IELTS</span>
      </span>
    </span>
  );
}
