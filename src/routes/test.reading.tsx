import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useMemo, useRef, useState } from "react";
import { PassageHighlighter } from "~/components/player/PassageHighlighter";
import { PlayerHeader } from "~/components/player/PlayerHeader";
import { PlayerStatus } from "~/components/player/PlayerStatus";
import { QuestionBlock } from "~/components/player/QuestionBlock";
import { QuestionNavigator } from "~/components/player/QuestionNavigator";
import { SubmitDialog } from "~/components/player/SubmitDialog";
import { useFlags } from "~/components/player/useFlags";
import { usePassageSize } from "~/components/player/usePassageSize";
import { Button } from "~/components/ui/Button";
import { Icon } from "~/components/ui/Icon";
import { cn } from "~/lib/cn";
import { PremiumGate } from "~/lib/auth";
import { usePlayerAttempt } from "~/lib/usePlayerAttempt";

export const Route = createFileRoute("/test/reading")({
  validateSearch: (s: Record<string, unknown>): { form?: string } =>
    typeof s.form === "string" ? { form: s.form } : {},
  component: ReadingRoute,
});

function ReadingRoute() {
  return (
    <PremiumGate>
      <ReadingPlayer />
    </PremiumGate>
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
  const { flagged, toggleFlag } = useFlags(player.attemptId, "reading");
  const refs = useRef(new Map<number, HTMLDivElement>());
  const bodyRef = useRef<HTMLDivElement | null>(null);
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
    const rtl = getComputedStyle(bodyRef.current).direction === "rtl";
    let pct = ((e.clientX - rect.left) / rect.width) * 100;
    if (rtl) pct = 100 - pct;
    if (swapped) pct = 100 - pct;
    setSplit(Math.max(MIN_SPLIT, Math.min(MAX_SPLIT, pct)));
  }
  function onDividerUp() {
    dragging.current = false;
  }

  if (player.loading || player.error) {
    return <PlayerStatus loading={player.loading} error={player.error} action={player.errorAction} />;
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
              aria-label={swapped ? "Put the passage first" : "Put the questions first"}
            >
              <Icon name="swap" size={14} />
              Swap
            </Button>
            <SubmitDialog
              attemptId={player.attemptId!}
              section="reading"
              formId={player.form?.id}
              answeredCount={player.answered.size}
              total={numbers.length}
              flaggedCount={flagged.size}
            />
          </>
        }
      />

      <PlayerStatus saveError={player.saveError} inline />

      {/* Mobile pane toggle */}
      <div className="flex border-b border-line bg-surface md:hidden" role="tablist">
        {(["passage", "questions"] as const).map((pane) => (
          <button
            key={pane}
            type="button"
            role="tab"
            aria-selected={mobilePane === pane}
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
            <p className="text-[0.6875rem] font-bold uppercase tracking-[0.1em] text-muted">
              Passage {currentGroup?.partNumber}
            </p>
            <h2 className="display mb-4 mt-1 text-[1.4375rem] leading-snug">{currentGroup?.title}</h2>
            {currentGroup?.passageText && (
              <PassageHighlighter
                text={currentGroup.passageText}
                attemptId={player.attemptId ?? "local"}
                groupId={currentGroup.id}
              />
            )}
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
                registerRef={registerRef}
                flagged={flagged}
                onToggleFlag={toggleFlag}
                onFocusQuestion={setCurrent}
              />
            ))}

            <div className="flex items-center justify-between gap-3 pb-4">
              <Button variant="outline" onClick={() => step(-1)} disabled={currentIndex <= 0}>
                <Icon name="arrowRight" size={16} className="rotate-180 rtl:rotate-0" />
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={() => step(1)}
                disabled={currentIndex >= numbers.length - 1}
              >
                Next
                <Icon name="arrowRight" size={16} className="rtl:rotate-180" />
              </Button>
            </div>
          </div>
        </section>
      </div>

      <QuestionNavigator
        parts={parts}
        answered={player.answered}
        flagged={flagged}
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
