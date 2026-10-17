"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Gamepad2 } from "lucide-react";

export default function ActionCards() {
  return (
    <section aria-label="Hoạt động học tập" className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-zinc-400">
          Hoạt động chính
        </h2>
        <span className="text-xs text-zinc-400 font-mono">10–15 phút/ngày</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        {/* CARD 1: DAILY LEARN */}
        <Link
          href="/daily-learn/learn"
          className="group flex flex-col justify-between border border-emerald-500/40 bg-zinc-900/60 p-5 sm:p-6 hover:bg-emerald-500 hover:border-emerald-500 transition-all duration-200"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 flex items-center justify-center bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 group-hover:bg-zinc-950 group-hover:text-emerald-400 group-hover:border-zinc-950 transition-colors">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-400 group-hover:text-zinc-950 transition-colors">
              10 từ / ngày
            </span>
          </div>

          <div className="mt-5">
            <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-zinc-950 transition-colors">
              Học hôm nay
            </h3>
            <p className="mt-1 text-xs text-zinc-400 group-hover:text-zinc-900 transition-colors leading-relaxed">
              Từ mới và lịch ôn tập theo chu kỳ lặp lại ngắt quãng.
            </p>
            <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 group-hover:text-zinc-950 transition-colors">
              Bắt đầu học <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>

        {/* CARD 2: WORD BLASTER */}
        <Link
          href="/game/word-blaster"
          className="group flex flex-col justify-between border border-cyan-500/40 bg-zinc-900/60 p-5 sm:p-6 hover:bg-cyan-500 hover:border-cyan-500 transition-all duration-200"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 flex items-center justify-center bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 group-hover:bg-zinc-950 group-hover:text-cyan-400 group-hover:border-zinc-950 transition-colors">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-400 group-hover:text-zinc-950 transition-colors">
              Phản xạ gõ
            </span>
          </div>

          <div className="mt-5">
            <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-zinc-950 transition-colors">
              Word Blaster
            </h3>
            <p className="mt-1 text-xs text-zinc-400 group-hover:text-zinc-900 transition-colors leading-relaxed">
              Tiêu diệt từ đang rơi bằng tốc độ gõ phím để rèn phản xạ.
            </p>
            <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-cyan-300 group-hover:text-zinc-950 transition-colors">
              Chơi ngay <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}

