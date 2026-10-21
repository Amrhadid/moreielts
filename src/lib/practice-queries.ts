import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { invokeFunction, supabase } from "./supabase";
import type { RendererKey, SectionCode } from "~/types/database";

/**
 * Reads and writes for everything outside the mock player: drills, the
 * mistake notebook, the writing lab, vocabulary, the study plan, streaks,
 * results extras, analytics and checkout. Server shapes come from migrations
 * 0007-0010 and the drill / checkout Edge Functions.
 */

export const practiceKeys = {
  stats: ["learning_stats"] as const,
  typeAccuracy: ["type_accuracy"] as const,
  due: ["mistakes_due"] as const,
  mistakeCount: ["mistake_count"] as const,
  essays: ["essays"] as const,
  essay: (id: string) => ["essay", id] as const,
  prompts: ["writing_prompts"] as const,
  learned: ["vocab_learned"] as const,
  planChecks: (day: string) => ["plan_checks", day] as const,
  jobs: (attemptId: string) => ["grading_jobs", attemptId] as const,
  transcripts: (attemptId: string) => ["transcripts", attemptId] as const,
  reviewV2: (attemptId: string) => ["attempt_review_v2", attemptId] as const,
  drillHistory: ["drill_history"] as const,
  analytics: (days: number) => ["admin_analytics", days] as const,
  clientErrors: ["client_errors"] as const,
};

/* ------------------------------------------------------------------ *
 * Streaks and progress
 * ------------------------------------------------------------------ */

export interface LearningStats {
  streak: number;
  today_minutes: number;
  days: Array<{ day: string; minutes: number }>;
  drills_total: number;
  mistakes_due: number;
  words_learned: number;
}

export function useLearningStats(enabled = true) {
  return useQuery({
    queryKey: practiceKeys.stats,
    enabled,
    queryFn: async (): Promise<LearningStats> => {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
      const { data, error } = await supabase.rpc("get_learning_stats", { p_tz: tz });
      if (error) throw error;
      return data as LearningStats;
    },
  });
}

export interface TypeAccuracyRow {
  type_code: string;
  type_label: string;
  section: SectionCode;
  correct: number;
  total: number;
}

export function useTypeAccuracy(enabled = true) {
  return useQuery({
    queryKey: practiceKeys.typeAccuracy,
    enabled,
    queryFn: async (): Promise<TypeAccuracyRow[]> => {
      const { data, error } = await supabase.rpc("get_type_accuracy");
      if (error) throw error;
      return (data as TypeAccuracyRow[]) ?? [];
    },
  });
}

/** Learner settings that live on the profile: goals and the exam date. */
export function useUpdateGoals() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (vars: {
      userId: string;
      target_band?: number | null;
      exam_date?: string | null;
      daily_goal_minutes?: number;
    }) => {
      const { userId, ...patch } = vars;
      const { error } = await supabase.from("profiles").update(patch).eq("id", userId);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["profile"] }),
  });
}

/* ------------------------------------------------------------------ *
 * Drills
 * ------------------------------------------------------------------ */

export interface DrillQuestion {
  id: string;
  group_id: string;
  type_code: string;
  prompt: string;
  options: Array<{ value: string; label: string }>;
  word_limit: number;
  order_index: number;
}

export interface DrillGroup {
  id: string;
  part_number: number;
  section: SectionCode;
  form_title: string;
  passage_text: string | null;
  audio_url: string | null;
  image_url: string | null;
  instructions: string | null;
  image_caption: string | null;
}

export interface DrillStart {
  drill_id: string;
  group: DrillGroup;
  questions: DrillQuestion[];
}

export interface DrillReviewItem {
  question_id: string;
  prompt: string;
  answer: string | string[];
  correct: boolean;
  accepted_answers: string[];
  explanation: string | null;
}

export interface DrillResult {
  correct: number;
  total: number;
  review: DrillReviewItem[];
  transcript: string | null;
}

export function useStartDrill() {
  return useMutation({
    mutationFn: (vars: { typeCode: string; difficulty?: string }) =>
      invokeFunction<DrillStart>("drill", {
        action: "start",
        type_code: vars.typeCode,
        difficulty: vars.difficulty,
      }),
  });
}

export function useSubmitDrill() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (vars: { drillId: string; answers: Record<string, string | string[]> }) =>
      invokeFunction<DrillResult>("drill", {
        action: "submit",
        drill_id: vars.drillId,
        answers: vars.answers,
      }),
    onSuccess: () => {
      for (const key of [practiceKeys.stats, practiceKeys.typeAccuracy, practiceKeys.due, practiceKeys.drillHistory]) {
        queryClient.invalidateQueries({ queryKey: key });
      }
    },
  });
}

export function useDrillHistory(enabled = true) {
  return useQuery({
    queryKey: practiceKeys.drillHistory,
    enabled,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("drill_attempts")
        .select("id, type_code, correct, total, submitted_at, question_types ( label )")
        .not("submitted_at", "is", null)
        .order("submitted_at", { ascending: false })
        .limit(20);
      if (error) throw error;
      return data as unknown as Array<{
        id: string;
        type_code: string;
        correct: number;
        total: number;
        submitted_at: string;
        question_types: { label: string } | null;
      }>;
    },
  });
}

/* ------------------------------------------------------------------ *
 * Mistake notebook
 * ------------------------------------------------------------------ */

export interface MistakeCard {
  question_id: string;
  box: number;
  due_at: string;
  last_answer: string | null;
  times_wrong: number;
  times_right: number;
  question: {
    id: string;
    type_code: string;
    type_label: string;
    renderer: RendererKey;
    prompt: string;
    options: Array<{ value: string; label: string }>;
    word_limit: number;
  };
  group: {
    section: SectionCode;
    passage_text: string | null;
    audio_url: string | null;
    image_url: string | null;
    instructions: string | null;
  };
}

export interface ReviewVerdict {
  correct: boolean;
  box: number;
  mastered: boolean;
  next_in_days: number | null;
  accepted_answers: string[];
  explanation: string | null;
}

export function useDueCards(enabled = true) {
  return useQuery({
    queryKey: practiceKeys.due,
    enabled,
    staleTime: 0,
    queryFn: async () =>
      (await invokeFunction<{ cards: MistakeCard[] }>("drill", { action: "due", limit: 20 })).cards,
  });
}

/** How many cards are in the notebook at all, mastered or not. */
export function useMistakeCount(enabled = true) {
  return useQuery({
    queryKey: practiceKeys.mistakeCount,
    enabled,
    queryFn: async () => {
      const [{ count: open }, { count: mastered }] = await Promise.all([
        supabase.from("mistakes").select("question_id", { count: "exact", head: true }).lt("box", 6),
        supabase.from("mistakes").select("question_id", { count: "exact", head: true }).eq("box", 6),
      ]);
      return { open: open ?? 0, mastered: mastered ?? 0 };
    },
  });
}

export function useReviewCard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (vars: { questionId: string; answer: string | string[] }) =>
      invokeFunction<ReviewVerdict>("drill", {
        action: "review",
        question_id: vars.questionId,
        answer: vars.answer,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: practiceKeys.stats });
      queryClient.invalidateQueries({ queryKey: practiceKeys.mistakeCount });
    },
  });
}

export function useDropCard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (questionId: string) => {
      const { error } = await supabase.from("mistakes").delete().eq("question_id", questionId);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: practiceKeys.mistakeCount }),
  });
}

/* ------------------------------------------------------------------ *
 * Writing lab
 * ------------------------------------------------------------------ */

export interface WritingCorrection {
  original: string;
  corrected: string;
  why: string;
}

export interface WritingFeedback {
  task_achievement?: { comment: string; evidence: string[] };
  coherence_cohesion?: { comment: string; evidence: string[] };
  lexical_resource?: { comment: string; evidence: string[] };
  grammatical_range?: { comment: string; evidence: string[] };
  summary?: string;
  corrections?: WritingCorrection[];
  model_answer?: string;
  word_count?: number;
  previous?: {
    task_band: number | null;
    task_achievement: number | null;
    coherence_cohesion: number | null;
    lexical_resource: number | null;
    grammatical_range: number | null;
  };
}

export interface EssayRow {
  id: string;
  task_number: 1 | 2;
  group_id: string | null;
  prompt: string;
  body: string;
  parent_id: string | null;
  status: "pending" | "graded" | "failed";
  task_achievement: number | null;
  coherence_cohesion: number | null;
  lexical_resource: number | null;
  grammatical_range: number | null;
  task_band: number | null;
  feedback: WritingFeedback;
  created_at: string;
  graded_at: string | null;
}

export interface WritingPrompt {
  group_id: string;
  form_title: string;
  variant: "academic" | "general_training";
  task_number: 1 | 2;
  prompt: string;
  image_url: string | null;
  is_premium: boolean;
}

export function useWritingPrompts() {
  return useQuery({
    queryKey: practiceKeys.prompts,
    staleTime: 10 * 60 * 1000,
    queryFn: async (): Promise<WritingPrompt[]> => {
      const { data, error } = await supabase.rpc("list_writing_prompts");
      if (error) throw error;
      return (data as WritingPrompt[]) ?? [];
    },
  });
}

export function useEssays(enabled = true) {
  return useQuery({
    queryKey: practiceKeys.essays,
    enabled,
    // Poll while anything is still being graded.
    refetchInterval: (query) =>
      (query.state.data as EssayRow[] | undefined)?.some((e) => e.status === "pending") ? 5000 : false,
    queryFn: async (): Promise<EssayRow[]> => {
      const { data, error } = await supabase
        .from("writing_submissions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return (data as unknown as EssayRow[]) ?? [];
    },
  });
}

export function useSubmitEssay() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (vars: {
      taskNumber: 1 | 2;
      prompt: string;
      body: string;
      groupId?: string | null;
      parentId?: string | null;
    }) => {
      const { data, error } = await supabase.rpc("submit_essay", {
        p_task_number: vars.taskNumber,
        p_prompt: vars.prompt,
        p_body: vars.body,
        p_group_id: vars.groupId ?? null,
        p_parent_id: vars.parentId ?? null,
      });
      if (error) throw error;
      return data as string;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: practiceKeys.essays });
      queryClient.invalidateQueries({ queryKey: practiceKeys.stats });
    },
  });
}

/* ------------------------------------------------------------------ *
 * Vocabulary
 * ------------------------------------------------------------------ */

export function useLearnedWords(enabled = true) {
  return useQuery({
    queryKey: practiceKeys.learned,
    enabled,
    staleTime: Infinity,
    queryFn: async (): Promise<Set<string>> => {
      const { data, error } = await supabase.from("vocab_learned").select("word_slug");
      if (error) throw error;
      return new Set((data ?? []).map((r) => r.word_slug as string));
    },
  });
}

/** Optimistic: the tick flips at once and rolls back if the write fails. */
export function useToggleLearned(userId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (vars: { slug: string; learned: boolean }) => {
      if (!userId) throw new Error("not_signed_in");
      const { error } = vars.learned
        ? await supabase.from("vocab_learned").upsert({ user_id: userId, word_slug: vars.slug })
        : await supabase.from("vocab_learned").delete().eq("word_slug", vars.slug);
      if (error) throw error;
    },
    onMutate: async (vars) => {
      await queryClient.cancelQueries({ queryKey: practiceKeys.learned });
      const previous = queryClient.getQueryData<Set<string>>(practiceKeys.learned);
      const next = new Set(previous ?? []);
      if (vars.learned) next.add(vars.slug);
      else next.delete(vars.slug);
      queryClient.setQueryData(practiceKeys.learned, next);
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(practiceKeys.learned, context.previous);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: practiceKeys.stats }),
  });
}

/* ------------------------------------------------------------------ *
 * Study plan
 * ------------------------------------------------------------------ */

export function usePlanChecks(day: string, enabled = true) {
  return useQuery({
    queryKey: practiceKeys.planChecks(day),
    enabled,
    queryFn: async (): Promise<Set<string>> => {
      const { data, error } = await supabase.from("study_plan_checks").select("task_key").eq("day", day);
      if (error) throw error;
      return new Set((data ?? []).map((r) => r.task_key as string));
    },
  });
}

export function useTogglePlanCheck(userId: string | undefined, day: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (vars: { taskKey: string; done: boolean }) => {
      if (!userId) throw new Error("not_signed_in");
      const { error } = vars.done
        ? await supabase.from("study_plan_checks").upsert({ user_id: userId, day, task_key: vars.taskKey })
        : await supabase.from("study_plan_checks").delete().eq("day", day).eq("task_key", vars.taskKey);
      if (error) throw error;
    },
    onMutate: async (vars) => {
      const key = practiceKeys.planChecks(day);
      const previous = queryClient.getQueryData<Set<string>>(key);
      const next = new Set(previous ?? []);
      if (vars.done) next.add(vars.taskKey);
      else next.delete(vars.taskKey);
      queryClient.setQueryData(key, next);
      return { previous };
    },
    onError: (_e, _v, context) => {
      if (context?.previous) queryClient.setQueryData(practiceKeys.planChecks(day), context.previous);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: practiceKeys.stats }),
  });
}

/* ------------------------------------------------------------------ *
 * Results extras: grading progress, explanations, transcripts
 * ------------------------------------------------------------------ */

export interface GradingJobRow {
  id: string;
  kind: "writing" | "speaking";
  part_number: number;
  status: "pending" | "running" | "done" | "failed";
  tries: number;
}

export function useGradingJobs(attemptId: string | undefined, poll: boolean) {
  return useQuery({
    queryKey: practiceKeys.jobs(attemptId ?? "none"),
    enabled: Boolean(attemptId),
    refetchInterval: poll ? 4000 : false,
    queryFn: async (): Promise<GradingJobRow[]> => {
      const { data, error } = await supabase
        .from("grading_jobs")
        .select("id, kind, part_number, status, tries")
        .eq("attempt_id", attemptId!)
        .order("kind")
        .order("part_number");
      if (error) throw error;
      return (data as GradingJobRow[]) ?? [];
    },
  });
}

export interface AttemptReviewV2Row {
  question_id: string;
  section: SectionCode;
  part_number: number;
  order_index: number;
  type_code: string;
  type_label: string;
  prompt: string;
  user_answer: string | null;
  accepted_answers: string[];
  is_correct: boolean | null;
  explanation: string | null;
  group_id: string;
}

export function useAttemptReviewV2(attemptId: string | undefined, enabled = true) {
  return useQuery({
    queryKey: practiceKeys.reviewV2(attemptId ?? "none"),
    enabled: Boolean(attemptId) && enabled,
    retry: false,
    queryFn: async (): Promise<AttemptReviewV2Row[]> => {
      const { data, error } = await supabase.rpc("get_attempt_review_v2", { p_attempt_id: attemptId! });
      if (error) throw error;
      return (data as AttemptReviewV2Row[]) ?? [];
    },
  });
}

export interface TranscriptRow {
  group_id: string;
  part_number: number;
  audio_url: string | null;
  transcript: string;
}

export function useAttemptTranscripts(attemptId: string | undefined, enabled = true) {
  return useQuery({
    queryKey: practiceKeys.transcripts(attemptId ?? "none"),
    enabled: Boolean(attemptId) && enabled,
    retry: false,
    queryFn: async (): Promise<TranscriptRow[]> => {
      const { data, error } = await supabase.rpc("get_attempt_transcripts", { p_attempt_id: attemptId! });
      if (error) throw error;
      return (data as TranscriptRow[]) ?? [];
    },
  });
}

/* ------------------------------------------------------------------ *
 * Admin
 * ------------------------------------------------------------------ */

export interface AdminAnalytics {
  totals: {
    students: number;
    premium: number;
    attempts_submitted: number;
    drills: number;
    essays: number;
    revenue: number;
    grading_failed: number;
    grading_pending: number;
  };
  band_distribution: Array<{ band: number; count: number }>;
  section_bands: Record<SectionCode, number | null> | null;
  weekly: Array<{ week: string; signups: number; attempts: number; drills: number }>;
  weakest_types: Array<{ label: string; section: string; total: number; accuracy: number }>;
  ai_usage: Array<{ function: string; calls: number }>;
}

export function useAdminAnalytics(days: number) {
  return useQuery({
    queryKey: practiceKeys.analytics(days),
    queryFn: async (): Promise<AdminAnalytics> => {
      const { data, error } = await supabase.rpc("admin_analytics", { p_days: days });
      if (error) throw error;
      return data as AdminAnalytics;
    },
  });
}

export function useClientErrors() {
  return useQuery({
    queryKey: practiceKeys.clientErrors,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("client_errors")
        .select("id, message, url, created_at")
        .order("created_at", { ascending: false })
        .limit(25);
      if (error) throw error;
      return data as Array<{ id: number; message: string; url: string | null; created_at: string }>;
    },
  });
}

/** Narrates one listening part from its stored script (admin only). */
export function useGenerateAudio() {
  return useMutation({
    mutationFn: (vars: { groupId: string; force?: boolean }) =>
      invokeFunction<{ audio_url: string; skipped?: boolean }>("generate-audio", {
        group_id: vars.groupId,
        force: vars.force ?? false,
      }),
  });
}

/** Admin read of a part's listening script, and its save. */
export function useGroupScript(groupId: string | undefined) {
  return useQuery({
    queryKey: ["group_script", groupId],
    enabled: Boolean(groupId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("item_group_scripts")
        .select("transcript")
        .eq("group_id", groupId!)
        .maybeSingle();
      if (error) throw error;
      return (data?.transcript as string | undefined) ?? "";
    },
  });
}

export function useSaveGroupScript() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (vars: { groupId: string; transcript: string }) => {
      const { error } = await supabase
        .from("item_group_scripts")
        .upsert({ group_id: vars.groupId, transcript: vars.transcript });
      if (error) throw error;
    },
    onSuccess: (_d, vars) => queryClient.invalidateQueries({ queryKey: ["group_script", vars.groupId] }),
  });
}

/* ------------------------------------------------------------------ *
 * Payments
 * ------------------------------------------------------------------ */

export function useCheckout() {
  return useMutation({
    mutationFn: async (plan: "month" | "quarter") => {
      const { url } = await invokeFunction<{ url: string }>("checkout", { plan });
      window.location.assign(url);
    },
  });
}
