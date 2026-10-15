import type { ExerciseQuestion, VocabularyDaily, Word } from "@/types";
import { apiClient } from "@/services/apiClient";

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

export class LearningService {
  async fetchDailyVocabulary(): Promise<VocabularyDaily[]> {
    const { data, error } = await apiClient.requireClient()
      .from("vocabulary")
      .select("*")
      .not("difficulty", "is", null);

    apiClient.throwIfError(error, "Không tải được từ vựng");
    return ((data ?? []) as VocabularyRow[]).sort(naturalIdOrder).map(asDailyVocabulary);
  }

  async fetchVocabularyByIds(ids: string[]): Promise<VocabularyDaily[]> {
    if (ids.length === 0) return [];

    const { data, error } = await apiClient.requireClient()
      .from("vocabulary")
      .select("*")
      .in("id", ids);

    apiClient.throwIfError(error, "Không tải được từ ôn tập");
    const rows = new Map(((data ?? []) as VocabularyRow[]).map((row) => [row.id, row]));
    return ids.flatMap((id) => {
      const row = rows.get(id);
      return row?.difficulty ? [asDailyVocabulary(row)] : [];
    });
  }

  async fetchExerciseQuestions(wordIds?: string[]): Promise<ExerciseQuestion[]> {
    if (wordIds && wordIds.length === 0) return [];

    const client = apiClient.requireClient();
    let query = client
      .from("exercise_questions")
      .select("id,word_id,context,sentence,options,correct_answer,sort_order");
    if (wordIds) query = query.in("word_id", wordIds);
    const { data, error } = await query.order("sort_order");

    apiClient.throwIfError(error, "Không tải được bài tập");
    return (data ?? []).map((row) => ({
      id: row.id,
      wordId: row.word_id,
      context: row.context,
      sentence: row.sentence,
      options: row.options,
      correctAnswer: row.correct_answer,
    }));
  }

  async fetchGameTopics(): Promise<LearningTopic[]> {
    const client = apiClient.requireClient();
    const [{ data: topics, error: topicsError }, { data: links, error: linksError }] =
      await Promise.all([
        client.from("topics").select("id,name,description").order("id"),
        client.from("topic_vocabulary").select("topic_id"),
      ]);

    apiClient.throwIfError(topicsError, "Không tải được chủ đề");
    apiClient.throwIfError(linksError, "Không tải được từ theo chủ đề");

    const counts = new Map<string, number>();
    for (const link of links ?? []) {
      counts.set(link.topic_id, (counts.get(link.topic_id) ?? 0) + 1);
    }

    return (topics ?? []).map((topic) => ({
      ...topic,
      wordCount: counts.get(topic.id) ?? 0,
    }));
  }

  async fetchGameWords(topicId: string): Promise<Word[]> {
    const client = apiClient.requireClient();
    const { data: links, error: linksError } = await client
      .from("topic_vocabulary")
      .select("vocabulary_id,sort_order")
      .eq("topic_id", topicId)
      .order("sort_order");

    apiClient.throwIfError(linksError, "Không tải được từ của chủ đề");
    const orderedIds = (links ?? []).map((link) => link.vocabulary_id);
    if (orderedIds.length === 0) return [];

    const { data: words, error: wordsError } = await client
      .from("vocabulary")
      .select("id,word,meanings")
      .in("id", orderedIds);

    apiClient.throwIfError(wordsError, "Không tải được từ cho Word Blaster");
    const wordById = new Map((words ?? []).map((row) => [row.id, row]));
    return orderedIds.flatMap((id) => {
      const row = wordById.get(id);
      return row ? [{ id: row.id, text: row.word, meaning: row.meanings[0] ?? "" }] : [];
    });
  }
}

export const learningService = new LearningService();