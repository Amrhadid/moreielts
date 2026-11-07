import * as D from "@radix-ui/react-dialog";
import type { ReactNode } from "react";
import { cn } from "~/lib/cn";

export const Dialog = D.Root;
export const DialogTrigger = D.Trigger;
export const DialogClose = D.Close;

export function DialogContent({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <D.Portal>
      <D.Overlay className="fixed inset-0 z-50 bg-ink/45 backdrop-blur-[2px]" />
      <D.Content
        className={cn(
          "fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2",
          "rounded-[0.875rem] border border-line bg-surface p-6 shadow-raised",
          className,
        )}
      >
        {children}
      </D.Content>
    </D.Portal>
  );
}

export function DialogTitle({ children }: { children: ReactNode }) {
  return <D.Title className="display text-xl">{children}</D.Title>;
}

export function DialogDescription({ children }: { children: ReactNode }) {
  return (
    <D.Description className="mt-2 text-sm leading-relaxed text-ink-soft">
      {children}
    </D.Description>
  );
}
