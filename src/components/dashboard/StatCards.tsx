"use client";

import Link from "next/link";
import { BookOpen, Flame, RotateCcw, Trophy } from "lucide-react";
import { formatRelativeStudyDate } from "@/utils/date";

interface StatCardsProps {
  streakCount: number;
  lastStudyDate: string | null;
  dueWords: number;
  learningWords: number;
  newWords: number;
  rememberingWords: number;
  masteredWords: number;
  masteredPercent: number;
  isLoading: boolean;
}

export default function StatCards({
  streakCount,
  lastStudyDate,
  dueWords,
  learningWords,
  newWords,
  rememberingWords,
  masteredWords,
  masteredPercent,
  isLoading,
}: StatCardsProps) {
  return (
    <section aria-label="Thống kê học tập" className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {/* 1. CHUỖI HỌC */}
      <div className="border border-zinc-800 bg-zinc-900/40 p-3.5 sm:p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between gap-1">
          <span className="text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 truncate">
            Chuỗi ngày
          </span>
          <div className="w-6 h-6 sm:w-7 sm:h-7 shrink-0 flex items-center justify-center bg-orange-500/10 border border-orange-500/20 text-orange-400">
            <Flame className="w-3.5 h-3.5 fill-current" />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-light font-mono tabular-nums text-white">
              {isLoading ? "—" : streakCount}
            </span>
            <span className="text-xs text-zinc-400 font-mono">ngày</span>
          </div>
          <p className="mt-1 text-[11px] text-zinc-400 truncate">
            Gần nhất: {formatRelativeStudyDate(lastStudyDate)}
          </p>
        </div>
      </div>

      {/* 2. CẦN ÔN HÔM NAY */}
      <div
        className={`border p-3.5 sm:p-5 flex flex-col justify-between transition-colors ${
          dueWords > 0
            ? "border-amber-500/40 bg-amber-500/5"
            : "border-zinc-800 bg-zinc-900/40"
        }`}
      >
        <div className="flex items-center justify-between gap-1">
          <span className="text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 truncate">
            Cần ôn tập
          </span>
          <div
            className={`w-6 h-6 sm:w-7 sm:h-7 shrink-0 flex items-center justify-center border ${
              dueWords > 0
                ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                : "bg-zinc-800 border-zinc-700 text-zinc-400"
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-baseline gap-1.5">
            <span
              className={`text-2xl sm:text-3xl font-light font-mono tabular-nums ${
                dueWords > 0 ? "text-amber-300 font-bold" : "text-zinc-200"
              }`}
            >
              {isLoading ? "—" : dueWords}
            </span>
            <span className="text-xs text-zinc-400 font-mono">từ</span>
          </div>
          <p className="mt-1 text-[11px] text-zinc-400 truncate">
            {dueWords > 0 ? (
              <Link
                href="/daily-learn/learn"
                className="text-amber-400 hover:underline font-medium"
              >
                Ôn ngay →
              </Link>
            ) : (
              <span className="text-emerald-400">Đã xong hôm nay</span>
            )}
          </p>
        </div>
      </div>

      {/* 3. ĐANG HỌC */}
      <div className="border border-zinc-800 bg-zinc-900/40 p-3.5 sm:p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between gap-1">
          <span className="text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 truncate">
            Đang học
          </span>
          <div className="w-6 h-6 sm:w-7 sm:h-7 shrink-0 flex items-center justify-center bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <BookOpen className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-light font-mono tabular-nums text-emerald-400">
              {isLoading ? "—" : learningWords}
            </span>
            <span className="text-xs text-zinc-400 font-mono">từ</span>
          </div>
          <p className="mt-1 text-[11px] text-zinc-400 truncate">
            {newWords} mới · {rememberingWords} đang nhớ
          </p>
        </div>
      </div>

      {/* 4. ĐÃ THÀNH THẠO */}
      <div className="border border-zinc-800 bg-zinc-900/40 p-3.5 sm:p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between gap-1">
          <span className="text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 truncate">
            Thành thạo
          </span>
          <div className="w-6 h-6 sm:w-7 sm:h-7 shrink-0 flex items-center justify-center bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Trophy className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-light font-mono tabular-nums text-cyan-300">
              {isLoading ? "—" : masteredWords}
            </span>
            <span className="text-xs text-zinc-400 font-mono">từ</span>
          </div>
          <p className="mt-1 text-[11px] text-zinc-400 truncate">
            {masteredPercent}% tổng từ vựng
          </p>
        </div>
      </div>
    </section>
  );
}

