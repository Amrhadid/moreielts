import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Badge } from "~/components/ui/Badge";
import { Button } from "~/components/ui/Button";
import { Card, CardBody, CardHeader, CardTitle } from "~/components/ui/Card";
import { Input, Label } from "~/components/ui/Field";
import { useGenerateCodes, useRedemptionCodes, type RedemptionCodeListRow } from "~/lib/queries";

export const Route = createFileRoute("/admin/codes")({ component: Codes });

const DURATIONS = [
  { days: 30, label: "1 month" },
  { days: 90, label: "3 months" },
  { days: 180, label: "6 months" },
  { days: 365, label: "1 year" },
];

function downloadCsv(rows: RedemptionCodeListRow[] | string[], name: string) {
  const lines =
    typeof rows[0] === "string"
      ? ["code", ...(rows as string[])]
      : [
          "code,duration_days,batch,status,expires_at,created_at",
          ...(rows as RedemptionCodeListRow[]).map((r) =>
            [r.code, r.duration_days ?? "", r.batch_label ?? "", r.used_by ? "used" : "active", r.expires_at ?? "", r.created_at]
              .map((v) => `"${String(v).replace(/"/g, '""')}"`)
              .join(","),
          ),
        ];
  const blob = new Blob([lines.join("\n") + "\n"], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

function Codes() {
  const { data: codes, isLoading } = useRedemptionCodes();
  const generate = useGenerateCodes();

  const [count, setCount] = useState(10);
  const [days, setDays] = useState(30);
  const [prefix, setPrefix] = useState("IELTS");
  const [batch, setBatch] = useState("");
  const [expires, setExpires] = useState("");
  const [fresh, setFresh] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [filter, setFilter] = useState<"all" | "active" | "used">("all");

  const stats = useMemo(() => {
    const rows = codes ?? [];
    return { total: rows.length, used: rows.filter((r) => r.used_by).length };
  }, [codes]);

  const shown = (codes ?? []).filter((c) =>
    filter === "all" ? true : filter === "used" ? Boolean(c.used_by) : !c.used_by,
  );

  async function onGenerate(e: React.FormEvent) {
    e.preventDefault();
    setCopied(false);
    const made = await generate.mutateAsync({
      count,
      durationDays: days,
      expiresAt: expires ? new Date(`${expires}T23:59:59`).toISOString() : null,
      prefix,
      batchLabel: batch,
    });
    setFresh(made);
  }

  async function copyFresh() {
    try {
      await navigator.clipboard.writeText(fresh.join("\n"));
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold tracking-tight">Premium access codes</h1>
        <p className="text-sm text-muted">
          {stats.total} codes · {stats.used} redeemed · {stats.total - stats.used} active
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Generate codes</CardTitle>
        </CardHeader>
        <CardBody>
          <form onSubmit={onGenerate} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <div>
              <Label htmlFor="count">How many</Label>
              <Input
                id="count"
                type="number"
                min={1}
                max={500}
                value={count}
                onChange={(e) => setCount(Math.max(1, Math.min(500, Number(e.target.value) || 1)))}
              />
            </div>
            <div>
              <Label htmlFor="days">Premium for</Label>
              <select
                id="days"
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className="h-10 w-full rounded-lg border border-line-strong bg-surface px-3 text-sm"
              >
                {DURATIONS.map((d) => (
                  <option key={d.days} value={d.days}>
                    {d.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="prefix">Prefix</Label>
              <Input
                id="prefix"
                value={prefix}
                maxLength={12}
                onChange={(e) => setPrefix(e.target.value.replace(/[^A-Za-z0-9]/g, "").toUpperCase())}
              />
            </div>
            <div>
              <Label htmlFor="batch">Batch label (optional)</Label>
              <Input
                id="batch"
                value={batch}
                placeholder="e.g. October class"
                onChange={(e) => setBatch(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="expires">Redeem by (optional)</Label>
              <Input id="expires" type="date" value={expires} onChange={(e) => setExpires(e.target.value)} />
            </div>
            <div className="flex flex-wrap items-center gap-3 sm:col-span-2 lg:col-span-5">
              <Button type="submit" disabled={generate.isPending}>
                {generate.isPending ? "Generating…" : `Generate ${count} code${count === 1 ? "" : "s"}`}
              </Button>
              <p className="text-xs text-muted">
                Each code unlocks MoreIELTS Premium once. Redeemed time is added on top of any
                Premium the learner already has.
              </p>
            </div>
          </form>
          {generate.error && (
            <p className="mt-3 rounded-lg border border-bad/20 bg-bad-soft px-3 py-2 text-sm text-bad">
              {(generate.error as Error).message}
            </p>
          )}

          {fresh.length > 0 && (
            <div className="mt-5 rounded-lg border border-good/30 bg-good-soft p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-medium text-good">
                  {fresh.length} new code{fresh.length === 1 ? "" : "s"}
                </p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={copyFresh}>
                    {copied ? "Copied" : "Copy all"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => downloadCsv(fresh, `moreielts-codes-${new Date().toISOString().slice(0, 10)}.csv`)}
                  >
                    Download CSV
                  </Button>
                </div>
              </div>
              <ul className="mt-3 grid gap-1 font-mono text-sm sm:grid-cols-2 lg:grid-cols-3">
                {fresh.map((c) => (
                  <li key={c} className="select-all">
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardBody>
      </Card>

      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1 rounded-lg border border-line bg-surface p-1 text-sm">
          {(["all", "active", "used"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`rounded-md px-3 py-1 capitalize ${filter === f ? "bg-brand-50 font-medium text-brand-700" : "text-muted"}`}
            >
              {f}
            </button>
          ))}
        </div>
        {shown.length > 0 && (
          <Button size="sm" variant="outline" onClick={() => downloadCsv(shown, "moreielts-codes.csv")}>
            Export {shown.length} as CSV
          </Button>
        )}
      </div>

      <Card className="overflow-hidden">
        {isLoading ? (
          <div className="px-5 py-10 text-center text-sm text-muted">Loading…</div>
        ) : shown.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-muted">No codes yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[44rem] text-sm">
              <thead className="border-b border-line bg-paper text-start text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-4 py-3 text-start font-medium">Code</th>
                  <th className="px-4 py-3 text-start font-medium">Premium</th>
                  <th className="px-4 py-3 text-start font-medium">Batch</th>
                  <th className="px-4 py-3 text-start font-medium">Redeem by</th>
                  <th className="px-4 py-3 text-start font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {shown.map((c) => (
                  <tr key={c.code} className="hover:bg-paper">
                    <td className="select-all px-4 py-3 font-mono text-xs">{c.code}</td>
                    <td className="px-4 py-3 text-muted">
                      {c.duration_days ? `${c.duration_days} days` : "—"}
                    </td>
                    <td className="px-4 py-3 text-muted">{c.batch_label ?? "—"}</td>
                    <td className="px-4 py-3 text-muted">
                      {c.expires_at ? new Date(c.expires_at).toLocaleDateString("en-GB") : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone={c.used_by ? "neutral" : "good"}>
                        {c.used_by
                          ? `Used ${c.used_at ? new Date(c.used_at).toLocaleDateString("en-GB") : ""}`
                          : "Active"}
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
