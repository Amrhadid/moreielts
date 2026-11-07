import { Link } from "@tanstack/react-router";
import { Button } from "~/components/ui/Button";
import { Icon } from "~/components/ui/Icon";
import { useAuth } from "~/lib/auth";
import { useI18n } from "~/lib/i18n";
import { AccountMenu, LanguageSwitch } from "./Header";
import { Logo } from "./Logo";
import { PRIMARY_NAV } from "./nav";

const item =
  "flex items-center gap-3 rounded-[0.5625rem] px-3 py-2.5 text-sm font-medium text-ink-soft transition-colors hover:bg-paper data-[status=active]:bg-brand-50 data-[status=active]:font-semibold data-[status=active]:text-brand-700";

/**
 * Desktop rail: brand, the one navigation, language, Premium, and the
 * account at the foot. Hidden below lg, where BottomTabs takes over.
 */
export function Sidebar() {
  const { t } = useI18n();
  const { session, profile, user, isPremium, isAdmin } = useAuth();
  const target = profile?.target_band ? Number(profile.target_band) : null;
  const name = profile?.full_name ?? user?.email ?? "";

  return (
    <aside className="sticky top-0 hidden h-screen w-[14.5rem] shrink-0 flex-col border-e border-line bg-surface px-3 pb-3 pt-5 lg:flex">
      <Link to="/" className="mb-5 px-2" aria-label="MoreIELTS home">
        <Logo />
      </Link>
      <nav className="thin-scroll grid gap-0.5 overflow-y-auto" aria-label="Main">
        {PRIMARY_NAV.map((navItem) => (
          <Link
            key={navItem.to}
            to={navItem.to}
            activeOptions={{ exact: navItem.to === "/" }}
            className={item}
          >
            <Icon name={navItem.icon} size={17} />
            {t(navItem.labelKey)}
          </Link>
        ))}
        {isAdmin && (
          <Link to="/admin" className={item}>
            <Icon name="settings" size={17} />
            {t("nav.admin")}
          </Link>
        )}
      </nav>
      <div className="mt-auto grid gap-2 border-t border-line pt-3">
        {session && !isPremium && (
          <Link
            to="/pricing"
            className="flex items-center gap-3 rounded-[0.5625rem] bg-warn-soft px-3 py-2.5 text-sm font-semibold text-warn"
          >
            <Icon name="crown" size={17} />
            {t("nav.pricing")}
          </Link>
        )}
        <LanguageSwitch className="justify-start px-3" />
        {session ? (
          <div className="flex items-center gap-3 rounded-lg px-2 py-1.5">
            <AccountMenu />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{name}</p>
              <p className="truncate text-xs text-muted">
                {profile?.role === "admin" ? "Admin" : isPremium ? t("common.premium") : t("common.free")}
                {target !== null ? ` · Target ${target.toFixed(1)}` : ""}
              </p>
            </div>
          </div>
        ) : (
          <Button asChild size="sm" className="w-full">
            <Link to="/login">{t("common.signIn")}</Link>
          </Button>
        )}
      </div>
    </aside>
  );
}
