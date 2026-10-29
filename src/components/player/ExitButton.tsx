import { useNavigate } from "@tanstack/react-router";
import { Button } from "~/components/ui/Button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/Dialog";
import { cn } from "~/lib/cn";
import { useI18n } from "~/lib/i18n";
import { formatClock } from "~/lib/text";

/**
 * "Exit" for the timed players. Leaving does not stop the server clock, so
 * the learner is told how much time is left before they confirm.
 */
export function ExitButton({
  remaining,
  className,
}: {
  /** Seconds left in the section, or null when the section has no clock. */
  remaining: number | null;
  className?: string;
}) {
  const navigate = useNavigate();
  const { t } = useI18n();
  return (
    <Dialog>
      <DialogTrigger
        className={cn("text-sm font-medium text-muted hover:text-ink", className)}
        aria-label="Exit the test"
      >
        ← Exit
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>{t("exit.title")}</DialogTitle>
        <DialogDescription>{t("exit.body")}</DialogDescription>
        {remaining !== null && (
          <p className="mt-4 flex items-center justify-between rounded-lg border border-line bg-paper px-3 py-2 text-sm">
            <span className="text-muted">{t("exit.timeLeft")}</span>
            <span className="font-mono font-semibold tabular-nums">{formatClock(remaining)}</span>
          </p>
        )}
        <div className="mt-6 flex justify-end gap-2">
          <DialogClose asChild>
            <Button variant="outline">{t("exit.stay")}</Button>
          </DialogClose>
          <Button variant="danger" onClick={() => navigate({ to: "/" })}>
            {t("exit.leave")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
