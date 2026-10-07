"use client";

import { useGameEngine } from "@/hooks/useGameEngine";
import {
  Keyboard,
  Play,
  Rocket,
  RotateCcw,
  Trophy,
  LayoutGrid,
  Swords
} from "lucide-react";

export default function GameOver() {
  const { gameState, topics, topicError, isStarting, startGame, goToMenu } = useGameEngine();
  const { score, status, selectedTopicId } = gameState;

  return (
    <>
      {status !== "playing" && (
        <div className="absolute inset-0 bg-slate-950/85 flex items-center justify-center z-30 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          {/* Main Container */}
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-xl p-6 sm:p-8 text-center shadow-2xl shadow-black/90 overflow-hidden flex flex-col max-h-[90vh]">

            {/* Background Glows */}
            <div className="absolute top-0 left-1/4 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Header Icon */}
            <div className="mx-auto w-14 h-14 rounded-lg bg-linear-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.3)] mb-4 shrink-0 relative">
              <Rocket className="w-7 h-7 text-white" />
              <div className="absolute inset-0 border border-white/20 rounded-lg"></div>
            </div>

            <h2 className="text-3xl font-black tracking-wider bg-linear-to-r from-white via-cyan-100 to-blue-200 bg-clip-text text-transparent mb-1.5 shrink-0">
              WordBlaster
            </h2>
            <p className="text-sm text-slate-400 mb-6 shrink-0 font-medium">
              {status === "idle"
                ? "CHỌN CHIẾN DỊCH ĐỂ BẮT ĐẦU"
                : "TRẬN CHIẾN KẾT THÚC"}
            </p>

            {/* ================= IDLE STATUS (CHỌN TOPIC) ================= */}
            {status === "idle" && (
              <div className="flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar text-left pb-2">
                {topicError && <p className="p-3 text-sm text-rose-300">{topicError}</p>}
                {!topicError && topics.length === 0 && (
                  <p className="p-3 text-sm text-slate-400">Đang tải chủ đề từ Supabase...</p>
                )}
                {topics.map((topic) => (
                  <button
                    key={topic.id}
                    disabled={isStarting}
                    onClick={() => startGame(topic.id)}
                    className="group relative flex items-center gap-4 p-3 rounded-lg border border-slate-700/60 bg-slate-800/40 hover:bg-slate-800 hover:border-cyan-500/60 transition-all duration-300 hover:shadow-[0_0_15px_rgba(6,182,212,0.15)] overflow-hidden cursor-pointer shrink-0 disabled:cursor-wait disabled:opacity-60"
                  >
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                    <div className="w-12 h-12 shrink-0 rounded-md bg-slate-900 border border-slate-700 flex flex-col items-center justify-center group-hover:border-cyan-500/50 group-hover:bg-cyan-950/40 transition-colors">
                      <span className="text-cyan-400 font-mono font-bold text-sm leading-none">
                        {topic.wordCount}
                      </span>
                      <span className="text-slate-500 text-[9px] uppercase tracking-widest mt-1">
                        Từ
                      </span>
                    </div>

                    <div className="flex-1 min-w-0 py-1">
                      <h3 className="text-base font-bold text-slate-200 group-hover:text-cyan-400 transition-colors truncate">
                        {topic.name}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                        {topic.description}
                      </p>
                    </div>

                    <div className="w-8 h-8 shrink-0 rounded-md bg-slate-700/50 flex items-center justify-center text-slate-400 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-all duration-300 group-hover:scale-110">
                      <Play className="w-4 h-4 ml-0.5 fill-current" />
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* ================= GAME OVER STATUS ================= */}
            {status === "game-over" && (
              <div className="shrink-0 flex flex-col gap-5">
                {/* Score Box */}
                <div className="p-5 rounded-lg bg-rose-950/20 border border-rose-500/20 text-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-rose-500/50 to-transparent"></div>

                  <div className="flex items-center justify-center gap-2 mb-2 text-rose-400/80">
                    <Swords className="w-4 h-4" />
                    <span className="text-xs uppercase font-bold tracking-widest">
                      Điểm tổng kết
                    </span>
                    <Swords className="w-4 h-4" />
                  </div>

                  <div className="flex items-center justify-center gap-3 text-5xl font-black font-mono text-white mb-2 tracking-tighter">
                    <Trophy className="w-8 h-8 text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]" />
                    <span>{score.toLocaleString()}</span>
                  </div>

                  <div className="text-xs text-slate-400 inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-950/50 border border-slate-800">
                    Chiến dịch:{" "}
                    <span className="text-cyan-400 font-bold uppercase">
                      {topics.find((topic) => topic.id === selectedTopicId)?.name}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => {
                      const topicId = selectedTopicId || topics[0]?.id;
                      if (topicId) startGame(topicId);
                    }}
                    className="w-full py-3.5 px-6 rounded-lg bg-linear-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-sm uppercase tracking-widest transition-all duration-200 shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] active:scale-[0.98] flex items-center justify-center gap-3 cursor-pointer"
                  >
                    <RotateCcw className="w-5 h-5" />
                    <span>Chơi Lại Ngay</span>
                  </button>

                  <button
                    onClick={goToMenu}
                    className="w-full py-3.5 px-6 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white font-bold text-sm uppercase tracking-widest transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-3 cursor-pointer"
                  >
                    <LayoutGrid className="w-5 h-5" />
                    <span>Đổi Chiến Dịch</span>
                  </button>
                </div>
              </div>
            )}

            {/* Hint Box */}
            <div className="mt-6 shrink-0 flex items-start sm:items-center gap-3 p-3.5 rounded-lg bg-slate-800/40 border border-slate-700/50 text-left">
              <Keyboard className="w-5 h-5 text-cyan-500 shrink-0 mt-0.5 sm:mt-0" />
              <p className="text-xs text-slate-400 leading-relaxed">
                <strong className="text-slate-300 uppercase text-[10px] tracking-wider mr-1">Hệ thống:</strong>
                Nên tắt bộ gõ Tiếng Việt (Unikey/EVKey) để tránh lỗi kẹt phím khi phòng thủ.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}