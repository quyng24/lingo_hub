import { create } from "zustand";
import type { ReviewRecord } from "@/services/learningProgressService";

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
	setReviewSchedule: (schedule: Record<string, ReviewRecord>) => void;
	setWordProgress: (wordId: string, record: ReviewRecord) => void;
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

export const useLearningStore = create<LearningStore>()((set) => ({
	reviewSchedule: {},
	...initialQuiz,
	setReviewSchedule: (reviewSchedule) => set({ reviewSchedule }),
	setWordProgress: (wordId, record) => set((state) => ({
		reviewSchedule: { ...state.reviewSchedule, [wordId]: record },
	})),
	selectOption: (option) => set({ selectedOption: option }),
	checkAnswer: (wordId, isCorrect) =>
		set((state) => {
			if (state.isChecked) return state;
			return {
				isChecked: true,
				score: isCorrect ? state.score + 1 : state.score,
				incorrectWordIds: isCorrect || state.incorrectWordIds.includes(wordId)
					? state.incorrectWordIds
					: [...state.incorrectWordIds, wordId],
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
}));

