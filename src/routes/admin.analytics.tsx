import { createFileRoute } from "@tanstack/react-router";
import { Card, CardBody } from "~/components/ui/Card";
import { formatBand } from "~/lib/scoring";
import { useForms, useStudents } from "~/lib/queries";

export const Route = createFileRoute("/admin/analytics")({ component: Analytics });

function Analytics() {
  const { data: students } = useStudents();
  const { data: forms } = useForms();

  const withBand = (students ?? []).filter((s) => s.current_band !== null);
  const averageBand = withBand.length
    ? withBand.reduce((sum, s) => sum + Number(s.current_band), 0) / withBand.length
    : null;

  const stats = [
    { label: "Students", value: String(students?.length ?? 0) },
    { label: "Published forms", value: String(forms?.filter((f) => f.is_published).length ?? 0) },
    { label: "Premium students", value: String((students ?? []).filter((s) => s.tier === "premium").length) },
    {
      label: "Average estimated band",
      value: averageBand !== null ? formatBand(Math.round(averageBand * 2) / 2) : "—",
    },
  ];

  return (
    <>
      <h1 className="mb-5 text-xl font-semibold tracking-tight">Analytics</h1>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardBody className="pt-5">
              <p className="text-xs font-medium uppercase tracking-wide text-muted">
                {stat.label}
              </p>
              <p className="mt-2 text-3xl font-semibold tabular-nums">{stat.value}</p>
            </CardBody>
          </Card>
        ))}
      </div>
      <Card className="mt-6">
        <CardBody className="pt-5">
          <p className="text-sm font-medium">Band distribution</p>
          <div className="mt-6 grid h-48 place-items-center rounded-lg border border-dashed border-line-strong text-sm text-muted">
            {/* TODO(analytics): aggregate attempt_scores server-side and plot. */}
            Chart placeholder — attempts by overall band.
          </div>
        </CardBody>
      </Card>
    </>
  );
}
