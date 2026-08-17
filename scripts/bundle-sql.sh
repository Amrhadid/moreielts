#!/usr/bin/env bash
# Concatenates every migration plus the seed into a single file that can be
# pasted into the Supabase SQL editor in one go.
#
#   npm run sql:bundle   ->   moreielts-setup.sql
#
# The output is a GENERATED artifact and is gitignored: supabase/migrations is
# the single source of truth, and a committed copy would drift from it.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/moreielts-setup.sql"

{
  cat <<'HEADER'
-- ============================================================================
-- MoreIELTS — complete database setup
--
-- Run this once in the Supabase SQL editor (or via psql) on a fresh project.
-- It is the six migrations plus the seed, concatenated in order.
--
-- Safe to re-run: everything is CREATE ... IF NOT EXISTS / CREATE OR REPLACE /
-- ON CONFLICT. Nothing here drops or truncates any table.
--
-- Requires the Supabase `auth` schema to exist, which it does on any real
-- project. Do not run against a plain Postgres.
--
-- After running, promote yourself to admin (last section of this file).
-- ============================================================================
HEADER

  for f in "$ROOT"/supabase/migrations/*.sql; do
    printf '\n-- %s\n-- %s\n-- %s\n\n' \
      "############################################################################" \
      "$(basename "$f")" \
      "############################################################################"
    cat "$f"
  done

  printf '\n-- %s\n-- seed.sql — one published Academic form\n-- %s\n\n' \
    "############################################################################" \
    "############################################################################"
  cat "$ROOT/supabase/seed.sql"

  cat <<'FOOTER'

-- ############################################################################
-- FINAL STEP — promote yourself to admin
-- ############################################################################
--
-- Sign up through the app FIRST (the trigger above creates your profile row
-- with role = 'user'), then come back and run this with your own email.
-- Until you do, /admin will correctly tell you "Admins only".
--
-- Uncomment and edit:
--
-- update public.profiles set role = 'admin' where email = 'you@example.com';

-- Quick sanity check that everything landed:
select
  (select count(*) from public.question_types)                as question_types,
  (select count(*) from public.band_conversion)               as band_conversion_rows,
  (select count(*) from public.test_forms where is_published) as published_forms,
  (select count(*) from public.questions)                     as questions,
  (select count(*) from pg_tables
     where schemaname = 'public' and rowsecurity)             as tables_with_rls;
FOOTER
} > "$OUT"

echo "Wrote $OUT ($(wc -l < "$OUT") lines)"
