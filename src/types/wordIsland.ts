export type QuestStage =
  | 'TALK_TO_NPC'
  | 'GATHER_RESOURCES'
  | 'CRAFT_PUZZLE'
  | 'UNLOCK_CHEST'
  | 'UNLOCK_GATE'
  | 'VICTORY';

export interface Resources {
  wood: number;
  stone: number;
  hasAxe: boolean;
  hasGateKey: boolean;
}

export interface WorldObject {
  id: string;
  type: 'tree' | 'rock' | 'npc' | 'camp' | 'chest' | 'gate';
  x: number;
  y: number;
  width: number;
  height: number;
  solid: boolean;
  label: string;
  depleted?: boolean;
  respawnAt?: number;
  opened?: boolean;
}

export interface FloatingText {
  id: number;
  x: number;
  y: number;
  text: string;
  color: string;
  alpha: number;
}

export interface VocabQuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanationEn: string;
  explanationVi: string;
}

export interface VocabQuestion {
  id: string;
  title: string;
  contextEn: string;
  contextVi: string;
  question: string;
  hintVi: string;
  options: VocabQuestionOption[];
}

export interface DialogueChoice {
  label: string;
  action: () => void;
}

export interface DialogueState {
  speaker: string;
  en: string;
  vi: string;
  choices: DialogueChoice[];
}

export interface QuizFeedback {
  isCorrect: boolean;
  en: string;
  vi: string;
}

export interface QuizState {
  questions: VocabQuestion[];
  currentIndex: number;
  selectedFeedback: QuizFeedback | null;
  onComplete: () => void;
}

export interface PlayerState {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  dir: 'up' | 'down' | 'left' | 'right';
  walkFrame: number;
}

export interface GameEngineState {
  player: PlayerState;
  keys: Record<string, boolean>;
  objects: WorldObject[];
  floatingTexts: FloatingText[];
  nearestObject: WorldObject | null;
  shakeTime: number;
  questStage: QuestStage;
  resources: Resources;
  overlayOpen: boolean;
  paused: boolean;
}

