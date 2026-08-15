import { getQuestionType } from "~/registry/questionTypes";
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
  const Renderer = RENDERERS[getQuestionType(props.question.type).renderer];
  return <Renderer {...props} />;
}
