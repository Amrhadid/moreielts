-- 0002_row_level_security.sql
-- RLS is enabled on every table. Anything not matched by a policy below is
-- denied; the service role bypasses RLS and is the only writer of marks and
-- scores.

alter table public.ielts_profiles          enable row level security;
alter table public.ielts_question_types    enable row level security;
alter table public.ielts_test_forms        enable row level security;
alter table public.ielts_test_sections     enable row level security;
alter table public.ielts_item_groups       enable row level security;
alter table public.ielts_questions         enable row level security;
alter table public.ielts_attempts          enable row level security;
alter table public.ielts_responses         enable row level security;
alter table public.ielts_attempt_scores    enable row level security;
alter table public.ielts_writing_scores    enable row level security;
alter table public.ielts_speaking_scores   enable row level security;
alter table public.ielts_band_conversion   enable row level security;
alter table public.ielts_redemption_codes  enable row level security;
alter table public.ielts_ai_grading_usage  enable row level security;

-- ---------------------------------------------------------------------------
-- profiles: own row read/write, admins read everything
-- ---------------------------------------------------------------------------

drop policy if exists profiles_select_own on public.ielts_profiles;
create policy profiles_select_own on public.ielts_profiles
  for select to authenticated
  using (id = auth.uid() or public.ielts_is_admin());

drop policy if exists profiles_update_own on public.ielts_profiles;
create policy profiles_update_own on public.ielts_profiles
  for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- Note: role and tier are deliberately NOT user-writable. A user updating their
-- own row can change name and target band; privilege columns are locked by the
-- trigger below rather than by the policy, which cannot see the old row.
create or replace function public.ielts_protect_profile_privileges()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Exempt: an existing admin acting through the app, the service role, and a
  -- direct SQL session (auth.uid() is null), which is how the first admin is
  -- promoted. Anonymous PostgREST callers hold no UPDATE grant on profiles, so
  -- the null-uid branch cannot be reached from the client.
  if public.ielts_is_admin()
     or current_user = 'service_role'
     or auth.uid() is null
  then
    return new;
  end if;
  new.role := old.role;
  new.tier := old.tier;
  new.premium_expires_at := old.premium_expires_at;
  return new;
end;
$$;

drop trigger if exists profiles_protect_privileges on public.ielts_profiles;
create trigger profiles_protect_privileges
  before update on public.ielts_profiles
  for each row execute function public.ielts_protect_profile_privileges();

drop policy if exists profiles_admin_all on public.ielts_profiles;
create policy profiles_admin_all on public.ielts_profiles
  for all to authenticated
  using (public.ielts_is_admin())
  with check (public.ielts_is_admin());

-- ---------------------------------------------------------------------------
-- Reference tables: readable by any signed-in user, writable by admins
-- ---------------------------------------------------------------------------

drop policy if exists question_types_read on public.ielts_question_types;
create policy question_types_read on public.ielts_question_types
  for select to authenticated
  using (true);

drop policy if exists question_types_admin_write on public.ielts_question_types;
create policy question_types_admin_write on public.ielts_question_types
  for all to authenticated
  using (public.ielts_is_admin())
  with check (public.ielts_is_admin());

drop policy if exists band_conversion_read on public.ielts_band_conversion;
create policy band_conversion_read on public.ielts_band_conversion
  for select to authenticated
  using (true);

drop policy if exists band_conversion_admin_write on public.ielts_band_conversion;
create policy band_conversion_admin_write on public.ielts_band_conversion
  for all to authenticated
  using (public.ielts_is_admin())
  with check (public.ielts_is_admin());

-- ---------------------------------------------------------------------------
-- Content: authenticated users see published forms only
-- ---------------------------------------------------------------------------

drop policy if exists test_forms_read_published on public.ielts_test_forms;
create policy test_forms_read_published on public.ielts_test_forms
  for select to authenticated
  using (is_published or public.ielts_is_admin());

drop policy if exists test_forms_admin_write on public.ielts_test_forms;
create policy test_forms_admin_write on public.ielts_test_forms
  for all to authenticated
  using (public.ielts_is_admin())
  with check (public.ielts_is_admin());

drop policy if exists test_sections_read_published on public.ielts_test_sections;
create policy test_sections_read_published on public.ielts_test_sections
  for select to authenticated
  using (
    public.ielts_is_admin()
    or exists (
      select 1 from public.ielts_test_forms f
      where f.id = ielts_test_sections.form_id and f.is_published
    )
  );

drop policy if exists test_sections_admin_write on public.ielts_test_sections;
create policy test_sections_admin_write on public.ielts_test_sections
  for all to authenticated
  using (public.ielts_is_admin())
  with check (public.ielts_is_admin());

drop policy if exists item_groups_read_published on public.ielts_item_groups;
create policy item_groups_read_published on public.ielts_item_groups
  for select to authenticated
  using (
    public.ielts_is_admin()
    or exists (
      select 1
      from public.ielts_test_sections s
      join public.ielts_test_forms f on f.id = s.form_id
      where s.id = ielts_item_groups.section_id and f.is_published
    )
  );

drop policy if exists item_groups_admin_write on public.ielts_item_groups;
create policy item_groups_admin_write on public.ielts_item_groups
  for all to authenticated
  using (public.ielts_is_admin())
  with check (public.ielts_is_admin());

-- questions: ADMIN ONLY, for every operation including SELECT.
--
-- The base table holds accepted_answers, so no candidate may read it at any
-- point. Candidates read questions through public.ielts_questions_public (migration
-- 0003), a view that does not project the answer columns, and read the answers
-- after submission through the ielts_get_attempt_review() RPC.
drop policy if exists questions_admin_all on public.ielts_questions;
create policy questions_admin_all on public.ielts_questions
  for all to authenticated
  using (public.ielts_is_admin())
  with check (public.ielts_is_admin());

-- ---------------------------------------------------------------------------
-- attempts and responses: own rows only
-- ---------------------------------------------------------------------------

drop policy if exists attempts_select_own on public.ielts_attempts;
create policy attempts_select_own on public.ielts_attempts
  for select to authenticated
  using (user_id = auth.uid() or public.ielts_is_admin());

drop policy if exists attempts_insert_own on public.ielts_attempts;
create policy attempts_insert_own on public.ielts_attempts
  for insert to authenticated
  with check (user_id = auth.uid());

-- Direct updates are allowed only for the non-timing columns; the timing
-- columns are forced back to their stored values by the trigger below, so a
-- client cannot extend its own deadline.
drop policy if exists attempts_update_own on public.ielts_attempts;
create policy attempts_update_own on public.ielts_attempts
  for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create or replace function public.ielts_protect_attempt_timing()
returns trigger
language plpgsql
as $$
begin
  -- The timing RPCs in 0004 set this transaction-local flag before writing the
  -- deadline columns; the service role (which bypasses RLS entirely) is exempt
  -- too. Every other caller keeps the stored values, so a client cannot extend
  -- its own deadline by updating the row directly.
  -- Only the service role is exempt outright. Note that 'postgres' is NOT
  -- exempt: the timing RPCs are SECURITY DEFINER and therefore run as the
  -- function owner, so exempting the owner would let them skip the flag and
  -- leave it set for whatever the client ran next in the same transaction.
  if current_user = 'service_role' then
    return new;
  end if;

  if coalesce(current_setting('app.allow_timing_write', true), '') = '1' then
    -- Single use: consume the flag immediately so it authorises exactly the
    -- one UPDATE the calling RPC is about to perform. Without this, any later
    -- statement in the same transaction would inherit the permission and a
    -- client could extend its own deadline right after any RPC call.
    perform set_config('app.allow_timing_write', '0', true);
    return new;
  end if;
  new.section_started_at := old.section_started_at;
  new.section_deadline_at := old.section_deadline_at;
  new.started_at := old.started_at;
  new.submitted_at := old.submitted_at;
  return new;
end;
$$;

drop trigger if exists attempts_protect_timing on public.ielts_attempts;
create trigger attempts_protect_timing
  before update on public.ielts_attempts
  for each row execute function public.ielts_protect_attempt_timing();

drop policy if exists responses_select_own on public.ielts_responses;
create policy responses_select_own on public.ielts_responses
  for select to authenticated
  using (
    public.ielts_is_admin()
    or exists (
      select 1 from public.ielts_attempts a
      where a.id = ielts_responses.attempt_id and a.user_id = auth.uid()
    )
  );

-- Responses are written through ielts_save_response() so the deadline is enforced.
-- No direct INSERT or UPDATE policy exists for authenticated users.

-- ---------------------------------------------------------------------------
-- Score tables: user reads own, only the service role writes
-- ---------------------------------------------------------------------------

drop policy if exists attempt_scores_select_own on public.ielts_attempt_scores;
create policy attempt_scores_select_own on public.ielts_attempt_scores
  for select to authenticated
  using (
    public.ielts_is_admin()
    or exists (
      select 1 from public.ielts_attempts a
      where a.id = ielts_attempt_scores.attempt_id and a.user_id = auth.uid()
    )
  );

drop policy if exists writing_scores_select_own on public.ielts_writing_scores;
create policy writing_scores_select_own on public.ielts_writing_scores
  for select to authenticated
  using (
    public.ielts_is_admin()
    or exists (
      select 1 from public.ielts_attempts a
      where a.id = ielts_writing_scores.attempt_id and a.user_id = auth.uid()
    )
  );

drop policy if exists speaking_scores_select_own on public.ielts_speaking_scores;
create policy speaking_scores_select_own on public.ielts_speaking_scores
  for select to authenticated
  using (
    public.ielts_is_admin()
    or exists (
      select 1 from public.ielts_attempts a
      where a.id = ielts_speaking_scores.attempt_id and a.user_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- redemption_codes: admin only. Redemption happens through ielts_redeem_code().
-- ---------------------------------------------------------------------------

drop policy if exists redemption_codes_admin_all on public.ielts_redemption_codes;
create policy redemption_codes_admin_all on public.ielts_redemption_codes
  for all to authenticated
  using (public.ielts_is_admin())
  with check (public.ielts_is_admin());

-- ---------------------------------------------------------------------------
-- ai_grading_usage: user reads own rows; only the service role writes.
-- ---------------------------------------------------------------------------

drop policy if exists ai_grading_usage_select_own on public.ielts_ai_grading_usage;
create policy ai_grading_usage_select_own on public.ielts_ai_grading_usage
  for select to authenticated
  using (user_id = auth.uid() or public.ielts_is_admin());

-- ---------------------------------------------------------------------------
-- Table privileges
-- ---------------------------------------------------------------------------
-- RLS filters rows; GRANT decides who may attempt the operation at all. Being
-- explicit here rather than relying on Supabase's default grants means anon
-- holds nothing, and the questions base table is not even grantable to a
-- candidate role.

revoke all on all tables in schema public from anon;
revoke all on all sequences in schema public from anon;

-- The service role writes marks and scores and is exempt from RLS. It is
-- granted explicitly so the marking function works on a project where the
-- default grants have been tightened.
grant all on all tables in schema public to service_role;

grant select on
  public.ielts_profiles,
  public.ielts_question_types,
  public.ielts_test_forms,
  public.ielts_test_sections,
  public.ielts_item_groups,
  public.ielts_questions,
  public.ielts_attempts,
  public.ielts_responses,
  public.ielts_attempt_scores,
  public.ielts_writing_scores,
  public.ielts_speaking_scores,
  public.ielts_band_conversion,
  public.ielts_redemption_codes,
  public.ielts_ai_grading_usage
to authenticated;

-- Candidates create and update their own attempts (the timing trigger keeps
-- the clock columns server-owned).
grant insert, update on public.ielts_attempts to authenticated;
grant update on public.ielts_profiles to authenticated;

-- Admin writes to content and reference tables. These are gated by the
-- ielts_is_admin() policies above; the grant only makes the attempt possible.
grant insert, update, delete on
  public.ielts_test_forms,
  public.ielts_test_sections,
  public.ielts_item_groups,
  public.ielts_questions,
  public.ielts_question_types,
  public.ielts_band_conversion,
  public.ielts_redemption_codes
to authenticated;

-- responses, attempt_scores, writing_scores and speaking_scores are
-- deliberately SELECT-only for authenticated: they are written by
-- ielts_save_response() and by the service-role marking function.
