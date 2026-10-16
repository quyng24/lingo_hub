create table if not exists public.user_learning_stats (
  user_id uuid primary key references auth.users(id) on delete cascade,
  last_study_date date,
  streak_count integer not null default 0 check (streak_count >= 0),
  updated_at timestamptz not null default now()
);

alter table public.user_learning_stats enable row level security;

drop policy if exists "Users can read their learning stats" on public.user_learning_stats;
create policy "Users can read their learning stats"
  on public.user_learning_stats for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Users can insert their learning stats" on public.user_learning_stats;
create policy "Users can insert their learning stats"
  on public.user_learning_stats for insert to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update their learning stats" on public.user_learning_stats;
create policy "Users can update their learning stats"
  on public.user_learning_stats for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

revoke all on public.user_learning_stats from public, anon;
grant select, insert, update on public.user_learning_stats to authenticated;

notify pgrst, 'reload schema';