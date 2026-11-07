import type { ReactNode } from "react";
import { cn } from "~/lib/cn";
import { BottomTabs } from "./BottomTabs";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

/**
 * Chrome for browsing screens: the rail on desktop, a compact top bar plus
 * bottom tabs on phones. The test players deliberately do NOT use this; they
 * render full-bleed with their own header.
 */
export function AppShell({
  children,
  wide = false,
  withSidebar = true,
}: {
  children: ReactNode;
  /** Let the content run to the full width (results, practice runners). */
  wide?: boolean;
  /** Kept for callers that asked for no sidebar; now means "wide". */
  withSidebar?: boolean;
}) {
  const full = wide || !withSidebar;
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header />
        <main
          id="main"
          tabIndex={-1}
          className={cn(
            "w-full flex-1 px-4 pb-28 pt-6 outline-none sm:px-6 lg:px-10 lg:pb-16 lg:pt-8",
            full ? "max-w-[90rem]" : "max-w-6xl",
          )}
        >
          {children}
        </main>
      </div>
      <BottomTabs />
    </div>
  );
}

/** Page heading used across the browse screens. */
export function PageHeader({
  title,
  subtitle,
  eyebrow,
  action,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  eyebrow?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
      <div className="min-w-0">
        {eyebrow && <p className="mb-1 text-xs text-muted">{eyebrow}</p>}
        <h1 className="display text-[1.75rem] leading-tight sm:text-[2rem]">{title}</h1>
        {subtitle && <p className="mt-1 max-w-2xl text-sm text-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
