"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, MessageSquareQuote, Sparkles } from "lucide-react";
import Loading from "@/components/common/Loading";
import ExampleSentence from "@/components/ExampleSentence";
import PhraseList from "@/components/PhraseList";
import ProgressBar from "@/components/ProgressBar";
import WordCard from "@/components/WordCard";
import { LearningStep, VocabularyDaily } from "@/types";
import { getDailyWords } from "@/utils/dailyLesson";
import { useLearningStore } from "@/stores/learningStore";

const steps: { key: LearningStep; label: string; icon: typeof BookOpen }[] = [
  { key: "WORD", label: "Từ vựng", icon: BookOpen },
  { key: "PHRASE", label: "Cụm từ", icon: Sparkles },
  { key: "SENTENCE", label: "Ví dụ", icon: MessageSquareQuote },
];

export default function DailyLearnPage() {
  const router = useRouter();
  const resetQuiz = useLearningStore((state) => state.resetQuiz);
  const [words, setWords] = useState<VocabularyDaily[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [wordIndex, setWordIndex] = useState(0);
  const [step, setStep] = useState<LearningStep>("WORD");
  const word = words[wordIndex];
  const stepIndex = steps.findIndex((item) => item.key === step);
  const progress = words.length ? ((wordIndex * steps.length + stepIndex + 1) / (words.length * steps.length)) * 100 : 0;

  useEffect(() => {
    let isActive = true;
    getDailyWords(10)
      .then((dailyWords) => {
        if (isActive) setWords(dailyWords);
      })
      .catch((error: unknown) => {
        if (isActive) {
          setLoadError(error instanceof Error ? error.message : "Không tải được bài học.");
        }
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, []);

  const next = useCallback(() => {
    if (stepIndex < steps.length - 1) {
      setStep(steps[stepIndex + 1].key);
      return;
    }
    if (wordIndex < words.length - 1) {
      setWordIndex((value) => value + 1);
      setStep("WORD");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    resetQuiz();
    router.push("/daily-learn/exercise");
  }, [resetQuiz, router, stepIndex, wordIndex, words.length]);

  const previous = () => {
    if (stepIndex > 0) {
      setStep(steps[stepIndex - 1].key);
    } else if (wordIndex > 0) {
      setWordIndex((value) => value - 1);
      setStep("SENTENCE");
    }
  };

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Enter" && !(event.target instanceof HTMLInputElement)) {
        event.preventDefault();
        next();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [next]);

  if (isLoading) return <Loading message="Đang tải bài học hôm nay..." />;
  if (loadError) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 p-6 text-center text-slate-800">
        <p className="max-w-lg font-semibold">{loadError}</p>
        <Link href="/" className="font-bold text-indigo-700 hover:text-indigo-900">Về trang chủ</Link>
      </main>
    );
  }
  if (!word) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6 text-center text-slate-700">
        Chưa có từ vựng phù hợp cho bài học hôm nay.
      </main>
    );
  }
  const isFinalStep = wordIndex === words.length - 1 && step === "SENTENCE";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-950"><ArrowLeft className="w-4 h-4" /> <span className="hidden sm:inline">Trang chủ</span></Link>
          <div className="flex items-center gap-1 sm:gap-2">
            {steps.map((item, index) => {
              const Icon = item.icon;
              return <button key={item.key} type="button" onClick={() => setStep(item.key)} className={`inline-flex items-center gap-1 px-2 py-1.5 text-xs font-bold transition-colors ${step === item.key ? "bg-indigo-600 text-white" : index < stepIndex ? "bg-indigo-50 text-indigo-700" : "bg-slate-100 text-slate-500"}`}><Icon className="w-3.5 h-3.5" /><span className="hidden sm:inline">{item.label}</span></button>;
            })}
          </div>
          <span className="font-mono text-xs font-bold text-indigo-700">{wordIndex + 1}/{words.length}</span>
        </div>
        <div className="mx-auto max-w-5xl px-4 pb-1 sm:px-6"><ProgressBar progress={progress} height="h-1.5" /></div>
      </header>
      <main className="mx-auto flex min-h-[calc(100dvh-145px)] max-w-5xl items-stretch px-0 py-0 sm:items-center sm:px-6 sm:py-8">
        {step === "WORD" && <WordCard vocabulary={word} />}
        {step === "PHRASE" && <PhraseList vocabulary={word} />}
        {step === "SENTENCE" && <ExampleSentence vocabulary={word} />}
      </main>
      <footer className="sticky bottom-0 border-t border-slate-200 bg-white/95 p-3 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-1">
          <button type="button" onClick={previous} disabled={wordIndex === 0 && step === "WORD"} className="px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-100 disabled:invisible">Quay lại</button>
          <button type="button" onClick={next} className={`inline-flex flex-1 items-center justify-center gap-2 px-6 py-3 font-bold text-white sm:flex-none ${isFinalStep ? "bg-emerald-600 hover:bg-emerald-700" : "bg-indigo-600 hover:bg-indigo-700"}`}>
            {isFinalStep ? "Bắt đầu làm bài" : "Tiếp tục"}{isFinalStep ? <CheckCircle2 className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
          </button>
        </div>
      </footer>
    </div>
  );
}
