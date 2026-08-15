import { createFileRoute } from "@tanstack/react-router";
import { Badge } from "~/components/ui/Badge";
import { Card } from "~/components/ui/Card";
import { Input } from "~/components/ui/Field";
import { formatBand } from "~/lib/band";
import { mockStudents } from "~/mock/testForm";

export const Route = createFileRoute("/admin/students")({ component: Students });

/** Table shell only — no filtering or pagination logic in this pass. */
function Students() {
  return (
    <>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold tracking-tight">Students</h1>
        <Input placeholder="Search students…" className="max-w-xs" />
      </div>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[44rem] text-sm">
            <thead className="border-b border-line bg-paper text-left text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Plan</th>
                <th className="px-4 py-3 font-medium">Attempts</th>
                <th className="px-4 py-3 font-medium">Estimated band</th>
                <th className="px-4 py-3 font-medium">Last active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {mockStudents.map((s) => (
                <tr key={s.id} className="hover:bg-paper">
                  <td className="px-4 py-3 font-medium">{s.name}</td>
                  <td className="px-4 py-3 text-muted">{s.email}</td>
                  <td className="px-4 py-3">
                    <Badge tone={s.plan === "Premium" ? "brand" : "neutral"}>
                      {s.plan}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 tabular-nums">{s.attempts}</td>
                  <td className="px-4 py-3 tabular-nums">{formatBand(s.estimated)}</td>
                  <td className="px-4 py-3 text-muted">{s.lastActive}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
