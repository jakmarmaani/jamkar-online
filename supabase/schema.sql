-- JamKar Online production schema scaffold
-- Run only in a dedicated Supabase project after reviewing environment settings.
-- Authentication is handled by Supabase Auth. Never store raw passwords here.

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
  unique(parent_id, slot),
  unique(lower(username))
);

create table if not exists public.game_progress (
  child_profile_id uuid not null references public.child_profiles(id) on delete cascade,
  world_key text not null,
  highest_level smallint not null default 1 check (highest_level between 1 and 30),
  stars integer not null default 0 check (stars >= 0),
  updated_at timestamptz not null default now(),
  primary key(child_profile_id, world_key)
);

create table if not exists public.purchases (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid not null references auth.users(id) on delete cascade,
  provider text not null default 'revolut',
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
alter table public.purchases enable row level security;

create policy "parent reads own account" on public.parent_accounts
for select to authenticated
using ((select auth.uid()) = user_id);

create policy "parent updates own non-payment account fields" on public.parent_accounts
for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "parent reads own child profiles" on public.child_profiles
for select to authenticated
using ((select auth.uid()) = parent_id);

create policy "parent creates own child profiles" on public.child_profiles
for insert to authenticated
with check ((select auth.uid()) = parent_id);

create policy "parent updates own child profiles" on public.child_profiles
for update to authenticated
using ((select auth.uid()) = parent_id)
with check ((select auth.uid()) = parent_id);

create policy "parent deletes own child profiles" on public.child_profiles
for delete to authenticated
using ((select auth.uid()) = parent_id);

create policy "parent reads child progress" on public.game_progress
for select to authenticated
using (exists (
  select 1 from public.child_profiles cp
  where cp.id = child_profile_id and cp.parent_id = (select auth.uid())
));

create policy "parent inserts child progress" on public.game_progress
for insert to authenticated
with check (exists (
  select 1 from public.child_profiles cp
  where cp.id = child_profile_id and cp.parent_id = (select auth.uid())
));

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

create policy "parent reads own purchases" on public.purchases
for select to authenticated
using ((select auth.uid()) = parent_id);

-- IMPORTANT:
-- Do not create INSERT/UPDATE policies for purchases or lifetime_unlocked from the public client.
-- A trusted server/Edge Function must create the Revolut order, verify Revolut's webhook,
-- write the purchase status and set lifetime_unlocked=true only after verified completion.
