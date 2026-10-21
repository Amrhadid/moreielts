-- 0011_payments_analytics.sql
-- Paid Premium through Stripe Checkout, the admin analytics aggregate, and a
-- small client error log. Additive only.

-- ---------------------------------------------------------------------------
-- Payments. One row per completed Stripe Checkout session, written only by
-- the stripe-webhook Edge Function (service role). The session id is the
-- primary key, so a webhook Stripe retries cannot grant Premium twice.
-- ---------------------------------------------------------------------------

create table if not exists public.ielts_payments (
  stripe_session_id text primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  plan text not null,
  days int not null check (days > 0),
  amount_total int,
  currency text,
  premium_expires_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists ielts_payments_user_idx on public.ielts_payments (user_id, created_at desc);

alter table public.ielts_payments enable row level security;

drop policy if exists payments_select_own on public.ielts_payments;
create policy payments_select_own on public.ielts_payments
  for select to authenticated
  using (user_id = auth.uid() or public.is_admin());

-- Idempotent grant: records the payment and extends Premium in one step.
-- Returns null when the session was already processed.
create or replace function public.ielts_grant_paid_premium(
  p_session_id text,
  p_user uuid,
  p_plan text,
  p_days int,
  p_amount int,
  p_currency text
)
returns timestamptz
language plpgsql
security definer
set search_path = public
as $$
declare
  v_expires timestamptz;
begin
  insert into public.ielts_payments (stripe_session_id, user_id, plan, days, amount_total, currency)
  values (p_session_id, p_user, p_plan, p_days, p_amount, p_currency)
  on conflict (stripe_session_id) do nothing;
  if not found then
    return null;
  end if;

  -- A buyer may not have a learner row yet (rows are created lazily), so
  -- start from now when there is none.
  select greatest(coalesce(
           (select premium_expires_at from public.ielts_learners where user_id = p_user),
           now()), now()) + make_interval(days => p_days)
  into v_expires;

  insert into public.ielts_learners (user_id, premium_expires_at) values (p_user, v_expires)
  on conflict (user_id) do update set premium_expires_at = excluded.premium_expires_at;

  update public.ielts_payments set premium_expires_at = v_expires
  where stripe_session_id = p_session_id;

  return v_expires;
end;
$$;

revoke all on function public.ielts_grant_paid_premium(text, uuid, text, int, int, text)
  from public, anon, authenticated;
grant execute on function public.ielts_grant_paid_premium(text, uuid, text, int, int, text)
  to service_role;

-- ---------------------------------------------------------------------------
-- Admin analytics: one call, aggregated in the database.
-- ---------------------------------------------------------------------------

create or replace function public.ielts_admin_analytics(p_days int default 90)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_since timestamptz := now() - make_interval(days => p_days);
begin
  if not public.is_admin() then
    raise exception 'forbidden';
  end if;

  return jsonb_build_object(
    'totals', jsonb_build_object(
      'students', (select count(*) from public.ielts_learners),
      'premium', (select count(*) from public.ielts_learners where premium_expires_at > now()),
      'attempts_submitted', (select count(*) from public.ielts_attempts
                             where submitted_at >= v_since),
      'drills', (select count(*) from public.ielts_drill_attempts where submitted_at >= v_since),
      'essays', (select count(*) from public.ielts_writing_submissions where created_at >= v_since),
      'revenue', (select coalesce(sum(amount_total), 0) from public.ielts_payments
                  where created_at >= v_since),
      'grading_failed', (select count(*) from public.ielts_grading_jobs
                         where status = 'failed' and created_at >= v_since),
      'grading_pending', (select count(*) from public.ielts_grading_jobs
                          where status in ('pending', 'running'))
    ),
    'band_distribution', coalesce((
      select jsonb_agg(jsonb_build_object('band', band, 'count', n) order by band)
      from (select s.overall_band band, count(*) n
            from public.ielts_attempt_scores s
            join public.ielts_attempts a on a.id = s.attempt_id
            where s.overall_band is not null and a.submitted_at >= v_since
            group by s.overall_band) x), '[]'::jsonb),
    'section_bands', (
      select jsonb_build_object(
        'listening', round(avg(s.listening_band), 2),
        'reading', round(avg(s.reading_band), 2),
        'writing', round(avg(s.writing_band), 2),
        'speaking', round(avg(s.speaking_band), 2))
      from public.ielts_attempt_scores s
      join public.ielts_attempts a on a.id = s.attempt_id
      where a.submitted_at >= v_since),
    'weekly', coalesce((
      select jsonb_agg(jsonb_build_object('week', w, 'signups', su, 'attempts', at, 'drills', dr) order by w)
      from (
        select w::date,
          (select count(*) from public.ielts_learners p where date_trunc('week', p.created_at) = w) su,
          (select count(*) from public.ielts_attempts a where date_trunc('week', a.submitted_at) = w) at,
          (select count(*) from public.ielts_drill_attempts d where date_trunc('week', d.submitted_at) = w) dr
        from generate_series(date_trunc('week', v_since), date_trunc('week', now()), interval '1 week') w
      ) x), '[]'::jsonb),
    'weakest_types', coalesce((
      select jsonb_agg(row_to_json(x) order by x.accuracy)
      from (
        select t.label, t.section,
               count(*) total,
               round(100.0 * count(*) filter (where r.is_correct) / count(*), 1) accuracy
        from public.ielts_responses r
        join public.ielts_attempts a on a.id = r.attempt_id and a.submitted_at >= v_since
        join public.ielts_questions q on q.id = r.question_id
        join public.ielts_question_types t on t.code = q.type_code
        where r.is_correct is not null
        group by t.label, t.section
        having count(*) >= 20
        order by 4
        limit 8
      ) x), '[]'::jsonb),
    'ai_usage', coalesce((
      select jsonb_agg(jsonb_build_object('function', function_name, 'calls', n) order by n desc)
      from (select function_name, count(*) n from public.ielts_ai_grading_usage
            where created_at >= v_since group by function_name) x), '[]'::jsonb)
  );
end;
$$;

revoke all on function public.ielts_admin_analytics(int) from public, anon;
grant execute on function public.ielts_admin_analytics(int) to authenticated;

-- ---------------------------------------------------------------------------
-- Client error log. Any visitor may insert (bounded sizes); only admins read.
-- ---------------------------------------------------------------------------

create table if not exists public.ielts_client_errors (
  id bigint generated always as identity primary key,
  user_id uuid default auth.uid(),
  message text not null check (char_length(message) <= 2000),
  stack text check (stack is null or char_length(stack) <= 8000),
  url text check (url is null or char_length(url) <= 1000),
  user_agent text check (user_agent is null or char_length(user_agent) <= 500),
  created_at timestamptz not null default now()
);

create index if not exists ielts_client_errors_created_idx on public.ielts_client_errors (created_at desc);

alter table public.ielts_client_errors enable row level security;

drop policy if exists client_errors_insert on public.ielts_client_errors;
create policy client_errors_insert on public.ielts_client_errors
  for insert to anon, authenticated
  with check (user_id is null or user_id = auth.uid());

drop policy if exists client_errors_admin_read on public.ielts_client_errors;
create policy client_errors_admin_read on public.ielts_client_errors
  for select to authenticated
  using (public.is_admin());

grant insert on public.ielts_client_errors to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Table privileges for everything added in 0008-0011, explicit as in 0002:
-- RLS filters rows, GRANT decides who may attempt the operation at all.
-- ---------------------------------------------------------------------------

revoke all on
  public.ielts_item_group_scripts, public.ielts_grading_jobs, public.ielts_drill_attempts,
  public.ielts_drill_responses, public.ielts_mistakes, public.ielts_writing_submissions,
  public.ielts_vocab_learned, public.ielts_study_plan_checks, public.ielts_activity_log,
  public.ielts_payments, public.ielts_client_errors
from anon, authenticated;

grant all on
  public.ielts_item_group_scripts, public.ielts_grading_jobs, public.ielts_drill_attempts,
  public.ielts_drill_responses, public.ielts_mistakes, public.ielts_writing_submissions,
  public.ielts_vocab_learned, public.ielts_study_plan_checks, public.ielts_activity_log,
  public.ielts_payments, public.ielts_client_errors
to service_role;
grant usage on sequence public.ielts_client_errors_id_seq, public.ielts_activity_log_id_seq to service_role;

grant select on
  public.ielts_item_group_scripts, public.ielts_grading_jobs, public.ielts_drill_attempts,
  public.ielts_drill_responses, public.ielts_mistakes, public.ielts_writing_submissions,
  public.ielts_vocab_learned, public.ielts_study_plan_checks, public.ielts_activity_log,
  public.ielts_payments, public.ielts_client_errors
to authenticated;

-- Admin-only by policy; the grant only makes the attempt possible.
grant insert, update, delete on public.ielts_item_group_scripts to authenticated;
-- Learner-owned marks.
grant insert, delete on public.ielts_vocab_learned, public.ielts_study_plan_checks to authenticated;
grant delete on public.ielts_mistakes to authenticated;
-- Anyone may report an error (insert only, bounded by checks).
grant insert on public.ielts_client_errors to anon, authenticated;
grant usage on sequence public.ielts_client_errors_id_seq to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Admin student list: MoreIELTS learners joined to their shared account, in
-- the ProfileRow shape the app uses. MoreTOEFL-only accounts are not listed.
-- ---------------------------------------------------------------------------

create or replace function public.ielts_admin_students(p_limit int default 100)
returns table (
  id uuid, email text, full_name text, role text, tier text,
  premium_expires_at timestamptz, target_band numeric, current_band numeric,
  exam_date date, daily_goal_minutes int, locale text, created_at timestamptz
)
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'forbidden';
  end if;
  return query
    select l.user_id, p.email, p.full_name, coalesce(p.role, 'user'),
           case when l.premium_expires_at > now() then 'premium' else 'free' end,
           l.premium_expires_at, l.target_band, l.current_band, l.exam_date,
           l.daily_goal_minutes, l.locale, l.created_at
    from public.ielts_learners l
    left join public.profiles p on p.id = l.user_id
    order by l.created_at desc
    limit least(p_limit, 500);
end;
$$;

revoke all on function public.ielts_admin_students(int) from public, anon;
grant execute on function public.ielts_admin_students(int) to authenticated;
