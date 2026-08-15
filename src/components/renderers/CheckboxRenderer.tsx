import * as CB from "@radix-ui/react-checkbox";
import { cn } from "~/lib/cn";
import type { RendererProps } from "./types";

/** Multi-select renderer. Serves multiple_choice_multiple. */
export function CheckboxRenderer({
  question,
  value,
  onChange,
  disabled,
}: RendererProps) {
  const selected = Array.isArray(value) ? value : [];

  function toggle(optionValue: string, checked: boolean) {
    const next = checked
      ? [...selected, optionValue]
      : selected.filter((v) => v !== optionValue);
    onChange(next.sort());
  }

  return (
    <div className="grid gap-2">
      {question.options?.map((option) => {
        const id = `${question.id}-${option.value}`;
        const active = selected.includes(option.value);
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
            <CB.Root
              id={id}
              checked={active}
              disabled={disabled}
              onCheckedChange={(c) => toggle(option.value, c === true)}
              className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded border border-line-strong bg-surface data-[state=checked]:border-brand-600 data-[state=checked]:bg-brand-600"
            >
              <CB.Indicator className="text-[10px] font-bold leading-none text-white">
                ✓
              </CB.Indicator>
            </CB.Root>
            <span className="leading-relaxed">{option.label}</span>
          </label>
        );
      })}
    </div>
  );
}
