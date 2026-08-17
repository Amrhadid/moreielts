import { Link } from "@tanstack/react-router";
import { PRIMARY_NAV } from "./nav";

/** Desktop rail, echoing the reference layout. Hidden below lg. */
export function Sidebar() {
  return (
    <aside className="hidden w-60 shrink-0 lg:block">
      <nav className="sticky top-24 grid gap-2 rounded-card border border-line bg-surface p-3 shadow-[0_10px_35px_rgba(20,49,78,.05)]">
        {PRIMARY_NAV.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            activeOptions={{ exact: item.to === "/" }}
            className="flex items-center gap-3 rounded-xl border border-transparent px-3.5 py-3 text-sm font-semibold text-ink-soft transition-all hover:bg-paper data-[status=active]:border-brand-200 data-[status=active]:bg-brand-50 data-[status=active]:text-brand-700"
          >
            <span aria-hidden className="text-base">
              {item.icon}
            </span>
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
