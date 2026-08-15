import { createFileRoute } from "@tanstack/react-router";
import { Card, CardBody } from "~/components/ui/Card";
import { mockAnalytics } from "~/mock/testForm";

export const Route = createFileRoute("/admin/analytics")({ component: Analytics });

/** Shell only. TODO(backend): real aggregates and a chart library. */
function Analytics() {
  return (
    <>
      <h1 className="mb-5 text-xl font-semibold tracking-tight">Analytics</h1>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {mockAnalytics.map((stat) => (
          <Card key={stat.label}>
            <CardBody className="pt-5">
              <p className="text-xs font-medium uppercase tracking-wide text-muted">
                {stat.label}
              </p>
              <p className="mt-2 text-3xl font-semibold tabular-nums">{stat.value}</p>
              <p className="mt-1 text-xs text-good">{stat.delta} vs last week</p>
            </CardBody>
          </Card>
        ))}
      </div>
      <Card className="mt-6">
        <CardBody className="pt-5">
          <p className="text-sm font-medium">Band distribution</p>
          <div className="mt-6 grid h-48 place-items-center rounded-lg border border-dashed border-line-strong text-sm text-muted">
            Chart placeholder — TODO(backend): plot attempts by overall band.
          </div>
        </CardBody>
      </Card>
    </>
  );
}
