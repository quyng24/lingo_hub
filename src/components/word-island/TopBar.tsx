import Link from 'next/link';
import { ArrowLeft, Play, Pause, RotateCcw } from 'lucide-react';

interface TopBarProps {
  isPaused: boolean;
  onTogglePause: () => void;
  onRestart: () => void;
}

export default function TopBar({
  isPaused,
  onTogglePause,
  onRestart,
}: TopBarProps) {
  return (
    <header className="w-full flex items-center justify-between gap-2 px-3 sm:px-4 py-2 bg-[#1e293b]/90 border border-slate-700/80 rounded-lg shadow-md backdrop-blur-md shrink-0">
      <div className="flex items-center gap-2 sm:gap-3">
        <Link
          href="/game"
          className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded border border-slate-600 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Thư viện Game</span>
          <span className="sm:hidden">Game</span>
        </Link>
        <h1 className="text-sm sm:text-base font-black text-amber-300 tracking-wide flex items-center gap-1.5">
          <span>🏝️</span>
          <span>WORD ISLAND</span>
          <span className="hidden md:inline text-xs text-amber-400/80 font-normal">
            (Đảo Từ Vựng 2D)
          </span>
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onTogglePause}
          className="inline-flex items-center gap-1 px-3 py-1 text-xs font-bold bg-amber-600/90 hover:bg-amber-500 text-slate-950 border border-amber-300 rounded shadow transition active:scale-95"
        >
          {isPaused ? (
            <>
              <Play className="w-3.5 h-3.5 fill-current" /> Tiếp tục
            </>
          ) : (
            <>
              <Pause className="w-3.5 h-3.5 fill-current" /> Tạm dừng
            </>
          )}
        </button>
        <button
          onClick={onRestart}
          className="inline-flex items-center gap-1 px-3 py-1 text-xs font-bold bg-rose-800/90 hover:bg-rose-700 text-white border border-rose-400 rounded shadow transition active:scale-95"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Chơi lại
        </button>
      </div>
    </header>
  );
}

