import { useState, type CSSProperties } from "react";

/** Passage text sizes the A- / A+ control steps through, in rem. */
export const TEXT_SIZES = [0.9375, 1.0625, 1.125, 1.25] as const;
export const DEFAULT_TEXT_SIZE_INDEX = 1;

/** Text-size control state. The index drives --passage-size on the player root. */
export function usePassageSize() {
  const [index, setIndex] = useState<number>(DEFAULT_TEXT_SIZE_INDEX);
  const style = { "--passage-size": `${TEXT_SIZES[index]}rem` } as CSSProperties;
  return { index, setIndex, style };
}
