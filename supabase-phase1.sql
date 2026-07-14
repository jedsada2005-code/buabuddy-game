-- Bua Buddy Phase 1: Auth profile + cloud game save
-- Run this file in Supabase SQL Editor after creating your Supabase project.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  friend_code text unique not null,
  level int not null default 1,
  selected_investment_path text,
  current_evolution_stage text not null default 'bua-seed',
  coins int not null default 500,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.game_saves (
  user_id uuid primary key references auth.users(id) on delete cascade,
  save_data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Required when "Automatically expose new tables" is disabled.
grant usage on schema public to anon, authenticated;
grant select, insert, update on public.profiles to authenticated;
grant select, insert, update on public.game_saves to authenticated;

alter table public.profiles enable row level security;
alter table public.game_saves enable row level security;

drop policy if exists "Users can read own profile" on public.profiles;
drop policy if exists "Users can insert own profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "Users can read own save" on public.game_saves;
drop policy if exists "Users can insert own save" on public.game_saves;
drop policy if exists "Users can update own save" on public.game_saves;

create policy "Users can read own profile"
on public.profiles
for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can insert own profile"
on public.profiles
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can update own profile"
on public.profiles
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can read own save"
on public.game_saves
for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can insert own save"
on public.game_saves
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can update own save"
on public.game_saves
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
