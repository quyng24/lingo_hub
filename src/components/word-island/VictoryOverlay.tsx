import { useState } from 'react';
import Link from 'next/link';
import type { IslandTheme, QuestWordInfo } from '@/types';
import { Volume2 } from 'lucide-react';

interface VictoryOverlayProps {
  words: QuestWordInfo[];
  theme?: IslandTheme;
  onRestart: () => void;
}

export default function VictoryOverlay({
  words,
  theme,
  onRestart,
}: VictoryOverlayProps) {
  const [playingWord, setPlayingWord] = useState<string | null>(null);

  const playWordAudio = (word: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-US';
      utterance.rate = 0.85;
      utterance.onstart = () => setPlayingWord(word);
      utterance.onend = () => setPlayingWord(null);
      utterance.onerror = () => setPlayingWord(null);
      window.speechSynthesis.speak(utterance);
    }
  };

  const realmTitle = theme?.realmTitle || 'WORD ISLAND';
  const mentorName = theme?.mentorName || 'Thuyền trưởng Minh';
  const gateName = theme?.gateNameVi || 'Cổng Cổ Đại';

  return (
    <div className="absolute inset-0 bg-slate-950/90 flex items-center justify-center p-3 sm:p-4 z-40 animate-in zoom-in-95 duration-200 backdrop-blur-sm">
      <div className="bg-[#1e293b] border-4 border-yellow-400 rounded-xl max-w-lg w-full p-4 sm:p-6 text-center space-y-3 sm:space-y-4 shadow-2xl overflow-y-auto max-h-[92%]">
        <div className="text-3xl sm:text-4xl animate-bounce">🏆</div>
        <div>
          <span className="text-[11px] sm:text-xs font-mono font-bold text-amber-400 uppercase tracking-widest block mb-0.5">
            Thám Hiểm Hoàn Thành
          </span>
          <h2 className="text-lg sm:text-2xl font-black text-yellow-300 tracking-wide uppercase">
            CHINH PHỤC {realmTitle}!
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-slate-200 font-sans leading-relaxed">
          Xuất sắc! Bạn đã thu thập đủ tài nguyên, cùng <strong>{mentorName}</strong> giải mã các thử thách ngữ cảnh, mở khóa <strong>{gateName}</strong> và làm chủ <strong>{words.length} từ vựng</strong>!
        </p>

        {/* Vocabulary Cards Section */}
        <div className="bg-slate-800/90 border border-slate-700 rounded-lg p-3 text-left space-y-2 font-sans">
          <div className="flex items-center justify-between border-b border-slate-700 pb-1.5">
            <span className="font-bold text-amber-300 uppercase tracking-wider text-[11px] sm:text-xs">
              Từ vựng đã ghi nhớ ({words.length} từ):
            </span>
            <span className="text-[10px] text-slate-400">
              Nhấn 🔊 để nghe phát âm
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
            {words.map((item) => (
              <div
                key={item.id}
                className="bg-slate-900/80 border border-slate-700/80 hover:border-amber-400/60 rounded p-2 text-xs flex flex-col justify-between transition"
              >
                <div className="flex items-start justify-between gap-1">
                  <div>
                    <span className="font-bold text-amber-200 text-sm">
                      {item.word}
                    </span>
                    {item.pronunciation && (
                      <span className="text-[10px] text-slate-400 ml-1 font-mono">
                        {item.pronunciation}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => playWordAudio(item.word)}
                    title="Nghe phát âm"
                    className={`p-1 rounded hover:bg-slate-800 text-amber-400 transition ${
                      playingWord === item.word ? 'scale-110 text-emerald-400' : ''
                    }`}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="text-slate-300 text-[11px] mt-0.5 line-clamp-1">
                  • {item.meanings[0] || 'Nghĩa từ vựng'}
                </div>
                {item.exampleSentence && (
                  <div className="text-[10px] text-emerald-400/90 italic mt-1 line-clamp-1">
                    &ldquo;{item.exampleSentence}&rdquo;
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Stats Reward */}
        <div className="flex items-center justify-around bg-slate-900/60 border border-slate-800 rounded-lg p-2 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px]">Kinh nghiệm</span>
            <strong className="text-emerald-400 text-sm">+{words.length * 10} EXP</strong>
          </div>
          <div className="h-6 w-px bg-slate-700" />
          <div>
            <span className="text-slate-400 block text-[10px]">Từ vựng đạt</span>
            <strong className="text-yellow-300 text-sm">{words.length} / {words.length}</strong>
          </div>
          <div className="h-6 w-px bg-slate-700" />
          <div>
            <span className="text-slate-400 block text-[10px]">Độ chính xác</span>
            <strong className="text-sky-300 text-sm">100%</strong>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-3 pt-1">
          <button
            onClick={onRestart}
            className="px-4 sm:px-5 py-2 sm:py-2.5 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-bold text-xs sm:text-sm rounded-lg border-2 border-yellow-200 shadow transition active:scale-95"
          >
            ↺ Khám phá hòn đảo mới
          </button>
          <Link
            href="/game"
            className="px-4 sm:px-5 py-2 sm:py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs sm:text-sm rounded-lg border border-slate-500 shadow transition active:scale-95"
          >
            Về Thư viện Game
          </Link>
        </div>
      </div>
    </div>
  );
}
