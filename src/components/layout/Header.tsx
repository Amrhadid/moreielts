import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Link } from "@tanstack/react-router";
import { signOut, useAuth } from "~/lib/auth";
import { Button } from "~/components/ui/Button";
import { cn } from "~/lib/cn";
import { Logo } from "./Logo";

function initialsOf(name: string) {
  return (
    name
      .split(/[\s@.]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "?"
  );
}

/** Avatar button with the account menu. Used by the rail and the top bars. */
export function AccountMenu({ className }: { className?: string }) {
  const { profile, user, isAdmin } = useAuth();
  const email = profile?.email ?? user?.email ?? "";
  const name = profile?.full_name ?? email;
  const plan = profile?.tier === "premium" ? "Premium" : "Free plan";

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger
        aria-label="Account menu"
        className={cn(
          "grid h-8 w-8 shrink-0 place-items-center rounded-full bg-writing-soft text-xs font-bold text-writing",
          className,
        )}
      >
        {initialsOf(name)}
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className="z-50 w-60 rounded-xl border border-line bg-surface p-1 shadow-raised"
        >
          <div className="px-3 py-2">
            <p className="truncate text-sm font-semibold">{name}</p>
            <p className="truncate text-xs text-muted">{email}</p>
            <p className="mt-1 text-xs text-muted">{plan}</p>
          </div>
          <DropdownMenu.Separator className="my-1 h-px bg-line" />
          {[
            { label: "My results", to: "/results" as const },
            { label: "Learn the format", to: "/learn" as const },
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
  );
}

/**
 * Marketing header for visitors without a session: a few anchors and one
 * accent button. Nothing here links into a protected route.
 */
export function MarketingHeader() {
  return (
    <header className="border-b border-line bg-surface">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" aria-label="MoreIELTS home">
          <Logo />
        </Link>
        <nav className="flex items-center gap-1 text-sm font-medium" aria-label="Site">
          <a href="#how" className="hidden rounded-lg px-3 py-2 text-ink-soft hover:bg-paper sm:block">
            How it works
          </a>
          <a href="#sections" className="hidden rounded-lg px-3 py-2 text-ink-soft hover:bg-paper sm:block">
            The test
          </a>
          <Link to="/login" className="rounded-lg px-3 py-2 text-ink-soft hover:bg-paper">
            Sign in
          </Link>
          <Button asChild size="sm" className="ml-1">
            <Link to="/signup">Start free</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}

/**
 * Compact top bar for signed-in screens on phones and tablets, and for the
 * admin console at every width. The desktop student app has no top bar: the
 * rail carries brand, navigation and account.
 */
export function Header({ always = false, title }: { always?: boolean; title?: string }) {
  const { isAdmin } = useAuth();
  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b border-line bg-surface/90 backdrop-blur-xl",
        !always && "lg:hidden",
      )}
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4 sm:px-6">
        <Link to="/" className="shrink-0" aria-label="MoreIELTS home">
          <Logo compact={Boolean(title)} />
        </Link>
        {title && <p className="truncate text-sm font-semibold">{title}</p>}
        <div className="ml-auto flex items-center gap-2">
          {isAdmin && (
            <Link
              to="/admin"
              className="hidden rounded-lg px-3 py-2 text-sm font-medium text-muted hover:text-ink sm:block"
            >
              Admin
            </Link>
          )}
          <AccountMenu />
        </div>
      </div>
    </header>
  );
}
