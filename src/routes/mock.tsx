import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell, PageHeader } from "~/components/layout/AppShell";
import { Badge } from "~/components/ui/Badge";
import { Button } from "~/components/ui/Button";
import { Card } from "~/components/ui/Card";
import { EmptyState, SkeletonRows } from "~/components/ui/EmptyState";
import { SectionIcon } from "~/components/ui/SectionIcon";
import { Protected, useAuth } from "~/lib/auth";
import { cn } from "~/lib/cn";
import { useI18n } from "~/lib/i18n";
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
  const { isPremium, profile } = useAuth();
  const { t } = useI18n();
  const [showAll, setShowAll] = useState(false);
  const variant = profile?.variant ?? null;
  // Full exams only: the practice forms feed the skill sections instead. A
  // learner who chose Academic or General Training sees that variant first.
  const published = (forms ?? [])
    .filter((f) => f.is_published && f.purpose === "mock" && (showAll || !variant || f.variant === variant))
    .sort((a, b) => a.title.localeCompare(b.title));

  return (
    <AppShell>
      <PageHeader
        title="Mock test"
        subtitle="A full timed exam under test conditions. Sections run in the official order and each one is submitted before the next begins. You cannot return to a section once it is done."
      />

      {variant && (
        <p className="mb-4 flex flex-wrap items-center gap-3 text-sm text-muted">
          <span>{t("mock.onlyVariant").replace("{variant}", t(`variant.${variant}`))}</span>
          <button
            type="button"
            onClick={() => setShowAll((v) => !v)}
            className="font-medium text-brand-600 hover:underline"
          >
            {showAll ? t("mock.showMine") : t("mock.showAll")}
          </button>
        </p>
      )}

      {isLoading ? (
        <SkeletonRows rows={2} />
      ) : published.length === 0 ? (
        <EmptyState
          title="No mock exams are published yet"
          body="An admin can publish one from the admin console."
        />
      ) : (
        <div className="grid gap-3">
          {published.map((form, i) => (
            <Card key={form.id} className={cn("p-5 sm:p-6", i === 0 && "border-brand-600")}>
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-[1.125rem] font-semibold">{form.title}</h2>
                <Badge tone="brand">{t(`variant.${form.variant}`)}</Badge>
                <Badge className="capitalize">{form.difficulty}</Badge>
                <Badge>About 2 h 45 min</Badge>
                {form.is_premium && <Badge tone="warn">{t("common.premium")}</Badge>}
              </div>
              <p className="mt-2 max-w-2xl text-sm text-ink-soft">
                {form.description ??
                  "Listening, Reading, Writing and Speaking, each submitted before the next opens. Fixed test form. The difficulty does not change as you work."}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {isPremium ? (
                  <Button asChild>
                    <Link to="/test/listening" search={{ form: form.id }}>
                      Begin with Listening
                    </Link>
                  </Button>
                ) : (
                  <Button asChild variant="secondary">
                    <Link to="/pricing">Unlock with an access code</Link>
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      <div className="mb-2.5 mt-8">
        <h2 className="text-[1.0625rem] font-semibold">Test order</h2>
        <p className="mt-0.5 text-sm text-muted">
          Each exam starts with Listening. The next section opens when you submit the one before it.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {SECTIONS.map((sec, i) => (
          <Card key={sec.code} className="p-4">
            <p className="font-mono text-xs text-muted">{i + 1}</p>
            <div className="mt-2 flex items-center gap-2.5">
              <SectionIcon code={sec.code} size="sm" />
              <p className="font-semibold">{sec.label}</p>
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-muted">{sec.facts.join(" · ")}</p>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
