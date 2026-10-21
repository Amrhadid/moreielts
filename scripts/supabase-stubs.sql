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

-- MoreTOEFL objects that MoreIELTS reuses in the shared project: the account
-- profile (written by MoreTOEFL's signup trigger) and is_admin(). Minimal
-- copies of the live definitions, local test use only.
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  role text not null default 'user',
  tier text not null default 'free',
  premium_expires_at timestamptz,
  created_at timestamptz not null default now()
);
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email) values (new.id, new.email) on conflict (id) do nothing;
  return new;
end; $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();
create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;
grant select on public.profiles to authenticated;
grant execute on function public.is_admin() to authenticated, anon;
