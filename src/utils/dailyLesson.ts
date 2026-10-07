import { VocabularyDaily } from "@/types";
import { fetchDailyVocabulary } from "@/lib/learningData";
import { useLearningStore } from "@/stores/learningStore";

export async function getDailyWords(count: number = 10): Promise<VocabularyDaily[]> {
    const vocabulary = await fetchDailyVocabulary();
    const schedule = useLearningStore.getState().reviewSchedule;
    const now = Date.now();
    const due = vocabulary.filter((word) => {
        const record = schedule[word.id];
        return record && Date.parse(record.dueAt) <= now;
    });
    const fresh = vocabulary.filter((word) => !schedule[word.id]);
    const upcoming = vocabulary
        .filter((word) => schedule[word.id] && Date.parse(schedule[word.id].dueAt) > now)
        .sort((left, right) => Date.parse(schedule[left.id].dueAt) - Date.parse(schedule[right.id].dueAt));

    return [...due, ...fresh, ...upcoming].slice(0, count);
}