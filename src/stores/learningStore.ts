import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type ReviewRecord = {
	streak: number;
	intervalDays: number;
	dueAt: string;
};

type QuizPhase = "QUIZ" | "RESULT" | "REVIEW";

type LearningStore = {
	reviewSchedule: Record<string, ReviewRecord>;
	quizPhase: QuizPhase;
	currentIndex: number;
	selectedOption: string | null;
	isChecked: boolean;
	score: number;
	incorrectWordIds: string[];
	reviewIndex: number;
	selectOption: (option: string | null) => void;
	checkAnswer: (wordId: string, isCorrect: boolean) => void;
	nextQuestion: (isLastQuestion: boolean) => void;
	setQuizPhase: (phase: QuizPhase) => void;
	setReviewIndex: (index: number) => void;
	resetQuiz: () => void;
};

const initialQuiz = {
	quizPhase: "QUIZ" as QuizPhase,
	currentIndex: 0,
	selectedOption: null,
	isChecked: false,
	score: 0,
	incorrectWordIds: [] as string[],
	reviewIndex: 0,
};

const reviewIntervals = [1, 3, 7, 14, 30];

export const useLearningStore = create<LearningStore>()(
	persist(
		(set) => ({
			reviewSchedule: {},
			...initialQuiz,
			selectOption: (option) => set({ selectedOption: option }),
			checkAnswer: (wordId, isCorrect) =>
				set((state) => {
					if (state.isChecked) return state;
					const previous = state.reviewSchedule[wordId];
					const streak = isCorrect ? (previous?.streak ?? 0) + 1 : 0;
					const intervalDays = isCorrect
						? reviewIntervals[Math.min(streak - 1, reviewIntervals.length - 1)]
						: 1;
					const dueAt = new Date();
					dueAt.setDate(dueAt.getDate() + intervalDays);

					return {
						isChecked: true,
						score: isCorrect ? state.score + 1 : state.score,
						incorrectWordIds: isCorrect || state.incorrectWordIds.includes(wordId)
							? state.incorrectWordIds
							: [...state.incorrectWordIds, wordId],
						reviewSchedule: {
							...state.reviewSchedule,
							[wordId]: { streak, intervalDays, dueAt: dueAt.toISOString() },
						},
					};
				}),
			nextQuestion: (isLastQuestion) =>
				set((state) => ({
					currentIndex: isLastQuestion ? state.currentIndex : state.currentIndex + 1,
					selectedOption: null,
					isChecked: false,
					quizPhase: isLastQuestion ? "RESULT" : state.quizPhase,
				})),
			setQuizPhase: (quizPhase) => set({ quizPhase }),
			setReviewIndex: (reviewIndex) => set({ reviewIndex }),
			resetQuiz: () => set(initialQuiz),
		}),
		{
			name: "lingo-learning-progress",
			storage: createJSONStorage(() => localStorage),
			partialize: (state) => ({
				reviewSchedule: state.reviewSchedule,
				quizPhase: state.quizPhase,
				currentIndex: state.currentIndex,
				selectedOption: state.selectedOption,
				isChecked: state.isChecked,
				score: state.score,
				incorrectWordIds: state.incorrectWordIds,
				reviewIndex: state.reviewIndex,
			}),
		},
	),
);
