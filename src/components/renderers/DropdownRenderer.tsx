import { Select } from "~/components/ui/Select";
import type { RendererProps } from "./types";

/**
 * Dropdown renderer. Serves the four matching types, where the same option
 * list is shared across every question in the group.
 */
export function DropdownRenderer({ question, value, onChange }: RendererProps) {
  return (
    <Select
      aria-label={question.prompt}
      value={typeof value === "string" ? value : undefined}
      onValueChange={onChange}
      options={question.options ?? []}
      placeholder="Choose an answer…"
      className="max-w-md"
    />
  );
}
