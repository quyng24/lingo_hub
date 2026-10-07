'use client'

import React, { createContext, useContext, useCallback, useEffect, useRef, useState } from "react";
import { fetchGameTopics, fetchGameWords, LearningTopic } from "@/lib/learningData";
import { ActiveWord, Explosion, GameStatePhase2, Word } from "@/types";

const INITIAL_STATE: GameStatePhase2 = {
    status: "idle",
    score: 0,
    lives: 3,
    combo: 0,
    level: 1,
    activeWords: [],
    currentInput: "",
    lastMissedWord: null,
    explosions: [], 
    isShaking: false,
    selectedTopicId: null,
};

const getDynamicSpeed = (level: number) => {
    const minSpeed = 1.0 + (level - 1) * 0.3; 
    const variance = 1.0 + (level - 1) * 0.2; 
    return Math.random() * variance + minSpeed;
};

const getSpawnInterval = (level: number) => Math.max(1500, 4500 - (level - 1) * 400);

const generateWordInstance = (word: Word, level: number): ActiveWord => ({
    ...word,
    id: `${word.id}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    x: Math.floor(Math.random() * 70) + 15,
    y: 0,
    speed: getDynamicSpeed(level),
});

export const useGameEngineState = () => {
    const [gameState, setGameState] = useState<GameStatePhase2>(INITIAL_STATE);
    const [topics, setTopics] = useState<LearningTopic[]>([]);
    const [topicError, setTopicError] = useState<string | null>(null);
    const [isStarting, setIsStarting] = useState(false);
    const topicWordsRef = useRef<Word[]>([]);
    const shakeUntilRef = useRef<number>(0);
    const lastMissedWordRef = useRef<Word | null>(null);

    useEffect(() => {
        let isActive = true;
        fetchGameTopics()
            .then((data) => {
                if (isActive) setTopics(data);
            })
            .catch((error: unknown) => {
                if (isActive) setTopicError(error instanceof Error ? error.message : "Không tải được chủ đề game.");
            });

        return () => {
            isActive = false;
        };
    }, []);

    const goToMenu = useCallback(() => {
        setGameState(INITIAL_STATE);
        setTopicError(null);
    }, []);

    const startGame = useCallback(async (topicId: string) => {
        setIsStarting(true);
        setTopicError(null);
        shakeUntilRef.current = 0;
        lastMissedWordRef.current = null;

        try {
            const topicWords = await fetchGameWords(topicId);
            if (topicWords.length === 0) throw new Error("Chủ đề này chưa có từ vựng.");
            topicWordsRef.current = topicWords;
            const initialWord = generateWordInstance(topicWords[Math.floor(Math.random() * topicWords.length)], 1);

            setGameState({
                ...INITIAL_STATE,
                status: "playing",
                selectedTopicId: topicId,
                activeWords: [initialWord],
            });
        } catch (error) {
            setTopicError(error instanceof Error ? error.message : "Không bắt đầu được game.");
        } finally {
            setIsStarting(false);
        }
    }, []);

    const spawnWord = useCallback(() => {
        setGameState((prev) => {
            if (prev.status !== "playing") return prev;

            // Prioritize words that are not already active on screen
            const topicWords = topicWordsRef.current;
            if (topicWords.length === 0) return prev;
            const activeTexts = new Set(prev.activeWords.map((w) => w.text));
            const availableWords = topicWords.filter((w) => !activeTexts.has(w.text));
            const pool = availableWords.length > 0 ? availableWords : topicWords;
            const randomWord = pool[Math.floor(Math.random() * pool.length)];

            const newActiveWord = generateWordInstance(randomWord, prev.level);

            return {
                ...prev,
                activeWords: [...prev.activeWords, newActiveWord],
            };
        });
    }, []);

    // 60/120 FPS game loop using requestAnimationFrame and Delta Time
    useEffect(() => {
        if (gameState.status !== "playing") return;

        let animationFrameId: number;
        let lastTime = performance.now();

        const loop = (currentTime: number) => {
            const dt = Math.min((currentTime - lastTime) / 1000, 0.1); 
            lastTime = currentTime;

            setGameState((prev) => {
                if (prev.status !== "playing") return prev;

                let newLives = prev.lives;
                let newCombo = prev.combo;
                const updatedWords: ActiveWord[] = [];

                for (const word of prev.activeWords) {
                    const nextY = word.y + word.speed * dt;
                    if (nextY >= 95) {
                        newLives -= 1;
                        newCombo = 0; 
                        shakeUntilRef.current = currentTime + 600;
                        lastMissedWordRef.current = word;
                    } else {
                        updatedWords.push({ ...word, y: nextY });
                    }
                }

                const updatedExplosions = prev.explosions.reduce((acc, exp) => {
                    const newTimeLeft = exp.timeLeft - dt;
                    if (newTimeLeft > 0) {
                        acc.push({ ...exp, timeLeft: newTimeLeft });
                    }
                    return acc;
                }, [] as Explosion[]);

                const isShaking = currentTime < shakeUntilRef.current;
                const lastMissedWord = isShaking ? lastMissedWordRef.current : null;

                if (newLives <= 0) {
                    shakeUntilRef.current = 0;
                    lastMissedWordRef.current = null;
                    return {
                        ...prev,
                        status: "game-over",
                        lives: 0,
                        combo: 0,
                        isShaking: false,
                        lastMissedWord: null,
                        activeWords: [],
                        explosions: [],
                        currentInput: "",
                    };
                }

                return {
                    ...prev,
                    activeWords: updatedWords,
                    explosions: updatedExplosions,
                    lives: newLives,
                    combo: newCombo,
                    isShaking,
                    lastMissedWord,
                };
            });

            animationFrameId = requestAnimationFrame(loop);
        };

        animationFrameId = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(animationFrameId);
    }, [gameState.status]);

    // Word spawning interval
     useEffect(() => {
        if (gameState.status !== "playing") return;
        const intervalMs = getSpawnInterval(gameState.level);
        const spawnInterval = setInterval(spawnWord, intervalMs);
        return () => clearInterval(spawnInterval);
    }, [gameState.status, gameState.level, spawnWord]);

    // Keydown handler
    useEffect(() => {
        if (gameState.status !== "playing") return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === " ") e.preventDefault();
            if (e.key.length > 1 && e.key !== "Backspace") return;
    
            setGameState((prev) => {
                if (prev.status !== "playing") return prev;

                let newInput = prev.currentInput;

                if (e.key === "Backspace") {
                    newInput = newInput.slice(0, -1);
                } 
                else if (/^[a-zA-Z ]$/.test(e.key)) {
                    newInput += e.key.toLowerCase();
                } 
                else {
                    return prev; 
                }

                const matchedWordIndex = prev.activeWords.findIndex((w) => w.text.toLowerCase() === newInput);

                if (matchedWordIndex !== -1) {
                    const newActiveWords = [...prev.activeWords];
                    const matchedWord = newActiveWords.splice(matchedWordIndex, 1)[0];

                    const basePoints = matchedWord.text.length * 10;
                    const comboMultiplier = 1 + Math.floor(prev.combo / 5) * 0.5; 
                    const earnedScore = Math.floor(basePoints * comboMultiplier);
                    const newScore = prev.score + earnedScore;
                    const newLevel = Math.floor(newScore / 500) + 1; 

                    const newExplosion: Explosion = {
                        id: Date.now().toString() + Math.random().toString(36).substring(2, 5),
                        x: matchedWord.x,
                        y: matchedWord.y,
                        text: matchedWord.text,
                        earnedScore: earnedScore,
                        timeLeft: 0.8,
                    };

                    return {
                        ...prev,
                        score: newScore,
                        level: newLevel,
                        activeWords: newActiveWords,
                        currentInput: "",
                        combo: prev.combo + 1,
                        explosions: [...prev.explosions, newExplosion],
                    };
                }

                return { ...prev, currentInput: newInput };
            });
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [gameState.status]);

    return { gameState, topics, topicError, isStarting, startGame, goToMenu };
};

export type GameEngine = ReturnType<typeof useGameEngineState>;

const GameContext = createContext<GameEngine | null>(null);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const engine = useGameEngineState();
    return React.createElement(GameContext.Provider, { value: engine }, children);
};

const DEFAULT_FALLBACK: GameEngine = {
    gameState: INITIAL_STATE,
    topics: [],
    topicError: null,
    isStarting: false,
    startGame: async () => {},
    goToMenu: () => {},
};

export const useGameEngine = (): GameEngine => {
    const context = useContext(GameContext);
    return context || DEFAULT_FALLBACK;
};