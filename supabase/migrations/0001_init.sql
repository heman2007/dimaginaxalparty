-- Dimagi Naxal Party — members schema
-- Run this in the Supabase SQL editor, or via `supabase db push`.

create extension if not exists pgcrypto;

create table if not exists public.members (
  id uuid primary key references auth.users(id) on delete cascade,
  membership_id text not null unique,
  name text not null,
  city text,
  reason text,
  email text not null,
  created_at timestamptz not null default now()
);

-- Auto-generate a membership id like DNP-2026-AB12C
create or replace function public.generate_membership_id()
returns text
language sql
as $$
  select 'DNP-' || extract(year from now())::text || '-' ||
         upper(substr(md5(gen_random_uuid()::text), 1, 5));
$$;

alter table public.members
  alter column membership_id set default public.generate_membership_id();

alter table public.members enable row level security;

-- Members can only ever see / create / edit their own row.
create policy "members select own row"
  on public.members for select
  using (auth.uid() = id);

create policy "members insert own row"
  on public.members for insert
  with check (auth.uid() = id);

create policy "members update own row"
  on public.members for update
  using (auth.uid() = id);

-- Public signup counter, without exposing any member's row to anonymous
-- visitors. SECURITY DEFINER lets this bypass RLS just for a count.
create or replace function public.get_member_count()
returns bigint
language sql
security definer
set search_path = public
as $$
  select count(*) from public.members;
$$;

grant execute on function public.get_member_count() to anon, authenticated;
