import { useEffect, useRef, useState, type ReactNode } from "react";
import { Icon } from "~/components/ui/Icon";
import { SectionIcon } from "~/components/ui/SectionIcon";
import { cn } from "~/lib/cn";
import { formatClock } from "~/lib/text";
import type { SectionCode } from "~/types/content";
import { ExitButton } from "./ExitButton";
import { TEXT_SIZES } from "./usePassageSize";

/**
 * Sticky test-player header, laid out like the computer-delivered test:
 * identity at the start, the clock in the centre, tools at the end.
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
          <ExitButton remaining={remaining} />
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
                "flex items-center gap-1 rounded-[0.5625rem] border py-1 pe-1 ps-3",
                low ? "border-bad bg-bad-soft text-bad" : "border-line-strong bg-paper text-ink",
              )}
            >
              <span
                className={cn(
                  "tnum min-w-[3.75rem] text-center font-mono text-[1.0625rem] font-medium",
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
                <Icon name={hidden ? "eyeOff" : "eye"} size={16} />
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
                className="border-s border-line px-2.5 py-1.5 hover:bg-paper disabled:opacity-40"
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
