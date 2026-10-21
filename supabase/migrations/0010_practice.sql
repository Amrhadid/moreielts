-- 0010_practice.sql
-- Everything a learner does outside a full mock: question-type drills, the
-- spaced-repetition mistake notebook, the writing lab, topic vocabulary, the
-- study plan checklist, and the activity log that streaks are computed from.
-- Additive only.

-- ---------------------------------------------------------------------------
-- Drills. Created and graded by the drill Edge Function (service role), which
-- reuses the same answer-check module as submit-attempt.
-- ---------------------------------------------------------------------------

create table if not exists public.ielts_drill_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  type_code text not null references public.ielts_question_types (code),
  group_id uuid not null references public.ielts_item_groups (id) on delete cascade,
  question_ids uuid[] not null,
  correct int,
  total int not null,
  started_at timestamptz not null default now(),
  submitted_at timestamptz
);

create index if not exists ielts_drill_attempts_user_idx
  on public.ielts_drill_attempts (user_id, started_at desc);

create table if not exists public.ielts_drill_responses (
  drill_id uuid not null references public.ielts_drill_attempts (id) on delete cascade,
  question_id uuid not null references public.ielts_questions (id) on delete cascade,
  answer text,
  is_correct boolean not null,
  primary key (drill_id, question_id)
);

alter table public.ielts_drill_attempts enable row level security;
alter table public.ielts_drill_responses enable row level security;

drop policy if exists drill_attempts_select_own on public.ielts_drill_attempts;
create policy drill_attempts_select_own on public.ielts_drill_attempts
  for select to authenticated
  using (user_id = auth.uid() or public.is_admin());

drop policy if exists drill_responses_select_own on public.ielts_drill_responses;
create policy drill_responses_select_own on public.ielts_drill_responses
  for select to authenticated
  using (
    public.is_admin()
    or exists (select 1 from public.ielts_drill_attempts d
               where d.id = ielts_drill_responses.drill_id and d.user_id = auth.uid())
  );

-- ---------------------------------------------------------------------------
-- Mistake notebook: a Leitner box per (learner, question).
-- Box 1 is due tomorrow; each right answer moves it up a box (3, 7, 14, 30
-- days); a wrong answer sends it back to box 1. Past box 5 it is mastered.
-- Rows are written by the service role (drill, submit-attempt).
-- ---------------------------------------------------------------------------

create table if not exists public.ielts_mistakes (
  user_id uuid not null references auth.users (id) on delete cascade,
  question_id uuid not null references public.ielts_questions (id) on delete cascade,
  box int not null default 1 check (box between 1 and 6),
  due_at timestamptz not null default now() + interval '1 day',
  last_answer text,
  times_wrong int not null default 1,
  times_right int not null default 0,
  source text not null default 'drill' check (source in ('drill', 'mock')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, question_id)
);

create index if not exists ielts_mistakes_due_idx
  on public.ielts_mistakes (user_id, due_at) where box < 6;

drop trigger if exists mistakes_set_updated_at on public.ielts_mistakes;
create trigger mistakes_set_updated_at
  before update on public.ielts_mistakes
  for each row execute function public.ielts_set_updated_at();

alter table public.ielts_mistakes enable row level security;

drop policy if exists mistakes_select_own on public.ielts_mistakes;
create policy mistakes_select_own on public.ielts_mistakes
  for select to authenticated
  using (user_id = auth.uid() or public.is_admin());

-- A learner may drop a card from their own notebook.
drop policy if exists mistakes_delete_own on public.ielts_mistakes;
create policy mistakes_delete_own on public.ielts_mistakes
  for delete to authenticated
  using (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- Writing lab: standalone essays outside a mock, graded in the background
-- (grading_jobs kind = 'essay'). parent_id links a rewrite to the draft it
-- improves, so the page can show the band moving across drafts.
-- ---------------------------------------------------------------------------

create table if not exists public.ielts_writing_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  task_number int not null check (task_number in (1, 2)),
  -- The prompt is either a writing task from a published form or free text.
  group_id uuid references public.ielts_item_groups (id) on delete set null,
  prompt text not null,
  body text not null check (char_length(body) between 1 and 20000),
  parent_id uuid references public.ielts_writing_submissions (id) on delete set null,
  status text not null default 'pending' check (status in ('pending', 'graded', 'failed')),
  task_achievement numeric(2, 1),
  coherence_cohesion numeric(2, 1),
  lexical_resource numeric(2, 1),
  grammatical_range numeric(2, 1),
  task_band numeric(2, 1),
  feedback jsonb not null default '{}'::jsonb,
  model_version text,
  created_at timestamptz not null default now(),
  graded_at timestamptz
);

create index if not exists ielts_writing_submissions_user_idx
  on public.ielts_writing_submissions (user_id, created_at desc);

alter table public.ielts_writing_submissions enable row level security;

drop policy if exists writing_submissions_select_own on public.ielts_writing_submissions;
create policy writing_submissions_select_own on public.ielts_writing_submissions
  for select to authenticated
  using (user_id = auth.uid() or public.is_admin());

-- Submitting goes through this RPC so the grading job is queued in the same
-- transaction and the score columns can never be written by the learner.
-- Free learners get 3 graded essays a week; Premium 20 a day.
create or replace function public.ielts_submit_essay(
  p_task_number int,
  p_prompt text,
  p_body text,
  p_group_id uuid default null,
  p_parent_id uuid default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
  v_recent int;
begin
  if auth.uid() is null then
    raise exception 'not_authenticated';
  end if;
  if p_task_number not in (1, 2) then
    raise exception 'invalid_task_number';
  end if;
  if coalesce(btrim(p_body), '') = '' or coalesce(btrim(p_prompt), '') = '' then
    raise exception 'empty_essay';
  end if;
  if p_parent_id is not null and not exists (
    select 1 from public.ielts_writing_submissions where id = p_parent_id and user_id = auth.uid()
  ) then
    raise exception 'forbidden';
  end if;

  if public.ielts_is_premium() then
    select count(*) into v_recent from public.ielts_writing_submissions
    where user_id = auth.uid() and created_at > now() - interval '1 day';
    if v_recent >= 20 then raise exception 'essay_limit_reached'; end if;
  else
    select count(*) into v_recent from public.ielts_writing_submissions
    where user_id = auth.uid() and created_at > now() - interval '7 days';
    if v_recent >= 3 then raise exception 'essay_limit_reached_free'; end if;
  end if;

  insert into public.ielts_writing_submissions (user_id, task_number, group_id, prompt, body, parent_id)
  values (auth.uid(), p_task_number, p_group_id, btrim(p_prompt), btrim(p_body), p_parent_id)
  returning id into v_id;

  insert into public.ielts_grading_jobs (kind, submission_id, user_id)
  values ('essay', v_id, auth.uid());

  return v_id;
end;
$$;

revoke all on function public.ielts_submit_essay(int, text, text, uuid, uuid) from public, anon;
grant execute on function public.ielts_submit_essay(int, text, text, uuid, uuid) to authenticated;

-- Writing prompts a learner can pick in the lab: every writing task of a
-- published form they can open.
create or replace function public.ielts_list_writing_prompts()
returns table (group_id uuid, form_title text, variant text, task_number int,
               prompt text, image_url text, is_premium boolean)
language sql
stable
security definer
set search_path = public
as $$
  select g.id, f.title, f.variant, g.part_number, g.passage_text, g.image_url, f.is_premium
  from public.ielts_item_groups g
  join public.ielts_test_sections s on s.id = g.section_id and s.section = 'writing'
  join public.ielts_test_forms f on f.id = s.form_id and f.is_published
  where g.passage_text is not null
  order by f.created_at, g.part_number;
$$;

revoke all on function public.ielts_list_writing_prompts() from public, anon;
grant execute on function public.ielts_list_writing_prompts() to authenticated;

-- ---------------------------------------------------------------------------
-- Vocabulary: the word list ships in the app bundle (src/data/vocabulary.json);
-- only the learner's "I know this" marks live here. The row existing IS the
-- learned state, so unmarking is a delete.
-- ---------------------------------------------------------------------------

create table if not exists public.ielts_vocab_learned (
  user_id uuid not null references auth.users (id) on delete cascade,
  word_slug text not null check (word_slug ~ '^[a-z0-9-]{1,80}$'),
  learned_at timestamptz not null default now(),
  primary key (user_id, word_slug)
);

alter table public.ielts_vocab_learned enable row level security;

drop policy if exists vocab_learned_own on public.ielts_vocab_learned;
create policy vocab_learned_own on public.ielts_vocab_learned
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- Study plan: the plan itself is computed in the app from the profile and
-- recent results (src/lib/study-plan.ts); this table only remembers which of
-- a day's tasks were ticked off.
-- ---------------------------------------------------------------------------

create table if not exists public.ielts_study_plan_checks (
  user_id uuid not null references auth.users (id) on delete cascade,
  day date not null,
  task_key text not null check (char_length(task_key) <= 120),
  checked_at timestamptz not null default now(),
  primary key (user_id, day, task_key)
);

alter table public.ielts_study_plan_checks enable row level security;

drop policy if exists study_plan_checks_own on public.ielts_study_plan_checks;
create policy study_plan_checks_own on public.ielts_study_plan_checks
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid() and day between current_date - 1 and current_date + 1);

-- ---------------------------------------------------------------------------
-- Activity log and streaks. Rows are written by triggers, never by the
-- client, so a streak cannot be faked from the browser.
-- ---------------------------------------------------------------------------

create table if not exists public.ielts_activity_log (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  kind text not null check (kind in ('mock', 'drill', 'review', 'essay', 'vocab', 'plan')),
  minutes numeric(5, 1) not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists ielts_activity_log_user_idx
  on public.ielts_activity_log (user_id, created_at desc);

alter table public.ielts_activity_log enable row level security;

drop policy if exists activity_log_select_own on public.ielts_activity_log;
create policy activity_log_select_own on public.ielts_activity_log
  for select to authenticated
  using (user_id = auth.uid() or public.is_admin());

create or replace function public.ielts_log_activity()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_table_name = 'ielts_drill_attempts' then
    -- Logged on submission: about 1.5 minutes a question.
    if new.submitted_at is not null and (tg_op = 'INSERT' or old.submitted_at is null) then
      insert into public.ielts_activity_log (user_id, kind, minutes)
      values (new.user_id, 'drill', least(60, new.total * 1.5));
    end if;
  elsif tg_table_name = 'ielts_attempts' then
    if new.submitted_at is not null and old.submitted_at is null then
      insert into public.ielts_activity_log (user_id, kind, minutes)
      values (new.user_id, 'mock',
              least(240, extract(epoch from (new.submitted_at - new.started_at)) / 60));
    end if;
  elsif tg_table_name = 'ielts_writing_submissions' then
    insert into public.ielts_activity_log (user_id, kind, minutes)
    values (new.user_id, 'essay', case when new.task_number = 1 then 20 else 40 end);
  elsif tg_table_name = 'ielts_vocab_learned' then
    insert into public.ielts_activity_log (user_id, kind, minutes) values (new.user_id, 'vocab', 0.5);
  elsif tg_table_name = 'ielts_study_plan_checks' then
    insert into public.ielts_activity_log (user_id, kind, minutes) values (new.user_id, 'plan', 0);
  end if;
  return new;
end;
$$;

drop trigger if exists drill_attempts_log on public.ielts_drill_attempts;
create trigger drill_attempts_log after insert or update of submitted_at on public.ielts_drill_attempts
  for each row execute function public.ielts_log_activity();
drop trigger if exists attempts_log on public.ielts_attempts;
create trigger attempts_log after update of submitted_at on public.ielts_attempts
  for each row execute function public.ielts_log_activity();
drop trigger if exists writing_submissions_log on public.ielts_writing_submissions;
create trigger writing_submissions_log after insert on public.ielts_writing_submissions
  for each row execute function public.ielts_log_activity();
drop trigger if exists vocab_learned_log on public.ielts_vocab_learned;
create trigger vocab_learned_log after insert on public.ielts_vocab_learned
  for each row execute function public.ielts_log_activity();
drop trigger if exists study_plan_checks_log on public.ielts_study_plan_checks;
create trigger study_plan_checks_log after insert on public.ielts_study_plan_checks
  for each row execute function public.ielts_log_activity();

-- Streak, today's minutes and the last 14 days, in the learner's time zone.
create or replace function public.ielts_get_learning_stats(p_tz text default 'UTC')
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_today date := (now() at time zone p_tz)::date;
  v_streak int := 0;
  v_day date;
  v_result jsonb;
begin
  if auth.uid() is null then
    raise exception 'not_authenticated';
  end if;

  -- Count back from today (or yesterday, so a streak is not "lost" before
  -- the learner has had a chance to study today).
  v_day := v_today;
  if not exists (select 1 from public.ielts_activity_log
                 where user_id = auth.uid()
                   and (created_at at time zone p_tz)::date = v_today) then
    v_day := v_today - 1;
  end if;
  while exists (select 1 from public.ielts_activity_log
                where user_id = auth.uid()
                  and (created_at at time zone p_tz)::date = v_day) loop
    v_streak := v_streak + 1;
    v_day := v_day - 1;
  end loop;

  select jsonb_build_object(
    'streak', v_streak,
    'today_minutes', coalesce((
      select round(sum(minutes)) from public.ielts_activity_log
      where user_id = auth.uid() and (created_at at time zone p_tz)::date = v_today), 0),
    'days', coalesce((
      select jsonb_agg(jsonb_build_object('day', d::date, 'minutes', coalesce(m, 0)) order by d)
      from generate_series(v_today - 13, v_today, interval '1 day') d
      left join lateral (
        select round(sum(minutes)) m from public.ielts_activity_log
        where user_id = auth.uid() and (created_at at time zone p_tz)::date = d::date
      ) x on true), '[]'::jsonb),
    'drills_total', (select count(*) from public.ielts_drill_attempts
                     where user_id = auth.uid() and submitted_at is not null),
    'mistakes_due', (select count(*) from public.ielts_mistakes
                     where user_id = auth.uid() and box < 6 and due_at <= now()),
    'words_learned', (select count(*) from public.ielts_vocab_learned where user_id = auth.uid())
  ) into v_result;

  return v_result;
end;
$$;

revoke all on function public.ielts_get_learning_stats(text) from public, anon;
grant execute on function public.ielts_get_learning_stats(text) to authenticated;

-- Accuracy per question type across the learner's mocks and drills: what the
-- study plan and Enhance page rank by.
create or replace function public.ielts_get_type_accuracy()
returns table (type_code text, type_label text, section text, correct int, total int)
language sql
stable
security definer
set search_path = public
as $$
  with answered as (
    select q.type_code, r.is_correct
    from public.ielts_responses r
    join public.ielts_attempts a on a.id = r.attempt_id and a.user_id = auth.uid()
    join public.ielts_questions q on q.id = r.question_id
    where r.is_correct is not null
    union all
    select q.type_code, dr.is_correct
    from public.ielts_drill_responses dr
    join public.ielts_drill_attempts d on d.id = dr.drill_id and d.user_id = auth.uid()
    join public.ielts_questions q on q.id = dr.question_id
  )
  select t.code, t.label, t.section,
         count(*) filter (where a.is_correct)::int,
         count(*)::int
  from answered a
  join public.ielts_question_types t on t.code = a.type_code
  group by t.code, t.label, t.section
  order by t.code;
$$;

revoke all on function public.ielts_get_type_accuracy() from public, anon;
grant execute on function public.ielts_get_type_accuracy() to authenticated;

-- grading_jobs (0009) predates writing_submissions; link them now.
do $$ begin
  alter table public.ielts_grading_jobs
    add constraint grading_jobs_submission_fk
    foreign key (submission_id) references public.ielts_writing_submissions (id) on delete cascade;
exception when duplicate_object then null; end $$;
