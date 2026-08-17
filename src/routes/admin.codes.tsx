import { createFileRoute } from "@tanstack/react-router";
import { Badge } from "~/components/ui/Badge";
import { Card } from "~/components/ui/Card";
import { useRedemptionCodes } from "~/lib/queries";

export const Route = createFileRoute("/admin/codes")({ component: Codes });

function Codes() {
  const { data: codes, isLoading } = useRedemptionCodes();

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold tracking-tight">Access codes</h1>
        <p className="text-sm text-muted">
          Codes are redeemed by students through the redeem_code RPC.
        </p>
      </div>
      <Card className="overflow-hidden">
        {isLoading ? (
          <div className="px-5 py-10 text-center text-sm text-muted">Loading…</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[40rem] text-sm">
              <thead className="border-b border-line bg-paper text-left text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-4 py-3 font-medium">Code</th>
                  <th className="px-4 py-3 font-medium">Grants</th>
                  <th className="px-4 py-3 font-medium">Duration</th>
                  <th className="px-4 py-3 font-medium">Expires</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {(codes ?? []).map((c) => (
                  <tr key={c.code} className="hover:bg-paper">
                    <td className="px-4 py-3 font-mono text-xs">{c.code}</td>
                    <td className="px-4 py-3 capitalize">{c.type.replace("_", " ")}</td>
                    <td className="px-4 py-3 text-muted">
                      {c.duration_days ? `${c.duration_days} days` : "—"}
                    </td>
                    <td className="px-4 py-3 text-muted">
                      {c.expires_at ? new Date(c.expires_at).toLocaleDateString("en-GB") : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone={c.used_by ? "neutral" : "good"}>
                        {c.used_by ? "Used" : "Active"}
                      </Badge>
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
