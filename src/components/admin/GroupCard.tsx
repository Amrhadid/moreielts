import { useState } from "react";
import { Button } from "~/components/ui/Button";
import { Card, CardBody } from "~/components/ui/Card";
import { Input, Label, Textarea } from "~/components/ui/Field";
import { cn } from "~/lib/cn";
import { uploadToR2, useDeleteQuestion, useQuestionTypes } from "~/lib/queries";
import type { AdminQuestion } from "~/lib/queries";
import type { ItemGroupRow, SectionCode } from "~/types/database";
import { moveItem, useDragList } from "./useDragList";
import { QuestionRow } from "./QuestionRow";

export type AdminGroup = ItemGroupRow & { questions: AdminQuestion[] };

/** Item group card: shared stimulus + instructions + its ordered questions. */
export function GroupCard({
  group,
  section,
  onChange,
  onDelete,
  dragProps,
}: {
  group: AdminGroup;
  section: SectionCode;
  onChange: (next: AdminGroup) => void;
  onDelete: () => void;
  dragProps: Record<string, unknown>;
}) {
  const { data: types } = useQuestionTypes();
  const deleteQuestion = useDeleteQuestion();
  const [uploading, setUploading] = useState<null | "audio" | "image">(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const { dragProps: questionDrag } = useDragList((from, to) =>
    onChange({ ...group, questions: moveItem(group.questions, from, to) }),
  );

  function patch(partial: Partial<AdminGroup>) {
    onChange({ ...group, ...partial });
  }

  function addQuestion() {
    const fallback = types?.[0];
    if (!fallback) return;
    patch({
      questions: [
        ...group.questions,
        {
          id: crypto.randomUUID(),
          group_id: group.id,
          type_code: fallback.code,
          prompt: "",
          options: fallback.renderer === "text_input" ? [] : [],
          accepted_answers: [],
          word_limit: fallback.default_word_limit,
          spelling_policy: "lenient",
          accepts_plural: true,
          case_sensitive: false,
          scoring_rules: {},
          order_index: group.questions.length,
        },
      ],
    });
  }

  /** Uploads through the upload-url Edge Function; no R2 keys in the browser. */
  async function upload(file: File, kind: "item_audio" | "item_image") {
    setUploadError(null);
    setUploading(kind === "item_audio" ? "audio" : "image");
    try {
      const url = await uploadToR2(file, kind, { slug: file.name.split(".")[0] });
      patch(kind === "item_audio" ? { audio_url: url } : { image_url: url });
    } catch (error) {
      setUploadError((error as Error).message ?? "Upload failed");
    } finally {
      setUploading(null);
    }
  }

  const showPassage = section === "reading" || section === "writing" || section === "speaking";
  const showAudio = section === "listening";
  const showImage = section === "listening" || section === "writing" || section === "reading";

  return (
    <Card
      {...dragProps}
      className={cn("data-[dragging=true]:opacity-40 data-[over=true]:border-brand-500")}
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
            <div className="grid gap-3 sm:grid-cols-[1fr_9rem]">
              <div>
                <Label htmlFor={`${group.id}-instructions`}>Shared instructions</Label>
                <Textarea
                  id={`${group.id}-instructions`}
                  rows={2}
                  value={group.shared_instructions ?? ""}
                  onChange={(e) => patch({ shared_instructions: e.target.value })}
                  placeholder="Questions 1-13. Write NO MORE THAN TWO WORDS…"
                />
              </div>
              <div>
                <Label htmlFor={`${group.id}-part`}>Part number</Label>
                <Input
                  id={`${group.id}-part`}
                  type="number"
                  min={1}
                  value={group.part_number}
                  onChange={(e) => patch({ part_number: Number(e.target.value) })}
                />
              </div>
            </div>

            {showPassage && (
              <div className="mt-3">
                <Label htmlFor={`${group.id}-passage`}>
                  {section === "reading" ? "Passage text" : "Prompt / cue card text"}
                </Label>
                <Textarea
                  id={`${group.id}-passage`}
                  rows={section === "reading" ? 8 : 4}
                  value={group.passage_text ?? ""}
                  onChange={(e) => patch({ passage_text: e.target.value })}
                  placeholder="Paragraphs separated by a blank line."
                />
              </div>
            )}

            {showAudio && (
              <div className="mt-3 rounded-lg border border-dashed border-line-strong bg-paper p-4">
                <p className="text-sm font-medium">Part audio</p>
                <p className="mt-1 break-all text-xs text-muted">
                  {group.audio_url ?? "No file uploaded"}
                </p>
                <label className="mt-3 inline-flex cursor-pointer items-center rounded-lg border border-line-strong bg-surface px-3 py-1.5 text-sm hover:bg-paper">
                  {uploading === "audio" ? "Uploading…" : "Upload MP3"}
                  <input
                    type="file"
                    accept="audio/mpeg,audio/mp4,audio/aac,audio/ogg"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) void upload(file, "item_audio");
                    }}
                  />
                </label>
                {group.audio_url && (
                  <audio controls src={group.audio_url} className="mt-3 h-9 w-full" />
                )}
              </div>
            )}

            {showImage && (
              <div className="mt-3 rounded-lg border border-dashed border-line-strong bg-paper p-4">
                <p className="text-sm font-medium">Image (chart, map or diagram)</p>
                <p className="mt-1 break-all text-xs text-muted">
                  {group.image_url ?? "No image uploaded"}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <label className="inline-flex cursor-pointer items-center rounded-lg border border-line-strong bg-surface px-3 py-1.5 text-sm hover:bg-paper">
                    {uploading === "image" ? "Uploading…" : "Upload image"}
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/svg+xml"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) void upload(file, "item_image");
                      }}
                    />
                  </label>
                  <Input
                    value={(group.metadata?.image_caption as string) ?? ""}
                    placeholder="Caption"
                    className="max-w-xs"
                    onChange={(e) =>
                      patch({
                        metadata: { ...group.metadata, image_caption: e.target.value },
                      })
                    }
                  />
                </div>
                {group.image_url && (
                  <img
                    src={group.image_url}
                    alt=""
                    className="mt-3 max-h-48 rounded border border-line object-contain"
                  />
                )}
              </div>
            )}

            {uploadError && <p className="mt-2 text-xs text-bad">{uploadError}</p>}

            <div className="mb-2 mt-5 flex items-center justify-between">
              <p className="text-sm font-medium">
                Questions <span className="text-muted">({group.questions.length})</span>
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
                  index={i}
                  dragProps={questionDrag(i)}
                  onChange={(next) =>
                    patch({
                      questions: group.questions.map((q, j) => (j === i ? next : q)),
                    })
                  }
                  onDelete={async () => {
                    await deleteQuestion.mutateAsync(question.id).catch(() => {});
                    patch({ questions: group.questions.filter((_, j) => j !== i) });
                  }}
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
