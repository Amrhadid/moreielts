-- Local-only stand-ins for the objects a real Supabase project provides.
-- Used by scripts/test-db.sh so the migrations can be exercised offline.
-- NEVER applied to a real project.

do $$ begin
  create role anon nologin; exception when duplicate_object then null; end $$;
do $$ begin
  create role authenticated nologin; exception when duplicate_object then null; end $$;
do $$ begin
  create role service_role nologin; exception when duplicate_object then null; end $$;
do $$ begin
  create role supabase_admin nologin; exception when duplicate_object then null; end $$;
create schema if not exists auth;
create table if not exists auth.users (
  id uuid primary key default gen_random_uuid(),
  email text,
  raw_user_meta_data jsonb default '{}'::jsonb
);
create or replace function auth.uid() returns uuid language sql stable as $$
  select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid;
$$;
grant usage on schema auth to authenticated, anon, service_role;
grant execute on function auth.uid() to authenticated, anon, service_role;
grant usage on schema public to authenticated, anon, service_role;
-- Supabase grants the service role full table access; mirror that here.
alter default privileges in schema public grant all on tables to service_role;
-- On Supabase the service role bypasses RLS entirely.
alter role service_role bypassrls;
