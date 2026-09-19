-- ============================================================
-- GameEarn — Supabase schema
-- Run this once in the Supabase SQL Editor (or via `supabase db push`)
-- on a fresh project. Safe to re-run — every statement is idempotent
-- (IF NOT EXISTS / OR REPLACE / ON CONFLICT DO NOTHING) except the
-- CREATE TYPE-less checks, which use CHECK constraints instead of
-- enums so they can be altered later without a migration.
-- ============================================================

create extension if not exists pgcrypto; -- gives us gen_random_uuid()

-- ------------------------------------------------------------
-- 1. profiles — one row per authenticated user, tracks admin role
-- ------------------------------------------------------------
create table if not exists public.profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  username   text,
  email      text,
  role       text not null default 'user' check (role in ('admin', 'user')),
  created_at timestamptz not null default now()
);

-- Safe to run against an existing database from before `username` existed.
alter table public.profiles add column if not exists username text;

-- Automatically create a profile row (role='user') whenever someone signs
-- up via Supabase Auth. Username comes from the `username` field passed in
-- signUp()'s `options.data` on the client (see services/authService.js) —
-- Supabase stores that in auth.users.raw_user_meta_data before this trigger
-- runs. Admins are promoted afterwards with a manual SQL UPDATE (see
-- README → "Create your first admin").
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, username, role)
  values (new.id, new.email, new.raw_user_meta_data ->> 'username', 'user')
  on conflict (id) do update set
    email = excluded.email,
    username = coalesce(excluded.username, public.profiles.username);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Guards against a user editing their own `role` via the self-service
-- UPDATE policy below — regardless of what the client sends, a non-admin's
-- role is silently kept at its previous value. Only a direct SQL UPDATE
-- (run by you, as the project owner, in the SQL Editor) can promote someone
-- to admin — see README → "Create your first admin".
create or replace function public.prevent_self_role_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- auth.uid() is NULL when there's no authenticated app user in this session —
  -- e.g. the SQL Editor, a migration, or any direct database connection made
  -- by you as the project owner. That already implies full trust, so this only
  -- blocks role changes coming from an authenticated NON-admin app user trying
  -- to escalate themselves through the public API (the actual threat this
  -- trigger exists to stop).
  if auth.uid() is not null and new.role is distinct from old.role and not public.is_admin() then
    new.role := old.role;
  end if;
  return new;
end;
$$;

-- ------------------------------------------------------------
-- 2. games — the public catalog, managed by admins
-- ------------------------------------------------------------
create table if not exists public.games (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  slug         text not null unique,
  description  text,
  category     text not null,
  genre        text,
  rating       numeric(3, 1) default 0,
  platform     text,
  developer    text,
  version      text,
  size         text,
  release_date date,
  image_url    text,
  icon_url     text,
  screenshots  jsonb not null default '[]'::jsonb, -- array of screenshot URLs
  source_url   text,
  reward_type  text default 'None',
  free_to_play boolean not null default true,
  featured     boolean not null default false,
  trending     boolean not null default false,
  popular      boolean not null default false,
  new_release  boolean not null default false,
  status       text not null default 'draft' check (status in ('published', 'draft')),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- `unique` on slug already creates an index, but the brief calls it out
-- explicitly, so it's listed here as a comment for clarity:
--   slug        -> covered by the UNIQUE constraint above
create index if not exists games_category_idx     on public.games (category);
create index if not exists games_status_idx       on public.games (status);
create index if not exists games_featured_idx     on public.games (featured)    where featured = true;
create index if not exists games_trending_idx     on public.games (trending)    where trending = true;
create index if not exists games_popular_idx      on public.games (popular)     where popular = true;
create index if not exists games_new_release_idx  on public.games (new_release) where new_release = true;

-- keep updated_at current on every UPDATE
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists games_set_updated_at on public.games;
create trigger games_set_updated_at
  before update on public.games
  for each row execute procedure public.set_updated_at();

-- ------------------------------------------------------------
-- 3. Row Level Security
-- ------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.games    enable row level security;

-- SECURITY DEFINER helper so policies can check "is this user an admin?"
-- without recursively triggering RLS on `profiles` itself.
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- profiles policies -------------------------------------------------
drop policy if exists "profiles_select_own_or_admin" on public.profiles;
create policy "profiles_select_own_or_admin"
  on public.profiles for select
  using (id = auth.uid() or public.is_admin());

-- Users can update their own profile (e.g. username). `role` is protected
-- by the prevent_self_role_escalation trigger below, not by this policy,
-- so a crafted request that includes role='admin' is silently ignored
-- rather than merely rejected — the row still saves, just without the
-- role change.
drop policy if exists "profiles_update_own_or_admin" on public.profiles;
create policy "profiles_update_own_or_admin"
  on public.profiles for update
  using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());

drop trigger if exists profiles_prevent_role_escalation on public.profiles;
create trigger profiles_prevent_role_escalation
  before update on public.profiles
  for each row execute procedure public.prevent_self_role_escalation();

-- games policies ------------------------------------------------------
drop policy if exists "games_select_published_or_admin" on public.games;
create policy "games_select_published_or_admin"
  on public.games for select
  using (status = 'published' or public.is_admin());

drop policy if exists "games_insert_admin_only" on public.games;
create policy "games_insert_admin_only"
  on public.games for insert
  with check (public.is_admin());

drop policy if exists "games_update_admin_only" on public.games;
create policy "games_update_admin_only"
  on public.games for update
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "games_delete_admin_only" on public.games;
create policy "games_delete_admin_only"
  on public.games for delete
  using (public.is_admin());

-- ------------------------------------------------------------
-- 4. Storage — game-assets bucket for icons/covers/screenshots
-- ------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('game-assets', 'game-assets', true)
on conflict (id) do nothing;

-- Public read (the bucket is public, but storage.objects still has RLS
-- enabled by default in Supabase, so an explicit SELECT policy is
-- required for the Storage API — not just the public CDN URL — to work).
drop policy if exists "game_assets_public_read" on storage.objects;
create policy "game_assets_public_read"
  on storage.objects for select
  using (bucket_id = 'game-assets');

-- Only admins can upload/replace/delete files in this bucket.
drop policy if exists "game_assets_admin_insert" on storage.objects;
create policy "game_assets_admin_insert"
  on storage.objects for insert
  with check (bucket_id = 'game-assets' and public.is_admin());

drop policy if exists "game_assets_admin_update" on storage.objects;
create policy "game_assets_admin_update"
  on storage.objects for update
  using (bucket_id = 'game-assets' and public.is_admin())
  with check (bucket_id = 'game-assets' and public.is_admin());

drop policy if exists "game_assets_admin_delete" on storage.objects;
create policy "game_assets_admin_delete"
  on storage.objects for delete
  using (bucket_id = 'game-assets' and public.is_admin());

-- ------------------------------------------------------------
-- Done. Next: run supabase/seed.sql, then see README → "Create your
-- first admin" to promote your own account to role = 'admin'.
-- ------------------------------------------------------------
