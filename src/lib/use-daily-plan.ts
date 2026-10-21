import { useMemo } from "react";
import { useAuth } from "./auth";
import { useLearningStats, useTypeAccuracy } from "./practice-queries";
import { useAttempts } from "./queries";
import { buildDailyPlan, daysBetween, localDay } from "./study-plan";

/** Gathers the inputs and builds today's plan; shared by the dashboard and /enhance. */
export function useDailyPlan() {
  const { user, profile, isPremium } = useAuth();
  const signedIn = Boolean(user);
  const stats = useLearningStats(signedIn);
  const accuracy = useTypeAccuracy(signedIn);
  const attempts = useAttempts(user?.id);
  const today = localDay();

  const plan = useMemo(() => {
    const completed = (attempts.data ?? []).filter((a) => a.status === "completed");
    const last = completed[0]?.submitted_at ?? completed[0]?.started_at ?? null;
    return buildDailyPlan({
      today,
      examDate: profile?.exam_date ?? null,
      targetBand: profile?.target_band != null ? Number(profile.target_band) : null,
      currentBand: profile?.current_band != null ? Number(profile.current_band) : null,
      dailyGoalMinutes: profile?.daily_goal_minutes ?? 30,
      typeAccuracy: accuracy.data ?? [],
      dueCards: stats.data?.mistakes_due ?? 0,
      completedMocks: completed.length,
      lastMockDaysAgo: last ? Math.max(0, daysBetween(localDay(new Date(last)), today)) : null,
      isPremium,
    });
  }, [today, profile, accuracy.data, stats.data, attempts.data, isPremium]);

  return {
    plan,
    today,
    stats: stats.data,
    accuracy: accuracy.data ?? [],
    attempts: attempts.data,
    isLoading: stats.isLoading || accuracy.isLoading || attempts.isLoading,
  };
}
