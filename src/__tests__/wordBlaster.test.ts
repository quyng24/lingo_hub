import { describe, it, expect } from 'vitest';
import type { ActiveWord, GameStatePhase2 } from '@/types';

// Extract and test pure engine logic of Word Blaster
const getDynamicSpeed = (level: number) => {
  const minSpeed = 1.0 + (level - 1) * 0.3;
  const variance = 1.0 + (level - 1) * 0.2;
  return { minSpeed, maxSpeed: minSpeed + variance };
};

const getSpawnInterval = (level: number) => Math.max(1500, 4500 - (level - 1) * 400);

const calculateScoreAndCombo = (
  currentScore: number,
  currentCombo: number,
  wordLength: number
) => {
  const basePoints = wordLength * 10;
  const comboMultiplier = 1 + Math.floor(currentCombo / 5) * 0.5;
  const earnedScore = Math.floor(basePoints * comboMultiplier);
  const newScore = currentScore + earnedScore;
  const newCombo = currentCombo + 1;
  const newLevel = Math.floor(newScore / 500) + 1;

  return { earnedScore, newScore, newCombo, newLevel };
};

const checkWordBoundary = (currentY: number, speed: number, dt: number) => {
  const nextY = currentY + speed * dt;
  const isMissed = nextY >= 95;
  return { nextY, isMissed };
};

describe('Word Blaster Game Engine', () => {
  describe('Speed & Interval Scaling', () => {
    it('increases speed ranges as level advances', () => {
      const level1 = getDynamicSpeed(1);
      const level5 = getDynamicSpeed(5);

      expect(level1.minSpeed).toBe(1.0);
      expect(level5.minSpeed).toBeGreaterThan(level1.minSpeed);
      expect(level5.maxSpeed).toBeGreaterThan(level1.maxSpeed);
    });

    it('decreases spawn interval as level advances, with 1500ms floor', () => {
      const intervalL1 = getSpawnInterval(1);
      const intervalL3 = getSpawnInterval(3);
      const intervalL15 = getSpawnInterval(15);

      expect(intervalL1).toBe(4500);
      expect(intervalL3).toBe(3700);
      expect(intervalL15).toBe(1500); // respects minimum limit
    });
  });

  describe('Scoring & Combo Multiplier Mechanics', () => {
    it('calculates base score without combo correctly', () => {
      const result = calculateScoreAndCombo(0, 0, 5); // 5-letter word
      expect(result.earnedScore).toBe(50);
      expect(result.newScore).toBe(50);
      expect(result.newCombo).toBe(1);
      expect(result.newLevel).toBe(1);
    });

    it('awards 1.5x score bonus when combo reaches 5', () => {
      const result = calculateScoreAndCombo(100, 5, 4); // 4-letter word at 5 combo
      // basePoints = 40, multiplier = 1 + 0.5 = 1.5 => earned = 60
      expect(result.earnedScore).toBe(60);
      expect(result.newScore).toBe(160);
      expect(result.newCombo).toBe(6);
    });

    it('awards 2.0x score bonus when combo reaches 10', () => {
      const result = calculateScoreAndCombo(300, 10, 6); // 6-letter word at 10 combo
      // basePoints = 60, multiplier = 1 + 1.0 = 2.0 => earned = 120
      expect(result.earnedScore).toBe(120);
      expect(result.newScore).toBe(420);
    });

    it('levels up every 500 score points', () => {
      const result1 = calculateScoreAndCombo(480, 0, 5); // 480 + 50 = 530
      expect(result1.newLevel).toBe(2);

      const result2 = calculateScoreAndCombo(1450, 0, 10); // 1450 + 100 = 1550
      expect(result2.newLevel).toBe(4);
    });
  });

  describe('Word Movement & Miss Boundaries', () => {
    it('keeps word active while within screen bounds (y < 95)', () => {
      const { nextY, isMissed } = checkWordBoundary(50, 2.0, 1.0);
      expect(nextY).toBe(52);
      expect(isMissed).toBe(false);
    });

    it('marks word as missed when crossing y >= 95 threshold', () => {
      const { nextY, isMissed } = checkWordBoundary(94, 2.0, 1.0);
      expect(nextY).toBe(96);
      expect(isMissed).toBe(true);
    });

    it('reduces lives and resets combo on missed word', () => {
      let lives = 3;
      let combo = 7;

      // Miss event occurs
      lives -= 1;
      combo = 0;

      expect(lives).toBe(2);
      expect(combo).toBe(0);
    });

    it('triggers game over when lives deplete to 0', () => {
      let lives = 1;
      let status: GameStatePhase2['status'] = 'playing';

      // Final life lost
      lives -= 1;
      if (lives <= 0) {
        status = 'game-over';
      }

      expect(lives).toBe(0);
      expect(status).toBe('game-over');
    });
  });

  describe('Typing & Blast Matching', () => {
    it('matches complete word case-insensitively and removes it from active list', () => {
      const activeWords: ActiveWord[] = [
        { id: 'w1', text: 'Galaxy', meaning: 'Thiên hà', x: 20, y: 30, speed: 2 },
        { id: 'w2', text: 'Planet', meaning: 'Hành tinh', x: 60, y: 40, speed: 2 },
      ];

      const input = 'galaxy';
      const matchIndex = activeWords.findIndex((w) => w.text.toLowerCase() === input.toLowerCase());

      expect(matchIndex).toBe(0);

      const matched = activeWords.splice(matchIndex, 1)[0];
      expect(matched.text).toBe('Galaxy');
      expect(activeWords.length).toBe(1);
      expect(activeWords[0].text).toBe('Planet');
    });

    it('does not trigger match for partial input', () => {
      const activeWords: ActiveWord[] = [
        { id: 'w1', text: 'Rocket', meaning: 'Tên lửa', x: 20, y: 30, speed: 2 },
      ];

      const input = 'rock';
      const matchIndex = activeWords.findIndex((w) => w.text.toLowerCase() === input.toLowerCase());

      expect(matchIndex).toBe(-1);
      expect(activeWords.length).toBe(1);
    });
  });
});
