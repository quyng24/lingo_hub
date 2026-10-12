create table if not exists public.user_learning_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  word_id text not null references public.vocabulary(id) on delete cascade,
  streak integer not null default 0 check (streak >= 0),
  interval_days integer not null default 1 check (interval_days > 0),
  due_at timestamptz not null,
  primary key (user_id, word_id)
);

alter table public.user_learning_progress enable row level security;

drop policy if exists "Users can read their learning progress" on public.user_learning_progress;
create policy "Users can read their learning progress"
  on public.user_learning_progress for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Users can insert their learning progress" on public.user_learning_progress;
create policy "Users can insert their learning progress"
  on public.user_learning_progress for insert to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update their learning progress" on public.user_learning_progress;
create policy "Users can update their learning progress"
  on public.user_learning_progress for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can delete their learning progress" on public.user_learning_progress;
create policy "Users can delete their learning progress"
  on public.user_learning_progress for delete to authenticated
  using ((select auth.uid()) = user_id);

revoke all on public.user_learning_progress from public, anon;
grant select, insert, update, delete on public.user_learning_progress to authenticated;