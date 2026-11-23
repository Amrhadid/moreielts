-- Policy: 1 new mock per Africa/Cairo calendar day and 20 per
-- Premium grant period. Starts (including abandoned attempts) consume quota;
-- resumes and skill practice do not. Admins are exempt. No historical debit.
begin;
set local lock_timeout = '5s';
-- Abort rather than queue behind long production writes. Block concurrent
-- grants/starts until backfill and enforcement are both installed.
lock table public.ielts_learners, public.ielts_attempts in share row exclusive mode;
create table if not exists public.ielts_premium_periods (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  check (ends_at > starts_at)
);
create index if not exists ielts_premium_periods_user_idx on public.ielts_premium_periods(user_id, starts_at, ends_at);
alter table public.ielts_premium_periods enable row level security;
drop policy if exists premium_periods_read on public.ielts_premium_periods;
create policy premium_periods_read on public.ielts_premium_periods for select to authenticated
  using (user_id = auth.uid() or public.is_admin());
grant select on public.ielts_premium_periods to authenticated;

-- Preserve usage even if an attempt is removed by an administrator.
create table if not exists public.ielts_mock_usage (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  period_id uuid not null references public.ielts_premium_periods(id),
  attempt_id uuid unique references public.ielts_attempts(id) on delete set null,
  started_at timestamptz not null,
  cairo_day date not null,
  unique(user_id, cairo_day)
);
create index if not exists ielts_mock_usage_period_idx on public.ielts_mock_usage(period_id);
alter table public.ielts_mock_usage enable row level security;
drop policy if exists mock_usage_read on public.ielts_mock_usage;
create policy mock_usage_read on public.ielts_mock_usage for select to authenticated
  using (user_id = auth.uid() or public.is_admin());
grant select on public.ielts_mock_usage to authenticated;

-- Existing subscribers keep their expiry and receive a fresh 20-start period.
insert into public.ielts_premium_periods(user_id, starts_at, ends_at)
select user_id, now(), premium_expires_at from public.ielts_learners l
where premium_expires_at > now()
  and not exists(select 1 from public.ielts_premium_periods p where p.user_id = l.user_id);

-- Every trusted expiry extension, including codes, paid grants and manual
-- admin grants, adds a separate 20-start period. Early renewals queue, with no
-- carryover. Truncating expiry also truncates/removes queued periods.
create or replace function public.ielts_sync_premium_periods() returns trigger
language plpgsql security definer set search_path = public as $$
declare v_old timestamptz; v_start timestamptz;
begin
  if tg_op = 'UPDATE' then v_old := old.premium_expires_at; end if;
  if new.premium_expires_at is not distinct from v_old then return new; end if;
  if new.premium_expires_at is null or new.premium_expires_at < coalesce(v_old, '-infinity') then
    delete from public.ielts_premium_periods p where p.user_id = new.user_id
      and p.starts_at >= coalesce(new.premium_expires_at, now())
      and not exists(select 1 from public.ielts_mock_usage u where u.period_id = p.id);
    update public.ielts_premium_periods p
      set ends_at = coalesce(new.premium_expires_at, now())
      where p.user_id = new.user_id and p.starts_at < coalesce(new.premium_expires_at, now())
      and p.ends_at > coalesce(new.premium_expires_at, now());
  else
    v_start := greatest(coalesce(v_old, now()), now());
    if new.premium_expires_at > v_start then
      insert into public.ielts_premium_periods(user_id, starts_at, ends_at)
      values(new.user_id, v_start, new.premium_expires_at);
    end if;
  end if;
  return new;
end; $$;
revoke all on function public.ielts_sync_premium_periods() from public, anon, authenticated;
drop trigger if exists ielts_sync_premium_periods on public.ielts_learners;
create trigger ielts_sync_premium_periods after insert or update of premium_expires_at
on public.ielts_learners for each row execute function public.ielts_sync_premium_periods();

-- The RPC is the sole learner insertion path. RLS alone previously let
-- clients insert their own attempts and bypass all start-attempt checks.
drop policy if exists attempts_insert_own on public.ielts_attempts;
revoke insert on public.ielts_attempts from authenticated, anon;
create or replace function public.ielts_protect_attempt_identity() returns trigger
language plpgsql security invoker set search_path = public as $$
begin
  if current_user in ('authenticated', 'anon') then
    new.user_id := old.user_id;
    new.form_id := old.form_id;
    -- Cannot reopen a finished attempt to retake it without a fresh start.
    if old.status not in ('in_progress', 'awaiting_speaking') then new.status := old.status; end if;
  end if;
  return new;
end; $$;
revoke all on function public.ielts_protect_attempt_identity() from public, anon, authenticated;
drop trigger if exists attempts_protect_identity on public.ielts_attempts;
create trigger attempts_protect_identity before update on public.ielts_attempts
for each row execute function public.ielts_protect_attempt_identity();

create or replace function public.ielts_start_attempt(p_form_id uuid) returns uuid
language plpgsql security definer set search_path = public as $$
declare
  v_attempt_id uuid;
  v_form public.ielts_test_forms%rowtype;
  v_period uuid;
  v_now timestamptz;
  v_day date;
begin
  if auth.uid() is null then raise exception 'not_authenticated'; end if;
  -- Serialize starts and expiry grants for this learner across all forms.
  insert into public.ielts_learners(user_id) values(auth.uid()) on conflict do nothing;
  perform 1 from public.ielts_learners where user_id = auth.uid() for update;
  v_now := clock_timestamp();
  select * into v_form from public.ielts_test_forms where id = p_form_id;
  if not found or not v_form.is_published then raise exception 'form_not_available'; end if;
  if not public.ielts_is_premium() then raise exception 'premium_required'; end if;
  select id into v_attempt_id from public.ielts_attempts
  where user_id = auth.uid() and form_id = p_form_id and status in ('in_progress', 'awaiting_speaking')
  order by started_at desc limit 1;
  if v_attempt_id is not null then return v_attempt_id; end if;
  if v_form.purpose = 'mock' and not public.is_admin() then
    select id into v_period from public.ielts_premium_periods
    where user_id = auth.uid() and starts_at <= v_now and ends_at > v_now
    order by starts_at desc limit 1;
    if v_period is null then raise exception 'premium_required'; end if;
    if (select count(*) from public.ielts_mock_usage where period_id = v_period) >= 20 then
      raise exception 'mock_subscription_limit';
    end if;
    v_day := (v_now at time zone 'Africa/Cairo')::date;
    if exists(select 1 from public.ielts_mock_usage where user_id = auth.uid() and cairo_day = v_day) then
      raise exception 'mock_daily_limit';
    end if;
  end if;
  insert into public.ielts_attempts(user_id, form_id, status, started_at)
  values(auth.uid(), p_form_id, 'in_progress', v_now) returning id into v_attempt_id;
  if v_period is not null then
    insert into public.ielts_mock_usage(user_id, period_id, attempt_id, started_at, cairo_day)
    values(auth.uid(), v_period, v_attempt_id, v_now, v_day);
  end if;
  return v_attempt_id;
end; $$;


-- Serialize parallel subscription grants; avoid lost extensions.
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

  insert into public.ielts_learners(user_id) values(p_user) on conflict do nothing;
  perform 1 from public.ielts_learners where user_id = p_user for update;

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

-- Serialize parallel subscription grants; avoid lost extensions.
create or replace function public.ielts_redeem_code(p_code text)
returns table (
  redeemed boolean,
  type text,
  premium_expires_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_code public.ielts_redemption_codes%rowtype;
  v_expires timestamptz;
begin
  if auth.uid() is null then
    raise exception 'not_authenticated';
  end if;

  select * into v_code
  from public.ielts_redemption_codes
  where code = upper(trim(p_code))
  for update;

  if not found then
    raise exception 'code_not_found';
  end if;
  if v_code.used_by is not null then
    raise exception 'code_already_used';
  end if;
  if v_code.expires_at is not null and v_code.expires_at < now() then
    raise exception 'code_expired';
  end if;

  update public.ielts_redemption_codes
  set used_by = auth.uid(), used_at = now()
  where code = v_code.code;

  if v_code.type = 'premium' then
    insert into public.ielts_learners (user_id) values (auth.uid())
    on conflict (user_id) do nothing;

    perform 1 from public.ielts_learners where user_id = auth.uid() for update;

    select greatest(coalesce(l.premium_expires_at, now()), now())
      + make_interval(days => coalesce(v_code.duration_days, 30))
    into v_expires
    from public.ielts_learners l
    where l.user_id = auth.uid();

    update public.ielts_learners
    set premium_expires_at = v_expires
    where user_id = auth.uid();
  end if;

  return query select true, v_code.type, v_expires;
end;
$$;

commit;
