"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { getSupabaseClient } from "@/lib/supabase";

type AuthMode = "sign-in" | "sign-up";

export default function AuthPage() {
  const router = useRouter();
  const { user, isProgressReady, progressError } = useAuth();
  const [mode, setMode] = useState<AuthMode>("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user && isProgressReady) router.replace("/dashboard");
  }, [user, isProgressReady, router]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setIsSubmitting(true);
    const client = getSupabaseClient();

    if (!client) {
      setError("Thiếu cấu hình Supabase trong .env.local.");
      setIsSubmitting(false);
      return;
    }

    const result = mode === "sign-in"
      ? await client.auth.signInWithPassword({ email, password })
      : await client.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/auth` },
        });

    if (result.error) {
      setError(result.error.message);
    } else if (mode === "sign-up" && !result.data.session) {
      setMessage("Hãy xác nhận địa chỉ email qua liên kết chúng tôi vừa gửi.");
    } else {
      router.replace("/dashboard");
    }
    setIsSubmitting(false);
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-zinc-950 px-5 py-12 text-zinc-100">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]" />
      <section className="relative w-full max-w-md border border-zinc-800 bg-zinc-950 p-6 shadow-2xl sm:p-9">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white"><ArrowLeft className="h-4 w-4" /> Trang chủ</Link>
        <p className="mt-8 text-xs font-mono font-bold uppercase tracking-[0.2em] text-emerald-400">LingoHub · Tiến trình cá nhân</p>
        <h1 className="mt-3 text-3xl font-black text-white">{mode === "sign-in" ? "Đăng nhập" : "Tạo tài khoản"}</h1>
        <p className="mt-2 text-sm leading-relaxed text-zinc-400">Đăng nhập để lưu lịch ôn từ vựng riêng và đồng bộ giữa các thiết bị.</p>

        <form onSubmit={submit} className="space-y-4">
          <label className="block text-sm font-semibold text-zinc-300">Email
            <input type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full border border-zinc-700 bg-zinc-900 px-3 py-3 text-white outline-none focus:border-emerald-400" />
          </label>
          <label className="block text-sm font-semibold text-zinc-300">Mật khẩu
            <input type="password" autoComplete={mode === "sign-in" ? "current-password" : "new-password"} minLength={6} required value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full border border-zinc-700 bg-zinc-900 px-3 py-3 text-white outline-none focus:border-emerald-400" />
          </label>
          {error && <p role="alert" className="text-sm text-rose-300">{error}</p>}
          {message && <p role="status" className="text-sm text-emerald-300">{message}</p>}
          {progressError && <p role="alert" className="text-sm text-amber-300">Đăng nhập được nhưng chưa tải được lịch ôn: {progressError}</p>}
          <button type="submit" disabled={isSubmitting} className="w-full bg-emerald-500 px-4 py-3 font-black uppercase tracking-wider text-zinc-950 hover:bg-emerald-400 disabled:cursor-wait disabled:opacity-60">
            {isSubmitting ? "Đang xử lý..." : mode === "sign-in" ? "Đăng nhập bằng email" : "Tạo tài khoản"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-zinc-500">
          {mode === "sign-in" ? "Chưa có tài khoản?" : "Đã có tài khoản?"}{" "}
          <button type="button" onClick={() => { setMode(mode === "sign-in" ? "sign-up" : "sign-in"); setError(null); setMessage(null); }} className="font-bold text-emerald-300 hover:text-emerald-200">
            {mode === "sign-in" ? "Đăng ký" : "Đăng nhập"}
          </button>
        </p>
      </section>
    </main>
  );
}