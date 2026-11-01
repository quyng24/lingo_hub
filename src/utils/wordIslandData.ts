import type { DynamicQuest, IslandTheme, VocabQuestion, WorldObject } from '@/types';
import { ISLAND_THEMES } from './wordIslandThemes';

export const TILE_SIZE = 40;
export const MAP_COLS = 20;
export const MAP_ROWS = 14;
export const CANVAS_WIDTH = MAP_COLS * TILE_SIZE; // 800
export const CANVAS_HEIGHT = MAP_ROWS * TILE_SIZE; // 560

// Tile Types:
// 0 = Water / Liquid / Void (solid)
// 1 = Shore / Sand / Outer Rim
// 2 = Main Biome Floor (Grass / Circuit Floor / Cosmic Regolith / Arena Turf)
// 3 = Walkway / Path (Dirt Path / Fiber Optic Line / Crystal Bridge / Track)

// 1. Tropical / Shipwreck / Animals Map
export const ISLAND_MAP_TROPICAL: number[][] = [
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

// 2. Cyber Atoll Map (Grid Platform & Coolant Trenches)
export const ISLAND_MAP_CYBER: number[][] = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 1, 1, 1, 1, 1, 1, 3, 3, 1, 1, 1, 1, 1, 1, 1, 0, 0],
  [0, 1, 1, 2, 2, 2, 2, 0, 0, 3, 3, 0, 0, 2, 2, 2, 2, 1, 1, 0],
  [0, 1, 2, 2, 2, 2, 2, 0, 0, 3, 3, 0, 0, 2, 2, 2, 2, 2, 1, 0],
  [0, 1, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 1, 0],
  [0, 1, 2, 2, 3, 2, 2, 2, 3, 3, 3, 3, 2, 2, 2, 3, 2, 2, 1, 0],
  [0, 1, 0, 0, 3, 2, 2, 3, 3, 3, 3, 3, 3, 2, 2, 3, 0, 0, 1, 0],
  [0, 1, 0, 0, 3, 2, 2, 3, 3, 3, 3, 3, 3, 2, 2, 3, 0, 0, 1, 0],
  [0, 1, 2, 2, 3, 2, 2, 2, 3, 3, 3, 3, 2, 2, 2, 3, 2, 2, 1, 0],
  [0, 1, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 1, 0],
  [0, 1, 2, 2, 2, 2, 2, 0, 0, 3, 3, 0, 0, 2, 2, 2, 2, 2, 1, 0],
  [0, 1, 1, 2, 2, 2, 2, 0, 0, 3, 3, 0, 0, 2, 2, 2, 2, 1, 1, 0],
  [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

// 3. Astral Reef / Space Map (Floating Asteroid Islands & Stardust Chasms)
export const ISLAND_MAP_COSMIC: number[][] = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 1, 1, 1, 1, 3, 3, 1, 1, 1, 1, 1, 0, 0, 0, 0],
  [0, 0, 1, 1, 2, 2, 2, 2, 1, 3, 3, 1, 2, 2, 2, 2, 1, 1, 0, 0],
  [0, 1, 2, 2, 2, 2, 2, 2, 1, 3, 3, 1, 2, 2, 2, 2, 2, 2, 1, 0],
  [0, 1, 2, 2, 2, 0, 0, 1, 1, 3, 3, 1, 1, 0, 0, 2, 2, 2, 1, 0],
  [0, 1, 1, 0, 0, 0, 0, 1, 3, 3, 3, 3, 1, 0, 0, 0, 0, 1, 1, 0],
  [0, 0, 0, 0, 0, 1, 1, 3, 3, 3, 3, 3, 3, 1, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 1, 3, 3, 3, 3, 3, 3, 1, 1, 0, 0, 0, 0, 0],
  [0, 1, 1, 0, 0, 0, 0, 1, 3, 3, 3, 3, 1, 0, 0, 0, 0, 1, 1, 0],
  [0, 1, 2, 2, 2, 0, 0, 1, 1, 3, 3, 1, 1, 0, 0, 2, 2, 2, 1, 0],
  [0, 1, 2, 2, 2, 2, 2, 2, 1, 3, 3, 1, 2, 2, 2, 2, 2, 2, 1, 0],
  [0, 0, 1, 1, 2, 2, 2, 2, 1, 3, 3, 1, 2, 2, 2, 2, 1, 1, 0, 0],
  [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

// 4. Tempest Haven Map (Rocky Storm Reefs)
export const ISLAND_MAP_TEMPEST: number[][] = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 1, 1, 1, 1, 1, 3, 3, 1, 1, 1, 1, 1, 0, 0, 0, 0],
  [0, 0, 1, 2, 2, 2, 2, 2, 1, 3, 3, 1, 2, 2, 2, 2, 1, 0, 0, 0],
  [0, 1, 2, 2, 2, 1, 1, 2, 2, 3, 3, 2, 2, 1, 1, 2, 2, 1, 0, 0],
  [0, 1, 2, 2, 1, 0, 0, 1, 2, 3, 3, 2, 1, 0, 0, 1, 2, 2, 1, 0],
  [0, 1, 2, 2, 1, 0, 0, 1, 3, 3, 3, 3, 1, 0, 0, 1, 2, 2, 1, 0],
  [0, 1, 2, 2, 2, 1, 1, 3, 3, 3, 3, 3, 3, 1, 1, 2, 2, 2, 1, 0],
  [0, 1, 2, 2, 2, 1, 1, 3, 3, 3, 3, 3, 3, 1, 1, 2, 2, 2, 1, 0],
  [0, 1, 2, 2, 1, 0, 0, 1, 3, 3, 3, 3, 1, 0, 0, 1, 2, 2, 1, 0],
  [0, 1, 2, 2, 1, 0, 0, 1, 2, 3, 3, 2, 1, 0, 0, 1, 2, 2, 1, 0],
  [0, 1, 2, 2, 2, 1, 1, 2, 2, 3, 3, 2, 2, 1, 1, 2, 2, 1, 0, 0],
  [0, 0, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 2, 2, 2, 2, 1, 0, 0, 0],
  [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

// 5. Whispering Oasis Map (Desert Dunes with Central Sacred Pool)
export const ISLAND_MAP_OASIS: number[][] = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 1, 1, 1, 1, 1, 1, 3, 3, 1, 1, 1, 1, 1, 1, 1, 0, 0],
  [0, 1, 1, 1, 2, 2, 2, 2, 1, 3, 3, 1, 2, 2, 2, 2, 1, 1, 1, 0],
  [0, 1, 1, 2, 2, 2, 2, 2, 2, 3, 3, 2, 2, 2, 2, 2, 2, 1, 1, 0],
  [0, 1, 2, 2, 2, 1, 1, 1, 1, 3, 3, 1, 1, 1, 1, 2, 2, 2, 1, 0],
  [0, 1, 2, 2, 1, 1, 0, 0, 3, 3, 3, 3, 0, 0, 1, 1, 2, 2, 1, 0],
  [0, 1, 2, 2, 1, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 1, 2, 2, 1, 0],
  [0, 1, 2, 2, 1, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 1, 2, 2, 1, 0],
  [0, 1, 2, 2, 1, 1, 0, 0, 3, 3, 3, 3, 0, 0, 1, 1, 2, 2, 1, 0],
  [0, 1, 2, 2, 2, 1, 1, 1, 1, 3, 3, 1, 1, 1, 1, 2, 2, 2, 1, 0],
  [0, 1, 1, 2, 2, 2, 2, 2, 2, 3, 3, 2, 2, 2, 2, 2, 2, 1, 1, 0],
  [0, 1, 1, 1, 2, 2, 2, 2, 1, 3, 3, 1, 2, 2, 2, 2, 1, 1, 1, 0],
  [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

// Fallback legacy constant for compatibility
export const ISLAND_MAP = ISLAND_MAP_TROPICAL;

export function getMapForTheme(theme: IslandTheme): number[][] {
  switch (theme.environmentStyle) {
    case 'cyber':
      return ISLAND_MAP_CYBER;
    case 'cosmic':
      return ISLAND_MAP_COSMIC;
    case 'tempest':
      return ISLAND_MAP_TEMPEST;
    case 'emotions':
      return ISLAND_MAP_OASIS;
    case 'sports':
    case 'action':
    case 'tropical':
    case 'shipwreck':
    default:
      return ISLAND_MAP_TROPICAL;
  }
}

// Realm-specific object positioning configurations and quest sub-stations
interface RealmLayoutConfig {
  gate: { x: number; y: number };
  camp: { x: number; y: number };
  npc: { x: number; y: number };
  chest: { x: number; y: number };
  subStations: Array<{
    x: number;
    y: number;
    labelVi: string;
    question: VocabQuestion;
  }>;
  primaryNodes: Array<{ x: number; y: number }>;
  secondaryNodes: Array<{ x: number; y: number }>;
}

const REALM_LAYOUTS: Record<string, RealmLayoutConfig> = {
  animals: {
    gate: { x: 9 * TILE_SIZE, y: 1 * TILE_SIZE },
    camp: { x: 8.2 * TILE_SIZE, y: 6.2 * TILE_SIZE },
    npc: { x: 10.2 * TILE_SIZE, y: 6 * TILE_SIZE },
    chest: { x: 15 * TILE_SIZE, y: 4.2 * TILE_SIZE },
    subStations: [
      {
        x: 4 * TILE_SIZE,
        y: 4.5 * TILE_SIZE,
        labelVi: 'Tổ Muông Thú Non (Phía Tây)',
        question: {
          id: 'quest_sub_an_1',
          title: 'Cứu Hộ: Tổ Muông Thú Non',
          contextEn: 'You spot a vulnerable young creature shivering inside a storm-damaged nest.',
          contextVi: 'Bạn phát hiện một chú chim non đang run rẩy trong tổ bị mưa bão làm tốc mái.',
          question: 'Từ tiếng Anh nào dùng để chỉ "tổ chim" nơi muông thú trú ẩn?',
          hintVi: 'Bắt đầu bằng chữ "N", có 4 chữ cái.',
          options: [
            {
              id: 'opt_1',
              text: 'Nest',
              isCorrect: true,
              explanationEn: 'Nest is a structure built by birds to hold their eggs and young.',
              explanationVi: 'Nest nghĩa là tổ chim, nơi ấp trứng và nuôi con non.',
            },
            {
              id: 'opt_2',
              text: 'Net',
              isCorrect: false,
              explanationEn: 'Net means a meshed fabric for catching fish or animals.',
              explanationVi: 'Net nghĩa là tấm lưới đánh bắt.',
            },
            {
              id: 'opt_3',
              text: 'Nut',
              isCorrect: false,
              explanationEn: 'Nut means a hard-shelled fruit or seed.',
              explanationVi: 'Nut nghĩa là hạt cứng.',
            },
          ],
        },
      },
      {
        x: 15.5 * TILE_SIZE,
        y: 8.5 * TILE_SIZE,
        labelVi: 'Tổ Thú Rừng Lạc (Phía Đông)',
        question: {
          id: 'quest_sub_an_2',
          title: 'Cứu Hộ: Động Vật Hoang Dã',
          contextEn: 'A baby deer is trapped in thorny bushes and needs gentle care.',
          contextVi: 'Một chú hươu con bị kẹt trong bụi gai rậm và cần được kiểm tra vết thương.',
          question: 'Từ tiếng Anh nào mang nghĩa "hoang dã / tự nhiên" (không phải nuôi nhốt)?',
          hintVi: 'Từ trái nghĩa với "domestic" (thuần hóa), bắt đầu bằng "W".',
          options: [
            {
              id: 'opt_1',
              text: 'Wild',
              isCorrect: true,
              explanationEn: 'Wild means living in a state of nature; not domesticated.',
              explanationVi: 'Wild nghĩa là hoang dã, tự nhiên.',
            },
            {
              id: 'opt_2',
              text: 'Wide',
              isCorrect: false,
              explanationEn: 'Wide means broad across.',
              explanationVi: 'Wide nghĩa là rộng lớn.',
            },
            {
              id: 'opt_3',
              text: 'Wind',
              isCorrect: false,
              explanationEn: 'Wind means the natural movement of air.',
              explanationVi: 'Wind nghĩa là cơn gió.',
            },
          ],
        },
      },
    ],
    primaryNodes: [
      { x: 3.5 * TILE_SIZE, y: 2.5 * TILE_SIZE },
      { x: 5.5 * TILE_SIZE, y: 3.2 * TILE_SIZE },
      { x: 3.2 * TILE_SIZE, y: 8.2 * TILE_SIZE },
      { x: 5.2 * TILE_SIZE, y: 9.5 * TILE_SIZE },
      { x: 14.5 * TILE_SIZE, y: 2.8 * TILE_SIZE },
    ],
    secondaryNodes: [
      { x: 13.2 * TILE_SIZE, y: 9.5 * TILE_SIZE },
      { x: 16 * TILE_SIZE, y: 9.8 * TILE_SIZE },
      { x: 6.8 * TILE_SIZE, y: 2.2 * TILE_SIZE },
    ],
  },
  tech: {
    gate: { x: 9 * TILE_SIZE, y: 1 * TILE_SIZE },
    camp: { x: 9.2 * TILE_SIZE, y: 6.2 * TILE_SIZE },
    npc: { x: 10.5 * TILE_SIZE, y: 6.2 * TILE_SIZE },
    chest: { x: 4.5 * TILE_SIZE, y: 9.2 * TILE_SIZE },
    subStations: [
      {
        x: 3.5 * TILE_SIZE,
        y: 4.5 * TILE_SIZE,
        labelVi: 'Trạm Relay Alpha (West)',
        question: {
          id: 'quest_sub_tech_1',
          title: 'Hệ Thống: Kết Nối Mạng Mở Rộng',
          contextEn: 'The optical fiber terminal needs configuration to route island data packets.',
          contextVi: 'Đầu cuối cáp quang cần được cấu hình để định tuyến các gói tin liên lạc trên đảo.',
          question: 'Từ tiếng Anh nào chỉ "mạng lưới / hệ thống mạng liên kết máy tính"?',
          hintVi: 'Bắt đầu bằng chữ "N", ghép giữa Net và Work.',
          options: [
            {
              id: 'opt_1',
              text: 'Network',
              isCorrect: true,
              explanationEn: 'A network connects computers and devices to share resources.',
              explanationVi: 'Network nghĩa là mạng lưới kết nối máy tính.',
            },
            {
              id: 'opt_2',
              text: 'Notebook',
              isCorrect: false,
              explanationEn: 'A notebook is a book for writing notes.',
              explanationVi: 'Notebook là sổ ghi chép.',
            },
            {
              id: 'opt_3',
              text: 'Notice',
              isCorrect: false,
              explanationEn: 'Notice means an announcement or observation.',
              explanationVi: 'Notice nghĩa là thông báo.',
            },
          ],
        },
      },
      {
        x: 15.5 * TILE_SIZE,
        y: 8.5 * TILE_SIZE,
        labelVi: 'Trạm Relay Beta (East)',
        question: {
          id: 'quest_sub_tech_2',
          title: 'Hệ Thống: Bộ Xử Lý Dữ Liệu',
          contextEn: 'The auxiliary relay terminal requires an instruction to reboot its core processor.',
          contextVi: 'Trạm relay phụ cần một lệnh để khởi động lại bộ xử lý trung tâm.',
          question: 'Thuật ngữ nào chỉ "khởi động lại máy tính / hệ thống"?',
          hintVi: 'Tiền tố "Re-" kết hợp với "Boot".',
          options: [
            {
              id: 'opt_1',
              text: 'Reboot',
              isCorrect: true,
              explanationEn: 'Reboot means to restart a computer system and reload its OS.',
              explanationVi: 'Reboot nghĩa là khởi động lại hệ thống.',
            },
            {
              id: 'opt_2',
              text: 'Robot',
              isCorrect: false,
              explanationEn: 'Robot is an automated mechanical device.',
              explanationVi: 'Robot là người máy tự động.',
            },
            {
              id: 'opt_3',
              text: 'Remote',
              isCorrect: false,
              explanationEn: 'Remote means far away or distant.',
              explanationVi: 'Remote nghĩa là từ xa.',
            },
          ],
        },
      },
    ],
    primaryNodes: [
      { x: 3.2 * TILE_SIZE, y: 2.5 * TILE_SIZE },
      { x: 5.5 * TILE_SIZE, y: 2.5 * TILE_SIZE },
      { x: 14.5 * TILE_SIZE, y: 2.5 * TILE_SIZE },
      { x: 15.8 * TILE_SIZE, y: 4.5 * TILE_SIZE },
      { x: 5.5 * TILE_SIZE, y: 7.5 * TILE_SIZE },
    ],
    secondaryNodes: [
      { x: 14.2 * TILE_SIZE, y: 9.2 * TILE_SIZE },
      { x: 16 * TILE_SIZE, y: 10.2 * TILE_SIZE },
      { x: 3.5 * TILE_SIZE, y: 9.2 * TILE_SIZE },
    ],
  },
  space: {
    gate: { x: 9 * TILE_SIZE, y: 1.2 * TILE_SIZE },
    camp: { x: 9.2 * TILE_SIZE, y: 6.5 * TILE_SIZE },
    npc: { x: 10.5 * TILE_SIZE, y: 6.5 * TILE_SIZE },
    chest: { x: 14.5 * TILE_SIZE, y: 10 * TILE_SIZE },
    subStations: [
      {
        x: 4 * TILE_SIZE,
        y: 3 * TILE_SIZE,
        labelVi: 'Gương Phản Xạ Alpha (West)',
        question: {
          id: 'quest_sub_space_1',
          title: 'Thiên Văn: Kính Thiên Văn Quang Học',
          contextEn: 'The primary optical collector needs alignment to gaze into the cosmic void.',
          contextVi: 'Gương thu thập photon cần căn góc chính xác để quan sát các thiên thể xa xôi.',
          question: 'Thiết bị quang học nào dùng để quan sát các ngôi sao và hành tinh từ xa?',
          hintVi: 'Từ tiếng Anh bắt đầu bằng Tele-, kết thúc bằng -scope.',
          options: [
            {
              id: 'opt_1',
              text: 'Telescope',
              isCorrect: true,
              explanationEn: 'A telescope is an optical instrument for viewing distant stars.',
              explanationVi: 'Telescope nghĩa là kính thiên văn.',
            },
            {
              id: 'opt_2',
              text: 'Microscope',
              isCorrect: false,
              explanationEn: 'A microscope is used to view tiny microscopic objects.',
              explanationVi: 'Microscope là kính hiển vi.',
            },
            {
              id: 'opt_3',
              text: 'Periscope',
              isCorrect: false,
              explanationEn: 'A periscope is used in submarines to look above water.',
              explanationVi: 'Periscope là kính tiềm vọng.',
            },
          ],
        },
      },
      {
        x: 15 * TILE_SIZE,
        y: 3 * TILE_SIZE,
        labelVi: 'Gương Phản Xạ Beta (East)',
        question: {
          id: 'quest_sub_space_2',
          title: 'Thiên Văn: Quỹ Đạo Chuyển Động',
          contextEn: 'We must calculate the path of the satellite circling our astral station.',
          contextVi: 'Cần tính toán đường đi hình elip của vệ tinh bay quanh trạm không gian.',
          question: 'Từ tiếng Anh nào dùng để chỉ "quỹ đạo quay quanh một thiên thể"?',
          hintVi: 'Có 5 chữ cái, bắt đầu bằng chữ "O" (O-R-B-I-T).',
          options: [
            {
              id: 'opt_1',
              text: 'Orbit',
              isCorrect: true,
              explanationEn: 'Orbit is the curved path of an object around a star or planet.',
              explanationVi: 'Orbit nghĩa là quỹ đạo chuyển động.',
            },
            {
              id: 'opt_2',
              text: 'Order',
              isCorrect: false,
              explanationEn: 'Order means arrangement or command.',
              explanationVi: 'Order nghĩa là trật tự hoặc mệnh lệnh.',
            },
            {
              id: 'opt_3',
              text: 'Origin',
              isCorrect: false,
              explanationEn: 'Origin means source or starting point.',
              explanationVi: 'Origin nghĩa là khởi nguồn.',
            },
          ],
        },
      },
    ],
    primaryNodes: [
      { x: 3.5 * TILE_SIZE, y: 2.5 * TILE_SIZE },
      { x: 5.5 * TILE_SIZE, y: 3.5 * TILE_SIZE },
      { x: 13.8 * TILE_SIZE, y: 2.5 * TILE_SIZE },
      { x: 4.2 * TILE_SIZE, y: 9.8 * TILE_SIZE },
      { x: 15.5 * TILE_SIZE, y: 10.2 * TILE_SIZE },
    ],
    secondaryNodes: [
      { x: 3.2 * TILE_SIZE, y: 10.2 * TILE_SIZE },
      { x: 13.5 * TILE_SIZE, y: 9.5 * TILE_SIZE },
      { x: 15.2 * TILE_SIZE, y: 4.2 * TILE_SIZE },
    ],
  },
  weather: {
    gate: { x: 9 * TILE_SIZE, y: 1.2 * TILE_SIZE },
    camp: { x: 9.2 * TILE_SIZE, y: 6.2 * TILE_SIZE },
    npc: { x: 10.5 * TILE_SIZE, y: 6.2 * TILE_SIZE },
    chest: { x: 15.5 * TILE_SIZE, y: 3.5 * TILE_SIZE },
    subStations: [
      {
        x: 4.5 * TILE_SIZE,
        y: 3.5 * TILE_SIZE,
        labelVi: 'Cảm Biến Khí Áp Tây',
        question: {
          id: 'quest_sub_wea_1',
          title: 'Khí Tượng: Áp Suất Khí Quyển',
          contextEn: 'Sudden pressure drop indicates an impending supercell hurricane.',
          contextVi: 'Sự sụt giảm áp suất đột ngột báo hiệu một siêu bão xoáy sắp ập tới.',
          question: 'Từ tiếng Anh nào mang nghĩa "cơn bão lớn / giông tố dữ dội"?',
          hintVi: 'Bắt đầu bằng chữ "S", có 5 chữ cái (S-T-O-R-M).',
          options: [
            {
              id: 'opt_1',
              text: 'Storm',
              isCorrect: true,
              explanationEn: 'Storm is a violent disturbance of the atmosphere with strong winds and rain.',
              explanationVi: 'Storm nghĩa là cơn bão, giông bão.',
            },
            {
              id: 'opt_2',
              text: 'Steam',
              isCorrect: false,
              explanationEn: 'Steam is vaporized water.',
              explanationVi: 'Steam nghĩa là hơi nước.',
            },
            {
              id: 'opt_3',
              text: 'Stone',
              isCorrect: false,
              explanationEn: 'Stone means rock.',
              explanationVi: 'Stone nghĩa là hòn đá.',
            },
          ],
        },
      },
      {
        x: 14.5 * TILE_SIZE,
        y: 8.5 * TILE_SIZE,
        labelVi: 'Cảm Biến Gió Bão Đông',
        question: {
          id: 'quest_sub_wea_2',
          title: 'Khí Tượng: Đo Lường Vận Tốc Gió',
          contextEn: 'The spinning cups measure the gale force speed buffeting our seawall.',
          contextVi: 'Các cánh quạt quay tít đo lường vận tốc gió giật quét qua bờ kè.',
          question: 'Từ tiếng Anh nào dùng để chỉ "luồng gió / gió thổi"?',
          hintVi: 'Có 4 chữ cái, bắt đầu bằng chữ "W" (W-I-N-D).',
          options: [
            {
              id: 'opt_1',
              text: 'Wind',
              isCorrect: true,
              explanationEn: 'Wind is the natural movement of the air.',
              explanationVi: 'Wind nghĩa là cơn gió, luồng gió.',
            },
            {
              id: 'opt_2',
              text: 'Wave',
              isCorrect: false,
              explanationEn: 'Wave is a moving ridge of water.',
              explanationVi: 'Wave nghĩa là ngọn sóng biển.',
            },
            {
              id: 'opt_3',
              text: 'Warm',
              isCorrect: false,
              explanationEn: 'Warm means having moderate heat.',
              explanationVi: 'Warm nghĩa là ấm áp.',
            },
          ],
        },
      },
    ],
    primaryNodes: [
      { x: 3.5 * TILE_SIZE, y: 2.5 * TILE_SIZE },
      { x: 4.8 * TILE_SIZE, y: 6.5 * TILE_SIZE },
      { x: 15.2 * TILE_SIZE, y: 6.5 * TILE_SIZE },
      { x: 3.5 * TILE_SIZE, y: 10.2 * TILE_SIZE },
      { x: 15.5 * TILE_SIZE, y: 10.2 * TILE_SIZE },
    ],
    secondaryNodes: [
      { x: 6.5 * TILE_SIZE, y: 2.5 * TILE_SIZE },
      { x: 14.2 * TILE_SIZE, y: 2.5 * TILE_SIZE },
      { x: 6.5 * TILE_SIZE, y: 10.2 * TILE_SIZE },
    ],
  },
  emotions: {
    gate: { x: 9 * TILE_SIZE, y: 1.2 * TILE_SIZE },
    camp: { x: 9.2 * TILE_SIZE, y: 5.5 * TILE_SIZE },
    npc: { x: 9.2 * TILE_SIZE, y: 7.5 * TILE_SIZE },
    chest: { x: 15.5 * TILE_SIZE, y: 3.2 * TILE_SIZE },
    subStations: [
      {
        x: 4 * TILE_SIZE,
        y: 6.5 * TILE_SIZE,
        labelVi: 'Đèn Sen An Lạc (Tây)',
        question: {
          id: 'quest_sub_emo_1',
          title: 'Tâm Thức: Sự Bình Yên Tĩnh Lặng',
          contextEn: 'Lighting this lotus petal requires radiating calm thoughts across the sacred pool.',
          contextVi: 'Để thắp sáng đài sen, cần tỏa ra năng lượng bình an và thanh thản khắp mặt hồ thiêng.',
          question: 'Từ tiếng Anh nào mang nghĩa "sự bình an / hòa bình"?',
          hintVi: 'Bắt đầu bằng chữ "P", có 5 chữ cái (P-E-A-C-E).',
          options: [
            {
              id: 'opt_1',
              text: 'Peace',
              isCorrect: true,
              explanationEn: 'Peace means freedom from disturbance; deep tranquility.',
              explanationVi: 'Peace nghĩa là sự bình an, hòa bình.',
            },
            {
              id: 'opt_2',
              text: 'Piece',
              isCorrect: false,
              explanationEn: 'Piece means a portion of something.',
              explanationVi: 'Piece nghĩa là một phần, mẩu nhỏ.',
            },
            {
              id: 'opt_3',
              text: 'Price',
              isCorrect: false,
              explanationEn: 'Price means monetary value.',
              explanationVi: 'Price nghĩa là giá cả.',
            },
          ],
        },
      },
      {
        x: 15 * TILE_SIZE,
        y: 6.5 * TILE_SIZE,
        labelVi: 'Đèn Sen Thấu Cảm (Đông)',
        question: {
          id: 'quest_sub_emo_2',
          title: 'Tâm Thức: Lòng Trắc Ẩn & Thấu Hiểu',
          contextEn: 'Understanding the feelings of others clears the mist obscuring our hearts.',
          contextVi: 'Thấu hiểu cảm xúc của người khác giúp xua tan màn sương che mờ trái tim.',
          question: 'Từ tiếng Anh nào có nghĩa là "lòng trắc ẩn / sự đồng cảm sâu sắc"?',
          hintVi: 'Bắt đầu bằng Em- (E-M-P-A-T-H-Y).',
          options: [
            {
              id: 'opt_1',
              text: 'Empathy',
              isCorrect: true,
              explanationEn: 'Empathy is the ability to understand and share the feelings of another.',
              explanationVi: 'Empathy nghĩa là sự thấu cảm, đồng cảm.',
            },
            {
              id: 'opt_2',
              text: 'Energy',
              isCorrect: false,
              explanationEn: 'Energy is vitality and power.',
              explanationVi: 'Energy nghĩa là năng lượng.',
            },
            {
              id: 'opt_3',
              text: 'Envy',
              isCorrect: false,
              explanationEn: 'Envy means feeling discontented resentment of others.',
              explanationVi: 'Envy nghĩa là sự ghen tị.',
            },
          ],
        },
      },
    ],
    primaryNodes: [
      { x: 4.5 * TILE_SIZE, y: 3.2 * TILE_SIZE },
      { x: 6.5 * TILE_SIZE, y: 3.5 * TILE_SIZE },
      { x: 4.5 * TILE_SIZE, y: 9.8 * TILE_SIZE },
      { x: 6.5 * TILE_SIZE, y: 9.5 * TILE_SIZE },
      { x: 14.5 * TILE_SIZE, y: 9.8 * TILE_SIZE },
    ],
    secondaryNodes: [
      { x: 13.8 * TILE_SIZE, y: 3.2 * TILE_SIZE },
      { x: 16 * TILE_SIZE, y: 4.2 * TILE_SIZE },
      { x: 16 * TILE_SIZE, y: 9.5 * TILE_SIZE },
    ],
  },
  sports: {
    gate: { x: 9 * TILE_SIZE, y: 1.2 * TILE_SIZE },
    camp: { x: 9.2 * TILE_SIZE, y: 6.2 * TILE_SIZE },
    npc: { x: 10.5 * TILE_SIZE, y: 6.2 * TILE_SIZE },
    chest: { x: 15.5 * TILE_SIZE, y: 4.5 * TILE_SIZE },
    subStations: [
      {
        x: 4.5 * TILE_SIZE,
        y: 4.5 * TILE_SIZE,
        labelVi: 'Trạm Vượt Rào & Bền Bỉ',
        question: {
          id: 'quest_sub_spo_1',
          title: 'Thể Lực: Sức Bền Thể Lực',
          contextEn: 'Athletes must build endurance to sprint through the entire marathon course.',
          contextVi: 'Các vận động viên cần rèn luyện sức bền để vượt qua chặng đường chạy đường dài.',
          question: 'Từ tiếng Anh nào mang nghĩa "sức bền / thể lực dẻo dai"?',
          hintVi: 'Bắt đầu bằng S-T-A- (S-T-A-M-I-N-A).',
          options: [
            {
              id: 'opt_1',
              text: 'Stamina',
              isCorrect: true,
              explanationEn: 'Stamina is the ability to sustain prolonged physical effort.',
              explanationVi: 'Stamina nghĩa là thể lực, sức bền.',
            },
            {
              id: 'opt_2',
              text: 'Stadium',
              isCorrect: false,
              explanationEn: 'Stadium is a sports venue.',
              explanationVi: 'Stadium nghĩa là sân vận động.',
            },
            {
              id: 'opt_3',
              text: 'Station',
              isCorrect: false,
              explanationEn: 'Station means a stopping or operational post.',
              explanationVi: 'Station nghĩa là nhà ga / trạm dừng.',
            },
          ],
        },
      },
      {
        x: 14.5 * TILE_SIZE,
        y: 8.5 * TILE_SIZE,
        labelVi: 'Trạm Tinh Thần Thể Thao',
        question: {
          id: 'quest_sub_spo_2',
          title: 'Thể Lực: Tinh Thần Đồng Đội',
          contextEn: 'Every great championship squad relies on seamless coordination among players.',
          contextVi: 'Mọi đội tuyển vô địch đều dựa trên sự phối hợp ăn ý giữa các thành viên.',
          question: 'Từ tiếng Anh nào chỉ "tinh thần làm việc nhóm / đồng đội"?',
          hintVi: 'Ghép giữa Team và Work.',
          options: [
            {
              id: 'opt_1',
              text: 'Teamwork',
              isCorrect: true,
              explanationEn: 'Teamwork is the collaborative effort of a group to achieve a common goal.',
              explanationVi: 'Teamwork nghĩa là tinh thần đồng đội / làm việc nhóm.',
            },
            {
              id: 'opt_2',
              text: 'Tournament',
              isCorrect: false,
              explanationEn: 'Tournament is a sporting competition series.',
              explanationVi: 'Tournament là giải đấu.',
            },
            {
              id: 'opt_3',
              text: 'Trophy',
              isCorrect: false,
              explanationEn: 'Trophy is a victory prize or cup.',
              explanationVi: 'Trophy là chiếc cúp chiến thắng.',
            },
          ],
        },
      },
    ],
    primaryNodes: [
      { x: 3.5 * TILE_SIZE, y: 3.2 * TILE_SIZE },
      { x: 5.5 * TILE_SIZE, y: 5.2 * TILE_SIZE },
      { x: 3.5 * TILE_SIZE, y: 8.5 * TILE_SIZE },
      { x: 14.2 * TILE_SIZE, y: 3.2 * TILE_SIZE },
      { x: 15.5 * TILE_SIZE, y: 9.5 * TILE_SIZE },
    ],
    secondaryNodes: [
      { x: 6.2 * TILE_SIZE, y: 9.5 * TILE_SIZE },
      { x: 13.8 * TILE_SIZE, y: 9.2 * TILE_SIZE },
      { x: 6.2 * TILE_SIZE, y: 2.8 * TILE_SIZE },
    ],
  },
  action: {
    gate: { x: 9 * TILE_SIZE, y: 1.2 * TILE_SIZE },
    camp: { x: 9.2 * TILE_SIZE, y: 6.2 * TILE_SIZE },
    npc: { x: 10.5 * TILE_SIZE, y: 6.2 * TILE_SIZE },
    chest: { x: 15.5 * TILE_SIZE, y: 3.5 * TILE_SIZE },
    subStations: [
      {
        x: 4 * TILE_SIZE,
        y: 4 * TILE_SIZE,
        labelVi: 'Đài Cảnh Giới Tiền Đồn Tây',
        question: {
          id: 'quest_sub_act_1',
          title: 'Tiền Tiêu: Trinh Sát & Quan Sát',
          contextEn: 'A frontier scout climbs the watchpost to survey dangerous rugged passes.',
          contextVi: 'Người lính trinh sát leo lên đài quan sát để quét tìm các hẻm núi hiểm trở.',
          question: 'Từ tiếng Anh nào mang nghĩa "người lính trinh sát / thám thính"?',
          hintVi: 'Có 5 chữ cái, bắt đầu bằng S (S-C-O-U-T).',
          options: [
            {
              id: 'opt_1',
              text: 'Scout',
              isCorrect: true,
              explanationEn: 'A scout is someone sent ahead of a main force to gather intelligence.',
              explanationVi: 'Scout nghĩa là người do thám, trinh sát.',
            },
            {
              id: 'opt_2',
              text: 'Shield',
              isCorrect: false,
              explanationEn: 'A shield is armor used for defense.',
              explanationVi: 'Shield nghĩa là chiếc khiên bảo vệ.',
            },
            {
              id: 'opt_3',
              text: 'Sword',
              isCorrect: false,
              explanationEn: 'A sword is a bladed weapon.',
              explanationVi: 'Sword nghĩa là thanh kiếm chiến đấu.',
            },
          ],
        },
      },
      {
        x: 15.2 * TILE_SIZE,
        y: 8 * TILE_SIZE,
        labelVi: 'Đài Cảnh Giới Phòng Tuyến Đông',
        question: {
          id: 'quest_sub_act_2',
          title: 'Tiền Tiêu: Dũng Khí Sinh Tồn',
          contextEn: 'Facing unpredictable wild obstacles requires bold fearlessness and grit.',
          contextVi: 'Đối đầu với chướng ngại vật hiểm nguy đòi hỏi sự dũng cảm và kiên định.',
          question: 'Từ tiếng Anh nào có nghĩa là "lòng dũng cảm / sự can đảm"?',
          hintVi: 'Bắt đầu bằng C-O-U- (C-O-U-R-A-G-E).',
          options: [
            {
              id: 'opt_1',
              text: 'Courage',
              isCorrect: true,
              explanationEn: 'Courage is the mental strength to confront fear, danger, or difficulty.',
              explanationVi: 'Courage nghĩa là lòng dũng cảm, sự can trường.',
            },
            {
              id: 'opt_2',
              text: 'Caution',
              isCorrect: false,
              explanationEn: 'Caution means care taken to avoid risk.',
              explanationVi: 'Caution nghĩa là sự thận trọng.',
            },
            {
              id: 'opt_3',
              text: 'Camp',
              isCorrect: false,
              explanationEn: 'Camp is a place with temporary lodgings.',
              explanationVi: 'Camp nghĩa là khu doanh trại cắm quân.',
            },
          ],
        },
      },
    ],
    primaryNodes: [
      { x: 3.8 * TILE_SIZE, y: 3 * TILE_SIZE },
      { x: 5.2 * TILE_SIZE, y: 5 * TILE_SIZE },
      { x: 3.8 * TILE_SIZE, y: 8.5 * TILE_SIZE },
      { x: 14.5 * TILE_SIZE, y: 3.5 * TILE_SIZE },
      { x: 15.5 * TILE_SIZE, y: 9.5 * TILE_SIZE },
    ],
    secondaryNodes: [
      { x: 6.2 * TILE_SIZE, y: 8.8 * TILE_SIZE },
      { x: 13.8 * TILE_SIZE, y: 9 * TILE_SIZE },
      { x: 6 * TILE_SIZE, y: 2.8 * TILE_SIZE },
    ],
  },
  default: {
    gate: { x: 9 * TILE_SIZE, y: 1 * TILE_SIZE },
    camp: { x: 8.2 * TILE_SIZE, y: 6.2 * TILE_SIZE },
    npc: { x: 10.2 * TILE_SIZE, y: 6 * TILE_SIZE },
    chest: { x: 15 * TILE_SIZE, y: 6.2 * TILE_SIZE },
    subStations: [
      {
        x: 4 * TILE_SIZE,
        y: 4.5 * TILE_SIZE,
        labelVi: 'Kiện Hàng Hàng Hải Tây',
        question: {
          id: 'quest_sub_def_1',
          title: 'Sinh Tồn: Định Hướng Hàng Hải',
          contextEn: 'Opening this waterlogged chest reveals a navigational brass tool.',
          contextVi: 'Mở kiện hàng nổi trên sóng hé lộ một công cụ bằng đồng dùng để chỉ hướng Bắc.',
          question: 'Dụng cụ chỉ hướng bằng kim nam châm trong tiếng Anh là gì?',
          hintVi: 'Bắt đầu bằng C-O-M- (C-O-M-P-A-S-S).',
          options: [
            {
              id: 'opt_1',
              text: 'Compass',
              isCorrect: true,
              explanationEn: 'A compass is an instrument containing a magnetized pointer showing magnetic north.',
              explanationVi: 'Compass nghĩa là la bàn định hướng.',
            },
            {
              id: 'opt_2',
              text: 'Compact',
              isCorrect: false,
              explanationEn: 'Compact means dense or closely packed.',
              explanationVi: 'Compact nghĩa là nhỏ gọn / nén lại.',
            },
            {
              id: 'opt_3',
              text: 'Computer',
              isCorrect: false,
              explanationEn: 'A computer is an electronic data device.',
              explanationVi: 'Computer nghĩa là máy tính.',
            },
          ],
        },
      },
      {
        x: 15.5 * TILE_SIZE,
        y: 8.5 * TILE_SIZE,
        labelVi: 'Kiện Lương Thực Dạt Bờ',
        question: {
          id: 'quest_sub_def_2',
          title: 'Sinh Tồn: Nguồn Nước Ngọt',
          contextEn: 'In a desert island survival scenario, clean drinkable water is the utmost priority.',
          contextVi: 'Trong tình huống sinh tồn nơi hoang đảo, nước ngọt uống được là ưu tiên số một.',
          question: 'Từ tiếng Anh nào dùng để chỉ "nước uống được / nước ngọt"?',
          hintVi: 'Từ rất quen thuộc có 5 chữ cái (W-A-T-E-R).',
          options: [
            {
              id: 'opt_1',
              text: 'Water',
              isCorrect: true,
              explanationEn: 'Water is essential for all living organisms and survival.',
              explanationVi: 'Water nghĩa là nước.',
            },
            {
              id: 'opt_2',
              text: 'Winter',
              isCorrect: false,
              explanationEn: 'Winter is the coldest season of the year.',
              explanationVi: 'Winter nghĩa là mùa đông.',
            },
            {
              id: 'opt_3',
              text: 'Weather',
              isCorrect: false,
              explanationEn: 'Weather describes state of the atmosphere.',
              explanationVi: 'Weather nghĩa là thời tiết.',
            },
          ],
        },
      },
    ],
    primaryNodes: [
      { x: 3.5 * TILE_SIZE, y: 3 * TILE_SIZE },
      { x: 5.5 * TILE_SIZE, y: 4.5 * TILE_SIZE },
      { x: 3.2 * TILE_SIZE, y: 7.5 * TILE_SIZE },
      { x: 5.2 * TILE_SIZE, y: 9.2 * TILE_SIZE },
      { x: 14.2 * TILE_SIZE, y: 3.2 * TILE_SIZE },
    ],
    secondaryNodes: [
      { x: 13.5 * TILE_SIZE, y: 8.8 * TILE_SIZE },
      { x: 15.8 * TILE_SIZE, y: 9.5 * TILE_SIZE },
      { x: 6.2 * TILE_SIZE, y: 2.5 * TILE_SIZE },
    ],
  },
};

export function getObjectsForTheme(theme: IslandTheme): WorldObject[] {
  const layout = REALM_LAYOUTS[theme.id] || REALM_LAYOUTS[theme.environmentStyle] || REALM_LAYOUTS.default;

  const objects: WorldObject[] = [
    // 1. Northern Realm Exit Gate
    {
      id: 'gate-1',
      type: 'gate',
      x: layout.gate.x,
      y: layout.gate.y,
      width: 80,
      height: 40,
      solid: true,
      label: theme.gateNameVi,
    },
    // 2. Realm Centerpiece Structure
    {
      id: 'camp-1',
      type: 'camp',
      x: layout.camp.x,
      y: layout.camp.y,
      width: 36,
      height: 36,
      solid: true,
      label: `${theme.realmTitle} - Trọng tâm`,
    },
    // 3. Realm Mentor NPC
    {
      id: 'npc-1',
      type: 'npc',
      x: layout.npc.x,
      y: layout.npc.y,
      width: 34,
      height: 38,
      solid: true,
      label: `${theme.mentorName} (${theme.mentorRole})`,
    },
    // 4. Realm Themed Supply Chest
    {
      id: 'chest-1',
      type: 'chest',
      x: layout.chest.x,
      y: layout.chest.y,
      width: 36,
      height: 32,
      solid: true,
      label: theme.chestNameVi,
      opened: false,
    },
  ];

  // 5. Special Quest Sub-Stations (2 per realm)
  layout.subStations.forEach((sub, idx) => {
    objects.push({
      id: `substation-${idx + 1}`,
      type: 'sub_station',
      subType: theme.specialMission?.subStationType || 'crate',
      x: sub.x,
      y: sub.y,
      width: 36,
      height: 36,
      solid: true,
      activated: false,
      label: sub.labelVi,
      question: sub.question,
    });
  });

  // 6. 5 Primary Resource Nodes
  layout.primaryNodes.forEach((pos, idx) => {
    objects.push({
      id: `primary-${idx + 1}`,
      type: 'tree',
      x: pos.x,
      y: pos.y,
      width: 36,
      height: 38,
      solid: true,
      label: `${theme.primaryResource.sourceNameVi} (${theme.primaryResource.nameVi})`,
    });
  });

  // 7. 3 Secondary Resource Nodes
  layout.secondaryNodes.forEach((pos, idx) => {
    objects.push({
      id: `secondary-${idx + 1}`,
      type: 'rock',
      x: pos.x,
      y: pos.y,
      width: 34,
      height: 30,
      solid: true,
      label: `${theme.secondaryResource.sourceNameVi} (${theme.secondaryResource.nameVi})`,
    });
  });

  return objects;
}

// Legacy initial objects for default loading
export const INITIAL_OBJECTS = getObjectsForTheme(ISLAND_THEMES.animals);

// Built-in Complete Dynamic Quests per Theme
export const THEME_QUESTS: Record<string, DynamicQuest> = {
  animals: {
    theme: ISLAND_THEMES.animals,
    words: [
      { id: 'an_1', word: 'dog', pronunciation: '/dɒɡ/', partOfSpeech: 'noun', meanings: ['con chó'], difficulty: 'A1' },
      { id: 'an_2', word: 'cat', pronunciation: '/kæt/', partOfSpeech: 'noun', meanings: ['con mèo'], difficulty: 'A1' },
      { id: 'an_3', word: 'elephant', pronunciation: '/ˈel.ɪ.fənt/', partOfSpeech: 'noun', meanings: ['con voi'], difficulty: 'A1' },
      { id: 'an_4', word: 'tiger', pronunciation: '/ˈtaɪ.ɡər/', partOfSpeech: 'noun', meanings: ['con hổ'], difficulty: 'A2' },
      { id: 'an_5', word: 'dolphin', pronunciation: '/ˈdɒl.fɪn/', partOfSpeech: 'noun', meanings: ['cá heo'], difficulty: 'A2' },
      { id: 'an_6', word: 'eagle', pronunciation: '/ˈiː.ɡəl/', partOfSpeech: 'noun', meanings: ['đại bàng'], difficulty: 'A2' },
      { id: 'an_7', word: 'lion', pronunciation: '/ˈlaɪ.ən/', partOfSpeech: 'noun', meanings: ['sư tử'], difficulty: 'A1' },
    ],
    puzzles: {
      act1_intro: [
        {
          id: 'q_an_1',
          title: 'Hồi 1: Gặp Kiểm lâm Hải',
          contextEn: 'Ranger Hai greets you at the sanctuary camp.',
          contextVi: 'Kiểm lâm Hải kiểm tra kiến thức nhận biết muông thú cứu hộ.',
          question: 'Which loyal four-legged pet is known as man’s best friend and barks?',
          hintVi: 'Gợi ý: Loài vật bốn chân trung thành sủa "gâu gâu" là "dog" (con chó).',
          wordId: 'an_1',
          word: 'dog',
          options: [
            { id: 'a', text: 'shark', isCorrect: false, explanationEn: 'A shark lives in the sea.', explanationVi: 'Shark là cá mập dưới biển.' },
            { id: 'b', text: 'dog', isCorrect: true, explanationEn: 'Correct! The faithful dog leads the way!', explanationVi: 'Chính xác! Chú chó trung thành dẫn đường cho bạn!' },
            { id: 'c', text: 'spider', isCorrect: false, explanationEn: 'Spider has eight legs.', explanationVi: 'Spider là con nhện.' },
            { id: 'd', text: 'eagle', isCorrect: false, explanationEn: 'Eagle is a bird.', explanationVi: 'Eagle là đại bàng.' },
          ],
        },
      ],
      act2_craft: [
        {
          id: 'q_an_2',
          title: 'Hồi 2: Chế tạo Móc Cứu Hộ (1/2)',
          contextEn: 'Ranger Hai inspects your 3 Bamboo and 2 Mineral Clay.',
          contextVi: 'Kiểm lâm Hải kiểm tra 3 Tre Rừng và 2 Đất Sét Khoáng.',
          question: 'A sleek pet ____ curled up quietly on the warm velvet sofa.',
          hintVi: 'Gợi ý: Con vật nuôi kêu "meo meo" bắt chuột là "cat" (con mèo).',
          wordId: 'an_2',
          word: 'cat',
          options: [
            { id: 'a', text: 'whale', isCorrect: false, explanationEn: 'Whale is a sea mammal.', explanationVi: 'Whale là cá voi.' },
            { id: 'b', text: 'wolf', isCorrect: false, explanationEn: 'Wolf is a wild canine.', explanationVi: 'Wolf là chó sói.' },
            { id: 'c', text: 'cat', isCorrect: true, explanationEn: 'Spot on! Cat is correct.', explanationVi: 'Chính xác! Cat là con mèo.' },
            { id: 'd', text: 'bear', isCorrect: false, explanationEn: 'Bear is a forest animal.', explanationVi: 'Bear là con gấu.' },
          ],
        },
        {
          id: 'q_an_3',
          title: 'Hồi 2: Chế tạo Móc Cứu Hộ (2/2)',
          contextEn: 'Giant footprints lead deeper into the sanctuary forest.',
          contextVi: 'Dấu chân khổng lồ hằn sâu trên lối đi bùn lầy.',
          question: 'The massive African ____ sprayed water with its long trunk.',
          hintVi: 'Gợi ý: Loài thú trên cạn to lớn nhất có vòi dài là "elephant" (con voi).',
          wordId: 'an_3',
          word: 'elephant',
          options: [
            { id: 'a', text: 'rabbit', isCorrect: false, explanationEn: 'Rabbit is small.', explanationVi: 'Rabbit là con thỏ.' },
            { id: 'b', text: 'fox', isCorrect: false, explanationEn: 'Fox is a canine.', explanationVi: 'Fox là con cáo.' },
            { id: 'c', text: 'sheep', isCorrect: false, explanationEn: 'Sheep gives wool.', explanationVi: 'Sheep là con cừu.' },
            { id: 'd', text: 'elephant', isCorrect: true, explanationEn: 'You forged the Wildlife Rescue Hook!', explanationVi: 'Tuyệt vời! Bạn đã chế tạo Móc Cứu Hộ Động Vật!' },
          ],
        },
      ],
      act3_chest: [
        {
          id: 'q_an_4',
          title: 'Hồi 3: Mở Rương Cứu Trợ (1/2)',
          contextEn: 'Thick jungle vines bind the emergency medicine chest.',
          contextVi: 'Dây leo gai quấn chặt rương thuốc cứu thương.',
          question: 'The majestic Bengal ____ prowled silently through the tall grass.',
          hintVi: 'Gợi ý: Chúa sơn lâm có sọc vằn là "tiger" (con hổ).',
          wordId: 'an_4',
          word: 'tiger',
          options: [
            { id: 'a', text: 'tiger', isCorrect: true, explanationEn: 'Correct! The lock clicks!', explanationVi: 'Chính xác! Ổ khóa rương bật mở chốt đầu tiên!' },
            { id: 'b', text: 'goat', isCorrect: false, explanationEn: 'Goat is an herbivore.', explanationVi: 'Goat là con dê.' },
            { id: 'c', text: 'deer', isCorrect: false, explanationEn: 'Deer is graceful.', explanationVi: 'Deer là con hươu.' },
            { id: 'd', text: 'pig', isCorrect: false, explanationEn: 'Pig is a farm animal.', explanationVi: 'Pig là con lợn.' },
          ],
        },
        {
          id: 'q_an_5',
          title: 'Hồi 3: Mở Rương Cứu Trợ (2/2)',
          contextEn: 'A coastal marine emblem shines on the inner hatch.',
          contextVi: 'Biểu tượng sinh vật biển thân thiện sáng lên.',
          question: 'A friendly ____ leaped gracefully alongside our research boat.',
          hintVi: 'Gợi ý: Loài thú biển cực kỳ thông minh là "dolphin" (cá heo).',
          wordId: 'an_5',
          word: 'dolphin',
          options: [
            { id: 'a', text: 'camel', isCorrect: false, explanationEn: 'Camel is in the desert.', explanationVi: 'Camel là lạc đà.' },
            { id: 'b', text: 'zebra', isCorrect: false, explanationEn: 'Zebra has stripes.', explanationVi: 'Zebra là ngựa vằn.' },
            { id: 'c', text: 'dolphin', isCorrect: true, explanationEn: 'You got the Sanctuary Gate Key!', explanationVi: 'Xuất sắc! Bạn tìm thấy Chìa Khóa Cổng Khu Bảo Tồn!' },
            { id: 'd', text: 'cow', isCorrect: false, explanationEn: 'Cow is cattle.', explanationVi: 'Cow là con bò.' },
          ],
        },
      ],
      act4_gate: [
        {
          id: 'q_an_6',
          title: 'Hồi 4: Thử thách Cổng Bảo Tồn (1/2)',
          contextEn: 'Inscriptions flare on the heavy timber gate.',
          contextVi: 'Dòng chữ cổ ngữ bừng sáng trên cổng gỗ rừng.',
          question: 'The bald ____ soared high above the canyon with sharp eyes.',
          hintVi: 'Gợi ý: Loài chim săn mồi có móng vuốt sắc bén là "eagle" (đại bàng).',
          wordId: 'an_6',
          word: 'eagle',
          options: [
            { id: 'a', text: 'duck', isCorrect: false, explanationEn: 'Duck is a waterfowl.', explanationVi: 'Duck là con vịt.' },
            { id: 'b', text: 'eagle', isCorrect: true, explanationEn: 'The upper bolt unlocks!', explanationVi: 'Chính xác! Then cài phía trên đã rút lui!' },
            { id: 'c', text: 'penguin', isCorrect: false, explanationEn: 'Penguin swims.', explanationVi: 'Penguin là chim cánh cụt.' },
            { id: 'd', text: 'chicken', isCorrect: false, explanationEn: 'Chicken is poultry.', explanationVi: 'Chicken là con gà.' },
          ],
        },
        {
          id: 'q_an_7',
          title: 'Hồi 4: Thử thách Cổng Bảo Tồn (2/2)',
          contextEn: 'The final trial of the Savanna King!',
          contextVi: 'Thử thách cuối cùng về vị vua của thảo nguyên!',
          question: 'The mighty ____ rested under the golden savanna acacia tree.',
          hintVi: 'Gợi ý: Sư tử bờm vàng oai vệ là "lion".',
          wordId: 'an_7',
          word: 'lion',
          options: [
            { id: 'a', text: 'monkey', isCorrect: false, explanationEn: 'Monkey climbs trees.', explanationVi: 'Monkey là con khỉ.' },
            { id: 'b', text: 'horse', isCorrect: false, explanationEn: 'Horse gallops.', explanationVi: 'Horse là con ngựa.' },
            { id: 'c', text: 'giraffe', isCorrect: false, explanationEn: 'Giraffe has long neck.', explanationVi: 'Giraffe là hươu cao cổ.' },
            { id: 'd', text: 'lion', isCorrect: true, explanationEn: 'Victory! The gate swings wide open!', explanationVi: 'Chiến thắng! Cổng rừng mở rộng giải phóng muông thú!' },
          ],
        },
      ],
    },
  },
  tech: {
    theme: ISLAND_THEMES.tech,
    words: [
      { id: 'tc_1', word: 'computer', pronunciation: '/kəmˈpjuː.tər/', partOfSpeech: 'noun', meanings: ['máy tính'], difficulty: 'A1' },
      { id: 'tc_2', word: 'keyboard', pronunciation: '/ˈkiː.bɔːd/', partOfSpeech: 'noun', meanings: ['bàn phím'], difficulty: 'A1' },
      { id: 'tc_3', word: 'screen', pronunciation: '/skriːn/', partOfSpeech: 'noun', meanings: ['màn hình'], difficulty: 'A1' },
      { id: 'tc_4', word: 'internet', pronunciation: '/ˈɪn.tə.net/', partOfSpeech: 'noun', meanings: ['mạng internet'], difficulty: 'A1' },
      { id: 'tc_5', word: 'software', pronunciation: '/ˈsɒft.weər/', partOfSpeech: 'noun', meanings: ['phần mềm'], difficulty: 'A2' },
      { id: 'tc_6', word: 'password', pronunciation: '/ˈpɑːs.wɜːd/', partOfSpeech: 'noun', meanings: ['mật khẩu'], difficulty: 'A1' },
      { id: 'tc_7', word: 'security', pronunciation: '/sɪˈkjʊə.rə.ti/', partOfSpeech: 'noun', meanings: ['an ninh', 'bảo mật'], difficulty: 'B1' },
    ],
    puzzles: {
      act1_intro: [
        {
          id: 'q_tc_1',
          title: 'Hồi 1: Giải mã cùng Kỹ sư Echo',
          contextEn: 'Engineer Echo boots up the island terminal.',
          contextVi: 'Kỹ sư Echo khởi động giao diện dòng lệnh của máy chủ.',
          question: 'An electronic device used to process data, write code, and calculate is a ____.',
          hintVi: 'Gợi ý: Cỗ máy điện tử dùng để tính toán và làm việc là "computer" (máy tính).',
          wordId: 'tc_1',
          word: 'computer',
          options: [
            { id: 'a', text: 'bicycle', isCorrect: false, explanationEn: 'Bicycle is a vehicle.', explanationVi: 'Bicycle là xe đạp.' },
            { id: 'b', text: 'computer', isCorrect: true, explanationEn: 'System online! Welcome operator.', explanationVi: 'Hệ thống đã nhận diện! Bắt đầu nhiệm vụ.' },
            { id: 'c', text: 'blanket', isCorrect: false, explanationEn: 'Blanket keeps you warm.', explanationVi: 'Blanket là cái chăn.' },
            { id: 'd', text: 'candle', isCorrect: false, explanationEn: 'Candle provides light.', explanationVi: 'Candle là cây nến.' },
          ],
        },
      ],
      act2_craft: [
        {
          id: 'q_tc_2',
          title: 'Hồi 2: Chế tạo Mỏ Hàn Laser (1/2)',
          contextEn: 'Synthesizing 3 Microchips and 2 Quantum Cores.',
          contextVi: 'Hàn các chân mạch vi xử lý để kích hoạt công cụ laser.',
          question: 'You type commands and input text into a PC using a mechanical ____.',
          hintVi: 'Gợi ý: Thiết bị ngoại vi có các phím bấm để gõ chữ là "keyboard" (bàn phím).',
          wordId: 'tc_2',
          word: 'keyboard',
          options: [
            { id: 'a', text: 'mirror', isCorrect: false, explanationEn: 'Mirror reflects image.', explanationVi: 'Mirror là chiếc gương.' },
            { id: 'b', text: 'keyboard', isCorrect: true, explanationEn: 'Correct! Input verified.', explanationVi: 'Chính xác! Keyboard là bàn phím.' },
            { id: 'c', text: 'cushion', isCorrect: false, explanationEn: 'Cushion is a pillow.', explanationVi: 'Cushion là cái đệm.' },
            { id: 'd', text: 'bottle', isCorrect: false, explanationEn: 'Bottle holds liquid.', explanationVi: 'Bottle là cái chai.' },
          ],
        },
        {
          id: 'q_tc_3',
          title: 'Hồi 2: Chế tạo Mỏ Hàn Laser (2/2)',
          contextEn: 'Configuring the laser display HUD.',
          contextVi: 'Cân chỉnh giao diện thấu kính hiển thị thông số.',
          question: 'The visual display surface of a monitor, tablet, or smartphone is called the ____.',
          hintVi: 'Gợi ý: Mặt hiển thị hình ảnh của màn hình máy tính/điện thoại là "screen".',
          wordId: 'tc_3',
          word: 'screen',
          options: [
            { id: 'a', text: 'ladder', isCorrect: false, explanationEn: 'Ladder is for climbing.', explanationVi: 'Ladder là cái thang.' },
            { id: 'b', text: 'pillow', isCorrect: false, explanationEn: 'Pillow is for sleep.', explanationVi: 'Pillow là cái gối.' },
            { id: 'c', text: 'screen', isCorrect: true, explanationEn: 'Laser Soldering Tool assembled!', explanationVi: 'Tuyệt vời! Bạn đã chế tạo thành công Mỏ Hàn Laser!' },
            { id: 'd', text: 'blanket', isCorrect: false, explanationEn: 'Blanket is fabric.', explanationVi: 'Blanket là tấm chăn.' },
          ],
        },
      ],
      act3_chest: [
        {
          id: 'q_tc_4',
          title: 'Hồi 3: Giải mã Hộp Dữ Liệu (1/2)',
          contextEn: 'Decrypting the global network packets.',
          contextVi: 'Phân tích gói tin mạng lưới toàn cầu để vượt rào bảo vệ.',
          question: 'The global interconnected network that links billions of computers worldwide is the ____.',
          hintVi: 'Gợi ý: Mạng lưới toàn cầu kết nối thế giới là "internet".',
          wordId: 'tc_4',
          word: 'internet',
          options: [
            { id: 'a', text: 'highway', isCorrect: false, explanationEn: 'Highway is for cars.', explanationVi: 'Highway là đường cao tốc.' },
            { id: 'b', text: 'internet', isCorrect: true, explanationEn: 'Network handshake succeeded!', explanationVi: 'Chính xác! Đã bắt tay kết nối mạng thành công!' },
            { id: 'c', text: 'railway', isCorrect: false, explanationEn: 'Railway is for trains.', explanationVi: 'Railway là đường sắt.' },
            { id: 'd', text: 'runway', isCorrect: false, explanationEn: 'Runway is for planes.', explanationVi: 'Runway là đường băng.' },
          ],
        },
        {
          id: 'q_tc_5',
          title: 'Hồi 3: Giải mã Hộp Dữ Liệu (2/2)',
          contextEn: 'Extracting program codes from the encrypted cache.',
          contextVi: 'Trích xuất mã chương trình điều khiển từ hộp lưu trữ.',
          question: 'Programs, applications, and operating instructions used by computers are called ____.',
          hintVi: 'Gợi ý: Các chương trình, ứng dụng chạy trên máy tính được gọi chung là "software" (phần mềm).',
          wordId: 'tc_5',
          word: 'software',
          options: [
            { id: 'a', text: 'hardware', isCorrect: false, explanationEn: 'Hardware is physical parts.', explanationVi: 'Hardware là phần cứng.' },
            { id: 'b', text: 'software', isCorrect: true, explanationEn: 'You extracted the Firewall Passkey!', explanationVi: 'Xuất sắc! Bạn đã trích xuất được Mã Vượt Tường Lửa!' },
            { id: 'c', text: 'tupperware', isCorrect: false, explanationEn: 'Tupperware is plastic boxes.', explanationVi: 'Tupperware là hộp nhựa.' },
            { id: 'd', text: 'footwear', isCorrect: false, explanationEn: 'Footwear is shoes.', explanationVi: 'Footwear là giày dép.' },
          ],
        },
      ],
      act4_gate: [
        {
          id: 'q_tc_6',
          title: 'Hồi 4: Vượt Cổng Tường Lửa (1/2)',
          contextEn: 'Entering administrative authorization string.',
          contextVi: 'Nhập chuỗi ký tự bí mật để xác thực quyền quản trị viên.',
          question: 'A secret string of letters and numbers used to authenticate your identity is a ____.',
          hintVi: 'Gợi ý: Chuỗi ký tự bí mật để đăng nhập là "password" (mật khẩu).',
          wordId: 'tc_6',
          word: 'password',
          options: [
            { id: 'a', text: 'ticket', isCorrect: false, explanationEn: 'Ticket is for entry.', explanationVi: 'Ticket là vé vào cổng.' },
            { id: 'b', text: 'postcard', isCorrect: false, explanationEn: 'Postcard is mail.', explanationVi: 'Postcard là bưu thiếp.' },
            { id: 'c', text: 'password', isCorrect: true, explanationEn: 'Authentication verified!', explanationVi: 'Xác thực mật khẩu hợp lệ!' },
            { id: 'd', text: 'license', isCorrect: false, explanationEn: 'License is a permit.', explanationVi: 'License là giấy phép.' },
          ],
        },
        {
          id: 'q_tc_7',
          title: 'Hồi 4: Vượt Cổng Tường Lửa (2/2)',
          contextEn: 'Final lockdown release sequence.',
          contextVi: 'Giải tỏa quy trình phòng thủ an ninh mạng trên toàn đảo.',
          question: 'Measures taken by organizations to protect digital systems from threats ensure high cyber ____.',
          hintVi: 'Gợi ý: Sự an toàn, bảo vệ an ninh hệ thống là "security" (bảo mật).',
          wordId: 'tc_7',
          word: 'security',
          options: [
            { id: 'a', text: 'gravity', isCorrect: false, explanationEn: 'Gravity pulls down.', explanationVi: 'Gravity là trọng lực.' },
            { id: 'b', text: 'velocity', isCorrect: false, explanationEn: 'Velocity is speed.', explanationVi: 'Velocity là vận tốc.' },
            { id: 'c', text: 'capacity', isCorrect: false, explanationEn: 'Capacity is volume.', explanationVi: 'Capacity là sức chứa.' },
            { id: 'd', text: 'security', isCorrect: true, explanationEn: 'Access granted! Firewall disabled!', explanationVi: 'Truy cập được cấp! Cổng tường lửa đã mở toang!' },
          ],
        },
      ],
    },
  },
  space: {
    theme: ISLAND_THEMES.space,
    words: [
      { id: 'sp_1', word: 'star', pronunciation: '/stɑːr/', partOfSpeech: 'noun', meanings: ['ngôi sao'], difficulty: 'A1' },
      { id: 'sp_2', word: 'planet', pronunciation: '/ˈplæn.ɪt/', partOfSpeech: 'noun', meanings: ['hành tinh'], difficulty: 'A1' },
      { id: 'sp_3', word: 'rocket', pronunciation: '/ˈrɒk.ɪt/', partOfSpeech: 'noun', meanings: ['tên lửa'], difficulty: 'A1' },
      { id: 'sp_4', word: 'galaxy', pronunciation: '/ˈɡæl.ək.si/', partOfSpeech: 'noun', meanings: ['thiên hà'], difficulty: 'A2' },
      { id: 'sp_5', word: 'astronaut', pronunciation: '/ˈæs.trə.nɔːt/', partOfSpeech: 'noun', meanings: ['phi hành gia'], difficulty: 'A2' },
      { id: 'sp_6', word: 'telescope', pronunciation: '/ˈtel.ɪ.skəʊp/', partOfSpeech: 'noun', meanings: ['kính viễn vọng'], difficulty: 'A2' },
      { id: 'sp_7', word: 'universe', pronunciation: '/ˈjuː.nɪ.vɜːs/', partOfSpeech: 'noun', meanings: ['vũ trụ'], difficulty: 'B1' },
    ],
    puzzles: {
      act1_intro: [
        {
          id: 'q_sp_1',
          title: 'Hồi 1: Nhà Thiên văn Orion',
          contextEn: 'Astronomer Orion tracks twinkling celestial points.',
          contextVi: 'Nhà Thiên văn Orion hướng mắt lên bầu trời tinh tú.',
          question: 'A giant luminous ball of hot plasma held together by its own gravity is a ____.',
          hintVi: 'Gợi ý: Ngôi sao lấp lánh trên bầu trời đêm là "star".',
          wordId: 'sp_1',
          word: 'star',
          options: [
            { id: 'a', text: 'cloud', isCorrect: false, explanationEn: 'Cloud is water vapor.', explanationVi: 'Cloud là đám mây.' },
            { id: 'b', text: 'star', isCorrect: true, explanationEn: 'Celestial coordinates aligned!', explanationVi: 'Chính xác! Tọa độ thiên hà đã được thiết lập.' },
            { id: 'c', text: 'kite', isCorrect: false, explanationEn: 'Kite flies in the wind.', explanationVi: 'Kite là con diều.' },
            { id: 'd', text: 'plane', isCorrect: false, explanationEn: 'Plane is an aircraft.', explanationVi: 'Plane là máy bay.' },
          ],
        },
      ],
      act2_craft: [
        {
          id: 'q_sp_2',
          title: 'Hồi 2: Rèn Cuốc Lượng Tử (1/2)',
          contextEn: 'Synthesizing 3 Starlight Crystals & 2 Meteorite Ores.',
          contextVi: 'Khử trường phản vật chất để đúc công cụ khai khoáng lượng tử.',
          question: 'Earth, Mars, and Jupiter are celestial bodies revolving around the sun known as a ____.',
          hintVi: 'Gợi ý: Các thiên thể quay quanh mặt trời như Trái Đất, Sao Hỏa là "planet" (hành tinh).',
          wordId: 'sp_2',
          word: 'planet',
          options: [
            { id: 'a', text: 'island', isCorrect: false, explanationEn: 'Island is on Earth.', explanationVi: 'Island là hòn đảo.' },
            { id: 'b', text: 'planet', isCorrect: true, explanationEn: 'Orbital path calculated!', explanationVi: 'Chính xác! Planet là hành tinh.' },
            { id: 'c', text: 'valley', isCorrect: false, explanationEn: 'Valley is low land.', explanationVi: 'Valley là thung lũng.' },
            { id: 'd', text: 'harbor', isCorrect: false, explanationEn: 'Harbor is for ships.', explanationVi: 'Harbor là bến cảng.' },
          ],
        },
        {
          id: 'q_sp_3',
          title: 'Hồi 2: Rèn Cuốc Lượng Tử (2/2)',
          contextEn: 'Calibrating the thruster power cells.',
          contextVi: 'Hiệu chuẩn lõi lực đẩy phản lực không gian.',
          question: 'A high-powered cylindrical vehicle propelled by exhaust gases used to travel to outer space is a ____.',
          hintVi: 'Gợi ý: Phương tiện phóng vào không gian có động cơ phản lực mạnh là "rocket" (tên lửa).',
          wordId: 'sp_3',
          word: 'rocket',
          options: [
            { id: 'a', text: 'submarine', isCorrect: false, explanationEn: 'Submarine dives underwater.', explanationVi: 'Submarine là tàu ngầm.' },
            { id: 'b', text: 'tractor', isCorrect: false, explanationEn: 'Tractor is for farming.', explanationVi: 'Tractor là máy kéo.' },
            { id: 'c', text: 'rocket', isCorrect: true, explanationEn: 'Quantum Pickaxe forged!', explanationVi: 'Tuyệt vời! Bạn đã chế tạo thành công Cuốc Lượng Tử!' },
            { id: 'd', text: 'sailboat', isCorrect: false, explanationEn: 'Sailboat uses wind.', explanationVi: 'Sailboat là thuyền buồm.' },
          ],
        },
      ],
      act3_chest: [
        {
          id: 'q_sp_4',
          title: 'Hồi 3: Mở Rương Tinh Tú (1/2)',
          contextEn: 'Unlocking the cosmic spiral reliquary.',
          contextVi: 'Mở khóa phong ấn hình xoắn ốc tinh vân.',
          question: 'A massive gravitationally bound system of millions or billions of stars like the Milky Way is a ____.',
          hintVi: 'Gợi ý: Hệ thống hàng tỷ vì sao như dải Ngân Hà được gọi là "galaxy" (thiên hà).',
          wordId: 'sp_4',
          word: 'galaxy',
          options: [
            { id: 'a', text: 'continent', isCorrect: false, explanationEn: 'Continent is on Earth.', explanationVi: 'Continent là lục địa.' },
            { id: 'b', text: 'galaxy', isCorrect: true, explanationEn: 'Galaxy lock cleared!', explanationVi: 'Chính xác! Khóa thiên hà đã mở!' },
            { id: 'c', text: 'archipelago', isCorrect: false, explanationEn: 'Archipelago is islands.', explanationVi: 'Archipelago là quần đảo.' },
            { id: 'd', text: 'peninsula', isCorrect: false, explanationEn: 'Peninsula is land.', explanationVi: 'Peninsula là bán đảo.' },
          ],
        },
        {
          id: 'q_sp_5',
          title: 'Hồi 3: Mở Rương Tinh Tú (2/2)',
          contextEn: 'Identifying the space voyager crest.',
          contextVi: 'Phù hiệu người du hành vũ trụ phát sáng trên nắp rương.',
          question: 'A person trained and equipped to travel in a spacecraft into outer space is an ____.',
          hintVi: 'Gợi ý: Người bay vào không gian thám hiểm là "astronaut" (phi hành gia).',
          wordId: 'sp_5',
          word: 'astronaut',
          options: [
            { id: 'a', text: 'carpenter', isCorrect: false, explanationEn: 'Carpenter works with wood.', explanationVi: 'Carpenter là thợ mộc.' },
            { id: 'b', text: 'architect', isCorrect: false, explanationEn: 'Architect designs buildings.', explanationVi: 'Architect là kiến trúc sư.' },
            { id: 'c', text: 'astronaut', isCorrect: true, explanationEn: 'Found Stargate Warp Key!', explanationVi: 'Xuất sắc! Bạn tìm thấy Chìa Khóa Cổng Dịch Chuyển!' },
            { id: 'd', text: 'electrician', isCorrect: false, explanationEn: 'Electrician fixes wires.', explanationVi: 'Electrician là thợ điện.' },
          ],
        },
      ],
      act4_gate: [
        {
          id: 'q_sp_6',
          title: 'Hồi 4: Kích hoạt Cổng Dịch Chuyển (1/2)',
          contextEn: 'Aligning optical lenses on the stargate arch.',
          contextVi: 'Cân chỉnh thấu kính quang học trên vòm cổng sao.',
          question: 'An optical instrument designed to observe distant stars and planets is a ____.',
          hintVi: 'Gợi ý: Dụng cụ quang học quan sát các thiên thể xa xôi là "telescope" (kính viễn vọng).',
          wordId: 'sp_6',
          word: 'telescope',
          options: [
            { id: 'a', text: 'microscope', isCorrect: false, explanationEn: 'Microscope sees tiny things.', explanationVi: 'Microscope là kính hiển vi.' },
            { id: 'b', text: 'telescope', isCorrect: true, explanationEn: 'Lenses aligned with warp horizon!', explanationVi: 'Thấu kính đã hội tụ chùm tia ngân hà!' },
            { id: 'c', text: 'periscope', isCorrect: false, explanationEn: 'Periscope is for submarines.', explanationVi: 'Periscope là kính tiềm vọng.' },
            { id: 'd', text: 'stethoscope', isCorrect: false, explanationEn: 'Stethoscope is for doctors.', explanationVi: 'Stethoscope là ống nghe y tế.' },
          ],
        },
        {
          id: 'q_sp_7',
          title: 'Hồi 4: Kích hoạt Cổng Dịch Chuyển (2/2)',
          contextEn: 'Final warp singularity ignition.',
          contextVi: 'Khởi động điểm kỳ dị đưa con tàu vào siêu không gian.',
          question: 'All of existing matter, space, and galaxies considered as an immense whole is the ____.',
          hintVi: 'Gợi ý: Toàn bộ không gian, thời gian và vật chất tồn tại là "universe" (vũ trụ).',
          wordId: 'sp_7',
          word: 'universe',
          options: [
            { id: 'a', text: 'atmosphere', isCorrect: false, explanationEn: 'Atmosphere is gases around a planet.', explanationVi: 'Atmosphere là bầu khí quyển.' },
            { id: 'b', text: 'biosphere', isCorrect: false, explanationEn: 'Biosphere is living things.', explanationVi: 'Biosphere là sinh quyển.' },
            { id: 'c', text: 'hemisphere', isCorrect: false, explanationEn: 'Hemisphere is half a sphere.', explanationVi: 'Hemisphere là bán cầu.' },
            { id: 'd', text: 'universe', isCorrect: true, explanationEn: 'Cosmic Warp Gate activated! Victory!', explanationVi: 'Chiến thắng! Cổng Ngân Hà đã mở lối du hành không gian!' },
          ],
        },
      ],
    },
  },
};

// Fallback lookup
export const DEFAULT_FALLBACK_QUEST = THEME_QUESTS.animals;

export function getFallbackQuestForTheme(themeId: string): DynamicQuest {
  if (THEME_QUESTS[themeId]) return THEME_QUESTS[themeId];
  const theme = ISLAND_THEMES[themeId] || ISLAND_THEMES.default;
  return {
    ...DEFAULT_FALLBACK_QUEST,
    theme,
  };
}
