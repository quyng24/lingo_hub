"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, BookOpen, Gamepad2 } from "lucide-react";
import AccountControl from "@/components/AccountControl";
import RequireAuth from "@/components/RequireAuth";
import { useAuth } from "@/components/AuthProvider";
import { fetchLearnedWordCount } from "@/lib/learningProgress";

function DashboardContent() {
  const { user, isProgressReady } = useAuth();
  const [learnedWordCount, setLearnedWordCount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !isProgressReady) return;
    let isActive = true;

    fetchLearnedWordCount(user.id)
      .then((count) => {
        if (isActive) setLearnedWordCount(count);
      })
      .catch((fetchError: unknown) => {
        if (isActive) setError(fetchError instanceof Error ? fetchError.message : "Không tải được tiến trình.");
      });

    return () => {
      isActive = false;
    };
  }, [isProgressReady, user]);

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <Link href="/dashboard" className="text-sm font-black uppercase tracking-widest text-white">
            Lingo<span className="text-emerald-400">Hub</span>
          </Link>
          <AccountControl />
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
        <p className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-emerald-400">Bảng điều khiển</p>
        <h1 className="mt-3 text-3xl font-black sm:text-4xl">Chào mừng trở lại</h1>
        <p className="mt-2 text-sm text-zinc-400">{user?.email}</p>

        <section aria-label="Tiến trình học" className="mt-10 border-y border-zinc-800 py-6">
          <p className="text-sm font-semibold text-zinc-400">Số từ đã học</p>
          {error ? (
            <p role="alert" className="mt-2 text-sm text-rose-300">{error}</p>
          ) : (
            <p className="mt-2 text-5xl font-black tabular-nums text-emerald-300">
              {learnedWordCount === null ? "..." : learnedWordCount}
            </p>
          )}
        </section>

        <div className="mt-10">
          <p className="text-xs font-mono font-bold uppercase tracking-[0.18em] text-zinc-500">Bắt đầu</p>
          <h2 className="mt-2 text-2xl font-bold">Chọn hoạt động</h2>
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
  return <RequireAuth><DashboardContent /></RequireAuth>;
}