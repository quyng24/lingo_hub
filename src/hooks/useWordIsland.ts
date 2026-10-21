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
} from '@/utils/wordIslandData';
import { renderGameScene } from '@/utils/wordIslandRenderer';

export function useWordIsland() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const questStage = useWordIslandStore((s) => s.questStage);
  const resources = useWordIslandStore((s) => s.resources);
  const isPaused = useWordIslandStore((s) => s.isPaused);
  const dialogue = useWordIslandStore((s) => s.dialogue);
  const activeQuiz = useWordIslandStore((s) => s.activeQuiz);
  const currentQuest = useWordIslandStore((s) => s.currentQuest);
  const loadNewQuest = useWordIslandStore((s) => s.loadNewQuest);

  const setQuestStage = useWordIslandStore((s) => s.setQuestStage);
  const setResources = useWordIslandStore((s) => s.setResources);
  const setIsPaused = useWordIslandStore((s) => s.setIsPaused);
  const setDialogue = useWordIslandStore((s) => s.setDialogue);
  const setActiveQuiz = useWordIslandStore((s) => s.setActiveQuiz);
  const resetGame = useWordIslandStore((s) => s.resetGame);

  const theme = currentQuest.theme;

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

  // Load new dynamic quest on mount if not loaded yet
  useEffect(() => {
    loadNewQuest();
  }, [loadNewQuest]);

  // Update object labels according to active theme
  useEffect(() => {
    gameRef.current.objects.forEach((obj) => {
      if (obj.type === 'npc') {
        obj.label = `${theme.mentorName} (${theme.mentorRole})`;
      } else if (obj.type === 'chest') {
        obj.label = theme.chestNameVi;
      } else if (obj.type === 'gate') {
        obj.label = theme.gateNameVi;
      }
    });
  }, [theme]);

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

  // Clean Restart with a fresh dynamic quest
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
    loadNewQuest();
  }, [resetGame, loadNewQuest]);

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
        spawnFloatingText(
          state.player.x,
          state.player.y - 16,
          `Đã đủ nguyên liệu! Hãy gặp ${theme.mentorName}!`,
          '#fde047'
        );
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
        spawnFloatingText(
          state.player.x,
          state.player.y - 16,
          `Đã đủ nguyên liệu! Hãy gặp ${theme.mentorName}!`,
          '#fde047'
        );
      }
      return;
    }

    // 3. Campfire
    if (target.type === 'camp') {
      spawnFloatingText(target.x + 10, target.y - 8, 'Lửa trại ấm áp (Campfire)!', '#fb923c');
      return;
    }

    // 4. NPC Mentor Interaction
    if (target.type === 'npc') {
      state.keys = {};
      if (state.questStage === 'TALK_TO_NPC') {
        setDialogue({
          speaker: `${theme.mentorName} (${theme.mentorRole})`,
          en: theme.introStoryEn,
          vi: theme.introStoryVi,
          choices: [
            {
              label: 'Bắt đầu thử thách khởi động! (Start Trial)',
              action: () => {
                setDialogue(null);
                setActiveQuiz({
                  questions: currentQuest.puzzles.act1_intro,
                  currentIndex: 0,
                  selectedFeedback: null,
                  onComplete: () => {
                    if (state.resources.wood >= 3 && state.resources.stone >= 2) {
                      setQuestStage('CRAFT_PUZZLE');
                    } else {
                      setQuestStage('GATHER_RESOURCES');
                    }
                    setActiveQuiz(null);
                    spawnFloatingText(
                      state.player.x,
                      state.player.y - 16,
                      'Nhiệm vụ: Thu thập 3 Gỗ & 2 Đá!',
                      '#38bdf8'
                    );
                  },
                });
              },
            },
          ],
        });
      } else if (state.questStage === 'GATHER_RESOURCES') {
        if (state.resources.wood >= 3 && state.resources.stone >= 2) {
          setQuestStage('CRAFT_PUZZLE');
        } else {
          setDialogue({
            speaker: `${theme.mentorName} (${theme.mentorRole})`,
            en: `We still need 3 Wood and 2 Stone to forge the ${theme.toolNameEn}. You currently have ${state.resources.wood}/3 Wood and ${state.resources.stone}/2 Stone.`,
            vi: `Tôi vẫn cần 3 Gỗ và 2 Đá để chế tạo ${theme.toolNameVi}. Bạn hiện có ${state.resources.wood}/3 Gỗ và ${state.resources.stone}/2 Đá. Hãy ấn [E] gần cây và tảng đá nhé!`,
            choices: [
              {
                label: 'Tôi sẽ tiếp tục thu thập! (Understood)',
                action: () => setDialogue(null),
              },
            ],
          });
        }
      } else if (state.questStage === 'CRAFT_PUZZLE') {
        setDialogue({
          speaker: `${theme.mentorName} (${theme.mentorRole})`,
          en: `Great job bringing the wood and stone! Answer these two English vocabulary questions so we can forge the ${theme.toolNameEn}!`,
          vi: `Tuyệt lắm, bạn đã mang đủ gỗ và đá! Hãy trả lời 2 câu hỏi từ vựng để hoàn thiện ${theme.toolNameVi} nhé.`,
          choices: [
            {
              label: `Bắt đầu giải đố chế tạo ${theme.toolNameVi}`,
              action: () => {
                setDialogue(null);
                setActiveQuiz({
                  questions: currentQuest.puzzles.act2_craft,
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
                    spawnFloatingText(
                      state.player.x,
                      state.player.y - 16,
                      `Nhận ${theme.toolNameVi}!`,
                      '#38bdf8'
                    );
                  },
                });
              },
            },
          ],
        });
      } else {
        setDialogue({
          speaker: `${theme.mentorName} (${theme.mentorRole})`,
          en: state.resources.hasGateKey
            ? `You have the Gate Key! Head north to the ${theme.gateNameEn} and pass the final boss trial!`
            : `Use your ${theme.toolNameEn} on the ${theme.chestNameEn} on the east shore!`,
          vi: state.resources.hasGateKey
            ? `Bạn đã có Chìa Khóa! Hãy đi lên phía Bắc tới ${theme.gateNameVi} và vượt qua thử thách cuối cùng để thoát hiểm!`
            : `Hãy dùng ${theme.toolNameVi} vừa chế tạo để mở ${theme.chestNameVi} ở phía Đông hòn đảo nhé!`,
          choices: [{ label: 'Đã hiểu! (Đóng)', action: () => setDialogue(null) }],
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
          speaker: `${theme.chestNameVi} (${theme.chestNameEn})`,
          en: `Thick barriers seal this chest. You need the ${theme.toolNameEn} from ${theme.mentorName} to open it!`,
          vi: `Rào cản dày đặc bao bọc chiếc rương này. Bạn cần ${theme.toolNameVi} từ ${theme.mentorName} để mở!`,
          choices: [
            {
              label: `Quay lại gặp ${theme.mentorName}`,
              action: () => setDialogue(null),
            },
          ],
        });
        return;
      }

      setActiveQuiz({
        questions: currentQuest.puzzles.act3_chest,
        currentIndex: 0,
        selectedFeedback: null,
        onComplete: () => {
          target.opened = true;
          const updated = { ...state.resources, hasGateKey: true };
          state.resources = updated;
          setResources(updated);
          setQuestStage('UNLOCK_GATE');
          setActiveQuiz(null);
          spawnFloatingText(target.x, target.y - 12, 'Nhận Chìa Khóa Cổng & Nhu Yếu Phẩm!', '#facc15');
        },
      });
      return;
    }

    // 6. Escape Gate
    if (target.type === 'gate') {
      state.keys = {};
      if (!state.resources.hasGateKey) {
        setDialogue({
          speaker: `${theme.gateNameVi} (${theme.gateNameEn})`,
          en: `The ancient gate is firmly locked. Find the Gate Key inside the ${theme.chestNameEn} first!`,
          vi: `Cánh cổng đá đang bị khóa chặt. Hãy tìm Chìa Khóa bên trong ${theme.chestNameVi} trước nhé!`,
          choices: [{ label: 'Quay lại', action: () => setDialogue(null) }],
        });
        return;
      }

      setActiveQuiz({
        questions: currentQuest.puzzles.act4_gate,
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
  }, [
    setDialogue,
    setActiveQuiz,
    setQuestStage,
    setResources,
    spawnFloatingText,
    theme,
    currentQuest,
  ]);

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

  // Main Canvas Game Loop (60fps)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let lastTime = performance.now();

    const isCollidingWithWorld = (
      px: number,
      py: number,
      pw: number,
      ph: number,
      objects: WorldObject[]
    ): boolean => {
      // 1. Tilemap Water Boundaries
      const startCol = Math.floor(px / TILE_SIZE);
      const endCol = Math.floor((px + pw) / TILE_SIZE);
      const startRow = Math.floor(py / TILE_SIZE);
      const endRow = Math.floor((py + ph) / TILE_SIZE);

      for (let r = startRow; r <= endRow; r++) {
        for (let c = startCol; c <= endCol; c++) {
          if (r < 0 || r >= MAP_ROWS || c < 0 || c >= MAP_COLS) return true;
          if (ISLAND_MAP[r][c] === 0) return true;
        }
      }

      // 2. Solid World Objects
      for (const obj of objects) {
        if (!obj.solid) continue;
        const boxX = obj.x + 4;
        const boxY = obj.y + obj.height * 0.4;
        const boxW = obj.width - 8;
        const boxH = obj.height * 0.6;

        if (
          px < boxX + boxW &&
          px + pw > boxX &&
          py < boxY + boxH &&
          py + ph > boxY
        ) {
          return true;
        }
      }
      return false;
    };

    const update = (dt: number, now: number) => {
      const state = gameRef.current;

      // Handle Respawn of Trees/Rocks
      state.objects.forEach((obj) => {
        if (obj.depleted && obj.respawnAt && now >= obj.respawnAt) {
          obj.depleted = false;
          obj.solid = true;
          obj.respawnAt = undefined;
        }
      });

      // Player Movement when overlays are closed
      if (!state.overlayOpen && !state.paused) {
        const { keys, player } = state;
        let dx = 0;
        let dy = 0;

        if (keys['w'] || keys['arrowup']) dy -= 1;
        if (keys['s'] || keys['arrowdown']) dy += 1;
        if (keys['a'] || keys['arrowleft']) dx -= 1;
        if (keys['d'] || keys['arrowright']) dx += 1;

        if (dx !== 0 && dy !== 0) {
          dx *= 0.7071;
          dy *= 0.7071;
        }

        if (dx !== 0 || dy !== 0) {
          if (Math.abs(dx) > Math.abs(dy)) {
            player.dir = dx > 0 ? 'right' : 'left';
          } else {
            player.dir = dy > 0 ? 'down' : 'up';
          }

          player.walkFrame += dt * 8;

          const newX = player.x + dx * player.speed * dt;
          if (!isCollidingWithWorld(newX, player.y, player.width, player.height, state.objects)) {
            player.x = newX;
          }

          const newY = player.y + dy * player.speed * dt;
          if (!isCollidingWithWorld(player.x, newY, player.width, player.height, state.objects)) {
            player.y = newY;
          }
        } else {
          player.walkFrame = 0;
        }
      }

      // Proximity detection for interaction
      let closest: WorldObject | null = null;
      let closestDist = Infinity;
      const interactDist = 48;

      const pCenter = {
        x: state.player.x + state.player.width / 2,
        y: state.player.y + state.player.height / 2,
      };

      for (const obj of state.objects) {
        const oCenter = {
          x: obj.x + obj.width / 2,
          y: obj.y + obj.height / 2,
        };
        const dist = Math.hypot(pCenter.x - oCenter.x, pCenter.y - oCenter.y);
        if (dist < interactDist && dist < closestDist) {
          closest = obj;
          closestDist = dist;
        }
      }
      state.nearestObject = closest;

      // Update Floating Particles
      state.floatingTexts.forEach((ft) => {
        ft.y -= 25 * dt;
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
        return `1. Gặp ${theme.mentorName} cạnh lửa trại [E] để bắt đầu`;
      case 'GATHER_RESOURCES':
        return `2. Thu thập 3 Gỗ (${resources.wood}/3) & 2 Đá (${resources.stone}/2)`;
      case 'CRAFT_PUZZLE':
        return `3. Quay lại gặp ${theme.mentorName} chế tạo ${theme.toolNameVi}`;
      case 'UNLOCK_CHEST':
        return `4. Dùng ${theme.toolNameVi} mở ${theme.chestNameVi} ở bờ biển Đông`;
      case 'UNLOCK_GATE':
        return `5. Tra chìa khóa giải đố mở ${theme.gateNameVi} phía Bắc để thoát!`;
      case 'VICTORY':
        return `Chiến thắng! Bạn đã chinh phục ${theme.realmTitle}!`;
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
    currentQuest,
    theme,
    handleRestart,
    handleInteract,
    getObjectiveText,
  };
}
