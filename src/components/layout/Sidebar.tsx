import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { PRIMARY_NAV } from "./nav";
import { AccountMenu } from "./Header";
import { useAuth } from "~/lib/auth";

/**
 * Desktop rail: brand, the one navigation, and the account at the foot.
 * Hidden below lg, where BottomTabs takes over.
 */
export function Sidebar() {
  const { profile, user } = useAuth();
  const target = profile?.target_band ? Number(profile.target_band) : null;
  const plan = profile?.tier === "premium" ? "Premium" : "Free plan";
  const name = profile?.full_name ?? user?.email ?? "";

  return (
    <aside className="sticky top-0 hidden h-screen w-[14.5rem] shrink-0 flex-col border-r border-line bg-surface px-3 pb-3 pt-5 lg:flex">
      <Link to="/" className="mb-5 px-2" aria-label="MoreIELTS home">
        <Logo />
      </Link>
      <nav className="grid gap-1" aria-label="Main">
        {PRIMARY_NAV.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              className="flex items-center gap-3 rounded-[0.5625rem] px-3 py-2.5 text-sm font-medium text-ink-soft transition-colors hover:bg-paper data-[status=active]:bg-brand-50 data-[status=active]:font-semibold data-[status=active]:text-brand-700"
            >
              <Icon className="h-[1.0625rem] w-[1.0625rem]" strokeWidth={1.9} aria-hidden />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto border-t border-line pt-3">
        <div className="flex items-center gap-3 rounded-lg px-2 py-1.5">
          <AccountMenu />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{name}</p>
            <p className="truncate text-xs text-muted">
              {plan}
              {target !== null ? ` · Target ${target.toFixed(1)}` : ""}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
