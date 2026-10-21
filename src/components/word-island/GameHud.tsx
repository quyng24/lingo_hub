import type { Resources } from "@/types";

interface GameHudProps {
  resources: Resources;
  objectiveText: string;
  toolNameVi?: string;
  keyNameVi?: string;
  realmTitle?: string;
  onInteract: () => void;
}

export default function GameHud({
  resources,
  objectiveText,
  toolNameVi = "Rìu Sinh Tồn",
  keyNameVi = "Chìa Khóa Cổng",
  realmTitle,
  onInteract,
}: GameHudProps) {
  return (
    <>
      {/* Top Left: Inventory HUD */}
      <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 bg-[#1e293b]/90 border border-amber-500/80 rounded-lg p-2 sm:p-2.5 text-xs space-y-1 shadow-lg pointer-events-none backdrop-blur-xs select-none">
        <div className="flex items-center justify-between gap-2">
          <div className="font-bold text-amber-300 uppercase tracking-wider text-[10px] sm:text-xs">
            Túi đồ (Inventory)
          </div>
          {realmTitle && (
            <span className="text-[10px] text-amber-400/80 font-mono hidden sm:inline">
              📍 {realmTitle}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 text-[11px] sm:text-xs">
          <span>
            🪵 Gỗ:{" "}
            <strong className="text-emerald-300 font-bold">
              {resources.wood}
            </strong>
          </span>
          <span>
            🪨 Đá:{" "}
            <strong className="text-slate-200 font-bold">
              {resources.stone}
            </strong>
          </span>
        </div>
        <div className="flex items-center gap-2 pt-1 border-t border-slate-700 text-[10px] sm:text-[11px]">
          <span
            className={
              resources.hasAxe ? "text-emerald-400 font-bold" : "text-slate-400"
            }
          >
            🪓 {resources.hasAxe ? toolNameVi : `Chưa có ${toolNameVi}`}
          </span>
          <span className="text-slate-600">•</span>
          <span
            className={
              resources.hasGateKey
                ? "text-yellow-300 font-bold"
                : "text-slate-400"
            }
          >
            🗝️ {resources.hasGateKey ? keyNameVi : "Chưa có khóa"}
          </span>
        </div>
      </div>

      {/* Top Right: Current Objective HUD */}
      <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 max-w-55 sm:max-w-70 md:max-w-[320px] bg-[#1e293b]/90 border border-emerald-400/80 rounded-lg p-2 sm:p-2.5 text-xs shadow-lg pointer-events-none backdrop-blur-xs select-none">
        <div className="font-bold text-emerald-300 uppercase tracking-wider text-[10px] sm:text-xs mb-0.5">
          Nhiệm vụ hiện tại
        </div>
        <p className="text-amber-50 text-[11px] sm:text-xs leading-snug font-medium">
          {objectiveText}
        </p>
      </div>

      {/* Bottom Left: Controls Hint */}
      <div className="absolute bottom-2.5 left-2.5 sm:bottom-3 sm:left-3 bg-slate-900/85 border border-slate-700 px-2 sm:px-3 py-1 rounded-md text-[10px] sm:text-xs text-slate-300 pointer-events-none shadow backdrop-blur-xs select-none">
        Di chuyển: <strong className="text-white">WASD / Mũi tên</strong> |
        Tương tác: <strong className="text-amber-300">[E] / Phím Cách</strong>
      </div>

      {/* Bottom Right: Interactive Touch Button (Mobile / Quick Click) */}
      <button
        onClick={onInteract}
        className="absolute bottom-2.5 right-2.5 sm:bottom-3 sm:right-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-lg border-2 border-amber-200 text-xs sm:text-sm shadow-xl active:scale-95 transition flex items-center gap-1.5 z-10"
      >
        <span>[E]</span>
        <span>Hành động</span>
      </button>
    </>
  );
}
