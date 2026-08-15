import { createFileRoute } from "@tanstack/react-router";
import { Badge } from "~/components/ui/Badge";
import { Button } from "~/components/ui/Button";
import { Card } from "~/components/ui/Card";
import { mockCodes } from "~/mock/testForm";

export const Route = createFileRoute("/admin/codes")({ component: Codes });

/** Table shell only. TODO(backend): issue, revoke and redeem logic. */
function Codes() {
  return (
    <>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold tracking-tight">Access codes</h1>
        <Button>Generate code</Button>
      </div>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[40rem] text-sm">
            <thead className="border-b border-line bg-paper text-left text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Code</th>
                <th className="px-4 py-3 font-medium">Grants</th>
                <th className="px-4 py-3 font-medium">Uses</th>
                <th className="px-4 py-3 font-medium">Expires</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {mockCodes.map((c) => (
                <tr key={c.id} className="hover:bg-paper">
                  <td className="px-4 py-3 font-mono text-xs">{c.code}</td>
                  <td className="px-4 py-3">{c.plan}</td>
                  <td className="px-4 py-3 tabular-nums text-muted">
                    {c.uses} / {c.limit}
                  </td>
                  <td className="px-4 py-3 text-muted">{c.expires}</td>
                  <td className="px-4 py-3">
                    <Badge tone={c.status === "Active" ? "good" : "neutral"}>
                      {c.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
