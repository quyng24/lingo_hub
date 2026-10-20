import type { DialogueState } from '@/types';

interface DialogueOverlayProps {
  dialogue: DialogueState;
}

export default function DialogueOverlay({ dialogue }: DialogueOverlayProps) {
  return (
    <div className="absolute inset-x-3 sm:inset-x-6 bottom-3 sm:bottom-5 bg-[#271c19]/95 border-3 sm:border-4 border-[#d97706] rounded-xl p-3.5 sm:p-5 shadow-2xl z-30 animate-in fade-in duration-150 backdrop-blur-md">
      <div className="text-amber-400 font-bold text-xs sm:text-sm mb-1">
        {dialogue.speaker}
      </div>
      <p className="text-white text-xs sm:text-sm md:text-base mb-1.5 leading-relaxed font-sans font-medium">
        &ldquo;{dialogue.en}&rdquo;
      </p>
      <p className="text-amber-200/90 text-[11px] sm:text-xs italic mb-3 sm:mb-4 font-sans">
        🇻🇳 {dialogue.vi}
      </p>
      <div className="flex flex-wrap gap-2 justify-end">
        {dialogue.choices.map((choice, idx) => (
          <button
            key={idx}
            onClick={choice.action}
            className="px-3.5 py-1.5 sm:px-4 sm:py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs sm:text-sm rounded-lg border border-amber-300 transition shadow active:scale-95"
          >
            ▶ {choice.label}
          </button>
        ))}
      </div>
    </div>
  );
}

