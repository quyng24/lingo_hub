import { useCallback, useEffect, useRef } from 'react';
import type { GameEngineState, WorldObject } from '@/types';
import { useWordIslandStore } from '@/stores/wordIslandStore';
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  MAP_COLS,
  MAP_ROWS,
  TILE_SIZE,
  getMapForTheme,
  getObjectsForTheme,
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
      x: theme.playerSpawn?.x ?? 9.5 * TILE_SIZE,
      y: theme.playerSpawn?.y ?? 10.5 * TILE_SIZE,
      width: 28,
      height: 28,
      speed: 190,
      dir: 'up',
      walkFrame: 0,
    },
    keys: {},
    objects: getObjectsForTheme(theme),
    floatingTexts: [],
    ambientParticles: [],
    nearestObject: null,
    shakeTime: 0,
    questStage: 'TALK_TO_NPC',
    resources: { wood: 0, stone: 0, hasAxe: false, hasGateKey: false, subStationsActivated: 0 },
    overlayOpen: false,
    paused: false,
    activeMap: getMapForTheme(theme),
  });

  // Load new dynamic quest on mount if not loaded yet
  useEffect(() => {
    loadNewQuest();
  }, [loadNewQuest]);

  // Update objects, player position & map matrix whenever theme changes
  useEffect(() => {
    gameRef.current.activeMap = getMapForTheme(theme);
    gameRef.current.objects = getObjectsForTheme(theme);
    if (theme.playerSpawn) {
      gameRef.current.player.x = theme.playerSpawn.x;
      gameRef.current.player.y = theme.playerSpawn.y;
    }
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
    const spawnX = theme.playerSpawn?.x ?? 9.5 * TILE_SIZE;
    const spawnY = theme.playerSpawn?.y ?? 10.5 * TILE_SIZE;
    gameRef.current.player = {
      x: spawnX,
      y: spawnY,
      width: 28,
      height: 28,
      speed: 190,
      dir: 'up',
      walkFrame: 0,
    };
    gameRef.current.keys = {};
    gameRef.current.objects = getObjectsForTheme(theme);
    gameRef.current.activeMap = getMapForTheme(theme);
    gameRef.current.floatingTexts = [];
    gameRef.current.nearestObject = null;
    gameRef.current.shakeTime = 0;

    resetGame();
    loadNewQuest();
  }, [resetGame, loadNewQuest, theme]);

  // Interaction dispatcher
  const handleInteract = useCallback(() => {
    const state = gameRef.current;
    if (state.overlayOpen || state.paused) return;

    const target = state.nearestObject;
    if (!target) return;

    const reqPrimary = theme.reqPrimary ?? 3;
    const reqSecondary = theme.reqSecondary ?? 2;
    const reqSub = theme.specialMission?.targetCount ?? 0;

    // 1. Primary Resource Harvesting (Tree Node equivalent)
    if (target.type === 'tree' && !target.depleted) {
      target.depleted = true;
      target.solid = false;
      target.respawnAt = performance.now() + 7000;
      state.shakeTime = 150;

      const nextWood = state.resources.wood + 1;
      const updated = { ...state.resources, wood: nextWood };
      state.resources = updated;
      setResources(updated);
      spawnFloatingText(
        target.x + 16,
        target.y,
        theme.primaryResource.harvestTextVi,
        theme.primaryResource.color
      );

      if (
        state.questStage === 'GATHER_RESOURCES' &&
        updated.wood >= reqPrimary &&
        updated.stone >= reqSecondary &&
        (updated.subStationsActivated || 0) >= reqSub
      ) {
        setQuestStage('CRAFT_PUZZLE');
        spawnFloatingText(
          state.player.x,
          state.player.y - 16,
          `Đã đủ nguyên liệu & hoàn thành nhiệm vụ! Hãy gặp ${theme.mentorName}!`,
          '#fde047'
        );
      }
      return;
    }

    // 2. Secondary Resource Harvesting (Rock Node equivalent)
    if (target.type === 'rock' && !target.depleted) {
      target.depleted = true;
      target.solid = false;
      target.respawnAt = performance.now() + 7000;
      state.shakeTime = 150;

      const nextStone = state.resources.stone + 1;
      const updated = { ...state.resources, stone: nextStone };
      state.resources = updated;
      setResources(updated);
      spawnFloatingText(
        target.x + 16,
        target.y,
        theme.secondaryResource.harvestTextVi,
        theme.secondaryResource.color
      );

      if (
        state.questStage === 'GATHER_RESOURCES' &&
        updated.wood >= reqPrimary &&
        updated.stone >= reqSecondary &&
        (updated.subStationsActivated || 0) >= reqSub
      ) {
        setQuestStage('CRAFT_PUZZLE');
        spawnFloatingText(
          state.player.x,
          state.player.y - 16,
          `Đã đủ nguyên liệu & hoàn thành nhiệm vụ! Hãy gặp ${theme.mentorName}!`,
          '#fde047'
        );
      }
      return;
    }

    // 2.5. Realm Special Quest Sub-Station Interaction
    if (target.type === 'sub_station') {
      if (target.activated) {
        spawnFloatingText(
          target.x + 18,
          target.y - 10,
          `Đã hoàn thành: ${target.label}!`,
          '#86efac'
        );
        return;
      }

      if (!target.question) {
        target.activated = true;
        const nextSub = (state.resources.subStationsActivated || 0) + 1;
        const updated = { ...state.resources, subStationsActivated: nextSub };
        state.resources = updated;
        setResources(updated);
        spawnFloatingText(
          target.x + 18,
          target.y - 10,
          theme.specialMission?.successMsgVi || 'Đã hoàn thành mục tiêu!',
          '#22c55e'
        );
        return;
      }

      state.keys = {};
      setActiveQuiz({
        questions: [target.question],
        currentIndex: 0,
        selectedFeedback: null,
        onComplete: () => {
          target.activated = true;
          const nextSub = (state.resources.subStationsActivated || 0) + 1;
          const updated = { ...state.resources, subStationsActivated: nextSub };
          state.resources = updated;
          setResources(updated);
          setActiveQuiz(null);

          spawnFloatingText(
            target.x + 18,
            target.y - 12,
            theme.specialMission?.successMsgVi || 'Đã kích hoạt thành công!',
            '#22c55e'
          );

          if (
            state.questStage === 'GATHER_RESOURCES' &&
            updated.wood >= reqPrimary &&
            updated.stone >= reqSecondary &&
            updated.subStationsActivated >= reqSub
          ) {
            setQuestStage('CRAFT_PUZZLE');
            spawnFloatingText(
              state.player.x,
              state.player.y - 16,
              `Đã hoàn thành nhiệm vụ & thu thập đủ nguyên liệu! Hãy gặp ${theme.mentorName}!`,
              '#fde047'
            );
          }
        },
      });
      return;
    }

    // 3. Centerpiece Structure (Camp / Server / Beacon / Altar)
    if (target.type === 'camp') {
      let flavorMsg = 'Lửa trại ấm áp (Campfire)!';
      if (theme.centerPieceType === 'server') flavorMsg = 'Máy chủ trung tâm đang chạy (Mainframe Active)!';
      else if (theme.centerPieceType === 'beacon') flavorMsg = 'Ăng-ten ngân hà đang định vị (Beacon Online)!';
      else if (theme.centerPieceType === 'weather_tower') flavorMsg = 'Tháp khí tượng cảnh báo bão (Storm Warning)!';
      else if (theme.centerPieceType === 'olympic_flame') flavorMsg = 'Ngọn đuốc Olympic rực cháy (Olympic Flame)!';
      else if (theme.centerPieceType === 'altar') flavorMsg = 'Đài sen thanh tịnh thơm ngát (Zen Altar)!';

      spawnFloatingText(target.x + 10, target.y - 8, flavorMsg, '#38bdf8');
      return;
    }

    // 4. Mentor NPC Interaction
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
                    const currentSub = state.resources.subStationsActivated || 0;
                    if (
                      state.resources.wood >= reqPrimary &&
                      state.resources.stone >= reqSecondary &&
                      currentSub >= reqSub
                    ) {
                      setQuestStage('CRAFT_PUZZLE');
                    } else {
                      setQuestStage('GATHER_RESOURCES');
                    }
                    setActiveQuiz(null);
                    spawnFloatingText(
                      state.player.x,
                      state.player.y - 16,
                      `Nhiệm vụ: ${theme.specialMission?.missionTitleVi || 'Khám phá'} & Thu thập nguyên liệu!`,
                      '#38bdf8'
                    );
                  },
                });
              },
            },
          ],
        });
      } else if (state.questStage === 'GATHER_RESOURCES') {
        const currentSub = state.resources.subStationsActivated || 0;
        if (
          state.resources.wood >= reqPrimary &&
          state.resources.stone >= reqSecondary &&
          currentSub >= reqSub
        ) {
          setQuestStage('CRAFT_PUZZLE');
        } else {
          setDialogue({
            speaker: `${theme.mentorName} (${theme.mentorRole})`,
            en: `To forge the ${theme.toolNameEn}, we need ${reqPrimary} ${theme.primaryResource.nameEn} (${state.resources.wood}/${reqPrimary}), ${reqSecondary} ${theme.secondaryResource.nameEn} (${state.resources.stone}/${reqSecondary}), and ${theme.specialMission?.missionTitleVi || 'special tasks'} (${currentSub}/${reqSub}).`,
            vi: `Để chế tạo ${theme.toolNameVi}, chúng ta cần:\n• ${theme.primaryResource.nameVi}: ${state.resources.wood}/${reqPrimary}\n• ${theme.secondaryResource.nameVi}: ${state.resources.stone}/${reqSecondary}\n• ${theme.specialMission?.missionTitleVi || 'Mục tiêu phụ'}: ${currentSub}/${reqSub}.\nHãy khám phá bản đồ và hoàn thành nhé!`,
            choices: [
              {
                label: 'Tôi sẽ tiếp tục làm nhiệm vụ! (Understood)',
                action: () => setDialogue(null),
              },
            ],
          });
        }
      } else if (state.questStage === 'CRAFT_PUZZLE') {
        setDialogue({
          speaker: `${theme.mentorName} (${theme.mentorRole})`,
          en: `Great job bringing the materials! Answer these two English vocabulary questions so we can forge the ${theme.toolNameEn}!`,
          vi: `Tuyệt lắm, bạn đã mang đủ nguyên liệu! Hãy vượt qua 2 câu hỏi từ vựng để hoàn thiện ${theme.toolNameVi} nhé.`,
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
                      `Nhận ${theme.toolIcon} ${theme.toolNameVi}!`,
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
            ? `You have the Key! Head north to the ${theme.gateNameEn} and pass the final boss trial!`
            : `Use your ${theme.toolNameEn} on the ${theme.chestNameEn} on the east side!`,
          vi: state.resources.hasGateKey
            ? `Bạn đã có Chìa Khóa! Hãy tiến lên phía Bắc tới ${theme.gateNameVi} để vượt qua thử thách cuối cùng!`
            : `Hãy dùng ${theme.toolNameVi} vừa chế tạo để mở ${theme.chestNameVi} ở phía Đông nhé!`,
          choices: [{ label: 'Đã hiểu! (Đóng)', action: () => setDialogue(null) }],
        });
      }
      return;
    }

    // 5. Supply Chest / Data Cache
    if (target.type === 'chest') {
      state.keys = {};
      if (target.opened) {
        spawnFloatingText(target.x, target.y - 10, 'Đã mở! (Empty)', '#94a3b8');
        return;
      }
      if (!state.resources.hasAxe) {
        setDialogue({
          speaker: `${theme.chestNameVi} (${theme.chestNameEn})`,
          en: `${theme.barrierEn} seals this cache. You need the ${theme.toolNameEn} from ${theme.mentorName} to open it!`,
          vi: `${theme.barrierVi} đang phong ấn nơi này. Bạn cần ${theme.toolNameVi} từ ${theme.mentorName} để mở!`,
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
          spawnFloatingText(target.x, target.y - 12, `Nhận Chìa Khóa ${theme.gateNameVi}!`, '#facc15');
        },
      });
      return;
    }

    // 6. Escape Gate / Warp Stargate
    if (target.type === 'gate') {
      state.keys = {};
      if (!state.resources.hasGateKey) {
        setDialogue({
          speaker: `${theme.gateNameVi} (${theme.gateNameEn})`,
          en: `The gate is sealed. Retrieve the access key from the ${theme.chestNameEn} first!`,
          vi: `${theme.gateNameVi} đang bị khóa. Hãy tìm Chìa Khóa bên trong ${theme.chestNameVi} trước nhé!`,
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
      objects: WorldObject[],
      mapMatrix: number[][]
    ): boolean => {
      // 1. Tilemap Boundaries
      const startCol = Math.floor(px / TILE_SIZE);
      const endCol = Math.floor((px + pw) / TILE_SIZE);
      const startRow = Math.floor(py / TILE_SIZE);
      const endRow = Math.floor((py + ph) / TILE_SIZE);

      for (let r = startRow; r <= endRow; r++) {
        for (let c = startCol; c <= endCol; c++) {
          if (r < 0 || r >= MAP_ROWS || c < 0 || c >= MAP_COLS) return true;
          if (mapMatrix[r]?.[c] === 0) return true;
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

      // Handle Respawn of Resource Nodes
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
          if (!isCollidingWithWorld(newX, player.y, player.width, player.height, state.objects, state.activeMap)) {
            player.x = newX;
          }

          const newY = player.y + dy * player.speed * dt;
          if (!isCollidingWithWorld(player.x, newY, player.width, player.height, state.objects, state.activeMap)) {
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
      renderGameScene(ctx, gameRef.current, theme, now);
      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [theme]);

  const getObjectiveText = () => {
    const reqPrimary = theme.reqPrimary ?? 3;
    const reqSecondary = theme.reqSecondary ?? 2;
    const reqSub = theme.specialMission?.targetCount ?? 0;
    const currentSub = resources.subStationsActivated || 0;

    switch (questStage) {
      case 'TALK_TO_NPC':
        return `1. Gặp ${theme.mentorName} tại ${theme.realmTitle} [E] để nhận nhiệm vụ`;
      case 'GATHER_RESOURCES': {
        const subProgress =
          reqSub > 0
            ? ` & ${theme.specialMission?.missionTitleVi || 'Nhiệm vụ phụ'} (${currentSub}/${reqSub})`
            : '';
        return `2. Thu thập ${reqPrimary} ${theme.primaryResource.nameVi} (${resources.wood}/${reqPrimary}) & ${reqSecondary} ${theme.secondaryResource.nameVi} (${resources.stone}/${reqSecondary})${subProgress}`;
      }
      case 'CRAFT_PUZZLE':
        return `3. Gặp ${theme.mentorName} chế tạo ${theme.toolNameVi}`;
      case 'UNLOCK_CHEST':
        return `4. Dùng ${theme.toolNameVi} mở ${theme.chestNameVi} [E]`;
      case 'UNLOCK_GATE':
        return `5. Tra chìa khóa giải đố mở ${theme.gateNameVi} để hoàn thành [E]!`;
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
