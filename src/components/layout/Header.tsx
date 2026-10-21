import * as Dialog from "@radix-ui/react-dialog";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { signOut, useAuth } from "~/lib/auth";
import { Logo } from "./Logo";
import { Icon } from "~/components/ui/Icon";
import { useI18n } from "~/lib/i18n";
import { PRIMARY_NAV } from "./nav";

export function Header() {
  const [open, setOpen] = useState(false);
  const { profile, user, session, isAdmin, isPremium } = useAuth();
  const { t, locale, setLocale } = useI18n();

  const email = profile?.email ?? user?.email ?? "";
  const name = profile?.full_name ?? email;
  const initials =
    (profile?.full_name ?? email)
      .split(/[\s@.]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "?";

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Link to="/" className="shrink-0">
          <Logo />
        </Link>

        <nav className="ms-6 hidden items-center gap-1 md:flex">
          {PRIMARY_NAV.filter((i) => i.inHeader).map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-xl px-3.5 py-2.5 text-sm font-semibold text-ink-soft transition-all hover:bg-paper hover:text-ink data-[status=active]:bg-brand-50 data-[status=active]:text-brand-700"
            >
              {t(item.labelKey)}
            </Link>
          ))}
        </nav>

        <div className="ms-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => setLocale(locale === "ar" ? "en" : "ar")}
            className="hidden items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-muted hover:text-ink sm:inline-flex"
            aria-label="Switch interface language"
          >
            <Icon name="globe" size={16} />
            {t("common.language")}
          </button>
          {!isPremium && (
            <Link
              to="/pricing"
              className="hidden items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-warn hover:bg-warn-soft sm:inline-flex"
            >
              <Icon name="crown" size={16} />
              {t("nav.pricing")}
            </Link>
          )}
          {isAdmin && (
            <Link
              to="/admin"
              className="hidden rounded-lg px-3 py-2 text-sm font-medium text-muted hover:text-ink sm:block"
            >
              Admin
            </Link>
          )}

          {!session && (
            <Link
              to="/login"
              className="inline-flex h-9 items-center rounded-lg bg-brand-600 px-4 text-sm font-medium text-white hover:bg-brand-700"
            >
              Sign in
            </Link>
          )}

          {session && (
          <DropdownMenu.Root>
            <DropdownMenu.Trigger
              aria-label="Profile menu"
              className="grid h-9 w-9 place-items-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700"
            >
              {initials}
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                align="end"
                sideOffset={8}
                className="z-50 w-56 rounded-lg border border-line bg-surface p-1 shadow-lg"
              >
                <div className="px-3 py-2">
                  <p className="text-sm font-medium">{name}</p>
                  <p className="text-xs text-muted">{email}</p>
                </div>
                <DropdownMenu.Separator className="my-1 h-px bg-line" />
                {[
                  { label: "My results", to: "/results" as const },
                  ...(isAdmin ? [{ label: "Admin console", to: "/admin" as const }] : []),
                ].map((item) => (
                  <DropdownMenu.Item key={item.to} asChild>
                    <Link
                      to={item.to}
                      className="block cursor-pointer rounded-md px-3 py-2 text-sm outline-none data-[highlighted]:bg-paper"
                    >
                      {item.label}
                    </Link>
                  </DropdownMenu.Item>
                ))}
                <DropdownMenu.Separator className="my-1 h-px bg-line" />
                <DropdownMenu.Item
                  onSelect={() => void signOut()}
                  className="cursor-pointer rounded-md px-3 py-2 text-sm text-muted outline-none data-[highlighted]:bg-paper"
                >
                  Sign out
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
          )}

          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger
              aria-label="Open navigation"
              className="grid h-9 w-9 place-items-center rounded-lg border border-line text-lg md:hidden"
            >
              <span aria-hidden>☰</span>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/40" />
              <Dialog.Content className="fixed inset-y-0 end-0 z-50 w-72 border-s border-line bg-surface p-4">
                <div className="flex items-center justify-between">
                  <Dialog.Title className="text-sm font-semibold text-muted">
                    Menu
                  </Dialog.Title>
                  <Dialog.Close aria-label="Close navigation" className="px-2 text-lg">
                    ✕
                  </Dialog.Close>
                </div>
                <nav className="mt-4 grid gap-1">
                  {PRIMARY_NAV.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium hover:bg-paper"
                    >
                      <Icon name={item.icon} size={18} />
                      {t(item.labelKey)}
                    </Link>
                  ))}
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium hover:bg-paper"
                    >
                      <Icon name="settings" size={18} /> {t("nav.admin")}
                    </Link>
                  )}
                  <Link
                    to="/pricing"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium hover:bg-paper"
                  >
                    <Icon name="crown" size={18} /> {t("nav.pricing")}
                  </Link>
                  <button
                    type="button"
                    onClick={() => setLocale(locale === "ar" ? "en" : "ar")}
                    className="flex items-center gap-3 rounded-lg px-3 py-3 text-start text-sm font-medium hover:bg-paper"
                  >
                    <Icon name="globe" size={18} /> {t("common.language")}
                  </button>
                </nav>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>
    </header>
  );
}
