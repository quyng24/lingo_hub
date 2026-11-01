import type {
  FloatingText,
  GameEngineState,
  IslandTheme,
  PlayerState,
  QuestStage,
  Resources,
  WorldObject,
} from '@/types';
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  MAP_COLS,
  MAP_ROWS,
  TILE_SIZE,
} from './wordIslandData';

// ==========================================
// 1. TILEMAP RENDERING WITH BIOME PALETTES
// ==========================================

export function drawTilemap(
  ctx: CanvasRenderingContext2D,
  now: number,
  theme: IslandTheme,
  mapMatrix: number[][]
) {
  const style = theme.environmentStyle;

  for (let r = 0; r < MAP_ROWS; r++) {
    for (let c = 0; c < MAP_COLS; c++) {
      const tile = mapMatrix[r]?.[c] ?? 0;
      const x = c * TILE_SIZE;
      const y = r * TILE_SIZE;

      if (tile === 0) {
        // LIQUID / VOID / BOUNDARY
        if (style === 'cyber') {
          // Cyber Coolant Trench with neon circuit pulses
          ctx.fillStyle = '#031726';
          ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
          ctx.fillStyle = '#083344';
          ctx.fillRect(x + 2, y + 2, TILE_SIZE - 4, TILE_SIZE - 4);
          const pulse = (Math.floor(now / 200 + r * 2 + c) % 6 === 0);
          if (pulse) {
            ctx.fillStyle = '#06b6d4';
            ctx.fillRect(x + 12, y + 16, 16, 3);
            ctx.fillStyle = '#22d3ee';
            ctx.fillRect(x + 18, y + 16, 4, 3);
          }
        } else if (style === 'cosmic') {
          // Deep Space Void with animated stars & nebula dust
          ctx.fillStyle = '#090414';
          ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
          const starSeed = (r * 17 + c * 31) % 100;
          if (starSeed > 75) {
            const twinkle = Math.sin(now / 300 + starSeed) > 0.3;
            ctx.fillStyle = twinkle ? '#e9d5ff' : '#7e22ce';
            ctx.fillRect(x + (starSeed % 30), y + ((starSeed * 3) % 30), 2, 2);
          } else if (starSeed > 60) {
            ctx.fillStyle = 'rgba(168, 85, 247, 0.12)';
            ctx.fillRect(x + 4, y + 4, 32, 32);
          }
        } else if (style === 'tempest') {
          // Churning stormy sea with whitecaps
          ctx.fillStyle = '#0c1f2c';
          ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
          ctx.fillStyle = '#1e3a5f';
          const wave = Math.floor(now / 350 + r * 3 + c) % 3;
          if (wave === 0) {
            ctx.fillStyle = '#94a3b8';
            ctx.fillRect(x + 6, y + 12, 16, 3);
            ctx.fillRect(x + 22, y + 24, 12, 3);
          } else {
            ctx.fillStyle = '#334155';
            ctx.fillRect(x + 10, y + 18, 14, 3);
          }
        } else if (style === 'emotions') {
          // Sacred Lotus Pond (calm turquoise waters with lilypads)
          ctx.fillStyle = '#042f2e';
          ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
          ctx.fillStyle = '#0d9488';
          const waveOffset = Math.floor(now / 500 + r + c) % 2 === 0 ? 6 : 14;
          ctx.fillRect(x + waveOffset, y + 12, 12, 3);
          // Occasional lotus leaf
          if ((r * 7 + c * 11) % 19 === 0) {
            ctx.fillStyle = '#10b981';
            ctx.fillRect(x + 14, y + 14, 10, 8);
            ctx.fillStyle = '#f472b6';
            ctx.fillRect(x + 18, y + 12, 4, 4);
          }
        } else {
          // Classic tropical sea
          ctx.fillStyle = '#1d4e68';
          ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
          ctx.fillStyle = '#2b6cb0';
          const waveOffset = Math.floor(now / 450 + r + c) % 2 === 0 ? 4 : 12;
          ctx.fillRect(x + waveOffset, y + 10, 14, 4);
          ctx.fillRect(x + 20 - waveOffset, y + 26, 12, 4);
        }
      } else if (tile === 1) {
        // SHORE / SAND / CHASSIS RIM
        if (style === 'cyber') {
          // Titanium chassis border with gold traces
          ctx.fillStyle = '#1e293b';
          ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
          ctx.fillStyle = '#334155';
          ctx.fillRect(x + 4, y + 4, TILE_SIZE - 8, TILE_SIZE - 8);
          ctx.fillStyle = '#eab308';
          ctx.fillRect(x + 8, y + 18, 4, 4);
        } else if (style === 'cosmic') {
          // Purple cosmic crust
          ctx.fillStyle = '#3b0764';
          ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
          ctx.fillStyle = '#581c87';
          ctx.fillRect(x + 6, y + 8, 4, 4);
          ctx.fillRect(x + 24, y + 22, 6, 4);
        } else if (style === 'tempest') {
          // Wet dark pebbles
          ctx.fillStyle = '#475569';
          ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
          ctx.fillStyle = '#334155';
          ctx.fillRect(x + 4, y + 10, 6, 4);
          ctx.fillRect(x + 24, y + 22, 6, 4);
        } else if (style === 'emotions') {
          // Golden radiant sand
          ctx.fillStyle = '#fef08a';
          ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
          ctx.fillStyle = '#facc15';
          ctx.fillRect(x + 6, y + 8, 4, 4);
          ctx.fillRect(x + 26, y + 24, 4, 4);
        } else {
          // Classic tropical golden sand
          ctx.fillStyle = '#e6c280';
          ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
          ctx.fillStyle = '#d4ac66';
          ctx.fillRect(x + 6, y + 8, 4, 4);
          ctx.fillRect(x + 26, y + 24, 4, 4);
        }
      } else if (tile === 2) {
        // MAIN BIOME FLOOR
        if (style === 'cyber') {
          // Dark circuit deck
          ctx.fillStyle = '#0f2838';
          ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
          ctx.fillStyle = '#083344';
          ctx.fillRect(x + 2, y + 2, TILE_SIZE - 4, TILE_SIZE - 4);
          // Circuit cross
          ctx.fillStyle = '#0284c7';
          ctx.fillRect(x + 18, y + 6, 4, 28);
          ctx.fillRect(x + 6, y + 18, 28, 4);
        } else if (style === 'cosmic') {
          // Deep violet asteroid floor
          ctx.fillStyle = '#2e1065';
          ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
          ctx.fillStyle = '#4c1d95';
          ctx.fillRect(x + 8, y + 10, 6, 8);
          ctx.fillRect(x + 24, y + 22, 6, 6);
          ctx.fillStyle = '#c084fc';
          ctx.fillRect(x + 12, y + 14, 2, 2);
        } else if (style === 'tempest') {
          // Dark rocky wind-swept moor
          ctx.fillStyle = '#1e293b';
          ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(x + 6, y + 10, 6, 8);
          ctx.fillStyle = '#14532d';
          ctx.fillRect(x + 20, y + 18, 6, 6);
        } else if (style === 'emotions') {
          // Soft serene emerald moss
          ctx.fillStyle = '#047857';
          ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
          ctx.fillStyle = '#059669';
          ctx.fillRect(x + 8, y + 12, 4, 6);
          ctx.fillRect(x + 24, y + 20, 6, 4);
          // Tiny flowers
          if ((r * 13 + c * 7) % 11 === 0) {
            ctx.fillStyle = '#f472b6';
            ctx.fillRect(x + 16, y + 16, 4, 4);
          }
        } else if (style === 'sports') {
          // Professional manicured athletic turf
          ctx.fillStyle = '#15803d';
          ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
          ctx.fillStyle = '#16a34a';
          if ((r + c) % 2 === 0) {
            ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
          }
        } else {
          // Lush tropical grass
          ctx.fillStyle = '#3b7a33';
          ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
          ctx.fillStyle = '#2d5a27';
          ctx.fillRect(x + 8, y + 12, 4, 6);
          ctx.fillRect(x + 12, y + 10, 4, 8);
          ctx.fillRect(x + 28, y + 26, 4, 6);
        }
      } else {
        // WALKWAYS / PATHS
        if (style === 'cyber') {
          // Fiber Optic Data Highway (Neon Cyan)
          ctx.fillStyle = '#0284c7';
          ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
          ctx.fillStyle = '#0369a1';
          ctx.fillRect(x + 4, y + 4, TILE_SIZE - 8, TILE_SIZE - 8);
          ctx.fillStyle = '#38bdf8';
          const dotOffset = (Math.floor(now / 150 + c + r) % 3) * 10;
          ctx.fillRect(x + dotOffset + 4, y + 18, 6, 4);
        } else if (style === 'cosmic') {
          // Iridescent Starlight Crystal Bridge
          ctx.fillStyle = '#701a75';
          ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
          ctx.fillStyle = '#a21caf';
          ctx.fillRect(x + 4, y + 4, TILE_SIZE - 8, TILE_SIZE - 8);
          ctx.fillStyle = '#f472b6';
          ctx.fillRect(x + 14, y + 14, 12, 12);
        } else if (style === 'tempest') {
          // Bolted storm boardwalk planks
          ctx.fillStyle = '#5c3d2e';
          ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
          ctx.fillStyle = '#442b1f';
          ctx.fillRect(x + 2, y + 2, TILE_SIZE - 4, 16);
          ctx.fillRect(x + 2, y + 20, TILE_SIZE - 4, 16);
          ctx.fillStyle = '#94a3b8';
          ctx.fillRect(x + 4, y + 8, 3, 3);
          ctx.fillRect(x + 32, y + 8, 3, 3);
        } else if (style === 'emotions') {
          // Polished Ancient Marble Walkway
          ctx.fillStyle = '#fce7f3';
          ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
          ctx.fillStyle = '#fbcfe8';
          ctx.fillRect(x + 6, y + 6, TILE_SIZE - 12, TILE_SIZE - 12);
          ctx.fillStyle = '#f472b6';
          ctx.fillRect(x + 16, y + 16, 8, 8);
        } else if (style === 'sports') {
          // Olympic Red Running Track with white line
          ctx.fillStyle = '#b91c1c';
          ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(x + 4, y + 18, TILE_SIZE - 8, 3);
        } else {
          // Classic dirt path
          ctx.fillStyle = '#b08968';
          ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
          ctx.fillStyle = '#9c6644';
          ctx.fillRect(x + 10, y + 10, 6, 4);
          ctx.fillRect(x + 24, y + 26, 6, 4);
        }
      }
    }
  }
}

// ==========================================
// 2. WORLD OBJECTS RENDERING (THEMED SPRITES)
// ==========================================

export function drawWorldObjects(
  ctx: CanvasRenderingContext2D,
  objects: WorldObject[],
  questStage: QuestStage,
  resources: Resources,
  theme: IslandTheme,
  now: number
) {
  const style = theme.environmentStyle;

  for (const obj of objects) {
    // ----------------------------------------
    // A. PRIMARY RESOURCE NODE (Tree equivalent)
    // ----------------------------------------
    if (obj.type === 'tree') {
      if (obj.depleted) {
        ctx.fillStyle = '#475569';
        ctx.fillRect(obj.x + 10, obj.y + 22, 16, 10);
      } else if (style === 'cyber') {
        // Optical Data Terminal / Cyber Pylon
        ctx.fillStyle = 'rgba(0,0,0,0.35)';
        ctx.fillRect(obj.x + 4, obj.y + 30, 28, 8);
        // Metal base
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(obj.x + 8, obj.y + 22, 20, 12);
        // Glass cyan data core
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(obj.x + 10, obj.y + 6, 16, 18);
        ctx.fillStyle = '#38bdf8';
        const blink = Math.sin(now / 200) > 0;
        ctx.fillRect(obj.x + 13, obj.y + 10, 10, 10);
        if (blink) {
          ctx.fillStyle = '#f0fdf4';
          ctx.fillRect(obj.x + 15, obj.y + 12, 6, 6);
        }
        // Floating cyber halo
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(obj.x + 14, obj.y + 1, 8, 3);
      } else if (style === 'cosmic') {
        // Starlight Crystal Cluster
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.fillRect(obj.x + 4, obj.y + 30, 28, 8);
        ctx.fillStyle = '#581c87';
        ctx.fillRect(obj.x + 12, obj.y + 20, 12, 14);
        // Crystal shards
        ctx.fillStyle = '#9333ea';
        ctx.fillRect(obj.x + 6, obj.y + 8, 24, 18);
        ctx.fillStyle = '#c084fc';
        ctx.fillRect(obj.x + 10, obj.y + 2, 16, 16);
        ctx.fillStyle = '#f5d0fe';
        const gleam = Math.sin(now / 250) * 2;
        ctx.fillRect(obj.x + 14 + gleam, obj.y + 6, 4, 8);
      } else if (style === 'emotions') {
        // Spirit Willow Tree (Lavender/pink cascading canopy)
        ctx.fillStyle = 'rgba(0,0,0,0.25)';
        ctx.fillRect(obj.x + 4, obj.y + 30, 28, 8);
        ctx.fillStyle = '#4c1d95';
        ctx.fillRect(obj.x + 14, obj.y + 20, 8, 14);
        ctx.fillStyle = '#db2777';
        ctx.fillRect(obj.x + 4, obj.y + 8, 28, 16);
        ctx.fillStyle = '#f472b6';
        ctx.fillRect(obj.x + 8, obj.y + 2, 20, 14);
        // Hanging spiritual vines
        ctx.fillStyle = '#fbcfe8';
        ctx.fillRect(obj.x + 6, obj.y + 20, 3, 10);
        ctx.fillRect(obj.x + 26, obj.y + 20, 3, 10);
      } else if (style === 'tropical') {
        // Bamboo Grove (Bamboo Canes & Feathery Leaves)
        ctx.fillStyle = 'rgba(0,0,0,0.25)';
        ctx.fillRect(obj.x + 4, obj.y + 30, 28, 8);
        ctx.fillStyle = '#15803d';
        ctx.fillRect(obj.x + 8, obj.y + 6, 6, 26);
        ctx.fillRect(obj.x + 18, obj.y + 2, 6, 30);
        // Bamboo nodes
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(obj.x + 7, obj.y + 14, 8, 2);
        ctx.fillRect(obj.x + 7, obj.y + 22, 8, 2);
        ctx.fillRect(obj.x + 17, obj.y + 12, 8, 2);
        ctx.fillRect(obj.x + 17, obj.y + 20, 8, 2);
        // Foliage
        ctx.fillStyle = '#22c55e';
        ctx.fillRect(obj.x + 4, obj.y, 28, 8);
      } else {
        // Classic Pine Tree
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
    }

    // ----------------------------------------
    // B. SECONDARY RESOURCE NODE (Rock equivalent)
    // ----------------------------------------
    else if (obj.type === 'rock') {
      if (obj.depleted) {
        ctx.fillStyle = '#64748b';
        ctx.fillRect(obj.x + 8, obj.y + 18, 6, 6);
        ctx.fillRect(obj.x + 20, obj.y + 20, 8, 6);
      } else if (style === 'cyber') {
        // Quantum Battery Core
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.fillRect(obj.x + 2, obj.y + 22, 30, 8);
        ctx.fillStyle = '#1e1b4b';
        ctx.fillRect(obj.x + 4, obj.y + 8, 26, 18);
        ctx.fillStyle = '#6366f1';
        ctx.fillRect(obj.x + 8, obj.y + 12, 18, 10);
        ctx.fillStyle = '#a855f7';
        const pulse = Math.floor(now / 180) % 2 === 0;
        ctx.fillRect(obj.x + 12, obj.y + (pulse ? 13 : 15), 10, 6);
      } else if (style === 'cosmic') {
        // Glowing Meteorite Chunk
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.fillRect(obj.x + 2, obj.y + 22, 30, 8);
        ctx.fillStyle = '#311042';
        ctx.fillRect(obj.x + 4, obj.y + 8, 26, 16);
        ctx.fillStyle = '#8b5cf6';
        ctx.fillRect(obj.x + 8, obj.y + 6, 16, 12);
        ctx.fillStyle = '#e9d5ff';
        ctx.fillRect(obj.x + 14, obj.y + 10, 6, 6);
      } else if (style === 'emotions') {
        // Serenity Rune Stone (Engraved Jade Obelisk)
        ctx.fillStyle = 'rgba(0,0,0,0.25)';
        ctx.fillRect(obj.x + 4, obj.y + 22, 26, 8);
        ctx.fillStyle = '#065f46';
        ctx.fillRect(obj.x + 8, obj.y + 6, 18, 20);
        ctx.fillStyle = '#10b981';
        ctx.fillRect(obj.x + 11, obj.y + 10, 12, 12);
        ctx.fillStyle = '#6ee7b7';
        ctx.fillRect(obj.x + 15, obj.y + 12, 4, 8);
      } else {
        // Classic Granite Rock
        ctx.fillStyle = 'rgba(0,0,0,0.25)';
        ctx.fillRect(obj.x + 2, obj.y + 22, 30, 8);
        ctx.fillStyle = '#475569';
        ctx.fillRect(obj.x + 2, obj.y + 8, 30, 18);
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(obj.x + 6, obj.y + 4, 22, 14);
        ctx.fillStyle = '#cbd5e1';
        ctx.fillRect(obj.x + 10, obj.y + 6, 10, 6);
      }
    }

    // ----------------------------------------
    // C. REALM CENTERPIECE (Camp equivalent)
    // ----------------------------------------
    else if (obj.type === 'camp') {
      const cType = theme.centerPieceType;

      if (cType === 'server') {
        // Cyber Supercomputer Server Rack
        ctx.fillStyle = 'rgba(0,0,0,0.4)';
        ctx.fillRect(obj.x + 2, obj.y + 28, 32, 8);
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(obj.x + 4, obj.y + 6, 28, 26);
        // Server blinks
        const t = Math.floor(now / 150);
        ctx.fillStyle = t % 2 === 0 ? '#22c55e' : '#14532d';
        ctx.fillRect(obj.x + 8, obj.y + 10, 4, 4);
        ctx.fillStyle = t % 3 === 0 ? '#38bdf8' : '#0369a1';
        ctx.fillRect(obj.x + 8, obj.y + 16, 4, 4);
        ctx.fillStyle = t % 4 === 0 ? '#f59e0b' : '#78350f';
        ctx.fillRect(obj.x + 8, obj.y + 22, 4, 4);
        // Ventilator grille
        ctx.fillStyle = '#334155';
        ctx.fillRect(obj.x + 16, obj.y + 10, 12, 16);
      } else if (cType === 'beacon') {
        // Astral Stargate Beacon (Transmitter Spire)
        ctx.fillStyle = 'rgba(0,0,0,0.35)';
        ctx.fillRect(obj.x + 2, obj.y + 28, 32, 8);
        ctx.fillStyle = '#3b0764';
        ctx.fillRect(obj.x + 8, obj.y + 18, 20, 14);
        ctx.fillStyle = '#7e22ce';
        ctx.fillRect(obj.x + 12, obj.y + 8, 12, 12);
        // Pulsing beam tip
        const flare = Math.sin(now / 120) * 3;
        ctx.fillStyle = '#f0abfc';
        ctx.fillRect(obj.x + 14, obj.y - 4 + flare, 8, 8);
      } else if (cType === 'weather_tower') {
        // Storm Anemometer Station (Spinning weather cups)
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.fillRect(obj.x + 4, obj.y + 28, 28, 8);
        ctx.fillStyle = '#475569';
        ctx.fillRect(obj.x + 14, obj.y + 6, 8, 24);
        // Rotating anemometer head
        const spin = Math.floor(now / 80) % 4;
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(obj.x + 8 + spin * 3, obj.y + 2, 6, 6);
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(obj.x + 10, obj.y + 12, 16, 8);
      } else if (cType === 'olympic_flame') {
        // Golden Cauldron with Olympic Flame
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.fillRect(obj.x + 4, obj.y + 28, 28, 8);
        ctx.fillStyle = '#d97706';
        ctx.fillRect(obj.x + 6, obj.y + 18, 24, 12);
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(obj.x + 4, obj.y + 14, 28, 6);
        // Blazing athletic fire
        const flicker = Math.floor(now / 120) % 2 === 0;
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(obj.x + 8, obj.y + 4, 20, 12);
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(obj.x + 11, obj.y + (flicker ? 0 : 2), 14, 10);
      } else if (cType === 'altar') {
        // Zen Meditation Altar (Sacred Lotus & Incense)
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.fillRect(obj.x + 4, obj.y + 28, 28, 8);
        ctx.fillStyle = '#fbcfe8';
        ctx.fillRect(obj.x + 4, obj.y + 20, 28, 10);
        ctx.fillStyle = '#db2777';
        ctx.fillRect(obj.x + 8, obj.y + 10, 20, 12);
        ctx.fillStyle = '#fdf2f8';
        ctx.fillRect(obj.x + 12, obj.y + 6, 12, 8);
        // Swirling incense smoke
        const smoke = Math.sin(now / 200) * 4;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.fillRect(obj.x + 16 + smoke, obj.y - 4, 4, 8);
      } else {
        // Classic Campfire with logs
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
      }
    }

    // ----------------------------------------
    // D. NPC MENTORS (Custom Character Sprites)
    // ----------------------------------------
    else if (obj.type === 'npc') {
      const mSprite = theme.mentorSprite;
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.fillRect(obj.x + 4, obj.y + 32, 26, 6);

      if (mSprite === 'engineer') {
        // Echo: Cyborg / Engineer (Lab Coat & Glowing AR Visor)
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(obj.x + 8, obj.y + 24, 7, 10);
        ctx.fillRect(obj.x + 19, obj.y + 24, 7, 10);
        ctx.fillStyle = '#e2e8f0';
        ctx.fillRect(obj.x + 6, obj.y + 12, 22, 14);
        // Head & Cyan Visor
        ctx.fillStyle = '#cbd5e1';
        ctx.fillRect(obj.x + 8, obj.y + 4, 18, 10);
        ctx.fillStyle = '#06b6d4';
        ctx.fillRect(obj.x + 9, obj.y + 7, 16, 4);
        // Antenna
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(obj.x + 22, obj.y - 2, 2, 6);
        ctx.fillStyle = '#22d3ee';
        ctx.fillRect(obj.x + 21, obj.y - 4, 4, 3);
      } else if (mSprite === 'astronomer') {
        // Orion: Cosmic Explorer (White Astronaut Suit with Gold Visor)
        ctx.fillStyle = '#e2e8f0';
        ctx.fillRect(obj.x + 8, obj.y + 24, 7, 10);
        ctx.fillRect(obj.x + 19, obj.y + 24, 7, 10);
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(obj.x + 6, obj.y + 12, 22, 14);
        ctx.fillStyle = '#7c3aed';
        ctx.fillRect(obj.x + 12, obj.y + 15, 10, 6);
        // Bubble Helmet & Gold Visor
        ctx.fillStyle = '#e2e8f0';
        ctx.fillRect(obj.x + 7, obj.y + 2, 20, 12);
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(obj.x + 10, obj.y + 5, 14, 7);
      } else if (mSprite === 'ranger') {
        // Ranger Hai: Safari Khaki Vest & Safari Hat
        ctx.fillStyle = '#78350f';
        ctx.fillRect(obj.x + 8, obj.y + 24, 7, 10);
        ctx.fillRect(obj.x + 19, obj.y + 24, 7, 10);
        ctx.fillStyle = '#d97706';
        ctx.fillRect(obj.x + 6, obj.y + 12, 22, 14);
        // Binoculars
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(obj.x + 12, obj.y + 16, 10, 4);
        // Head & Hat
        ctx.fillStyle = '#fed7aa';
        ctx.fillRect(obj.x + 8, obj.y + 6, 18, 8);
        ctx.fillStyle = '#15803d';
        ctx.fillRect(obj.x + 4, obj.y + 2, 26, 4);
        ctx.fillRect(obj.x + 8, obj.y - 2, 18, 5);
      } else if (mSprite === 'storm_chaser') {
        // Phong: Yellow Neon Raincoat & Storm Hood
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(obj.x + 8, obj.y + 24, 7, 10);
        ctx.fillRect(obj.x + 19, obj.y + 24, 7, 10);
        ctx.fillStyle = '#eab308';
        ctx.fillRect(obj.x + 6, obj.y + 10, 22, 16);
        // Hood
        ctx.fillStyle = '#ca8a04';
        ctx.fillRect(obj.x + 7, obj.y + 1, 20, 12);
        ctx.fillStyle = '#fed7aa';
        ctx.fillRect(obj.x + 11, obj.y + 6, 12, 6);
      } else if (mSprite === 'coach') {
        // Coach Hung: Red Headband & Whistle
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(obj.x + 8, obj.y + 24, 7, 10);
        ctx.fillRect(obj.x + 19, obj.y + 24, 7, 10);
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(obj.x + 6, obj.y + 12, 22, 14);
        // Head & Red Headband
        ctx.fillStyle = '#fed7aa';
        ctx.fillRect(obj.x + 8, obj.y + 4, 18, 10);
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(obj.x + 7, obj.y + 3, 20, 4);
        // Whistle
        ctx.fillStyle = '#e2e8f0';
        ctx.fillRect(obj.x + 15, obj.y + 14, 4, 4);
      } else if (mSprite === 'sage') {
        // Sage Thu: Flowing Lavender Robes & Zen Glow
        ctx.fillStyle = '#4a044e';
        ctx.fillRect(obj.x + 6, obj.y + 12, 22, 22);
        ctx.fillStyle = '#ec4899';
        ctx.fillRect(obj.x + 10, obj.y + 14, 14, 18);
        ctx.fillStyle = '#fed7aa';
        ctx.fillRect(obj.x + 9, obj.y + 4, 16, 10);
        // Halo
        ctx.fillStyle = 'rgba(244, 114, 182, 0.5)';
        ctx.fillRect(obj.x + 7, obj.y - 2, 20, 4);
      } else {
        // Captain Minh (Default)
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(obj.x + 8, obj.y + 24, 7, 10);
        ctx.fillRect(obj.x + 19, obj.y + 24, 7, 10);
        ctx.fillStyle = '#d97706';
        ctx.fillRect(obj.x + 6, obj.y + 12, 22, 14);
        ctx.fillStyle = '#fde68a';
        ctx.fillRect(obj.x + 8, obj.y + 4, 18, 10);
        ctx.fillStyle = '#1e3a8a';
        ctx.fillRect(obj.x + 6, obj.y, 22, 5);
      }

      // Exclamation indicator
      if (questStage === 'TALK_TO_NPC' || questStage === 'CRAFT_PUZZLE') {
        const bounce = Math.sin(now / 180) * 3;
        ctx.fillStyle = '#facc15';
        ctx.fillRect(obj.x + 14, obj.y - 18 + bounce, 6, 10);
        ctx.fillRect(obj.x + 14, obj.y - 6 + bounce, 6, 4);
      }
    }

    // ----------------------------------------
    // E. SUPPLY CHEST / ENCRYPTED DATA CACHE
    // ----------------------------------------
    else if (obj.type === 'chest') {
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.fillRect(obj.x + 2, obj.y + 26, 32, 6);

      if (style === 'cyber') {
        // Cyber Data Cache
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(obj.x + 2, obj.y + 6, 32, 22);
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(obj.x + 4, obj.y + 8, 28, 18);
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(obj.x + 14, obj.y + 12, 8, 8);
        if (!obj.opened && !resources.hasAxe) {
          // Laser barrier
          ctx.fillStyle = '#ef4444';
          ctx.fillRect(obj.x + 4, obj.y + 10, 28, 2);
          ctx.fillRect(obj.x + 4, obj.y + 18, 28, 2);
        } else if (obj.opened) {
          ctx.fillStyle = '#22c55e';
          ctx.fillRect(obj.x + 14, obj.y + 8, 8, 6);
        }
      } else if (style === 'cosmic') {
        // Starlight Relic Pod
        ctx.fillStyle = '#3b0764';
        ctx.fillRect(obj.x + 2, obj.y + 6, 32, 22);
        ctx.fillStyle = '#7e22ce';
        ctx.fillRect(obj.x + 4, obj.y + 8, 28, 18);
        ctx.fillStyle = '#f472b6';
        ctx.fillRect(obj.x + 14, obj.y + 12, 8, 8);
        if (!obj.opened && !resources.hasAxe) {
          // Forcefield
          ctx.fillStyle = 'rgba(192, 132, 252, 0.5)';
          ctx.fillRect(obj.x - 2, obj.y + 2, 40, 28);
        }
      } else {
        // Classic Treasure Chest with vines
        ctx.fillStyle = '#92400e';
        ctx.fillRect(obj.x + 2, obj.y + 6, 32, 22);
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(obj.x + 2, obj.y + 14, 32, 4);
        ctx.fillRect(obj.x + 14, obj.y + 12, 8, 8);
        if (!obj.opened && !resources.hasAxe) {
          ctx.fillStyle = '#15803d';
          ctx.fillRect(obj.x + 6, obj.y + 4, 4, 24);
          ctx.fillRect(obj.x + 24, obj.y + 4, 4, 24);
        } else if (obj.opened) {
          ctx.fillStyle = '#451a03';
          ctx.fillRect(obj.x + 4, obj.y + 6, 28, 8);
        }
      }
    }

    // ----------------------------------------
    // F. EXIT GATE / FIREWALL / STARGATE
    // ----------------------------------------
    else if (obj.type === 'gate') {
      if (style === 'cyber') {
        // Laser Firewall Gateway
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(obj.x, obj.y, 18, 40);
        ctx.fillRect(obj.x + 62, obj.y, 18, 40);
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(obj.x, obj.y, 80, 10);
        if (!obj.opened) {
          // Electric laser fence
          ctx.fillStyle = '#ef4444';
          const pulse = Math.floor(now / 120) % 2 === 0;
          for (let yPos = obj.y + 12; yPos <= obj.y + 34; yPos += 8) {
            ctx.fillRect(obj.x + 18, yPos, 44, pulse ? 3 : 2);
          }
        } else {
          // Open Green Path
          ctx.fillStyle = 'rgba(34, 197, 94, 0.4)';
          ctx.fillRect(obj.x + 18, obj.y + 10, 44, 30);
        }
      } else if (style === 'cosmic') {
        // Cosmic Stargate Portal (Circular Ring with Swirling Vortex)
        ctx.fillStyle = '#4c1d95';
        ctx.fillRect(obj.x, obj.y, 16, 40);
        ctx.fillRect(obj.x + 64, obj.y, 16, 40);
        ctx.fillStyle = '#7c3aed';
        ctx.fillRect(obj.x, obj.y, 80, 10);
        if (!obj.opened) {
          ctx.fillStyle = '#581c87';
          ctx.fillRect(obj.x + 16, obj.y + 10, 48, 30);
          ctx.fillStyle = '#c084fc';
          ctx.fillRect(obj.x + 36, obj.y + 20, 8, 8);
        } else {
          // Swirling Starlight Vortex
          const rot = (now / 300) % Math.PI;
          ctx.fillStyle = 'rgba(236, 72, 153, 0.6)';
          ctx.fillRect(obj.x + 16, obj.y + 10, 48, 30);
          ctx.fillStyle = '#f0abfc';
          ctx.fillRect(obj.x + 34 + Math.sin(rot) * 6, obj.y + 20, 12, 12);
        }
      } else {
        // Classic Ancient Stone Arch
        ctx.fillStyle = '#334155';
        ctx.fillRect(obj.x, obj.y, 16, 40);
        ctx.fillRect(obj.x + 64, obj.y, 16, 40);
        ctx.fillStyle = '#334155';
        ctx.fillRect(obj.x, obj.y, 80, 12);
        if (!obj.opened) {
          ctx.fillStyle = '#94a3b8';
          for (let bx = 22; bx <= 56; bx += 10) {
            ctx.fillRect(obj.x + bx, obj.y + 10, 4, 28);
          }
          ctx.fillStyle = '#ef4444';
          ctx.fillRect(obj.x + 34, obj.y + 18, 12, 12);
        } else {
          ctx.fillStyle = 'rgba(250, 204, 21, 0.35)';
          ctx.fillRect(obj.x + 16, obj.y + 12, 48, 28);
        }
      }
    }

    // ----------------------------------------
    // G. SPECIAL QUEST SUB-STATIONS
    // ----------------------------------------
    else if (obj.type === 'sub_station') {
      const subType = obj.subType || 'crate';
      const isAct = !!obj.activated;

      // Subtle base glow ring for unactivated quest markers
      if (!isAct) {
        const pulse = 0.35 + Math.sin(now / 250) * 0.15;
        ctx.strokeStyle = `rgba(250, 204, 21, ${pulse})`;
        ctx.lineWidth = 2;
        ctx.strokeRect(obj.x - 2, obj.y - 2, obj.width + 4, obj.height + 4);
      }

      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.fillRect(obj.x + 2, obj.y + 26, 32, 6);

      if (subType === 'nest') {
        // Wildlife Animal Nest (woven twigs & baby creature)
        ctx.fillStyle = '#78350f';
        ctx.beginPath();
        ctx.ellipse(obj.x + 18, obj.y + 20, 16, 10, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#b45309';
        ctx.beginPath();
        ctx.ellipse(obj.x + 18, obj.y + 19, 13, 7, 0, 0, Math.PI * 2);
        ctx.fill();
        if (isAct) {
          // Happy rescued creature peeking out with green sparkle
          ctx.fillStyle = '#fde68a';
          ctx.fillRect(obj.x + 12, obj.y + 11, 12, 10);
          ctx.fillStyle = '#1e293b';
          ctx.fillRect(obj.x + 14, obj.y + 14, 2, 2);
          ctx.fillRect(obj.x + 20, obj.y + 14, 2, 2);
          // Green health aura
          ctx.fillStyle = 'rgba(74, 222, 128, 0.4)';
          ctx.beginPath();
          ctx.arc(obj.x + 18, obj.y + 14, 14, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Shivering little egg or baby silhouette
          ctx.fillStyle = '#f8fafc';
          ctx.beginPath();
          ctx.ellipse(obj.x + 15, obj.y + 16, 4, 6, 0.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.ellipse(obj.x + 21, obj.y + 17, 3.5, 5, -0.2, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (subType === 'relay') {
        // Cyber Relay Tower with pulsing antenna
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(obj.x + 14, obj.y + 6, 8, 24);
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(obj.x + 10, obj.y + 18, 16, 12);
        ctx.fillStyle = isAct ? '#38bdf8' : '#ef4444';
        ctx.fillRect(obj.x + 17, obj.y + 1, 2, 8);
        ctx.fillRect(obj.x + 15, obj.y + 1, 6, 2);
        if (isAct) {
          const waveRadius = (now / 20) % 20;
          ctx.strokeStyle = `rgba(56, 189, 248, ${1 - waveRadius / 20})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(obj.x + 18, obj.y + 2, waveRadius, 0, Math.PI * 2);
          ctx.stroke();
        }
      } else if (subType === 'mirror') {
        // Cosmic Orbital Photonic Mirror
        ctx.fillStyle = '#334155';
        ctx.fillRect(obj.x + 15, obj.y + 16, 6, 14);
        ctx.fillStyle = isAct ? '#ec4899' : '#94a3b8';
        ctx.beginPath();
        ctx.ellipse(obj.x + 18, obj.y + 12, 14, 8, Math.PI / 6, 0, Math.PI * 2);
        ctx.fill();
        if (isAct) {
          ctx.fillStyle = 'rgba(236, 72, 153, 0.7)';
          ctx.fillRect(obj.x + 17, obj.y - 12, 2, 24);
          ctx.fillStyle = '#fdf2f8';
          ctx.fillRect(obj.x + 17, obj.y - 14, 2, 4);
        }
      } else if (subType === 'anemometer') {
        // Tempest Weather Wind Station
        ctx.fillStyle = '#475569';
        ctx.fillRect(obj.x + 16, obj.y + 8, 4, 22);
        ctx.fillRect(obj.x + 10, obj.y + 26, 16, 4);
        const rot = now / (isAct ? 120 : 350);
        const cx = obj.x + 18;
        const cy = obj.y + 8;
        ctx.strokeStyle = isAct ? '#34d399' : '#f59e0b';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(rot) * 12, cy + Math.sin(rot) * 6);
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(rot + 2.1) * 12, cy + Math.sin(rot + 2.1) * 6);
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(rot + 4.2) * 12, cy + Math.sin(rot + 4.2) * 6);
        ctx.stroke();
      } else if (subType === 'lantern') {
        // Whispering Oasis Zen Lotus Lantern
        ctx.fillStyle = '#cbd5e1';
        ctx.fillRect(obj.x + 12, obj.y + 16, 12, 12);
        ctx.fillStyle = '#f472b6';
        ctx.beginPath();
        ctx.ellipse(obj.x + 18, obj.y + 14, 10, 6, 0, 0, Math.PI * 2);
        ctx.fill();
        if (isAct) {
          ctx.fillStyle = '#fbcfe8';
          ctx.beginPath();
          ctx.arc(obj.x + 18, obj.y + 8, 6, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = 'rgba(236, 72, 153, 0.4)';
          ctx.beginPath();
          ctx.arc(obj.x + 18, obj.y + 8, 12, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (subType === 'fitness_post') {
        // Sports Obstacle / Chin-up Hurdle Post
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(obj.x + 8, obj.y + 8, 4, 22);
        ctx.fillRect(obj.x + 24, obj.y + 8, 4, 22);
        ctx.fillStyle = isAct ? '#facc15' : '#f8fafc';
        ctx.fillRect(obj.x + 8, obj.y + 12, 20, 4);
        if (isAct) {
          ctx.fillStyle = '#facc15';
          ctx.fillRect(obj.x + 15, obj.y + 16, 6, 6);
        }
      } else if (subType === 'watch_beacon') {
        // Action Ridge Tactical Lookout Brazier
        ctx.fillStyle = '#52525b';
        ctx.fillRect(obj.x + 10, obj.y + 16, 16, 14);
        ctx.fillStyle = '#27272a';
        ctx.fillRect(obj.x + 8, obj.y + 12, 20, 6);
        if (isAct) {
          ctx.fillStyle = '#ea580c';
          ctx.beginPath();
          ctx.moveTo(obj.x + 12, obj.y + 12);
          ctx.lineTo(obj.x + 18, obj.y + 2);
          ctx.lineTo(obj.x + 24, obj.y + 12);
          ctx.fill();
          ctx.fillStyle = '#fef08a';
          ctx.beginPath();
          ctx.moveTo(obj.x + 14, obj.y + 12);
          ctx.lineTo(obj.x + 18, obj.y + 6);
          ctx.lineTo(obj.x + 22, obj.y + 12);
          ctx.fill();
        }
      } else {
        // Default Driftwood Cargo Crate
        ctx.fillStyle = '#854d0e';
        ctx.fillRect(obj.x + 6, obj.y + 10, 24, 20);
        ctx.fillStyle = '#ca8a04';
        ctx.fillRect(obj.x + 8, obj.y + 12, 20, 16);
        ctx.fillStyle = isAct ? '#22c55e' : '#475569';
        ctx.fillRect(obj.x + 16, obj.y + 16, 4, 6);
      }

      // Overhead status badge (✓ when completed, ! when pending)
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      if (isAct) {
        ctx.fillStyle = '#22c55e';
        ctx.fillText('✓', obj.x + 18, obj.y - 4);
      } else {
        ctx.fillStyle = '#facc15';
        ctx.fillText('!', obj.x + 18, obj.y - 4);
      }
    }
  }
}

// ==========================================
// 3. PLAYER & PROMPTS & HUD DRAWING
// ==========================================

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
  // Eyes
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

// Ambient Atmospheric Weather / Energy Effects
export function drawAmbientFX(
  ctx: CanvasRenderingContext2D,
  theme: IslandTheme,
  now: number
) {
  const style = theme.environmentStyle;

  if (style === 'tempest') {
    // Pixel Rain Streaks
    ctx.strokeStyle = 'rgba(186, 230, 253, 0.35)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i < 40; i++) {
      const rx = (Math.sin(i * 99 + now * 0.001) * 0.5 + 0.5) * CANVAS_WIDTH;
      const ry = ((i * 37 + now * 0.6) % CANVAS_HEIGHT);
      ctx.moveTo(rx, ry);
      ctx.lineTo(rx - 8, ry + 16);
    }
    ctx.stroke();
  } else if (style === 'cosmic') {
    // Floating Stardust motes
    ctx.fillStyle = 'rgba(240, 171, 252, 0.4)';
    for (let i = 0; i < 25; i++) {
      const rx = (Math.sin(i * 47) * 0.5 + 0.5) * CANVAS_WIDTH;
      const ry = (CANVAS_HEIGHT - ((i * 53 + now * 0.04) % CANVAS_HEIGHT));
      ctx.fillRect(rx, ry, 2, 2);
    }
  } else if (style === 'cyber') {
    // Holographic digital spark motes
    ctx.fillStyle = 'rgba(34, 211, 238, 0.4)';
    for (let i = 0; i < 20; i++) {
      const rx = (Math.cos(i * 31) * 0.5 + 0.5) * CANVAS_WIDTH;
      const ry = (CANVAS_HEIGHT - ((i * 41 + now * 0.06) % CANVAS_HEIGHT));
      ctx.fillRect(rx, ry, 3, 2);
    }
  } else if (style === 'emotions') {
    // Floating Sacred Lotus Petals
    ctx.fillStyle = 'rgba(244, 114, 182, 0.45)';
    for (let i = 0; i < 20; i++) {
      const rx = (Math.sin(i * 61 + now * 0.001) * 0.5 + 0.5) * CANVAS_WIDTH;
      const ry = (CANVAS_HEIGHT - ((i * 43 + now * 0.03) % CANVAS_HEIGHT));
      ctx.fillRect(rx, ry, 3, 3);
    }
  }
}

export function renderGameScene(
  ctx: CanvasRenderingContext2D,
  state: GameEngineState,
  theme: IslandTheme,
  now: number
) {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  ctx.save();

  // Screen shake
  if (state.shakeTime > 0) {
    const sx = (Math.random() - 0.5) * 5;
    const sy = (Math.random() - 0.5) * 5;
    ctx.translate(sx, sy);
  }

  // 1. Draw Biome Map
  drawTilemap(ctx, now, theme, state.activeMap);

  // 2. Draw World Objects (Themed Sprites)
  drawWorldObjects(ctx, state.objects, state.questStage, state.resources, theme, now);

  // 3. Draw Player
  drawPlayer(ctx, state.player);

  // 4. Draw Interaction Prompt
  if (state.nearestObject && !state.overlayOpen) {
    drawPrompt(ctx, state.nearestObject);
  }

  // 5. Ambient Atmospheric FX
  drawAmbientFX(ctx, theme, now);

  // 6. Floating Feedback Texts
  drawFloatingTexts(ctx, state.floatingTexts);

  ctx.restore();
}
