import * as T from "@radix-ui/react-tabs";
import type { ComponentProps } from "react";
import { cn } from "~/lib/cn";

export const Tabs = T.Root;

/** Underline tabs. The active tab is marked by a rule, not a filled pill. */
export function TabsList({ className, ...props }: ComponentProps<typeof T.List>) {
  return (
    <T.List
      className={cn(
        "thin-scroll flex items-center gap-1 overflow-x-auto border-b border-line",
        className,
      )}
      {...props}
    />
  );
}

export function TabsTrigger({
  className,
  ...props
}: ComponentProps<typeof T.Trigger>) {
  return (
    <T.Trigger
      className={cn(
        "-mb-px shrink-0 border-b-2 border-transparent px-3.5 py-2.5 text-sm font-medium text-muted transition-colors",
        "hover:text-ink data-[state=active]:border-brand-600 data-[state=active]:font-semibold data-[state=active]:text-brand-700",
        className,
      )}
      {...props}
    />
  );
}

export const TabsContent = T.Content;
