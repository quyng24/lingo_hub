"use client";

import Link from "next/link";
import { Flame, Zap } from "lucide-react";
import AccountControl from "@/components/AccountControl";

interface DashboardHeaderProps {
  streakCount: number;
}

export default function DashboardHeader({ streakCount }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800/80 bg-zinc-950/85 px-4 sm:px-6 lg:px-8 py-3.5 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
        {/* Logo & Quick Nav */}
        <div className="flex items-center gap-4 sm:gap-6">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-sm sm:text-base font-black tracking-widest text-white uppercase group"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-emerald-500 flex items-center justify-center text-zinc-950 font-black text-xs sm:text-sm group-hover:bg-emerald-400 transition-colors">
              <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
            </div>
            <span>
              Lingo<span className="text-emerald-400 font-medium">Hub</span>
            </span>
          </Link>

          <nav className="hidden sm:flex items-center gap-1 text-xs font-mono uppercase">
            <Link
              href="/dashboard"
              className="px-2.5 py-1 text-emerald-400 font-bold bg-zinc-900 border border-zinc-800"
            >
              Dashboard
            </Link>
            <Link
              href="/daily-learn/progress"
              className="px-2.5 py-1 text-zinc-400 hover:text-white transition-colors"
            >
              Tiến độ
            </Link>
            <Link
              href="/game"
              className="px-2.5 py-1 text-zinc-400 hover:text-white transition-colors"
            >
              Game
            </Link>
          </nav>
        </div>

        {/* Right side: Streak & Account */}
        <div className="flex items-center gap-2 sm:gap-3">
          {streakCount > 0 && (
            <div className="inline-flex items-center gap-1 px-2 py-1 bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-mono font-bold">
              <Flame className="w-3.5 h-3.5 fill-current" />
              <span>{streakCount}d</span>
            </div>
          )}
          <AccountControl />
        </div>
      </div>
    </header>
  );
}

