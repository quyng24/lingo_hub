# 🚀 English Learning App: Daily Learn & Game Hub

Dự án này là một nền tảng học tiếng Anh kết hợp giữa **Học tập mỗi ngày (Daily Learn)** và **Giải trí (Game Hub)**.

Mục tiêu cốt lõi (MVP) của dự án là thiết kế một luồng học tập tự nhiên và hiệu quả:
**`Word (Từ vựng) ➔ Phrase (Cụm từ) ➔ Sentence (Câu) ➔ Usage (Thực hành qua ngữ cảnh)`**

---

## 📌 Tình trạng dự án (Current Status)

Dự án đã hoàn thành luồng học và kiểm tra Daily Learn, đồng thời triển khai tích hợp Supabase cho từ vựng, bài tập và Word Blaster. Cơ sở dữ liệu hiện có 250 từ, 7 chủ đề, 20 câu hỏi và 230 liên kết từ-chủ đề.

### ✅ Phase 1: Kiến thức đầu vào (Learning Flow)

- Cung cấp bài học hằng ngày; hiện chọn tối đa 10 từ từ 20 từ Daily Learn trong Supabase, ưu tiên từ đến hạn ôn.
- Áp dụng triết lý học vi mô (Micro-learning) bằng cách tách biệt sự chú ý, học qua 3 bước màn hình:
  1. **WordCard**: Từ vựng, phát âm, loại từ, nghĩa cơ bản.
  2. **PhraseList**: Các cụm từ thường đi kèm (Collocations) với từ vừa học.
  3. **ExampleSentence**: Câu ví dụ thực tế có highlight từ vựng.

### ✅ Phase 2: Thực hành & Đo lường (Exercise & Review Flow)

- **Contextual Fill-in-the-blank**: Bài tập trắc nghiệm điền khuyết dựa trên ngữ cảnh thực tế (không hỏi từ rời rạc).
- **Interactive UI**: Giao diện chọn đáp án trực quan (Đổi màu ngay khi Check: Xanh/Đúng, Đỏ/Sai).
- **Result Dashboard**: Bảng điểm thống kê dạng Retro/ASCII Box tổng hợp số câu đúng, tỷ lệ % (Accuracy), số từ đã học, và số từ cần ôn tập.
- **Review Mistakes**: Tự động thu thập ID các từ vựng trả lời sai và bắt buộc người dùng học lại (hiển thị lại WordCard) trước khi kết thúc bài học.

### ✅ Phase 3: Supabase, SRS và Game Integration

- Tải từ vựng, bài tập và chủ đề Word Blaster từ Supabase; các file CSV và mock data TypeScript đã được gỡ khỏi runtime.
- Lịch ôn SRS dùng chu kỳ 1, 3, 7, 14, 30 ngày khi trả lời đúng và đặt lại 1 ngày khi trả lời sai.

### 🚧 Phase 4: Auth và tiến trình cá nhân

- Supabase Auth dùng Email/Password; OAuth có thể bổ sung sau.
- Sau khi đăng nhập, người dùng được chuyển tới dashboard riêng với tổng số từ đã học, đếm từ bảng `user_learning_progress`.
- Daily Learn và các trang game yêu cầu đăng nhập; bài tập chỉ lấy câu hỏi của 10 từ trong bài học hiện tại. RLS chỉ cho phép tài khoản đọc/ghi tiến trình của chính mình.

---

## 🛠 Tech Stack

- **Framework**: Next.js (App Router)
- **Ngôn ngữ**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand, React hooks
- **Database**: Supabase (PostgreSQL, public read-only RLS)

---

## 📂 Cấu trúc thư mục (Folder Structure)

Cấu trúc được tối ưu cho Next.js App Router:

```text
├── app/
│   ├── daily-learn/
│   │   ├── exercise/       # Giao diện bài tập, tính điểm, ôn tập (Phase 2)
│   │   │   └── page.tsx
│   │   ├── learn/          # Giao diện học Word -> Phrase -> Sentence (Phase 1)
│   │   │   └── page.tsx
│   │   └── progress/       # (TODO) Tiến độ học tập
│   ├── game/               # Game Hub
│   │   └── word-blaster/   # Game mini hiện có
│   ├── layout.tsx & globals.css
│   └── page.tsx
├── components/
│   └── shared/             # UI Components tái sử dụng
│       ├── ExampleSentence.tsx
│       ├── ExerciseCard.tsx
│       ├── PhraseList.tsx
│       ├── WordCard.tsx
│       └── ProgressBar.tsx # Thanh tiến trình học
├── lib/
│   ├── learningData.ts     # Truy vấn và ánh xạ dữ liệu Supabase
│   └── supabase.ts         # Supabase client
├── hooks/
│   └── useGameEngine.ts    # Custom hook cho Game Hub
├── stores/
│   └── learningStore.ts    # Quản lý Global State (Zustand)
├── types/
│   └── index.ts            # Khai báo TypeScript Interfaces (Vocabulary, Exercise)
└── utils/                  # Hàm hỗ trợ
    ├── dailyLesson.ts      # Chọn từ mới và từ đến hạn ôn
    └── exercise.ts         # Logic chấm điểm, random câu hỏi
```

# 🧠 Data Models chính

## 1. Vocabulary

Type định nghĩa cấu trúc của một từ vựng hoàn chỉnh:

```typescript
export type Vocabulary = {
  id: string;
  word: string;
  pronunciation: string;
  partOfSpeech: string;
  meanings: string[];
  commonPhrases: { phrase: string; meaning: string }[];
  examples: { sentence: string; translation: string }[];
  difficulty: "A1" | "A2" | "B1" | "B2";
  tags: string[];
};
```

## 2. Exercise Question

Type định nghĩa bài tập trắc nghiệm điền khuyết ngữ cảnh:

```
export type ExerciseQuestion = {
  id: string
  wordId: string      // Liên kết với Vocabulary.id để ôn tập nếu sai
  context: string     // Ngữ cảnh gợi ý
  sentence: string    // Câu chứa chỗ trống "____"
  options: string[]   // 4 đáp án Multiple choice
  correctAnswer: string
}
```

# 💻 Cách chạy dự án

## Supabase (Phase 3–4)

1. Tạo một Supabase project.
2. Mở **SQL Editor**, chạy lần lượt các migration trong `supabase/migrations/`: schema học liệu và sau đó bảng tiến trình có RLS.
3. Mở `.env.local` trong thư mục gốc, rồi điền Project URL và publishable key (hoặc legacy anon key) từ **Project Settings → API**.
4. Trong **Authentication → Providers**, bật Email và cấu hình Google/GitHub. Tạo OAuth app tương ứng ở Google Cloud Console và GitHub Developer Settings, điền Client ID/Secret ở Supabase, đồng thời khai báo callback URI của Supabase (dạng `https://<project-ref>.supabase.co/auth/v1/callback`) trong OAuth app; không đặt các secret OAuth trong frontend.
5. Trong **Authentication → URL Configuration**, đặt Site URL của ứng dụng và thêm Redirect URLs `http://localhost:3000/auth` cùng URL `/auth` trên domain triển khai.
6. Khởi động lại dev server sau khi cập nhật `.env.local`.

Không dùng `service_role` key trong ứng dụng hoặc commit key vào Git. Dữ liệu học liệu vẫn được đọc công khai; bảng tiến trình chỉ cấp quyền cho `authenticated` và RLS kiểm tra `auth.uid() = user_id`. Lịch tiến trình cũ trong localStorage không được tự nhập vào tài khoản vì không thể xác định chủ sở hữu một cách an toàn.

Cài đặt dependencies:

```
npm install
# hoặc
yarn install
```

Chạy môi trường phát triển (Development):

```
npm run dev
# hoặc
yarn dev
```

Truy cập http://localhost:3000 trên trình duyệt để trải nghiệm.
