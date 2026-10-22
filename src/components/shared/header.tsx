"use client";

import Link from "next/link";
import { ArrowLeft, Rocket, Trophy, Flame, Heart } from "lucide-react";
import { useGameEngine } from "@/hooks/useGameEngine";

export default function Header() {
  const { gameState } = useGameEngine();
  const { status, score, combo, lives, level } = gameState;

  return (
    <header className="absolute top-0 inset-x-0 px-4 sm:px-6 py-4 flex items-center justify-between bg-linear-to-b from-slate-950/90 to-transparent z-10 pointer-events-none">
      <div className="grid grid-cols-3 w-full items-center">
        {/* L E F T : Branding & Level */}
        <div className="flex items-center gap-2.5 sm:gap-3 justify-start">
          <Link
            href="/game"
            className="pointer-events-auto inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-600 text-slate-300 hover:text-white text-xs font-mono transition-all duration-150 active:scale-95 shadow-md"
            title="Quay lại Thư viện Game"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">Thư viện Game</span>
            <span className="md:hidden">Game</span>
          </Link>

          {status === "playing" && (
            <div className="hidden sm:flex items-center gap-2.5">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
                <Rocket className="w-4 h-4 text-cyan-400 -rotate-12" />
              </div>
              <div>
                <h1 className="font-black text-white/90 tracking-[0.2em] uppercase text-xs flex items-center gap-1.5">
                  WordBlaster
                </h1>
                <div className="text-cyan-400 font-bold tracking-widest text-[10px]">
                  LEVEL {level}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* C E N T E R : Score & Combo */}
        <div className="flex flex-col items-center justify-center relative">
          {status === "playing" && (
            <>
              <div className="flex items-baseline gap-2">
                <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 hidden sm:block" />
                <span className="text-3xl sm:text-4xl font-black font-mono text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] tracking-tighter">
                  {score.toLocaleString()}
                </span>
              </div>

              {/* Combo Badge */}
              <div className="h-6 mt-1">
                {combo > 1 && (
                  <div className="flex items-center gap-1.5 bg-orange-500/20 px-3 py-0.5 rounded-full border border-orange-500/40 animate-pulse">
                    <Flame className="w-3.5 h-3.5 text-orange-400 fill-orange-400" />
                    <span className="font-bold font-mono text-orange-400 text-xs sm:text-sm tracking-widest">
                      x{combo}
                    </span>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* R I G H T : Lives */}
        <div className="flex items-center justify-end gap-1.5">
          {status === "playing" &&
            Array.from({ length: 3 }).map((_, i) => (
              <Heart
                key={i}
                className={`w-6 h-6 sm:w-7 sm:h-7 transition-all duration-300 ${
                  i < lives
                    ? "text-rose-500 fill-rose-500 drop-shadow-[0_0_12px_rgba(244,63,94,0.6)] scale-100"
                    : "text-slate-800 fill-slate-800/40 scale-75 opacity-50"
                }`}
              />
            ))}
        </div>
      </div>
    </header>
  );
}
