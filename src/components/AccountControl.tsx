"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { getSupabaseClient } from "@/lib/supabase";

export default function AccountControl() {
  const { user } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  async function signOut() {
    const client = getSupabaseClient();
    if (!client) return;
    const { error: signOutError } = await client.auth.signOut();
    if (signOutError) {
      setError(signOutError.message);
      return;
    }
    router.refresh();
  }

  if (!user) {
    return (
      <Link href="/auth" className="border border-emerald-500/50 px-4 py-2 text-xs font-bold uppercase tracking-wider text-emerald-300 hover:bg-emerald-500 hover:text-zinc-950">
        Đăng nhập
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="hidden max-w-48 truncate text-xs text-zinc-400 sm:inline">{user.email}</span>
      <Link href="/dashboard" className="text-xs font-bold text-emerald-300 hover:text-emerald-200">Dashboard</Link>
      <button type="button" onClick={signOut} title="Đăng xuất" className="inline-flex items-center gap-2 border border-zinc-700 px-3 py-2 text-xs font-bold text-zinc-300 hover:border-rose-400 hover:text-rose-300">
        <LogOut className="h-4 w-4" /> <span className="hidden sm:inline">Đăng xuất</span>
      </button>
      {error && <span role="alert" className="sr-only">{error}</span>}
    </div>
  );
}