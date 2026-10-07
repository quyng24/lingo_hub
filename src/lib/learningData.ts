import { ExerciseQuestion, VocabularyDaily, Word } from "@/types";
import { getSupabaseClient } from "@/lib/supabase";

type VocabularyRow = {
  id: string;
  word: string;
  pronunciation: string;
  part_of_speech: string;
  meanings: string[];
  common_phrases: VocabularyDaily["commonPhrases"];
  examples: VocabularyDaily["examples"];
  difficulty: VocabularyDaily["difficulty"] | null;
  tags: string[];
};

export type LearningTopic = {
  id: string;
  name: string;
  description: string;
  wordCount: number;
};

function clientOrThrow() {
  const client = getSupabaseClient();
  if (!client) {
    throw new Error("Thiếu cấu hình Supabase. Hãy kiểm tra .env.local.");
  }
  return client;
}

function asDailyVocabulary(row: VocabularyRow): VocabularyDaily {
  if (!row.difficulty) {
    throw new Error(`Từ ${row.id} chưa có difficulty cho bài học hằng ngày.`);
  }

  return {
    id: row.id,
    word: row.word,
    pronunciation: row.pronunciation,
    partOfSpeech: row.part_of_speech,
    meanings: row.meanings,
    commonPhrases: row.common_phrases,
    examples: row.examples,
    difficulty: row.difficulty,
    tags: row.tags,
  };
}

function naturalIdOrder(left: { id: string }, right: { id: string }) {
  return left.id.localeCompare(right.id, undefined, { numeric: true });
}

export async function fetchDailyVocabulary(): Promise<VocabularyDaily[]> {
  const { data, error } = await clientOrThrow()
    .from("vocabulary")
    .select("*")
    .not("difficulty", "is", null);

  if (error) throw new Error(`Không tải được từ vựng: ${error.message}`);
  return ((data ?? []) as VocabularyRow[]).sort(naturalIdOrder).map(asDailyVocabulary);
}

export async function fetchVocabularyByIds(ids: string[]): Promise<VocabularyDaily[]> {
  if (ids.length === 0) return [];

  const { data, error } = await clientOrThrow()
    .from("vocabulary")
    .select("*")
    .in("id", ids);

  if (error) throw new Error(`Không tải được từ ôn tập: ${error.message}`);
  const rows = new Map(((data ?? []) as VocabularyRow[]).map((row) => [row.id, row]));
  return ids.flatMap((id) => {
    const row = rows.get(id);
    return row?.difficulty ? [asDailyVocabulary(row)] : [];
  });
}

export async function fetchExerciseQuestions(): Promise<ExerciseQuestion[]> {
  const { data, error } = await clientOrThrow()
    .from("exercise_questions")
    .select("id,word_id,context,sentence,options,correct_answer,sort_order")
    .order("sort_order");

  if (error) throw new Error(`Không tải được bài tập: ${error.message}`);
  return (data ?? []).map((row) => ({
    id: row.id,
    wordId: row.word_id,
    context: row.context,
    sentence: row.sentence,
    options: row.options,
    correctAnswer: row.correct_answer,
  }));
}

export async function fetchGameTopics(): Promise<LearningTopic[]> {
  const client = clientOrThrow();
  const [{ data: topics, error: topicsError }, { data: links, error: linksError }] =
    await Promise.all([
      client.from("topics").select("id,name,description").order("id"),
      client.from("topic_vocabulary").select("topic_id"),
    ]);

  if (topicsError) throw new Error(`Không tải được chủ đề: ${topicsError.message}`);
  if (linksError) throw new Error(`Không tải được từ theo chủ đề: ${linksError.message}`);

  const counts = new Map<string, number>();
  for (const link of links ?? []) {
    counts.set(link.topic_id, (counts.get(link.topic_id) ?? 0) + 1);
  }

  return (topics ?? []).map((topic) => ({
    ...topic,
    wordCount: counts.get(topic.id) ?? 0,
  }));
}

export async function fetchGameWords(topicId: string): Promise<Word[]> {
  const client = clientOrThrow();
  const { data: links, error: linksError } = await client
    .from("topic_vocabulary")
    .select("vocabulary_id,sort_order")
    .eq("topic_id", topicId)
    .order("sort_order");

  if (linksError) throw new Error(`Không tải được từ của chủ đề: ${linksError.message}`);
  const orderedIds = (links ?? []).map((link) => link.vocabulary_id);
  if (orderedIds.length === 0) return [];

  const { data: words, error: wordsError } = await client
    .from("vocabulary")
    .select("id,word,meanings")
    .in("id", orderedIds);

  if (wordsError) throw new Error(`Không tải được từ cho Word Blaster: ${wordsError.message}`);
  const wordById = new Map((words ?? []).map((row) => [row.id, row]));
  return orderedIds.flatMap((id) => {
    const row = wordById.get(id);
    return row ? [{ id: row.id, text: row.word, meaning: row.meanings[0] ?? "" }] : [];
  });
}