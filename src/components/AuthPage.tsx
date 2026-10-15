"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/components/AuthProvider";
import { authService } from "@/services/authService";

type AuthMode = "sign-in" | "sign-up";
type SignInAttempts = {
  windowStartedAt: number;
  count: number;
  blockedUntil: number;
};

const SIGN_IN_ATTEMPTS_KEY = "lingohub-sign-in-attempts";
const MAX_SIGN_IN_ATTEMPTS = 5;
const SIGN_IN_WINDOW_MS = 15 * 60 * 1000;
const SIGN_IN_COOLDOWN_MS = 60 * 1000;
const getCurrentTime = () => Date.now();

function readSignInAttempts(): SignInAttempts {
  try {
    const saved = sessionStorage.getItem(SIGN_IN_ATTEMPTS_KEY);
    if (saved) {
      const parsed: unknown = JSON.parse(saved);
      if (
        typeof parsed === "object" && parsed !== null &&
        "windowStartedAt" in parsed && typeof parsed.windowStartedAt === "number" &&
        "count" in parsed && typeof parsed.count === "number" &&
        "blockedUntil" in parsed && typeof parsed.blockedUntil === "number"
      ) {
        const attempts = parsed as SignInAttempts;
        if (attempts.blockedUntil > 0 && attempts.blockedUntil <= Date.now()) {
          return { windowStartedAt: 0, count: 0, blockedUntil: 0 };
        }
        return attempts;
      }
    }
  } catch {
    return { windowStartedAt: 0, count: 0, blockedUntil: 0 };
  }
  return { windowStartedAt: 0, count: 0, blockedUntil: 0 };
}

function saveSignInAttempts(attempts: SignInAttempts) {
  try {
    sessionStorage.setItem(SIGN_IN_ATTEMPTS_KEY, JSON.stringify(attempts));
  } catch {
    // Supabase server-side rate limits still apply when browser storage is unavailable.
  }
}

export default function AuthPage() {
  const router = useRouter();
  const { progressError } = useAuth();
  const [mode, setMode] = useState<AuthMode>("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cooldownUntil, setCooldownUntil] = useState(0);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);

  useEffect(() => {
    const { blockedUntil } = readSignInAttempts();
    if (blockedUntil > Date.now()) {
      queueMicrotask(() => setCooldownUntil(blockedUntil));
    }
  }, []);

  useEffect(() => {
    if (!cooldownUntil) return;
    const updateCooldown = () => {
      const seconds = Math.max(0, Math.ceil((cooldownUntil - Date.now()) / 1000));
      setCooldownSeconds(seconds);
      if (seconds === 0) {
        const attempts = readSignInAttempts();
        saveSignInAttempts({ ...attempts, count: 0, windowStartedAt: 0, blockedUntil: 0 });
        setCooldownUntil(0);
      }
    };
    const initialUpdate = window.setTimeout(updateCooldown, 0);
    const interval = window.setInterval(updateCooldown, 1000);
    return () => {
      window.clearTimeout(initialUpdate);
      window.clearInterval(interval);
    };
  }, [cooldownUntil]);

  useEffect(() => {
    if (progressError) toast.error(`Đăng nhập được nhưng chưa tải được lịch ôn: ${progressError}`);
  }, [progressError]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (mode === "sign-in") {
      const { blockedUntil } = readSignInAttempts();
      if (blockedUntil > getCurrentTime()) {
        setCooldownUntil(blockedUntil);
        toast.error("Bạn đã thử đăng nhập quá nhiều lần. Hãy chờ hết thời gian khóa rồi thử lại.");
        return;
      }
    }
    setIsSubmitting(true);
    if (!authService.isConfigured) {
      toast.error("Thiếu cấu hình Supabase trong .env.local.");
      setIsSubmitting(false);
      return;
    }

    const result = mode === "sign-in"
      ? await authService.signInWithPassword(email, password)
      : await authService.signUp(email, password, `${window.location.origin}/auth`);

    if (result.error) {
      if (mode === "sign-in" && (result.error.status === 400 || result.error.status === 401)) {
        const now = getCurrentTime();
        const previous = readSignInAttempts();
        const withinWindow = now - previous.windowStartedAt < SIGN_IN_WINDOW_MS;
        const count = (withinWindow ? previous.count : 0) + 1;
        const windowStartedAt = withinWindow ? previous.windowStartedAt : now;
        const blockedUntil = count >= MAX_SIGN_IN_ATTEMPTS ? now + SIGN_IN_COOLDOWN_MS : 0;
        saveSignInAttempts({ windowStartedAt, count, blockedUntil });
        if (blockedUntil) setCooldownUntil(blockedUntil);
      }
      toast.error(result.error.message);
    } else if (mode === "sign-up" && !result.data.session) {
      toast.success("Hãy xác nhận địa chỉ email qua liên kết chúng tôi vừa gửi.");
    } else {
      saveSignInAttempts({ windowStartedAt: 0, count: 0, blockedUntil: 0 });
      toast.success(mode === "sign-in" ? "Đăng nhập thành công." : "Tạo tài khoản thành công.");
      router.replace(getPostAuthDestination());
    }
    setIsSubmitting(false);
  }

  function getPostAuthDestination() {
    const destination = new URL(window.location.href).searchParams.get("next");
    if (!destination?.startsWith("/") || destination.startsWith("//")) return "/dashboard";
    return destination;
  }

  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-x-hidden overflow-y-auto bg-zinc-950 px-0 py-0 text-zinc-100 sm:px-5 sm:py-12">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]" />
      <section className="relative flex min-h-dvh w-full flex-col justify-center border-0 bg-zinc-950 p-6 shadow-none sm:min-h-0 sm:max-w-md sm:border sm:border-zinc-800 sm:p-9 sm:shadow-2xl">
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
          <button type="submit" disabled={isSubmitting || (mode === "sign-in" && cooldownSeconds > 0)} className="w-full bg-emerald-500 px-4 py-3 font-black uppercase tracking-wider text-zinc-950 hover:bg-emerald-400 disabled:cursor-wait disabled:opacity-60">
            {isSubmitting ? "Đang xử lý..." : cooldownSeconds > 0 && mode === "sign-in" ? `Thử lại sau ${cooldownSeconds}s` : mode === "sign-in" ? "Đăng nhập bằng email" : "Tạo tài khoản"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-zinc-500">
          {mode === "sign-in" ? "Chưa có tài khoản?" : "Đã có tài khoản?"}{" "}
          <button type="button" onClick={() => setMode(mode === "sign-in" ? "sign-up" : "sign-in")} className="font-bold text-emerald-300 hover:text-emerald-200">
            {mode === "sign-in" ? "Đăng ký" : "Đăng nhập"}
          </button>
        </p>
      </section>
    </main>
  );
}