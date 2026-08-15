import type { Question } from "~/types/content";

/** Every renderer receives the same contract. */
export interface RendererProps {
  question: Question;
  value: string | string[] | undefined;
  onChange: (value: string | string[]) => void;
  disabled?: boolean;
}
