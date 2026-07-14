-- Bua Buddy Phase 2.5: Public portfolio snapshot for real Trade Ranking
-- Run this after supabase-phase2.sql.

create table if not exists public.portfolio_snapshots (
  user_id uuid primary key references auth.users(id) on delete cascade,
  portfolio_unlocked boolean not null default false,
  portfolio_value numeric not null default 100000,
  return_pct numeric not null default 0,
  trade_count int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

grant usage on schema public to anon, authenticated;
grant select, insert, update on public.portfolio_snapshots to authenticated;

alter table public.portfolio_snapshots enable row level security;

drop policy if exists "Users can read own portfolio snapshot" on public.portfolio_snapshots;
drop policy if exists "Friends can read portfolio snapshots" on public.portfolio_snapshots;
drop policy if exists "Users can insert own portfolio snapshot" on public.portfolio_snapshots;
drop policy if exists "Users can update own portfolio snapshot" on public.portfolio_snapshots;

create policy "Users can read own portfolio snapshot"
on public.portfolio_snapshots
for select
to authenticated
using (auth.uid() = user_id);

create policy "Friends can read portfolio snapshots"
on public.portfolio_snapshots
for select
to authenticated
using (
  exists (
    select 1
    from public.friendships f
    where
      (f.user_id_1 = auth.uid() and f.user_id_2 = public.portfolio_snapshots.user_id)
      or
      (f.user_id_2 = auth.uid() and f.user_id_1 = public.portfolio_snapshots.user_id)
  )
);

create policy "Users can insert own portfolio snapshot"
on public.portfolio_snapshots
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can update own portfolio snapshot"
on public.portfolio_snapshots
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
