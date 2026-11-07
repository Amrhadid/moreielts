import { Link, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, LogOut } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Button } from "~/components/ui/Button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/Dialog";
import { SectionIcon } from "~/components/ui/SectionIcon";
import { cn } from "~/lib/cn";
import { formatClock } from "~/lib/text";
import type { SectionCode } from "~/types/content";

/** Passage text sizes the A- / A+ control steps through, in rem. */
export const TEXT_SIZES = [0.9375, 1.0625, 1.125, 1.25] as const;
export const DEFAULT_TEXT_SIZE_INDEX = 1;

/**
 * Sticky test-player header, laid out like the computer-delivered test:
 * identity on the left, the clock in the centre, tools on the right.
 *
 * The clock itself is NOT a live region. A per-second announcement is noise;
 * screen-reader users hear exactly two warnings, at ten and five minutes.
 */
export function PlayerHeader({
  section,
  sectionName,
  contextLabel,
  remaining,
  centre,
  textSizeIndex,
  onTextSize,
  right,
}: {
  section: SectionCode;
  sectionName: string;
  contextLabel: string;
  /** Seconds left. Pass null to hide the clock (speaking has no section clock). */
  remaining: number | null;
  /** Replaces the clock in the centre column when there is no clock. */
  centre?: ReactNode;
  textSizeIndex?: number;
  onTextSize?: (index: number) => void;
  right?: ReactNode;
}) {
  const [hidden, setHidden] = useState(false);
  const low = remaining !== null && remaining <= 300;
  const announcement = useTimeAnnouncements(remaining);
  const hasTextSize = textSizeIndex !== undefined && onTextSize !== undefined;

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-surface">
      <div className="grid h-14 grid-cols-[1fr_auto_1fr] items-center gap-2 px-3 sm:px-4">
        <div className="flex min-w-0 items-center gap-2.5">
          <ExitButton />
          <SectionIcon code={section} size="sm" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold leading-tight">{sectionName}</p>
            <p className="hidden truncate text-xs text-muted sm:block">{contextLabel}</p>
          </div>
        </div>

        <div className="flex items-center justify-center">
          {remaining !== null ? (
            <div
              className={cn(
                "flex items-center gap-1 rounded-[0.5625rem] border py-1 pl-3 pr-1",
                low
                  ? "border-bad bg-bad-soft text-bad"
                  : "border-line-strong bg-paper text-ink",
              )}
            >
              <span
                className={cn(
                  "font-mono tnum min-w-[3.75rem] text-center text-[1.0625rem] font-medium",
                  hidden && "tracking-[0.15em]",
                )}
              >
                {hidden ? "••:••" : formatClock(remaining)}
              </span>
              <button
                type="button"
                onClick={() => setHidden((h) => !h)}
                aria-label={hidden ? "Show the clock" : "Hide the clock"}
                aria-pressed={hidden}
                className="grid h-7 w-7 place-items-center rounded-md text-muted hover:bg-surface"
              >
                {hidden ? (
                  <EyeOff className="h-4 w-4" strokeWidth={1.9} aria-hidden />
                ) : (
                  <Eye className="h-4 w-4" strokeWidth={1.9} aria-hidden />
                )}
              </button>
            </div>
          ) : (
            centre
          )}
        </div>

        <div className="flex items-center justify-end gap-2">
          {hasTextSize && (
            <span className="hidden overflow-hidden rounded-lg border border-line text-xs font-semibold sm:inline-flex">
              <button
                type="button"
                onClick={() => onTextSize(Math.max(0, textSizeIndex - 1))}
                disabled={textSizeIndex <= 0}
                aria-label="Smaller text"
                className="px-2.5 py-1.5 hover:bg-paper disabled:opacity-40"
              >
                A−
              </button>
              <button
                type="button"
                onClick={() => onTextSize(Math.min(TEXT_SIZES.length - 1, textSizeIndex + 1))}
                disabled={textSizeIndex >= TEXT_SIZES.length - 1}
                aria-label="Larger text"
                className="border-l border-line px-2.5 py-1.5 hover:bg-paper disabled:opacity-40"
              >
                A+
              </button>
            </span>
          )}
          {right}
        </div>
      </div>

      <p className="sr-only" aria-live="assertive" aria-atomic="true">
        {announcement}
      </p>
    </header>
  );
}

/** Announces once at ten minutes and once at five minutes remaining. */
function useTimeAnnouncements(remaining: number | null) {
  const [text, setText] = useState("");
  const said = useRef<{ ten: boolean; five: boolean }>({ ten: false, five: false });
  useEffect(() => {
    if (remaining === null) return;
    if (remaining <= 600 && remaining > 300 && !said.current.ten) {
      said.current.ten = true;
      setText("10 minutes remaining");
    } else if (remaining <= 300 && remaining > 0 && !said.current.five) {
      said.current.five = true;
      setText("5 minutes remaining");
    }
  }, [remaining]);
  return text;
}

/** Leaving does not stop the clock, so it asks first. */
function ExitButton() {
  const navigate = useNavigate();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          aria-label="Leave the test"
          className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-muted hover:bg-paper hover:text-ink"
        >
          <LogOut className="h-4 w-4" strokeWidth={1.9} aria-hidden />
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Leave the test?</DialogTitle>
        <DialogDescription>
          The clock keeps running while you are away. Your answers so far are saved, and
          you can come back from the dashboard.
        </DialogDescription>
        <div className="mt-6 flex justify-end gap-2">
          <DialogClose asChild>
            <Button variant="outline">Stay</Button>
          </DialogClose>
          <Button asChild variant="danger">
            <Link to="/" onClick={() => navigate({ to: "/" })}>
              Leave
            </Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
