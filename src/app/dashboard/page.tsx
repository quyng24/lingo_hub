"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, BookOpen, Gamepad2 } from "lucide-react";
import AccountControl from "@/components/AccountControl";
import { useAuth } from "@/components/AuthProvider";
import { learningProgressService } from "@/services/learningProgressService";

function DashboardContent() {
  const { user, isProgressReady } = useAuth();
  const [stats, setStats] = useState<{ learningWords: number; masteredWords: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !isProgressReady) return;
    let isActive = true;

    learningProgressService.getUserStats(user.id)
      .then((userStats) => {
        if (isActive) setStats(userStats);
      })
      .catch(() => {
        if (isActive) setError("Chưa tải được thống kê học tập. Hãy thử tải lại trang.");
      });

    return () => {
      isActive = false;
    };
  }, [isProgressReady, user]);

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0A0A0A]/80 px-6 py-4 backdrop-blur-md sm:px-12">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <Link href="/dashboard" className="text-base font-semibold tracking-tight text-white">
            Lingo<span className="text-emerald-400">Hub</span>
          </Link>
          <AccountControl />
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between pb-16 border-b border-white/5">
          <div>
            <p className="text-sm font-medium text-zinc-500 mb-3">{user?.email}</p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight text-white leading-tight">
              Sẵn sàng để <br className="hidden md:block" />
              <span className="text-zinc-400">tiếp tục học?</span>
            </h1>
          </div>

          <div className="md:text-right">
            {error ? (
              <p role="alert" className="text-sm text-rose-400/80">{error}</p>
            ) : (
              <div className="grid grid-cols-2 gap-6 text-left md:text-right">
                <div>
                  <p className="mb-2 text-xs font-medium uppercase tracking-widest text-zinc-500">Đang học</p>
                  <p className="text-5xl font-light tabular-nums text-emerald-400">{stats?.learningWords ?? "—"}</p>
                </div>
                <div>
                  <p className="mb-2 text-xs font-medium uppercase tracking-widest text-zinc-500">Mastered</p>
                  <p className="text-5xl font-light tabular-nums text-cyan-300">{stats?.masteredWords ?? "—"}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-10">
          <p className="text-xs font-mono font-bold uppercase tracking-[0.18em] text-zinc-500">Bắt đầu</p>
          <h2 className="mt-2 text-2xl font-bold">Chọn hoạt động</h2>
          <Link href="/daily-learn/progress" className="mt-3 inline-flex text-sm font-medium text-emerald-300 hover:text-emerald-200">
            Xem chi tiết tiến độ
          </Link>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <Link href="/daily-learn/learn" className="group flex min-h-48 flex-col justify-between border border-emerald-500/40 bg-emerald-500/5 p-6 transition-colors hover:bg-emerald-500">
            <div className="flex items-center justify-between">
              <BookOpen className="h-6 w-6 text-emerald-300 group-hover:text-zinc-950" />
              <ArrowRight className="h-5 w-5 text-emerald-300 group-hover:translate-x-1 group-hover:text-zinc-950" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Học hôm nay</h3>
              <p className="mt-1 text-sm text-zinc-400 group-hover:text-zinc-900">Từ mới và lịch ôn của bạn</p>
            </div>
          </Link>
          <Link href="/game" className="group flex min-h-48 flex-col justify-between border border-cyan-500/40 bg-cyan-500/5 p-6 transition-colors hover:bg-cyan-500">
            <div className="flex items-center justify-between">
              <Gamepad2 className="h-6 w-6 text-cyan-300 group-hover:text-zinc-950" />
              <ArrowRight className="h-5 w-5 text-cyan-300 group-hover:translate-x-1 group-hover:text-zinc-950" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Chọn game</h3>
              <p className="mt-1 text-sm text-zinc-400 group-hover:text-zinc-900">Mở thư viện trò chơi</p>
            </div>
          </Link>
        </div>
      </section>
    </main>
  );
}

export default function DashboardPage() {
  return <DashboardContent />;
}