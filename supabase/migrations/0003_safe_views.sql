-- 0003_safe_views.sql
-- Candidate-facing projections of the content tables.
--
-- The rule these views exist to enforce: accepted_answers and scoring_rules
-- must never reach a candidate's browser while an attempt is in progress. The
-- questions table is admin-only under RLS (0002), and candidates read this view
-- instead, which simply does not project the answer columns. There is no
-- client-side filtering anywhere in the stack.

create or replace view public.questions_public
with (security_invoker = off) as
  select
    q.id,
    q.group_id,
    q.type_code,
    q.prompt,
    q.options,
    q.word_limit,
    q.spelling_policy,
    q.accepts_plural,
    q.case_sensitive,
    q.order_index,
    -- Registry metadata the players need to pick a renderer.
    t.renderer,
    t.label as type_label,
    t.section
  from public.questions q
  join public.question_types t on t.code = q.type_code
  join public.item_groups g on g.id = q.group_id
  join public.test_sections s on s.id = g.section_id
  join public.test_forms f on f.id = s.form_id
  where f.is_published;

comment on view public.questions_public is
  'Candidate-safe question projection. Excludes accepted_answers and '
  'scoring_rules by construction, and exposes published forms only.';

revoke all on public.questions_public from anon;
grant select on public.questions_public to authenticated;

-- ---------------------------------------------------------------------------
-- Answer review, available only once an attempt is finished
-- ---------------------------------------------------------------------------

create or replace function public.get_attempt_review(p_attempt_id uuid)
returns table (
  question_id uuid,
  section text,
  part_number int,
  order_index int,
  type_code text,
  type_label text,
  prompt text,
  user_answer text,
  accepted_answers text[],
  is_correct boolean
)
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_attempt public.attempts%rowtype;
begin
  select * into v_attempt from public.attempts where id = p_attempt_id;
  if not found then
    raise exception 'attempt_not_found';
  end if;

  if v_attempt.user_id <> auth.uid() and not public.is_admin() then
    raise exception 'forbidden';
  end if;

  -- The whole point of this function: answers are released only after the
  -- attempt has been submitted.
  if v_attempt.status <> 'completed' and not public.is_admin() then
    raise exception 'attempt_not_submitted';
  end if;

  return query
    select
      q.id,
      s.section,
      g.part_number,
      q.order_index,
      q.type_code,
      t.label,
      q.prompt,
      r.answer,
      q.accepted_answers,
      r.is_correct
    from public.questions q
    join public.question_types t on t.code = q.type_code
    join public.item_groups g on g.id = q.group_id
    join public.test_sections s on s.id = g.section_id
    left join public.responses r
      on r.question_id = q.id and r.attempt_id = p_attempt_id
    where s.form_id = v_attempt.form_id
    order by s.order_index, g.order_index, q.order_index;
end;
$$;

revoke all on function public.get_attempt_review(uuid) from public, anon;
grant execute on function public.get_attempt_review(uuid) to authenticated;
