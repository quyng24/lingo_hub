-- Migration: 20261022010000_learning_materials_rls.sql
-- Description: Comprehensive Row Level Security (RLS) configuration for learning materials:
--   - public.vocabulary
--   - public.exercise_questions
--   - public.topics
--   - public.topic_vocabulary
-- Objectives:
-- 1. Enforce strict read-only access for client-facing roles (authenticated / anon).
-- 2. Prevent unauthenticated data scraping of vocabulary and exercise answers.
-- 3. Explicitly block all INSERT, UPDATE, DELETE, and TRUNCATE operations for client users.
-- 4. Preserve full administrative access for service_role (data imports, seed scripts, migrations).

-- =========================================================================
-- 1. ENABLE & FORCE ROW LEVEL SECURITY (RLS)
-- =========================================================================

alter table if exists public.vocabulary enable row level security;
alter table if exists public.vocabulary force row level security;

alter table if exists public.exercise_questions enable row level security;
alter table if exists public.exercise_questions force row level security;

alter table if exists public.topics enable row level security;
alter table if exists public.topics force row level security;

alter table if exists public.topic_vocabulary enable row level security;
alter table if exists public.topic_vocabulary force row level security;

-- =========================================================================
-- 2. CLEAN UP OLD / CONFLICTING POLICIES
-- =========================================================================

-- Vocabulary policies
drop policy if exists "Public can read vocabulary" on public.vocabulary;
drop policy if exists "Authenticated users can read vocabulary" on public.vocabulary;
drop policy if exists "Allow read vocabulary for authenticated" on public.vocabulary;
drop policy if exists "Allow read vocabulary for authenticated users" on public.vocabulary;
drop policy if exists "Block write vocabulary" on public.vocabulary;

-- Exercise questions policies
drop policy if exists "Public can read exercise questions" on public.exercise_questions;
drop policy if exists "Authenticated users can read exercise questions" on public.exercise_questions;
drop policy if exists "Allow read exercise questions for authenticated" on public.exercise_questions;
drop policy if exists "Allow read exercise_questions for authenticated users" on public.exercise_questions;
drop policy if exists "Block write exercise questions" on public.exercise_questions;

-- Topics policies
drop policy if exists "Public can read topics" on public.topics;
drop policy if exists "Authenticated users can read topics" on public.topics;
drop policy if exists "Allow read topics for all" on public.topics;
drop policy if exists "Allow read topics for everyone" on public.topics;
drop policy if exists "Block write topics" on public.topics;

-- Topic vocabulary policies
drop policy if exists "Public can read topic vocabulary" on public.topic_vocabulary;
drop policy if exists "Authenticated users can read topic vocabulary" on public.topic_vocabulary;
drop policy if exists "Allow read topic vocabulary for authenticated" on public.topic_vocabulary;
drop policy if exists "Allow read topic_vocabulary for everyone" on public.topic_vocabulary;
drop policy if exists "Block write topic vocabulary" on public.topic_vocabulary;

-- =========================================================================
-- 3. REVOKE MUTATION (WRITE) PRIVILEGES FROM CLIENT ROLES
-- =========================================================================

-- Revoke all write/modifying permissions from anon, authenticated, and public
revoke insert, update, delete, truncate on public.vocabulary from anon, authenticated, public;
revoke insert, update, delete, truncate on public.exercise_questions from anon, authenticated, public;
revoke insert, update, delete, truncate on public.topics from anon, authenticated, public;
revoke insert, update, delete, truncate on public.topic_vocabulary from anon, authenticated, public;

-- Revoke select from anon for private content (anti-scraping)
revoke select on public.vocabulary from anon;
revoke select on public.exercise_questions from anon;

-- =========================================================================
-- 4. CREATE EXPLICIT READ (SELECT) POLICIES
-- =========================================================================

-- 4.1. Topics: Open catalog for both guests and authenticated users to preview curriculum
create policy "Allow read topics for everyone"
  on public.topics
  for select
  to anon, authenticated
  using (true);

-- 4.2. Topic Vocabulary: Allow authenticated and guest users to read topic-vocabulary bindings
create policy "Allow read topic_vocabulary for everyone"
  on public.topic_vocabulary
  for select
  to anon, authenticated
  using (true);

-- 4.3. Vocabulary: Restricted to authenticated users to protect content IP from bots
create policy "Allow read vocabulary for authenticated users"
  on public.vocabulary
  for select
  to authenticated
  using (true);

-- 4.4. Exercise Questions: Restricted to authenticated users to protect question bank
create policy "Allow read exercise_questions for authenticated users"
  on public.exercise_questions
  for select
  to authenticated
  using (true);

-- =========================================================================
-- 5. GRANT PERMISSIONS
-- =========================================================================

-- Grant SELECT only to relevant client roles
grant select on public.topics to anon, authenticated;
grant select on public.topic_vocabulary to anon, authenticated;
grant select on public.vocabulary to authenticated;
grant select on public.exercise_questions to authenticated;

-- Service role retains full administrative privileges for data pipeline / imports
grant all on public.vocabulary to service_role;
grant all on public.exercise_questions to service_role;
grant all on public.topics to service_role;
grant all on public.topic_vocabulary to service_role;

-- Notify PostgREST to reload schema cache immediately
notify pgrst, 'reload schema';

