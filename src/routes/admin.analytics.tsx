import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardBody } from "~/components/ui/Card";
import { Select } from "~/components/ui/Select";
import { cn } from "~/lib/cn";
import { Badge } from "~/components/ui/Badge";
import { Button } from "~/components/ui/Button";
import {
  useAdminAnalytics,
  useAdminHealth,
  useClientErrors,
  useRetryGradingJob,
  useWorkerHealth,
  type AdminAnalytics,
} from "~/lib/practice-queries";

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

      <SystemHealth />

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

/* ------------------------------------------------------------------ *
 * System health: is the grading pipeline alive, and is the content whole?
 * ------------------------------------------------------------------ */

function Light({ ok, warn, label, detail }: { ok: boolean; warn?: boolean; label: string; detail?: string }) {
  return (
    <li className="flex items-start gap-2.5 text-sm">
      <span
        aria-hidden
        className={cn(
          "mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full",
          ok ? "bg-good" : warn ? "bg-warn" : "bg-bad",
        )}
      />
      <span className="min-w-0">
        <span className="font-medium">{label}</span>
        {detail && <span className="block text-xs text-muted">{detail}</span>}
      </span>
    </li>
  );
}

const ago = (iso: string | null | undefined) => {
  if (!iso) return "never";
  const minutes = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  if (minutes < 60 * 48) return `${Math.round(minutes / 60)} h ago`;
  return `${Math.round(minutes / 1440)} days ago`;
};

function SystemHealth() {
  const health = useAdminHealth();
  const worker = useWorkerHealth();
  const retry = useRetryGradingJob();
  const h = health.data;

  return (
    <Card className="mb-6">
      <CardBody className="pt-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-sm font-medium">System health</p>
            <p className="text-xs text-muted">
              Grading pipeline, secrets and content, checked every 30 seconds.
              {h ? ` Last check ${ago(h.checked_at)}.` : ""}
            </p>
          </div>
          <Button size="sm" variant="outline" onClick={() => { void health.refetch(); void worker.refetch(); }}>
            Refresh
          </Button>
        </div>

        {health.error && <p className="mt-3 text-sm text-bad">{(health.error as Error).message}</p>}
        {health.isLoading && <p className="mt-3 text-sm text-muted">Checking…</p>}

        {h && (
          <div className="mt-4 grid gap-6 md:grid-cols-3">
            <ul className="grid gap-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">Grading</p>
              <Light
                ok={h.cron_active && h.cron?.status === "succeeded"}
                warn={h.cron_active}
                label={h.cron_active ? "Sweep cron scheduled" : "Sweep cron missing"}
                detail={h.cron ? `last run ${h.cron.status}, ${ago(h.cron.at)}` : "no run recorded"}
              />
              <Light
                ok={h.vault.worker_key && h.vault.worker_url}
                label="Vault worker key and URL"
                detail={h.vault.worker_key && h.vault.worker_url ? "present" : "missing — grading cannot start"}
              />
              <Light
                ok={h.jobs.stuck === 0 && h.jobs.oldest_pending_minutes < 10}
                warn={h.jobs.stuck === 0}
                label={`${h.jobs.pending} pending · ${h.jobs.running} running · ${h.jobs.failed} failed · ${h.jobs.done} done`}
                detail={
                  h.jobs.stuck > 0
                    ? `${h.jobs.stuck} job(s) stuck for over 10 minutes`
                    : h.jobs.pending > 0
                      ? `oldest pending ${h.jobs.oldest_pending_minutes} min`
                      : `last grade ${ago(h.jobs.last_done_at)}`
                }
              />
            </ul>

            <ul className="grid gap-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">Worker secrets</p>
              {worker.isLoading && <li className="text-sm text-muted">Asking the worker…</li>}
              {worker.error && (
                <Light ok={false} label="Worker unreachable" detail={(worker.error as Error).message} />
              )}
              {worker.data &&
                Object.entries(worker.data.env).map(([key, present]) => (
                  <Light key={key} ok={present} label={key} detail={present ? "set" : "missing"} />
                ))}
              {worker.data && (
                <li className="text-xs text-muted">
                  Grading model: {worker.data.grading_model ?? "function default"}
                </li>
              )}
            </ul>

            <ul className="grid gap-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">Content and learners</p>
              <Light
                ok={h.content.listening_parts_without_audio === 0}
                label={`${h.content.listening_parts_without_audio} listening parts without audio`}
              />
              <Light
                ok={h.content.questions_without_explanation === 0}
                warn
                label={`${h.content.questions_without_explanation} questions without an explanation`}
              />
              <Light
                ok={h.content.forms_missing_sections === 0}
                label={`${h.content.forms_published} published forms (${h.content.mock_forms} mock)`}
                detail={h.content.forms_missing_sections ? `${h.content.forms_missing_sections} missing a section` : "all four sections present"}
              />
              <Light
                ok={h.learners.attempts_completed > 0}
                warn
                label={`${h.learners.attempts_submitted} mocks submitted · ${h.learners.attempts_completed} fully graded`}
                detail={
                  h.learners.attempts_completed === 0
                    ? "the pipeline has not completed an exam yet — run one as admin"
                    : `last attempt ${ago(h.learners.last_attempt_at)}`
                }
              />
              <li className="text-xs text-muted">
                {h.learners.total} learners · {h.learners.premium} Premium · {h.learners.onboarded} onboarded
              </li>
            </ul>
          </div>
        )}

        {h && h.failed_jobs.length > 0 && (
          <div className="mt-5">
            <p className="text-sm font-medium">Failed grading jobs</p>
            <ul className="mt-2 divide-y divide-line rounded-lg border border-line">
              {h.failed_jobs.map((job) => (
                <li key={job.id} className="flex flex-wrap items-center gap-3 px-3 py-2 text-sm">
                  <Badge tone="bad">{job.kind}{job.part_number ? ` ${job.part_number}` : ""}</Badge>
                  <span className="min-w-0 flex-1 truncate font-mono text-xs text-muted" title={job.last_error ?? ""}>
                    {job.last_error ?? "no error recorded"}
                  </span>
                  <span className="text-xs text-muted">{job.tries} tries · {ago(job.finished_at)}</span>
                  <Button size="sm" variant="outline" disabled={retry.isPending} onClick={() => retry.mutate(job.id)}>
                    Retry
                  </Button>
                </li>
              ))}
            </ul>
            {retry.isError && <p className="mt-2 text-xs text-bad">{(retry.error as Error).message}</p>}
          </div>
        )}
      </CardBody>
    </Card>
  );
}
