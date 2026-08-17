-- 0004_attempt_rpcs.sql
-- Attempt lifecycle. All timing decisions are made here, on the server, using
-- now() from the database clock. The client's countdown is display only and is
-- re-derived from get_attempt_state() on every page load.

-- ---------------------------------------------------------------------------
-- start_attempt
-- ---------------------------------------------------------------------------

create or replace function public.start_attempt(p_form_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_attempt_id uuid;
  v_form public.test_forms%rowtype;
  v_tier text;
begin
  if auth.uid() is null then
    raise exception 'not_authenticated';
  end if;

  select * into v_form from public.test_forms where id = p_form_id;
  if not found or not v_form.is_published then
    raise exception 'form_not_available';
  end if;

  -- Premium gating is enforced here rather than in the UI.
  if v_form.is_premium then
    select tier into v_tier from public.profiles where id = auth.uid();
    if v_tier <> 'premium' then
      raise exception 'premium_required';
    end if;
  end if;

  -- Resume rather than duplicate if this user already has this form open.
  select id into v_attempt_id
  from public.attempts
  where user_id = auth.uid()
    and form_id = p_form_id
    and status in ('in_progress', 'awaiting_speaking')
  order by started_at desc
  limit 1;

  if v_attempt_id is not null then
    return v_attempt_id;
  end if;

  insert into public.attempts (user_id, form_id, status)
  values (auth.uid(), p_form_id, 'in_progress')
  returning id into v_attempt_id;

  return v_attempt_id;
end;
$$;

-- ---------------------------------------------------------------------------
-- start_section -- stamps the authoritative deadline
-- ---------------------------------------------------------------------------

create or replace function public.start_section(
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
  v_attempt public.attempts%rowtype;
  v_limit int;
  v_now timestamptz := now();
begin
  select * into v_attempt from public.attempts where id = p_attempt_id;
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
  from public.test_sections
  where form_id = v_attempt.form_id and section = p_section;

  if v_limit is null then
    raise exception 'section_not_found';
  end if;

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

  update public.attempts
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
-- get_attempt_state -- the only source of remaining time
-- ---------------------------------------------------------------------------

create or replace function public.get_attempt_state(p_attempt_id uuid)
returns table (
  id uuid,
  form_id uuid,
  status text,
  current_section text,
  current_position int,
  section_started_at timestamptz,
  section_deadline_at timestamptz,
  remaining_seconds int,
  server_time timestamptz,
  answered_count int
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

  return query
    select
      v_attempt.id,
      v_attempt.form_id,
      v_attempt.status,
      v_attempt.current_section,
      v_attempt.current_position,
      v_attempt.section_started_at,
      v_attempt.section_deadline_at,
      case
        when v_attempt.section_deadline_at is null then null
        else greatest(0, extract(epoch from v_attempt.section_deadline_at - now()))::int
      end,
      now(),
      (select count(*)::int from public.responses r
        where r.attempt_id = p_attempt_id
          and (r.answer is not null and r.answer <> '' or r.audio_url is not null));
end;
$$;

-- ---------------------------------------------------------------------------
-- save_response -- rejects anything arriving after the deadline
-- ---------------------------------------------------------------------------

create or replace function public.save_response(
  p_attempt_id uuid,
  p_question_id uuid,
  p_answer text,
  p_time_spent_ms int default null,
  p_audio_url text default null
)
returns table (
  saved boolean,
  remaining_seconds int
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_attempt public.attempts%rowtype;
  v_now timestamptz := now();
begin
  select * into v_attempt from public.attempts where id = p_attempt_id;
  if not found then
    raise exception 'attempt_not_found';
  end if;
  if v_attempt.user_id <> auth.uid() then
    raise exception 'forbidden';
  end if;
  if v_attempt.status not in ('in_progress', 'awaiting_speaking') then
    raise exception 'attempt_not_active';
  end if;

  -- Server-side deadline enforcement. A late save is rejected outright; the
  -- client cannot talk its way past this by sending its own timestamp.
  if v_attempt.section_deadline_at is not null
     and v_now > v_attempt.section_deadline_at
  then
    raise exception 'deadline_passed';
  end if;

  -- The question must belong to the form being attempted.
  if not exists (
    select 1
    from public.questions q
    join public.item_groups g on g.id = q.group_id
    join public.test_sections s on s.id = g.section_id
    where q.id = p_question_id and s.form_id = v_attempt.form_id
  ) then
    raise exception 'question_not_in_form';
  end if;

  insert into public.responses (
    attempt_id, question_id, answer, audio_url, time_spent_ms, answered_at
  )
  values (
    p_attempt_id, p_question_id, p_answer, p_audio_url, p_time_spent_ms, v_now
  )
  on conflict (attempt_id, question_id) do update
    set answer = excluded.answer,
        audio_url = coalesce(excluded.audio_url, public.responses.audio_url),
        time_spent_ms = excluded.time_spent_ms,
        answered_at = excluded.answered_at;

  perform set_config('app.allow_timing_write', '1', true);
  update public.attempts set last_heartbeat_at = v_now where id = p_attempt_id;

  return query
    select true,
      case
        when v_attempt.section_deadline_at is null then null
        else greatest(0, extract(epoch from v_attempt.section_deadline_at - v_now))::int
      end;
end;
$$;

-- ---------------------------------------------------------------------------
-- heartbeat -- called every 30s; also the client's clock resync
-- ---------------------------------------------------------------------------

create or replace function public.heartbeat(
  p_attempt_id uuid,
  p_current_position int default null
)
returns table (
  remaining_seconds int,
  status text,
  server_time timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_attempt public.attempts%rowtype;
  v_now timestamptz := now();
begin
  select * into v_attempt from public.attempts where id = p_attempt_id;
  if not found then
    raise exception 'attempt_not_found';
  end if;
  if v_attempt.user_id <> auth.uid() then
    raise exception 'forbidden';
  end if;

  perform set_config('app.allow_timing_write', '1', true);
  update public.attempts
  set last_heartbeat_at = v_now,
      current_position = coalesce(p_current_position, current_position)
  where id = p_attempt_id;

  return query
    select
      case
        when v_attempt.section_deadline_at is null then null
        else greatest(0, extract(epoch from v_attempt.section_deadline_at - v_now))::int
      end,
      v_attempt.status,
      v_now;
end;
$$;

-- ---------------------------------------------------------------------------
-- redeem_code
-- ---------------------------------------------------------------------------

create or replace function public.redeem_code(p_code text)
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
  v_code public.redemption_codes%rowtype;
  v_expires timestamptz;
begin
  if auth.uid() is null then
    raise exception 'not_authenticated';
  end if;

  select * into v_code
  from public.redemption_codes
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

  update public.redemption_codes
  set used_by = auth.uid(), used_at = now()
  where code = v_code.code;

  if v_code.type = 'premium' then
    select greatest(coalesce(premium_expires_at, now()), now())
      + make_interval(days => coalesce(v_code.duration_days, 30))
    into v_expires
    from public.profiles
    where id = auth.uid();

    update public.profiles
    set tier = 'premium', premium_expires_at = v_expires
    where id = auth.uid();
  end if;

  return query select true, v_code.type, v_expires;
end;
$$;

-- ---------------------------------------------------------------------------
-- Grants. Everything here is SECURITY DEFINER, so execute rights are the
-- access control surface.
-- ---------------------------------------------------------------------------

revoke all on function public.start_attempt(uuid) from public, anon;
revoke all on function public.start_section(uuid, text) from public, anon;
revoke all on function public.get_attempt_state(uuid) from public, anon;
revoke all on function public.save_response(uuid, uuid, text, int, text) from public, anon;
revoke all on function public.heartbeat(uuid, int) from public, anon;
revoke all on function public.redeem_code(text) from public, anon;

grant execute on function public.start_attempt(uuid) to authenticated;
grant execute on function public.start_section(uuid, text) to authenticated;
grant execute on function public.get_attempt_state(uuid) to authenticated;
grant execute on function public.save_response(uuid, uuid, text, int, text) to authenticated;
grant execute on function public.heartbeat(uuid, int) to authenticated;
grant execute on function public.redeem_code(text) to authenticated;
