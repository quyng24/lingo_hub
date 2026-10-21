"use client";

import { useState } from "react";
import { BookOpen, Volume2 } from "lucide-react";
import { VocabularyDaily } from "@/types";
import { playEnglishAudio } from "@/utils/speech";

export default function WordCard({ vocabulary }: { vocabulary: VocabularyDaily }) {
  const [isPlaying, setIsPlaying] = useState(false);

  const speak = () => {
    setIsPlaying(true);
    playEnglishAudio(vocabulary.word);
    window.setTimeout(() => setIsPlaying(false), 1000);
  };

  return (
    <article className="w-full bg-white border-0 shadow-none sm:border sm:border-slate-200 sm:shadow-xs">
      <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
        <section className="p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wider">
            <span className="bg-indigo-50 px-2.5 py-1 text-indigo-700">{vocabulary.partOfSpeech}</span>
            <span className="bg-slate-100 px-2.5 py-1 text-slate-600">Level {vocabulary.difficulty}</span>
          </div>
          <div className="mt-8 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-950">{vocabulary.word}</h2>
              <p className="mt-2 font-mono text-lg text-slate-500">{vocabulary.pronunciation}</p>
            </div>
            <button type="button" onClick={speak} aria-label={`Nghe phát âm từ ${vocabulary.word}`} className={`grid h-11 w-11 place-items-center border border-indigo-200 text-indigo-600 hover:bg-indigo-50 transition-colors ${isPlaying ? "bg-indigo-50 ring-2 ring-indigo-300" : "bg-white"}`}>
              <Volume2 className={isPlaying ? "w-5 h-5 animate-pulse" : "w-5 h-5"} />
            </button>
          </div>
          <div className="mt-8 border-t border-slate-200 pt-5">
            <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
              <BookOpen className="w-4 h-4 text-indigo-600" /> Nghĩa tiếng Việt
            </div>
            <ol className="space-y-3">
              {vocabulary.meanings.map((meaning, index) => (
                <li key={meaning} className="flex gap-3 text-base sm:text-lg text-slate-800">
                  <span className="grid h-6 w-6 shrink-0 place-items-center bg-indigo-100 text-xs font-bold text-indigo-700">{index + 1}</span>
                  {meaning}
                </li>
              ))}
            </ol>
          </div>
        </section>
        <section className="bg-slate-50/70 p-6 sm:p-8">
          <p className="text-sm leading-relaxed text-slate-600">Hãy nghe phát âm, ghi nhớ ý nghĩa, rồi tiếp tục xem cách dùng từ trong cụm từ và ngữ cảnh.</p>
          <div className="mt-8 border-y border-slate-200 py-5">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Mẹo ghi nhớ</p>
            <p className="mt-2 text-lg font-semibold text-slate-900">Đọc to từ này 3 lần trước khi chuyển bước.</p>
          </div>
          {vocabulary.tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {vocabulary.tags.map((tag) => <span key={tag} className="text-sm text-slate-500">#{tag}</span>)}
            </div>
          )}
        </section>
      </div>
    </article>
  );
}
