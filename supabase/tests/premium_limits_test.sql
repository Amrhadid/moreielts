-- Isolated fixture, rolled back so it can be rerun.
begin;
insert into auth.users(id,email) values ('77777777-7777-7777-7777-777777777777','limits@example.test');
insert into public.ielts_learners(user_id,premium_expires_at) values ('77777777-7777-7777-7777-777777777777',now()+interval '40 days');
insert into public.ielts_test_forms(id,title,variant,is_published,purpose) values
('aaaaaaaa-7777-7777-7777-777777777771','Limit mock A','academic',true,'mock'),
('aaaaaaaa-7777-7777-7777-777777777772','Limit mock B','academic',true,'mock'),
('aaaaaaaa-7777-7777-7777-777777777773','Limit practice','academic',true,'practice');
set local role authenticated;
set local request.jwt.claim.sub = '77777777-7777-7777-7777-777777777777';
do $$
declare a uuid; b uuid;
begin
  a := public.ielts_start_attempt('aaaaaaaa-7777-7777-7777-777777777771');
  b := public.ielts_start_attempt('aaaaaaaa-7777-7777-7777-777777777771');
  if a <> b then raise exception 'FAIL resume'; end if;
  begin
    perform public.ielts_start_attempt('aaaaaaaa-7777-7777-7777-777777777772');
    raise exception 'FAIL daily limit';
  exception when raise_exception then if sqlerrm <> 'mock_daily_limit' then raise; end if; end;
  perform public.ielts_start_attempt('aaaaaaaa-7777-7777-7777-777777777773');
  begin
    insert into public.ielts_attempts(user_id,form_id) values(auth.uid(),'aaaaaaaa-7777-7777-7777-777777777772');
    raise exception 'FAIL direct insert';
  exception when insufficient_privilege then null; end;
  update public.ielts_attempts set form_id='aaaaaaaa-7777-7777-7777-777777777772' where id=a;
  if (select form_id from public.ielts_attempts where id=a) <> 'aaaaaaaa-7777-7777-7777-777777777771' then raise exception 'FAIL form swap'; end if;
  update public.ielts_attempts set status='abandoned' where id=a;
  update public.ielts_attempts set status='in_progress' where id=a;
  if (select status from public.ielts_attempts where id=a) <> 'abandoned' then raise exception 'FAIL reopen'; end if;
  begin
    perform public.ielts_start_attempt('aaaaaaaa-7777-7777-7777-777777777771');
    raise exception 'FAIL abandoned refunds';
  exception when raise_exception then if sqlerrm <> 'mock_daily_limit' then raise; end if; end;
  if (select count(*) from public.ielts_mock_usage) <> 1 then raise exception 'FAIL usage count'; end if;
  raise notice 'PASS daily, resume, practice, abandoned, direct insert, identity, reopening';
end; $$;
reset role;
-- Simulate 19 earlier days, leaving today charged. No time-dependent sleeps.
insert into public.ielts_mock_usage(user_id,period_id,started_at,cairo_day)
select p.user_id,p.id,now()-make_interval(days=>n),(now() at time zone 'Africa/Cairo')::date-n
from public.ielts_premium_periods p cross join generate_series(1,19) n where p.user_id='77777777-7777-7777-7777-777777777777';
set local role authenticated;
do $$ begin
  begin
    perform public.ielts_start_attempt('aaaaaaaa-7777-7777-7777-777777777772');
    raise exception 'FAIL 20 cap';
  exception when raise_exception then if sqlerrm <> 'mock_subscription_limit' then raise; end if; end;
  raise notice 'PASS subscription cap';
end; $$;
reset role;
-- The 20th start is allowed, not only the 21st denied.
reset role;
delete from public.ielts_mock_usage where user_id='77777777-7777-7777-7777-777777777777'
  and cairo_day=(now() at time zone 'Africa/Cairo')::date;
set local role authenticated;
select public.ielts_start_attempt('aaaaaaaa-7777-7777-7777-777777777772');
do $$ begin
  if (select count(*) from public.ielts_mock_usage) <> 20 then raise exception 'FAIL twentieth start'; end if;
  raise notice 'PASS twentieth start allowed';
end; $$;
reset role;
-- Concurrent paid/code extensions use learner row locks. Verify sequential
-- grants are queued, idempotent and do not refill the current period.
select public.ielts_grant_paid_premium('limits-session','77777777-7777-7777-7777-777777777777','premium',30,100,'usd');
select public.ielts_grant_paid_premium('limits-session','77777777-7777-7777-7777-777777777777','premium',30,100,'usd');
do $$ begin
  if (select count(*) from public.ielts_premium_periods where user_id='77777777-7777-7777-7777-777777777777') <> 2 then raise exception 'FAIL renewal periods'; end if;
  if (select sum(ends_at-starts_at) from public.ielts_premium_periods where user_id='77777777-7777-7777-7777-777777777777') <> interval '70 days' then raise exception 'FAIL renewal duration'; end if;
  if (select ('2026-11-23 21:59:59Z'::timestamptz at time zone 'Africa/Cairo')::date) <> date '2026-11-23'
     or (select ('2026-11-23 22:00:00Z'::timestamptz at time zone 'Africa/Cairo')::date) <> date '2026-11-24' then raise exception 'FAIL Cairo midnight'; end if;
  -- During summer Cairo observes UTC+3, not a fixed UTC offset.
  if (select ('2026-07-01 21:00:00Z'::timestamptz at time zone 'Africa/Cairo')::date) <> date '2026-07-02' then raise exception 'FAIL Cairo DST'; end if;
  raise notice 'PASS renewal idempotency, queuing, Cairo midnight and DST';
end; $$;
-- A queued renewal does not unlock the exhausted active period.
set local role authenticated;
do $$ begin
  begin
    perform public.ielts_start_attempt('aaaaaaaa-7777-7777-7777-777777777771');
    raise exception 'FAIL early renewal reset';
  exception when raise_exception then if sqlerrm <> 'mock_subscription_limit' then raise; end if; end;
  begin
    delete from public.ielts_mock_usage where user_id=auth.uid();
    if (select count(*) from public.ielts_mock_usage where user_id=auth.uid()) <> 20 then
      raise exception 'FAIL usage deletion';
    end if;
  exception when insufficient_privilege then null; end;
end; $$;
reset role;
reset role;
update public.ielts_attempts set status='abandoned' where user_id='77777777-7777-7777-7777-777777777777';
-- Move a queued period into the present to exercise rollover, and remove
-- today's debit as if it were from yesterday (the unique-day rule is global).
delete from public.ielts_mock_usage where cairo_day=(now() at time zone 'Africa/Cairo')::date;
update public.ielts_premium_periods set starts_at=now()-interval '40 days', ends_at=now()-interval '1 second'
where user_id='77777777-7777-7777-7777-777777777777' and starts_at<=now();
update public.ielts_premium_periods set starts_at=now()-interval '1 second'
where user_id='77777777-7777-7777-7777-777777777777' and starts_at>now();
set local role authenticated;
select public.ielts_start_attempt('aaaaaaaa-7777-7777-7777-777777777772');
reset role;
do $$ begin
  if not exists(select 1 from public.ielts_premium_periods p join public.ielts_mock_usage u on u.period_id=p.id
    where p.user_id='77777777-7777-7777-7777-777777777777' and p.ends_at>now()) then raise exception 'FAIL rollover'; end if;
  raise notice 'PASS queued renewal does not reset, usage is read-only, new period resets';
end; $$;
-- Premium-code grants use the same queued period path as payments.
insert into public.ielts_redemption_codes(code,type,duration_days) values('LIMITS-REDEEM','premium',30);
set local role authenticated;
select * from public.ielts_redeem_code('LIMITS-REDEEM');
reset role;
do $$ begin
  if (select count(*) from public.ielts_premium_periods where user_id='77777777-7777-7777-7777-777777777777') <> 3 then raise exception 'FAIL code renewal'; end if;
  raise notice 'PASS code renewal period';
end; $$;
-- Admin test activity must not consume the learner quota.
set local request.jwt.claim.sub = '';
update public.profiles set role='admin' where id='77777777-7777-7777-7777-777777777777';
set local request.jwt.claim.sub = '77777777-7777-7777-7777-777777777777';
set local role authenticated;
select public.ielts_start_attempt('aaaaaaaa-7777-7777-7777-777777777771');
reset role;
set local request.jwt.claim.sub = '';
update public.profiles set role='user' where id='77777777-7777-7777-7777-777777777777';
update public.ielts_learners set premium_expires_at=now()-interval '1 second' where user_id='77777777-7777-7777-7777-777777777777';
set local request.jwt.claim.sub = '77777777-7777-7777-7777-777777777777';
set local role authenticated;
do $$ begin
  begin
    perform public.ielts_start_attempt('aaaaaaaa-7777-7777-7777-777777777771');
    raise exception 'FAIL expired resume';
  exception when raise_exception then if sqlerrm <> 'premium_required' then raise; end if; end;
  raise notice 'PASS admin bypass and non-premium membership';
end; $$;
rollback;
