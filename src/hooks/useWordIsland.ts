import { useCallback, useEffect, useRef } from 'react';
import type { GameEngineState, WorldObject } from '@/types';
import { useWordIslandStore } from '@/stores/wordIslandStore';
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  INITIAL_OBJECTS,
  ISLAND_MAP,
  MAP_COLS,
  MAP_ROWS,
  TILE_SIZE,
  VOCAB_PUZZLES,
} from '@/utils/wordIslandData';
import { renderGameScene } from '@/utils/wordIslandRenderer';

export function useWordIsland() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const questStage = useWordIslandStore((s) => s.questStage);
  const resources = useWordIslandStore((s) => s.resources);
  const isPaused = useWordIslandStore((s) => s.isPaused);
  const dialogue = useWordIslandStore((s) => s.dialogue);
  const activeQuiz = useWordIslandStore((s) => s.activeQuiz);

  const setQuestStage = useWordIslandStore((s) => s.setQuestStage);
  const setResources = useWordIslandStore((s) => s.setResources);
  const setIsPaused = useWordIslandStore((s) => s.setIsPaused);
  const setDialogue = useWordIslandStore((s) => s.setDialogue);
  const setActiveQuiz = useWordIslandStore((s) => s.setActiveQuiz);
  const resetGame = useWordIslandStore((s) => s.resetGame);

  // Mutable 60fps loop state
  const gameRef = useRef<GameEngineState>({
    player: {
      x: 9.5 * TILE_SIZE,
      y: 10.5 * TILE_SIZE,
      width: 28,
      height: 28,
      speed: 190,
      dir: 'up',
      walkFrame: 0,
    },
    keys: {},
    objects: INITIAL_OBJECTS.map((obj) => ({ ...obj })),
    floatingTexts: [],
    nearestObject: null,
    shakeTime: 0,
    questStage: 'TALK_TO_NPC',
    resources: { wood: 0, stone: 0, hasAxe: false, hasGateKey: false },
    overlayOpen: false,
    paused: false,
  });

  // Sync store flags into ref for 60fps loop
  useEffect(() => {
    gameRef.current.questStage = questStage;
  }, [questStage]);

  useEffect(() => {
    gameRef.current.resources = resources;
  }, [resources]);

  useEffect(() => {
    gameRef.current.overlayOpen = Boolean(dialogue || activeQuiz || questStage === 'VICTORY');
    gameRef.current.paused = isPaused;
  }, [dialogue, activeQuiz, questStage, isPaused]);

  // Floating text particle helper
  const spawnFloatingText = useCallback((x: number, y: number, text: string, color = '#fde047') => {
    gameRef.current.floatingTexts.push({
      id: Math.random(),
      x,
      y,
      text,
      color,
      alpha: 1,
    });
  }, []);

  // Clean Restart
  const handleRestart = useCallback(() => {
    gameRef.current.player = {
      x: 9.5 * TILE_SIZE,
      y: 10.5 * TILE_SIZE,
      width: 28,
      height: 28,
      speed: 190,
      dir: 'up',
      walkFrame: 0,
    };
    gameRef.current.keys = {};
    gameRef.current.objects = INITIAL_OBJECTS.map((obj) => ({ ...obj }));
    gameRef.current.floatingTexts = [];
    gameRef.current.nearestObject = null;
    gameRef.current.shakeTime = 0;

    resetGame();
  }, [resetGame]);

  // Interaction dispatcher
  const handleInteract = useCallback(() => {
    const state = gameRef.current;
    if (state.overlayOpen || state.paused) return;

    const target = state.nearestObject;
    if (!target) return;

    // 1. Tree harvesting
    if (target.type === 'tree' && !target.depleted) {
      target.depleted = true;
      target.solid = false;
      target.respawnAt = performance.now() + 7000;
      state.shakeTime = 150;

      const nextWood = state.resources.wood + 1;
      const updated = { ...state.resources, wood: nextWood };
      state.resources = updated;
      setResources(updated);
      spawnFloatingText(target.x + 16, target.y, '+1 Wood (Gỗ)', '#86efac');

      if (
        state.questStage === 'GATHER_RESOURCES' &&
        updated.wood >= 3 &&
        updated.stone >= 2
      ) {
        setQuestStage('CRAFT_PUZZLE');
        spawnFloatingText(state.player.x, state.player.y - 16, 'Đã đủ nguyên liệu! Hãy gặp Minh!', '#fde047');
      }
      return;
    }

    // 2. Rock harvesting
    if (target.type === 'rock' && !target.depleted) {
      target.depleted = true;
      target.solid = false;
      target.respawnAt = performance.now() + 7000;
      state.shakeTime = 150;

      const nextStone = state.resources.stone + 1;
      const updated = { ...state.resources, stone: nextStone };
      state.resources = updated;
      setResources(updated);
      spawnFloatingText(target.x + 16, target.y, '+1 Stone (Đá)', '#cbd5e1');

      if (
        state.questStage === 'GATHER_RESOURCES' &&
        updated.wood >= 3 &&
        updated.stone >= 2
      ) {
        setQuestStage('CRAFT_PUZZLE');
        spawnFloatingText(state.player.x, state.player.y - 16, 'Đã đủ nguyên liệu! Hãy gặp Minh!', '#fde047');
      }
      return;
    }

    // 3. Campfire
    if (target.type === 'camp') {
      spawnFloatingText(target.x + 10, target.y - 8, 'Lửa trại ấm áp (Campfire)!', '#fb923c');
      return;
    }

    // 4. NPC Captain Minh
    if (target.type === 'npc') {
      state.keys = {};
      if (state.questStage === 'TALK_TO_NPC') {
        setDialogue({
          speaker: 'Captain Minh (Thuyền trưởng Minh)',
          en: 'Welcome to Word Island! A storm broke my shelter. Please collect 3 Wood from trees and 2 Stone from rocks so we can repair the camp and craft an axe!',
          vi: 'Chào mừng đến Đảo Từ Vựng! Cơn bão đã làm hỏng nơi trú ẩn của tôi. Hãy thu thập 3 Gỗ (Wood) từ cây và 2 Đá (Stone) từ tảng đá để sửa trại và chế tạo rìu nhé!',
          choices: [
            {
              label: "I'll gather 3 Wood & 2 Stone! (Nhận nhiệm vụ)",
              action: () => {
                setDialogue(null);
                if (state.resources.wood >= 3 && state.resources.stone >= 2) {
                  setQuestStage('CRAFT_PUZZLE');
                } else {
                  setQuestStage('GATHER_RESOURCES');
                }
              },
            },
          ],
        });
      } else if (state.questStage === 'GATHER_RESOURCES') {
        if (state.resources.wood >= 3 && state.resources.stone >= 2) {
          setQuestStage('CRAFT_PUZZLE');
        } else {
          setDialogue({
            speaker: 'Captain Minh (Thuyền trưởng Minh)',
            en: `I still need 3 Wood and 2 Stone to repair my shelter. You currently have ${state.resources.wood}/3 Wood and ${state.resources.stone}/2 Stone.`,
            vi: `Tôi vẫn cần 3 Gỗ và 2 Đá để sửa nơi trú ẩn. Bạn hiện có ${state.resources.wood}/3 Gỗ và ${state.resources.stone}/2 Đá. Hãy ấn [E] gần cây và tảng đá nhé!`,
            choices: [
              {
                label: 'Got it, still gathering! (Tiếp tục thu thập)',
                action: () => setDialogue(null),
              },
            ],
          });
        }
      } else if (state.questStage === 'CRAFT_PUZZLE') {
        setDialogue({
          speaker: 'Captain Minh (Thuyền trưởng Minh)',
          en: 'Great job bringing the wood and stone! Answer my two English vocabulary questions so we can repair the shelter and craft your Stone Axe.',
          vi: 'Tuyệt lắm, bạn đã mang đủ gỗ và đá! Hãy trả lời 2 câu hỏi từ vựng tiếng Anh để sửa nơi trú ẩn và chế tạo Rìu Đá nhé.',
          choices: [
            {
              label: 'Start Vocabulary Challenge (Bắt đầu trả lời)',
              action: () => {
                setDialogue(null);
                setActiveQuiz({
                  questions: VOCAB_PUZZLES.craft_axe,
                  currentIndex: 0,
                  selectedFeedback: null,
                  onComplete: () => {
                    const updated = {
                      ...state.resources,
                      wood: Math.max(0, state.resources.wood - 3),
                      stone: Math.max(0, state.resources.stone - 2),
                      hasAxe: true,
                    };
                    state.resources = updated;
                    setResources(updated);
                    setQuestStage('UNLOCK_CHEST');
                    setActiveQuiz(null);
                    spawnFloatingText(state.player.x, state.player.y - 16, 'Nhận Rìu Đá! (Obtained Stone Axe)', '#38bdf8');
                  },
                });
              },
            },
          ],
        });
      } else {
        setDialogue({
          speaker: 'Captain Minh (Thuyền trưởng Minh)',
          en: state.resources.hasGateKey
            ? 'You have the Gate Key! Head north to the Locked Gate and answer the final question to escape!'
            : 'Use your new Stone Axe on the Supply Chest on the east side of the island!',
          vi: state.resources.hasGateKey
            ? 'Bạn đã có Chìa Khóa Cổng! Hãy đi lên phía Bắc tới Cổng Đá và trả lời câu hỏi cuối cùng để thoát khỏi đảo!'
            : 'Hãy dùng Rìu Đá vừa chế tạo để mở Rương Tiếp Tế ở phía Đông hòn đảo nhé!',
          choices: [{ label: 'Thanks! (Đóng)', action: () => setDialogue(null) }],
        });
      }
      return;
    }

    // 5. Supply Chest
    if (target.type === 'chest') {
      state.keys = {};
      if (target.opened) {
        spawnFloatingText(target.x, target.y - 10, 'Rương đã mở! (Empty)', '#94a3b8');
        return;
      }
      if (!state.resources.hasAxe) {
        setDialogue({
          speaker: 'Supply Chest (Rương Tiếp Tế)',
          en: 'Thick vines cover this chest. You need an AXE from Captain Minh to cut them!',
          vi: 'Dây leo dày đặc quấn quanh chiếc rương này. Bạn cần một chiếc RÌU (Axe) từ Thuyền trưởng Minh để chặt chúng!',
          choices: [{ label: 'Talk to Captain Minh first (Quay lại)', action: () => setDialogue(null) }],
        });
        return;
      }

      setActiveQuiz({
        questions: VOCAB_PUZZLES.open_chest,
        currentIndex: 0,
        selectedFeedback: null,
        onComplete: () => {
          target.opened = true;
          const updated = { ...state.resources, hasGateKey: true };
          state.resources = updated;
          setResources(updated);
          setQuestStage('UNLOCK_GATE');
          setActiveQuiz(null);
          spawnFloatingText(target.x, target.y - 12, 'Nhận Chìa Khóa & Nhu Yếu Phẩm!', '#facc15');
        },
      });
      return;
    }

    // 6. Escape Gate
    if (target.type === 'gate') {
      state.keys = {};
      if (!state.resources.hasGateKey) {
        setDialogue({
          speaker: 'Locked Gate (Cổng Thoát Hiểm)',
          en: 'The ancient stone gate is locked. Find the Gate Key inside the Supply Chest first!',
          vi: 'Cánh cổng đá cổ đại đang bị khóa. Hãy tìm Chìa Khóa Cổng bên trong Rương Tiếp Tế trước nhé!',
          choices: [{ label: 'Step back (Quay lại)', action: () => setDialogue(null) }],
        });
        return;
      }

      setActiveQuiz({
        questions: VOCAB_PUZZLES.unlock_gate,
        currentIndex: 0,
        selectedFeedback: null,
        onComplete: () => {
          target.solid = false;
          target.opened = true;
          setActiveQuiz(null);
          setQuestStage('VICTORY');
        },
      });
    }
  }, [setDialogue, setActiveQuiz, setQuestStage, setResources, spawnFloatingText]);

  // Keyboard Listeners
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(key)) {
        e.preventDefault();
      }
      if (key === 'e' || key === ' ') {
        handleInteract();
        return;
      }
      if (key === 'p' || key === 'escape') {
        if (!gameRef.current.overlayOpen) {
          setIsPaused((prev) => !prev);
        }
        return;
      }
      gameRef.current.keys[key] = true;
    };

    const onKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      gameRef.current.keys[key] = false;
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [handleInteract, setIsPaused]);

  // Main 60FPS Game Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let lastTime = performance.now();

    const checkCollision = (nx: number, ny: number, w: number, h: number): boolean => {
      const corners = [
        { x: nx + 4, y: ny + 8 },
        { x: nx + w - 4, y: ny + 8 },
        { x: nx + 4, y: ny + h - 2 },
        { x: nx + w - 4, y: ny + h - 2 },
      ];

      for (const pt of corners) {
        const col = Math.floor(pt.x / TILE_SIZE);
        const row = Math.floor(pt.y / TILE_SIZE);
        if (row < 0 || row >= MAP_ROWS || col < 0 || col >= MAP_COLS) return true;
        if (ISLAND_MAP[row][col] === 0) return true;
      }

      for (const obj of gameRef.current.objects) {
        if (!obj.solid) continue;
        if (
          nx + 4 < obj.x + obj.width - 4 &&
          nx + w - 4 > obj.x + 4 &&
          ny + 6 < obj.y + obj.height - 4 &&
          ny + h - 2 > obj.y + 4
        ) {
          return true;
        }
      }

      return false;
    };

    const update = (dt: number, now: number) => {
      const state = gameRef.current;

      // Respawn depleted trees & rocks
      for (const obj of state.objects) {
        if (obj.depleted && obj.respawnAt && now >= obj.respawnAt) {
          obj.depleted = false;
          obj.solid = true;
          obj.respawnAt = undefined;
        }
      }

      if (state.overlayOpen || state.paused) return;

      // Movement vector
      let dx = 0;
      let dy = 0;
      if (state.keys['w'] || state.keys['arrowup']) dy -= 1;
      if (state.keys['s'] || state.keys['arrowdown']) dy += 1;
      if (state.keys['a'] || state.keys['arrowleft']) dx -= 1;
      if (state.keys['d'] || state.keys['arrowright']) dx += 1;

      if (dx !== 0 || dy !== 0) {
        const len = Math.hypot(dx, dy);
        dx /= len;
        dy /= len;

        if (Math.abs(dx) > Math.abs(dy)) {
          state.player.dir = dx > 0 ? 'right' : 'left';
        } else {
          state.player.dir = dy > 0 ? 'down' : 'up';
        }

        const nextX = state.player.x + dx * state.player.speed * dt;
        const nextY = state.player.y + dy * state.player.speed * dt;

        if (!checkCollision(nextX, state.player.y, state.player.width, state.player.height)) {
          state.player.x = nextX;
        }
        if (!checkCollision(state.player.x, nextY, state.player.width, state.player.height)) {
          state.player.y = nextY;
        }

        state.player.walkFrame += dt * 10;
      } else {
        state.player.walkFrame = 0;
      }

      // Find nearest interactable object
      const px = state.player.x + state.player.width / 2;
      const py = state.player.y + state.player.height / 2;
      let closest: WorldObject | null = null;
      let minDist = 58;

      for (const obj of state.objects) {
        if (obj.depleted) continue;
        const ox = obj.x + obj.width / 2;
        const oy = obj.y + obj.height / 2;
        const dist = Math.hypot(px - ox, py - oy);
        if (dist < minDist) {
          minDist = dist;
          closest = obj;
        }
      }
      state.nearestObject = closest;

      // Update floating texts
      state.floatingTexts.forEach((ft) => {
        ft.y -= 28 * dt;
        ft.alpha -= 0.75 * dt;
      });
      state.floatingTexts = state.floatingTexts.filter((ft) => ft.alpha > 0);

      if (state.shakeTime > 0) {
        state.shakeTime = Math.max(0, state.shakeTime - dt * 1000);
      }
    };

    const loop = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      update(dt, now);
      renderGameScene(ctx, gameRef.current, now);
      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const getObjectiveText = () => {
    switch (questStage) {
      case 'TALK_TO_NPC':
        return '1. Gặp Thuyền trưởng Minh cạnh lửa trại [E]';
      case 'GATHER_RESOURCES':
        return `2. Thu thập 3 Gỗ (${resources.wood}/3) & 2 Đá (${resources.stone}/2)`;
      case 'CRAFT_PUZZLE':
        return '3. Quay lại gặp Minh sửa trại & chế tạo Rìu Đá';
      case 'UNLOCK_CHEST':
        return '4. Dùng Rìu chặt dây leo mở Rương Tiếp Tế ở bờ biển Đông';
      case 'UNLOCK_GATE':
        return '5. Dùng Chìa Khóa giải đố mở Cổng Cổ Đại phía Bắc để thoát!';
      case 'VICTORY':
        return 'Đã hoàn thành! Bạn đã chinh phục Đảo Từ Vựng!';
    }
  };

  return {
    canvasRef,
    canvasWidth: CANVAS_WIDTH,
    canvasHeight: CANVAS_HEIGHT,
    questStage,
    resources,
    isPaused,
    setIsPaused,
    dialogue,
    activeQuiz,
    setActiveQuiz,
    handleRestart,
    handleInteract,
    getObjectiveText,
  };
}

