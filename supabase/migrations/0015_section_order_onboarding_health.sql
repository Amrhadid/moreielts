-- 0015_section_order_onboarding_health.sql
-- MoreIELTS objects only.
--
-- 1. Mock sections run in the official order. ielts_attempts.sections_done
--    records the sections that have been submitted (written by the
--    submit-attempt function as the service role; the timing trigger keeps
--    it out of a client's hands), and ielts_start_section refuses a section
--    whose predecessors are not done, or one that is already submitted.
-- 2. Onboarding: the learner's IELTS variant (Academic / General Training)
--    lives on ielts_learners, the WhatsApp number is optional, and the form
--    can be skipped once (onboarding_skipped_at).
-- 3. Admin health RPC and a retry for failed grading jobs.

-- ---------------------------------------------------------------------------
-- 1. Section order
-- ---------------------------------------------------------------------------
alter table public.ielts_attempts
  add column if not exists sections_done text[] not null default '{}';

create or replace function public.ielts_protect_attempt_timing()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if current_user = 'service_role' then
    return new;
  end if;
  if coalesce(current_setting('app.allow_timing_write', true), '') = '1' then
    perform set_config('app.allow_timing_write', '0', true);
    return new;
  end if;
  new.section_started_at := old.section_started_at;
  new.section_deadline_at := old.section_deadline_at;
  new.started_at := old.started_at;
  new.submitted_at := old.submitted_at;
  -- Which sections are finished is decided by the marking function, never
  -- by the client: otherwise a learner could skip ahead in a mock.
  new.sections_done := old.sections_done;
  return new;
end;
$$;

create or replace function public.ielts_start_section(
  p_attempt_id uuid,
  p_section text
)
returns table (
  section_started_at timestamptz,
  section_deadline_at timestamptz,
  remaining_seconds int
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_attempt public.ielts_attempts%rowtype;
  v_limit int;
  v_now timestamptz := now();
  v_order text[];
  v_idx int;
  i int;
begin
  select * into v_attempt from public.ielts_attempts where id = p_attempt_id;
  if not found then
    raise exception 'attempt_not_found';
  end if;
  if v_attempt.user_id <> auth.uid() then
    raise exception 'forbidden';
  end if;
  if v_attempt.status not in ('in_progress', 'awaiting_speaking') then
    raise exception 'attempt_not_active';
  end if;

  select time_limit_seconds into v_limit
  from public.ielts_test_sections
  where form_id = v_attempt.form_id and section = p_section;
  if v_limit is null then
    raise exception 'section_not_found';
  end if;

  -- A submitted section cannot be reopened.
  if p_section = any (v_attempt.sections_done) then
    raise exception 'section_already_submitted';
  end if;

  -- Every earlier section of the form must have been submitted first.
  select array_agg(section order by order_index) into v_order
  from public.ielts_test_sections
  where form_id = v_attempt.form_id;
  v_idx := array_position(v_order, p_section);
  for i in 1 .. coalesce(v_idx, 1) - 1 loop
    if not (v_order[i] = any (v_attempt.sections_done)) then
      raise exception 'section_out_of_order';
    end if;
  end loop;

  -- Re-entering a section that is already running must not restart its clock.
  if v_attempt.current_section = p_section
     and v_attempt.section_deadline_at is not null
     and v_attempt.section_deadline_at > v_now
  then
    return query
      select v_attempt.section_started_at,
             v_attempt.section_deadline_at,
             greatest(0, extract(epoch from v_attempt.section_deadline_at - v_now))::int;
    return;
  end if;

  perform set_config('app.allow_timing_write', '1', true);
  update public.ielts_attempts
  set current_section = p_section,
      current_position = 0,
      section_started_at = v_now,
      section_deadline_at = v_now + make_interval(secs => v_limit),
      last_heartbeat_at = v_now
  where id = p_attempt_id;

  return query
    select v_now,
           v_now + make_interval(secs => v_limit),
           v_limit;
end;
$$;

-- ---------------------------------------------------------------------------
-- 2. Onboarding: variant, optional WhatsApp, skippable
-- ---------------------------------------------------------------------------
alter table public.ielts_learners
  add column if not exists variant text,
  add column if not exists onboarding_skipped_at timestamptz;

do $$ begin
  alter table public.ielts_learners
    add constraint ielts_learners_variant_check
    check (variant is null or variant in ('academic', 'general_training'));
exception when duplicate_object then null; end $$;

-- The one way to finish onboarding. The WhatsApp number is optional here (it
-- is asked for again when a code is needed); the variant may be left unset.
create or replace function public.ielts_complete_onboarding(
  p_full_name text,
  p_nationality text,
  p_whatsapp text default null,
  p_variant text default null
)
returns public.ielts_learners
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.ielts_learners;
  v_name text := btrim(regexp_replace(coalesce(p_full_name, ''), '\s+', ' ', 'g'));
  v_phone text := nullif(regexp_replace(coalesce(p_whatsapp, ''), '[^0-9+]', '', 'g'), '');
begin
  if auth.uid() is null then
    raise exception 'not_authenticated';
  end if;
  if char_length(v_name) < 2 or char_length(v_name) > 80 then
    raise exception 'invalid_name';
  end if;
  if coalesce(p_nationality, '') !~ '^[A-Z]{2}$' then
    raise exception 'invalid_nationality';
  end if;
  if v_phone is not null and v_phone !~ '^\+[1-9][0-9]{6,14}$' then
    raise exception 'invalid_whatsapp';
  end if;
  if p_variant is not null and p_variant not in ('academic', 'general_training') then
    raise exception 'invalid_variant';
  end if;

  insert into public.ielts_learners (user_id, full_name, nationality, whatsapp, variant, onboarded_at)
  values (auth.uid(), v_name, p_nationality, v_phone, p_variant, now())
  on conflict (user_id) do update
    set full_name = excluded.full_name,
        nationality = excluded.nationality,
        whatsapp = coalesce(excluded.whatsapp, public.ielts_learners.whatsapp),
        variant = coalesce(excluded.variant, public.ielts_learners.variant),
        onboarding_skipped_at = null,
        onboarded_at = coalesce(public.ielts_learners.onboarded_at, excluded.onboarded_at)
  returning * into v_row;
  return v_row;
end;
$$;

revoke all on function public.ielts_complete_onboarding(text, text, text, text) from public, anon;
grant execute on function public.ielts_complete_onboarding(text, text, text, text) to authenticated;

-- The 0014 signature stays as a wrapper (nothing is dropped), so an older
-- client build keeps working while the new one passes the variant.
create or replace function public.ielts_complete_onboarding(
  p_full_name text,
  p_nationality text,
  p_whatsapp text
)
returns public.ielts_learners
language sql
security definer
set search_path = public
as $$
  select public.ielts_complete_onboarding(p_full_name, p_nationality, p_whatsapp, null);
$$;

-- Skipping is remembered so the form does not come back on every page.
create or replace function public.ielts_skip_onboarding()
returns public.ielts_learners
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.ielts_learners;
begin
  if auth.uid() is null then
    raise exception 'not_authenticated';
  end if;
  insert into public.ielts_learners (user_id, onboarding_skipped_at)
  values (auth.uid(), now())
  on conflict (user_id) do update
    set onboarding_skipped_at = coalesce(public.ielts_learners.onboarding_skipped_at, excluded.onboarding_skipped_at)
  returning * into v_row;
  return v_row;
end;
$$;

revoke all on function public.ielts_skip_onboarding() from public, anon;
grant execute on function public.ielts_skip_onboarding() to authenticated;

-- ---------------------------------------------------------------------------
-- 3. Admin health and grading-job retry
-- ---------------------------------------------------------------------------
create or replace function public.ielts_admin_health()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_cron jsonb := null;
  v_cron_active boolean := false;
  v_vault jsonb := jsonb_build_object('worker_key', false, 'worker_url', false);
begin
  if not public.is_admin() then
    raise exception 'forbidden';
  end if;

  -- pg_cron and Vault exist on the hosted project but not in the local test
  -- database, so their absence is reported rather than raised.
  begin
    select jsonb_build_object('status', d.status, 'at', d.end_time, 'message', left(d.return_message, 200))
    into v_cron
    from cron.job_run_details d
    join cron.job j on j.jobid = d.jobid
    where j.jobname = 'ielts-grading-sweep'
    order by d.start_time desc
    limit 1;
    select exists (select 1 from cron.job where jobname = 'ielts-grading-sweep' and active)
    into v_cron_active;
  exception when undefined_table or invalid_schema_name then
    v_cron := null;
  end;
  begin
    select jsonb_build_object(
      'worker_key', exists (select 1 from vault.secrets where name = 'ielts_grading_worker_key'),
      'worker_url', exists (select 1 from vault.secrets where name = 'ielts_grading_worker_url'))
    into v_vault;
  exception when undefined_table or invalid_schema_name then
    null;
  end;

  return jsonb_build_object(
    'checked_at', now(),
    'jobs', (
      select jsonb_build_object(
        'pending', count(*) filter (where status = 'pending'),
        'running', count(*) filter (where status = 'running'),
        'stuck', count(*) filter (where status = 'running' and claimed_at < now() - interval '10 minutes'),
        'failed', count(*) filter (where status = 'failed'),
        'done', count(*) filter (where status = 'done'),
        'oldest_pending_minutes', coalesce(
          (select extract(epoch from now() - min(created_at)) / 60 from public.ielts_grading_jobs where status = 'pending'), 0)::int,
        'last_done_at', max(finished_at) filter (where status = 'done')
      )
      from public.ielts_grading_jobs
    ),
    'failed_jobs', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', f.id, 'kind', f.kind, 'part_number', f.part_number,
        'attempt_id', f.attempt_id, 'submission_id', f.submission_id,
        'tries', f.tries, 'last_error', left(f.last_error, 300), 'finished_at', f.finished_at
      ) order by f.finished_at desc nulls last)
      from (
        select * from public.ielts_grading_jobs where status = 'failed'
        order by finished_at desc nulls last limit 20
      ) f
    ), '[]'::jsonb),
    'cron', v_cron,
    'cron_active', v_cron_active,
    'vault', v_vault,
    'content', (
      select jsonb_build_object(
        'forms_published', (select count(*) from public.ielts_test_forms where is_published),
        'mock_forms', (select count(*) from public.ielts_test_forms where is_published and purpose = 'mock'),
        'listening_parts_without_audio', (
          select count(*)
          from public.ielts_item_groups g
          join public.ielts_test_sections s on s.id = g.section_id
          join public.ielts_test_forms f on f.id = s.form_id
          where f.is_published and s.section = 'listening' and g.audio_url is null),
        'questions_without_explanation', (
          select count(*)
          from public.ielts_questions q
          join public.ielts_item_groups g on g.id = q.group_id
          join public.ielts_test_sections s on s.id = g.section_id
          join public.ielts_test_forms f on f.id = s.form_id
          where f.is_published and s.section in ('listening', 'reading')
            and coalesce(q.explanation, '') = ''),
        'forms_missing_sections', (
          select count(*) from public.ielts_test_forms f
          where f.is_published
            and (select count(*) from public.ielts_test_sections s where s.form_id = f.id) < 4)
      )
    ),
    'learners', (
      select jsonb_build_object(
        'total', (select count(*) from public.ielts_learners),
        'premium', (select count(*) from public.ielts_learners where premium_expires_at > now()),
        'onboarded', (select count(*) from public.ielts_learners where onboarded_at is not null),
        'attempts_submitted', (select count(*) from public.ielts_attempts where submitted_at is not null),
        'attempts_completed', (select count(*) from public.ielts_attempts where status = 'completed'),
        'last_attempt_at', (select max(started_at) from public.ielts_attempts)
      )
    )
  );
end;
$$;

revoke all on function public.ielts_admin_health() from public, anon;
grant execute on function public.ielts_admin_health() to authenticated;

-- A failed job goes back to the queue with a fresh try budget. Admins may
-- retry any job; a learner only their own. The worker is kicked at once.
create or replace function public.ielts_retry_grading_job(p_job uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_job public.ielts_grading_jobs%rowtype;
begin
  if auth.uid() is null then
    raise exception 'not_authenticated';
  end if;
  select * into v_job from public.ielts_grading_jobs where id = p_job;
  if not found then
    raise exception 'job_not_found';
  end if;
  if v_job.user_id <> auth.uid() and not public.is_admin() then
    raise exception 'forbidden';
  end if;
  if v_job.status <> 'failed' then
    raise exception 'job_not_failed';
  end if;

  update public.ielts_grading_jobs
  set status = 'pending', tries = 0, last_error = null, claimed_at = null, finished_at = null
  where id = p_job;

  if v_job.kind = 'essay' and v_job.submission_id is not null then
    update public.ielts_writing_submissions set status = 'pending' where id = v_job.submission_id;
  end if;

  perform public.ielts_kick_grading();
end;
$$;

revoke all on function public.ielts_retry_grading_job(uuid) from public, anon;
grant execute on function public.ielts_retry_grading_job(uuid) to authenticated;
