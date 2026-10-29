/**
 * drill
 *
 * Question-type drills and the mistake notebook, graded on the server with
 * the same answer-check rules as a mock. Answers never reach the browser
 * before a verdict.
 *
 *   { action: "start", type_code, difficulty? }   -> one part's questions of that type
 *   { action: "submit", drill_id, answers }        -> verdicts, keys, explanations
 *   { action: "due", limit? }                      -> mistake cards due for review
 *   { action: "review", question_id, answer }      -> verdict; moves the Leitner box
 */
import { corsHeaders, json, preflight } from "../_shared/cors.ts";
import { getCaller, serviceClient } from "../_shared/supabase.ts";
import { isCorrect, storedAnswer, type MarkableQuestion } from "../_shared/check.ts";

/** Days until the next review for each Leitner box; box 6 means mastered. */
const BOX_DAYS = [0, 1, 3, 7, 14, 30];

const PUBLIC_QUESTION = "id, group_id, type_code, prompt, options, word_limit, order_index";
const KEYED_QUESTION =
  "id, group_id, prompt, accepted_answers, explanation, word_limit, spelling_policy, accepts_plural, case_sensitive, scoring_rules, question_types:ielts_question_types!inner ( renderer )";
const GROUP_FIELDS =
  "id, part_number, passage_text, audio_url, image_url, shared_instructions, metadata, test_sections:ielts_test_sections!inner ( section, test_forms:ielts_test_forms!inner ( id, title, is_published, is_premium, difficulty, purpose ) )";

// deno-lint-ignore no-explicit-any
type Row = any;

function markable(q: Row): MarkableQuestion {
  return { ...q, renderer: q.question_types.renderer };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return preflight();

  try {
    const user = await getCaller(req);
    if (!user) return json({ error: "unauthorized" }, 401);
    const db = serviceClient();
    const body = await req.json();

    // MoreIELTS is Premium-only (0013); admins count as Premium.
    const { data: premium } = await db.rpc("ielts_is_premium", { p_user: user.id });
    if (!premium) return json({ error: "premium_required" }, 403);

    /* ------------------------------------------------------------ start */
    if (body.action === "start") {
      const typeCode = String(body.type_code ?? "");
      const { data: learner } = await db
        .from("ielts_learners")
        .select("variant")
        .eq("user_id", user.id)
        .maybeSingle();
      const variant = body.all_variants ? null : (learner?.variant as string | null) ?? null;
      const { data: candidates, error } = await db
        .from("ielts_questions")
        .select(`group_id, item_groups:ielts_item_groups!inner ( ${GROUP_FIELDS} )`)
        .eq("type_code", typeCode);
      if (error) throw error;

      const groups = new Map<string, Row>();
      for (const c of (candidates ?? []) as Row[]) {
        const form = c.item_groups.test_sections.test_forms;
        if (!form.is_published) continue;
        // Drills draw on the skill-practice forms; mock exams stay unseen.
        if (form.purpose !== "practice") continue;
        if (form.is_premium && !premium) continue;
        if (body.difficulty && form.difficulty !== body.difficulty) continue;
        // A learner who has chosen Academic or General Training drills that
        // variant's forms; without a choice every variant is in the pool.
        if (variant && form.variant !== variant) continue;
        groups.set(c.group_id, c.item_groups);
      }
      if (groups.size === 0) {
        return json({ error: "no_content_for_type" }, 404);
      }

      // Prefer a part the learner has not drilled for this type yet.
      const { data: recent } = await db
        .from("ielts_drill_attempts")
        .select("group_id")
        .eq("user_id", user.id)
        .eq("type_code", typeCode)
        .order("started_at", { ascending: false })
        .limit(50);
      const seen = new Set((recent ?? []).map((r) => r.group_id));
      const fresh = [...groups.keys()].filter((id) => !seen.has(id));
      const pool = fresh.length ? fresh : [...groups.keys()];
      const groupId = pool[Math.floor(Math.random() * pool.length)];
      const group = groups.get(groupId)!;

      const { data: questions } = await db
        .from("ielts_questions")
        .select(PUBLIC_QUESTION)
        .eq("group_id", groupId)
        .eq("type_code", typeCode)
        .order("order_index");

      const { data: drill, error: drillError } = await db
        .from("ielts_drill_attempts")
        .insert({
          user_id: user.id,
          type_code: typeCode,
          group_id: groupId,
          question_ids: (questions ?? []).map((q) => q.id),
          total: questions?.length ?? 0,
        })
        .select("id")
        .single();
      if (drillError) throw drillError;

      return json({
        drill_id: drill.id,
        group: {
          id: group.id,
          part_number: group.part_number,
          section: group.test_sections.section,
          form_title: group.test_sections.test_forms.title,
          passage_text: group.passage_text,
          audio_url: group.audio_url,
          image_url: group.image_url,
          instructions: group.shared_instructions,
          image_caption: group.metadata?.image_caption ?? null,
        },
        questions,
      });
    }

    /* ----------------------------------------------------------- submit */
    if (body.action === "submit") {
      const { data: drill } = await db
        .from("ielts_drill_attempts")
        .select("id, user_id, group_id, question_ids, submitted_at")
        .eq("id", body.drill_id)
        .single();
      if (!drill || drill.user_id !== user.id) return json({ error: "drill_not_found" }, 404);
      if (drill.submitted_at) return json({ error: "already_submitted" }, 409);

      const answers = (body.answers ?? {}) as Record<string, unknown>;
      const { data: questions } = await db
        .from("ielts_questions")
        .select(KEYED_QUESTION)
        .in("id", drill.question_ids)
        .order("order_index");

      const review = ((questions ?? []) as Row[]).map((q) => ({
        question_id: q.id,
        prompt: q.prompt,
        answer: answers[q.id] ?? "",
        correct: isCorrect(markable(q), answers[q.id] ?? ""),
        accepted_answers: q.accepted_answers,
        explanation: q.explanation,
      }));
      const correct = review.filter((r) => r.correct).length;

      await db.from("ielts_drill_responses").insert(
        review.map((r) => ({
          drill_id: drill.id,
          question_id: r.question_id,
          answer: storedAnswer(r.answer),
          is_correct: r.correct,
        })),
      );
      await db
        .from("ielts_drill_attempts")
        .update({ correct, submitted_at: new Date().toISOString() })
        .eq("id", drill.id);

      const wrong = review.filter((r) => !r.correct);
      if (wrong.length) {
        await db.from("ielts_mistakes").upsert(
          wrong.map((r) => ({
            user_id: user.id,
            question_id: r.question_id,
            last_answer: storedAnswer(r.answer),
            box: 1,
            due_at: new Date(Date.now() + 86_400_000).toISOString(),
            source: "ielts-drill",
          })),
          { onConflict: "user_id,question_id" },
        );
      }

      // The script is released with the verdict, for the follow-along review.
      const { data: script } = await db
        .from("ielts_item_group_scripts")
        .select("transcript")
        .eq("group_id", drill.group_id)
        .maybeSingle();

      return json({ correct, total: review.length, review, transcript: script?.transcript ?? null });
    }

    /* -------------------------------------------------------------- due */
    if (body.action === "due") {
      const { data: cards } = await db
        .from("ielts_mistakes")
        .select("question_id, box, due_at, last_answer, times_wrong, times_right")
        .eq("user_id", user.id)
        .lt("box", 6)
        .lte("due_at", new Date().toISOString())
        .order("due_at")
        .limit(Math.min(Number(body.limit ?? 20), 50));
      const ids = (cards ?? []).map((c) => c.question_id);
      if (!ids.length) return json({ cards: [] });

      const { data: questions } = await db
        .from("ielts_questions")
        .select(`${PUBLIC_QUESTION}, question_types:ielts_question_types!inner ( renderer, label ), item_groups:ielts_item_groups!inner ( ${GROUP_FIELDS} )`)
        .in("id", ids);
      const byId = new Map(((questions ?? []) as Row[]).map((q) => [q.id, q]));

      return json({
        cards: (cards ?? [])
          .filter((c) => byId.has(c.question_id))
          .map((c) => {
            const q = byId.get(c.question_id);
            const g = q.item_groups;
            return {
              ...c,
              question: {
                id: q.id,
                type_code: q.type_code,
                type_label: q.question_types.label,
                renderer: q.question_types.renderer,
                prompt: q.prompt,
                options: q.options,
                word_limit: q.word_limit,
              },
              group: {
                section: g.test_sections.section,
                passage_text: g.passage_text,
                audio_url: g.audio_url,
                image_url: g.image_url,
                instructions: g.shared_instructions,
              },
            };
          }),
      });
    }

    /* ----------------------------------------------------------- review */
    if (body.action === "review") {
      const { data: card } = await db
        .from("ielts_mistakes")
        .select("box, times_right, times_wrong")
        .eq("user_id", user.id)
        .eq("question_id", body.question_id)
        .maybeSingle();
      if (!card) return json({ error: "card_not_found" }, 404);

      const { data: q } = await db.from("ielts_questions").select(KEYED_QUESTION).eq("id", body.question_id).single();
      if (!q) return json({ error: "question_not_found" }, 404);
      const correct = isCorrect(markable(q), body.answer ?? "");
      const box = correct ? Math.min(6, card.box + 1) : 1;
      const days = BOX_DAYS[Math.min(box, 5)];

      await db
        .from("ielts_mistakes")
        .update({
          box,
          due_at: new Date(Date.now() + days * 86_400_000).toISOString(),
          last_answer: storedAnswer(body.answer),
          times_right: card.times_right + (correct ? 1 : 0),
          times_wrong: card.times_wrong + (correct ? 0 : 1),
        })
        .eq("user_id", user.id)
        .eq("question_id", body.question_id);

      await db.from("ielts_activity_log").insert({ user_id: user.id, kind: "review", minutes: 1 });

      return json({
        correct,
        box,
        mastered: box >= 6,
        next_in_days: box >= 6 ? null : days,
        accepted_answers: q.accepted_answers,
        explanation: q.explanation,
      });
    }

    return json({ error: "unknown_action" }, 400);
  } catch (error) {
    console.error("ielts-drill failed", error);
    return new Response(
      JSON.stringify({ error: String((error as Error).message ?? error) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
