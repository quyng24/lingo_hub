"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, Flame } from "lucide-react";
import AccountControl from "@/components/AccountControl";
import Loading from "@/components/common/Loading";
import { useAuth } from "@/components/AuthProvider";
import { learningProgressService, type UserLearningStats } from "@/services/learningProgressService";

function formatStudyDate(date: string | null) {
  if (!date) return "Chưa có dữ liệu";
  return new Intl.DateTimeFormat("vi-VN", { dateStyle: "long" }).format(
    new Date(`${date}T00:00:00`),
  );
}

export default function DailyLearnProgressPage() {
  const { user, isProgressReady } = useAuth();
  const [stats, setStats] = useState<UserLearningStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !isProgressReady) return;
    let isActive = true;

    learningProgressService.getUserStats(user.id)
      .then((userStats) => {
        if (isActive) setStats(userStats);
      })
      .catch(() => {
        if (isActive) setError("Chưa tải được tiến độ học. Hãy thử tải lại trang.");
      });

    return () => {
      isActive = false;
    };
  }, [isProgressReady, user]);

  if (!isProgressReady || !stats && !error) return <Loading message="Đang tải tiến độ học..." />;

  const totalWords = stats?.totalWords ?? 0;
  const newPercent = totalWords ? ((stats?.newWords ?? 0) / totalWords) * 100 : 0;
  const rememberingPercent = totalWords ? ((stats?.rememberingWords ?? 0) / totalWords) * 100 : 0;
  const masteredPercent = totalWords ? ((stats?.masteredWords ?? 0) / totalWords) * 100 : 0;

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0A0A0A]/80 px-5 py-4 backdrop-blur-md sm:px-8">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-400 hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Dashboard
          </Link>
          <AccountControl />
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
        <p className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-emerald-400">Tổng quan học tập</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Tiến độ của bạn</h1>
        <p className="mt-2 text-sm text-zinc-500">{user?.email}</p>

        {error ? (
          <p role="alert" className="mt-10 border-y border-rose-400/20 py-5 text-sm text-rose-300">{error}</p>
        ) : (
          <>
            <section aria-label="Chuỗi ngày học" className="mt-10 flex flex-col gap-5 border-y border-white/10 py-7 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center border border-orange-400/30 bg-orange-400/10">
                  <Flame className="h-6 w-6 text-orange-300" />
                </div>
                <div>
                  <p className="text-sm text-zinc-400">Chuỗi ngày học hiện tại</p>
                  <p className="mt-1 text-3xl font-semibold tabular-nums text-white">
                    {stats?.streakCount ?? 0}<span className="ml-2 text-base font-normal text-zinc-500">ngày</span>
                  </p>
                </div>
              </div>
              <p className="text-sm text-zinc-500">Học gần nhất: <span className="text-zinc-300">{formatStudyDate(stats?.lastStudyDate ?? null)}</span></p>
            </section>
            {stats && !stats.streakTrackingEnabled && (
              <p role="status" className="mt-4 text-sm text-amber-300/90">
                Chuỗi ngày học sẽ được lưu sau khi migration streak được áp dụng trong Supabase.
              </p>
            )}

            <section aria-label="Phân bố mức độ ghi nhớ" className="mt-10">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-xs font-mono font-bold uppercase tracking-[0.18em] text-zinc-500">Word mastery</p>
                  <h2 className="mt-2 text-2xl font-semibold">Mức độ ghi nhớ</h2>
                </div>
                <p className="text-sm text-zinc-500">{totalWords} từ trong tiến trình</p>
              </div>

              <div className="mt-6 flex h-3 w-full overflow-hidden bg-zinc-800" role="img" aria-label={`${stats?.newWords ?? 0} từ mới học, ${stats?.rememberingWords ?? 0} từ đang nhớ, ${stats?.masteredWords ?? 0} từ thành thạo`}>
                <div className="h-full bg-emerald-400 transition-[width]" style={{ width: `${newPercent}%` }} />
                <div className="h-full bg-amber-300 transition-[width]" style={{ width: `${rememberingPercent}%` }} />
                <div className="h-full bg-cyan-300 transition-[width]" style={{ width: `${masteredPercent}%` }} />
              </div>

              <div className="mt-6 divide-y divide-white/5">
                <div className="flex items-center justify-between gap-4 py-4">
                  <div className="flex items-center gap-3">
                    <span className="h-2.5 w-2.5 bg-emerald-400" />
                    <div>
                      <p className="text-sm font-medium text-zinc-200">Mới học</p>
                      <p className="mt-0.5 text-xs text-zinc-500">Chu kỳ ôn 1–3 ngày</p>
                    </div>
                  </div>
                  <p className="text-xl font-medium tabular-nums text-white">{stats?.newWords ?? 0}</p>
                </div>
                <div className="flex items-center justify-between gap-4 py-4">
                  <div className="flex items-center gap-3">
                    <span className="h-2.5 w-2.5 bg-amber-300" />
                    <div>
                      <p className="text-sm font-medium text-zinc-200">Đang nhớ</p>
                      <p className="mt-0.5 text-xs text-zinc-500">Chu kỳ ôn 7–14 ngày</p>
                    </div>
                  </div>
                  <p className="text-xl font-medium tabular-nums text-white">{stats?.rememberingWords ?? 0}</p>
                </div>
                <div className="flex items-center justify-between gap-4 py-4">
                  <div className="flex items-center gap-3">
                    <span className="h-2.5 w-2.5 bg-cyan-300" />
                    <div>
                      <p className="text-sm font-medium text-zinc-200">Đã thành thạo</p>
                      <p className="mt-0.5 text-xs text-zinc-500">Chu kỳ ôn 30 ngày</p>
                    </div>
                  </div>
                  <p className="text-xl font-medium tabular-nums text-white">{stats?.masteredWords ?? 0}</p>
                </div>
              </div>
            </section>

            {totalWords === 0 && (
              <p className="mt-6 text-sm text-zinc-500">Hoàn thành bài học đầu tiên để bắt đầu xây dựng tiến độ của bạn.</p>
            )}
          </>
        )}

        <Link href="/daily-learn/learn" className="mt-10 inline-flex items-center border border-emerald-400/40 px-4 py-3 text-sm font-semibold text-emerald-300 transition-colors hover:bg-emerald-400 hover:text-zinc-950">
          Tiếp tục học
        </Link>
      </section>
    </main>
  );
}

