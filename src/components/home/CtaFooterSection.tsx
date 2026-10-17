import Link from "next/link";
import { ArrowRight, Gamepad2, Zap } from "lucide-react";

export default function CtaFooterSection() {
  return (
    <>
      {/* 🚀 FINAL CALL TO ACTION */}
      <section className="bg-emerald-500 text-zinc-950">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 py-16 sm:py-24 lg:py-28 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 sm:gap-10">
          <div className="max-w-2xl">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-950 block mb-2">
              Khởi đầu ngay hôm nay
            </span>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight leading-tight">
              Sẵn sàng phá đảo <br /> rào cản tiếng Anh?
            </h2>
            <p className="mt-4 text-base sm:text-lg font-medium text-emerald-950 leading-relaxed">
              Chỉ 10–15 phút mỗi ngày. Không còn những giờ học ngữ pháp nhàm chán.
              Học từ vựng trong ngữ cảnh và phản xạ qua từng ván game.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3.5 w-full md:w-auto shrink-0">
            <Link
              href="/daily-learn/learn"
              className="px-8 py-4 sm:py-5 bg-zinc-950 text-white font-black uppercase tracking-widest text-xs sm:text-sm flex items-center justify-center gap-3 hover:bg-zinc-800 transition-all shadow-xl"
            >
              <Zap className="w-4 h-4 text-emerald-400" />
              Bắt đầu học ngay
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/game/word-blaster"
              className="px-8 py-4 sm:py-5 bg-emerald-600 border-2 border-zinc-950 text-zinc-950 font-black uppercase tracking-widest text-xs sm:text-sm flex items-center justify-center gap-3 hover:bg-emerald-400 transition-all"
            >
              <Gamepad2 className="w-4 h-4 text-zinc-950" />
              Chơi Word Blaster
            </Link>
          </div>
        </div>
      </section>

      {/* 📜 FOOTER */}
      <footer className="bg-zinc-950 border-t border-zinc-900 py-10 px-5 sm:px-6 text-zinc-500 text-xs font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} LingoHub · Daily Learn & Game Hub Platform.</p>
          <div className="flex items-center gap-4 text-zinc-400">
            <span>Next.js 16</span>
            <span>·</span>
            <span>Supabase RLS</span>
            <span>·</span>
            <span>Spaced Repetition</span>
          </div>
        </div>
      </footer>
    </>
  );
}

