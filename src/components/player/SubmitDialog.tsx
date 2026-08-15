import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
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
  label = "Submit",
}: {
  attemptId: string;
  section?: SectionCode;
  answeredCount: number;
  total: number;
  label?: string;
}) {
  const navigate = useNavigate();
  const submit = useSubmitAttempt();
  const [error, setError] = useState<string | null>(null);
  const blank = total - answeredCount;

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
        <Button size="sm">{label}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Submit this section?</DialogTitle>
        <DialogDescription>
          You have answered {answeredCount} of {total} questions.
          {blank > 0
            ? ` ${blank} ${blank === 1 ? "question is" : "questions are"} still blank. Blank answers score nothing, and you cannot return to this section after submitting.`
            : " You cannot return to this section after submitting."}
        </DialogDescription>

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
            {submit.isPending ? "Submitting…" : `Submit ${section ?? "section"}`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
