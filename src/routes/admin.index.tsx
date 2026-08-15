import { createFileRoute, Link } from "@tanstack/react-router";
import { Badge } from "~/components/ui/Badge";
import { Button } from "~/components/ui/Button";
import { Card } from "~/components/ui/Card";
import { mockForms } from "~/mock/testForm";
import type { SectionCode } from "~/types/content";

export const Route = createFileRoute("/admin/")({ component: AdminForms });

const ALL_SECTIONS: SectionCode[] = ["listening", "reading", "writing", "speaking"];

function AdminForms() {
  return (
    <>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Test forms</h1>
          <p className="mt-1 text-sm text-muted">
            {mockForms.length} forms · {mockForms.filter((f) => f.published).length}{" "}
            published
          </p>
        </div>
        {/* TODO(backend): POST a new empty form, then route into the builder. */}
        <Button asChild>
          <Link to="/admin/forms/$formId" params={{ formId: "form-academic-3" }}>
            Create form
          </Link>
        </Button>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[48rem] text-sm">
            <thead className="border-b border-line bg-paper text-left text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Variant</th>
                <th className="px-4 py-3 font-medium">Sections complete</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Updated</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {mockForms.map((form) => {
                const present = new Set(form.sections.map((s) => s.code));
                return (
                  <tr key={form.id} className="hover:bg-paper">
                    <td className="px-4 py-3 font-medium">{form.title}</td>
                    <td className="px-4 py-3 capitalize text-muted">{form.variant}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        {ALL_SECTIONS.map((code) => (
                          <span
                            key={code}
                            title={code}
                            className={
                              present.has(code)
                                ? "rounded bg-good-soft px-1.5 py-0.5 text-[0.6875rem] font-medium uppercase text-good"
                                : "rounded bg-paper px-1.5 py-0.5 text-[0.6875rem] font-medium uppercase text-muted/60"
                            }
                          >
                            {code.slice(0, 1)}
                          </span>
                        ))}
                        <span className="ml-1 text-xs text-muted">
                          {present.size}/4
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone={form.published ? "good" : "neutral"}>
                        {form.published ? "Published" : "Draft"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-muted">
                      {new Date(form.updatedAt).toLocaleDateString("en-GB")}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        to="/admin/forms/$formId"
                        params={{ formId: form.id }}
                        className="text-sm font-medium text-brand-600"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
