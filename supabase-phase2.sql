-- Bua Buddy Phase 2: Real Friend ID, friend requests, friendships
-- Run this file in Supabase SQL Editor after Phase 1 is already working.

create table if not exists public.friend_requests (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references auth.users(id) on delete cascade,
  receiver_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (requester_id <> receiver_id)
);

create unique index if not exists friend_requests_one_pending_pair_idx
on public.friend_requests (
  least(requester_id::text, receiver_id::text),
  greatest(requester_id::text, receiver_id::text)
)
where status = 'pending';

create table if not exists public.friendships (
  id uuid primary key default gen_random_uuid(),
  user_id_1 uuid not null references auth.users(id) on delete cascade,
  user_id_2 uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id_1, user_id_2),
  check (user_id_1 <> user_id_2)
);

-- Phase 2 needs users to find other users by Friend ID.
-- Only public profile fields are stored in profiles; full game save remains private.
grant usage on schema public to anon, authenticated;
grant select on public.profiles to authenticated;
grant select, insert on public.friend_requests to authenticated;
grant select on public.friendships to authenticated;

alter table public.friend_requests enable row level security;
alter table public.friendships enable row level security;

drop policy if exists "Users can read public profiles for friend search" on public.profiles;
drop policy if exists "Users can read own friend requests" on public.friend_requests;
drop policy if exists "Users can send friend requests" on public.friend_requests;
drop policy if exists "Users can read own friendships" on public.friendships;

create policy "Users can read public profiles for friend search"
on public.profiles
for select
to authenticated
using (true);

create policy "Users can read own friend requests"
on public.friend_requests
for select
to authenticated
using (auth.uid() = requester_id or auth.uid() = receiver_id);

create policy "Users can send friend requests"
on public.friend_requests
for insert
to authenticated
with check (auth.uid() = requester_id and requester_id <> receiver_id);

create policy "Users can read own friendships"
on public.friendships
for select
to authenticated
using (auth.uid() = user_id_1 or auth.uid() = user_id_2);

create or replace function public.accept_friend_request(request_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  req record;
  first_user uuid;
  second_user uuid;
begin
  select *
  into req
  from public.friend_requests
  where id = request_id and status = 'pending';

  if not found then
    raise exception 'Friend request not found';
  end if;

  if req.receiver_id <> auth.uid() then
    raise exception 'Not allowed';
  end if;

  if req.requester_id::text < req.receiver_id::text then
    first_user := req.requester_id;
    second_user := req.receiver_id;
  else
    first_user := req.receiver_id;
    second_user := req.requester_id;
  end if;

  update public.friend_requests
  set status = 'accepted',
      updated_at = now()
  where id = request_id;

  insert into public.friendships (user_id_1, user_id_2)
  values (first_user, second_user)
  on conflict (user_id_1, user_id_2) do nothing;
end;
$$;

create or replace function public.reject_friend_request(request_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.friend_requests
  set status = 'rejected',
      updated_at = now()
  where id = request_id
    and receiver_id = auth.uid()
    and status = 'pending';

  if not found then
    raise exception 'Friend request not found';
  end if;
end;
$$;

grant execute on function public.accept_friend_request(uuid) to authenticated;
grant execute on function public.reject_friend_request(uuid) to authenticated;
