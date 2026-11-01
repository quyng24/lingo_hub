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
  subStationsActivated: number;
}

export type WorldObjectType =
  | 'tree'
  | 'rock'
  | 'npc'
  | 'camp'
  | 'chest'
  | 'gate'
  | 'sub_station';

export interface WorldObject {
  id: string;
  type: WorldObjectType;
  subType?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  solid: boolean;
  label: string;
  depleted?: boolean;
  respawnAt?: number;
  opened?: boolean;
  activated?: boolean;
  customSpriteKey?: string;
  question?: VocabQuestion;
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
  wordId?: string;
  word?: string;
  options: VocabQuestionOption[];
}

export interface QuestWordInfo {
  id: string;
  word: string;
  pronunciation: string;
  partOfSpeech: string;
  meanings: string[];
  exampleSentence?: string;
  exampleTranslation?: string;
  difficulty?: string;
}

export type EnvironmentStyle =
  | 'tropical'
  | 'cyber'
  | 'cosmic'
  | 'tempest'
  | 'sports'
  | 'action'
  | 'emotions'
  | 'shipwreck';

export type MentorSpriteType =
  | 'ranger'
  | 'engineer'
  | 'astronomer'
  | 'storm_chaser'
  | 'coach'
  | 'warrior'
  | 'sage'
  | 'captain';

export type CenterPieceType =
  | 'camp'
  | 'server'
  | 'beacon'
  | 'weather_tower'
  | 'olympic_flame'
  | 'watchpost'
  | 'altar';

export interface ThemedResourceDef {
  nameEn: string;
  nameVi: string;
  icon: string;
  sourceNameVi: string;
  color: string;
  harvestTextVi: string;
}

export interface RealmSpecialMission {
  subStationType: string;
  subStationNameVi: string;
  subStationIcon: string;
  targetCount: number;
  missionTitleVi: string;
  actionPromptVi: string;
  successMsgVi: string;
}

export interface IslandTheme {
  id: string;
  name: string;
  realmTitle: string;
  mentorName: string;
  mentorRole: string;
  mentorSprite: MentorSpriteType;
  centerPieceType: CenterPieceType;
  environmentStyle: EnvironmentStyle;
  primaryResource: ThemedResourceDef;
  secondaryResource: ThemedResourceDef;
  reqPrimary: number;
  reqSecondary: number;
  playerSpawn: { x: number; y: number };
  specialMission: RealmSpecialMission;
  toolNameEn: string;
  toolNameVi: string;
  toolIcon: string;
  chestNameEn: string;
  chestNameVi: string;
  chestIcon?: string;
  gateNameEn: string;
  gateNameVi: string;
  gateIcon?: string;
  introStoryEn: string;
  introStoryVi: string;
  barrierEn: string;
  barrierVi: string;
  victoryLoreVi: string;
  badgeEmoji: string;
}

export interface DynamicQuest {
  theme: IslandTheme;
  words: QuestWordInfo[];
  puzzles: {
    act1_intro: VocabQuestion[];
    act2_craft: VocabQuestion[];
    act3_chest: VocabQuestion[];
    act4_gate: VocabQuestion[];
  };
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

export interface AmbientParticle {
  x: number;
  y: number;
  speedX: number;
  speedY: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
}

export interface GameEngineState {
  player: PlayerState;
  keys: Record<string, boolean>;
  objects: WorldObject[];
  floatingTexts: FloatingText[];
  ambientParticles: AmbientParticle[];
  nearestObject: WorldObject | null;
  shakeTime: number;
  questStage: QuestStage;
  resources: Resources;
  overlayOpen: boolean;
  paused: boolean;
  activeMap: number[][];
}
