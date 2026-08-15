import * as RG from "@radix-ui/react-radio-group";
import { cn } from "~/lib/cn";
import type { RendererProps } from "./types";

/**
 * Single-choice renderer. Serves multiple_choice_single, true_false_notgiven
 * and yes_no_notgiven.
 */
export function RadioRenderer({
  question,
  value,
  onChange,
  disabled,
}: RendererProps) {
  const selected = typeof value === "string" ? value : undefined;
  return (
    <RG.Root
      value={selected}
      onValueChange={onChange}
      disabled={disabled}
      className="grid gap-2"
    >
      {question.options?.map((option) => {
        const id = `${question.id}-${option.value}`;
        const active = selected === option.value;
        return (
          <label
            key={option.value}
            htmlFor={id}
            className={cn(
              "flex cursor-pointer items-start gap-3 rounded-lg border px-3 py-2.5 text-sm transition-colors",
              active
                ? "border-brand-500 bg-brand-50"
                : "border-line hover:border-line-strong hover:bg-paper",
            )}
          >
            <RG.Item
              id={id}
              value={option.value}
              className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full border border-line-strong bg-surface data-[state=checked]:border-brand-600"
            >
              <RG.Indicator className="h-2 w-2 rounded-full bg-brand-600" />
            </RG.Item>
            <span className="leading-relaxed">{option.label}</span>
          </label>
        );
      })}
    </RG.Root>
  );
}
