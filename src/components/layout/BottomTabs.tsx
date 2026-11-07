import { Link } from "@tanstack/react-router";
import { PRIMARY_NAV } from "./nav";

/**
 * Phone navigation. Study apps are used between other things, on phones; the
 * whole product stays one tap away instead of behind a drawer.
 */
export function BottomTabs() {
  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-line bg-surface/95 px-1 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1.5 backdrop-blur lg:hidden"
    >
      {PRIMARY_NAV.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.to}
            to={item.to}
            activeOptions={{ exact: item.to === "/" }}
            className="group grid justify-items-center gap-0.5 py-1 text-[0.65rem] font-medium text-muted data-[status=active]:text-brand-700"
          >
            <span className="grid h-7 w-11 place-items-center rounded-lg group-data-[status=active]:bg-brand-50">
              <Icon className="h-[1.0625rem] w-[1.0625rem]" strokeWidth={1.9} aria-hidden />
            </span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
