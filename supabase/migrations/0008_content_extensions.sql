-- 0008_content_extensions.sql
-- Content the multi-form pipeline needs: form slug and difficulty, per-question
-- explanations, admin-only listening scripts, and the post-submission release
-- of both. Additive only.

alter table public.ielts_test_forms
  add column if not exists slug text,
  add column if not exists difficulty text not null default 'standard';

do $$ begin
  alter table public.ielts_test_forms
    add constraint test_forms_difficulty_check
    check (difficulty in ('foundation', 'standard', 'challenge'));
exception when duplicate_object then null; end $$;

create unique index if not exists ielts_test_forms_slug_key
  on public.ielts_test_forms (slug) where slug is not null;

-- Why the answer is right. Lives on the admin-only questions table, so it is
-- as private as accepted_answers until an attempt or drill is submitted.
alter table public.ielts_questions
  add column if not exists explanation text;

-- ---------------------------------------------------------------------------
-- item_group_scripts: listening transcripts, kept OFF item_groups
-- ---------------------------------------------------------------------------
-- item_groups is readable by every signed-in user (published forms), and a
-- listening transcript contains every answer. Scripts therefore get their own
-- admin-only table, read by generate-audio and released per attempt below.

create table if not exists public.ielts_item_group_scripts (
  group_id uuid primary key references public.ielts_item_groups (id) on delete cascade,
  transcript text not null,
  -- Set by generate-audio so an unchanged script is not re-synthesised.
  audio_script_hash text,
  updated_at timestamptz not null default now()
);

drop trigger if exists item_group_scripts_set_updated_at on public.ielts_item_group_scripts;
create trigger item_group_scripts_set_updated_at
  before update on public.ielts_item_group_scripts
  for each row execute function public.ielts_set_updated_at();

alter table public.ielts_item_group_scripts enable row level security;

drop policy if exists item_group_scripts_admin_all on public.ielts_item_group_scripts;
create policy item_group_scripts_admin_all on public.ielts_item_group_scripts
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Any script already typed into ielts_item_groups.transcript by the builder moves
-- across, and the exposed column is cleared.
insert into public.ielts_item_group_scripts (group_id, transcript)
select id, transcript from public.ielts_item_groups
where transcript is not null and btrim(transcript) <> ''
on conflict (group_id) do nothing;

update public.ielts_item_groups set transcript = null where transcript is not null;

-- ---------------------------------------------------------------------------
-- Premium that actually expires
-- ---------------------------------------------------------------------------
-- tier = 'premium' alone is not enough: a code grants premium until
-- premium_expires_at, and nothing ever flips the tier back.

create or replace function public.ielts_is_premium(p_user uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.ielts_learners
    where user_id = p_user and premium_expires_at > now()
  );
$$;

revoke all on function public.ielts_is_premium(uuid) from public, anon;
grant execute on function public.ielts_is_premium(uuid) to authenticated, service_role;

create or replace function public.ielts_start_attempt(p_form_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_attempt_id uuid;
  v_form public.ielts_test_forms%rowtype;
begin
  if auth.uid() is null then
    raise exception 'not_authenticated';
  end if;

  select * into v_form from public.ielts_test_forms where id = p_form_id;
  if not found or not v_form.is_published then
    raise exception 'form_not_available';
  end if;

  if v_form.is_premium and not public.ielts_is_premium() then
    raise exception 'premium_required';
  end if;

  select id into v_attempt_id
  from public.ielts_attempts
  where user_id = auth.uid()
    and form_id = p_form_id
    and status in ('in_progress', 'awaiting_speaking')
  order by started_at desc
  limit 1;

  if v_attempt_id is not null then
    return v_attempt_id;
  end if;

  insert into public.ielts_attempts (user_id, form_id, status)
  values (auth.uid(), p_form_id, 'in_progress')
  returning id into v_attempt_id;

  return v_attempt_id;
end;
$$;

-- ---------------------------------------------------------------------------
-- Post-submission releases
-- ---------------------------------------------------------------------------

-- get_attempt_review plus the explanation. A new name because the return type
-- changes and migrations here never drop a function.
create or replace function public.ielts_get_attempt_review_v2(p_attempt_id uuid)
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
  is_correct boolean,
  explanation text,
  group_id uuid
)
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_attempt public.ielts_attempts%rowtype;
begin
  select * into v_attempt from public.ielts_attempts where id = p_attempt_id;
  if not found then
    raise exception 'attempt_not_found';
  end if;
  if v_attempt.user_id <> auth.uid() and not public.is_admin() then
    raise exception 'forbidden';
  end if;
  -- Objective answers are final once submitted, even while the AI graders
  -- are still working on Writing and Speaking (status awaiting_speaking).
  if v_attempt.submitted_at is null and not public.is_admin() then
    raise exception 'attempt_not_submitted';
  end if;

  return query
    select
      q.id, s.section, g.part_number, q.order_index, q.type_code, t.label,
      q.prompt, r.answer, q.accepted_answers, r.is_correct, q.explanation, g.id
    from public.ielts_questions q
    join public.ielts_question_types t on t.code = q.type_code
    join public.ielts_item_groups g on g.id = q.group_id
    join public.ielts_test_sections s on s.id = g.section_id
    left join public.ielts_responses r
      on r.question_id = q.id and r.attempt_id = p_attempt_id
    where s.form_id = v_attempt.form_id
    order by s.order_index, g.order_index, q.order_index;
end;
$$;

revoke all on function public.ielts_get_attempt_review_v2(uuid) from public, anon;
grant execute on function public.ielts_get_attempt_review_v2(uuid) to authenticated;

-- Listening scripts for a submitted attempt, for the follow-along review.
create or replace function public.ielts_get_attempt_transcripts(p_attempt_id uuid)
returns table (group_id uuid, part_number int, audio_url text, transcript text)
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_attempt public.ielts_attempts%rowtype;
begin
  select * into v_attempt from public.ielts_attempts where id = p_attempt_id;
  if not found then
    raise exception 'attempt_not_found';
  end if;
  if v_attempt.user_id <> auth.uid() and not public.is_admin() then
    raise exception 'forbidden';
  end if;
  if v_attempt.submitted_at is null and not public.is_admin() then
    raise exception 'attempt_not_submitted';
  end if;

  return query
    select g.id, g.part_number, g.audio_url, sc.transcript
    from public.ielts_item_groups g
    join public.ielts_test_sections s on s.id = g.section_id
    join public.ielts_item_group_scripts sc on sc.group_id = g.id
    where s.form_id = v_attempt.form_id and s.section = 'listening'
    order by g.order_index;
end;
$$;

revoke all on function public.ielts_get_attempt_transcripts(uuid) from public, anon;
grant execute on function public.ielts_get_attempt_transcripts(uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- Learner goals on the profile
-- ---------------------------------------------------------------------------

alter table public.ielts_learners
  add column if not exists exam_date date,
  add column if not exists daily_goal_minutes int not null default 20,
  add column if not exists locale text not null default 'en',
  add column if not exists reminder_emails boolean not null default true;

do $$ begin
  alter table public.ielts_learners
    add constraint ielts_learners_daily_goal_check check (daily_goal_minutes between 5 and 240);
exception when duplicate_object then null; end $$;
do $$ begin
  alter table public.ielts_learners
    add constraint ielts_learners_locale_check check (locale in ('en', 'ar'));
exception when duplicate_object then null; end $$;
