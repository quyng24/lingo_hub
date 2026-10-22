"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProgressRing from "@/components/ProgressRing";
import { Skeleton } from "../common/Skeleton";

interface MemoryProgressCardProps {
  totalWords: number;
  newWords: number;
  rememberingWords: number;
  masteredWords: number;
  masteredPercent: number;
  newPercent: number;
  rememberingPercent: number;
  isLoading?: boolean;
}

export default function MemoryProgressCard({
  totalWords,
  newWords,
  rememberingWords,
  masteredWords,
  masteredPercent,
  newPercent,
  rememberingPercent,
  isLoading = false,
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
          <div className="text-xs text-zinc-400 mt-0.5">
            {isLoading ? (
              <Skeleton className="h-3 w-28 mt-0.5" />
            ) : (
              `${totalWords} từ trong tiến trình`
            )}
          </div>
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
        {isLoading ? (
          <div className="w-24 h-24 rounded-full border-4 border-zinc-800 animate-pulse flex items-center justify-center">
            <Skeleton className="w-10 h-4 rounded-xs" />
          </div>
        ) : (
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
        )}

        <div className="flex-1 min-w-0 space-y-1">
          <p className="text-xs text-zinc-400">Tỷ lệ thành thạo</p>
          <div className="text-xl sm:text-2xl font-light font-mono text-white">
            {isLoading ? (
              <Skeleton className="h-7 w-24 my-0.5" />
            ) : (
              <>
                {masteredWords} / {totalWords}{" "}
                <span className="text-xs text-zinc-400 font-normal">từ</span>
              </>
            )}
          </div>
          <div className="text-[11px] text-zinc-400 leading-normal truncate">
            {isLoading ? (
              <Skeleton className="h-3 w-36 mt-1" />
            ) : totalWords > 0 ? (
              `${learningWordsTotal(newWords, rememberingWords)} từ đang trong chu kỳ ôn tập`
            ) : (
              "Chưa có từ nào trong hệ thống"
            )}
          </div>
        </div>
      </div>

      {/* Multi-segment Progress Bar */}
      <div className="space-y-1.5 pt-1">
        <div
          className="flex h-2.5 w-full overflow-hidden bg-zinc-800"
          role="img"
          aria-label={`${newWords} từ mới, ${rememberingWords} đang nhớ, ${masteredWords} thành thạo`}
        >
          {isLoading ? (
            <div className="h-full w-full bg-zinc-800/80 animate-pulse" />
          ) : (
            <>
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
            </>
          )}
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
          {isLoading ? (
            <Skeleton className="h-4 w-12" />
          ) : (
            <span className="font-mono font-medium text-white tabular-nums">
              {newWords} <span className="text-zinc-400 text-[10px]">({newPercent}%)</span>
            </span>
          )}
        </div>

        <div className="flex items-center justify-between py-2.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-amber-300 shrink-0" />
            <div>
              <span className="font-medium text-zinc-200">Đang nhớ</span>
              <span className="text-zinc-400 text-[10px] ml-1.5">(7–14 ngày)</span>
            </div>
          </div>
          {isLoading ? (
            <Skeleton className="h-4 w-12" />
          ) : (
            <span className="font-mono font-medium text-white tabular-nums">
              {rememberingWords} <span className="text-zinc-400 text-[10px]">({rememberingPercent}%)</span>
            </span>
          )}
        </div>

        <div className="flex items-center justify-between py-2.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-cyan-300 shrink-0" />
            <div>
              <span className="font-medium text-zinc-200">Đã thành thạo</span>
              <span className="text-zinc-400 text-[10px] ml-1.5">(30 ngày)</span>
            </div>
          </div>
          {isLoading ? (
            <Skeleton className="h-4 w-12" />
          ) : (
            <span className="font-mono font-medium text-cyan-300 tabular-nums">
              {masteredWords} <span className="text-zinc-400 text-[10px]">({masteredPercent}%)</span>
            </span>
          )}
        </div>
      </div>

      {isLoading && totalWords === 0 ? (
        <p className="text-xs text-zinc-400 pt-1 border-t border-zinc-800">
          Hoàn thành bài học đầu tiên để kích hoạt biểu đồ tiến độ.
        </p>
      ) : null}
    </section>
  );
}

function learningWordsTotal(newCount: number, rememberingCount: number) {
  return newCount + rememberingCount;
}
