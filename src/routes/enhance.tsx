import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "~/components/layout/AppShell";
import { Button } from "~/components/ui/Button";
import { Card, CardBody, CardHeader, CardTitle } from "~/components/ui/Card";
import { Progress } from "~/components/ui/Progress";
import { tallyBy } from "~/lib/scoring";
import { Protected, useAuth } from "~/lib/auth";
import { useAttempts, useAttemptReview } from "~/lib/queries";

export const Route = createFileRoute("/enhance")({ component: EnhanceRoute });

function EnhanceRoute() {
  return (
    <Protected>
      <Enhance />
    </Protected>
  );
}

function Enhance() {
  const { user } = useAuth();
  const { data: attempts } = useAttempts(user?.id);

  // Weakest question types from the most recent completed attempt.
  const latest = attempts?.find((a) => a.status === "completed");
  const { data: review, isLoading } = useAttemptReview(latest?.id, Boolean(latest));

  const weakest = tallyBy(
    (review ?? [])
      .filter((r) => r.section === "listening" || r.section === "reading")
      .map((r) => ({
        questionId: r.question_id,
        typeCode: r.type_label,
        partNumber: r.part_number,
        isCorrect: r.is_correct === true,
      })),
    (r) => r.typeCode,
  )
    .filter((row) => row.total >= 3)
    .sort((a, b) => a.correct / a.total - b.correct / b.total)
    .slice(0, 4);

  return (
    <AppShell>
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Enhance</h1>
      <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted">
        Where your marks are actually going. These are the question types you lost the
        most on in your latest attempt.
      </p>

      {isLoading ? (
        <p className="mt-6 text-sm text-muted">Loading your last attempt…</p>
      ) : weakest.length === 0 ? (
        <Card className="mt-6">
          <CardBody className="pt-5 text-sm text-muted">
            Complete a Listening or Reading section to see your weakest question types.
          </CardBody>
        </Card>
      ) : (
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {weakest.map((row) => {
            const pct = (row.correct / row.total) * 100;
            return (
              <Card key={row.key}>
                <CardHeader>
                  <CardTitle>{row.key}</CardTitle>
                </CardHeader>
                <CardBody>
                  <div className="mb-2 flex items-baseline justify-between text-sm">
                    <span className="text-muted">Accuracy</span>
                    <span className="tabular-nums">
                      {row.correct}/{row.total} · {Math.round(pct)}%
                    </span>
                  </div>
                  <Progress value={pct} tone={pct >= 70 ? "good" : "brand"} />
                  <Button asChild variant="secondary" size="sm" className="mt-4">
                    <Link to="/practice">Practise this type</Link>
                  </Button>
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}

      {/* TODO(backend): an AI-generated study plan can replace this static one. */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Suggested plan</CardTitle>
        </CardHeader>
        <CardBody>
          <ol className="grid gap-3 text-sm leading-relaxed text-ink-soft">
            <li>1. Two short drills a day on your weakest two question types.</li>
            <li>2. One full timed section every second day, alternating Reading and Listening.</li>
            <li>3. One Writing Task 2 per week, reviewed against the four criteria.</li>
            <li>4. A complete mock test every fortnight to track the overall band.</li>
          </ol>
        </CardBody>
      </Card>
    </AppShell>
  );
}
