import { apiClient } from '@/services/apiClient';
import type { DynamicQuest, QuestWordInfo, VocabQuestion, VocabQuestionOption } from '@/types';
import { DEFAULT_FALLBACK_QUEST, ISLAND_THEMES } from '@/utils/wordIslandThemes';

const AVAILABLE_TOPICS = [
  'animals',
  'tech',
  'space',
  'weather',
  'sports',
  'action',
  'emotions',
];

interface RawVocabRow {
  id: string;
  word: string;
  pronunciation: string;
  part_of_speech: string;
  meanings: string[];
  examples?: Array<{ sentence: string; translation: string }>;
  difficulty?: string;
}

interface RawQuestionRow {
  id: string;
  word_id: string;
  context: string;
  sentence: string;
  options: string[];
  correct_answer: string;
}

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export class WordIslandService {
  async fetchRandomQuest(): Promise<DynamicQuest> {
    try {
      const client = apiClient.requireClient();

      // 1. Pick a random topic
      const randomTopicId =
        AVAILABLE_TOPICS[Math.floor(Math.random() * AVAILABLE_TOPICS.length)];
      const theme = ISLAND_THEMES[randomTopicId] || ISLAND_THEMES.default;

      // 2. Fetch vocabulary links for this topic
      const { data: links, error: linksError } = await client
        .from('topic_vocabulary')
        .select('vocabulary_id')
        .eq('topic_id', randomTopicId);

      if (linksError || !links || links.length < 7) {
        console.warn('WordIslandService: Not enough words in topic, using fallback', linksError);
        return DEFAULT_FALLBACK_QUEST;
      }

      // Shuffle and pick 7 word IDs
      const shuffledIds = shuffleArray(links.map((l) => l.vocabulary_id)).slice(0, 7);

      // 3. Fetch vocabulary details
      const { data: vocabRows, error: vocabError } = await client
        .from('vocabulary')
        .select('id, word, pronunciation, part_of_speech, meanings, examples, difficulty')
        .in('id', shuffledIds);

      if (vocabError || !vocabRows || vocabRows.length < 7) {
        console.warn('WordIslandService: Vocabulary query failed, using fallback', vocabError);
        return DEFAULT_FALLBACK_QUEST;
      }

      // 4. Fetch exercise questions for these 7 words
      const { data: questionRows, error: questionsError } = await client
        .from('exercise_questions')
        .select('id, word_id, context, sentence, options, correct_answer')
        .in('word_id', shuffledIds);

      if (questionsError || !questionRows || questionRows.length < 7) {
        console.warn('WordIslandService: Questions query failed, using fallback', questionsError);
        return DEFAULT_FALLBACK_QUEST;
      }

      // Map rows by word_id
      const vocabMap = new Map<string, RawVocabRow>(
        (vocabRows as RawVocabRow[]).map((v) => [v.id, v])
      );
      const questionMap = new Map<string, RawQuestionRow>(
        (questionRows as RawQuestionRow[]).map((q) => [q.word_id, q])
      );

      // Assemble ordered words list
      const orderedWords: QuestWordInfo[] = [];
      const orderedQuestions: VocabQuestion[] = [];

      for (let i = 0; i < shuffledIds.length; i++) {
        const id = shuffledIds[i];
        const v = vocabMap.get(id);
        const q = questionMap.get(id);
        if (!v || !q) continue;

        const wordInfo: QuestWordInfo = {
          id: v.id,
          word: v.word,
          pronunciation: v.pronunciation || '',
          partOfSpeech: v.part_of_speech || 'noun',
          meanings: v.meanings || [],
          exampleSentence: v.examples?.[0]?.sentence || '',
          exampleTranslation: v.examples?.[0]?.translation || '',
          difficulty: v.difficulty || 'A2',
        };
        orderedWords.push(wordInfo);

        // Build 4 options with labels 'a', 'b', 'c', 'd'
        const optionIds = ['a', 'b', 'c', 'd'];
        const options: VocabQuestionOption[] = q.options.map((optText, optIdx) => {
          const isCorrect = optText.trim().toLowerCase() === q.correct_answer.trim().toLowerCase();
          return {
            id: optionIds[optIdx] || String(optIdx + 1),
            text: optText,
            isCorrect,
            explanationEn: isCorrect
              ? `Correct! "${optText}" fits the sentence perfectly.`
              : `"${optText}" is not the intended word in this sentence.`,
            explanationVi: isCorrect
              ? `Chính xác! "${optText}" là đáp án đúng.`
              : `"${optText}" chưa phù hợp với ngữ cảnh câu này.`,
          };
        });

        // Determine title based on quest act
        let title = `Câu hỏi từ vựng (${i + 1}/7)`;
        if (i === 0) title = `Hồi 1: Thử thách khởi động - ${theme.mentorName}`;
        else if (i === 1) title = `Hồi 2: Chế tạo ${theme.toolNameVi} (1/2)`;
        else if (i === 2) title = `Hồi 2: Chế tạo ${theme.toolNameVi} (2/2)`;
        else if (i === 3) title = `Hồi 3: Mở ${theme.chestNameVi} (1/2)`;
        else if (i === 4) title = `Hồi 3: Mở ${theme.chestNameVi} (2/2)`;
        else if (i === 5) title = `Hồi 4: Thử thách Cổng Đá (1/2)`;
        else if (i === 6) title = `Hồi 4: Thử thách Cổng Đá (2/2)`;

        orderedQuestions.push({
          id: q.id,
          title,
          contextEn: `Context: ${v.word} (${v.part_of_speech})`,
          contextVi: q.context,
          question: q.sentence,
          hintVi: `Gợi ý: Tìm từ có nghĩa "${v.meanings[0] || v.word}" để điền vào chỗ trống.`,
          wordId: v.id,
          word: v.word,
          options,
        });
      }

      if (orderedWords.length < 7 || orderedQuestions.length < 7) {
        return DEFAULT_FALLBACK_QUEST;
      }

      return {
        theme,
        words: orderedWords,
        puzzles: {
          act1_intro: [orderedQuestions[0]],
          act2_craft: [orderedQuestions[1], orderedQuestions[2]],
          act3_chest: [orderedQuestions[3], orderedQuestions[4]],
          act4_gate: [orderedQuestions[5], orderedQuestions[6]],
        },
      };
    } catch (err) {
      console.error('WordIslandService: Unexpected error generating quest, using fallback', err);
      return DEFAULT_FALLBACK_QUEST;
    }
  }
}

export const wordIslandService = new WordIslandService();

