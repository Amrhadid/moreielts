-- 0001_initial_schema.sql
-- Core MoreIELTS schema: profiles, content hierarchy, attempts and scores.
--
-- Additive only. This migration creates objects and never drops or truncates
-- anything; the same holds for every migration in this directory.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Shared helpers
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  role text not null default 'user' check (role in ('user', 'admin')),
  tier text not null default 'free' check (tier in ('free', 'premium')),
  premium_expires_at timestamptz,
  target_band numeric(2, 1) check (target_band >= 0 and target_band <= 9),
  current_band numeric(2, 1) check (current_band >= 0 and current_band <= 9),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Used by RLS policies. Defined after profiles because its body is validated
-- at creation time. SECURITY DEFINER so that reading the caller's role does not
-- itself depend on a policy on profiles, which would recurse.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- A profile row is created for every new auth user, so the app never has to
-- cope with a signed-in user that has no profile.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name'
    )
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- question_types  (reference table -- deliberately NOT an enum or CHECK list)
-- ---------------------------------------------------------------------------
-- Adding an IELTS question type must be an INSERT, not a schema migration, so
-- questions.type_code is a foreign key into this table and nothing else
-- constrains the set of codes.

create table if not exists public.question_types (
  code text primary key,
  section text not null check (section in ('listening', 'reading', 'writing', 'speaking')),
  label text not null,
  renderer text not null check (renderer in ('radio', 'checkbox', 'dropdown', 'text_input')),
  default_word_limit int not null default 0 check (default_word_limit >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Content hierarchy: test_forms -> test_sections -> item_groups -> questions
-- ---------------------------------------------------------------------------

create table if not exists public.test_forms (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  variant text not null default 'academic'
    check (variant in ('academic', 'general_training')),
  delivery_mode text not null default 'computer'
    check (delivery_mode in ('computer', 'paper')),
  is_published boolean not null default false,
  is_premium boolean not null default false,
  scoring_version text not null default 'v1',
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists test_forms_set_updated_at on public.test_forms;
create trigger test_forms_set_updated_at
  before update on public.test_forms
  for each row execute function public.set_updated_at();

create table if not exists public.test_sections (
  id uuid primary key default gen_random_uuid(),
  form_id uuid not null references public.test_forms (id) on delete cascade,
  section text not null check (section in ('listening', 'reading', 'writing', 'speaking')),
  time_limit_seconds int not null check (time_limit_seconds > 0),
  question_count int not null default 0 check (question_count >= 0),
  instructions text,
  order_index int not null default 0,
  created_at timestamptz not null default now(),
  unique (form_id, section)
);

create index if not exists test_sections_form_idx
  on public.test_sections (form_id, order_index);

create table if not exists public.item_groups (
  id uuid primary key default gen_random_uuid(),
  section_id uuid not null references public.test_sections (id) on delete cascade,
  part_number int not null default 1 check (part_number > 0),
  passage_text text,
  audio_url text,
  audio_duration_ms int check (audio_duration_ms is null or audio_duration_ms >= 0),
  transcript text,
  image_url text,
  shared_instructions text,
  metadata jsonb not null default '{}'::jsonb,
  order_index int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists item_groups_section_idx
  on public.item_groups (section_id, order_index);

create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.item_groups (id) on delete cascade,
  -- FK into the reference table: the set of valid types is data, not schema.
  type_code text not null references public.question_types (code),
  prompt text not null default '',
  options jsonb not null default '[]'::jsonb,
  -- Every spelling/phrasing that scores a mark. Never sent to a candidate
  -- during an active attempt -- see the questions_public view in 0003.
  accepted_answers text[] not null default '{}',
  word_limit int not null default 0 check (word_limit >= 0),
  spelling_policy text not null default 'lenient'
    check (spelling_policy in ('strict', 'lenient')),
  accepts_plural boolean not null default true,
  case_sensitive boolean not null default false,
  scoring_rules jsonb not null default '{}'::jsonb,
  order_index int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists questions_group_idx
  on public.questions (group_id, order_index);

-- ---------------------------------------------------------------------------
-- attempts and responses
-- ---------------------------------------------------------------------------

create table if not exists public.attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  form_id uuid not null references public.test_forms (id) on delete restrict,
  status text not null default 'in_progress'
    check (status in ('in_progress', 'completed', 'abandoned', 'awaiting_speaking')),
  current_section text
    check (current_section is null or current_section in ('listening', 'reading', 'writing', 'speaking')),
  current_position int not null default 0,
  -- Server-authoritative timing. The client clock is display only; these two
  -- columns are written by start_section() and never by the client.
  section_started_at timestamptz,
  section_deadline_at timestamptz,
  last_heartbeat_at timestamptz,
  started_at timestamptz not null default now(),
  submitted_at timestamptz
);

create index if not exists attempts_user_idx
  on public.attempts (user_id, started_at desc);

create table if not exists public.responses (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references public.attempts (id) on delete cascade,
  question_id uuid not null references public.questions (id) on delete cascade,
  answer text,
  audio_url text,
  -- Written only by the marking Edge Function running as the service role.
  is_correct boolean,
  time_spent_ms int check (time_spent_ms is null or time_spent_ms >= 0),
  answered_at timestamptz not null default now(),
  unique (attempt_id, question_id)
);

create index if not exists responses_attempt_idx
  on public.responses (attempt_id);

-- ---------------------------------------------------------------------------
-- Scores
-- ---------------------------------------------------------------------------

create table if not exists public.attempt_scores (
  attempt_id uuid primary key references public.attempts (id) on delete cascade,
  listening_raw int check (listening_raw is null or listening_raw between 0 and 40),
  listening_band numeric(2, 1),
  reading_raw int check (reading_raw is null or reading_raw between 0 and 40),
  reading_band numeric(2, 1),
  writing_band numeric(2, 1),
  speaking_band numeric(2, 1),
  overall_unrounded numeric(3, 2),
  overall_band numeric(2, 1),
  scoring_version text not null default 'v1',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists attempt_scores_set_updated_at on public.attempt_scores;
create trigger attempt_scores_set_updated_at
  before update on public.attempt_scores
  for each row execute function public.set_updated_at();

create table if not exists public.writing_scores (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references public.attempts (id) on delete cascade,
  task_number int not null check (task_number in (1, 2)),
  task_achievement numeric(2, 1),
  coherence_cohesion numeric(2, 1),
  lexical_resource numeric(2, 1),
  grammatical_range numeric(2, 1),
  task_band numeric(2, 1),
  feedback jsonb not null default '{}'::jsonb,
  model_version text,
  created_at timestamptz not null default now(),
  unique (attempt_id, task_number)
);

create table if not exists public.speaking_scores (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references public.attempts (id) on delete cascade,
  part_number int not null check (part_number in (1, 2, 3)),
  fluency_coherence numeric(2, 1),
  lexical_resource numeric(2, 1),
  grammatical_range numeric(2, 1),
  pronunciation numeric(2, 1),
  part_band numeric(2, 1),
  transcript text,
  feedback jsonb not null default '{}'::jsonb,
  model_version text,
  created_at timestamptz not null default now(),
  unique (attempt_id, part_number)
);

-- ---------------------------------------------------------------------------
-- band_conversion
-- ---------------------------------------------------------------------------

create table if not exists public.band_conversion (
  id uuid primary key default gen_random_uuid(),
  variant text not null check (variant in ('academic', 'general_training')),
  section text not null check (section in ('listening', 'reading')),
  raw_min int not null check (raw_min >= 0 and raw_min <= 40),
  raw_max int not null check (raw_max >= 0 and raw_max <= 40),
  band numeric(2, 1) not null check (band >= 0 and band <= 9),
  version text not null default 'v1',
  created_at timestamptz not null default now(),
  check (raw_max >= raw_min),
  unique (variant, section, raw_min, version)
);

create index if not exists band_conversion_lookup_idx
  on public.band_conversion (version, variant, section, raw_min, raw_max);

-- ---------------------------------------------------------------------------
-- redemption_codes
-- ---------------------------------------------------------------------------

create table if not exists public.redemption_codes (
  code text primary key,
  type text not null check (type in ('premium', 'mock_credit')),
  duration_days int check (duration_days is null or duration_days > 0),
  form_id uuid references public.test_forms (id) on delete set null,
  used_by uuid references public.profiles (id) on delete set null,
  used_at timestamptz,
  expires_at timestamptz,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Rate limiting for the AI grading functions
-- ---------------------------------------------------------------------------

create table if not exists public.ai_grading_usage (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  function_name text not null,
  attempt_id uuid references public.attempts (id) on delete cascade,
  created_at timestamptz not null default now()
);

create index if not exists ai_grading_usage_rate_idx
  on public.ai_grading_usage (user_id, function_name, created_at desc);
