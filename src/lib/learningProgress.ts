import { getSupabaseClient } from "@/lib/supabase";

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

function clientOrThrow() {
  const client = getSupabaseClient();
  if (!client) throw new Error("Thiếu cấu hình Supabase. Hãy kiểm tra .env.local.");
  return client;
}

export async function fetchUserLearningProgress(userId: string): Promise<Record<string, ReviewRecord>> {
  const { data, error } = await clientOrThrow()
    .from("user_learning_progress")
    .select("word_id,streak,interval_days,due_at")
    .eq("user_id", userId);

  if (error) throw new Error(`Không tải được tiến trình học: ${error.message}`);
  return Object.fromEntries(
    ((data ?? []) as ProgressRow[]).map((row) => [row.word_id, {
      streak: row.streak,
      intervalDays: row.interval_days,
      dueAt: row.due_at,
    }]),
  );
}

export async function fetchLearnedWordCount(userId: string): Promise<number> {
  const { count, error } = await clientOrThrow()
    .from("user_learning_progress")
    .select("word_id", { count: "exact", head: true })
    .eq("user_id", userId);

  if (error) throw new Error(`Không tải được số từ đã học: ${error.message}`);
  return count ?? 0;
}

export async function saveUserLearningProgress(
  userId: string,
  wordId: string,
  record: ReviewRecord,
): Promise<void> {
  const { error } = await clientOrThrow()
    .from("user_learning_progress")
    .upsert({
      user_id: userId,
      word_id: wordId,
      streak: record.streak,
      interval_days: record.intervalDays,
      due_at: record.dueAt,
    }, { onConflict: "user_id,word_id" });

  if (error) throw new Error(`Không lưu được tiến trình học: ${error.message}`);
}