-- 0001_initial_schema.sql
-- Core MoreIELTS schema: learners, content hierarchy, attempts and scores.
-- Every object is prefixed ielts_ so nothing collides with MoreTOEFL's
-- tables in the shared project.
--
-- Additive only. This migration creates objects and never drops or truncates
-- anything; the same holds for every migration in this directory.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Shared helpers
-- ---------------------------------------------------------------------------

create or replace function public.ielts_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- ielts_learners
-- ---------------------------------------------------------------------------
-- MoreIELTS runs in the project it shares with MoreTOEFL. Accounts, names and
-- the admin role live in MoreTOEFL's public.profiles, which this schema reads
-- but never writes. Everything IELTS-specific about a learner lives here, one
-- row per user, created on first visit by ielts_ensure_learner(). IELTS Premium
-- is ielts_learners.premium_expires_at, separate from MoreTOEFL's tier.

create table if not exists public.ielts_learners (
  user_id uuid primary key references auth.users (id) on delete cascade,
  premium_expires_at timestamptz,
  target_band numeric(2, 1) check (target_band >= 0 and target_band <= 9),
  current_band numeric(2, 1) check (current_band >= 0 and current_band <= 9),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists ielts_learners_set_updated_at on public.ielts_learners;
create trigger ielts_learners_set_updated_at
  before update on public.ielts_learners
  for each row execute function public.ielts_set_updated_at();

-- public.is_admin() (profiles.role = 'admin') is MoreTOEFL's and is reused
-- as-is for every admin check here; it is deliberately not redefined.

-- The app calls this once per session: it creates the learner's row on their
-- first MoreIELTS visit and returns it.
create or replace function public.ielts_ensure_learner()
returns public.ielts_learners
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.ielts_learners;
begin
  if auth.uid() is null then
    raise exception 'not_authenticated';
  end if;
  insert into public.ielts_learners (user_id) values (auth.uid())
  on conflict (user_id) do nothing;
  select * into v_row from public.ielts_learners where user_id = auth.uid();
  return v_row;
end;
$$;

revoke all on function public.ielts_ensure_learner() from public, anon;
grant execute on function public.ielts_ensure_learner() to authenticated;

-- ---------------------------------------------------------------------------
-- question_types  (reference table -- deliberately NOT an enum or CHECK list)
-- ---------------------------------------------------------------------------
-- Adding an IELTS question type must be an INSERT, not a schema migration, so
-- ielts_questions.type_code is a foreign key into this table and nothing else
-- constrains the set of codes.

create table if not exists public.ielts_question_types (
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

create table if not exists public.ielts_test_forms (
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
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists test_forms_set_updated_at on public.ielts_test_forms;
create trigger test_forms_set_updated_at
  before update on public.ielts_test_forms
  for each row execute function public.ielts_set_updated_at();

create table if not exists public.ielts_test_sections (
  id uuid primary key default gen_random_uuid(),
  form_id uuid not null references public.ielts_test_forms (id) on delete cascade,
  section text not null check (section in ('listening', 'reading', 'writing', 'speaking')),
  time_limit_seconds int not null check (time_limit_seconds > 0),
  question_count int not null default 0 check (question_count >= 0),
  instructions text,
  order_index int not null default 0,
  created_at timestamptz not null default now(),
  unique (form_id, section)
);

create index if not exists ielts_test_sections_form_idx
  on public.ielts_test_sections (form_id, order_index);

create table if not exists public.ielts_item_groups (
  id uuid primary key default gen_random_uuid(),
  section_id uuid not null references public.ielts_test_sections (id) on delete cascade,
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

create index if not exists ielts_item_groups_section_idx
  on public.ielts_item_groups (section_id, order_index);

create table if not exists public.ielts_questions (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.ielts_item_groups (id) on delete cascade,
  -- FK into the reference table: the set of valid types is data, not schema.
  type_code text not null references public.ielts_question_types (code),
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

create index if not exists ielts_questions_group_idx
  on public.ielts_questions (group_id, order_index);

-- ---------------------------------------------------------------------------
-- attempts and responses
-- ---------------------------------------------------------------------------

create table if not exists public.ielts_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  form_id uuid not null references public.ielts_test_forms (id) on delete restrict,
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

create index if not exists ielts_attempts_user_idx
  on public.ielts_attempts (user_id, started_at desc);

create table if not exists public.ielts_responses (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references public.ielts_attempts (id) on delete cascade,
  question_id uuid not null references public.ielts_questions (id) on delete cascade,
  answer text,
  audio_url text,
  -- Written only by the marking Edge Function running as the service role.
  is_correct boolean,
  time_spent_ms int check (time_spent_ms is null or time_spent_ms >= 0),
  answered_at timestamptz not null default now(),
  unique (attempt_id, question_id)
);

create index if not exists ielts_responses_attempt_idx
  on public.ielts_responses (attempt_id);

-- ---------------------------------------------------------------------------
-- Scores
-- ---------------------------------------------------------------------------

create table if not exists public.ielts_attempt_scores (
  attempt_id uuid primary key references public.ielts_attempts (id) on delete cascade,
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

drop trigger if exists attempt_scores_set_updated_at on public.ielts_attempt_scores;
create trigger attempt_scores_set_updated_at
  before update on public.ielts_attempt_scores
  for each row execute function public.ielts_set_updated_at();

create table if not exists public.ielts_writing_scores (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references public.ielts_attempts (id) on delete cascade,
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

create table if not exists public.ielts_speaking_scores (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references public.ielts_attempts (id) on delete cascade,
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

create table if not exists public.ielts_band_conversion (
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

create index if not exists ielts_band_conversion_lookup_idx
  on public.ielts_band_conversion (version, variant, section, raw_min, raw_max);

-- ---------------------------------------------------------------------------
-- redemption_codes
-- ---------------------------------------------------------------------------

create table if not exists public.ielts_redemption_codes (
  code text primary key,
  type text not null check (type in ('premium', 'mock_credit')),
  duration_days int check (duration_days is null or duration_days > 0),
  form_id uuid references public.ielts_test_forms (id) on delete set null,
  used_by uuid references auth.users (id) on delete set null,
  used_at timestamptz,
  expires_at timestamptz,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Rate limiting for the AI grading functions
-- ---------------------------------------------------------------------------

create table if not exists public.ielts_ai_grading_usage (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  function_name text not null,
  attempt_id uuid references public.ielts_attempts (id) on delete cascade,
  created_at timestamptz not null default now()
);

create index if not exists ielts_ai_grading_usage_rate_idx
  on public.ielts_ai_grading_usage (user_id, function_name, created_at desc);
