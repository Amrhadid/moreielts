-- 0012_advisor_hardening.sql
-- Fixes from the Supabase security advisor after 0001-0011 were applied to
-- the shared project. MoreIELTS objects only.
--
-- ielts_questions_public stays a security-definer view on purpose: it is how
-- candidates read questions from the admin-only ielts_questions table, and it
-- projects no answer column (see 0003).

-- Pin the search path of the two functions that lacked one.
alter function public.ielts_set_updated_at() set search_path = public;
alter function public.ielts_protect_attempt_timing() set search_path = public;

-- Trigger functions are never meant to be called over the API.
revoke all on function public.ielts_log_activity() from public, anon, authenticated;
revoke all on function public.ielts_protect_learner_privileges() from public, anon, authenticated;
