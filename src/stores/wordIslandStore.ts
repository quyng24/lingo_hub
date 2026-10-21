import { create } from 'zustand';
import type { DialogueState, DynamicQuest, QuestStage, QuizState, Resources } from '@/types';
import { DEFAULT_FALLBACK_QUEST } from '@/utils/wordIslandThemes';
import { wordIslandService } from '@/services/wordIslandService';

interface WordIslandStore {
  questStage: QuestStage;
  resources: Resources;
  isPaused: boolean;
  dialogue: DialogueState | null;
  activeQuiz: QuizState | null;
  currentQuest: DynamicQuest;
  isLoadingQuest: boolean;

  setQuestStage: (stage: QuestStage) => void;
  setResources: (resources: Resources) => void;
  addWood: () => void;
  addStone: () => void;
  setIsPaused: (paused: boolean | ((prev: boolean) => boolean)) => void;
  togglePause: () => void;
  setDialogue: (dialogue: DialogueState | null) => void;
  setActiveQuiz: (quiz: QuizState | null | ((prev: QuizState | null) => QuizState | null)) => void;
  setCurrentQuest: (quest: DynamicQuest) => void;
  loadNewQuest: () => Promise<void>;
  resetGame: () => void;
}

const INITIAL_RESOURCES: Resources = {
  wood: 0,
  stone: 0,
  hasAxe: false,
  hasGateKey: false,
};

export const useWordIslandStore = create<WordIslandStore>()((set) => ({
  questStage: 'TALK_TO_NPC',
  resources: { ...INITIAL_RESOURCES },
  isPaused: false,
  dialogue: null,
  activeQuiz: null,
  currentQuest: DEFAULT_FALLBACK_QUEST,
  isLoadingQuest: false,

  setQuestStage: (stage) => set({ questStage: stage }),
  setResources: (resources) => set({ resources }),
  addWood: () =>
    set((state) => ({
      resources: { ...state.resources, wood: state.resources.wood + 1 },
    })),
  addStone: () =>
    set((state) => ({
      resources: { ...state.resources, stone: state.resources.stone + 1 },
    })),
  setIsPaused: (paused) =>
    set((state) => ({
      isPaused: typeof paused === 'function' ? paused(state.isPaused) : paused,
    })),
  togglePause: () => set((state) => ({ isPaused: !state.isPaused })),
  setDialogue: (dialogue) => set({ dialogue }),
  setActiveQuiz: (quiz) =>
    set((state) => ({
      activeQuiz: typeof quiz === 'function' ? quiz(state.activeQuiz) : quiz,
    })),
  setCurrentQuest: (quest) => set({ currentQuest: quest }),

  loadNewQuest: async () => {
    set({ isLoadingQuest: true });
    try {
      const newQuest = await wordIslandService.fetchRandomQuest();
      set({ currentQuest: newQuest, isLoadingQuest: false });
    } catch {
      set({ isLoadingQuest: false });
    }
  },

  resetGame: () =>
    set({
      questStage: 'TALK_TO_NPC',
      resources: { ...INITIAL_RESOURCES },
      isPaused: false,
      dialogue: null,
      activeQuiz: null,
    }),
}));
