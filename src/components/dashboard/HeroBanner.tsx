"use client";

import Link from "next/link";
import { ArrowRight, Clock, Gamepad2, Zap } from "lucide-react";

interface HeroBannerProps {
  userEmail?: string | null;
  dueWords: number;
}

export default function HeroBanner({ userEmail, dueWords }: HeroBannerProps) {
  return (
    <section className="relative overflow-hidden border border-zinc-800 bg-linear-to-b from-zinc-900/60 to-zinc-950 p-5 sm:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-xl">
          {userEmail && (
            <p className="text-xs font-mono text-zinc-500 mb-2 truncate">
              {userEmail}
            </p>
          )}

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white leading-snug">
            Sẵn sàng để{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-cyan-400">
              tiếp tục học?
            </span>
          </h1>

          <p className="mt-2 text-xs sm:text-sm text-zinc-400 leading-relaxed">
            Học từ mới, ôn tập ngắt quãng và củng cố phản xạ ngôn ngữ qua trò chơi.
          </p>

          {/* Conditional Due Words Alert */}
          {dueWords > 0 && (
            <div className="mt-3.5 inline-flex items-center gap-2 px-3 py-1.5 border border-amber-500/40 bg-amber-500/10 text-amber-300 text-xs font-medium">
              <Clock className="w-3.5 h-3.5 shrink-0" />
              <span>
                Bạn có <strong className="font-bold text-white">{dueWords} từ</strong> đến hạn ôn tập hôm nay
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
          <Link
            href="/daily-learn/learn"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs uppercase tracking-widest transition-colors shadow-md shadow-emerald-500/10"
          >
            <Zap className="w-4 h-4 fill-current" />
            {dueWords > 0 ? "Ôn tập ngay" : "Học hôm nay"}
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/game"
            className="inline-flex items-center justify-center gap-2 px-4 py-3 border border-zinc-700 bg-zinc-900/60 hover:border-zinc-500 text-zinc-300 font-bold text-xs uppercase tracking-widest transition-colors"
          >
            <Gamepad2 className="w-4 h-4 text-cyan-400" />
            Thư viện Game
          </Link>
        </div>
      </div>
    </section>
  );
}

