import Link from "next/link";
import {
  ArrowLeft,
  Gamepad2,
  Keyboard,
  Lock,
  Play,
  Sparkles,
} from "lucide-react";
import AccountControl from "@/components/AccountControl";

const upcomingGames = [
  {
    title: "Grammar Ninja",
    description: "Chém đúng cấu trúc ngữ pháp trước khi bom nổ.",
    type: "Ngữ pháp · Tốc độ",
  },
  {
    title: "Phrase Sprint",
    description: "Nối cụm từ tiếng Anh tự nhiên để về đích nhanh nhất.",
    type: "Cụm từ · Phản xạ",
  },
];

export default function GameLibraryPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-300 selection:bg-cyan-500/30 flex flex-col font-sans">
      {/* 🧭 STICKY NAVIGATION */}
      <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-zinc-950/85 backdrop-blur-md px-4 sm:px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Dashboard</span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider">
              <Gamepad2 className="w-3.5 h-3.5" />
              <span>Game Hub</span>
            </div>
            <AccountControl />
          </div>
        </div>
      </header>

      {/* 🎮 COMPACT CONTENT WRAPPER */}
      <div className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Compact Title Row (Tối giản, không chiếm diện tích màn hình) */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-zinc-800/80 pb-4">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-emerald-400 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Luyện phản xạ qua trò chơi</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase">
              Chọn thử thách từ vựng
            </h1>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>02 Game sẵn sàng chơi trên PC/Laptop</span>
          </div>
        </div>

        {/* 🚀 ACTIVE GAMES GRID (2 CỘT TẬP TRUNG) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {/* GAME 1: WORD BLASTER */}
          <Link
            href="/game/word-blaster"
            className="group relative flex flex-col justify-between border border-cyan-500/30 bg-zinc-900/40 p-5 sm:p-6 hover:border-cyan-400 hover:bg-zinc-900/80 transition-all duration-200 hover:shadow-[0_0_30px_rgba(6,182,212,0.12)]"
          >
            <div>
              {/* Badge & Meta */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[11px] font-mono font-bold uppercase tracking-wider">
                  <Keyboard className="w-3.5 h-3.5" />
                  Gõ phím phản xạ
                </span>
                <span className="text-[10px] font-mono uppercase text-zinc-500">
                  Arcade Shooter
                </span>
              </div>

              {/* Title & Icon Header */}
              <div className="flex items-start gap-3.5 mb-3">
                <div className="w-12 h-12 bg-cyan-500/15 border border-cyan-500/40 text-cyan-400 flex items-center justify-center shrink-0 group-hover:bg-cyan-500 group-hover:text-zinc-950 transition-colors">
                  <Keyboard className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-white group-hover:text-cyan-400 transition-colors tracking-tight">
                    Word Blaster
                  </h2>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Đấu trường gõ phím không gian retro
                  </p>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed line-clamp-2">
                Bắn nổ từ vựng đang rơi bằng tốc độ gõ phím 10 ngón. Giữ chuỗi Combo Multiplier để đạt điểm cao và bảo vệ 3 mạng sống.
              </p>

              {/* Features pills */}
              <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-zinc-800/80 text-[11px] font-mono text-zinc-400">
                <span className="px-2 py-0.5 bg-zinc-800/60 border border-zinc-700/60 text-zinc-300">
                  ⚡ 7 Chủ đề vựng
                </span>
                <span className="px-2 py-0.5 bg-zinc-800/60 border border-zinc-700/60 text-zinc-300">
                  🔥 Combo x2, x3
                </span>
                <span className="px-2 py-0.5 bg-zinc-800/60 border border-zinc-700/60 text-zinc-300">
                  🔊 Web Audio
                </span>
              </div>
            </div>

            {/* Action CTA */}
            <div className="mt-5 pt-3 flex items-center justify-between border-t border-zinc-800/60">
              <span className="text-xs font-mono text-cyan-400/80 group-hover:text-cyan-300 transition-colors">
                Nhấn để bắt đầu
              </span>
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-cyan-500 text-zinc-950 font-black text-xs uppercase tracking-wider group-hover:bg-cyan-400 transition-colors">
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Chơi ngay</span>
              </div>
            </div>
          </Link>

          {/* GAME 2: WORD ISLAND */}
          <Link
            href="/game/word-island"
            className="group relative flex flex-col justify-between border border-amber-500/30 bg-zinc-900/40 p-5 sm:p-6 hover:border-amber-400 hover:bg-zinc-900/80 transition-all duration-200 hover:shadow-[0_0_30px_rgba(245,158,11,0.12)]"
          >
            <div>
              {/* Badge & Meta */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] font-mono font-bold uppercase tracking-wider">
                  <span>🏝️</span>
                  Sinh tồn 2D Pixel
                </span>
                <span className="text-[10px] font-mono uppercase text-zinc-500">
                  RPG Adventure
                </span>
              </div>

              {/* Title & Icon Header */}
              <div className="flex items-start gap-3.5 mb-3">
                <div className="w-12 h-12 bg-amber-500/15 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0 group-hover:bg-amber-500 group-hover:text-zinc-950 transition-colors text-xl">
                  🏝️
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-white group-hover:text-amber-400 transition-colors tracking-tight">
                    Word Island
                  </h2>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Phiêu lưu sinh tồn &amp; giải đố đảo hoang
                  </p>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed line-clamp-2">
                Khám phá hoang đảo 2D, thu thập gỗ và đá, trò chuyện với Thuyền trưởng Minh và giải đố từ vựng để mở Cổng Cổ Đại.
              </p>

              {/* Features pills */}
              <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-zinc-800/80 text-[11px] font-mono text-zinc-400">
                <span className="px-2 py-0.5 bg-zinc-800/60 border border-zinc-700/60 text-zinc-300">
                  🎮 WASD &amp; Phím [E]
                </span>
                <span className="px-2 py-0.5 bg-zinc-800/60 border border-zinc-700/60 text-zinc-300">
                  🗺️ Canvas 60 FPS
                </span>
                <span className="px-2 py-0.5 bg-zinc-800/60 border border-zinc-700/60 text-zinc-300">
                  📚 Đố từ ngữ cảnh
                </span>
              </div>
            </div>

            {/* Action CTA */}
            <div className="mt-5 pt-3 flex items-center justify-between border-t border-zinc-800/60">
              <span className="text-xs font-mono text-amber-400/80 group-hover:text-amber-300 transition-colors">
                Nhấn để bắt đầu
              </span>
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-500 text-zinc-950 font-black text-xs uppercase tracking-wider group-hover:bg-amber-400 transition-colors">
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Chơi ngay</span>
              </div>
            </div>
          </Link>
        </div>

        {/* 🔒 COMPACT UPCOMING GAMES STRIP (Gọn gàng, không kéo dài màn hình) */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-500">
              Dự án trò chơi đang phát triển
            </span>
            <span className="text-[11px] font-mono text-zinc-600">Coming soon</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {upcomingGames.map((game) => (
              <div
                key={game.title}
                className="flex items-center justify-between gap-3 p-3.5 border border-zinc-800/70 bg-zinc-900/20"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 flex items-center justify-center bg-zinc-800/60 border border-zinc-700/40 text-zinc-500 shrink-0">
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs font-bold text-zinc-300 truncate">
                      {game.title}
                    </h3>
                    <p className="text-[11px] text-zinc-500 truncate mt-0.5">
                      {game.description}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-mono uppercase text-zinc-500 shrink-0 px-2 py-0.5 border border-zinc-800">
                  {game.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
