import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { GroupCard } from "~/components/admin/GroupCard";
import { moveItem, useDragList } from "~/components/admin/useDragList";
import { Badge } from "~/components/ui/Badge";
import { Button } from "~/components/ui/Button";
import { Input } from "~/components/ui/Field";
import { Switch } from "~/components/ui/Switch";
import { cn } from "~/lib/cn";
import { mockForms } from "~/mock/testForm";
import type { ItemGroup, SectionCode, TestForm } from "~/types/content";

export const Route = createFileRoute("/admin/forms/$formId")({
  component: FormBuilder,
});

const SECTION_TABS: SectionCode[] = ["listening", "reading", "writing", "speaking"];

function FormBuilder() {
  const { formId } = useParams({ from: "/admin/forms/$formId" });

  // Local working copy. TODO(backend): load the form and save edits server-side.
  const [form, setForm] = useState<TestForm>(
    () =>
      structuredClone(mockForms.find((f) => f.id === formId) ?? mockForms[0]),
  );
  const [activeSection, setActiveSection] = useState<SectionCode>("reading");
  const [dirty, setDirty] = useState(false);

  const section = form.sections.find((s) => s.code === activeSection);

  function update(next: TestForm) {
    setForm(next);
    setDirty(true);
  }

  function updateGroups(groups: ItemGroup[]) {
    update({
      ...form,
      sections: form.sections.map((s) =>
        s.code === activeSection ? { ...s, itemGroups: groups } : s,
      ),
    });
  }

  const { dragProps } = useDragList((from, to) => {
    if (section) updateGroups(moveItem(section.itemGroups, from, to));
  });

  function addGroup() {
    if (!section) return;
    const partNumber = section.itemGroups.length + 1;
    updateGroups([
      ...section.itemGroups,
      {
        id: `${activeSection}-g-${Date.now()}`,
        partNumber,
        title: `New group ${partNumber}`,
        stimulusKind: activeSection === "listening" ? "audio" : "passage",
        instructions: "",
        passageText: "",
        questions: [],
      },
    ]);
  }

  const questionTotal =
    section?.itemGroups.reduce((sum, g) => sum + g.questions.length, 0) ?? 0;

  return (
    <>
      {/* Form header */}
      <div className="mb-5">
        <Link to="/admin" className="text-sm text-muted hover:text-ink">
          ← All test forms
        </Link>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <Input
            value={form.title}
            aria-label="Form title"
            onChange={(e) => update({ ...form, title: e.target.value })}
            className="max-w-md text-base font-semibold"
          />
          <Badge tone="brand" className="capitalize">
            {form.variant}
          </Badge>
          <div className="ml-auto flex items-center gap-4">
            <div className="flex items-center gap-2.5">
              <Switch
                id="published"
                checked={form.published}
                onCheckedChange={(checked) =>
                  update({ ...form, published: checked })
                }
              />
              <label htmlFor="published" className="text-sm font-medium">
                {form.published ? "Published" : "Draft"}
              </label>
            </div>
            {/* TODO(backend): persist the working copy. */}
            <Button disabled={!dirty} onClick={() => setDirty(false)}>
              {dirty ? "Save changes" : "Saved"}
            </Button>
          </div>
        </div>
      </div>

      {/* Section tabs */}
      <div className="mb-5 border-b border-line">
        <div className="flex gap-1 overflow-x-auto">
          {SECTION_TABS.map((code) => {
            const present = form.sections.find((s) => s.code === code);
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
                    ? present.itemGroups.reduce(
                        (sum, g) => sum + g.questions.length,
                        0,
                      )
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
              {section.itemGroups.length} item groups · {questionTotal} questions ·{" "}
              {section.durationMinutes} minutes
            </p>
            <Button variant="outline" onClick={addGroup}>
              Add item group
            </Button>
          </div>

          <div className="grid gap-4">
            {section.itemGroups.map((group, i) => (
              <GroupCard
                key={group.id}
                group={group}
                section={activeSection}
                dragProps={dragProps(i)}
                onChange={(next) =>
                  updateGroups(
                    section.itemGroups.map((g, j) => (j === i ? next : g)),
                  )
                }
                onDelete={() =>
                  updateGroups(section.itemGroups.filter((_, j) => j !== i))
                }
              />
            ))}
            {section.itemGroups.length === 0 && (
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
                ...form,
                sections: [
                  ...form.sections,
                  {
                    code: activeSection,
                    title: activeSection,
                    durationMinutes: activeSection === "listening" ? 30 : 60,
                    questionCount: 0,
                    itemGroups: [],
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
