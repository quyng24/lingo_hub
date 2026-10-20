import type {
  FloatingText,
  GameEngineState,
  PlayerState,
  QuestStage,
  Resources,
  WorldObject,
} from '@/types';
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  ISLAND_MAP,
  MAP_COLS,
  MAP_ROWS,
  TILE_SIZE,
} from './wordIslandData';

export function drawTilemap(ctx: CanvasRenderingContext2D, now: number) {
  for (let r = 0; r < MAP_ROWS; r++) {
    for (let c = 0; c < MAP_COLS; c++) {
      const tile = ISLAND_MAP[r][c];
      const x = c * TILE_SIZE;
      const y = r * TILE_SIZE;

      if (tile === 0) {
        // Water with animated pixel ripples
        ctx.fillStyle = '#1d4e68';
        ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
        ctx.fillStyle = '#2b6cb0';
        const waveOffset = Math.floor(now / 450 + r + c) % 2 === 0 ? 4 : 12;
        ctx.fillRect(x + waveOffset, y + 10, 14, 4);
        ctx.fillRect(x + 20 - waveOffset, y + 26, 12, 4);
      } else if (tile === 1) {
        // Sand
        ctx.fillStyle = '#e6c280';
        ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
        ctx.fillStyle = '#d4ac66';
        ctx.fillRect(x + 6, y + 8, 4, 4);
        ctx.fillRect(x + 26, y + 24, 4, 4);
      } else if (tile === 2) {
        // Grass
        ctx.fillStyle = '#3b7a33';
        ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
        ctx.fillStyle = '#2d5a27';
        ctx.fillRect(x + 8, y + 12, 4, 6);
        ctx.fillRect(x + 12, y + 10, 4, 8);
        ctx.fillRect(x + 28, y + 26, 4, 6);
      } else {
        // Dirt Path
        ctx.fillStyle = '#b08968';
        ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
        ctx.fillStyle = '#9c6644';
        ctx.fillRect(x + 10, y + 10, 6, 4);
        ctx.fillRect(x + 24, y + 26, 6, 4);
      }
    }
  }
}

export function drawWorldObjects(
  ctx: CanvasRenderingContext2D,
  objects: WorldObject[],
  questStage: QuestStage,
  resources: Resources,
  now: number
) {
  for (const obj of objects) {
    if (obj.type === 'tree') {
      if (obj.depleted) {
        // Tree Stump
        ctx.fillStyle = '#78350f';
        ctx.fillRect(obj.x + 10, obj.y + 22, 16, 12);
        ctx.fillStyle = '#b45309';
        ctx.fillRect(obj.x + 12, obj.y + 24, 12, 6);
      } else {
        // Pixel Pine Tree
        ctx.fillStyle = 'rgba(0,0,0,0.25)';
        ctx.fillRect(obj.x + 4, obj.y + 30, 28, 8);
        ctx.fillStyle = '#78350f';
        ctx.fillRect(obj.x + 12, obj.y + 22, 12, 14);
        ctx.fillStyle = '#14532d';
        ctx.fillRect(obj.x + 2, obj.y + 12, 32, 14);
        ctx.fillStyle = '#166534';
        ctx.fillRect(obj.x + 6, obj.y + 4, 24, 12);
        ctx.fillStyle = '#22c55e';
        ctx.fillRect(obj.x + 10, obj.y, 16, 8);
      }
    } else if (obj.type === 'rock') {
      if (obj.depleted) {
        // Crushed pebbles
        ctx.fillStyle = '#64748b';
        ctx.fillRect(obj.x + 8, obj.y + 18, 6, 6);
        ctx.fillRect(obj.x + 20, obj.y + 20, 8, 6);
      } else {
        // Pixel Rock
        ctx.fillStyle = 'rgba(0,0,0,0.25)';
        ctx.fillRect(obj.x + 2, obj.y + 22, 30, 8);
        ctx.fillStyle = '#475569';
        ctx.fillRect(obj.x + 2, obj.y + 8, 30, 18);
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(obj.x + 6, obj.y + 4, 22, 14);
        ctx.fillStyle = '#cbd5e1';
        ctx.fillRect(obj.x + 10, obj.y + 6, 10, 6);
      }
    } else if (obj.type === 'camp') {
      // Logs + Animated Fire
      ctx.fillStyle = '#78350f';
      ctx.fillRect(obj.x + 4, obj.y + 22, 28, 8);
      ctx.fillRect(obj.x + 10, obj.y + 18, 16, 14);
      const flicker = Math.floor(now / 150) % 2 === 0;
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(obj.x + 8, obj.y + 8, 20, 14);
      ctx.fillStyle = '#f97316';
      ctx.fillRect(obj.x + 11, obj.y + (flicker ? 4 : 6), 14, 12);
      ctx.fillStyle = '#fde047';
      ctx.fillRect(obj.x + 14, obj.y + (flicker ? 8 : 10), 8, 8);
    } else if (obj.type === 'npc') {
      // Captain Minh Sprite
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.fillRect(obj.x + 4, obj.y + 32, 26, 6);
      // Boots & Pants
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(obj.x + 8, obj.y + 24, 7, 10);
      ctx.fillRect(obj.x + 19, obj.y + 24, 7, 10);
      // Jacket
      ctx.fillStyle = '#d97706';
      ctx.fillRect(obj.x + 6, obj.y + 12, 22, 14);
      // Head & Captain Hat
      ctx.fillStyle = '#fde68a';
      ctx.fillRect(obj.x + 8, obj.y + 4, 18, 10);
      ctx.fillStyle = '#1e3a8a';
      ctx.fillRect(obj.x + 6, obj.y, 22, 5);
      // Quest exclamation indicator
      if (questStage === 'TALK_TO_NPC' || questStage === 'CRAFT_PUZZLE') {
        const bounce = Math.sin(now / 180) * 3;
        ctx.fillStyle = '#facc15';
        ctx.fillRect(obj.x + 14, obj.y - 18 + bounce, 6, 10);
        ctx.fillRect(obj.x + 14, obj.y - 6 + bounce, 6, 4);
      }
    } else if (obj.type === 'chest') {
      // Treasure Chest
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.fillRect(obj.x + 2, obj.y + 26, 32, 6);
      ctx.fillStyle = '#92400e';
      ctx.fillRect(obj.x + 2, obj.y + 6, 32, 22);
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(obj.x + 2, obj.y + 14, 32, 4);
      ctx.fillRect(obj.x + 14, obj.y + 12, 8, 8);
      if (!obj.opened && !resources.hasAxe) {
        // Green Vines blocking chest
        ctx.fillStyle = '#15803d';
        ctx.fillRect(obj.x + 6, obj.y + 4, 4, 24);
        ctx.fillRect(obj.x + 24, obj.y + 4, 4, 24);
      } else if (obj.opened) {
        ctx.fillStyle = '#451a03';
        ctx.fillRect(obj.x + 4, obj.y + 6, 28, 8);
      }
    } else if (obj.type === 'gate') {
      // Escape Gate Arch
      ctx.fillStyle = '#334155';
      ctx.fillRect(obj.x, obj.y, 16, 40);
      ctx.fillRect(obj.x + 64, obj.y, 16, 40);
      ctx.fillRect(obj.x, obj.y, 80, 12);
      if (!obj.opened) {
        // Locked Iron Bars
        ctx.fillStyle = '#94a3b8';
        for (let bx = 22; bx <= 56; bx += 10) {
          ctx.fillRect(obj.x + bx, obj.y + 10, 4, 28);
        }
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(obj.x + 34, obj.y + 18, 12, 12);
      } else {
        // Golden open path glow
        ctx.fillStyle = 'rgba(250, 204, 21, 0.35)';
        ctx.fillRect(obj.x + 16, obj.y + 12, 48, 28);
      }
    }
  }
}

export function drawPlayer(ctx: CanvasRenderingContext2D, player: PlayerState) {
  const stepOffset = Math.sin(player.walkFrame) * 2;
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.fillRect(player.x + 3, player.y + 23, 22, 6);
  // Legs
  ctx.fillStyle = '#1e3a8a';
  ctx.fillRect(player.x + 6, player.y + 18 + stepOffset, 6, 8);
  ctx.fillRect(player.x + 16, player.y + 18 - stepOffset, 6, 8);
  // Tunic
  ctx.fillStyle = '#0284c7';
  ctx.fillRect(player.x + 4, player.y + 8, 20, 12);
  // Head
  ctx.fillStyle = '#fed7aa';
  ctx.fillRect(player.x + 5, player.y - 2, 18, 11);
  // Hair / Bandana
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(player.x + 4, player.y - 4, 20, 5);
  // Eyes indicating direction
  ctx.fillStyle = '#0f172a';
  if (player.dir === 'left') {
    ctx.fillRect(player.x + 6, player.y + 2, 3, 3);
  } else if (player.dir === 'right') {
    ctx.fillRect(player.x + 19, player.y + 2, 3, 3);
  } else if (player.dir === 'down') {
    ctx.fillRect(player.x + 8, player.y + 2, 3, 3);
    ctx.fillRect(player.x + 17, player.y + 2, 3, 3);
  }
}

export function drawPrompt(ctx: CanvasRenderingContext2D, target: WorldObject) {
  const promptText = `[E] ${target.label}`;
  ctx.font = 'bold 12px monospace';
  const textWidth = ctx.measureText(promptText).width;
  const bx = target.x + target.width / 2 - textWidth / 2 - 8;
  const by = target.y - 26;

  ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
  ctx.fillRect(bx, by, textWidth + 16, 20);
  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = 2;
  ctx.strokeRect(bx, by, textWidth + 16, 20);

  ctx.fillStyle = '#fef08a';
  ctx.fillText(promptText, bx + 8, by + 14);
}

export function drawFloatingTexts(
  ctx: CanvasRenderingContext2D,
  floatingTexts: FloatingText[]
) {
  for (const ft of floatingTexts) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, ft.alpha);
    ctx.font = 'bold 13px monospace';
    ctx.fillStyle = '#000000';
    ctx.fillText(ft.text, ft.x + 1, ft.y + 1);
    ctx.fillStyle = ft.color;
    ctx.fillText(ft.text, ft.x, ft.y);
    ctx.restore();
  }
}

export function renderGameScene(
  ctx: CanvasRenderingContext2D,
  state: GameEngineState,
  now: number
) {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  ctx.save();

  // Screen shake effect when harvesting
  if (state.shakeTime > 0) {
    const sx = (Math.random() - 0.5) * 5;
    const sy = (Math.random() - 0.5) * 5;
    ctx.translate(sx, sy);
  }

  // 1. Draw Map
  drawTilemap(ctx, now);

  // 2. Draw World Objects
  drawWorldObjects(ctx, state.objects, state.questStage, state.resources, now);

  // 3. Draw Player
  drawPlayer(ctx, state.player);

  // 4. Draw Interaction Prompt
  if (state.nearestObject && !state.overlayOpen) {
    drawPrompt(ctx, state.nearestObject);
  }

  // 5. Draw Floating Feedback Texts
  drawFloatingTexts(ctx, state.floatingTexts);

  ctx.restore();
}

