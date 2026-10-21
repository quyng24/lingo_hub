-- Migration: 20261021000000_security_and_rate_limits.sql
-- Description:
-- 1. Restrict vocabulary & exercise_questions to authenticated users only (prevent data scraping).
-- 2. Anti-cheat trigger: prevent client-side tampering of streak (max +1 streak per day, no future dates).
-- 3. Database rate-limiting: prevent rapid spamming of write requests.
-- 4. Server-side RPC function record_word_review: atomic, server-enforced SRS and streak calculation.

-- =========================================================================
-- 1. RESTRICT VOCABULARY & EXERCISE DATA TO AUTHENTICATED USERS ONLY
-- =========================================================================

-- Revoke public / anon select privileges
revoke select on public.vocabulary from anon;
revoke select on public.exercise_questions from anon;
revoke select on public.topics from anon;
revoke select on public.topic_vocabulary from anon;

-- Drop old public policies
drop policy if exists "Public can read vocabulary" on public.vocabulary;
drop policy if exists "Public can read exercise questions" on public.exercise_questions;
drop policy if exists "Public can read topics" on public.topics;
drop policy if exists "Public can read topic vocabulary" on public.topic_vocabulary;

-- Create authenticated-only policies
create policy "Authenticated users can read vocabulary"
  on public.vocabulary for select to authenticated using (true);

create policy "Authenticated users can read exercise questions"
  on public.exercise_questions for select to authenticated using (true);

create policy "Authenticated users can read topics"
  on public.topics for select to authenticated using (true);

create policy "Authenticated users can read topic vocabulary"
  on public.topic_vocabulary for select to authenticated using (true);

grant select on public.vocabulary to authenticated;
grant select on public.exercise_questions to authenticated;
grant select on public.topics to authenticated;
grant select on public.topic_vocabulary to authenticated;

-- =========================================================================
-- 2. ANTI-CHEAT & RATE LIMITING TRIGGER ON user_learning_stats
-- =========================================================================

create or replace function public.validate_user_learning_stats()
returns trigger as $$
declare
  v_now timestamptz := clock_timestamp();
  v_today date := current_date;
begin
  -- Prevent user_id tampering
  if tg_op = 'UPDATE' and new.user_id <> old.user_id then
    raise exception 'Cannot change user_id' using errcode = '42501';
  end if;

  -- Database Rate Limiting: Minimum 200ms between updates per user to prevent network spam/DDoS
  if tg_op = 'UPDATE' and old.updated_at is not null then
    if (v_now - old.updated_at) < interval '0.2 second' then
      raise exception 'Rate limit exceeded: Please wait before submitting progress.' using errcode = '42901';
    end if;
  end if;

  -- Anti-cheat: Study date cannot be in the future
  if new.last_study_date > v_today then
    raise exception 'Anti-cheat: Study date cannot be in the future.' using errcode = '22007';
  end if;

  -- Anti-cheat: Streak can only increase by at most +1 from previous value
  if tg_op = 'UPDATE' then
    if new.streak_count > old.streak_count + 1 then
      raise exception 'Anti-cheat: Streak cannot increase by more than 1 per day (Current: %, Attempted: %)',
        old.streak_count, new.streak_count using errcode = '23514';
    end if;

    -- If study date is the same, streak cannot increase
    if old.last_study_date = new.last_study_date and new.streak_count > old.streak_count then
      raise exception 'Anti-cheat: Streak already recorded for today.' using errcode = '23514';
    end if;
  end if;

  new.updated_at := v_now;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists trg_validate_user_learning_stats on public.user_learning_stats;
create trigger trg_validate_user_learning_stats
  before insert or update on public.user_learning_stats
  for each row execute function public.validate_user_learning_stats();

-- =========================================================================
-- 3. SERVER-SIDE RPC FUNCTION FOR WORD REVIEW & STREAK (SECURE BY DESIGN)
-- =========================================================================

create or replace function public.record_word_review(
  p_word_id text,
  p_is_correct boolean
) returns jsonb as $$
declare
  v_user_id uuid;
  v_prev_word_streak integer := 0;
  v_new_word_streak integer;
  v_interval_days integer;
  v_due_at timestamptz;
  v_prev_streak integer := 0;
  v_last_study date;
  v_new_streak integer;
  v_today date := current_date;
  v_now timestamptz := clock_timestamp();
  v_intervals integer[] := array[1, 3, 7, 14, 30];
begin
  -- 1. Identify calling user from auth session
  v_user_id := auth.uid();
  if v_user_id is null then
    raise exception 'Unauthorized: Must be logged in' using errcode = '40100';
  end if;

  -- 2. Verify word exists
  if not exists (select 1 from public.vocabulary where id = p_word_id) then
    raise exception 'Word not found: %', p_word_id using errcode = '22023';
  end if;

  -- 3. Read current SRS progress for this word
  select streak into v_prev_word_streak
  from public.user_learning_progress
  where user_id = v_user_id and word_id = p_word_id;

  if not found then
    v_prev_word_streak := 0;
  end if;

  -- 4. Calculate new SRS interval on server
  if p_is_correct then
    v_new_word_streak := v_prev_word_streak + 1;
    v_interval_days := v_intervals[least(v_new_word_streak, 5)];
  else
    v_new_word_streak := 0;
    v_interval_days := 1;
  end if;

  v_due_at := v_now + (v_interval_days || ' days')::interval;

  -- 5. Upsert user_learning_progress
  insert into public.user_learning_progress (user_id, word_id, streak, interval_days, due_at)
  values (v_user_id, p_word_id, v_new_word_streak, v_interval_days, v_due_at)
  on conflict (user_id, word_id) do update set
    streak = excluded.streak,
    interval_days = excluded.interval_days,
    due_at = excluded.due_at;

  -- 6. Update user daily streak safely
  select streak_count, last_study_date into v_prev_streak, v_last_study
  from public.user_learning_stats
  where user_id = v_user_id;

  if not found then
    v_new_streak := 1;
  elsif v_last_study = v_today then
    v_new_streak := v_prev_streak;
  elsif v_last_study = v_today - 1 then
    v_new_streak := v_prev_streak + 1;
  else
    v_new_streak := 1;
  end if;

  insert into public.user_learning_stats (user_id, last_study_date, streak_count, updated_at)
  values (v_user_id, v_today, v_new_streak, v_now)
  on conflict (user_id) do update set
    last_study_date = excluded.last_study_date,
    streak_count = excluded.streak_count,
    updated_at = excluded.updated_at;

  return jsonb_build_object(
    'wordId', p_word_id,
    'streak', v_new_word_streak,
    'intervalDays', v_interval_days,
    'dueAt', v_due_at,
    'streakCount', v_new_streak,
    'lastStudyDate', v_today
  );
end;
$$ language plpgsql security definer set search_path = public;

-- Grant execution to authenticated users
grant execute on function public.record_word_review(text, boolean) to authenticated;

notify pgrst, 'reload schema';

