-- supabase/tests/rls_test.sql
--
-- Exercises the security properties the schema is supposed to guarantee.
-- Run against a scratch database that has the migrations applied:
--
--   psql -d moreielts -v ON_ERROR_STOP=1 -f supabase/tests/rls_test.sql
--
-- Every check raises on failure, so a clean run means all assertions passed.

\set QUIET on
set client_min_messages = notice;

do $$
declare
  v_admin uuid := '11111111-1111-1111-1111-111111111111';
  v_alice uuid := '22222222-2222-2222-2222-222222222222';
  v_bob   uuid := '33333333-3333-3333-3333-333333333333';
  v_form uuid;
  v_draft uuid;
  v_section uuid;
  v_group uuid;
  v_question uuid;
  v_attempt uuid;
  v_count int;
  v_remaining int;
  v_ok boolean;
begin
  -- ---------------------------------------------------------------- setup
  insert into auth.users (id, email) values
    (v_admin, 'admin@example.com'),
    (v_alice, 'alice@example.com'),
    (v_bob, 'bob@example.com');

  -- The signup trigger should have created three profiles.
  select count(*) into v_count from public.profiles;
  if v_count <> 3 then
    raise exception 'FAIL: signup trigger did not create profiles (got %)', v_count;
  end if;

  update public.profiles set role = 'admin' where id = v_admin;

  insert into public.test_forms (id, title, variant, is_published, created_by)
  values (gen_random_uuid(), 'Published Academic Form', 'academic', true, v_admin)
  returning id into v_form;

  insert into public.test_forms (title, variant, is_published, created_by)
  values ('Unpublished Draft', 'academic', false, v_admin)
  returning id into v_draft;

  insert into public.test_sections (form_id, section, time_limit_seconds, question_count)
  values (v_form, 'reading', 3600, 1)
  returning id into v_section;

  insert into public.item_groups (section_id, part_number, passage_text)
  values (v_section, 1, 'A passage.')
  returning id into v_group;

  insert into public.questions (group_id, type_code, prompt, accepted_answers, word_limit)
  values (v_group, 'short_answer', 'What holds the wing open?', array['tendon'], 2)
  returning id into v_question;

  raise notice 'setup complete';
end;
$$;

-- ---------------------------------------------------------------------------
-- Act as Alice, an ordinary authenticated user.
-- ---------------------------------------------------------------------------
set role authenticated;
set request.jwt.claim.sub = '22222222-2222-2222-2222-222222222222';

do $$
declare
  v_count int;
  v_form uuid;
  v_question uuid;
  v_attempt uuid;
  v_remaining int;
  v_failed boolean;
begin
  -- 1. A user sees only their own profile.
  select count(*) into v_count from public.profiles;
  if v_count <> 1 then
    raise exception 'FAIL: user can see % profiles, expected 1', v_count;
  end if;

  -- 2. A user sees published forms only. Asserted as "no unpublished rows are
  --    visible" rather than an exact count, so seeding more forms cannot make
  --    this pass or fail spuriously.
  select count(*) into v_count from public.test_forms where not is_published;
  if v_count <> 0 then
    raise exception 'FAIL: user can see % unpublished forms', v_count;
  end if;
  select count(*) into v_count from public.test_forms;
  if v_count < 1 then
    raise exception 'FAIL: user cannot see any published form';
  end if;
  select id into v_form from public.test_forms
  where title = 'Published Academic Form' limit 1;

  -- 3. The questions base table is invisible: accepted_answers can never be
  --    read by a candidate, at any point in an attempt.
  select count(*) into v_count from public.questions;
  if v_count <> 0 then
    raise exception 'FAIL: candidate can read % rows of questions', v_count;
  end if;

  -- 4. The candidate-safe view IS readable, and carries no answer column.
  select count(*) into v_count from public.questions_public;
  if v_count < 1 then
    raise exception 'FAIL: questions_public returned no rows';
  end if;
  if exists (
    select 1 from information_schema.columns
    where table_name = 'questions_public'
      and column_name in ('accepted_answers', 'scoring_rules')
  ) then
    raise exception 'FAIL: questions_public exposes an answer column';
  end if;
  select q.id into v_question
  from public.questions_public q
  join public.item_groups g on g.id = q.group_id
  join public.test_sections s on s.id = g.section_id
  where s.form_id = v_form limit 1;

  -- 5. Attempt lifecycle.
  v_attempt := public.start_attempt(v_form);
  select remaining_seconds into v_remaining
  from public.start_section(v_attempt, 'reading');
  if v_remaining <> 3600 then
    raise exception 'FAIL: start_section returned % seconds, expected 3600', v_remaining;
  end if;

  -- 6. start_attempt resumes rather than duplicating.
  if public.start_attempt(v_form) <> v_attempt then
    raise exception 'FAIL: start_attempt created a second open attempt';
  end if;

  -- 7. Saving a response works before the deadline.
  perform public.save_response(v_attempt, v_question, 'tendon', 1200);
  select count(*) into v_count from public.responses where attempt_id = v_attempt;
  if v_count <> 1 then
    raise exception 'FAIL: response not saved';
  end if;

  -- 8. The client cannot mark its own answer. responses is SELECT-only for
  --    authenticated, so the write is refused outright; if a future migration
  --    granted UPDATE, the missing policy would still make it a no-op. Accept
  --    either outcome, but never a successful mark.
  begin
    update public.responses set is_correct = true where attempt_id = v_attempt;
  exception when insufficient_privilege then
    null;
  end;
  if exists (
    select 1 from public.responses
    where attempt_id = v_attempt and is_correct is true
  ) then
    raise exception 'FAIL: candidate marked their own response correct';
  end if;

  -- 9. Answers are withheld until the attempt is submitted.
  v_failed := false;
  begin
    perform * from public.get_attempt_review(v_attempt);
  exception when others then
    v_failed := true;
    if sqlerrm not like '%attempt_not_submitted%' then
      raise exception 'FAIL: unexpected review error: %', sqlerrm;
    end if;
  end;
  if not v_failed then
    raise exception 'FAIL: review released answers for an unsubmitted attempt';
  end if;

  -- 10. A user cannot extend their own deadline by updating the row.
  update public.attempts
  set section_deadline_at = now() + interval '10 hours'
  where id = v_attempt;
  if exists (
    select 1 from public.attempts
    where id = v_attempt and section_deadline_at > now() + interval '2 hours'
  ) then
    raise exception 'FAIL: candidate extended their own deadline';
  end if;

  -- 11. A user cannot promote themselves to admin or to premium.
  update public.profiles set role = 'admin', tier = 'premium' where id = auth.uid();
  if exists (
    select 1 from public.profiles
    where id = auth.uid() and (role = 'admin' or tier = 'premium')
  ) then
    raise exception 'FAIL: candidate escalated their own privileges';
  end if;

  raise notice 'candidate checks passed';
end;
$$;

-- ---------------------------------------------------------------------------
-- Deadline enforcement: expire the section, then try to save.
-- ---------------------------------------------------------------------------
-- Expire the section as the service role, which is the only caller allowed to
-- write the timing columns directly.
reset role;
set role service_role;
update public.attempts set section_deadline_at = now() - interval '1 second';
reset role;

set role authenticated;
set request.jwt.claim.sub = '22222222-2222-2222-2222-222222222222';

do $$
declare
  v_attempt uuid;
  v_question uuid;
  v_failed boolean := false;
begin
  select id into v_attempt from public.attempts limit 1;
  -- The question already answered in this attempt, so the only thing under
  -- test here is the deadline.
  select r.question_id into v_question
  from public.responses r
  where r.attempt_id = v_attempt limit 1;

  begin
    perform public.save_response(v_attempt, v_question, 'late answer', 100);
  exception when others then
    v_failed := true;
    if sqlerrm not like '%deadline_passed%' then
      raise exception 'FAIL: unexpected save error: %', sqlerrm;
    end if;
  end;

  if not v_failed then
    raise exception 'FAIL: a response was accepted after the deadline';
  end if;

  -- The earlier answer must be untouched by the rejected write.
  if exists (
    select 1 from public.responses
    where attempt_id = v_attempt and answer = 'late answer'
  ) then
    raise exception 'FAIL: late answer was persisted';
  end if;

  raise notice 'deadline enforcement passed';
end;
$$;

-- ---------------------------------------------------------------------------
-- Cross-user isolation: Bob must not see Alice's attempt.
-- ---------------------------------------------------------------------------
set request.jwt.claim.sub = '33333333-3333-3333-3333-333333333333';

do $$
declare
  v_count int;
  v_attempt uuid;
  v_failed boolean := false;
begin
  select count(*) into v_count from public.attempts;
  if v_count <> 0 then
    raise exception 'FAIL: Bob can see % of Alice''s attempts', v_count;
  end if;

  select count(*) into v_count from public.responses;
  if v_count <> 0 then
    raise exception 'FAIL: Bob can see % of Alice''s responses', v_count;
  end if;

  reset role;
  select id into v_attempt from public.attempts limit 1;
  set role authenticated;
  set request.jwt.claim.sub = '33333333-3333-3333-3333-333333333333';

  begin
    perform public.save_response(v_attempt, (select id from public.questions_public limit 1), 'x');
  exception when others then
    v_failed := true;
    if sqlerrm not like '%forbidden%' then
      raise exception 'FAIL: unexpected cross-user error: %', sqlerrm;
    end if;
  end;
  if not v_failed then
    raise exception 'FAIL: Bob wrote a response into Alice''s attempt';
  end if;

  raise notice 'cross-user isolation passed';
end;
$$;

-- ---------------------------------------------------------------------------
-- Review is released once the attempt is submitted.
-- ---------------------------------------------------------------------------
-- Submission is performed by the marking Edge Function as the service role.
reset role;
set role service_role;
update public.attempts set status = 'completed', submitted_at = now();
reset role;

set role authenticated;
set request.jwt.claim.sub = '22222222-2222-2222-2222-222222222222';

do $$
declare
  v_attempt uuid;
  v_answers text[];
begin
  select id into v_attempt from public.attempts limit 1;
  select accepted_answers into v_answers
  from public.get_attempt_review(v_attempt) limit 1;

  if v_answers is null or array_length(v_answers, 1) <> 1 then
    raise exception 'FAIL: review did not return accepted answers after submission';
  end if;

  raise notice 'post-submission review passed';
end;
$$;

-- ---------------------------------------------------------------------------
-- Admin visibility.
-- ---------------------------------------------------------------------------
set request.jwt.claim.sub = '11111111-1111-1111-1111-111111111111';

do $$
declare
  v_count int;
begin
  select count(*) into v_count from public.profiles;
  if v_count <> 3 then
    raise exception 'FAIL: admin sees % profiles, expected 3', v_count;
  end if;

  -- The admin must see the draft that candidates cannot.
  select count(*) into v_count from public.test_forms where not is_published;
  if v_count < 1 then
    raise exception 'FAIL: admin cannot see the unpublished draft';
  end if;

  select count(*) into v_count from public.questions;
  if v_count < 1 then
    raise exception 'FAIL: admin cannot read the questions table';
  end if;

  raise notice 'admin checks passed';
end;
$$;

reset role;

-- ---------------------------------------------------------------------------
-- Seed data sanity.
-- ---------------------------------------------------------------------------
do $$
declare
  v_count int;
begin
  select count(*) into v_count from public.question_types;
  if v_count <> 15 then
    raise exception 'FAIL: expected 15 question types, found %', v_count;
  end if;

  select count(distinct renderer) into v_count from public.question_types;
  if v_count <> 4 then
    raise exception 'FAIL: expected 4 distinct renderers, found %', v_count;
  end if;

  select count(*) into v_count from public.band_conversion where version = 'v1';
  if v_count < 60 then
    raise exception 'FAIL: band_conversion looks incomplete (% rows)', v_count;
  end if;

  raise notice 'seed data passed';
  raise notice 'ALL RLS TESTS PASSED';
end;
$$;
