import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, PageHeader } from "~/components/layout/AppShell";
import { Badge } from "~/components/ui/Badge";
import { Button } from "~/components/ui/Button";
import { Card } from "~/components/ui/Card";
import { EmptyState, SkeletonRows } from "~/components/ui/EmptyState";
import { SectionIcon } from "~/components/ui/SectionIcon";
import { cn } from "~/lib/cn";
import { Protected } from "~/lib/auth";
import { useForms } from "~/lib/queries";
import { SECTIONS } from "~/lib/sections";

export const Route = createFileRoute("/mock")({ component: MockRoute });

function MockRoute() {
  return (
    <Protected>
      <MockTest />
    </Protected>
  );
}

function MockTest() {
  // RLS returns published forms only, so this list is already safe to show.
  const { data: forms, isLoading } = useForms();
  const published = (forms ?? []).filter((f) => f.is_published);

  return (
    <AppShell>
      <PageHeader
        title="Mock test"
        subtitle="Sections run in the official order and each one is submitted before the next begins. You cannot return to a section once it is done."
      />

      {isLoading ? (
        <SkeletonRows rows={2} />
      ) : published.length === 0 ? (
        <EmptyState
          title="No published test forms yet"
          body="An admin can create and publish one from the admin console."
        />
      ) : (
        <div className="grid gap-3">
          {published.map((form, i) => (
            <Card
              key={form.id}
              className={cn("px-6 py-5", i === 0 && "border-brand-600")}
            >
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-[1.1875rem] font-semibold tracking-tight">{form.title}</h2>
                <Badge tone="brand" className="capitalize">
                  {form.variant.replace("_", " ")}
                </Badge>
                <Badge>About 2 h 45 min</Badge>
                {form.is_premium && <Badge tone="warn">Premium</Badge>}
              </div>
              <p className="mt-2 max-w-[60ch] text-sm text-muted">
                {form.description ??
                  "Listening, Reading, Writing and Speaking in one sitting, or paused between sections. Fixed test form. The difficulty does not change as you work."}
              </p>
              <div className="mt-4 flex flex-wrap gap-2.5">
                <Button asChild>
                  <Link to="/test/listening">Begin with Listening</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/learn">What to expect</Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <h2 className="mb-3 mt-8 text-[1.0625rem] font-semibold tracking-tight">Test order</h2>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {SECTIONS.map((s, i) => (
          <Card key={s.code} className="px-[1.125rem] py-4">
            <p className="font-mono text-xs text-muted">{i + 1}</p>
            <div className="mt-1.5 flex items-center gap-2 font-semibold">
              <SectionIcon code={s.code} size="sm" />
              {s.label}
            </div>
            <p className="mt-1 text-[0.8125rem] text-muted">{s.facts.join(" · ")}</p>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
