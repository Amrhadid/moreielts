-- 0007_practice_results.sql
-- Results of the AI-corrected practice sets (/practice). One row per finished
-- item: a marked Listening/Reading set, or a banded Writing task or Speaking
-- prompt. The learner's browser inserts the row after marking; the AI
-- feedback summary is stored so "Recent practice" can show it on any device.
--
-- The table is namespaced `ielts_` because the site currently runs against the
-- MoreTOEFL Supabase project (see README, "Practice sets and AI correction"),
-- whose own tables it must not collide with. Additive only.

create table if not exists public.ielts_practice_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  section text not null
    check (section in ('listening', 'reading', 'writing', 'speaking')),
  -- Set or task id from src/data/practice, e.g. "reading-tree-rings-1".
  item_id text not null,
  title text not null,
  -- {"kind":"raw","correct":4,"total":5} or {"kind":"band","band":6.5}
  score jsonb not null check (jsonb_typeof(score) = 'object'),
  summary text,
  created_at timestamptz not null default now()
);

create index if not exists ielts_practice_results_user_idx
  on public.ielts_practice_results (user_id, created_at desc);

alter table public.ielts_practice_results enable row level security;

drop policy if exists ielts_practice_results_select_own on public.ielts_practice_results;
create policy ielts_practice_results_select_own on public.ielts_practice_results
  for select to authenticated
  using (user_id = auth.uid());

drop policy if exists ielts_practice_results_insert_own on public.ielts_practice_results;
create policy ielts_practice_results_insert_own on public.ielts_practice_results
  for insert to authenticated
  with check (user_id = auth.uid());

-- No update or delete from the client: a result is a record of what happened.
-- Supabase's default privileges grant authenticated everything on a new table,
-- so revoke first and grant back only what the app uses.
revoke all on public.ielts_practice_results from anon;
revoke all on public.ielts_practice_results from authenticated;
grant select, insert on public.ielts_practice_results to authenticated;
grant all on public.ielts_practice_results to service_role;
