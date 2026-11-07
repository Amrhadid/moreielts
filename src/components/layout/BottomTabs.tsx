import * as Dialog from "@radix-ui/react-dialog";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Icon } from "~/components/ui/Icon";
import { useAuth } from "~/lib/auth";
import { useI18n } from "~/lib/i18n";
import { LanguageSwitch } from "./Header";
import { PRIMARY_NAV } from "./nav";

const tab =
  "group grid justify-items-center gap-0.5 py-1 text-[0.65rem] font-medium text-muted data-[status=active]:text-brand-700";
const tabIcon = "grid h-7 w-11 place-items-center rounded-lg group-data-[status=active]:bg-brand-50";

/**
 * Phone navigation: four tabs and a More sheet with the rest. Study apps are
 * used between other things, on phones; the product stays one tap away.
 */
export function BottomTabs() {
  const { t } = useI18n();
  const { isAdmin, isPremium, session } = useAuth();
  const [open, setOpen] = useState(false);
  const tabs = PRIMARY_NAV.filter((i) => i.inTabs);
  const rest = PRIMARY_NAV.filter((i) => !i.inTabs);

  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-line bg-surface/95 px-1 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1.5 backdrop-blur lg:hidden"
    >
      {tabs.map((item) => (
        <Link key={item.to} to={item.to} activeOptions={{ exact: item.to === "/" }} className={tab}>
          <span className={tabIcon}>
            <Icon name={item.icon} size={17} />
          </span>
          {t(item.labelKey)}
        </Link>
      ))}
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger className={tab} aria-label={t("nav.more")}>
          <span className={tabIcon}>
            <Icon name="more" size={17} />
          </span>
          {t("nav.more")}
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/45" />
          <Dialog.Content className="fixed inset-x-0 bottom-0 z-50 rounded-t-2xl border-t border-line bg-surface p-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-raised">
            <div className="mb-3 flex items-center justify-between">
              <Dialog.Title className="text-sm font-semibold text-muted">{t("nav.menu")}</Dialog.Title>
              <Dialog.Close aria-label="Close menu" className="grid h-8 w-8 place-items-center rounded-lg hover:bg-paper">
                <Icon name="x" size={16} />
              </Dialog.Close>
            </div>
            <div className="grid grid-cols-2 gap-1">
              {rest.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium hover:bg-paper data-[status=active]:bg-brand-50 data-[status=active]:text-brand-700"
                >
                  <Icon name={item.icon} size={18} />
                  {t(item.labelKey)}
                </Link>
              ))}
              {session && !isPremium && (
                <Link
                  to="/pricing"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold text-warn hover:bg-warn-soft"
                >
                  <Icon name="crown" size={18} />
                  {t("nav.pricing")}
                </Link>
              )}
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium hover:bg-paper"
                >
                  <Icon name="settings" size={18} />
                  {t("nav.admin")}
                </Link>
              )}
              <LanguageSwitch className="h-auto justify-start px-3 py-3" />
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </nav>
  );
}
