create table if not exists public.vocabulary (
  id text primary key,
  word text not null,
  pronunciation text not null default '',
  part_of_speech text not null default '',
  meanings text[] not null default '{}',
  common_phrases jsonb not null default '[]'::jsonb,
  examples jsonb not null default '[]'::jsonb,
  difficulty text check (difficulty in ('A1', 'A2', 'B1', 'B2')),
  tags text[] not null default '{}'
);

create table if not exists public.exercise_questions (
  id text primary key,
  word_id text not null references public.vocabulary(id) on delete cascade,
  context text not null,
  sentence text not null,
  options text[] not null,
  correct_answer text not null,
  sort_order integer not null default 0,
  constraint exercise_correct_answer_is_option
    check (correct_answer = any(options))
);

create table if not exists public.topics (
  id text primary key,
  name text not null,
  description text not null default ''
);

create table if not exists public.topic_vocabulary (
  topic_id text not null references public.topics(id) on delete cascade,
  vocabulary_id text not null references public.vocabulary(id) on delete cascade,
  sort_order integer not null default 0,
  primary key (topic_id, vocabulary_id)
);

alter table public.vocabulary enable row level security;
alter table public.exercise_questions enable row level security;
alter table public.topics enable row level security;
alter table public.topic_vocabulary enable row level security;

drop policy if exists "Public can read vocabulary" on public.vocabulary;
create policy "Public can read vocabulary"
  on public.vocabulary for select to anon, authenticated using (true);

drop policy if exists "Public can read exercise questions" on public.exercise_questions;
create policy "Public can read exercise questions"
  on public.exercise_questions for select to anon, authenticated using (true);

drop policy if exists "Public can read topics" on public.topics;
create policy "Public can read topics"
  on public.topics for select to anon, authenticated using (true);

drop policy if exists "Public can read topic vocabulary" on public.topic_vocabulary;
create policy "Public can read topic vocabulary"
  on public.topic_vocabulary for select to anon, authenticated using (true);

grant select on public.vocabulary to anon, authenticated;
grant select on public.exercise_questions to anon, authenticated;
grant select on public.topics to anon, authenticated;
grant select on public.topic_vocabulary to anon, authenticated;