import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useMemo, useRef, useState } from "react";
import { PlayerHeader } from "~/components/player/PlayerHeader";
import { PlayerStatus } from "~/components/player/PlayerStatus";
import { QuestionBlock } from "~/components/player/QuestionBlock";
import { QuestionNavigator } from "~/components/player/QuestionNavigator";
import { SubmitDialog } from "~/components/player/SubmitDialog";
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

function ReadingPlayer() {
  const player = usePlayerAttempt("reading");
  const [mobilePane, setMobilePane] = useState<"passage" | "questions">("passage");
  const [current, setCurrent] = useState(1);
  const refs = useRef(new Map<number, HTMLDivElement>());

  const numbers = useMemo(
    () => player.flat.map((i) => i.question.number),
    [player.flat],
  );

  const registerRef = useCallback((n: number, el: HTMLDivElement | null) => {
    if (el) refs.current.set(n, el);
    else refs.current.delete(n);
  }, []);

  const jumpTo = useCallback((n: number) => {
    setCurrent(n);
    refs.current.get(n)?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

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

  return (
    <div className="flex h-screen flex-col bg-paper">
      <PlayerHeader
        sectionName="Reading"
        contextLabel={`Passage ${currentGroup?.partNumber ?? 1} of ${player.groups.length} · Question ${current} of ${numbers.length}`}
        remaining={player.remaining ?? 0}
        right={
          <SubmitDialog
            attemptId={player.attemptId!}
            section="reading"
            answeredCount={player.answered.size}
            total={numbers.length}
          />
        }
      />

      <PlayerStatus saving={player.saving} saveError={player.saveError} inline />

      {/* Mobile pane toggle */}
      <div className="flex border-b border-line bg-surface md:hidden">
        {(["passage", "questions"] as const).map((pane) => (
          <button
            key={pane}
            type="button"
            onClick={() => setMobilePane(pane)}
            className={cn(
              "flex-1 py-2.5 text-sm font-medium capitalize transition-colors",
              mobilePane === pane
                ? "border-b-2 border-brand-600 text-brand-700"
                : "text-muted",
            )}
          >
            {pane}
          </button>
        ))}
      </div>

      <div className="flex min-h-0 flex-1 md:divide-x md:divide-line">
        {/* Passage pane */}
        <section
          className={cn(
            "thin-scroll min-h-0 overflow-y-auto bg-surface px-5 py-6 md:block md:w-1/2 md:px-8",
            mobilePane === "passage" ? "block w-full" : "hidden",
          )}
          aria-label="Reading passage"
        >
          <div className="mx-auto max-w-[62ch]">
            <p className="text-xs font-medium uppercase tracking-wide text-muted">
              Passage {currentGroup?.partNumber}
            </p>
            <h2 className="mt-1 mb-5 text-xl font-semibold tracking-tight">
              {currentGroup?.title}
            </h2>
            <div className="prose-passage">
              {currentGroup?.passageText?.split("\n\n").map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>
        </section>

        {/* Questions pane */}
        <section
          className={cn(
            "thin-scroll min-h-0 overflow-y-auto px-4 py-6 md:block md:w-1/2 md:px-6",
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
              />
            ))}

            <div className="flex items-center justify-between gap-3 pb-4">
              <Button variant="outline" onClick={() => step(-1)} disabled={currentIndex <= 0}>
                ← Previous
              </Button>
              <Button
                variant="outline"
                onClick={() => step(1)}
                disabled={currentIndex >= numbers.length - 1}
              >
                Next →
              </Button>
            </div>
          </div>
        </section>
      </div>

      <QuestionNavigator
        numbers={numbers}
        answered={player.answered}
        current={current}
        onJump={(n) => {
          setMobilePane("questions");
          jumpTo(n);
        }}
      />
    </div>
  );
}
