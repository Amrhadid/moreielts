import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeftRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useMemo, useRef, useState } from "react";
import { PlayerHeader } from "~/components/player/PlayerHeader";
import { PlayerStatus } from "~/components/player/PlayerStatus";
import { QuestionBlock } from "~/components/player/QuestionBlock";
import { QuestionNavigator } from "~/components/player/QuestionNavigator";
import { SubmitDialog } from "~/components/player/SubmitDialog";
import { usePassageSize } from "~/components/player/usePassageSize";
import { Button } from "~/components/ui/Button";
import { cn } from "~/lib/cn";
import { Protected } from "~/lib/auth";
import { usePlayerAttempt } from "~/lib/usePlayerAttempt";

export const Route = createFileRoute("/test/reading")({ component: ReadingRoute });

function ReadingRoute() {
  return (
    <Protected>
      <ReadingPlayer />
    </Protected>
  );
}

const MIN_SPLIT = 35;
const MAX_SPLIT = 65;

function ReadingPlayer() {
  const player = usePlayerAttempt("reading");
  const [mobilePane, setMobilePane] = useState<"passage" | "questions">("passage");
  const [current, setCurrent] = useState(1);
  const [split, setSplit] = useState(50);
  const [swapped, setSwapped] = useState(false);
  const refs = useRef(new Map<number, HTMLDivElement>());
  const bodyRef = useRef<HTMLDivElement | null>(null);
  const passageRef = useRef<HTMLDivElement | null>(null);
  const textSize = usePassageSize();

  const numbers = useMemo(
    () => player.flat.map((i) => i.question.number),
    [player.flat],
  );

  const parts = useMemo(
    () =>
      player.groups.map((g) => ({
        label: `Passage ${g.partNumber}`,
        numbers: g.questions.map((q) => q.number),
      })),
    [player.groups],
  );

  const registerRef = useCallback((n: number, el: HTMLDivElement | null) => {
    if (el) refs.current.set(n, el);
    else refs.current.delete(n);
  }, []);

  const jumpTo = useCallback((n: number) => {
    setCurrent(n);
    refs.current.get(n)?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  /* ------------------------------------------------------------ divider */

  const dragging = useRef(false);
  function onDividerDown(e: React.PointerEvent<HTMLDivElement>) {
    dragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
  }
  function onDividerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragging.current || !bodyRef.current) return;
    const rect = bodyRef.current.getBoundingClientRect();
    let pct = ((e.clientX - rect.left) / rect.width) * 100;
    if (swapped) pct = 100 - pct;
    setSplit(Math.max(MIN_SPLIT, Math.min(MAX_SPLIT, pct)));
  }
  function onDividerUp() {
    dragging.current = false;
  }

  /* --------------------------------------------------------- highlights */

  function highlightSelection() {
    const root = passageRef.current;
    const selection = window.getSelection();
    if (!root || !selection || selection.rangeCount === 0 || selection.isCollapsed) return;
    const range = selection.getRangeAt(0);
    if (!root.contains(range.commonAncestorContainer)) return;
    const mark = document.createElement("mark");
    try {
      range.surroundContents(mark);
    } catch {
      // The selection crosses element boundaries; lift the contents instead.
      mark.appendChild(range.extractContents());
      range.insertNode(mark);
    }
    selection.removeAllRanges();
  }

  function clearHighlights() {
    const root = passageRef.current;
    if (!root) return;
    root.querySelectorAll("mark").forEach((mark) => {
      const parent = mark.parentNode;
      if (!parent) return;
      while (mark.firstChild) parent.insertBefore(mark.firstChild, mark);
      parent.removeChild(mark);
      parent.normalize();
    });
  }

  if (player.loading || player.error) {
    return <PlayerStatus loading={player.loading} error={player.error} />;
  }

  const currentIndex = numbers.indexOf(current);
  const currentGroup =
    player.flat.find((i) => i.question.number === current)?.group ?? player.groups[0];

  function step(delta: number) {
    const next = numbers[currentIndex + delta];
    if (next !== undefined) {
      jumpTo(next);
      setMobilePane("questions");
    }
  }

  const passageWidth = swapped ? 100 - split : split;

  return (
    <div className="flex h-screen flex-col bg-paper" style={textSize.style}>
      <PlayerHeader
        section="reading"
        sectionName="Reading"
        contextLabel={`Passage ${currentGroup?.partNumber ?? 1} of ${player.groups.length} · ${player.form?.title ?? "Mock test"}`}
        remaining={player.remaining ?? 0}
        textSizeIndex={textSize.index}
        onTextSize={textSize.setIndex}
        right={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSwapped((s) => !s)}
              className="hidden md:inline-flex"
              aria-label={swapped ? "Put the passage on the left" : "Put the questions on the left"}
            >
              <ArrowLeftRight className="h-3.5 w-3.5" aria-hidden />
              Swap
            </Button>
            <SubmitDialog
              attemptId={player.attemptId!}
              section="reading"
              answeredCount={player.answered.size}
              total={numbers.length}
              flaggedCount={player.flagged.size}
            />
          </>
        }
      />

      <PlayerStatus saveError={player.saveError} inline />

      {/* Mobile pane toggle */}
      <div className="flex border-b border-line bg-surface md:hidden">
        {(["passage", "questions"] as const).map((pane) => (
          <button
            key={pane}
            type="button"
            onClick={() => setMobilePane(pane)}
            className={cn(
              "-mb-px flex-1 border-b-2 py-2.5 text-sm font-semibold capitalize transition-colors",
              mobilePane === pane
                ? "border-brand-600 text-brand-700"
                : "border-transparent text-muted",
            )}
          >
            {pane}
          </button>
        ))}
      </div>

      <div
        ref={bodyRef}
        className="flex min-h-0 flex-1"
        style={{ flexDirection: swapped ? "row-reverse" : "row" }}
      >
        {/* Passage pane */}
        <section
          className={cn(
            "thin-scroll min-h-0 overflow-y-auto bg-surface px-5 py-6 md:block md:px-9",
            mobilePane === "passage" ? "block w-full" : "hidden",
          )}
          style={{ flexBasis: `${passageWidth}%`, flexGrow: 0, flexShrink: 0 }}
          aria-label="Reading passage"
        >
          <div className="mx-auto max-w-[66ch]">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
              <p className="text-[0.6875rem] font-bold uppercase tracking-[0.1em] text-muted">
                Passage {currentGroup?.partNumber}
              </p>
              <div className="flex gap-1 text-xs">
                <button
                  type="button"
                  onClick={highlightSelection}
                  className="rounded-md px-2 py-1 font-semibold text-brand-600 hover:bg-brand-50"
                >
                  Highlight selection
                </button>
                <button
                  type="button"
                  onClick={clearHighlights}
                  className="rounded-md px-2 py-1 font-semibold text-brand-600 hover:bg-brand-50"
                >
                  Clear all
                </button>
              </div>
            </div>
            <h2 className="display mb-4 text-[1.4375rem] leading-snug">{currentGroup?.title}</h2>
            <div ref={passageRef} className="prose-passage">
              {currentGroup?.passageText?.split("\n\n").map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>
        </section>

        {/* Divider (desktop) */}
        <div
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize panes"
          onPointerDown={onDividerDown}
          onPointerMove={onDividerMove}
          onPointerUp={onDividerUp}
          onPointerCancel={onDividerUp}
          className="hidden w-2.5 shrink-0 cursor-col-resize touch-none place-items-center bg-line md:grid"
        >
          <span className="h-7 w-0.5 rounded-full bg-line-strong" aria-hidden />
        </div>

        {/* Questions pane */}
        <section
          className={cn(
            "thin-scroll min-h-0 min-w-0 flex-1 overflow-y-auto px-4 py-5 md:block md:px-7",
            mobilePane === "questions" ? "block w-full" : "hidden",
          )}
          aria-label="Questions"
        >
          <div className="mx-auto max-w-2xl">
            {player.groups.map((group) => (
              <QuestionBlock
                key={group.id}
                group={group}
                answers={player.answers}
                onAnswer={player.setAnswer}
                current={current}
                flagged={player.flagged}
                onToggleFlag={player.toggleFlag}
                onFocusQuestion={setCurrent}
                registerRef={registerRef}
              />
            ))}

            <div className="flex items-center justify-between gap-3 pb-4">
              <Button variant="outline" onClick={() => step(-1)} disabled={currentIndex <= 0}>
                <ChevronLeft className="h-4 w-4" aria-hidden />
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={() => step(1)}
                disabled={currentIndex >= numbers.length - 1}
              >
                Next
                <ChevronRight className="h-4 w-4" aria-hidden />
              </Button>
            </div>
          </div>
        </section>
      </div>

      <QuestionNavigator
        parts={parts}
        answered={player.answered}
        flagged={player.flagged}
        current={current}
        onJump={(n) => {
          setMobilePane("questions");
          jumpTo(n);
        }}
        onJumpPart={(index) => {
          const first = parts[index]?.numbers[0];
          if (first !== undefined) {
            setMobilePane("questions");
            jumpTo(first);
          }
        }}
      />
    </div>
  );
}
