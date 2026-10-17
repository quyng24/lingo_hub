"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProgressRing from "@/components/ProgressRing";

interface MemoryProgressCardProps {
  totalWords: number;
  newWords: number;
  rememberingWords: number;
  masteredWords: number;
  masteredPercent: number;
  newPercent: number;
  rememberingPercent: number;
}

export default function MemoryProgressCard({
  totalWords,
  newWords,
  rememberingWords,
  masteredWords,
  masteredPercent,
  newPercent,
  rememberingPercent,
}: MemoryProgressCardProps) {
  return (
    <section
      aria-label="Tiến độ ghi nhớ từ vựng"
      className="border border-zinc-800 bg-zinc-900/40 p-5 sm:p-6 space-y-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-zinc-400">
            Tiến độ ghi nhớ
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            {totalWords} từ trong tiến trình
          </p>
        </div>
        <Link
          href="/daily-learn/progress"
          className="inline-flex items-center gap-1 text-xs font-mono uppercase text-emerald-400 hover:text-emerald-300 font-bold transition-colors"
        >
          Chi tiết <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Progress Ring & High-level stats */}
      <div className="flex items-center gap-5 pt-1">
        <ProgressRing
          value={masteredPercent}
          size={96}
          strokeWidth={8}
          colorClass="text-cyan-400"
          trackColorClass="text-zinc-800"
          label={`Mức độ thành thạo: ${masteredPercent}%`}
        >
          <div className="text-center">
            <span className="block text-lg font-black font-mono tracking-tight text-white">
              {masteredPercent}%
            </span>
            <span className="block text-[9px] uppercase font-mono tracking-wider text-zinc-400">
              Mastered
            </span>
          </div>
        </ProgressRing>

        <div className="flex-1 min-w-0 space-y-1">
          <p className="text-xs text-zinc-400">Tỷ lệ thành thạo</p>
          <p className="text-xl sm:text-2xl font-light font-mono text-white">
            {masteredWords} / {totalWords}{" "}
            <span className="text-xs text-zinc-400 font-normal">từ</span>
          </p>
          <p className="text-[11px] text-zinc-400 leading-normal truncate">
            {totalWords > 0
              ? `${learningWordsTotal(newWords, rememberingWords)} từ đang trong chu kỳ ôn tập`
              : "Chưa có từ nào trong hệ thống"}
          </p>
        </div>
      </div>

      {/* Multi-segment Progress Bar */}
      <div className="space-y-1.5 pt-1">
        <div
          className="flex h-2.5 w-full overflow-hidden bg-zinc-800"
          role="img"
          aria-label={`${newWords} từ mới, ${rememberingWords} đang nhớ, ${masteredWords} thành thạo`}
        >
          <div
            className="h-full bg-emerald-400 transition-[width] duration-500"
            style={{ width: `${newPercent}%` }}
            title={`Mới học: ${newWords} từ (${newPercent}%)`}
          />
          <div
            className="h-full bg-amber-300 transition-[width] duration-500"
            style={{ width: `${rememberingPercent}%` }}
            title={`Đang nhớ: ${rememberingWords} từ (${rememberingPercent}%)`}
          />
          <div
            className="h-full bg-cyan-300 transition-[width] duration-500"
            style={{ width: `${masteredPercent}%` }}
            title={`Thành thạo: ${masteredWords} từ (${masteredPercent}%)`}
          />
        </div>
      </div>

      {/* 3 Detail Tiers */}
      <div className="divide-y divide-zinc-800/80 text-xs pt-1">
        <div className="flex items-center justify-between py-2.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-400 shrink-0" />
            <div>
              <span className="font-medium text-zinc-200">Mới học</span>
              <span className="text-zinc-400 text-[10px] ml-1.5">(1–3 ngày)</span>
            </div>
          </div>
          <span className="font-mono font-medium text-white tabular-nums">
            {newWords} <span className="text-zinc-400 text-[10px]">({newPercent}%)</span>
          </span>
        </div>

        <div className="flex items-center justify-between py-2.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-amber-300 shrink-0" />
            <div>
              <span className="font-medium text-zinc-200">Đang nhớ</span>
              <span className="text-zinc-400 text-[10px] ml-1.5">(7–14 ngày)</span>
            </div>
          </div>
          <span className="font-mono font-medium text-white tabular-nums">
            {rememberingWords} <span className="text-zinc-400 text-[10px]">({rememberingPercent}%)</span>
          </span>
        </div>

        <div className="flex items-center justify-between py-2.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-cyan-300 shrink-0" />
            <div>
              <span className="font-medium text-zinc-200">Đã thành thạo</span>
              <span className="text-zinc-400 text-[10px] ml-1.5">(30 ngày)</span>
            </div>
          </div>
          <span className="font-mono font-medium text-cyan-300 tabular-nums">
            {masteredWords} <span className="text-zinc-400 text-[10px]">({masteredPercent}%)</span>
          </span>
        </div>
      </div>

      {totalWords === 0 && (
        <p className="text-xs text-zinc-400 pt-1 border-t border-zinc-800">
          Hoàn thành bài học đầu tiên để kích hoạt biểu đồ tiến độ.
        </p>
      )}
    </section>
  );
}

function learningWordsTotal(newCount: number, rememberingCount: number) {
  return newCount + rememberingCount;
}

