import type { RendererKey } from "~/types/content";
import { CheckboxRenderer } from "./CheckboxRenderer";
import { DropdownRenderer } from "./DropdownRenderer";
import { RadioRenderer } from "./RadioRenderer";
import { TextInputRenderer } from "./TextInputRenderer";
import type { RendererProps } from "./types";

/**
 * Registry-driven dispatch. Components never switch on the question type --
 * they look up the renderer key and render whichever of the four applies.
 */
const RENDERERS: Record<RendererKey, (p: RendererProps) => React.ReactElement> = {
  radio: RadioRenderer,
  checkbox: CheckboxRenderer,
  dropdown: DropdownRenderer,
  text_input: TextInputRenderer,
};

export function QuestionRenderer(props: RendererProps) {
  // question_types.renderer is the single source of truth, supplied with every
  // row by the questions_public view. text_input is the safe fallback for a
  // renderer this client build does not recognise yet.
  const renderer = props.question.renderer ?? "text_input";
  return (RENDERERS[renderer] ?? RENDERERS.text_input)(props);
}
