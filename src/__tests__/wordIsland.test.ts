import { describe, it, expect, beforeEach } from 'vitest';
import { ISLAND_THEMES } from '@/utils/wordIslandThemes';
import {
  getObjectsForTheme,
  getMapForTheme,
  MAP_COLS,
  MAP_ROWS,
  TILE_SIZE,
} from '@/utils/wordIslandData';
import { useWordIslandStore } from '@/stores/wordIslandStore';

describe('Word Island Game Engine & Themes', () => {
  describe('Theme Definitions Completeness', () => {
    const themeKeys = [
      'animals',
      'tech',
      'space',
      'weather',
      'sports',
      'action',
      'emotions',
      'default',
    ];

    it.each(themeKeys)('theme "%s" has complete metadata and configurations', (key) => {
      const theme = ISLAND_THEMES[key];
      expect(theme).toBeDefined();
      expect(theme.id).toBe(key);
      expect(theme.name).toBeTruthy();
      expect(theme.realmTitle).toBeTruthy();
      expect(theme.mentorName).toBeTruthy();
      expect(theme.mentorRole).toBeTruthy();
      expect(theme.environmentStyle).toBeTruthy();

      // Resource requirements
      expect(theme.reqPrimary).toBeGreaterThan(0);
      expect(theme.reqSecondary).toBeGreaterThan(0);
      expect(theme.primaryResource).toBeDefined();
      expect(theme.primaryResource.nameVi).toBeTruthy();
      expect(theme.secondaryResource).toBeDefined();
      expect(theme.secondaryResource.nameVi).toBeTruthy();

      // Spawn coordinates
      expect(theme.playerSpawn).toBeDefined();
      expect(theme.playerSpawn.x).toBeGreaterThan(0);
      expect(theme.playerSpawn.y).toBeGreaterThan(0);

      // Special mission & sub-station configurations
      expect(theme.specialMission).toBeDefined();
      expect(theme.specialMission.subStationType).toBeTruthy();
      expect(theme.specialMission.subStationNameVi).toBeTruthy();
      expect(theme.specialMission.targetCount).toBe(2);
      expect(theme.specialMission.missionTitleVi).toBeTruthy();
      expect(theme.specialMission.actionPromptVi).toBeTruthy();
      expect(theme.specialMission.successMsgVi).toBeTruthy();

      // Lore & item names
      expect(theme.toolNameVi).toBeTruthy();
      expect(theme.gateNameVi).toBeTruthy();
      expect(theme.chestNameVi).toBeTruthy();
    });
  });

  describe('World Objects & Realm Layout Generation', () => {
    it('generates full set of 14 interactive world objects for any theme', () => {
      const theme = ISLAND_THEMES.animals;
      const objects = getObjectsForTheme(theme);

      expect(objects.length).toBe(14);

      // 1 Gate, 1 Centerpiece (camp), 1 Mentor NPC, 1 Chest, 2 Sub-stations, 5 Primary, 3 Secondary
      expect(objects.filter((o) => o.type === 'gate')).toHaveLength(1);
      expect(objects.filter((o) => o.type === 'camp')).toHaveLength(1);
      expect(objects.filter((o) => o.type === 'npc')).toHaveLength(1);
      expect(objects.filter((o) => o.type === 'chest')).toHaveLength(1);
      expect(objects.filter((o) => o.type === 'sub_station')).toHaveLength(2);
      expect(objects.filter((o) => o.type === 'tree')).toHaveLength(5);
      expect(objects.filter((o) => o.type === 'rock')).toHaveLength(3);
    });

    it('positions objects at distinct coordinates between different themes', () => {
      const animalsObjects = getObjectsForTheme(ISLAND_THEMES.animals);
      const techObjects = getObjectsForTheme(ISLAND_THEMES.tech);
      const cosmicObjects = getObjectsForTheme(ISLAND_THEMES.space);

      const animalsChest = animalsObjects.find((o) => o.type === 'chest');
      const techChest = techObjects.find((o) => o.type === 'chest');
      const cosmicChest = cosmicObjects.find((o) => o.type === 'chest');

      expect(animalsChest).toBeDefined();
      expect(techChest).toBeDefined();
      expect(cosmicChest).toBeDefined();

      // The chest locations must be distinct across environments
      expect(animalsChest!.x !== techChest!.x || animalsChest!.y !== techChest!.y).toBe(true);
      expect(techChest!.x !== cosmicChest!.x || techChest!.y !== cosmicChest!.y).toBe(true);
    });

    it('sub-stations are equipped with valid vocabulary questions and options', () => {
      const theme = ISLAND_THEMES.weather;
      const objects = getObjectsForTheme(theme);
      const subStations = objects.filter((o) => o.type === 'sub_station');

      expect(subStations).toHaveLength(2);
      for (const sub of subStations) {
        expect(sub.question).toBeDefined();
        expect(sub.question!.title).toBeTruthy();
        expect(sub.question!.question).toBeTruthy();
        expect(sub.question!.options.length).toBeGreaterThanOrEqual(3);

        const correctOptions = sub.question!.options.filter((opt) => opt.isCorrect);
        expect(correctOptions).toHaveLength(1);
        expect(correctOptions[0].explanationVi).toBeTruthy();
      }
    });

    it('all objects are placed within world canvas boundaries', () => {
      const mapWidth = MAP_COLS * TILE_SIZE; // 800
      const mapHeight = MAP_ROWS * TILE_SIZE; // 560

      for (const theme of Object.values(ISLAND_THEMES)) {
        const objects = getObjectsForTheme(theme);
        for (const obj of objects) {
          expect(obj.x).toBeGreaterThanOrEqual(0);
          expect(obj.x + obj.width).toBeLessThanOrEqual(mapWidth);
          expect(obj.y).toBeGreaterThanOrEqual(0);
          expect(obj.y + obj.height).toBeLessThanOrEqual(mapHeight);
        }
      }
    });
  });

  describe('Tile Map Dimensions & Boundaries', () => {
    it('all theme maps conform to 14 rows by 20 columns', () => {
      for (const theme of Object.values(ISLAND_THEMES)) {
        const map = getMapForTheme(theme);
        expect(map.length).toBe(MAP_ROWS);
        for (const row of map) {
          expect(row.length).toBe(MAP_COLS);
        }
      }
    });

    it('player spawn position is placed on walkable ground (tile != 0)', () => {
      for (const theme of Object.values(ISLAND_THEMES)) {
        const map = getMapForTheme(theme);
        const tileCol = Math.floor(theme.playerSpawn.x / TILE_SIZE);
        const tileRow = Math.floor(theme.playerSpawn.y / TILE_SIZE);

        expect(tileRow).toBeGreaterThanOrEqual(0);
        expect(tileRow).toBeLessThan(MAP_ROWS);
        expect(tileCol).toBeGreaterThanOrEqual(0);
        expect(tileCol).toBeLessThan(MAP_COLS);

        const tileType = map[tileRow][tileCol];
        expect(tileType).toBeGreaterThan(0); // Non-zero is walkable
      }
    });
  });

  describe('Word Island Store Progression Mechanics', () => {
    beforeEach(() => {
      useWordIslandStore.getState().resetGame();
    });

    it('initializes with default starting state and empty inventory', () => {
      const state = useWordIslandStore.getState();
      expect(state.questStage).toBe('TALK_TO_NPC');
      expect(state.resources.wood).toBe(0);
      expect(state.resources.stone).toBe(0);
      expect(state.resources.hasAxe).toBe(false);
      expect(state.resources.hasGateKey).toBe(false);
      expect(state.resources.subStationsActivated).toBe(0);
    });

    it('increments primary and secondary resources properly', () => {
      const store = useWordIslandStore.getState();
      store.addWood();
      store.addWood();
      store.addStone();

      const updated = useWordIslandStore.getState();
      expect(updated.resources.wood).toBe(2);
      expect(updated.resources.stone).toBe(1);
    });

    it('tracks sub-station activations', () => {
      const store = useWordIslandStore.getState();
      store.activateSubStation();
      expect(useWordIslandStore.getState().resources.subStationsActivated).toBe(1);

      store.activateSubStation();
      expect(useWordIslandStore.getState().resources.subStationsActivated).toBe(2);
    });

    it('transitions through quest stages correctly', () => {
      const store = useWordIslandStore.getState();

      store.setQuestStage('GATHER_RESOURCES');
      expect(useWordIslandStore.getState().questStage).toBe('GATHER_RESOURCES');

      store.setQuestStage('CRAFT_PUZZLE');
      expect(useWordIslandStore.getState().questStage).toBe('CRAFT_PUZZLE');

      store.setQuestStage('UNLOCK_CHEST');
      expect(useWordIslandStore.getState().questStage).toBe('UNLOCK_CHEST');

      store.setQuestStage('UNLOCK_GATE');
      expect(useWordIslandStore.getState().questStage).toBe('UNLOCK_GATE');

      store.setQuestStage('VICTORY');
      expect(useWordIslandStore.getState().questStage).toBe('VICTORY');
    });
  });
});

