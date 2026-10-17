# Supabase vocabulary import

This package uses stable existing word IDs to preserve foreign keys and user SRS rows. The generator only reads Supabase; it never writes to the database.

## Generate

From the repository root, run: node --env-file=.env.local supabase/import/generate.mjs
The script uses only the public anon key and requires the current snapshot of 250 words and 20 questions.

## Import in Supabase

1. Run prepare_import.sql in SQL Editor. It creates locked staging tables and clears only those staging tables.
2. Import vocabulary.csv into vocabulary_import_stage, exercise_questions.csv into exercise_questions_import_stage, and topic_vocabulary.csv into topic_vocabulary_import_stage using Table Editor.
3. Run merge_import.sql in SQL Editor. It upserts stable keys and does not delete existing vocabulary or user progress.
4. Run validate_import.sql. Expected totals are 500 words, 500 questions and 500 topic links; integrity queries should return zero rows.

The 7 existing topics are reused. vocabulary.csv contains 230 enrichment updates and 250 new words. exercise_questions.csv adds one linked question for each of the 480 words without an existing question. topic_vocabulary.csv adds links for 20 Daily Learn words and 250 new words.
