select 'vocabulary' as table_name, count(*) as row_count from public.vocabulary union all select 'exercise_questions', count(*) from public.exercise_questions union all select 'topic_vocabulary', count(*) from public.topic_vocabulary;
select v.id, v.word from public.vocabulary v left join public.exercise_questions q on q.word_id=v.id group by v.id,v.word having count(q.id) <> 1;
select q.id,q.word_id from public.exercise_questions q left join public.vocabulary v on v.id=q.word_id where v.id is null or not (q.correct_answer = any(q.options));
select v.id,v.word from public.vocabulary v where v.difficulty is null or cardinality(v.meanings)=0 or jsonb_array_length(v.examples)=0 or jsonb_array_length(v.common_phrases)=0;
select v.id,v.word from public.vocabulary v left join public.topic_vocabulary tv on tv.vocabulary_id=v.id where tv.vocabulary_id is null;
select difficulty,count(*) from public.vocabulary group by difficulty order by difficulty;
select t.id,t.name,count(tv.vocabulary_id) as word_count from public.topics t left join public.topic_vocabulary tv on tv.topic_id=t.id group by t.id,t.name order by t.id;
