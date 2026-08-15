import { Button } from "~/components/ui/Button";
import { Input, Label, Textarea } from "~/components/ui/Field";
import { Select } from "~/components/ui/Select";
import { Switch } from "~/components/ui/Switch";
import { cn } from "~/lib/cn";
import { useQuestionTypes } from "~/lib/queries";
import type { AdminQuestion } from "~/lib/queries";

/**
 * One editable question row, backed by the questions table.
 *
 * The type dropdown is populated from question_types, so adding an IELTS
 * question type is an INSERT into that table and needs no code change here.
 * The options builder appears only for renderers that consume options.
 */
export function QuestionRow({
  question,
  index,
  onChange,
  onDelete,
  dragProps,
}: {
  question: AdminQuestion;
  index: number;
  onChange: (next: AdminQuestion) => void;
  onDelete: () => void;
  dragProps: Record<string, unknown>;
}) {
  const { data: types } = useQuestionTypes();
  const entry = types?.find((t) => t.code === question.type_code);
  const needsOptions = entry ? entry.renderer !== "text_input" : false;

  const typeOptions = (types ?? []).map((t) => ({ value: t.code, label: t.label }));

  function patch(partial: Partial<AdminQuestion>) {
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
              <Label>Question type</Label>
              <Select
                aria-label="Question type"
                value={question.type_code}
                onValueChange={(value) => {
                  const next = types?.find((t) => t.code === value);
                  patch({
                    type_code: value,
                    word_limit: next?.default_word_limit ?? question.word_limit,
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
                value={question.word_limit}
                onChange={(e) => patch({ word_limit: Number(e.target.value) })}
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
                          value: String.fromCharCode(65 + (question.options?.length ?? 0)),
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

          <div>
            <Label htmlFor={`${question.id}-answers`}>
              Accepted answers (comma separated)
            </Label>
            <Input
              id={`${question.id}-answers`}
              value={(question.accepted_answers ?? []).join(", ")}
              placeholder="tendon, tendons"
              onChange={(e) =>
                patch({
                  accepted_answers: e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                })
              }
            />
            <p className="mt-1 text-xs text-muted">
              Marking also accepts case, article, plural, number-word and UK/US
              spelling variants automatically.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2.5">
              <Switch
                id={`${question.id}-spelling`}
                checked={question.spelling_policy === "strict"}
                onCheckedChange={(checked) =>
                  patch({ spelling_policy: checked ? "strict" : "lenient" })
                }
              />
              <label htmlFor={`${question.id}-spelling`} className="text-sm text-ink-soft">
                Strict spelling
              </label>
            </div>
            <div className="flex items-center gap-2.5">
              <Switch
                id={`${question.id}-plural`}
                checked={question.accepts_plural}
                onCheckedChange={(checked) => patch({ accepts_plural: checked })}
              />
              <label htmlFor={`${question.id}-plural`} className="text-sm text-ink-soft">
                Accept plurals
              </label>
            </div>
            <div className="flex items-center gap-2.5">
              <Switch
                id={`${question.id}-case`}
                checked={question.case_sensitive}
                onCheckedChange={(checked) => patch({ case_sensitive: checked })}
              />
              <label htmlFor={`${question.id}-case`} className="text-sm text-ink-soft">
                Case sensitive
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
