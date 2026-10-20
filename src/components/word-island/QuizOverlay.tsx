import { Dispatch, SetStateAction } from 'react';
import type { QuizState } from '@/types';

interface QuizOverlayProps {
  activeQuiz: QuizState;
  setActiveQuiz: Dispatch<SetStateAction<QuizState | null>>;
}

export default function QuizOverlay({
  activeQuiz,
  setActiveQuiz,
}: QuizOverlayProps) {
  const currentQ = activeQuiz.questions[activeQuiz.currentIndex];
  if (!currentQ) return null;

  const handleSelectOption = (opt: {
    id: string;
    text: string;
    isCorrect: boolean;
    explanationEn: string;
    explanationVi: string;
  }) => {
    setActiveQuiz((prev) =>
      prev
        ? {
          ...prev,
          selectedFeedback: {
            isCorrect: opt.isCorrect,
            en: opt.explanationEn,
            vi: opt.explanationVi,
          },
        }
        : null
    );
  };

  const handleContinue = () => {
    if (activeQuiz.currentIndex + 1 < activeQuiz.questions.length) {
      setActiveQuiz({
        ...activeQuiz,
        currentIndex: activeQuiz.currentIndex + 1,
        selectedFeedback: null,
      });
    } else {
      activeQuiz.onComplete();
    }
  };

  return (
    <div className="absolute inset-0 bg-slate-950/85 flex items-center justify-center p-3 sm:p-5 z-30 animate-in fade-in duration-150 backdrop-blur-xs">
      <div className="bg-[#1e293b] border-3 sm:border-4 border-amber-400 rounded-xl max-w-lg w-full p-4 sm:p-5 space-y-3 sm:space-y-4 shadow-2xl overflow-y-auto max-h-[90%]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-700 pb-2">
          <span className="text-amber-300 font-bold text-xs sm:text-sm uppercase tracking-wide">
            🧩 {currentQ.title}
          </span>
          <span className="text-[11px] sm:text-xs text-slate-400 font-mono">
            Câu {activeQuiz.currentIndex + 1} / {activeQuiz.questions.length}
          </span>
        </div>

        {/* Context */}
        <div className="bg-slate-800/90 p-2.5 sm:p-3 rounded-lg border border-slate-700 space-y-1">
          <p className="text-xs sm:text-sm text-slate-200 font-sans">{currentQ.contextEn}</p>
          <p className="text-[11px] sm:text-xs text-amber-200/90 italic font-sans">
            🇻🇳 {currentQ.contextVi}
          </p>
        </div>

        {/* Question */}
        <div className="space-y-1">
          <p className="text-sm sm:text-base font-bold text-white font-sans">{currentQ.question}</p>
          <p className="text-xs text-emerald-300 font-sans">{currentQ.hintVi}</p>
        </div>

        {/* Options */}
        <div className="space-y-2 pt-1">
          {currentQ.options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => handleSelectOption(opt)}
              className="w-full text-left px-3.5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 hover:border-amber-300 text-xs sm:text-sm transition flex items-center justify-between font-sans active:scale-98"
            >
              <span>
                <strong className="text-amber-300 uppercase mr-2 font-mono">
                  {opt.id}.
                </strong>
                {opt.text}
              </span>
            </button>
          ))}
        </div>

        {/* Feedback Section */}
        {activeQuiz.selectedFeedback && (
          <div
            className={`p-3 rounded-lg border text-xs sm:text-sm space-y-1 font-sans ${activeQuiz.selectedFeedback.isCorrect
                ? 'bg-emerald-950/90 border-emerald-400 text-emerald-100'
                : 'bg-rose-950/90 border-rose-400 text-rose-100'
              }`}
          >
            <p className="font-bold">
              {activeQuiz.selectedFeedback.isCorrect ? '✅ Chính xác!' : '❌ Chưa đúng, thử lại!'} —{' '}
              {activeQuiz.selectedFeedback.en}
            </p>
            <p className="italic text-xs opacity-90">🇻🇳 {activeQuiz.selectedFeedback.vi}</p>

            {activeQuiz.selectedFeedback.isCorrect && (
              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleContinue}
                  className="px-4 py-1.5 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold rounded-md text-xs sm:text-sm shadow transition active:scale-95"
                >
                  Tiếp tục →
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

