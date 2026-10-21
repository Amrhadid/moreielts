-- MoreIELTS (moreielts.com) and MoreTOEFL (moretoefl.com) are separate sites
-- that share one Supabase project, and therefore one auth.users and one
-- public.profiles. Until now nothing recorded which site an account belongs
-- to, so each admin dashboard listed every learner of both sites.
--
-- `sites` records the sites an account has signed in to (one account may use
-- both); `signup_site` is where it was created. Each site's admin pages filter
-- on `sites @> '{<site>}'`. Both columns are written only by the sign-up
-- trigger and the `register_site_visit` RPC; the privilege guard discards any
-- other change, so a learner cannot move themselves between dashboards.
--
-- The same change ships in the MoreTOEFL repository as migration
-- 0043_profile_sites.sql, which is the copy applied to the shared project.

alter table public.profiles
  add column if not exists sites text[] not null default '{}',
  add column if not exists signup_site text;

alter table public.profiles drop constraint if exists profiles_sites_known;
alter table public.profiles
  add constraint profiles_sites_known
  check (sites <@ array['toefl', 'ielts']::text[]);

alter table public.profiles drop constraint if exists profiles_signup_site_known;
alter table public.profiles
  add constraint profiles_signup_site_known
  check (signup_site in ('toefl', 'ielts'));

create index if not exists profiles_sites_idx on public.profiles using gin (sites);

-- Backfill: accounts that exist before this migration were created on
-- moretoefl.com. Anyone who also uses moreielts.com is added to `ielts` the
-- next time they open that site.
update public.profiles
set sites = array['toefl'], signup_site = coalesce(signup_site, 'toefl')
where sites = '{}';

-- ---------------------------------------------------------------------------
-- Guard: `sites` / `signup_site` change only through the RPC or an admin.
-- ---------------------------------------------------------------------------
create or replace function public.protect_profile_privileges()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Exempt: an existing admin acting through the app, the service role, and a
  -- direct SQL session (auth.uid() is null), which is how the first admin is
  -- promoted. Anonymous PostgREST callers hold no UPDATE grant on profiles, so
  -- the null-uid branch cannot be reached from the client.
  if public.is_admin()
     or current_user = 'service_role'
     or auth.uid() is null
  then
    return new;
  end if;
  new.role := old.role;
  new.tier := old.tier;
  new.premium_expires_at := old.premium_expires_at;
  -- register_site_visit() sets this flag for its own update.
  if coalesce(current_setting('app.site_visit', true), '') <> 'on' then
    new.sites := old.sites;
    new.signup_site := old.signup_site;
  end if;
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Sign-up: email sign-ups pass `site` in the user metadata
-- (`supabase.auth.signUp({ options: { data: { site } } })`), which stamps the
-- new profile straight away. Google sign-ups carry no metadata; they are
-- stamped by register_site_visit() on the first page load after the redirect.
-- Same function as 0001 plus the two columns (replacing the function needs no
-- lock on auth.users, unlike adding a second trigger there).
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_site text := new.raw_user_meta_data ->> 'site';
begin
  insert into public.profiles (id, email, full_name, sites, signup_site)
  values (
    new.id,
    new.email,
    coalesce(
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name'
    ),
    case when v_site in ('toefl', 'ielts') then array[v_site] else '{}'::text[] end,
    case when v_site in ('toefl', 'ielts') then v_site else null end
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- register_site_visit(site): called by each site once per sign-in. Adds the
-- site to the caller's `sites` (idempotent) and fills `signup_site` if the
-- account was created without one (Google sign-up).
-- ---------------------------------------------------------------------------
create or replace function public.register_site_visit(p_site text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Not signed in';
  end if;
  if p_site not in ('toefl', 'ielts') then
    raise exception 'Unknown site %', p_site;
  end if;

  perform set_config('app.site_visit', 'on', true);
  update public.profiles
  set sites = case when sites @> array[p_site] then sites else sites || p_site end,
      signup_site = coalesce(signup_site, p_site)
  where id = auth.uid()
    and (not sites @> array[p_site] or signup_site is null);
end;
$$;

revoke all on function public.register_site_visit(text) from public, anon;
grant execute on function public.register_site_visit(text) to authenticated;
