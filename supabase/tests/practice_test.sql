-- supabase/tests/practice_test.sql
--
-- Security checks for migrations 0008-0011: scripts stay admin-only, score
-- and log tables are not client-writable, the essay RPC enforces its limits,
-- and the payment grant is service-role only. Runs after rls_test.sql (it
-- reuses Alice and Bob). Every failed check raises.

\set QUIET on
set client_min_messages = notice;
reset role;

do $$
declare
  v_group uuid;
begin
  select id into v_group from public.ielts_item_groups where passage_text = 'A passage.' limit 1;
  insert into public.ielts_item_group_scripts (group_id, transcript)
  values (v_group, 'SPEAKER: the answer is tendon');
  raise notice 'practice setup complete';
end;
$$;

set role authenticated;
set request.jwt.claim.sub = '22222222-2222-2222-2222-222222222222';

do $$
declare
  v_count int;
  v_failed boolean;
  v_essay uuid;
  v_alice uuid := '22222222-2222-2222-2222-222222222222';
  v_question uuid;
begin
  -- Listening scripts contain every answer: candidates must not read them.
  select count(*) into v_count from public.ielts_item_group_scripts;
  if v_count <> 0 then
    raise exception 'FAIL: candidate can read item_group_scripts';
  end if;

  -- Server-written tables reject client writes.
  select id into v_question from public.ielts_questions_public limit 1;
  v_failed := false;
  begin
    insert into public.ielts_mistakes (user_id, question_id) values (v_alice, v_question);
  exception when others then v_failed := true; end;
  if not v_failed then raise exception 'FAIL: candidate inserted into mistakes'; end if;

  v_failed := false;
  begin
    insert into public.ielts_activity_log (user_id, kind, minutes) values (v_alice, 'drill', 500);
  exception when others then v_failed := true; end;
  if not v_failed then raise exception 'FAIL: candidate faked activity'; end if;

  v_failed := false;
  begin
    insert into public.ielts_writing_submissions (user_id, task_number, prompt, body, task_band, status)
    values (v_alice, 2, 'p', 'b', 9, 'graded');
  exception when others then v_failed := true; end;
  if not v_failed then raise exception 'FAIL: candidate wrote a graded essay directly'; end if;

  v_failed := false;
  begin
    perform public.ielts_grant_paid_premium('cs_fake', v_alice, 'month', 30, 0, 'usd');
  exception when others then v_failed := true; end;
  if not v_failed then raise exception 'FAIL: candidate granted themselves premium'; end if;

  v_failed := false;
  begin
    perform * from public.ielts_claim_grading_jobs(5, null);
  exception when others then v_failed := true; end;
  if not v_failed then raise exception 'FAIL: candidate can claim grading jobs'; end if;

  -- The essay RPC queues a job and enforces the free weekly limit.
  v_essay := public.ielts_submit_essay(2, 'Discuss both views.', 'Some people think...');
  select count(*) into v_count from public.ielts_grading_jobs where submission_id = v_essay;
  if v_count <> 1 then raise exception 'FAIL: submit_essay did not queue a job'; end if;
  perform public.ielts_submit_essay(2, 'Discuss both views.', 'Draft two');
  perform public.ielts_submit_essay(2, 'Discuss both views.', 'Draft three');
  v_failed := false;
  begin
    perform public.ielts_submit_essay(2, 'Discuss both views.', 'Draft four');
  exception when others then v_failed := sqlerrm = 'essay_limit_reached_free'; end;
  if not v_failed then raise exception 'FAIL: free essay limit not enforced'; end if;

  -- Vocabulary marks: own rows only, and the activity trigger fires.
  insert into public.ielts_vocab_learned (user_id, word_slug) values (v_alice, 'mitigate');
  v_failed := false;
  begin
    insert into public.ielts_vocab_learned (user_id, word_slug)
    values ('33333333-3333-3333-3333-333333333333', 'mitigate');
  exception when others then v_failed := true; end;
  if not v_failed then raise exception 'FAIL: candidate marked a word for another user'; end if;

  if (public.ielts_get_learning_stats('UTC') ->> 'streak')::int < 1 then
    raise exception 'FAIL: activity did not start a streak';
  end if;

  -- Analytics are admin-only.
  v_failed := false;
  begin
    perform public.ielts_admin_analytics(30);
  exception when others then v_failed := true; end;
  if not v_failed then raise exception 'FAIL: candidate read admin analytics'; end if;

  raise notice 'practice checks passed';
end;
$$;

-- Bob cannot see Alice's essays or jobs.
set request.jwt.claim.sub = '33333333-3333-3333-3333-333333333333';
do $$
declare
  v_count int;
begin
  select count(*) into v_count from public.ielts_writing_submissions;
  if v_count <> 0 then raise exception 'FAIL: essays leak across users'; end if;
  select count(*) into v_count from public.ielts_grading_jobs;
  if v_count <> 0 then raise exception 'FAIL: grading jobs leak across users'; end if;
  select count(*) into v_count from public.ielts_vocab_learned;
  if v_count <> 0 then raise exception 'FAIL: vocab marks leak across users'; end if;
  raise notice 'practice isolation passed';
end;
$$;

-- Admin sees analytics.
set request.jwt.claim.sub = '11111111-1111-1111-1111-111111111111';
do $$
begin
  if (public.ielts_admin_analytics(30) -> 'totals' ->> 'essays')::int <> 3 then
    raise exception 'FAIL: analytics essay total wrong';
  end if;
  raise notice 'ALL PRACTICE TESTS PASSED';
end;
$$;
