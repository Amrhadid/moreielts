#!/usr/bin/env python3
"""Real separate-session races. Scratch database only, called by test-db.sh."""
import concurrent.futures
import os
import subprocess


def sql(text, check=True):
    return subprocess.run(['psql', '-X', '-qAt', '-d', os.getenv('TEST_DB', 'mi_test'),
                           '-v', 'ON_ERROR_STOP=1', '-c', text],
                          text=True, capture_output=True, check=check)


user = '88888888-8888-8888-8888-888888888888'
form_a = 'aaaaaaaa-8888-8888-8888-888888888881'
form_b = 'aaaaaaaa-8888-8888-8888-888888888882'
identity = f"set role authenticated; set request.jwt.claim.sub='{user}'; "
sql(f"""
insert into auth.users(id,email) values('{user}','race@example.test');
insert into public.ielts_learners(user_id,premium_expires_at) values('{user}',now()+interval '30 days');
insert into public.ielts_test_forms(id,title,variant,is_published,purpose) values
('{form_a}','Race A','academic',true,'mock'),('{form_b}','Race B','academic',true,'mock');
""")
try:
    def start(form):
        return sql(identity + f"select public.ielts_start_attempt('{form}');", check=False)
    with concurrent.futures.ThreadPoolExecutor(8) as pool:
        outcomes = list(pool.map(start, [form_a]*8))
    assert all(r.returncode == 0 for r in outcomes), [r.stderr for r in outcomes]
    assert len({r.stdout.strip() for r in outcomes}) == 1, 'same-form race duplicated attempts'
    sql(f"delete from public.ielts_mock_usage where user_id='{user}'; delete from public.ielts_attempts where user_id='{user}';")
    with concurrent.futures.ThreadPoolExecutor(2) as pool:
        outcomes = list(pool.map(start, [form_a, form_b]))
    assert sum(r.returncode == 0 for r in outcomes) == 1, 'cross-form race escaped limit'
    assert any('mock_daily_limit' in r.stderr for r in outcomes), [r.stderr for r in outcomes]
    assert sql(f"select count(*) from public.ielts_mock_usage where user_id='{user}';").stdout.strip() == '1'
    # Two simultaneous renewals must each add their full duration once.
    def grant(session):
        return sql(f"select public.ielts_grant_paid_premium('{session}','{user}','premium',30,100,'usd');")
    with concurrent.futures.ThreadPoolExecutor(2) as pool:
        list(pool.map(grant, ['race-session-a', 'race-session-b']))
    assert sql(f"select count(*) from public.ielts_premium_periods where user_id='{user}';").stdout.strip() == '3'
    assert sql(f"select extract(epoch from sum(ends_at-starts_at))/86400 from public.ielts_premium_periods where user_id='{user}';").stdout.strip().startswith('90.'), 'lost renewal'
    print('PASS concurrent same-form resume, cross-form daily cap, paid renewals')
finally:
    # period/usage references enforce audit retention, so delete in order.
    sql(f"delete from public.ielts_mock_usage where user_id='{user}'; delete from auth.users where id='{user}'; delete from public.ielts_test_forms where id in ('{form_a}','{form_b}');")
