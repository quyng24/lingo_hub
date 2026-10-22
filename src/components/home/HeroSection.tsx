import Link from "next/link";
import { ArrowRight, Flame, Gamepad2, Sparkles, Zap } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative border-b border-zinc-800 overflow-hidden bg-zinc-950">
      {/* Background Grid Pattern & Radial Glow */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px] pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 sm:w-150 h-96 bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-6 py-16 sm:py-24 lg:py-32 flex flex-col items-start">
        {/* Release / Status Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-mono uppercase tracking-wider mb-6 sm:mb-8">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Hệ sinh thái Daily English & Spaced Repetition (SRS)</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white leading-[1.08] tracking-tight mb-6 max-w-5xl">
          HỌC TIẾNG ANH TỰ NHIÊN, <br />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 via-teal-300 to-cyan-400">
            PHẢN XẠ QUA TỪNG VÁN GAME.
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="text-base sm:text-lg md:text-xl text-zinc-400 max-w-3xl mb-10 leading-relaxed">
          Tạm biệt cách học vẹt nhồi nhét từ rời rạc. LingoHub áp dụng phương pháp{" "}
          <strong className="text-zinc-200 font-semibold">Micro-learning 4 bước</strong>{" "}
          (Từ vựng ➔ Cụm từ ➔ Câu ngữ cảnh ➔ Bài tập), kết hợp thuật toán lặp lại ngắt quãng (SRS)
          và kho game tương tác (Word Blaster, Word Island...) để biến tiếng Anh thành phản xạ tự nhiên.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3.5 w-full sm:w-auto">
          <Link
            href="/daily-learn/learn"
            className="px-8 py-4 sm:py-5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black uppercase tracking-widest text-xs sm:text-sm flex items-center justify-center gap-3 transition-all shadow-lg shadow-emerald-500/15"
          >
            <Zap className="w-4 h-4 fill-current" />
            Bắt đầu học hôm nay
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/game"
            className="px-8 py-4 sm:py-5 bg-zinc-900/80 hover:bg-zinc-800 border-2 border-zinc-700 hover:border-zinc-500 text-white font-bold uppercase tracking-widest text-xs sm:text-sm flex items-center justify-center gap-3 transition-all"
          >
            <Gamepad2 className="w-4 h-4 text-cyan-400" />
            Khu trò chơi
          </Link>
          <Link
            href="/dashboard"
            className="px-6 py-4 sm:py-5 bg-transparent text-zinc-400 hover:text-white font-mono uppercase tracking-wider text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors border border-zinc-800 hover:border-zinc-700"
          >
            Bảng điều khiển →
          </Link>
        </div>

        {/* Quick Highlights Strip */}
        <div className="mt-12 sm:mt-16 pt-8 border-t border-zinc-800/80 w-full grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-zinc-400 font-mono text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
            <span>250+ Từ vựng CEFR (A1–B2)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0" />
            <span>7 Chủ đề đa dạng & Game</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-300 shrink-0" />
            <span>Chu kỳ SRS 1-3-7-14-30 ngày</span>
          </div>
          <div className="flex items-center gap-2">
            <Flame className="w-3.5 h-3.5 text-orange-400 shrink-0" />
            <span>Duy trì Daily Streak</span>
          </div>
        </div>
      </div>
    </section>
  );
}

