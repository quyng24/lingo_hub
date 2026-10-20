import Link from 'next/link';

interface VictoryOverlayProps {
  onRestart: () => void;
}

export default function VictoryOverlay({ onRestart }: VictoryOverlayProps) {
  return (
    <div className="absolute inset-0 bg-slate-950/90 flex items-center justify-center p-4 z-40 animate-in zoom-in-95 duration-200 backdrop-blur-sm">
      <div className="bg-[#1e293b] border-4 border-yellow-400 rounded-xl max-w-md w-full p-5 sm:p-6 text-center space-y-4 shadow-2xl">
        <div className="text-4xl sm:text-5xl animate-bounce">🏆</div>
        <h2 className="text-xl sm:text-2xl font-black text-yellow-300 tracking-wide">
          BẠN ĐÃ THOÁT KHỎI WORD ISLAND!
        </h2>
        <p className="text-xs sm:text-sm text-slate-200 font-sans leading-relaxed">
          Chúc mừng! Bạn đã thu thập đủ tài nguyên, giúp Thuyền trưởng Minh sửa nơi trú ẩn và chinh phục xuất sắc các câu đố từ vựng sinh tồn!
        </p>

        <div className="bg-slate-800/90 border border-slate-700 rounded-lg p-3 text-left text-xs space-y-1.5 font-sans">
          <div className="font-bold text-amber-300 uppercase tracking-wider text-[11px] sm:text-xs">
            Từ vựng đã ghi nhớ:
          </div>
          <div className="grid grid-cols-2 gap-1.5 text-slate-200">
            <span>• <strong>Wood</strong>: Gỗ</span>
            <span>• <strong>Stone</strong>: Đá</span>
            <span>• <strong>Axe</strong>: Cái rìu</span>
            <span>• <strong>Shelter</strong>: Nơi trú ẩn</span>
            <span>• <strong>Water</strong>: Nước ngọt</span>
            <span>• <strong>Food</strong>: Thức ăn</span>
          </div>
        </div>

        <div className="flex justify-center gap-3 pt-2">
          <button
            onClick={onRestart}
            className="px-5 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-bold text-xs sm:text-sm rounded-lg border-2 border-yellow-200 shadow transition active:scale-95"
          >
            ↺ Chơi lại
          </button>
          <Link
            href="/game"
            className="px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs sm:text-sm rounded-lg border border-slate-500 shadow transition active:scale-95"
          >
            Về Thư viện Game
          </Link>
        </div>
      </div>
    </div>
  );
}

