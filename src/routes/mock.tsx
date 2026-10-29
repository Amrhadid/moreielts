import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "~/components/layout/AppShell";
import { Badge } from "~/components/ui/Badge";
import { Button } from "~/components/ui/Button";
import { Card, CardBody, CardHeader, CardTitle } from "~/components/ui/Card";
import { Protected, useAuth } from "~/lib/auth";
import { useI18n } from "~/lib/i18n";
import { useForms } from "~/lib/queries";

export const Route = createFileRoute("/mock")({ component: MockRoute });

function MockRoute() {
  return (
    <Protected>
      <MockTest />
    </Protected>
  );
}

const ORDER = [
  { code: "listening", detail: "4 parts · 40 questions · audio plays once" },
  { code: "reading", detail: "3 passages · 40 questions" },
  { code: "writing", detail: "Task 1 (150 words) + Task 2 (250 words)" },
  { code: "speaking", detail: "3 parts · recorded responses" },
] as const;

function MockTest() {
  // RLS returns published forms only, so this list is already safe to show.
  const { data: forms, isLoading } = useForms();
  const { isPremium, profile } = useAuth();
  const { t } = useI18n();
  const [showAll, setShowAll] = useState(false);
  const variant = profile?.variant ?? null;
  // Full exams only: the practice forms feed the skill sections instead. A
  // learner who chose Academic or General Training sees that variant first.
  const published = (forms ?? []).filter(
    (f) => f.is_published && f.purpose === "mock" && (showAll || !variant || f.variant === variant),
  );

  return (
    <AppShell>
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Mock test</h1>
      <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted">
        A full timed exam under test conditions. Sections run in the official order and
        each one is submitted before the next begins — you cannot return to a section
        once it is done.
      </p>

      {variant && (
        <p className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted">
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
        <p className="mt-6 text-sm text-muted">Loading tests…</p>
      ) : published.length === 0 ? (
        <Card className="mt-6">
          <CardBody className="pt-5 text-sm text-muted">
            No mock exams are published yet. An admin can publish one from the admin
            console.
          </CardBody>
        </Card>
      ) : (
        <div className="mt-6 grid gap-3">
          {[...published].sort((a, b) => a.title.localeCompare(b.title)).map((form) => (
            <Card key={form.id} className="border-brand-200 bg-brand-50/40">
              <CardHeader>
                <div className="flex flex-wrap items-center gap-3">
                  <CardTitle>{form.title}</CardTitle>
                  <Badge tone="brand" className="capitalize">
                    {form.variant.replace("_", " ")}
                  </Badge>
                  <Badge tone="neutral" className="capitalize">{form.difficulty}</Badge>
                  {form.is_premium && <Badge tone="warn">Premium</Badge>}
                </div>
              </CardHeader>
              <CardBody>
                <p className="text-sm text-ink-soft">
                  {form.description ??
                    "Approximately 2 hours 45 minutes including the speaking test. Fixed test form — the difficulty does not change as you work."}
                </p>
                {isPremium ? (
                  <Button asChild size="lg" className="mt-4">
                    <Link to="/test/listening" search={{ form: form.id }}>
                      Start the exam with Listening
                    </Link>
                  </Button>
                ) : (
                  <Button asChild size="lg" variant="secondary" className="mt-4">
                    <Link to="/pricing">Unlock with an access code</Link>
                  </Button>
                )}
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      <h2 className="mb-1 mt-8 text-lg font-semibold tracking-tight">Test order</h2>
      <p className="mb-3 text-sm text-muted">
        Each exam starts with Listening. The next section opens when you submit the one before it.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {ORDER.map((section, i) => (
          <Card key={section.code}>
            <CardBody className="pt-5">
              <div className="flex items-start gap-3">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-paper text-xs font-semibold text-muted">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-medium capitalize">{section.code}</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted">{section.detail}</p>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
