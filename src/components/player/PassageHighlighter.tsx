import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "~/components/ui/Button";
import { Icon } from "~/components/ui/Icon";
import { cn } from "~/lib/cn";

interface Highlight {
  id: string;
  /** Paragraph index and character offsets inside that paragraph's text. */
  para: number;
  start: number;
  end: number;
  note?: string;
}

function storageKey(attemptId: string, groupId: string) {
  return `moreielts:highlights:${attemptId}:${groupId}`;
}

function load(key: string): Highlight[] {
  try {
    const raw = window.localStorage.getItem(key);
    const parsed = raw ? (JSON.parse(raw) as Highlight[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persist(key: string, value: Highlight[]) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable: highlights stay for this page view only */
  }
}

/** Character offset of (node, offset) from the start of `root`'s text. */
function offsetIn(root: HTMLElement, node: Node, offset: number) {
  const range = document.createRange();
  range.selectNodeContents(root);
  range.setEnd(node, offset);
  return range.toString().length;
}

/**
 * The reading passage with learner highlights and notes. Select text, then
 * press "Highlight" (or H). Click a highlight to remove it or add a note.
 */
export function PassageHighlighter({
  text,
  attemptId,
  groupId,
}: {
  text: string;
  attemptId: string;
  groupId: string;
}) {
  const key = storageKey(attemptId, groupId);
  const paragraphs = text.split("\n\n");
  const rootRef = useRef<HTMLDivElement>(null);
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [pending, setPending] = useState<null | { para: number; start: number; end: number; x: number; y: number }>(null);
  const [active, setActive] = useState<null | { id: string; x: number; y: number }>(null);
  const [noteDraft, setNoteDraft] = useState<string | null>(null);

  useEffect(() => {
    setHighlights(load(key));
    setPending(null);
    setActive(null);
  }, [key]);

  const update = useCallback(
    (next: Highlight[]) => {
      setHighlights(next);
      persist(key, next);
    },
    [key],
  );

  function readSelection() {
    const root = rootRef.current;
    const sel = window.getSelection();
    if (!root || !sel || sel.isCollapsed || sel.rangeCount === 0) return setPending(null);
    const range = sel.getRangeAt(0);
    const startEl = (range.startContainer.nodeType === 1
      ? (range.startContainer as Element)
      : range.startContainer.parentElement
    )?.closest<HTMLElement>("[data-para]");
    if (!startEl || !root.contains(startEl)) return setPending(null);
    const para = Number(startEl.dataset.para);
    const start = offsetIn(startEl, range.startContainer, range.startOffset);
    // A selection running past the paragraph is clipped to its end.
    const end = startEl.contains(range.endContainer)
      ? offsetIn(startEl, range.endContainer, range.endOffset)
      : (paragraphs[para]?.length ?? start);
    if (end <= start) return setPending(null);
    const rect = range.getBoundingClientRect();
    const box = root.getBoundingClientRect();
    setActive(null);
    setPending({ para, start, end, x: rect.left - box.left + rect.width / 2, y: rect.top - box.top });
  }

  const addHighlight = useCallback(() => {
    if (!pending) return;
    const { para, start, end } = pending;
    // Merge with any highlight it overlaps so ranges never nest.
    let s = start;
    let e = end;
    const notes: string[] = [];
    const kept = highlights.filter((h) => {
      const overlaps = h.para === para && h.start < e && h.end > s;
      if (overlaps) {
        s = Math.min(s, h.start);
        e = Math.max(e, h.end);
        if (h.note) notes.push(h.note);
      }
      return !overlaps;
    });
    update([...kept, { id: crypto.randomUUID(), para, start: s, end: e, note: notes.join(" · ") || undefined }]);
    window.getSelection()?.removeAllRanges();
    setPending(null);
  }, [pending, highlights, update]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) return;
      if ((event.key === "h" || event.key === "H") && pending && !event.metaKey && !event.ctrlKey) {
        event.preventDefault();
        addHighlight();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pending, addHighlight]);

  function renderParagraph(para: string, index: number) {
    const marks = highlights.filter((h) => h.para === index).sort((a, b) => a.start - b.start);
    const parts: React.ReactNode[] = [];
    let cursor = 0;
    for (const h of marks) {
      if (h.start > cursor) parts.push(para.slice(cursor, h.start));
      parts.push(
        <mark
          key={h.id}
          role="button"
          tabIndex={0}
          title={h.note || "Highlighted — click for options"}
          onClick={(e) => {
            const box = rootRef.current!.getBoundingClientRect();
            const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
            setPending(null);
            setNoteDraft(null);
            setActive({ id: h.id, x: rect.left - box.left + rect.width / 2, y: rect.top - box.top });
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") (e.currentTarget as HTMLElement).click();
          }}
          className={cn(
            "cursor-pointer rounded-sm bg-yellow-200 px-0.5 text-inherit dark:bg-yellow-500/40",
            h.note && "underline decoration-warn decoration-dotted underline-offset-4",
          )}
        >
          {para.slice(h.start, h.end)}
        </mark>,
      );
      cursor = h.end;
    }
    if (cursor < para.length) parts.push(para.slice(cursor));
    return (
      <p key={index} data-para={index}>
        {parts}
      </p>
    );
  }

  const activeHighlight = active ? highlights.find((h) => h.id === active.id) : undefined;
  const notes = highlights
    .filter((h) => h.note)
    .sort((a, b) => a.para - b.para || a.start - b.start);

  return (
    <div>
      <div ref={rootRef} className="relative" onMouseUp={readSelection} onKeyUp={readSelection} onTouchEnd={() => setTimeout(readSelection, 0)}>
        <div className="prose-passage">{paragraphs.map(renderParagraph)}</div>

        {pending && (
          <div
            className="absolute z-20 -translate-x-1/2 -translate-y-full pb-2 rtl:translate-x-1/2"
            style={{ left: pending.x, top: pending.y }}
          >
            <Button size="sm" onMouseDown={(e) => e.preventDefault()} onClick={addHighlight}>
              <Icon name="highlighter" size={16} />
              Highlight <kbd className="text-xs opacity-70">H</kbd>
            </Button>
          </div>
        )}

        {active && activeHighlight && (
          <div
            className="absolute z-20 w-64 -translate-x-1/2 -translate-y-full pb-2 rtl:translate-x-1/2"
            style={{ left: active.x, top: active.y }}
          >
            <div className="rounded-lg border border-line bg-surface p-2 shadow-lg">
              {noteDraft === null ? (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setNoteDraft(activeHighlight.note ?? "")}
                  >
                    {activeHighlight.note ? "Edit note" : "Add note"}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-bad"
                    onClick={() => {
                      update(highlights.filter((h) => h.id !== activeHighlight.id));
                      setActive(null);
                    }}
                  >
                    Remove
                  </Button>
                  <button
                    type="button"
                    aria-label="Close"
                    className="ms-auto text-muted"
                    onClick={() => setActive(null)}
                  >
                    <Icon name="x" size={16} />
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    update(
                      highlights.map((h) =>
                        h.id === activeHighlight.id ? { ...h, note: noteDraft.trim() || undefined } : h,
                      ),
                    );
                    setNoteDraft(null);
                    setActive(null);
                  }}
                >
                  <textarea
                    autoFocus
                    rows={3}
                    value={noteDraft}
                    onChange={(e) => setNoteDraft(e.target.value)}
                    className="w-full rounded-md border border-line-strong bg-surface p-2 text-sm"
                    placeholder="Your note"
                  />
                  <div className="mt-2 flex justify-end gap-2">
                    <Button type="button" size="sm" variant="ghost" onClick={() => setNoteDraft(null)}>
                      Cancel
                    </Button>
                    <Button type="submit" size="sm">
                      Save
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>

      {notes.length > 0 && (
        <aside className="mt-8 rounded-lg border border-line bg-paper p-4" aria-label="Your notes">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted">Your notes</p>
          <ul className="grid gap-2">
            {notes.map((h) => (
              <li key={h.id} className="text-sm">
                <span className="rounded-sm bg-yellow-200 px-1 dark:bg-yellow-500/40">
                  {paragraphs[h.para]?.slice(h.start, h.end).slice(0, 60)}
                  {h.end - h.start > 60 ? "…" : ""}
                </span>
                <span className="ms-2 text-ink-soft">{h.note}</span>
              </li>
            ))}
          </ul>
        </aside>
      )}
    </div>
  );
}
