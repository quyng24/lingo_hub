"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import {
  learningProgressService,
  type UserLearningStats,
} from "@/services/learningProgressService";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import HeroBanner from "@/components/dashboard/HeroBanner";
import StatCards from "@/components/dashboard/StatCards";
import ActionCards from "@/components/dashboard/ActionCards";
import MemoryProgressCard from "@/components/dashboard/MemoryProgressCard";

export default function DashboardPage() {
  const { user, isProgressReady } = useAuth();
  const [stats, setStats] = useState<UserLearningStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = () => {
    if (!user || !isProgressReady) return;
    setIsLoading(true);
    setError(null);

    learningProgressService
      .getUserStats(user.id)
      .then((userStats) => {
        setStats(userStats);
      })
      .catch(() => {
        setError("Chưa tải được thống kê học tập. Hãy thử tải lại.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (!user || !isProgressReady) return;
    let isActive = true;

    learningProgressService
      .getUserStats(user.id)
      .then((userStats) => {
        if (isActive) {
          setStats(userStats);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isActive) {
          setError("Chưa tải được thống kê học tập. Hãy thử tải lại.");
          setIsLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [isProgressReady, user]);

  const totalWords = stats?.totalWords ?? 0;
  const newWords = stats?.newWords ?? 0;
  const rememberingWords = stats?.rememberingWords ?? 0;
  const learningWords = stats?.learningWords ?? 0;
  const masteredWords = stats?.masteredWords ?? 0;
  const dueWords = stats?.dueWords ?? 0;
  const streakCount = stats?.streakCount ?? 0;
  const lastStudyDate = stats?.lastStudyDate ?? null;

  const masteredPercent = totalWords ? Math.round((masteredWords / totalWords) * 100) : 0;
  const newPercent = totalWords ? Math.round((newWords / totalWords) * 100) : 0;
  const rememberingPercent = totalWords ? Math.round((rememberingWords / totalWords) * 100) : 0;

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-emerald-500/30 font-sans">
      {/* NAVIGATION HEADER */}
      <DashboardHeader streakCount={streakCount} />

      {/* 📱 RESPONSIVE CONTAINER */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 sm:py-10 space-y-6 sm:space-y-8">
        {/* HERO BANNER */}
        <HeroBanner userEmail={user?.email} dueWords={dueWords} />

        {/* ERROR STATE (IF ANY) */}
        {error && (
          <div
            role="alert"
            className="flex items-center justify-between p-3.5 border border-rose-500/40 bg-rose-500/10 text-rose-300 text-xs sm:text-sm"
          >
            <span>{error}</span>
            <button
              onClick={fetchStats}
              className="px-2.5 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 text-xs font-bold uppercase tracking-wider"
            >
              Thử lại
            </button>
          </div>
        )}

        {/* 4 KEY METRIC CARDS */}
        <StatCards
          streakCount={streakCount}
          lastStudyDate={lastStudyDate}
          dueWords={dueWords}
          learningWords={learningWords}
          newWords={newWords}
          rememberingWords={rememberingWords}
          masteredWords={masteredWords}
          masteredPercent={masteredPercent}
          isLoading={isLoading}
        />

        {/* 2-COLUMN MAIN CONTENT (ACTION CARDS & MEMORY PROGRESS) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          {/* LEFT: 2 MAIN ACTIVITIES (7 COLS) */}
          <div className="lg:col-span-7">
            <ActionCards />
          </div>

          {/* RIGHT: EMBEDDED MEMORY PROGRESS CARD (5 COLS) */}
          <div className="lg:col-span-5">
            <MemoryProgressCard
              totalWords={totalWords}
              newWords={newWords}
              rememberingWords={rememberingWords}
              masteredWords={masteredWords}
              masteredPercent={masteredPercent}
              newPercent={newPercent}
              rememberingPercent={rememberingPercent}
            />
          </div>
        </div>
      </div>
    </main>
  );
}