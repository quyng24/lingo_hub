import { apiClient } from "@/services/apiClient";

export type ReviewRecord = {
  streak: number;
  intervalDays: number;
  dueAt: string;
};

type ProgressRow = {
  word_id: string;
  streak: number;
  interval_days: number;
  due_at: string;
};

export class LearningProgressService {
  async fetchForUser(userId: string): Promise<Record<string, ReviewRecord>> {
    const { data, error } = await apiClient.requireClient()
      .from("user_learning_progress")
      .select("word_id,streak,interval_days,due_at")
      .eq("user_id", userId);

    apiClient.throwIfError(error, "Không tải được tiến trình học");
    return Object.fromEntries(
      ((data ?? []) as ProgressRow[]).map((row) => [row.word_id, {
        streak: row.streak,
        intervalDays: row.interval_days,
        dueAt: row.due_at,
      }]),
    );
  }

  async countLearnedWords(userId: string): Promise<number> {
    const { count, error } = await apiClient.requireClient()
      .from("user_learning_progress")
      .select("word_id", { count: "exact", head: true })
      .eq("user_id", userId);

    apiClient.throwIfError(error, "Không tải được số từ đã học");
    return count ?? 0;
  }

  async saveForUser(userId: string, wordId: string, record: ReviewRecord): Promise<void> {
    const { error } = await apiClient.requireClient()
      .from("user_learning_progress")
      .upsert({
        user_id: userId,
        word_id: wordId,
        streak: record.streak,
        interval_days: record.intervalDays,
        due_at: record.dueAt,
      }, { onConflict: "user_id,word_id" });

    apiClient.throwIfError(error, "Không lưu được tiến trình học");
  }
}

export const learningProgressService = new LearningProgressService();