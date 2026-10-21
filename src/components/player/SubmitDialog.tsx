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
/** A full mock runs in the official order; Speaking ends the attempt. */
const NEXT_SECTION: Partial<Record<SectionCode, { section: SectionCode; to: string }>> = {
  listening: { section: "reading", to: "/test/reading" },
  reading: { section: "writing", to: "/test/writing" },
  writing: { section: "speaking", to: "/test/speaking" },
};

export function SubmitDialog({
  attemptId,
  section,
  formId,
  answeredCount,
  total,
  label = "Submit",
}: {
  attemptId: string;
  section?: SectionCode;
  /** The form being sat, carried to the next section's player. */
  formId?: string;
  answeredCount: number;
  total: number;
  label?: string;
}) {
  const next = section ? NEXT_SECTION[section] : undefined;
  const navigate = useNavigate();
  const submit = useSubmitAttempt();
  const [error, setError] = useState<string | null>(null);
  const blank = total - answeredCount;

  async function onSubmit() {
    setError(null);
    try {
      if (next) {
        // Marks this section and keeps the attempt open for the next one.
        await submit.mutateAsync({ attemptId, section });
        navigate({ to: next.to as "/test/reading", search: (formId ? { form: formId } : {}) as never });
      } else {
        await submit.mutateAsync({ attemptId });
        navigate({ to: "/results/$attemptId", params: { attemptId } });
      }
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
            {submit.isPending
              ? "Submitting…"
              : next
                ? `Submit and continue to ${next.section}`
                : `Submit ${section ?? "section"}`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
