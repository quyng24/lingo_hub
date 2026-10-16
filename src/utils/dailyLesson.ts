import { VocabularyDaily } from "@/types";
import { learningService } from "@/services/learningService";
import { learningProgressService } from "@/services/learningProgressService";
import { useLearningStore } from "@/stores/learningStore";

export const DAILY_WORD_COUNT = 10;

export async function getDailyWords(userId: string, count: number = DAILY_WORD_COUNT): Promise<VocabularyDaily[]> {
    const [vocabulary, dueWords] = await Promise.all([
        learningService.fetchDailyVocabulary(),
        learningProgressService.getWordsDueForReview(userId),
    ]);
    const schedule = useLearningStore.getState().reviewSchedule;
    const now = Date.now();
    const dueIds = new Set(dueWords.map((word) => word.id));
    const due = dueWords;
    const fresh = vocabulary.filter((word) => !schedule[word.id]);
    const upcoming = vocabulary
        .filter((word) => !dueIds.has(word.id) && schedule[word.id] && Date.parse(schedule[word.id].dueAt) > now)
        .sort((left, right) => Date.parse(schedule[left.id].dueAt) - Date.parse(schedule[right.id].dueAt));

    return [...due, ...fresh, ...upcoming].slice(0, count);
}