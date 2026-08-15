import { Input } from "~/components/ui/Field";
import { getQuestionType } from "~/registry/questionTypes";
import { countWords } from "~/lib/text";
import type { RendererProps } from "./types";

/**
 * Gap-fill renderer. Serves every completion type plus diagram labelling and
 * short answer. The word limit is advisory here -- the candidate is warned but
 * never blocked from typing.
 */
export function TextInputRenderer({
  question,
  value,
  onChange,
  disabled,
}: RendererProps) {
  const limit = question.wordLimit ?? getQuestionType(question.type).defaultWordLimit;
  const text = typeof value === "string" ? value : "";
  const over = limit > 0 && countWords(text) > limit;

  return (
    <div className="max-w-md">
      <Input
        value={text}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        placeholder={limit > 0 ? `Up to ${limit} word${limit > 1 ? "s" : ""}` : "Your answer"}
        aria-label={question.prompt}
        aria-describedby={over ? `${question.id}-warn` : undefined}
      />
      {over && (
        <p id={`${question.id}-warn`} className="mt-1.5 text-xs text-warn">
          Over the {limit}-word limit — answers longer than this are marked wrong.
        </p>
      )}
    </div>
  );
}
