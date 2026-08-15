import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Badge } from "~/components/ui/Badge";
import { Button } from "~/components/ui/Button";
import { Card } from "~/components/ui/Card";
import { Input } from "~/components/ui/Field";
import { useCreateForm, useForms } from "~/lib/queries";

export const Route = createFileRoute("/admin/")({ component: AdminForms });

function AdminForms() {
  const navigate = useNavigate();
  const { data: forms, isLoading } = useForms();
  const createForm = useCreateForm();
  const [title, setTitle] = useState("");
  const [creating, setCreating] = useState(false);

  async function onCreate() {
    if (!title.trim()) return;
    const id = await createForm.mutateAsync({ title: title.trim(), variant: "academic" });
    navigate({ to: "/admin/forms/$formId", params: { formId: id } });
  }

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Test forms</h1>
          <p className="mt-1 text-sm text-muted">
            {forms?.length ?? 0} forms · {forms?.filter((f) => f.is_published).length ?? 0}{" "}
            published
          </p>
        </div>
        {creating ? (
          <div className="flex items-center gap-2">
            <Input
              value={title}
              autoFocus
              placeholder="Form title"
              onChange={(e) => setTitle(e.target.value)}
              className="w-56"
            />
            <Button onClick={onCreate} disabled={createForm.isPending}>
              {createForm.isPending ? "Creating…" : "Create"}
            </Button>
            <Button variant="ghost" onClick={() => setCreating(false)}>
              Cancel
            </Button>
          </div>
        ) : (
          <Button onClick={() => setCreating(true)}>Create form</Button>
        )}
      </div>

      <Card className="overflow-hidden">
        {isLoading ? (
          <div className="px-5 py-10 text-center text-sm text-muted">Loading…</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[48rem] text-sm">
              <thead className="border-b border-line bg-paper text-left text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-4 py-3 font-medium">Title</th>
                  <th className="px-4 py-3 font-medium">Variant</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Access</th>
                  <th className="px-4 py-3 font-medium">Updated</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {(forms ?? []).map((form) => (
                  <tr key={form.id} className="hover:bg-paper">
                    <td className="px-4 py-3 font-medium">{form.title}</td>
                    <td className="px-4 py-3 capitalize text-muted">
                      {form.variant.replace("_", " ")}
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone={form.is_published ? "good" : "neutral"}>
                        {form.is_published ? "Published" : "Draft"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone={form.is_premium ? "warn" : "neutral"}>
                        {form.is_premium ? "Premium" : "Free"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-muted">
                      {new Date(form.updated_at).toLocaleDateString("en-GB")}
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
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </>
  );
}
