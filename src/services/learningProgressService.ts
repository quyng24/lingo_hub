import { apiClient } from "@/services/apiClient";
import { learningService } from "@/services/learningService";
import type { VocabularyDaily } from "@/types";

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

export type UserLearningStats = {
  newWords: number;
  rememberingWords: number;
  learningWords: number;
  masteredWords: number;
  totalWords: number;
  dueWords: number;
  streakCount: number;
  lastStudyDate: string | null;
  streakTrackingEnabled: boolean;
};

type SupabaseQueryError = {
  code?: string;
  message: string;
};

const REVIEW_INTERVALS = [1, 3, 7, 14, 30];
const MASTERED_STREAK = REVIEW_INTERVALS.length;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function getEndOfToday(base = new Date()): Date {
  const d = new Date(base);
  d.setHours(23, 59, 59, 999);
  return d;
}

function localDateString(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function daysBetweenDates(startDate: string, endDate: string) {
  const [startYear, startMonth, startDay] = startDate.split("-").map(Number);
  const [endYear, endMonth, endDay] = endDate.split("-").map(Number);
  const start = Date.UTC(startYear, startMonth - 1, startDay);
  const end = Date.UTC(endYear, endMonth - 1, endDay);
  return Math.round((end - start) / MS_PER_DAY);
}

function isMissingStreakTable(error: SupabaseQueryError | null) {
  return Boolean(
    error &&
    error.message.includes("user_learning_stats") &&
    (error.code === "PGRST205" || error.message.includes("schema cache")),
  );
}

export class LearningProgressService {
  private lastRequestTime = 0;
  private readonly minRequestIntervalMs = 250;

  private async throttleRequest(): Promise<void> {
    const now = Date.now();
    const elapsed = now - this.lastRequestTime;
    if (elapsed < this.minRequestIntervalMs) {
      await new Promise((resolve) => setTimeout(resolve, this.minRequestIntervalMs - elapsed));
    }
    this.lastRequestTime = Date.now();
  }

  async getUserProgress(userId: string): Promise<Record<string, ReviewRecord>> {
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

  async getWordsDueForReview(userId: string, asOf = getEndOfToday()): Promise<VocabularyDaily[]> {
    const { data, error } = await apiClient.requireClient()
      .from("user_learning_progress")
      .select("word_id")
      .eq("user_id", userId)
      .lte("due_at", asOf.toISOString())
      .order("due_at");

    apiClient.throwIfError(error, "Không tải được từ đến hạn ôn tập");
    const wordIds = (data ?? []).map((row) => row.word_id);
    return learningService.fetchVocabularyByIds(wordIds);
  }

  async updateWordProgress(
    userId: string,
    wordId: string,
    isCorrect: boolean,
    reviewedAt = new Date(),
  ): Promise<ReviewRecord> {
    await this.throttleRequest();
    const client = apiClient.requireClient();

    // 1. Attempt Server-Side RPC (anti-cheat & server-computed SRS)
    try {
      const { data: rpcData, error: rpcError } = await client.rpc("record_word_review", {
        p_word_id: wordId,
        p_is_correct: isCorrect,
      });

      if (!rpcError && rpcData && typeof rpcData === "object" && "streak" in rpcData) {
        const result = rpcData as { streak: number; intervalDays: number; dueAt: string };
        return {
          streak: Number(result.streak),
          intervalDays: Number(result.intervalDays),
          dueAt: String(result.dueAt),
        };
      }
    } catch {
      // Fall back to client calculation if RPC is not yet migrated in database
    }

    // 2. Client fallback
    const { data: previous, error: readError } = await client
      .from("user_learning_progress")
      .select("streak")
      .eq("user_id", userId)
      .eq("word_id", wordId)
      .maybeSingle();

    apiClient.throwIfError(readError, "Không đọc được tiến trình từ vựng");

    const streak = isCorrect ? (previous?.streak ?? 0) + 1 : 0;
    const intervalDays = isCorrect
      ? REVIEW_INTERVALS[Math.min(streak - 1, REVIEW_INTERVALS.length - 1)]
      : 1;
    const dueAt = new Date(reviewedAt);
    dueAt.setDate(dueAt.getDate() + intervalDays);
    const record = { streak, intervalDays, dueAt: dueAt.toISOString() };

    const { error: writeError } = await client
      .from("user_learning_progress")
      .upsert({
        user_id: userId,
        word_id: wordId,
        streak: record.streak,
        interval_days: record.intervalDays,
        due_at: record.dueAt,
      }, { onConflict: "user_id,word_id" });

    apiClient.throwIfError(writeError, "Không lưu được tiến trình học");
    await this.updateDailyStreak(userId, reviewedAt);
    return record;
  }

  async getUserStats(userId: string): Promise<UserLearningStats> {
    const client = apiClient.requireClient();
    const endOfDayIso = getEndOfToday().toISOString();
    const [newWordsResult, rememberingWordsResult, masteredWordsResult, dueWordsResult, streakResult] = await Promise.all([
      client.from("user_learning_progress")
        .select("word_id", { count: "exact", head: true })
        .eq("user_id", userId)
        .lte("interval_days", 3),
      client.from("user_learning_progress")
        .select("word_id", { count: "exact", head: true })
        .eq("user_id", userId)
        .gte("interval_days", 7)
        .lte("interval_days", 14),
      client.from("user_learning_progress")
        .select("word_id", { count: "exact", head: true })
        .eq("user_id", userId)
        .gte("streak", MASTERED_STREAK)
        .gte("interval_days", REVIEW_INTERVALS[REVIEW_INTERVALS.length - 1]),
      client.from("user_learning_progress")
        .select("word_id", { count: "exact", head: true })
        .eq("user_id", userId)
        .lte("due_at", endOfDayIso),
      client.from("user_learning_stats")
        .select("last_study_date,streak_count")
        .eq("user_id", userId)
        .maybeSingle(),
    ]);

    apiClient.throwIfError(newWordsResult.error, "Không tải được số từ mới học");
    apiClient.throwIfError(rememberingWordsResult.error, "Không tải được số từ đang nhớ");
    apiClient.throwIfError(masteredWordsResult.error, "Không tải được số từ đã thành thạo");
    apiClient.throwIfError(dueWordsResult.error, "Không tải được số từ cần ôn");
    const streakTrackingEnabled = !isMissingStreakTable(streakResult.error);
    if (streakTrackingEnabled) {
      apiClient.throwIfError(streakResult.error, "Không tải được chuỗi ngày học");
    }

    const newWords = newWordsResult.count ?? 0;
    const rememberingWords = rememberingWordsResult.count ?? 0;
    const masteredWords = masteredWordsResult.count ?? 0;
    const dueWords = dueWordsResult.count ?? 0;
    const totalWords = newWords + rememberingWords + masteredWords;
    const lastStudyDate = streakTrackingEnabled ? streakResult.data?.last_study_date ?? null : null;
    const streakCount = lastStudyDate && daysBetweenDates(lastStudyDate, localDateString(new Date())) <= 1
      ? streakResult.data?.streak_count ?? 0
      : 0;

    return {
      newWords,
      rememberingWords,
      learningWords: newWords + rememberingWords,
      masteredWords,
      dueWords,
      totalWords,
      streakCount,
      lastStudyDate,
      streakTrackingEnabled,
    };
  }

  private async updateDailyStreak(userId: string, reviewedAt: Date) {
    await this.throttleRequest();
    const client = apiClient.requireClient();
    const studyDate = localDateString(reviewedAt);
    const { data: previous, error: readError } = await client
      .from("user_learning_stats")
      .select("last_study_date,streak_count")
      .eq("user_id", userId)
      .maybeSingle();

    if (isMissingStreakTable(readError)) return;
    apiClient.throwIfError(readError, "Không đọc được chuỗi ngày học");

    let streakCount = 1;
    if (previous?.last_study_date === studyDate) {
      streakCount = previous.streak_count;
    } else if (previous?.last_study_date && daysBetweenDates(previous.last_study_date, studyDate) === 1) {
      streakCount = previous.streak_count + 1;
    }

    const { error: writeError } = await client
      .from("user_learning_stats")
      .upsert({
        user_id: userId,
        last_study_date: studyDate,
        streak_count: streakCount,
      }, { onConflict: "user_id" });

    if (isMissingStreakTable(writeError)) return;
    apiClient.throwIfError(writeError, "Không cập nhật được chuỗi ngày học");
  }
}

export const learningProgressService = new LearningProgressService();