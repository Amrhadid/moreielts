-- 0013_premium_only_mocks_codes.sql
-- 1. MoreIELTS is Premium-only: every question, passage, recording, drill,
--    essay and mark needs an active IELTS Premium (admins always qualify).
--    The catalogue (form titles) stays readable so locked content can be shown.
-- 2. Mock exams are kept apart from the skill-section content: a form is
--    either 'practice' (drills, writing prompts) or 'mock' (Mock Test page).
-- 3. Admins generate Premium access codes in batches.
-- 4. Media lives in Supabase Storage: ielts-media (public: listening audio,
--    charts) and ielts-recordings (private: speaking answers, owner folders).
-- MoreIELTS objects only.

-- ---------------------------------------------------------------------------
-- Premium: admins count as Premium so they can test everything.
-- ---------------------------------------------------------------------------
create or replace function public.ielts_is_premium(p_user uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
           select 1 from public.ielts_learners
           where user_id = p_user and premium_expires_at > now())
      or exists (
           select 1 from public.profiles
           where id = p_user and role = 'admin');
$$;

update public.ielts_test_forms set is_premium = true where not is_premium;
alter table public.ielts_test_forms alter column is_premium set default true;

-- Questions reach candidates only through this view: Premium or admin only.
create or replace view public.ielts_questions_public
with (security_invoker = off) as
  select
    q.id, q.group_id, q.type_code, q.prompt, q.options, q.word_limit,
    q.spelling_policy, q.accepts_plural, q.case_sensitive, q.order_index,
    t.renderer, t.label as type_label, t.section
  from public.ielts_questions q
  join public.ielts_question_types t on t.code = q.type_code
  join public.ielts_item_groups g on g.id = q.group_id
  join public.ielts_test_sections s on s.id = g.section_id
  join public.ielts_test_forms f on f.id = s.form_id
  where f.is_published and public.ielts_is_premium();

-- Passages, audio and task prompts: Premium or admin only.
alter policy item_groups_read_published on public.ielts_item_groups
  using (
    public.is_admin()
    or (public.ielts_is_premium() and exists (
      select 1
      from public.ielts_test_sections s
      join public.ielts_test_forms f on f.id = s.form_id
      where s.id = ielts_item_groups.section_id and f.is_published
    ))
  );

-- Every attempt needs Premium, whatever the form's own flag says.
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
  if not public.ielts_is_premium() then
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

-- Essays: Premium only, 20 a day.
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
  if not public.ielts_is_premium() then
    raise exception 'premium_required';
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
  select count(*) into v_recent from public.ielts_writing_submissions
  where user_id = auth.uid() and created_at > now() - interval '1 day';
  if v_recent >= 20 then
    raise exception 'essay_limit_reached';
  end if;
  insert into public.ielts_writing_submissions (user_id, task_number, group_id, prompt, body, parent_id)
  values (auth.uid(), p_task_number, p_group_id, btrim(p_prompt), btrim(p_body), p_parent_id)
  returning id into v_id;
  insert into public.ielts_grading_jobs (kind, submission_id, user_id)
  values ('essay', v_id, auth.uid());
  return v_id;
end;
$$;

-- Learner-written marks need Premium too.
alter policy vocab_learned_own on public.ielts_vocab_learned
  using (user_id = auth.uid())
  with check (user_id = auth.uid() and public.ielts_is_premium());
alter policy study_plan_checks_own on public.ielts_study_plan_checks
  using (user_id = auth.uid())
  with check (user_id = auth.uid() and public.ielts_is_premium()
              and day between current_date - 1 and current_date + 1);
alter policy ielts_practice_results_insert_own on public.ielts_practice_results
  with check (user_id = auth.uid() and public.ielts_is_premium());

-- ---------------------------------------------------------------------------
-- Practice content versus mock exams
-- ---------------------------------------------------------------------------
alter table public.ielts_test_forms
  add column if not exists purpose text not null default 'practice';
do $$ begin
  alter table public.ielts_test_forms
    add constraint ielts_test_forms_purpose_check check (purpose in ('practice', 'mock'));
exception when duplicate_object then null; end $$;

-- Writing-lab prompts come from practice forms only, and only for Premium.
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
  join public.ielts_test_forms f on f.id = s.form_id and f.is_published and f.purpose = 'practice'
  where g.passage_text is not null and public.ielts_is_premium()
  order by f.created_at, g.part_number;
$$;

-- ---------------------------------------------------------------------------
-- Access-code batches
-- ---------------------------------------------------------------------------
alter table public.ielts_redemption_codes
  add column if not exists batch_label text;

-- Generates p_count Premium codes of the form PREFIX-XXXX-XXXX from an
-- alphabet without look-alike characters (no 0/O, 1/I/L). Admin only.
create or replace function public.ielts_generate_codes(
  p_count int,
  p_duration_days int,
  p_expires_at timestamptz default null,
  p_prefix text default 'IELTS',
  p_batch_label text default null
)
returns table (code text, duration_days int, expires_at timestamptz, batch_label text)
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_alphabet constant text := 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  v_prefix text := upper(regexp_replace(coalesce(nullif(btrim(p_prefix), ''), 'IELTS'), '[^A-Za-z0-9]', '', 'g'));
  v_code text;
  v_made int := 0;
  v_bytes bytea;
  i int;
begin
  if not public.is_admin() then
    raise exception 'forbidden';
  end if;
  if p_count is null or p_count < 1 or p_count > 500 then
    raise exception 'count_must_be_1_to_500';
  end if;
  if p_duration_days is null or p_duration_days < 1 or p_duration_days > 3650 then
    raise exception 'duration_must_be_1_to_3650_days';
  end if;
  if length(v_prefix) > 12 then
    raise exception 'prefix_too_long';
  end if;

  while v_made < p_count loop
    v_bytes := gen_random_bytes(8);
    v_code := v_prefix || '-';
    for i in 0..7 loop
      if i = 4 then v_code := v_code || '-'; end if;
      v_code := v_code || substr(v_alphabet, (get_byte(v_bytes, i) % length(v_alphabet)) + 1, 1);
    end loop;
    insert into public.ielts_redemption_codes (code, type, duration_days, expires_at, created_by, batch_label)
    values (v_code, 'premium', p_duration_days, p_expires_at, auth.uid(), nullif(btrim(p_batch_label), ''))
    on conflict do nothing;
    if found then
      v_made := v_made + 1;
      code := v_code;
      duration_days := p_duration_days;
      expires_at := p_expires_at;
      batch_label := nullif(btrim(p_batch_label), '');
      return next;
    end if;
  end loop;
end;
$$;

revoke all on function public.ielts_generate_codes(int, int, timestamptz, text, text) from public, anon;
grant execute on function public.ielts_generate_codes(int, int, timestamptz, text, text) to authenticated;

-- ---------------------------------------------------------------------------
-- Storage buckets (storage.objects policies below are scoped to these two
-- buckets and leave every other bucket untouched).
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('ielts-media', 'ielts-media', true, 52428800,
   array['audio/mpeg', 'audio/mp4', 'audio/aac', 'audio/ogg', 'image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']),
  ('ielts-recordings', 'ielts-recordings', false, 26214400,
   array['audio/webm', 'audio/mp4', 'audio/ogg', 'audio/mpeg'])
on conflict (id) do nothing;

create policy ielts_media_admin_insert on storage.objects
  for insert to authenticated
  with check (bucket_id = 'ielts-media' and public.is_admin());
create policy ielts_media_admin_update on storage.objects
  for update to authenticated
  using (bucket_id = 'ielts-media' and public.is_admin());

-- Recordings: <user id>/<attempt id>/<question id>.webm, owner only.
create policy ielts_recordings_owner_insert on storage.objects
  for insert to authenticated
  with check (bucket_id = 'ielts-recordings'
              and (storage.foldername(name))[1] = auth.uid()::text
              and public.ielts_is_premium());
create policy ielts_recordings_owner_update on storage.objects
  for update to authenticated
  using (bucket_id = 'ielts-recordings' and (storage.foldername(name))[1] = auth.uid()::text);
create policy ielts_recordings_owner_select on storage.objects
  for select to authenticated
  using (bucket_id = 'ielts-recordings'
         and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin()));

-- ---------------------------------------------------------------------------
-- Grading-worker key kept only in Vault: generated here, never displayed.
-- The cron sweep sends it; the worker checks it with ielts_check_worker_key();
-- submit-attempt starts grading at once through ielts_kick_grading().
-- ---------------------------------------------------------------------------
do $$ begin
  if not exists (select 1 from vault.secrets where name = 'ielts_grading_worker_key') then
    perform vault.create_secret(encode(gen_random_bytes(32), 'hex'), 'ielts_grading_worker_key');
  end if;
  if not exists (select 1 from vault.secrets where name = 'ielts_grading_worker_url') then
    perform vault.create_secret(
      'https://nlsuvapjkznatczghvay.supabase.co/functions/v1/ielts-grading-worker',
      'ielts_grading_worker_url');
  end if;
end $$;

create or replace function public.ielts_check_worker_key(p_key text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select p_key is not null and exists (
    select 1 from vault.decrypted_secrets
    where name = 'ielts_grading_worker_key' and decrypted_secret = p_key);
$$;

create or replace function public.ielts_kick_grading()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_key text;
  v_url text;
begin
  select decrypted_secret into v_key from vault.decrypted_secrets where name = 'ielts_grading_worker_key';
  select decrypted_secret into v_url from vault.decrypted_secrets where name = 'ielts_grading_worker_url';
  if v_key is null or v_url is null then
    return;
  end if;
  perform net.http_post(
    url := v_url,
    headers := jsonb_build_object('Content-Type', 'application/json', 'x-grade-key', v_key),
    body := jsonb_build_object('limit', 5),
    timeout_milliseconds := 1000
  );
end;
$$;

revoke all on function public.ielts_check_worker_key(text) from public, anon, authenticated;
revoke all on function public.ielts_kick_grading() from public, anon, authenticated;
grant execute on function public.ielts_check_worker_key(text) to service_role;
grant execute on function public.ielts_kick_grading() to service_role;
