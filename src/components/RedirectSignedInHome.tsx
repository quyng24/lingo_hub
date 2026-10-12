"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

export default function RedirectSignedInHome({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isProgressReady } = useAuth();

  useEffect(() => {
    if (isProgressReady && user) router.replace("/dashboard");
  }, [isProgressReady, router, user]);

  if (!isProgressReady || user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-950 text-sm font-semibold text-zinc-300">
        Đang mở bảng điều khiển...
      </main>
    );
  }

  return children;
}