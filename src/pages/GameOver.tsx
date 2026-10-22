"use client";

import Link from "next/link";
import { useGameEngine } from "@/hooks/useGameEngine";
import {
  ArrowLeft,
  ArrowRight,
  Gamepad2,
  Keyboard,
  LayoutGrid,
  Play,
  Rocket,
  RotateCcw,
  Sparkles,
  Swords,
  Trophy,
} from "lucide-react";

export default function GameOver() {
  const { gameState, topics, topicError, isStarting, startGame, goToMenu } =
    useGameEngine();
  const { score, status, selectedTopicId } = gameState;

  if (status === "playing") return null;

  return (
    <div className="absolute inset-0 bg-slate-950/85 flex items-center justify-center z-30 backdrop-blur-md p-4 sm:p-6 lg:p-8 animate-in fade-in duration-200">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* =========================================================================
          1. IDLE STATUS: MÀN HÌNH CHỌN CHIẾN DỊCH (TỐI ƯU HÓA MÀN HÌNH PC/LAPTOP)
         ========================================================================= */}
      {status === "idle" && (
        <div className="relative w-full max-w-5xl xl:max-w-6xl max-h-[92vh] flex flex-col bg-slate-900/90 border border-slate-700/80 rounded-2xl p-5 sm:p-7 lg:p-8 text-left shadow-2xl shadow-black/90 overflow-hidden">
          {/* Top Bar: Back to Game Hub & Badges */}
          <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-4 shrink-0">
            <Link
              href="/game"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white text-xs font-mono font-medium transition-all duration-150 active:scale-95 shadow-sm"
            >
              <ArrowLeft className="w-4 h-4 text-cyan-400" />
              <span>Thư viện Game</span>
            </Link>

            <div className="flex items-center gap-2 sm:gap-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider rounded-md">
                <Rocket className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Word Blaster · Typing Defense</span>
                <span className="sm:hidden">Word Blaster</span>
              </div>
              <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800/80 border border-slate-700 text-slate-400 text-xs font-mono rounded-md">
                <Keyboard className="w-3.5 h-3.5 text-slate-400" />
                <span>Bàn phím PC</span>
              </div>
            </div>
          </div>

          {/* Campaign Header Row */}
          <div className="mt-4 mb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-3 shrink-0">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-cyan-400 mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Chiến dịch phòng thủ từ vựng</span>
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white uppercase">
                Chọn Chiến Dịch Để Bắt Đầu
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
                Chọn bộ từ vựng bạn muốn chinh phục. Gõ nhanh và chính xác từng từ trước khi chúng chạm vào phòng tuyến cuối cùng.
              </p>
            </div>
            <div className="text-xs font-mono text-slate-400 shrink-0">
              <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-cyan-400 font-bold">
                {topics.length}
              </span>{" "}
              chủ đề khả dụng
            </div>
          </div>

          {/* Topics Grid (Mở rộng toàn màn hình PC: 2 đến 3 cột) */}
          <div className="flex-1 overflow-y-auto pr-1.5 custom-scrollbar pb-2 min-h-0">
            {topicError && (
              <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-sm">
                {topicError}
              </div>
            )}

            {!topicError && topics.length === 0 && (
              <div className="py-16 text-center text-sm font-mono text-slate-400">
                Đang tải danh sách chủ đề từ Supabase...
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {topics.map((topic, index) => (
                <button
                  key={topic.id}
                  disabled={isStarting}
                  onClick={() => startGame(topic.id)}
                  className="group relative flex flex-col justify-between p-5 rounded-xl border border-slate-700/70 bg-slate-800/40 hover:bg-slate-800/90 hover:border-cyan-400/80 transition-all duration-300 hover:shadow-[0_0_25px_rgba(6,182,212,0.18)] hover:-translate-y-1 text-left cursor-pointer disabled:cursor-wait disabled:opacity-60"
                >
                  {/* Left edge neon indicator on hover */}
                  <div className="absolute left-0 top-3 bottom-3 w-1 bg-cyan-400 rounded-r opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500 group-hover:text-cyan-400 transition-colors">
                        Chiến dịch #{String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold">
                        <span>{topic.wordCount}</span>
                        <span className="text-[10px] text-cyan-400/70 uppercase">
                          từ
                        </span>
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-slate-100 group-hover:text-cyan-300 transition-colors leading-snug">
                      {topic.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1.5 leading-relaxed line-clamp-2">
                      {topic.description ||
                        "Luyện phản xạ gõ và củng cố ngữ nghĩa cho bộ từ vựng này."}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-700/50 flex items-center justify-between">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 group-hover:text-white transition-colors">
                      Tham chiến
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/10 group-hover:bg-cyan-500 text-cyan-400 group-hover:text-slate-950 flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-sm">
                      <Play className="w-4 h-4 ml-0.5 fill-current" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Bottom Control Notice */}
          <div className="mt-4 pt-3.5 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400 shrink-0">
            <div className="flex items-center gap-2">
              <Keyboard className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>
                <strong className="text-slate-200 uppercase text-[10px] tracking-wider mr-1">
                  Mẹo gõ phím:
                </strong>
                Chuyển Unikey / EVKey sang chế độ tiếng Anh (
                <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-[11px] text-cyan-300 font-mono">
                  ENG
                </kbd>
                ) để tránh nuốt phím khi gõ nhanh.
              </span>
            </div>
            <Link
              href="/game"
              className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors font-mono text-xs uppercase"
            >
              <span>Về Thư viện Game</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* =========================================================================
          2. GAME OVER STATUS: BẢNG KẾT QUẢ & CÁC NÚT ĐIỀU HƯỚNG
         ========================================================================= */}
      {status === "game-over" && (
        <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl p-6 sm:p-8 text-center shadow-2xl shadow-black/90 overflow-hidden flex flex-col max-h-[90vh]">
          {/* Top Bar with Return Link */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-5">
            <Link
              href="/game"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white text-xs font-mono transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Thư viện Game</span>
            </Link>

            <span className="text-[11px] font-mono uppercase tracking-wider text-rose-400 font-bold px-2.5 py-1 rounded bg-rose-950/40 border border-rose-500/30">
              Trận chiến kết thúc
            </span>
          </div>

          {/* Header Icon */}
          <div className="mx-auto w-14 h-14 rounded-xl bg-linear-to-tr from-rose-500 to-amber-600 flex items-center justify-center shadow-[0_0_25px_rgba(244,63,94,0.35)] mb-3 shrink-0 relative">
            <Rocket className="w-7 h-7 text-white" />
            <div className="absolute inset-0 border border-white/20 rounded-xl" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-wider text-white uppercase mb-1">
            Word Blaster
          </h2>
          <p className="text-xs text-rose-400/90 font-mono tracking-widest uppercase mb-5">
            Phòng tuyến đã bị xuyên thủng
          </p>

          {/* Score Box */}
          <div className="p-5 rounded-xl bg-rose-950/20 border border-rose-500/20 text-center relative overflow-hidden mb-5">
            <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-rose-500/50 to-transparent" />

            <div className="flex items-center justify-center gap-2 mb-2 text-rose-400/80">
              <Swords className="w-4 h-4" />
              <span className="text-xs uppercase font-bold tracking-widest font-mono">
                Điểm Tổng Kết
              </span>
              <Swords className="w-4 h-4" />
            </div>

            <div className="flex items-center justify-center gap-3 text-4xl sm:text-5xl font-black font-mono text-white mb-2 tracking-tighter">
              <Trophy className="w-8 h-8 text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]" />
              <span>{score.toLocaleString()}</span>
            </div>

            <div className="text-xs text-slate-400 inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-950/50 border border-slate-800">
              Chiến dịch:{" "}
              <span className="text-cyan-400 font-bold uppercase">
                {topics.find((topic) => topic.id === selectedTopicId)?.name ||
                  "Mặc định"}
              </span>
            </div>
          </div>

          {/* 3 Action Buttons */}
          <div className="flex flex-col gap-2.5">
            {/* 1. Play Again */}
            <button
              onClick={() => {
                const topicId = selectedTopicId || topics[0]?.id;
                if (topicId) startGame(topicId);
              }}
              className="w-full py-3.5 px-6 rounded-lg bg-linear-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-widest transition-all duration-200 shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] active:scale-[0.98] flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Chơi Lại Ngay</span>
            </button>

            {/* 2. Change Topic */}
            <button
              onClick={goToMenu}
              className="w-full py-3 px-6 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 text-slate-200 hover:text-white font-bold text-xs uppercase tracking-widest transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <LayoutGrid className="w-4 h-4 text-cyan-400" />
              <span>Đổi Chiến Dịch</span>
            </button>

            {/* 3. Return to Game Hub */}
            <Link
              href="/game"
              className="w-full py-3 px-6 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white font-bold text-xs uppercase tracking-widest transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <Gamepad2 className="w-4 h-4 text-emerald-400" />
              <span>Về Thư Viện Game</span>
            </Link>
          </div>

          {/* Hint Box */}
          <div className="mt-5 shrink-0 flex items-start sm:items-center gap-2.5 p-3 rounded-lg bg-slate-800/40 border border-slate-700/50 text-left">
            <Keyboard className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5 sm:mt-0" />
            <p className="text-xs text-slate-400 leading-relaxed">
              <strong className="text-slate-300 uppercase text-[10px] tracking-wider mr-1">
                Hệ thống:
              </strong>
              Nên tắt bộ gõ Tiếng Việt để tránh lỗi kẹt phím khi phòng thủ.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
