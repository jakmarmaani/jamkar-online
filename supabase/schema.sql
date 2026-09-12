-- JamKar Online production schema
-- Run only in the dedicated JamKar Online Supabase project.
-- Auth passwords remain in Supabase Auth and are never stored in these tables.

create table if not exists public.parent_accounts (
  user_id uuid primary key references auth.users(id) on delete cascade,
  lifetime_unlocked boolean not null default false,
  revolut_customer_ref text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.child_profiles (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid not null references auth.users(id) on delete cascade,
  slot smallint not null check (slot in (1,2)),
  username text not null check (char_length(username) between 3 and 18),
  avatar_key text not null default 'explorer',
  created_at timestamptz not null default now(),
  unique(parent_id, slot)
);

create unique index if not exists child_profiles_username_lower_uidx
on public.child_profiles (lower(username));

create table if not exists public.game_progress (
  child_profile_id uuid not null references public.child_profiles(id) on delete cascade,
  world_key text not null check (char_length(world_key) between 1 and 80),
  highest_level smallint not null default 1 check (highest_level between 1 and 30),
  stars integer not null default 0 check (stars >= 0),
  updated_at timestamptz not null default now(),
  primary key(child_profile_id, world_key)
);

create table if not exists public.child_achievements (
  child_profile_id uuid not null references public.child_profiles(id) on delete cascade,
  achievement_key text not null check (char_length(achievement_key) between 1 and 100),
  earned_at timestamptz not null default now(),
  primary key(child_profile_id, achievement_key)
);

create table if not exists public.purchases (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid not null references auth.users(id) on delete cascade,
  provider text not null default 'revolut' check (provider = 'revolut'),
  provider_order_id text not null unique,
  amount_minor integer not null check (amount_minor = 499),
  currency text not null check (currency = 'GBP'),
  status text not null check (status in ('pending','completed','failed','cancelled','refunded')),
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

alter table public.parent_accounts enable row level security;
alter table public.child_profiles enable row level security;
alter table public.game_progress enable row level security;
alter table public.child_achievements enable row level security;
alter table public.purchases enable row level security;

-- Current Supabase projects may require explicit Data API grants.
revoke all on public.parent_accounts from anon, authenticated;
revoke all on public.child_profiles from anon, authenticated;
revoke all on public.game_progress from anon, authenticated;
revoke all on public.child_achievements from anon, authenticated;
revoke all on public.purchases from anon, authenticated;

grant select on public.parent_accounts to authenticated;
grant select, insert, update, delete on public.child_profiles to authenticated;
grant select, insert, update, delete on public.game_progress to authenticated;
grant select, insert, delete on public.child_achievements to authenticated;
grant select on public.purchases to authenticated;

-- Parent account row is created automatically when Auth creates a user.
-- Keep the SECURITY DEFINER function in a non-exposed schema and revoke direct execution.
create schema if not exists private;

create or replace function private.handle_new_parent_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.parent_accounts (user_id)
  values (new.id)
  on conflict (user_id) do nothing;
  return new;
end;
$$;

revoke all on function private.handle_new_parent_user() from public;
revoke all on function private.handle_new_parent_user() from anon;
revoke all on function private.handle_new_parent_user() from authenticated;

drop trigger if exists on_auth_user_created_jamkar on auth.users;
create trigger on_auth_user_created_jamkar
after insert on auth.users
for each row execute function private.handle_new_parent_user();

-- RLS policies.
drop policy if exists "parent reads own account" on public.parent_accounts;
create policy "parent reads own account" on public.parent_accounts
for select to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "parent reads own child profiles" on public.child_profiles;
create policy "parent reads own child profiles" on public.child_profiles
for select to authenticated
using ((select auth.uid()) = parent_id);

drop policy if exists "parent creates own child profiles" on public.child_profiles;
create policy "parent creates own child profiles" on public.child_profiles
for insert to authenticated
with check ((select auth.uid()) = parent_id);

drop policy if exists "parent updates own child profiles" on public.child_profiles;
create policy "parent updates own child profiles" on public.child_profiles
for update to authenticated
using ((select auth.uid()) = parent_id)
with check ((select auth.uid()) = parent_id);

drop policy if exists "parent deletes own child profiles" on public.child_profiles;
create policy "parent deletes own child profiles" on public.child_profiles
for delete to authenticated
using ((select auth.uid()) = parent_id);

drop policy if exists "parent reads child progress" on public.game_progress;
create policy "parent reads child progress" on public.game_progress
for select to authenticated
using (exists (
  select 1 from public.child_profiles cp
  where cp.id = child_profile_id and cp.parent_id = (select auth.uid())
));

drop policy if exists "parent inserts child progress" on public.game_progress;
create policy "parent inserts child progress" on public.game_progress
for insert to authenticated
with check (exists (
  select 1 from public.child_profiles cp
  where cp.id = child_profile_id and cp.parent_id = (select auth.uid())
));

drop policy if exists "parent updates child progress" on public.game_progress;
create policy "parent updates child progress" on public.game_progress
for update to authenticated
using (exists (
  select 1 from public.child_profiles cp
  where cp.id = child_profile_id and cp.parent_id = (select auth.uid())
))
with check (exists (
  select 1 from public.child_profiles cp
  where cp.id = child_profile_id and cp.parent_id = (select auth.uid())
));

drop policy if exists "parent deletes child progress" on public.game_progress;
create policy "parent deletes child progress" on public.game_progress
for delete to authenticated
using (exists (
  select 1 from public.child_profiles cp
  where cp.id = child_profile_id and cp.parent_id = (select auth.uid())
));

drop policy if exists "parent reads child achievements" on public.child_achievements;
create policy "parent reads child achievements" on public.child_achievements
for select to authenticated
using (exists (
  select 1 from public.child_profiles cp
  where cp.id = child_profile_id and cp.parent_id = (select auth.uid())
));

drop policy if exists "parent inserts child achievements" on public.child_achievements;
create policy "parent inserts child achievements" on public.child_achievements
for insert to authenticated
with check (exists (
  select 1 from public.child_profiles cp
  where cp.id = child_profile_id and cp.parent_id = (select auth.uid())
));

drop policy if exists "parent deletes child achievements" on public.child_achievements;
create policy "parent deletes child achievements" on public.child_achievements
for delete to authenticated
using (exists (
  select 1 from public.child_profiles cp
  where cp.id = child_profile_id and cp.parent_id = (select auth.uid())
));

drop policy if exists "parent reads own purchases" on public.purchases;
create policy "parent reads own purchases" on public.purchases
for select to authenticated
using ((select auth.uid()) = parent_id);

-- IMPORTANT PAYMENT BOUNDARY:
-- The browser never receives INSERT/UPDATE rights on purchases or UPDATE rights on
-- parent_accounts. A trusted server/Edge Function must create Revolut orders, verify
-- webhook signatures/payment state, write purchases, and set lifetime_unlocked=true.
