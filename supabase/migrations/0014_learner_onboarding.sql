-- 0014_learner_onboarding.sql
-- A short onboarding for every MoreIELTS learner: name, nationality and a
-- WhatsApp number (E.164, the format MoreTOEFL's profiles already use).
-- Stored on ielts_learners; MoreTOEFL's tables are only read, to pre-fill.

alter table public.ielts_learners
  add column if not exists full_name text,
  add column if not exists nationality text,
  add column if not exists whatsapp text,
  add column if not exists onboarded_at timestamptz;

do $$ begin
  alter table public.ielts_learners
    add constraint ielts_learners_whatsapp_check check (whatsapp is null or whatsapp ~ '^\+[1-9][0-9]{6,14}$');
exception when duplicate_object then null; end $$;
do $$ begin
  alter table public.ielts_learners
    add constraint ielts_learners_nationality_check check (nationality is null or nationality ~ '^[A-Z]{2}$');
exception when duplicate_object then null; end $$;
do $$ begin
  alter table public.ielts_learners
    add constraint ielts_learners_full_name_check check (full_name is null or char_length(btrim(full_name)) between 2 and 80);
exception when duplicate_object then null; end $$;

-- The one way to finish onboarding: validates and stamps onboarded_at.
create or replace function public.ielts_complete_onboarding(
  p_full_name text,
  p_nationality text,
  p_whatsapp text
)
returns public.ielts_learners
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.ielts_learners;
  v_name text := btrim(regexp_replace(coalesce(p_full_name, ''), '\s+', ' ', 'g'));
  v_phone text := regexp_replace(coalesce(p_whatsapp, ''), '[^0-9+]', '', 'g');
begin
  if auth.uid() is null then
    raise exception 'not_authenticated';
  end if;
  if char_length(v_name) < 2 or char_length(v_name) > 80 then
    raise exception 'invalid_name';
  end if;
  if coalesce(p_nationality, '') !~ '^[A-Z]{2}$' then
    raise exception 'invalid_nationality';
  end if;
  if v_phone !~ '^\+[1-9][0-9]{6,14}$' then
    raise exception 'invalid_whatsapp';
  end if;

  insert into public.ielts_learners (user_id, full_name, nationality, whatsapp, onboarded_at)
  values (auth.uid(), v_name, p_nationality, v_phone, now())
  on conflict (user_id) do update
    set full_name = excluded.full_name,
        nationality = excluded.nationality,
        whatsapp = excluded.whatsapp,
        onboarded_at = coalesce(public.ielts_learners.onboarded_at, excluded.onboarded_at)
  returning * into v_row;
  return v_row;
end;
$$;

revoke all on function public.ielts_complete_onboarding(text, text, text) from public, anon;
grant execute on function public.ielts_complete_onboarding(text, text, text) to authenticated;

-- Admin student list gains the onboarding fields.
create or replace function public.ielts_admin_students_v2(p_limit int default 100)
returns table (
  id uuid, email text, full_name text, role text, tier text,
  premium_expires_at timestamptz, target_band numeric, current_band numeric,
  exam_date date, daily_goal_minutes int, locale text, created_at timestamptz,
  nationality text, whatsapp text, onboarded_at timestamptz
)
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'forbidden';
  end if;
  return query
    select l.user_id, p.email, coalesce(l.full_name, p.full_name), coalesce(p.role, 'user'),
           case when l.premium_expires_at > now() then 'premium' else 'free' end,
           l.premium_expires_at, l.target_band, l.current_band, l.exam_date,
           l.daily_goal_minutes, l.locale, l.created_at,
           l.nationality, l.whatsapp, l.onboarded_at
    from public.ielts_learners l
    left join public.profiles p on p.id = l.user_id
    order by l.created_at desc
    limit least(p_limit, 500);
end;
$$;

revoke all on function public.ielts_admin_students_v2(int) from public, anon;
grant execute on function public.ielts_admin_students_v2(int) to authenticated;
