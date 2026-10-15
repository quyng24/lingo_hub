"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { authService } from "@/services/authService";
import { learningProgressService } from "@/services/learningProgressService";
import { useLearningStore } from "@/stores/learningStore";

type AuthContextValue = {
  user: User | null;
  isProgressReady: boolean;
  progressError: string | null;
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isProgressReady: true,
  progressError: null,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [loadedUserId, setLoadedUserId] = useState<string | null | undefined>();
  const [progressError, setProgressError] = useState<string | null>(null);
  const setReviewSchedule = useLearningStore((state) => state.setReviewSchedule);

  useEffect(() => {
    if (!authService.isConfigured) {
      queueMicrotask(() => setIsAuthReady(true));
      return;
    }

    let isActive = true;
    const subscription = authService.onAuthStateChange((nextSession) => {
      if (isActive) setSession(nextSession);
    });

    authService.getSession().then(({ data, error }) => {
      if (!isActive) return;
      if (error) setProgressError(error.message);
      setSession(data.session);
      setIsAuthReady(true);
    });

    return () => {
      isActive = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!isAuthReady) return;
    let isActive = true;
    const userId = session?.user.id ?? null;

    Promise.resolve()
      .then(() => {
        if (!isActive) return {};
        useLearningStore.getState().resetQuiz();
        setReviewSchedule({});
        return userId ? learningProgressService.fetchForUser(userId) : {};
      })
      .then((schedule) => {
        if (!isActive) return;
        setReviewSchedule(schedule);
        setProgressError(null);
        setLoadedUserId(userId);
      })
      .catch((error: unknown) => {
        if (!isActive) return;
        setProgressError(error instanceof Error ? error.message : "Không tải được tiến trình.");
        setLoadedUserId(userId);
      });

    return () => { isActive = false; };
  }, [isAuthReady, session?.user.id, setReviewSchedule]);

  const isProgressReady = isAuthReady && loadedUserId === (session?.user.id ?? null);

  return (
    <AuthContext.Provider value={{ user: session?.user ?? null, isProgressReady, progressError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}