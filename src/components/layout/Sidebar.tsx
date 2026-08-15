import { Link } from "@tanstack/react-router";
import { PRIMARY_NAV } from "./nav";

/** Desktop rail, echoing the reference layout. Hidden below lg. */
export function Sidebar() {
  return (
    <aside className="hidden w-56 shrink-0 lg:block">
      <nav className="sticky top-24 grid gap-1">
        {PRIMARY_NAV.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            activeOptions={{ exact: item.to === "/" }}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-soft transition-colors hover:bg-surface data-[status=active]:bg-brand-50 data-[status=active]:text-brand-700"
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
