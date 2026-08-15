import { Button } from "~/components/ui/Button";
import { Card, CardBody } from "~/components/ui/Card";
import { Input, Label, Textarea } from "~/components/ui/Field";
import { Select } from "~/components/ui/Select";
import { cn } from "~/lib/cn";
import { questionTypesForSection } from "~/registry/questionTypes";
import { moveItem, useDragList } from "./useDragList";
import { QuestionRow } from "./QuestionRow";
import type { ItemGroup, Question, SectionCode, StimulusKind } from "~/types/content";

const STIMULUS_OPTIONS: Array<{ value: StimulusKind; label: string }> = [
  { value: "passage", label: "Reading passage" },
  { value: "audio", label: "Audio part" },
  { value: "image", label: "Image / diagram" },
  { value: "cue_card", label: "Speaking cue card" },
  { value: "writing_task", label: "Writing task prompt" },
  { value: "none", label: "No stimulus" },
];

/** An item group card: shared stimulus + instructions + its ordered questions. */
export function GroupCard({
  group,
  section,
  onChange,
  onDelete,
  dragProps,
}: {
  group: ItemGroup;
  section: SectionCode;
  onChange: (next: ItemGroup) => void;
  onDelete: () => void;
  dragProps: Record<string, unknown>;
}) {
  const { dragProps: questionDrag } = useDragList((from, to) =>
    onChange({ ...group, questions: moveItem(group.questions, from, to) }),
  );

  function patch(partial: Partial<ItemGroup>) {
    onChange({ ...group, ...partial });
  }

  function addQuestion() {
    const fallback = questionTypesForSection(section)[0];
    const nextNumber =
      Math.max(0, ...group.questions.map((q) => q.number)) + 1;
    const question: Question = {
      id: `${group.id}-q${nextNumber}-${group.questions.length}`,
      number: nextNumber,
      type: fallback.code,
      prompt: "",
      acceptedAnswers: [],
      wordLimit: fallback.defaultWordLimit,
      options: fallback.renderer === "text_input" ? undefined : [],
    };
    patch({ questions: [...group.questions, question] });
  }

  return (
    <Card
      {...dragProps}
      className={cn(
        "data-[dragging=true]:opacity-40 data-[over=true]:border-brand-500",
      )}
    >
      <CardBody className="pt-5">
        <div className="flex items-start gap-3">
          <span
            aria-hidden
            title="Drag to reorder"
            className="mt-2 cursor-grab select-none text-muted"
          >
            ⠿
          </span>
          <div className="min-w-0 flex-1">
            <div className="grid gap-3 sm:grid-cols-[1fr_9rem_11rem]">
              <div>
                <Label htmlFor={`${group.id}-title`}>Group title</Label>
                <Input
                  id={`${group.id}-title`}
                  value={group.title}
                  onChange={(e) => patch({ title: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor={`${group.id}-part`}>Part number</Label>
                <Input
                  id={`${group.id}-part`}
                  type="number"
                  min={1}
                  value={group.partNumber}
                  onChange={(e) => patch({ partNumber: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label>Stimulus</Label>
                <Select
                  aria-label="Stimulus kind"
                  value={group.stimulusKind}
                  onValueChange={(value) =>
                    patch({ stimulusKind: value as StimulusKind })
                  }
                  options={STIMULUS_OPTIONS}
                />
              </div>
            </div>

            {/* Stimulus editor varies by kind. */}
            <div className="mt-3">
              {(group.stimulusKind === "passage" ||
                group.stimulusKind === "cue_card" ||
                group.stimulusKind === "writing_task") && (
                <>
                  <Label htmlFor={`${group.id}-passage`}>
                    {group.stimulusKind === "passage" ? "Passage text" : "Prompt text"}
                  </Label>
                  <Textarea
                    id={`${group.id}-passage`}
                    rows={group.stimulusKind === "passage" ? 8 : 4}
                    value={group.passageText ?? ""}
                    onChange={(e) => patch({ passageText: e.target.value })}
                    placeholder="Paragraphs separated by a blank line."
                  />
                </>
              )}

              {group.stimulusKind === "audio" && (
                <div className="rounded-lg border border-dashed border-line-strong bg-paper p-4">
                  <p className="text-sm font-medium">Audio file</p>
                  <p className="mt-1 text-xs text-muted">
                    {group.audioUrl ?? "No file uploaded"}
                  </p>
                  {/* TODO(backend): upload to R2 and store the object URL. */}
                  <Button variant="outline" size="sm" className="mt-3">
                    Upload MP3
                  </Button>
                </div>
              )}

              {group.stimulusKind === "image" && (
                <div className="rounded-lg border border-dashed border-line-strong bg-paper p-4">
                  <p className="text-sm font-medium">Image</p>
                  <p className="mt-1 text-xs text-muted">
                    {group.imageUrl ?? "No image uploaded"}
                  </p>
                  {/* TODO(backend): upload to R2 and store the object URL. */}
                  <Button variant="outline" size="sm" className="mt-3">
                    Upload image
                  </Button>
                </div>
              )}
            </div>

            <div className="mt-3">
              <Label htmlFor={`${group.id}-instructions`}>Shared instructions</Label>
              <Textarea
                id={`${group.id}-instructions`}
                rows={2}
                value={group.instructions}
                onChange={(e) => patch({ instructions: e.target.value })}
              />
            </div>

            <div className="mb-2 mt-5 flex items-center justify-between">
              <p className="text-sm font-medium">
                Questions{" "}
                <span className="text-muted">({group.questions.length})</span>
              </p>
              <Button variant="outline" size="sm" onClick={addQuestion}>
                Add question
              </Button>
            </div>

            <div className="grid gap-2">
              {group.questions.map((question, i) => (
                <QuestionRow
                  key={question.id}
                  question={question}
                  section={section}
                  index={i}
                  dragProps={questionDrag(i)}
                  onChange={(next) =>
                    patch({
                      questions: group.questions.map((q, j) => (j === i ? next : q)),
                    })
                  }
                  onDelete={() =>
                    patch({ questions: group.questions.filter((_, j) => j !== i) })
                  }
                />
              ))}
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="text-bad"
            aria-label="Delete group"
          >
            Delete group
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}
