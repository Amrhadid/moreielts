import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PlayerHeader } from "~/components/player/PlayerHeader";
import { QuestionBlock } from "~/components/player/QuestionBlock";
import { QuestionNavigator } from "~/components/player/QuestionNavigator";
import { SubmitDialog } from "~/components/player/SubmitDialog";
import { useAnswers } from "~/components/player/useAnswers";
import { Button } from "~/components/ui/Button";
import { cn } from "~/lib/cn";
import { useCountdown } from "~/lib/useCountdown";
import { flatQuestions, getSection } from "~/mock/testForm";

export const Route = createFileRoute("/test/reading")({ component: ReadingPlayer });

function ReadingPlayer() {
  const section = getSection("reading");
  const items = useMemo(() => flatQuestions("reading"), []);
  const numbers = useMemo(() => items.map((i) => i.question.number), [items]);
  const idFor = useMemo(() => {
    const map = new Map(items.map((i) => [i.question.number, i.question.id]));
    return (n: number) => map.get(n) ?? "";
  }, [items]);

  const { answers, setAnswer, current, jumpTo, answered, registerRef } = useAnswers(
    numbers,
    idFor,
  );
  const { remaining } = useCountdown(section.durationMinutes * 60);

  /** Mobile only — desktop always shows both panes. */
  const [mobilePane, setMobilePane] = useState<"passage" | "questions">("passage");

  const currentIndex = numbers.indexOf(current);
  const currentGroup =
    items.find((i) => i.question.number === current)?.group ?? section.itemGroups[0];

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
        contextLabel={`Passage ${currentGroup.partNumber} of ${section.itemGroups.length} · Question ${current} of 40`}
        remaining={remaining}
        right={<SubmitDialog answeredCount={answered.size} total={numbers.length} />}
      />

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
              Passage {currentGroup.partNumber}
            </p>
            <h2 className="mt-1 mb-5 text-xl font-semibold tracking-tight">
              {currentGroup.title.replace(/^Passage \d+ — /, "")}
            </h2>
            <div className="prose-passage">
              {currentGroup.passageText?.split("\n\n").map((para, i) => (
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
            {section.itemGroups.map((group) => (
              <QuestionBlock
                key={group.id}
                group={group}
                answers={answers}
                onAnswer={setAnswer}
                current={current}
                registerRef={registerRef}
              />
            ))}

            <div className="flex items-center justify-between gap-3 pb-4">
              <Button
                variant="outline"
                onClick={() => step(-1)}
                disabled={currentIndex <= 0}
              >
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
        answered={answered}
        current={current}
        onJump={(n) => {
          setMobilePane("questions");
          jumpTo(n);
        }}
      />
    </div>
  );
}
