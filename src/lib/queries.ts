import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { supabase, invokeFunction } from "./supabase";
import type {
  AttemptReviewRow,
  AttemptRow,
  AttemptScoreRow,
  AttemptStateRow,
  ItemGroupRow,
  ProfileRow,
  QuestionPublicRow,
  QuestionTypeRow,
  SectionCode,
  SpeakingScoreRow,
  TestFormRow,
  TestSectionRow,
  WritingScoreRow,
} from "~/types/database";

/**
 * Every read the app performs. Nothing here reaches accepted_answers: the
 * player reads questions_public, and answers arrive only through
 * get_attempt_review() once an attempt is submitted.
 */

export const queryKeys = {
  questionTypes: ["question_types"] as const,
  forms: ["test_forms"] as const,
  form: (id: string) => ["test_form", id] as const,
  formContent: (formId: string, section: SectionCode) =>
    ["form_content", formId, section] as const,
  adminForm: (id: string) => ["admin_form", id] as const,
  attempts: (userId: string | undefined) => ["attempts", userId] as const,
  attemptState: (id: string) => ["attempt_state", id] as const,
  attemptResponses: (id: string) => ["attempt_responses", id] as const,
  result: (id: string) => ["attempt_result", id] as const,
  review: (id: string) => ["attempt_review", id] as const,
  students: ["admin_students"] as const,
  codes: ["admin_codes"] as const,
};

/* ------------------------------------------------------------------ *
 * Reference data
 * ------------------------------------------------------------------ */

export function useQuestionTypes() {
  return useQuery({
    queryKey: queryKeys.questionTypes,
    // Reference data changes about once a release.
    staleTime: 60 * 60 * 1000,
    queryFn: async (): Promise<QuestionTypeRow[]> => {
      const { data, error } = await supabase
        .from("question_types")
        .select("*")
        .eq("is_active", true)
        .order("code");
      if (error) throw error;
      return data as unknown as QuestionTypeRow[];
    },
  });
}

/* ------------------------------------------------------------------ *
 * Forms and content
 * ------------------------------------------------------------------ */

export function useForms(options?: Partial<UseQueryOptions<TestFormRow[]>>) {
  return useQuery({
    queryKey: queryKeys.forms,
    queryFn: async (): Promise<TestFormRow[]> => {
      const { data, error } = await supabase
        .from("test_forms")
        .select("*")
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return data as unknown as TestFormRow[];
    },
    ...options,
  });
}

export interface SectionContent {
  section: TestSectionRow;
  groups: Array<ItemGroupRow & { questions: QuestionPublicRow[] }>;
}

/**
 * One section of a form, assembled for the players: section metadata, its item
 * groups in order, and each group's questions from the candidate-safe view.
 */
export function useSectionContent(
  formId: string | undefined,
  section: SectionCode,
) {
  return useQuery({
    queryKey: queryKeys.formContent(formId ?? "none", section),
    enabled: Boolean(formId),
    staleTime: 5 * 60 * 1000,
    queryFn: async (): Promise<SectionContent | null> => {
      const { data: sectionRow, error: sectionError } = await supabase
        .from("test_sections")
        .select("*")
        .eq("form_id", formId!)
        .eq("section", section)
        .maybeSingle();
      if (sectionError) throw sectionError;
      if (!sectionRow) return null;

      const { data: groups, error: groupsError } = await supabase
        .from("item_groups")
        .select("*")
        .eq("section_id", (sectionRow as unknown as TestSectionRow).id)
        .order("order_index");
      if (groupsError) throw groupsError;

      const groupIds = (groups as unknown as ItemGroupRow[]).map((g) => g.id);
      const { data: questions, error: questionsError } = await supabase
        .from("questions_public")
        .select("*")
        .in("group_id", groupIds.length ? groupIds : ["00000000-0000-0000-0000-000000000000"])
        .order("order_index");
      if (questionsError) throw questionsError;

      const byGroup = new Map<string, QuestionPublicRow[]>();
      for (const q of questions as unknown as QuestionPublicRow[]) {
        const list = byGroup.get(q.group_id) ?? [];
        list.push(q);
        byGroup.set(q.group_id, list);
      }

      return {
        section: sectionRow as unknown as TestSectionRow,
        groups: (groups as unknown as ItemGroupRow[]).map((g) => ({
          ...g,
          questions: byGroup.get(g.id) ?? [],
        })),
      };
    },
  });
}

/** The default published form a player uses when no form id is supplied. */
export function useDefaultForm(variant: "academic" | "general_training" = "academic") {
  return useQuery({
    queryKey: ["default_form", variant],
    staleTime: 5 * 60 * 1000,
    queryFn: async (): Promise<TestFormRow | null> => {
      const { data, error } = await supabase
        .from("test_forms")
        .select("*")
        .eq("is_published", true)
        .eq("variant", variant)
        .order("created_at")
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return (data as unknown as TestFormRow) ?? null;
    },
  });
}

/* ------------------------------------------------------------------ *
 * Attempts
 * ------------------------------------------------------------------ */

export function useAttempts(userId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.attempts(userId),
    enabled: Boolean(userId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("attempts")
        .select("*, test_forms ( title, variant ), attempt_scores ( overall_band )")
        .order("started_at", { ascending: false })
        .limit(25);
      if (error) throw error;
      return data as unknown as Array<
        AttemptRow & {
          test_forms: { title: string; variant: string } | null;
          attempt_scores: { overall_band: number | null } | null;
        }
      >;
    },
  });
}

/**
 * The authoritative attempt state, including remaining_seconds computed from
 * the database clock. This is the ONLY source of remaining time — the player's
 * countdown is seeded from here on every mount and resynced by the heartbeat.
 */
export function useAttemptState(attemptId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.attemptState(attemptId ?? "none"),
    enabled: Boolean(attemptId),
    // Never served stale: a cached deadline would defeat the point.
    staleTime: 0,
    gcTime: 0,
    queryFn: async (): Promise<AttemptStateRow | null> => {
      const { data, error } = await supabase.rpc("get_attempt_state", {
        p_attempt_id: attemptId!,
      });
      if (error) throw error;
      const rows = data as unknown as AttemptStateRow[];
      return rows?.[0] ?? null;
    },
  });
}

export function useStartAttempt() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formId: string): Promise<string> => {
      const { data, error } = await supabase.rpc("start_attempt", {
        p_form_id: formId,
      });
      if (error) throw error;
      return data as unknown as string;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attempts"] });
    },
  });
}

export function useStartSection() {
  return useMutation({
    mutationFn: async (vars: { attemptId: string; section: SectionCode }) => {
      const { data, error } = await supabase.rpc("start_section", {
        p_attempt_id: vars.attemptId,
        p_section: vars.section,
      });
      if (error) throw error;
      return (data as unknown as Array<{ remaining_seconds: number }>)[0];
    },
  });
}

/** Saves one answer. The server rejects anything after the deadline. */
export function useSaveResponse() {
  return useMutation({
    mutationFn: async (vars: {
      attemptId: string;
      questionId: string;
      answer: string;
      timeSpentMs?: number;
      audioUrl?: string;
    }) => {
      const { data, error } = await supabase.rpc("save_response", {
        p_attempt_id: vars.attemptId,
        p_question_id: vars.questionId,
        p_answer: vars.answer,
        p_time_spent_ms: vars.timeSpentMs ?? null,
        p_audio_url: vars.audioUrl ?? null,
      });
      if (error) throw error;
      return (data as unknown as Array<{ remaining_seconds: number }>)[0];
    },
  });
}

export function useHeartbeat() {
  return useMutation({
    mutationFn: async (vars: { attemptId: string; position?: number }) => {
      const { data, error } = await supabase.rpc("heartbeat", {
        p_attempt_id: vars.attemptId,
        p_current_position: vars.position ?? null,
      });
      if (error) throw error;
      return (data as unknown as Array<{ remaining_seconds: number; status: string }>)[0];
    },
  });
}

/** Existing answers, so a refreshed player restores what was already saved. */
export function useAttemptResponses(attemptId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.attemptResponses(attemptId ?? "none"),
    enabled: Boolean(attemptId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("responses")
        .select("question_id, answer, audio_url")
        .eq("attempt_id", attemptId!);
      if (error) throw error;
      return data as unknown as Array<{
        question_id: string;
        answer: string | null;
        audio_url: string | null;
      }>;
    },
  });
}

export function useSubmitAttempt() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (vars: { attemptId: string; section?: SectionCode }) =>
      invokeFunction<{ status: string }>("submit-attempt", {
        attempt_id: vars.attemptId,
        section: vars.section,
      }),
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.result(vars.attemptId) });
      queryClient.invalidateQueries({ queryKey: ["attempts"] });
    },
  });
}

/* ------------------------------------------------------------------ *
 * Results
 * ------------------------------------------------------------------ */

export interface AttemptResultData {
  attempt: AttemptRow & { test_forms: TestFormRow | null };
  scores: AttemptScoreRow | null;
  writing: WritingScoreRow[];
  speaking: SpeakingScoreRow[];
}

export function useAttemptResult(attemptId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.result(attemptId ?? "none"),
    enabled: Boolean(attemptId),
    queryFn: async (): Promise<AttemptResultData | null> => {
      const { data: attempt, error } = await supabase
        .from("attempts")
        .select("*, test_forms ( * )")
        .eq("id", attemptId!)
        .maybeSingle();
      if (error) throw error;
      if (!attempt) return null;

      const [scores, writing, speaking] = await Promise.all([
        supabase.from("attempt_scores").select("*").eq("attempt_id", attemptId!).maybeSingle(),
        supabase.from("writing_scores").select("*").eq("attempt_id", attemptId!).order("task_number"),
        supabase.from("speaking_scores").select("*").eq("attempt_id", attemptId!).order("part_number"),
      ]);

      return {
        attempt: attempt as unknown as AttemptResultData["attempt"],
        scores: (scores.data as unknown as AttemptScoreRow) ?? null,
        writing: (writing.data as unknown as WritingScoreRow[]) ?? [],
        speaking: (speaking.data as unknown as SpeakingScoreRow[]) ?? [],
      };
    },
  });
}

/** Answer review. The RPC refuses to return answers before submission. */
export function useAttemptReview(attemptId: string | undefined, enabled = true) {
  return useQuery({
    queryKey: queryKeys.review(attemptId ?? "none"),
    enabled: Boolean(attemptId) && enabled,
    retry: false,
    queryFn: async (): Promise<AttemptReviewRow[]> => {
      const { data, error } = await supabase.rpc("get_attempt_review", {
        p_attempt_id: attemptId!,
      });
      if (error) throw error;
      return (data as unknown as AttemptReviewRow[]) ?? [];
    },
  });
}

/* ------------------------------------------------------------------ *
 * Admin
 * ------------------------------------------------------------------ */

export interface AdminFormContent {
  form: TestFormRow;
  sections: Array<
    TestSectionRow & {
      groups: Array<ItemGroupRow & { questions: AdminQuestion[] }>;
    }
  >;
}

export interface AdminQuestion {
  id: string;
  group_id: string;
  type_code: string;
  prompt: string;
  options: Array<{ value: string; label: string }>;
  accepted_answers: string[];
  word_limit: number;
  spelling_policy: "strict" | "lenient";
  accepts_plural: boolean;
  case_sensitive: boolean;
  scoring_rules: Record<string, unknown>;
  order_index: number;
}

/** Admins read the base questions table, answers included. */
export function useAdminForm(formId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.adminForm(formId ?? "none"),
    enabled: Boolean(formId),
    queryFn: async (): Promise<AdminFormContent | null> => {
      const { data: form, error } = await supabase
        .from("test_forms")
        .select("*")
        .eq("id", formId!)
        .maybeSingle();
      if (error) throw error;
      if (!form) return null;

      const { data: sections } = await supabase
        .from("test_sections")
        .select("*")
        .eq("form_id", formId!)
        .order("order_index");

      const sectionRows = (sections as unknown as TestSectionRow[]) ?? [];
      const { data: groups } = await supabase
        .from("item_groups")
        .select("*")
        .in("section_id", sectionRows.length ? sectionRows.map((s) => s.id) : ["00000000-0000-0000-0000-000000000000"])
        .order("order_index");

      const groupRows = (groups as unknown as ItemGroupRow[]) ?? [];
      const { data: questions } = await supabase
        .from("questions")
        .select("*")
        .in("group_id", groupRows.length ? groupRows.map((g) => g.id) : ["00000000-0000-0000-0000-000000000000"])
        .order("order_index");

      const questionRows = (questions as unknown as AdminQuestion[]) ?? [];
      const byGroup = new Map<string, AdminQuestion[]>();
      for (const q of questionRows) {
        const list = byGroup.get(q.group_id) ?? [];
        list.push(q);
        byGroup.set(q.group_id, list);
      }

      return {
        form: form as unknown as TestFormRow,
        sections: sectionRows.map((s) => ({
          ...s,
          groups: groupRows
            .filter((g) => g.section_id === s.id)
            .map((g) => ({ ...g, questions: byGroup.get(g.id) ?? [] })),
        })),
      };
    },
  });
}

/** Persists a builder edit. RLS rejects the write unless the caller is admin. */
export function useSaveForm() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (content: AdminFormContent) => {
      const { form, sections } = content;

      const { error: formError } = await supabase
        .from("test_forms")
        .update({
          title: form.title,
          description: form.description,
          variant: form.variant,
          is_published: form.is_published,
          is_premium: form.is_premium,
        })
        .eq("id", form.id);
      if (formError) throw formError;

      for (const section of sections) {
        const { error: sectionError } = await supabase
          .from("test_sections")
          .update({
            time_limit_seconds: section.time_limit_seconds,
            instructions: section.instructions,
            question_count: section.groups.reduce((n, g) => n + g.questions.length, 0),
            order_index: section.order_index,
          })
          .eq("id", section.id);
        if (sectionError) throw sectionError;

        for (const [groupIndex, group] of section.groups.entries()) {
          const { error: groupError } = await supabase
            .from("item_groups")
            .upsert({
              id: group.id,
              section_id: section.id,
              part_number: group.part_number,
              passage_text: group.passage_text,
              audio_url: group.audio_url,
              image_url: group.image_url,
              shared_instructions: group.shared_instructions,
              metadata: group.metadata ?? {},
              order_index: groupIndex,
            });
          if (groupError) throw groupError;

          for (const [questionIndex, question] of group.questions.entries()) {
            const { error: questionError } = await supabase
              .from("questions")
              .upsert({
                id: question.id,
                group_id: group.id,
                type_code: question.type_code,
                prompt: question.prompt,
                options: question.options ?? [],
                accepted_answers: question.accepted_answers ?? [],
                word_limit: question.word_limit ?? 0,
                spelling_policy: question.spelling_policy ?? "lenient",
                accepts_plural: question.accepts_plural ?? true,
                case_sensitive: question.case_sensitive ?? false,
                scoring_rules: question.scoring_rules ?? {},
                order_index: questionIndex,
              });
            if (questionError) throw questionError;
          }
        }
      }
    },
    onSuccess: (_data, content) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.adminForm(content.form.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.forms });
    },
  });
}

export function useDeleteQuestion() {
  return useMutation({
    mutationFn: async (questionId: string) => {
      const { error } = await supabase.from("questions").delete().eq("id", questionId);
      if (error) throw error;
    },
  });
}

export function useDeleteGroup() {
  return useMutation({
    mutationFn: async (groupId: string) => {
      const { error } = await supabase.from("item_groups").delete().eq("id", groupId);
      if (error) throw error;
    },
  });
}

export function useCreateForm() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (vars: { title: string; variant: "academic" | "general_training" }) => {
      const { data, error } = await supabase
        .from("test_forms")
        .insert({ title: vars.title, variant: vars.variant })
        .select("id")
        .single();
      if (error) throw error;
      return (data as unknown as { id: string }).id;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.forms }),
  });
}

export function useStudents() {
  return useQuery({
    queryKey: queryKeys.students,
    queryFn: async (): Promise<ProfileRow[]> => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return data as unknown as ProfileRow[];
    },
  });
}

export function useRedemptionCodes() {
  return useQuery({
    queryKey: queryKeys.codes,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("redemption_codes")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return data as unknown as Array<{
        code: string;
        type: string;
        duration_days: number | null;
        used_by: string | null;
        expires_at: string | null;
      }>;
    },
  });
}

export function useRedeemCode() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (code: string) => {
      const { data, error } = await supabase.rpc("redeem_code", { p_code: code });
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["profile"] }),
  });
}

/** Requests a presigned R2 URL and performs the upload. */
export async function uploadToR2(
  file: File,
  kind: "item_audio" | "item_image" | "response_audio",
  extra: Record<string, unknown> = {},
): Promise<string> {
  const signed = await invokeFunction<{
    upload_url: string;
    public_url: string;
    required_headers: Record<string, string>;
  }>("upload-url", {
    kind,
    content_type: file.type,
    file_size: file.size,
    ...extra,
  });

  const response = await fetch(signed.upload_url, {
    method: "PUT",
    headers: signed.required_headers,
    body: file,
  });
  if (!response.ok) {
    throw new Error(`R2 upload failed with ${response.status}`);
  }
  return signed.public_url;
}
