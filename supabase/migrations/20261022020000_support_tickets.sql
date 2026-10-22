-- Migration: 20261022020000_support_tickets.sql
-- Description: Create support_tickets table with Row Level Security for user bug reports and support requests.

create table if not exists public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  email text not null,
  category text not null check (category in ('BUG', 'FEATURE', 'CONTENT', 'ACCOUNT', 'OTHER')),
  title text not null,
  description text not null,
  status text not null default 'OPEN' check (status in ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Index for querying user tickets
create index if not exists idx_support_tickets_user_id on public.support_tickets(user_id);
create index if not exists idx_support_tickets_created_at on public.support_tickets(created_at desc);

-- Enable & force Row Level Security
alter table public.support_tickets enable row level security;
alter table public.support_tickets force row level security;

-- Revoke all permissions from anon / public
revoke all on public.support_tickets from anon, public;

-- Drop old policies if any
drop policy if exists "Authenticated users can insert their own tickets" on public.support_tickets;
drop policy if exists "Authenticated users can read their own tickets" on public.support_tickets;

-- Policies for authenticated users
create policy "Authenticated users can insert their own tickets"
  on public.support_tickets
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Authenticated users can read their own tickets"
  on public.support_tickets
  for select
  to authenticated
  using (auth.uid() = user_id);

-- Permissions
grant select, insert on public.support_tickets to authenticated;
grant all on public.support_tickets to service_role;

-- Notify schema reload
notify pgrst, 'reload schema';

