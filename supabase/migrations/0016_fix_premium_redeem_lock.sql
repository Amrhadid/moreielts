-- Redeeming a code marked it used but never granted Premium.
--
-- ielts_protect_learner_privileges() locks premium_expires_at and
-- current_band against learners editing their own row. It was SECURITY
-- DEFINER, so inside it current_user was always the function owner, never
-- the caller; its "current_user = 'service_role'" escape never matched, and
-- the update made by ielts_redeem_code() (an authenticated caller, so
-- auth.uid() is set) was silently reverted.
--
-- The trigger now runs as the invoker and locks only direct writes from the
-- API roles. Trusted SECURITY DEFINER functions (redeem, scoring) run as
-- their owner and pass through; admins still pass via is_admin().

create or replace function public.ielts_protect_learner_privileges()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  if current_user not in ('authenticated', 'anon') or public.is_admin() then
    return new;
  end if;
  new.premium_expires_at := old.premium_expires_at;
  new.current_band := old.current_band;
  return new;
end;
$$;

revoke all on function public.ielts_protect_learner_privileges() from public, anon, authenticated;

-- Give learners whose code was used while the lock misfired the Premium they
-- redeemed (counted from the moment they redeemed it).
update public.ielts_learners l
set premium_expires_at = greatest(coalesce(l.premium_expires_at, c.used_at), c.used_at)
                         + make_interval(days => coalesce(c.duration_days, 30))
from (
  select distinct on (used_by) used_by, used_at, duration_days
  from public.ielts_redemption_codes
  where type = 'premium' and used_by is not null
  order by used_by, used_at desc
) c
where l.user_id = c.used_by
  and (l.premium_expires_at is null or l.premium_expires_at < c.used_at);
