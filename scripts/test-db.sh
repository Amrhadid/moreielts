#!/usr/bin/env bash
# Applies every migration plus the seed to a scratch Postgres, then runs the
# RLS test suite. Requires a running Postgres and psql on PATH.
#
#   PGHOST=... PGPORT=... PGUSER=... npm run test:db
set -euo pipefail

DB=${TEST_DB:-mi_test}
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

psql -q -c "drop database if exists $DB" >/dev/null
psql -q -c "create database $DB" >/dev/null
psql -q -d "$DB" -v ON_ERROR_STOP=1 -c "create extension if not exists pgcrypto" >/dev/null

# Stand-ins for the objects Supabase provides (auth schema, roles, grants).
psql -q -d "$DB" -v ON_ERROR_STOP=1 -f "$ROOT/scripts/supabase-stubs.sql" >/dev/null

for f in "$ROOT"/supabase/migrations/*.sql; do
  psql -q -d "$DB" -v ON_ERROR_STOP=1 -f "$f" >/dev/null
done

psql -q -d "$DB" -v ON_ERROR_STOP=1 -f "$ROOT/supabase/seed.sql" >/dev/null
psql -d "$DB" -v ON_ERROR_STOP=1 -f "$ROOT/supabase/tests/rls_test.sql" 2>&1 |
  grep -E "NOTICE|ERROR" || true
