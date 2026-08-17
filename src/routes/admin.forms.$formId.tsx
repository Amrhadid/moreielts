import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { GroupCard } from "~/components/admin/GroupCard";
import { moveItem, useDragList } from "~/components/admin/useDragList";
import { Badge } from "~/components/ui/Badge";
import { Button } from "~/components/ui/Button";
import { Input } from "~/components/ui/Field";
import { Switch } from "~/components/ui/Switch";
import { cn } from "~/lib/cn";
import {
  useAdminForm,
  useDeleteGroup,
  useSaveForm,
  type AdminFormContent,
} from "~/lib/queries";
import type { SectionCode } from "~/types/content";

export const Route = createFileRoute("/admin/forms/$formId")({
  component: FormBuilder,
});

const SECTION_TABS: SectionCode[] = ["listening", "reading", "writing", "speaking"];

const DEFAULT_LIMITS: Record<SectionCode, number> = {
  listening: 30 * 60,
  reading: 60 * 60,
  writing: 60 * 60,
  speaking: 14 * 60,
};

function FormBuilder() {
  const { formId } = useParams({ from: "/admin/forms/$formId" });
  const { data, isLoading } = useAdminForm(formId);
  const saveForm = useSaveForm();
  const deleteGroup = useDeleteGroup();

  // Local working copy, seeded from the server and saved back explicitly.
  const [draft, setDraft] = useState<AdminFormContent | null>(null);
  const [activeSection, setActiveSection] = useState<SectionCode>("reading");
  const [dirty, setDirty] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (data && !draft) setDraft(structuredClone(data));
  }, [data, draft]);

  const section = draft?.sections.find((s) => s.section === activeSection);

  function update(next: AdminFormContent) {
    setDraft(next);
    setDirty(true);
  }

  function updateGroups(groups: NonNullable<typeof section>["groups"]) {
    if (!draft || !section) return;
    update({
      ...draft,
      sections: draft.sections.map((s) =>
        s.section === activeSection ? { ...s, groups } : s,
      ),
    });
  }

  const { dragProps } = useDragList((from, to) => {
    if (section) updateGroups(moveItem(section.groups, from, to));
  });

  async function onSave() {
    if (!draft) return;
    setSaveError(null);
    try {
      await saveForm.mutateAsync(draft);
      setDirty(false);
    } catch (error) {
      setSaveError((error as Error).message ?? "Save failed");
    }
  }

  function addGroup() {
    if (!section) return;
    updateGroups([
      ...section.groups,
      {
        // A client-generated uuid lets the row be upserted on save.
        id: crypto.randomUUID(),
        section_id: section.id,
        part_number: section.groups.length + 1,
        passage_text: "",
        audio_url: null,
        audio_duration_ms: null,
        transcript: null,
        image_url: null,
        shared_instructions: "",
        metadata: {},
        order_index: section.groups.length,
        questions: [],
      },
    ]);
  }

  if (isLoading || !draft) {
    return <p className="py-16 text-center text-sm text-muted">Loading form…</p>;
  }

  const questionTotal =
    section?.groups.reduce((sum, g) => sum + g.questions.length, 0) ?? 0;

  return (
    <>
      {/* Form header */}
      <div className="mb-5">
        <Link to="/admin" className="text-sm text-muted hover:text-ink">
          ← All test forms
        </Link>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <Input
            value={draft.form.title}
            aria-label="Form title"
            onChange={(e) =>
              update({ ...draft, form: { ...draft.form, title: e.target.value } })
            }
            className="max-w-md text-base font-semibold"
          />
          <Badge tone="brand" className="capitalize">
            {draft.form.variant.replace("_", " ")}
          </Badge>
          <div className="ml-auto flex items-center gap-4">
            <div className="flex items-center gap-2.5">
              <Switch
                id="premium"
                checked={draft.form.is_premium}
                onCheckedChange={(checked) =>
                  update({ ...draft, form: { ...draft.form, is_premium: checked } })
                }
              />
              <label htmlFor="premium" className="text-sm font-medium">
                Premium
              </label>
            </div>
            <div className="flex items-center gap-2.5">
              <Switch
                id="published"
                checked={draft.form.is_published}
                onCheckedChange={(checked) =>
                  update({ ...draft, form: { ...draft.form, is_published: checked } })
                }
              />
              <label htmlFor="published" className="text-sm font-medium">
                {draft.form.is_published ? "Published" : "Draft"}
              </label>
            </div>
            <Button disabled={!dirty || saveForm.isPending} onClick={onSave}>
              {saveForm.isPending ? "Saving…" : dirty ? "Save changes" : "Saved"}
            </Button>
          </div>
        </div>
        {saveError && (
          <p className="mt-3 rounded-lg border border-bad/20 bg-bad-soft px-3 py-2 text-sm text-bad">
            {saveError}
          </p>
        )}
      </div>

      {/* Section tabs */}
      <div className="mb-5 border-b border-line">
        <div className="flex gap-1 overflow-x-auto">
          {SECTION_TABS.map((code) => {
            const present = draft.sections.find((s) => s.section === code);
            return (
              <button
                key={code}
                type="button"
                onClick={() => setActiveSection(code)}
                className={cn(
                  "-mb-px shrink-0 border-b-2 px-4 py-2.5 text-sm font-medium capitalize transition-colors",
                  activeSection === code
                    ? "border-brand-600 text-brand-700"
                    : "border-transparent text-muted hover:text-ink",
                )}
              >
                {code}
                <span className="ml-2 text-xs text-muted">
                  {present
                    ? present.groups.reduce((sum, g) => sum + g.questions.length, 0)
                    : 0}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {section ? (
        <>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted">
              {section.groups.length} item groups · {questionTotal} questions ·{" "}
              {Math.round(section.time_limit_seconds / 60)} minutes
            </p>
            <Button variant="outline" onClick={addGroup}>
              Add item group
            </Button>
          </div>

          <div className="grid gap-4">
            {section.groups.map((group, i) => (
              <GroupCard
                key={group.id}
                group={group}
                section={activeSection}
                dragProps={dragProps(i)}
                onChange={(next) =>
                  updateGroups(section.groups.map((g, j) => (j === i ? next : g)))
                }
                onDelete={async () => {
                  // Remove server-side too; a local removal alone would come
                  // back on the next load.
                  await deleteGroup.mutateAsync(group.id).catch(() => {});
                  updateGroups(section.groups.filter((_, j) => j !== i));
                }}
              />
            ))}
            {section.groups.length === 0 && (
              <div className="rounded-card border border-dashed border-line-strong p-10 text-center text-sm text-muted">
                No item groups yet. Add one to start building this section.
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="rounded-card border border-dashed border-line-strong p-10 text-center">
          <p className="text-sm text-muted">
            This form has no {activeSection} section yet.
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() =>
              update({
                ...draft,
                sections: [
                  ...draft.sections,
                  {
                    id: crypto.randomUUID(),
                    form_id: draft.form.id,
                    section: activeSection,
                    time_limit_seconds: DEFAULT_LIMITS[activeSection],
                    question_count: 0,
                    instructions: "",
                    order_index: draft.sections.length,
                    groups: [],
                  },
                ],
              })
            }
          >
            Add {activeSection} section
          </Button>
        </div>
      )}
    </>
  );
}
