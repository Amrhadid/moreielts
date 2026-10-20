import type { BarChartSpec, TableSpec } from "~/data/practice";

const SERIES_FILL = ["fill-brand-200", "fill-brand-500", "fill-brand-700"];

/** A grouped bar chart drawn as inline SVG, so a Task 1 prompt needs no upload. */
export function BarChart({ spec }: { spec: BarChartSpec }) {
  const width = 640;
  const height = 340;
  const margin = { top: 24, right: 16, bottom: 56, left: 44 };
  const innerW = width - margin.left - margin.right;
  const innerH = height - margin.top - margin.bottom;
  const groupW = innerW / spec.categories.length;
  const barW = (groupW * 0.72) / spec.series.length;
  const ticks = 5;

  const y = (v: number) => margin.top + innerH - (v / spec.max) * innerH;

  return (
    <figure className="mt-5">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={spec.title}
        className="w-full rounded-lg border border-line bg-surface"
      >
        <title>{spec.title}</title>
        {Array.from({ length: ticks + 1 }, (_, i) => {
          const v = (spec.max / ticks) * i;
          return (
            <g key={i}>
              <line
                x1={margin.left}
                x2={width - margin.right}
                y1={y(v)}
                y2={y(v)}
                className="stroke-line"
                strokeWidth={1}
              />
              <text
                x={margin.left - 8}
                y={y(v) + 4}
                textAnchor="end"
                className="fill-muted text-[11px]"
              >
                {v}
              </text>
            </g>
          );
        })}
        {spec.categories.map((category, ci) => (
          <g key={category}>
            {spec.series.map((s, si) => {
              const v = s.values[ci] ?? 0;
              const x =
                margin.left + ci * groupW + (groupW - barW * spec.series.length) / 2 + si * barW;
              return (
                <g key={s.name}>
                  <rect
                    x={x}
                    y={y(v)}
                    width={barW - 3}
                    height={innerH - (y(v) - margin.top)}
                    rx={2}
                    className={SERIES_FILL[si % SERIES_FILL.length]}
                  >
                    <title>{`${category} · ${s.name}: ${v}`}</title>
                  </rect>
                  <text
                    x={x + (barW - 3) / 2}
                    y={y(v) - 5}
                    textAnchor="middle"
                    className="fill-ink-soft text-[10px] tabular-nums"
                  >
                    {v}
                  </text>
                </g>
              );
            })}
            <text
              x={margin.left + ci * groupW + groupW / 2}
              y={height - margin.bottom + 18}
              textAnchor="middle"
              className="fill-ink text-[12px] font-medium"
            >
              {category}
            </text>
          </g>
        ))}
        <text
          x={margin.left}
          y={14}
          className="fill-muted text-[11px]"
        >
          {spec.unit}
        </text>
        {spec.series.map((s, si) => (
          <g key={s.name} transform={`translate(${margin.left + si * 86}, ${height - 14})`}>
            <rect width={12} height={12} rx={2} className={SERIES_FILL[si % SERIES_FILL.length]} />
            <text x={18} y={10} className="fill-ink-soft text-[11px]">
              {s.name}
            </text>
          </g>
        ))}
      </svg>
      <figcaption className="mt-2 text-center text-xs text-muted">{spec.title}</figcaption>
    </figure>
  );
}

export function DataTable({ spec }: { spec: TableSpec }) {
  return (
    <figure className="mt-5 overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <caption className="mb-2 text-left text-xs font-semibold uppercase tracking-wide text-muted">
          {spec.title}
        </caption>
        <thead>
          <tr>
            {spec.columns.map((c, i) => (
              <th
                key={c}
                className={
                  "border-b-2 border-line-strong px-3 py-2 font-semibold " +
                  (i === 0 ? "text-left" : "text-right")
                }
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {spec.rows.map((row, ri) => {
            const last = ri === spec.rows.length - 1;
            return (
              <tr key={ri} className={last ? "font-semibold" : undefined}>
                {row.map((cell, i) => (
                  <td
                    key={i}
                    className={
                      "border-b border-line px-3 py-2 tabular-nums " +
                      (i === 0 ? "text-left" : "text-right")
                    }
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </figure>
  );
}
