import Link from "next/link";
import RequireAuth from "@/components/RequireAuth";
import {
  ArrowLeft,
  ArrowRight,
  Gamepad2,
  Keyboard,
  LockKeyhole,
  Play,
  Sparkles,
  Trophy,
} from "lucide-react";

const upcomingGames = [
  {
    title: "Grammar Ninja",
    description: "Chọn cấu trúc đúng trước khi thời gian kết thúc.",
    type: "Ngữ pháp · phản xạ",
  },
  {
    title: "Phrase Sprint",
    description: "Ghép cụm từ tự nhiên và về đích trong thời gian ngắn nhất.",
    type: "Cụm từ · tốc độ",
  },
];

function GameLibraryPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-300 selection:bg-cyan-500/30">
      <header className="border-b border-zinc-800 bg-zinc-950/85 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Bảng điều khiển
          </Link>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-cyan-400">
            <Gamepad2 className="w-4 h-4" /> Game library
          </div>
        </div>
      </header>

      <section className="border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 py-14 sm:py-20">
          <div className="max-w-2xl">
            <p className="mb-4 flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-[0.22em] text-cyan-400">
              <Sparkles className="w-4 h-4" /> Luyện qua trò chơi
            </p>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white">Chọn thử thách của bạn.</h1>
            <p className="mt-5 text-base sm:text-lg leading-relaxed text-zinc-400">
              Mỗi game rèn một kỹ năng khác nhau. Bắt đầu với Word Blaster, rồi quay lại đây khi có thử thách mới.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 sm:px-6 py-10 sm:py-14">
        <div className="flex items-center justify-between gap-4 mb-5">
          <h2 className="text-sm font-mono font-bold uppercase tracking-[0.2em] text-zinc-500">Đang có thể chơi</h2>
          <span className="text-sm text-zinc-500">01 game</span>
        </div>

        <Link
          href="/game/word-blaster"
          className="group grid grid-cols-1 md:grid-cols-[auto_1fr_auto] gap-6 md:gap-8 items-center border border-cyan-500/40 bg-cyan-500/5 p-6 sm:p-8 hover:bg-cyan-500 hover:border-cyan-500 transition-colors"
        >
          <div className="w-16 h-16 flex items-center justify-center bg-cyan-500 text-zinc-950 group-hover:bg-zinc-950 group-hover:text-cyan-400 transition-colors">
            <Keyboard className="w-8 h-8" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <h3 className="text-2xl sm:text-3xl font-black text-white group-hover:text-zinc-950 transition-colors">Word Blaster</h3>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400 group-hover:text-zinc-800 transition-colors">Từ vựng · gõ phím</span>
            </div>
            <p className="mt-3 max-w-xl leading-relaxed text-zinc-400 group-hover:text-zinc-800 transition-colors">
              Tiêu diệt những từ đang rơi bằng tốc độ gõ và xây combo phản xạ tiếng Anh.
            </p>
            <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-zinc-300 group-hover:text-zinc-950 transition-colors">
              <Trophy className="w-4 h-4" /> Phù hợp khi bạn dùng máy tính
            </div>
          </div>
          <span className="inline-flex items-center justify-center gap-2 bg-white px-5 py-3 text-sm font-black uppercase tracking-wider text-zinc-950 group-hover:bg-zinc-950 group-hover:text-white transition-colors">
            <Play className="w-4 h-4 fill-current" /> Chơi ngay
          </span>
        </Link>

        <div className="flex items-center justify-between gap-4 mt-12 mb-5">
          <h2 className="text-sm font-mono font-bold uppercase tracking-[0.2em] text-zinc-500">Sắp ra mắt</h2>
          <span className="text-sm text-zinc-500">02 game</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 border border-zinc-800 divide-y md:divide-y-0 md:divide-x divide-zinc-800">
          {upcomingGames.map((game) => (
            <article key={game.title} className="p-6 sm:p-7 bg-zinc-900/30">
              <div className="flex items-start justify-between gap-4">
                <div className="w-10 h-10 flex items-center justify-center bg-zinc-800 text-zinc-500">
                  <LockKeyhole className="w-4 h-4" />
                </div>
                <span className="text-xs font-mono uppercase tracking-wider text-zinc-600">Coming soon</span>
              </div>
              <h3 className="mt-8 text-xl font-bold text-zinc-300">{game.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-500">{game.description}</p>
              <p className="mt-5 flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-zinc-600">
                <ArrowRight className="w-3.5 h-3.5" /> {game.type}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default function GameIndexPage() {
  return <RequireAuth><GameLibraryPage /></RequireAuth>;
}
