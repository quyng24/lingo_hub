import type { VocabQuestion, WorldObject } from '@/types';

export const TILE_SIZE = 40;
export const MAP_COLS = 20;
export const MAP_ROWS = 14;
export const CANVAS_WIDTH = MAP_COLS * TILE_SIZE; // 800
export const CANVAS_HEIGHT = MAP_ROWS * TILE_SIZE; // 560

// 0 = Water (solid), 1 = Sand, 2 = Grass, 3 = Dirt Path
export const ISLAND_MAP: number[][] = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 1, 1, 1, 1, 1, 3, 3, 1, 1, 1, 1, 1, 1, 0, 0, 0],
  [0, 0, 1, 1, 2, 2, 2, 2, 2, 3, 3, 2, 2, 2, 2, 2, 1, 1, 0, 0],
  [0, 1, 1, 2, 2, 2, 2, 2, 2, 3, 3, 2, 2, 2, 2, 2, 2, 1, 1, 0],
  [0, 1, 2, 2, 2, 2, 2, 2, 2, 3, 3, 2, 2, 2, 2, 2, 2, 2, 1, 0],
  [0, 1, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 1, 0],
  [0, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 1, 0],
  [0, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 1, 0],
  [0, 1, 2, 2, 2, 2, 2, 2, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 1, 0],
  [0, 1, 2, 2, 2, 2, 2, 2, 2, 3, 3, 2, 2, 2, 2, 2, 2, 2, 1, 0],
  [0, 1, 1, 2, 2, 2, 2, 2, 2, 3, 3, 2, 2, 2, 2, 2, 2, 1, 1, 0],
  [0, 0, 1, 1, 2, 2, 2, 2, 1, 1, 1, 1, 2, 2, 2, 2, 1, 1, 0, 0],
  [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

export const INITIAL_OBJECTS: WorldObject[] = [
  // Escape Gate (North)
  { id: 'gate-1', type: 'gate', x: 9 * TILE_SIZE, y: 1 * TILE_SIZE, width: 80, height: 40, solid: true, label: 'Locked Gate' },
  // Camp & NPC (Center)
  { id: 'camp-1', type: 'camp', x: 8.2 * TILE_SIZE, y: 6.2 * TILE_SIZE, width: 36, height: 36, solid: true, label: 'Campfire' },
  { id: 'npc-1', type: 'npc', x: 10.2 * TILE_SIZE, y: 6 * TILE_SIZE, width: 34, height: 38, solid: true, label: 'Captain Minh' },
  // Treasure Chest (East)
  { id: 'chest-1', type: 'chest', x: 15 * TILE_SIZE, y: 6.2 * TILE_SIZE, width: 36, height: 32, solid: true, label: 'Supply Chest', opened: false },
  // Trees (Wood)
  { id: 'tree-1', type: 'tree', x: 3.5 * TILE_SIZE, y: 3 * TILE_SIZE, width: 36, height: 38, solid: true, label: 'Pine Tree (Wood)' },
  { id: 'tree-2', type: 'tree', x: 5.5 * TILE_SIZE, y: 4.5 * TILE_SIZE, width: 36, height: 38, solid: true, label: 'Pine Tree (Wood)' },
  { id: 'tree-3', type: 'tree', x: 3.2 * TILE_SIZE, y: 7.5 * TILE_SIZE, width: 36, height: 38, solid: true, label: 'Pine Tree (Wood)' },
  { id: 'tree-4', type: 'tree', x: 5.2 * TILE_SIZE, y: 9.2 * TILE_SIZE, width: 36, height: 38, solid: true, label: 'Pine Tree (Wood)' },
  { id: 'tree-5', type: 'tree', x: 14.2 * TILE_SIZE, y: 3.2 * TILE_SIZE, width: 36, height: 38, solid: true, label: 'Pine Tree (Wood)' },
  // Rocks (Stone)
  { id: 'rock-1', type: 'rock', x: 13.5 * TILE_SIZE, y: 8.8 * TILE_SIZE, width: 34, height: 30, solid: true, label: 'Granite Rock (Stone)' },
  { id: 'rock-2', type: 'rock', x: 15.8 * TILE_SIZE, y: 9.5 * TILE_SIZE, width: 34, height: 30, solid: true, label: 'Granite Rock (Stone)' },
  { id: 'rock-3', type: 'rock', x: 6.2 * TILE_SIZE, y: 2.5 * TILE_SIZE, width: 34, height: 30, solid: true, label: 'Granite Rock (Stone)' },
];

export const VOCAB_PUZZLES: Record<string, VocabQuestion[]> = {
  craft_axe: [
    {
      id: 'q1',
      title: 'Shelter & Tool Crafting (1/2)',
      contextEn: 'Captain Minh inspects your 3 Wood and 2 Stone.',
      contextVi: 'Thuyền trưởng Minh kiểm tra 3 Gỗ và 2 Đá của bạn.',
      question: 'We use ___ from trees and ___ from rocks to repair my broken camp.',
      hintVi: 'Gợi ý: "wood" = gỗ (từ cây), "stone" = đá (từ tảng đá).',
      options: [
        {
          id: 'a',
          text: 'wood / stone',
          isCorrect: true,
          explanationEn: 'Correct! Wood comes from trees and stone comes from rocks.',
          explanationVi: 'Chính xác! Wood là gỗ và stone là đá.',
        },
        {
          id: 'b',
          text: 'water / food',
          isCorrect: false,
          explanationEn: 'Not quite. Water and food are for drinking and eating, not building.',
          explanationVi: 'Chưa đúng. Water (nước) và food (thức ăn) dùng để ăn uống.',
        },
        {
          id: 'c',
          text: 'shelter / axe',
          isCorrect: false,
          explanationEn: 'Try again! Those are the finished structures and tools, not raw materials.',
          explanationVi: 'Thử lại nhé! Shelter (nơi trú ẩn) và axe (rìu) không phải nguyên liệu thô.',
        },
      ],
    },
    {
      id: 'q2',
      title: 'Shelter & Tool Crafting (2/2)',
      contextEn: 'Now Captain Minh helps you craft a tool to chop thick vines on the Supply Chest.',
      contextVi: 'Giờ Thuyền trưởng Minh giúp bạn chế tạo công cụ để chặt dây leo quanh Rương Tiếp Tế.',
      question: 'Which sharp tool do you use to chop wood and cut thick vines?',
      hintVi: 'Gợi ý: Công cụ sắc bén dùng để đốn củi hoặc chặt cây là "axe" (cái rìu).',
      options: [
        {
          id: 'a',
          text: 'A shelter',
          isCorrect: false,
          explanationEn: 'A shelter is a safe place to sleep, not a cutting tool.',
          explanationVi: 'Shelter là nơi trú ẩn để ngủ, không phải công cụ chặt cây.',
        },
        {
          id: 'b',
          text: 'An axe',
          isCorrect: true,
          explanationEn: 'Awesome! You crafted a Stone Axe to break the vines on the chest!',
          explanationVi: 'Tuyệt vời! Bạn đã chế tạo được Rìu Đá (Axe) để mở rương!',
        },
        {
          id: 'c',
          text: 'A stone',
          isCorrect: false,
          explanationEn: 'A raw stone alone cannot cut thick vines efficiently.',
          explanationVi: 'Một hòn đá thô không thể chặt đứt dây leo dày.',
        },
      ],
    },
  ],
  open_chest: [
    {
      id: 'q3',
      title: 'Supply Chest Lock',
      contextEn: 'You cut the vines with your axe! The chest has a word lock for survival supplies.',
      contextVi: 'Bạn đã chặt đứt dây leo bằng rìu! Chiếc rương có khóa từ vựng về nhu yếu phẩm sinh tồn.',
      question: 'To survive a long journey across the sea, you need fresh ___ to drink and ___ to eat.',
      hintVi: 'Gợi ý: Uống (drink) cần nước ("water"), ăn (eat) cần thức ăn ("food").',
      options: [
        {
          id: 'a',
          text: 'wood / axe',
          isCorrect: false,
          explanationEn: 'You cannot drink wood or eat an axe!',
          explanationVi: 'Bạn không thể uống gỗ hay ăn rìu được!',
        },
        {
          id: 'b',
          text: 'water / food',
          isCorrect: true,
          explanationEn: 'Correct! Inside the chest you found fresh water, food, and the Ancient Gate Key!',
          explanationVi: 'Chính xác! Bạn tìm thấy nước ngọt, thức ăn và Chìa Khóa Cổng Cổ Đại!',
        },
        {
          id: 'c',
          text: 'stone / shelter',
          isCorrect: false,
          explanationEn: 'Stone and shelter cannot be consumed as supplies.',
          explanationVi: 'Đá và nơi trú ẩn không phải đồ ăn thức uống.',
        },
      ],
    },
  ],
  unlock_gate: [
    {
      id: 'q4',
      title: 'Ancient Escape Gate',
      contextEn: 'You insert the Gate Key. One final inscription glows on the stone arch.',
      contextVi: 'Bạn tra Chìa Khóa Cổng vào ổ. Một dòng chữ cuối cùng phát sáng trên vòm đá.',
      question: 'What is the English word for a safe place that protects you from rain, wind, and danger?',
      hintVi: 'Gợi ý: Nơi an toàn che mưa nắng và nguy hiểm được gọi là "shelter" (nơi trú ẩn).',
      options: [
        {
          id: 'a',
          text: 'Shelter',
          isCorrect: true,
          explanationEn: 'Brilliant! The heavy stone gate rumbles open. You survived Word Island!',
          explanationVi: 'Xuất sắc! Cánh cổng đá mở ra. Bạn đã chinh phục Đảo Từ Vựng!',
        },
        {
          id: 'b',
          text: 'Stone',
          isCorrect: false,
          explanationEn: 'Stone is a material, not a safe place to stay.',
          explanationVi: 'Stone (đá) là vật liệu, không phải nơi trú ẩn.',
        },
        {
          id: 'c',
          text: 'Axe',
          isCorrect: false,
          explanationEn: 'An axe is a tool for chopping wood.',
          explanationVi: 'Axe (rìu) là công cụ dùng để chặt gỗ.',
        },
      ],
    },
  ],
};

