interface PauseOverlayProps {
  onResume: () => void;
  onRestart: () => void;
}

export default function PauseOverlay({
  onResume,
  onRestart,
}: PauseOverlayProps) {
  return (
    <div className="absolute inset-0 bg-slate-950/80 flex flex-col items-center justify-center p-4 z-20 animate-in fade-in duration-100 backdrop-blur-xs">
      <div className="bg-[#1e293b] border-3 sm:border-4 border-amber-400 p-6 rounded-xl max-w-sm w-full text-center space-y-4 shadow-2xl">
        <h2 className="text-xl sm:text-2xl font-black text-amber-300 tracking-wider">
          TRÒ CHƠI TẠM DỪNG
        </h2>
        <p className="text-xs text-slate-300 font-sans leading-relaxed">
          Thu thập Gỗ và Đá, gặp Thuyền trưởng Minh và giải đố tiếng Anh để thoát khỏi Đảo Từ Vựng.
        </p>
        <div className="flex justify-center gap-3 pt-1">
          <button
            onClick={onResume}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold rounded-lg border border-emerald-300 shadow transition active:scale-95"
          >
            Tiếp tục chơi
          </button>
          <button
            onClick={onRestart}
            className="px-4 py-2 bg-rose-700 hover:bg-rose-600 text-white text-xs sm:text-sm font-bold rounded-lg border border-rose-300 shadow transition active:scale-95"
          >
            Chơi lại
          </button>
        </div>
      </div>
    </div>
  );
}

