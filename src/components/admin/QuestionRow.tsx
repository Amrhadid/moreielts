import { Button } from "~/components/ui/Button";
import { Input, Label, Textarea } from "~/components/ui/Field";
import { Select } from "~/components/ui/Select";
import { Switch } from "~/components/ui/Switch";
import { cn } from "~/lib/cn";
import { getQuestionType, questionTypesForSection } from "~/registry/questionTypes";
import type { Question, QuestionTypeCode, SectionCode } from "~/types/content";

/**
 * One editable question. The type dropdown is populated from the registry, and
 * the options builder appears only for renderers that consume options.
 */
export function QuestionRow({
  question,
  section,
  index,
  onChange,
  onDelete,
  dragProps,
}: {
  question: Question;
  section: SectionCode;
  index: number;
  onChange: (next: Question) => void;
  onDelete: () => void;
  dragProps: Record<string, unknown>;
}) {
  const entry = getQuestionType(question.type);
  const needsOptions = entry.renderer !== "text_input";
  const typeOptions = questionTypesForSection(section).map((t) => ({
    value: t.code,
    label: t.label,
  }));

  function patch(partial: Partial<Question>) {
    onChange({ ...question, ...partial });
  }

  return (
    <div
      {...dragProps}
      className={cn(
        "rounded-lg border border-line bg-surface p-3",
        "data-[dragging=true]:opacity-40 data-[over=true]:border-brand-500",
      )}
    >
      <div className="flex items-start gap-3">
        <span
          aria-hidden
          title="Drag to reorder"
          className="mt-2 cursor-grab select-none text-muted"
        >
          ⠿
        </span>
        <span className="mt-1.5 w-6 shrink-0 text-sm font-semibold tabular-nums text-muted">
          {index + 1}
        </span>

        <div className="grid min-w-0 flex-1 gap-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor={`${question.id}-type`}>Question type</Label>
              <Select
                aria-label="Question type"
                value={question.type}
                onValueChange={(value) => {
                  const next = value as QuestionTypeCode;
                  patch({
                    type: next,
                    wordLimit: getQuestionType(next).defaultWordLimit,
                  });
                }}
                options={typeOptions}
              />
            </div>
            <div>
              <Label htmlFor={`${question.id}-limit`}>Word limit (0 = none)</Label>
              <Input
                id={`${question.id}-limit`}
                type="number"
                min={0}
                value={question.wordLimit ?? entry.defaultWordLimit}
                onChange={(e) => patch({ wordLimit: Number(e.target.value) })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor={`${question.id}-prompt`}>Prompt</Label>
            <Textarea
              id={`${question.id}-prompt`}
              rows={2}
              value={question.prompt}
              onChange={(e) => patch({ prompt: e.target.value })}
            />
          </div>

          {needsOptions && (
            <div>
              <Label>Options</Label>
              <div className="grid gap-2">
                {(question.options ?? []).map((option, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Input
                      value={option.value}
                      aria-label={`Option ${i + 1} value`}
                      className="w-20 shrink-0 font-mono text-xs"
                      onChange={(e) => {
                        const options = [...(question.options ?? [])];
                        options[i] = { ...options[i], value: e.target.value };
                        patch({ options });
                      }}
                    />
                    <Input
                      value={option.label}
                      aria-label={`Option ${i + 1} label`}
                      onChange={(e) => {
                        const options = [...(question.options ?? [])];
                        options[i] = { ...options[i], label: e.target.value };
                        patch({ options });
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      aria-label={`Remove option ${i + 1}`}
                      onClick={() =>
                        patch({
                          options: (question.options ?? []).filter((_, j) => j !== i),
                        })
                      }
                    >
                      ✕
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  className="justify-self-start"
                  onClick={() =>
                    patch({
                      options: [
                        ...(question.options ?? []),
                        {
                          value: String.fromCharCode(
                            65 + (question.options?.length ?? 0),
                          ),
                          label: "",
                        },
                      ],
                    })
                  }
                >
                  Add option
                </Button>
              </div>
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor={`${question.id}-answers`}>
                Accepted answers (comma separated)
              </Label>
              <Input
                id={`${question.id}-answers`}
                value={question.acceptedAnswers.join(", ")}
                placeholder="tendon, tendons"
                onChange={(e) =>
                  patch({
                    acceptedAnswers: e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean),
                  })
                }
              />
            </div>
            <div className="flex items-end gap-3 pb-1">
              <Switch
                id={`${question.id}-spelling`}
                checked={question.spellingStrict !== false}
                onCheckedChange={(checked) => patch({ spellingStrict: checked })}
              />
              <label
                htmlFor={`${question.id}-spelling`}
                className="text-sm text-ink-soft"
              >
                Penalise spelling errors
              </label>
            </div>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          aria-label="Delete question"
          onClick={onDelete}
          className="text-bad"
        >
          Delete
        </Button>
      </div>
    </div>
  );
}
