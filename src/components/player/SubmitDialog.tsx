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

export function SubmitDialog({
  answeredCount,
  total,
  label = "Submit",
}: {
  answeredCount: number;
  total: number;
  label?: string;
}) {
  const navigate = useNavigate();
  const blank = total - answeredCount;

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
        <div className="mt-6 flex justify-end gap-2">
          <DialogClose asChild>
            <Button variant="outline">Keep working</Button>
          </DialogClose>
          {/* TODO(backend): POST the answer sheet, then route to the real result. */}
          <Button onClick={() => navigate({ to: "/results/$attemptId", params: { attemptId: "a-104" } })}>
            Submit section
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
