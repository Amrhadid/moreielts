import * as T from "@radix-ui/react-tabs";
import type { ComponentProps } from "react";
import { cn } from "~/lib/cn";

export const Tabs = T.Root;

export function TabsList({ className, ...props }: ComponentProps<typeof T.List>) {
  return (
    <T.List
      className={cn(
        "inline-flex items-center gap-1 rounded-lg border border-line bg-surface p-1",
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
        "rounded-md px-3 py-1.5 text-sm font-medium text-muted transition-colors",
        "hover:text-ink data-[state=active]:bg-brand-600 data-[state=active]:text-white",
        className,
      )}
      {...props}
    />
  );
}

export const TabsContent = T.Content;
