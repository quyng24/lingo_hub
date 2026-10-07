"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Trophy,
  RotateCcw,
  Home,
  ArrowRight,
  BookOpen,
  Award,
} from "lucide-react";
import WordCard from "@/components/WordCard";
import ProgressBar from "@/components/ProgressBar";
import ExerciseCard from "@/components/ExerciseCard";
import Loading from "@/components/common/Loading";
import { fetchExerciseQuestions, fetchVocabularyByIds } from "@/lib/learningData";
import { useLearningStore } from "@/stores/learningStore";
import { ExerciseQuestion, VocabularyDaily } from "@/types";

export default function ExercisePage() {
  const router = useRouter();
  const phase = useLearningStore((state) => state.quizPhase);
  const currentIndex = useLearningStore((state) => state.currentIndex);
  const selectedOption = useLearningStore((state) => state.selectedOption);
  const isChecked = useLearningStore((state) => state.isChecked);
  const score = useLearningStore((state) => state.score);
  const incorrectWordIds = useLearningStore((state) => state.incorrectWordIds);
  const reviewIndex = useLearningStore((state) => state.reviewIndex);
  const selectOption = useLearningStore((state) => state.selectOption);
  const checkAnswer = useLearningStore((state) => state.checkAnswer);
  const nextQuestion = useLearningStore((state) => state.nextQuestion);
  const setQuizPhase = useLearningStore((state) => state.setQuizPhase);
  const setReviewIndex = useLearningStore((state) => state.setReviewIndex);
  const resetQuiz = useLearningStore((state) => state.resetQuiz);
  const [questions, setQuestions] = useState<ExerciseQuestion[]>([]);
  const [reviewWords, setReviewWords] = useState<VocabularyDaily[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isReviewLoading, setIsReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);

  const currentQ = questions[currentIndex];
  const progressPercent = questions.length > 0 ? (currentIndex / questions.length) * 100 : 0;

  useEffect(() => {
    let isActive = true;
    fetchExerciseQuestions()
      .then((data) => {
        if (!isActive) return;
        setQuestions(data);
        if (data.length > 0 && useLearningStore.getState().currentIndex >= data.length) resetQuiz();
      })
      .catch((error: unknown) => {
        if (isActive) setLoadError(error instanceof Error ? error.message : "Không tải được bài tập.");
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [resetQuiz]);

  useEffect(() => {
    if (phase !== "REVIEW" || incorrectWordIds.length === 0) return;
    let isActive = true;
    fetchVocabularyByIds(incorrectWordIds)
      .then((words) => {
        if (isActive) setReviewWords(words);
      })
      .catch((error: unknown) => {
        if (isActive) setReviewError(error instanceof Error ? error.message : "Không tải được từ ôn tập.");
      })
      .finally(() => {
        if (isActive) setIsReviewLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [incorrectWordIds, phase]);

  const handleCheck = useCallback(() => {
    if (!selectedOption || isChecked || !currentQ) return;
    checkAnswer(currentQ.wordId, selectedOption === currentQ.correctAnswer);
  }, [selectedOption, isChecked, currentQ, checkAnswer]);

  const handleNext = useCallback(() => {
    if (questions.length > 0) {
      nextQuestion(currentIndex >= questions.length - 1);
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  }, [currentIndex, nextQuestion, questions.length]);

  // Keyboard shortcut: Press Enter to check or go next
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (phase !== "QUIZ") return;
      if (e.key === "Enter") {
        e.preventDefault();
        if (!isChecked && selectedOption) {
          handleCheck();
        } else if (isChecked) {
          handleNext();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [phase, isChecked, selectedOption, handleCheck, handleNext]);

  if (isLoading) return <Loading message="Đang tải bài tập..." />;
  if (loadError) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center text-slate-800">
        <p className="max-w-lg font-semibold">{loadError}</p>
        <Link href="/daily-learn/learn" className="font-bold text-indigo-700">Quay lại bài học</Link>
      </main>
    );
  }
  if (!currentQ) {
    return <main className="flex min-h-screen items-center justify-center p-6 text-center">Chưa có câu hỏi trong Supabase.</main>;
  }


  if (phase === "QUIZ") {
    const isCorrectChoice = selectedOption === currentQ.correctAnswer;

    return (
      <div className="min-h-dvh flex flex-col justify-between bg-slate-50 text-slate-800 selection:bg-indigo-100">
        {/* Top App Bar */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
            <Link
              href="/daily-learn/learn"
              className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 px-3 py-2 rounded-lg transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Xem lại từ</span>
            </Link>

            <div className="text-center">
              <span className="text-sm font-bold text-slate-800">
                Câu hỏi {currentIndex + 1} / {questions.length}
              </span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 text-amber-800 border border-amber-200/80 text-xs sm:text-sm font-bold font-mono">
              <Trophy className="w-4 h-4 text-amber-600" />
              <span>{score} điểm</span>
            </div>
          </div>

          <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-1">
            <ProgressBar progress={progressPercent} height="h-1.5" />
          </div>
        </header>

        {/* Quiz Body: Expands across max-w-5xl */}
        <main className="flex-1 flex items-stretch justify-center p-0 sm:items-center sm:p-5 md:p-8">
          <div className="w-full max-w-5xl mx-auto">
            <ExerciseCard
              question={currentQ}
              selectedOption={selectedOption}
              isChecked={isChecked}
              onSelectOption={selectOption}
            />
          </div>
        </main>

        {/* Bottom Action Bar */}
        <footer className="sticky bottom-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200/80 p-3 sm:p-4">
          <div className="max-w-5xl mx-auto flex items-center justify-end">
            {!isChecked ? (
              <button
                type="button"
                onClick={handleCheck}
                disabled={!selectedOption}
                className="w-full sm:w-auto sm:min-w-50 py-3.5 px-8 rounded-lg font-bold text-base text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed shadow-xs active:scale-98 transition-all cursor-pointer"
              >
                Kiểm tra đáp án
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                className={`w-full sm:w-auto sm:min-w-50 flex items-center justify-center gap-2 py-3.5 px-8 rounded-lg font-bold text-base text-white shadow-xs active:scale-98 transition-all cursor-pointer ${isCorrectChoice
                  ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100"
                  : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100"
                  }`}
              >
                <span>
                  {currentIndex === questions.length - 1
                    ? "Xem kết quả"
                    : "Câu tiếp theo"}
                </span>
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </footer>
      </div>
    );
  }

  /* --------------------------------------------------------
   * 2. PHASE RESULT
   * -------------------------------------------------------- */
  if (phase === "RESULT") {
    const totalQ = questions.length;
    const accuracy = totalQ > 0 ? Math.round((score / totalQ) * 100) : 0;
    const hasMistakes = incorrectWordIds.length > 0;

    return (
      <div className="min-h-dvh flex flex-col items-center justify-center bg-white text-zinc-900 p-4 sm:p-6 font-sans selection:bg-emerald-500/30">

        {/* Container chính: Viền vuông vức, không đổ bóng, giống một tờ báo cáo */}
        <div className="w-full max-w-xl bg-white border-2 border-zinc-900 flex flex-col relative">

          {/* Header: Badge & Tiêu đề */}
          <div className="p-8 sm:p-10 text-center flex flex-col items-center border-b-2 border-zinc-900 bg-[linear-gradient(to_right,#f4f4f5_1px,transparent_1px),linear-gradient(to_bottom,#f4f4f5_1px,transparent_1px)] bg-size-[16px_16px]">
            <div className="w-16 h-16 bg-zinc-900 text-white flex items-center justify-center mb-6">
              <Award className="w-8 h-8" />
            </div>

            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight mb-3">
              Tổng Kết Bài Học
            </h1>
            <p className="text-zinc-600 text-sm font-medium">
              {accuracy >= 80
                ? "Xuất sắc! Bạn đã nắm rất vững kiến thức hôm nay."
                : accuracy >= 50
                  ? "Khá tốt! Hãy ôn lại các từ chưa đúng để nhớ sâu hơn."
                  : "Đừng nản lòng, việc ôn tập sẽ giúp bạn tiến bộ vượt bậc!"}
            </p>
          </div>

          {/* Thông số (Score & Accuracy): Sử dụng Grid và Border chia ô */}
          <div className="grid grid-cols-2 divide-x-2 divide-zinc-900 border-b-2 border-zinc-900 bg-zinc-50">
            <div className="p-8 flex flex-col items-center justify-center">
              <div className="text-5xl sm:text-6xl font-black font-mono text-zinc-900 tracking-tighter">
                {score}<span className="text-3xl text-zinc-400">/{totalQ}</span>
              </div>
              <div className="text-xs font-bold uppercase tracking-widest text-zinc-500 mt-2">
                Điểm số
              </div>
            </div>
            <div className="p-8 flex flex-col items-center justify-center">
              <div className="text-5xl sm:text-6xl font-black font-mono tracking-tighter text-emerald-600">
                {accuracy}%
              </div>
              <div className="text-xs font-bold uppercase tracking-widest text-zinc-500 mt-2">
                Độ chính xác
              </div>
            </div>
          </div>

          {/* Chi tiết từ vựng (Stats Breakdown): Dạng danh sách kẻ ngang */}
          <div className="flex flex-col bg-white">
            <div className="flex items-center justify-between px-8 py-5 border-b-2 border-zinc-900">
              <span className="text-sm font-bold uppercase tracking-wider text-zinc-600">
                Từ vựng học hôm nay
              </span>
              <span className="text-lg font-black font-mono text-zinc-900">
                {totalQ}
              </span>
            </div>
            <div className="flex items-center justify-between px-8 py-5 border-b-2 border-zinc-900 bg-zinc-50">
              <span className="text-sm font-bold uppercase tracking-wider text-zinc-600">
                Từ cần ôn tập lại
              </span>
              <span
                className={`text-lg font-black font-mono ${hasMistakes ? "text-rose-600" : "text-emerald-600"
                  }`}
              >
                {incorrectWordIds.length}
              </span>
            </div>
          </div>

          {/* Hành động (Action Buttons): Nút bấm vuông vức, tràn viền */}
          <div className="flex flex-col sm:flex-row divide-y-2 sm:divide-y-0 sm:divide-x-2 divide-zinc-900 bg-white">
            {hasMistakes ? (
              <button
                type="button"
                onClick={() => {
                  setReviewWords([]);
                  setIsReviewLoading(true);
                  setReviewError(null);
                  setQuizPhase("REVIEW");
                }}
                className="flex-1 py-5 px-4 bg-zinc-900 text-white hover:bg-zinc-800 font-bold uppercase tracking-wider text-sm flex items-center justify-center gap-3 transition-colors cursor-pointer group"
              >
                <RotateCcw className="w-5 h-5 group-hover:-rotate-90 transition-transform duration-300" />
                <span>Ôn Lại Lỗi Sai</span>
              </button>
            ) : null}

            {!hasMistakes && (
              <button
                type="button"
                onClick={() => router.push("/")}
                className="flex-1 py-5 px-4 font-bold uppercase tracking-wider text-sm flex items-center justify-center gap-3 transition-colors cursor-pointer bg-emerald-500 text-zinc-950 hover:bg-emerald-400"
              >
                <Home className="w-5 h-5" />
                <span>Về Trang Chủ</span>
              </button>
            )}
          </div>

        </div>
      </div>
    );
  }

  /* --------------------------------------------------------
   * 3. PHASE REVIEW: Ôn tập lại từ vựng làm sai
   * -------------------------------------------------------- */
  if (phase === "REVIEW") {
    const currentReviewWord = reviewWords[reviewIndex] || reviewWords[0];
    const totalReview = reviewWords.length;

    const handleNextReview = () => {
      if (reviewIndex < totalReview - 1) {
        setReviewIndex(reviewIndex + 1);
        if (typeof window !== "undefined") {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      } else {
        router.push("/");
      }
    };

    return (
      <div className="min-h-dvh flex flex-col justify-between bg-slate-50 text-slate-800">
        {/* Top App Bar */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => setQuizPhase("RESULT")}
              className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 px-3 py-2 rounded-lg transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kết quả</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-bold text-rose-800 bg-rose-50 border border-rose-200/80 px-3 py-1.5 rounded-lg font-mono">
                Ôn tập {reviewIndex + 1} / {totalReview}
              </span>
            </div>
          </div>

          <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-1">
            <ProgressBar
              progress={totalReview > 0 ? ((reviewIndex + 1) / totalReview) * 100 : 100}
              height="h-1.5"
            />
          </div>
        </header>

        {/* Review Content: Uses full-screen expansive WordCard */}
        {isReviewLoading ? (
          <Loading message="Đang tải từ cần ôn..." />
        ) : reviewError ? (
          <main className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
            <p>{reviewError}</p>
            <button type="button" onClick={() => setQuizPhase("RESULT")} className="font-bold text-indigo-700">Quay lại kết quả</button>
          </main>
        ) : <main className="flex-1 flex items-stretch justify-center p-0 sm:items-center sm:p-5 md:p-8">
          <div className="w-full max-w-6xl mx-auto">
            <div className="mb-4 text-center">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-rose-50 text-rose-700 text-xs font-bold border border-rose-100">
                <BookOpen className="w-3.5 h-3.5" />
                Ôn lại để ghi nhớ sâu hơn
              </span>
            </div>

            {currentReviewWord && <WordCard vocabulary={currentReviewWord} />}
          </div>
        </main>}

        {/* Bottom Review Action */}
        <footer className="sticky bottom-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200/80 p-3 sm:p-4">
          <div className="max-w-6xl mx-auto flex items-center justify-end">
            <button
              type="button"
              onClick={handleNextReview}
              className="w-full sm:w-auto sm:min-w-50 flex items-center justify-center gap-2 py-3.5 px-8 rounded-lg font-bold text-base text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs active:scale-98 transition-all cursor-pointer"
            >
              <span>
                {reviewIndex === totalReview - 1
                  ? "Hoàn thành ôn tập"
                  : "Từ tiếp theo"}
              </span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </footer>
      </div>
    );
  }

  return null;
}
