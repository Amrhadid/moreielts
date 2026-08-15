import { useState } from "react";

/**
 * Minimal HTML5 drag-and-drop reordering. Returns props to spread onto each
 * draggable row; `onReorder` receives the moved item's from/to indices.
 */
export function useDragList(onReorder: (from: number, to: number) => void) {
  const [dragging, setDragging] = useState<number | null>(null);
  const [over, setOver] = useState<number | null>(null);

  function dragProps(index: number) {
    return {
      draggable: true,
      onDragStart: (e: React.DragEvent) => {
        setDragging(index);
        e.dataTransfer.effectAllowed = "move";
      },
      onDragOver: (e: React.DragEvent) => {
        e.preventDefault();
        if (over !== index) setOver(index);
      },
      onDrop: (e: React.DragEvent) => {
        e.preventDefault();
        if (dragging !== null && dragging !== index) onReorder(dragging, index);
        setDragging(null);
        setOver(null);
      },
      onDragEnd: () => {
        setDragging(null);
        setOver(null);
      },
      "data-dragging": dragging === index ? "true" : undefined,
      "data-over": over === index && dragging !== index ? "true" : undefined,
    };
  }

  return { dragProps };
}

/** Pure array move used by both group and question reordering. */
export function moveItem<T>(items: T[], from: number, to: number): T[] {
  const next = [...items];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return next;
}
