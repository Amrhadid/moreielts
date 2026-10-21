-- 0009_grading_queue.sql
-- Background AI grading. Submitting an attempt queues one job per Writing task
-- and Speaking part; the grading-worker Edge Function claims and grades them,
-- then re-scores the attempt. The candidate never waits on the model, and a
-- failed call is retried by the sweep instead of being lost.
--
-- Requires the pg_net and pg_cron extensions (Database -> Extensions) and a
-- Vault secret named ielts_grading_worker_key whose value matches the
-- GRADING_WORKER_KEY Edge Function secret. See the README.

-- Wrapped so a plain Postgres (the local test suite) can still apply the
-- rest of this file; on Supabase both extensions are available.
do $$ begin
  create extension if not exists pg_net;
exception when others then raise warning 'pg_net unavailable: %', sqlerrm; end $$;
do $$ begin
  create extension if not exists pg_cron;
exception when others then raise warning 'pg_cron unavailable: %', sqlerrm; end $$;

create table if not exists public.ielts_grading_jobs (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('writing', 'speaking', 'essay')),
  -- writing/speaking jobs belong to an attempt; essay jobs to a submission.
  attempt_id uuid references public.ielts_attempts (id) on delete cascade,
  submission_id uuid,
  -- Task number (writing) or part number (speaking); null for essays.
  part_number int,
  user_id uuid not null references auth.users (id) on delete cascade,
  status text not null default 'pending'
    check (status in ('pending', 'running', 'done', 'failed')),
  tries int not null default 0,
  last_error text,
  claimed_at timestamptz,
  finished_at timestamptz,
  created_at timestamptz not null default now(),
  check (
    (kind in ('writing', 'speaking') and attempt_id is not null and part_number is not null)
    or (kind = 'essay' and submission_id is not null)
  )
);

-- A full (not partial) unique index, so submit-attempt's upsert can name it in
-- ON CONFLICT. Essay jobs have a null attempt_id, and nulls never collide.
create unique index if not exists ielts_grading_jobs_attempt_part_key
  on public.ielts_grading_jobs (attempt_id, kind, part_number);
create unique index if not exists ielts_grading_jobs_submission_key
  on public.ielts_grading_jobs (submission_id)
  where submission_id is not null;
create index if not exists ielts_grading_jobs_pending_idx
  on public.ielts_grading_jobs (status, created_at)
  where status in ('pending', 'running');

alter table public.ielts_grading_jobs enable row level security;

-- Learners may watch their own jobs (the results page shows progress); only
-- the service role writes.
drop policy if exists grading_jobs_select_own on public.ielts_grading_jobs;
create policy grading_jobs_select_own on public.ielts_grading_jobs
  for select to authenticated
  using (user_id = auth.uid() or public.is_admin());

-- ---------------------------------------------------------------------------
-- Claiming. SKIP LOCKED lets several worker invocations run at once without
-- grading the same job twice. A job stuck in 'running' for 10 minutes (the
-- worker died) is reclaimable.
-- ---------------------------------------------------------------------------

create or replace function public.ielts_claim_grading_jobs(p_limit int default 5, p_job uuid default null)
returns setof public.ielts_grading_jobs
language plpgsql
security definer
set search_path = public
as $$
begin
  return query
  update public.ielts_grading_jobs j
  set status = 'running', claimed_at = now(), tries = j.tries + 1
  where j.id in (
    select id from public.ielts_grading_jobs
    where (p_job is null or id = p_job)
      and tries < 5
      and (status = 'pending'
           or (status = 'running' and claimed_at < now() - interval '10 minutes'))
    order by created_at
    limit p_limit
    for update skip locked
  )
  returning j.*;
end;
$$;

-- Jobs that have used all five tries are marked failed so the results page
-- can say so rather than spin forever.
create or replace function public.ielts_fail_exhausted_grading_jobs()
returns int
language sql
security definer
set search_path = public
as $$
  with failed as (
    update public.ielts_grading_jobs
    set status = 'failed', finished_at = now()
    where status in ('pending', 'running') and tries >= 5
      and (status = 'pending' or claimed_at < now() - interval '10 minutes')
    returning 1
  )
  select count(*)::int from failed;
$$;

revoke all on function public.ielts_claim_grading_jobs(int, uuid) from public, anon, authenticated;
revoke all on function public.ielts_fail_exhausted_grading_jobs() from public, anon, authenticated;
grant execute on function public.ielts_claim_grading_jobs(int, uuid) to service_role;
grant execute on function public.ielts_fail_exhausted_grading_jobs() to service_role;

-- ---------------------------------------------------------------------------
-- The sweep: every minute, if anything is waiting, call the worker.
-- ---------------------------------------------------------------------------

create or replace function public.ielts_grading_sweep()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_key text;
  v_url text;
begin
  perform public.ielts_fail_exhausted_grading_jobs();

  if not exists (
    select 1 from public.ielts_grading_jobs
    where status = 'pending'
       or (status = 'running' and claimed_at < now() - interval '10 minutes')
  ) then
    return;
  end if;

  select decrypted_secret into v_key
  from vault.decrypted_secrets where name = 'ielts_grading_worker_key';
  select decrypted_secret into v_url
  from vault.decrypted_secrets where name = 'ielts_grading_worker_url';
  if v_key is null or v_url is null then
    raise warning 'grading_sweep: vault secrets ielts_grading_worker_key / ielts_grading_worker_url missing';
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

revoke all on function public.ielts_grading_sweep() from public, anon, authenticated;

do $$ begin
  if exists (select 1 from pg_namespace where nspname = 'cron') then
    begin
      perform cron.unschedule('ielts-grading-sweep');
    exception when others then null;
    end;
    perform cron.schedule('ielts-grading-sweep', '* * * * *', 'select public.ielts_grading_sweep()');
  end if;
end $$;
