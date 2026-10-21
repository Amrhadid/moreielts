import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardBody } from "~/components/ui/Card";
import { Select } from "~/components/ui/Select";
import { cn } from "~/lib/cn";
import { useAdminAnalytics, useClientErrors, type AdminAnalytics } from "~/lib/practice-queries";

export const Route = createFileRoute("/admin/analytics")({ component: Analytics });

const PERIODS = [
  { value: "30", label: "Last 30 days" },
  { value: "90", label: "Last 90 days" },
  { value: "365", label: "Last 365 days" },
];

const SERIES = [
  { key: "signups", label: "Signups", color: "var(--color-brand-600)" },
  { key: "attempts", label: "Attempts", color: "var(--color-good)" },
  { key: "drills", label: "Drills", color: "var(--color-warn)" },
] as const;

const fmt = (n: number) => new Intl.NumberFormat().format(n);

function Analytics() {
  const [days, setDays] = useState("30");
  const { data, isLoading, error } = useAdminAnalytics(Number(days));

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold tracking-tight">Analytics</h1>
        <Select
          aria-label="Period"
          value={days}
          onValueChange={setDays}
          options={PERIODS}
          className="w-44"
        />
      </div>

      {error && <p className="mb-4 text-sm text-bad">{(error as Error).message}</p>}
      {isLoading && <p className="text-sm text-muted">Loading…</p>}

      {data && (
        <>
          <Kpis totals={data.totals} />
          <div className="mt-6 grid gap-4 lg:grid-cols-[2fr_1fr]">
            <Panel title="Band distribution" subtitle="Submitted attempts by overall band">
              <BandChart data={data.band_distribution ?? []} />
            </Panel>
            <Panel title="Average band per section">
              <SectionBands bands={data.section_bands} />
            </Panel>
          </div>
          <Panel className="mt-4" title="Weekly activity">
            <WeeklyChart data={data.weekly ?? []} />
          </Panel>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <Panel title="Weakest question types">
              <WeakestTable rows={data.weakest_types ?? []} />
            </Panel>
            <Panel title="AI usage">
              <AiTable rows={data.ai_usage ?? []} />
            </Panel>
          </div>
        </>
      )}

      <Panel className="mt-4" title="Recent client errors">
        <ClientErrors />
      </Panel>
    </>
  );
}

function Panel({
  title,
  subtitle,
  className,
  children,
}: {
  title: string;
  subtitle?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Card className={className}>
      <CardBody className="pt-5">
        <p className="text-sm font-medium">{title}</p>
        {subtitle && <p className="text-xs text-muted">{subtitle}</p>}
        <div className="mt-4">{children}</div>
      </CardBody>
    </Card>
  );
}

function Empty({ children = "No data for this period." }: { children?: React.ReactNode }) {
  return (
    <div className="grid h-32 place-items-center rounded-lg border border-dashed border-line-strong text-sm text-muted">
      {children}
    </div>
  );
}

function Kpis({ totals }: { totals: AdminAnalytics["totals"] }) {
  const tiles: Array<{ label: string; value: string; warn?: boolean }> = [
    { label: "Students", value: fmt(totals.students) },
    { label: "Premium", value: fmt(totals.premium) },
    { label: "Attempts submitted", value: fmt(totals.attempts_submitted) },
    { label: "Drills", value: fmt(totals.drills) },
    { label: "Essays", value: fmt(totals.essays) },
    {
      label: "Revenue",
      value: new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
        (totals.revenue ?? 0) / 100,
      ),
    },
    { label: "Grading pending", value: fmt(totals.grading_pending), warn: totals.grading_pending > 0 },
    { label: "Grading failed", value: fmt(totals.grading_failed), warn: totals.grading_failed > 0 },
  ];
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {tiles.map((tile) => (
        <Card key={tile.label} className={cn(tile.warn && "border-warn/40 bg-warn-soft")}>
          <CardBody className="pt-5">
            <p className={cn("text-xs font-medium uppercase tracking-wide", tile.warn ? "text-warn" : "text-muted")}>
              {tile.label}
            </p>
            <p className={cn("mt-2 text-3xl font-semibold tabular-nums", tile.warn && "text-warn")}>
              {tile.value}
            </p>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}

function BandChart({ data }: { data: AdminAnalytics["band_distribution"] }) {
  const bands = Array.from({ length: 19 }, (_, i) => i / 2);
  const counts = bands.map((b) => data.find((d) => Number(d.band) === b)?.count ?? 0);
  const max = Math.max(...counts);
  if (max === 0) return <Empty />;
  const W = 570;
  const H = 200;
  const pad = { top: 18, bottom: 22 };
  const slot = W / bands.length;
  const barW = slot * 0.7;
  const plotH = H - pad.top - pad.bottom;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-labelledby="band-title">
      <title id="band-title">
        {`Attempts by band: ${bands.map((b, i) => `${b.toFixed(1)}: ${counts[i]}`).join(", ")}`}
      </title>
      <line x1={0} x2={W} y1={H - pad.bottom} y2={H - pad.bottom} stroke="var(--color-line-strong)" />
      {bands.map((b, i) => {
        const h = (counts[i]! / max) * plotH;
        const x = i * slot + (slot - barW) / 2;
        const y = H - pad.bottom - h;
        return (
          <g key={b}>
            <rect x={x} y={y} width={barW} height={h} rx={3} fill="var(--color-brand-500)">
              <title>{`Band ${b.toFixed(1)}: ${counts[i]}`}</title>
            </rect>
            {counts[i]! > 0 && (
              <text x={x + barW / 2} y={y - 4} textAnchor="middle" fontSize={10} fill="var(--color-ink-soft)">
                {counts[i]}
              </text>
            )}
            {b % 1 === 0 && (
              <text x={x + barW / 2} y={H - 6} textAnchor="middle" fontSize={10} fill="var(--color-muted)">
                {b}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

function SectionBands({ bands }: { bands: AdminAnalytics["section_bands"] }) {
  const sections = ["listening", "reading", "writing", "speaking"] as const;
  if (!bands || sections.every((s) => bands[s] == null)) return <Empty />;
  return (
    <ul className="grid gap-3">
      {sections.map((s) => {
        const v = bands[s];
        return (
          <li key={s}>
            <div className="flex justify-between text-sm">
              <span className="capitalize">{s}</span>
              <span className="font-semibold tabular-nums">{v == null ? "—" : Number(v).toFixed(1)}</span>
            </div>
            <div className="mt-1 h-2 rounded-full bg-paper" aria-hidden>
              <div
                className="h-2 rounded-full bg-brand-600"
                style={{ width: `${v == null ? 0 : (Number(v) / 9) * 100}%` }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function WeeklyChart({ data }: { data: AdminAnalytics["weekly"] }) {
  if (data.length === 0) return <Empty />;
  const W = 760;
  const H = 220;
  const pad = { top: 12, right: 12, bottom: 26, left: 36 };
  const max = Math.max(1, ...data.flatMap((d) => SERIES.map((s) => d[s.key])));
  const plotW = W - pad.left - pad.right;
  const plotH = H - pad.top - pad.bottom;
  const x = (i: number) => pad.left + (data.length === 1 ? plotW / 2 : (i / (data.length - 1)) * plotW);
  const y = (v: number) => pad.top + plotH - (v / max) * plotH;
  const ticks = [0, Math.round(max / 2), max];
  const labelEvery = Math.ceil(data.length / 8);
  const fmtWeek = (w: string) =>
    new Date(w).toLocaleDateString(undefined, { month: "short", day: "numeric" });

  return (
    <div>
      <ul className="mb-3 flex flex-wrap gap-4 text-xs text-ink-soft">
        {SERIES.map((s) => (
          <li key={s.key} className="flex items-center gap-1.5">
            <i className="h-2.5 w-2.5 rounded-sm" style={{ background: s.color }} aria-hidden />
            {s.label}
          </li>
        ))}
      </ul>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-labelledby="weekly-title">
        <title id="weekly-title">
          {`Weekly signups, attempts and drills over ${data.length} weeks`}
        </title>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={pad.left} x2={W - pad.right} y1={y(t)} y2={y(t)} stroke="var(--color-line)" />
            <text x={pad.left - 6} y={y(t) + 3} textAnchor="end" fontSize={10} fill="var(--color-muted)">
              {t}
            </text>
          </g>
        ))}
        {data.map((d, i) =>
          i % labelEvery === 0 ? (
            <text key={d.week} x={x(i)} y={H - 8} textAnchor="middle" fontSize={10} fill="var(--color-muted)">
              {fmtWeek(d.week)}
            </text>
          ) : null,
        )}
        {SERIES.map((s) => (
          <g key={s.key}>
            <polyline
              fill="none"
              stroke={s.color}
              strokeWidth={2}
              strokeLinejoin="round"
              points={data.map((d, i) => `${x(i)},${y(d[s.key])}`).join(" ")}
            />
            {data.map((d, i) => (
              <circle key={d.week} cx={x(i)} cy={y(d[s.key])} r={3} fill={s.color}>
                <title>{`${s.label}, week of ${fmtWeek(d.week)}: ${d[s.key]}`}</title>
              </circle>
            ))}
          </g>
        ))}
      </svg>
    </div>
  );
}

function WeakestTable({ rows }: { rows: AdminAnalytics["weakest_types"] }) {
  if (rows.length === 0) return <Empty />;
  return (
    <table className="w-full text-sm">
      <thead className="text-xs text-muted">
        <tr>
          <th className="pb-2 text-start font-medium">Type</th>
          <th className="pb-2 text-start font-medium">Section</th>
          <th className="pb-2 text-end font-medium">Answers</th>
          <th className="pb-2 text-end font-medium">Accuracy</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={`${r.section}-${r.label}`} className="border-t border-line">
            <td className="py-2">{r.label}</td>
            <td className="py-2 capitalize text-muted">{r.section}</td>
            <td className="py-2 text-end tabular-nums">{fmt(r.total)}</td>
            <td className={cn("py-2 text-end font-semibold tabular-nums", Number(r.accuracy) < 0.5 && "text-bad")}>
              {Math.round(Number(r.accuracy) * (Number(r.accuracy) <= 1 ? 100 : 1))}%
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function AiTable({ rows }: { rows: AdminAnalytics["ai_usage"] }) {
  if (rows.length === 0) return <Empty />;
  return (
    <table className="w-full text-sm">
      <thead className="text-xs text-muted">
        <tr>
          <th className="pb-2 text-start font-medium">Function</th>
          <th className="pb-2 text-end font-medium">Calls</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.function} className="border-t border-line">
            <td className="py-2 font-mono text-xs">{r.function}</td>
            <td className="py-2 text-end tabular-nums">{fmt(r.calls)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function ClientErrors() {
  const { data, isLoading, error } = useClientErrors();
  if (isLoading) return <p className="text-sm text-muted">Loading…</p>;
  if (error) return <p className="text-sm text-bad">{(error as Error).message}</p>;
  if (!data?.length) return <Empty>No client errors recorded.</Empty>;
  return (
    <ul className="grid gap-2">
      {data.map((e) => (
        <li key={e.id} className="rounded-lg border border-line bg-paper px-3 py-2 text-sm">
          <p className="break-words font-mono text-xs text-bad">{e.message}</p>
          <p className="mt-1 break-all text-xs text-muted">
            {new Date(e.created_at).toLocaleString()}
            {e.url ? ` · ${e.url}` : ""}
          </p>
        </li>
      ))}
    </ul>
  );
}
