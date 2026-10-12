"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isProgressReady } = useAuth();

  useEffect(() => {
    if (isProgressReady && !user) router.replace("/auth");
  }, [isProgressReady, router, user]);

  if (!isProgressReady || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 text-sm font-semibold text-zinc-300">
        Đang kiểm tra phiên đăng nhập...
      </main>
    );
  }

  return children;
}