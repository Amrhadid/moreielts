import { useState, type CSSProperties } from "react";
import { DEFAULT_TEXT_SIZE_INDEX, TEXT_SIZES } from "./PlayerHeader";

/** Text-size control state. The index drives --passage-size on the player root. */
export function usePassageSize() {
  const [index, setIndex] = useState<number>(DEFAULT_TEXT_SIZE_INDEX);
  const style = { "--passage-size": `${TEXT_SIZES[index]}rem` } as CSSProperties;
  return { index, setIndex, style };
}
