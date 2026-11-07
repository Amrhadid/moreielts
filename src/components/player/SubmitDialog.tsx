import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Badge } from "~/components/ui/Badge";
import { Button } from "~/components/ui/Button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/Dialog";
import { useSubmitAttempt } from "~/lib/queries";
import type { SectionCode } from "~/types/content";

const SECTION_LABEL: Record<SectionCode, string> = {
  listening: "Listening",
  reading: "Reading",
  writing: "Writing",
  speaking: "Speaking",
};

/**
 * Submission is a server operation: the submit-attempt Edge Function marks the
 * responses and writes the scores. The client only asks for it and routes to
 * the result.
 */
export function SubmitDialog({
  attemptId,
  section,
  answeredCount,
  total,
  flaggedCount = 0,
  label,
  unit = "questions",
}: {
  attemptId: string;
  section?: SectionCode;
  answeredCount: number;
  total: number;
  flaggedCount?: number;
  label?: string;
  /** "questions" or "tasks". */
  unit?: string;
}) {
  const navigate = useNavigate();
  const submit = useSubmitAttempt();
  const [error, setError] = useState<string | null>(null);
  const blank = Math.max(0, total - answeredCount);
  const sectionLabel = section ? SECTION_LABEL[section] : "section";

  async function onSubmit() {
    setError(null);
    try {
      await submit.mutateAsync({ attemptId });
      navigate({ to: "/results/$attemptId", params: { attemptId } });
    } catch (err) {
      setError((err as Error).message ?? "Submission failed. Try again.");
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm">{label ?? "Submit"}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Submit {sectionLabel}?</DialogTitle>
        <DialogDescription>
          You have answered {answeredCount} of {total} {unit}. You cannot return to this
          section once it is submitted.
        </DialogDescription>

        <div className="mt-4 flex flex-wrap gap-2">
          <Badge tone="brand">{answeredCount} answered</Badge>
          {blank > 0 && <Badge tone="neutral">{blank} blank</Badge>}
          {flaggedCount > 0 && <Badge tone="warn">{flaggedCount} flagged</Badge>}
        </div>

        {error && (
          <p className="mt-3 rounded-lg border border-bad/20 bg-bad-soft px-3 py-2 text-sm text-bad">
            {error}
          </p>
        )}

        <div className="mt-6 flex justify-end gap-2">
          <DialogClose asChild>
            <Button variant="outline">Keep working</Button>
          </DialogClose>
          <Button onClick={onSubmit} disabled={submit.isPending}>
            {submit.isPending ? "Submitting…" : `Submit ${sectionLabel}`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
