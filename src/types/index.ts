export interface Word {
    id: string;
    text: string;
    meaning: string;
}

export interface ActiveWord extends Word {
    x: number;
    y: number;
    speed: number;
}

export interface GameState {
    status: "idle" | "playing" | "game-over";
    score: number;
    lives: number;
    combo: number;
    activeWords: ActiveWord[];
    currentInput: string;
    lastMissedWord: Word | null;
    isShaking: boolean;
}

export interface GameStatePhase2 extends Omit<GameState, 'status'> {
    status: "idle" | "playing" | "game-over";
    level: number;
    explosions: Explosion[];
    selectedTopicId: string | null;
}

export interface Explosion {
    id: string;
    x: number;
    y: number;
    text: string;
    earnedScore: number;
    timeLeft: number;
}

export type VocabularyDaily = {
  id: string
  word: string
  pronunciation: string
  partOfSpeech: string
  meanings: string[]
  commonPhrases: {
    phrase: string
    meaning: string
  }[]
  examples: {
    sentence: string
    translation: string
  }[]
  difficulty: "A1" | "A2" | "B1" | "B2"
  tags: string[]
}

export type LearningStep = "WORD" | "PHRASE" | "SENTENCE";

export interface ExerciseQuestion {
    id: string;
    wordId: string;
    context: string;
    sentence: string;
    options: string[];
    correctAnswer: string;
}

export * from './wordIsland';
