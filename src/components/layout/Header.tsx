import * as Dialog from "@radix-ui/react-dialog";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { signOut, useAuth } from "~/lib/auth";
import { Logo } from "./Logo";
import { PRIMARY_NAV } from "./nav";

export function Header() {
  const [open, setOpen] = useState(false);
  const { profile, user, session, isAdmin } = useAuth();

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
    <header className="sticky top-0 z-40 border-b border-line bg-surface/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Link to="/" className="shrink-0">
          <Logo />
        </Link>

        <nav className="ml-6 hidden items-center gap-1 md:flex">
          {PRIMARY_NAV.filter((i) => i.to !== "/").map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-lg px-3 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-paper hover:text-ink data-[status=active]:bg-brand-50 data-[status=active]:text-brand-700"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
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
              ☰
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/40" />
              <Dialog.Content className="fixed inset-y-0 right-0 z-50 w-72 border-l border-line bg-surface p-4">
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
                      <span aria-hidden>{item.icon}</span>
                      {item.label}
                    </Link>
                  ))}
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium hover:bg-paper"
                    >
                      <span aria-hidden>⚙️</span> Admin
                    </Link>
                  )}
                </nav>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>
    </header>
  );
}
