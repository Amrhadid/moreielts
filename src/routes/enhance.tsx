import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "~/components/layout/AppShell";
import { Button } from "~/components/ui/Button";
import { Card, CardBody, CardHeader, CardTitle } from "~/components/ui/Card";
import { Progress } from "~/components/ui/Progress";
import { mockResult } from "~/mock/result";

export const Route = createFileRoute("/enhance")({ component: Enhance });

function Enhance() {
  // Weakest question types across the last attempt drive the suggestions.
  const weakest = [...mockResult.reading.byQuestionType, ...mockResult.listening.byQuestionType]
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

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {weakest.map((row) => {
          const pct = (row.correct / row.total) * 100;
          return (
            <Card key={`${row.code}-${row.label}`}>
              <CardHeader>
                <CardTitle>{row.label}</CardTitle>
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

      {/* TODO(backend): AI-generated study plan goes here. */}
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
