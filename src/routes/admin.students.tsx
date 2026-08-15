import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Badge } from "~/components/ui/Badge";
import { Card } from "~/components/ui/Card";
import { Input } from "~/components/ui/Field";
import { formatBand } from "~/lib/scoring";
import { useStudents } from "~/lib/queries";

export const Route = createFileRoute("/admin/students")({ component: Students });

function Students() {
  const { data: students, isLoading } = useStudents();
  const [query, setQuery] = useState("");

  const rows = (students ?? []).filter((s) =>
    `${s.full_name ?? ""} ${s.email}`.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold tracking-tight">Students</h1>
        <Input
          placeholder="Search students…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="max-w-xs"
        />
      </div>
      <Card className="overflow-hidden">
        {isLoading ? (
          <div className="px-5 py-10 text-center text-sm text-muted">Loading…</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[44rem] text-sm">
              <thead className="border-b border-line bg-paper text-left text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Plan</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Target</th>
                  <th className="px-4 py-3 font-medium">Estimated band</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {rows.map((s) => (
                  <tr key={s.id} className="hover:bg-paper">
                    <td className="px-4 py-3 font-medium">{s.full_name ?? "—"}</td>
                    <td className="px-4 py-3 text-muted">{s.email}</td>
                    <td className="px-4 py-3">
                      <Badge tone={s.tier === "premium" ? "brand" : "neutral"}>
                        {s.tier}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 capitalize text-muted">{s.role}</td>
                    <td className="px-4 py-3 tabular-nums">
                      {s.target_band ? formatBand(Number(s.target_band)) : "—"}
                    </td>
                    <td className="px-4 py-3 tabular-nums">
                      {s.current_band ? formatBand(Number(s.current_band)) : "—"}
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
