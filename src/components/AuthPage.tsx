"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useEffect, useState } from "react";
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

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
      />
      <path
        fill="#4285F4"
        d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
      />
      <path
        fill="#FBBC05"
        d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3 0-.8.1-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15.2c0 2.8.7 5.5 1.9 7.8l3.7-2.9z"
      />
      <path
        fill="#34A853"
        d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2-6.4-4.8L1.9 17C3.7 20.7 7.5 23.5 12 23.5z"
      />
    </svg>
  );
}

export default function AuthPage() {
  const router = useRouter();
  const { user, progressError } = useAuth();
  const [mode, setMode] = useState<AuthMode>("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOAuthSubmitting, setIsOAuthSubmitting] = useState(false);
  const [cooldownUntil, setCooldownUntil] = useState(0);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);

  useEffect(() => {
    if (user) {
      window.location.href = getPostAuthDestination();
    }
  }, [user]);

  useEffect(() => {
    const { blockedUntil } = readSignInAttempts();
    if (blockedUntil > Date.now()) {
      queueMicrotask(() => setCooldownUntil(blockedUntil));
    }
  }, []);

  useEffect(() => {
    const searchParams = new URL(window.location.href).searchParams;
    const errorParam = searchParams.get("error");
    const messageParam = searchParams.get("message");
    if (errorParam === "oauth_failed") {
      toast.error(messageParam || "Đăng nhập bằng Google không thành công. Hãy thử lại.");
    } else if (errorParam === "missing_config") {
      toast.error("Hệ thống chưa cấu hình đầy đủ Supabase trong .env.local.");
    }
  }, []);

  useEffect(() => {
    if (!cooldownUntil) return;
    const updateCooldown = () => {
      const seconds = Math.max(0, Math.ceil((cooldownUntil - Date.now()) / 1000));
      setCooldownSeconds(seconds);
      if (seconds === 0) {
        saveSignInAttempts({ windowStartedAt: 0, count: 0, blockedUntil: 0 });
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

  function getPostAuthDestination() {
    const destination = new URL(window.location.href).searchParams.get("next");
    if (!destination?.startsWith("/") || destination.startsWith("//")) return "/dashboard";
    return destination;
  }

  async function handleGoogleSignIn() {
    if (!authService.isConfigured) {
      toast.error("Thiếu cấu hình Supabase trong .env.local.");
      return;
    }

    setIsOAuthSubmitting(true);
    const destination = getPostAuthDestination();
    // Lưu destination vào cookie ngắn hạn để URL redirectTo gửi tới Supabase luôn sạch sẽ (tránh lỗi GoTrue glob wildcard với query params)
    document.cookie = `lingohub_auth_next=${encodeURIComponent(destination)}; path=/; max-age=300; SameSite=Lax`;
    const redirectTo = `${window.location.origin}/auth/callback`;
    const { error } = await authService.signInWithOAuth("google", redirectTo);
    if (error) {
      toast.error(error.message);
      setIsOAuthSubmitting(false);
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (mode === "sign-in") {
      const { blockedUntil } = readSignInAttempts();
      if (blockedUntil > Date.now()) {
        setCooldownUntil(blockedUntil);
        toast.error("Bạn đã thử đăng nhập quá nhiều lần. Hãy chờ hết thời gian khóa rồi thử lại.");
        return;
      }
    }

    if (!authService.isConfigured) {
      toast.error("Thiếu cấu hình Supabase trong .env.local.");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = mode === "sign-in"
        ? await authService.signInWithPassword(email, password)
        : await authService.signUp(email, password, `${window.location.origin}/auth`);

      if (result.error) {
        if (mode === "sign-in" && (result.error.status === 400 || result.error.status === 401)) {
          const now = Date.now();
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
        toast.success("Đăng nhập thành công!");
        const destination = getPostAuthDestination();
        router.refresh();
        window.location.href = destination;
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không thể đăng nhập lúc này.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (user) {
    return (
      <main className="relative flex min-h-dvh items-center justify-center bg-zinc-950 px-4 text-zinc-100">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-mono text-zinc-400">Đang chuyển hướng đến bảng điều khiển...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-x-hidden overflow-y-auto bg-zinc-950 px-4 py-8 text-zinc-100 sm:px-5 sm:py-12">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]" />
      <section className="relative flex w-full flex-col justify-center border border-zinc-800 bg-zinc-950 p-6 shadow-2xl sm:max-w-md sm:p-9">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-white">
          <ArrowLeft className="h-4 w-4" /> Trang chủ
        </Link>
        <p className="mt-8 text-xs font-mono font-bold uppercase tracking-[0.2em] text-emerald-400">
          LingoHub · Tiến trình cá nhân
        </p>
        <h1 className="mt-2 text-3xl font-black text-white">
          {mode === "sign-in" ? "Đăng nhập" : "Tạo tài khoản"}
        </h1>
        <p className="mt-2 text-xs leading-relaxed text-zinc-400 sm:text-sm">
          Lưu lịch ôn từ vựng riêng và đồng bộ tiến độ giữa các thiết bị.
        </p>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isOAuthSubmitting || isSubmitting}
          className="mt-6 flex w-full items-center justify-center gap-3 border border-zinc-700 bg-zinc-900/80 px-4 py-3 text-sm font-semibold text-zinc-200 transition-colors hover:border-zinc-500 hover:bg-zinc-800 disabled:cursor-wait disabled:opacity-60"
        >
          <GoogleIcon className="h-4 w-4 shrink-0" />
          <span>{isOAuthSubmitting ? "Đang chuyển hướng..." : "Tiếp tục với Google"}</span>
        </button>

        <div className="relative my-6 flex items-center justify-center">
          <div className="w-full border-t border-zinc-800" />
          <span className="absolute bg-zinc-950 px-3 text-[11px] font-mono uppercase tracking-wider text-zinc-500">
            hoặc với email
          </span>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <label className="block text-xs font-mono font-bold uppercase tracking-wider text-zinc-300">
            Email
            <input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-1.5 w-full border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-white outline-none focus:border-emerald-400 font-sans"
              placeholder="ten@example.com"
            />
          </label>
          <label className="block text-xs font-mono font-bold uppercase tracking-wider text-zinc-300">
            Mật khẩu
            <input
              type="password"
              autoComplete={mode === "sign-in" ? "current-password" : "new-password"}
              minLength={6}
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-1.5 w-full border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-white outline-none focus:border-emerald-400 font-sans"
              placeholder="Ít nhất 6 ký tự"
            />
          </label>
          <button
            type="submit"
            disabled={isSubmitting || isOAuthSubmitting || (mode === "sign-in" && cooldownSeconds > 0)}
            className="mt-2 w-full bg-emerald-500 px-4 py-3 text-xs font-black uppercase tracking-widest text-zinc-950 transition-colors hover:bg-emerald-400 disabled:cursor-wait disabled:opacity-60"
          >
            {isSubmitting
              ? "Đang xử lý..."
              : cooldownSeconds > 0 && mode === "sign-in"
                ? `Thử lại sau ${cooldownSeconds}s`
                : mode === "sign-in"
                  ? "Đăng nhập bằng email"
                  : "Tạo tài khoản"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-zinc-400">
          {mode === "sign-in" ? "Chưa có tài khoản?" : "Đã có tài khoản?"}{" "}
          <button
            type="button"
            onClick={() => setMode(mode === "sign-in" ? "sign-up" : "sign-in")}
            className="ml-1 font-bold text-emerald-400 hover:text-emerald-300"
          >
            {mode === "sign-in" ? "Đăng ký ngay" : "Đăng nhập"}
          </button>
        </p>
      </section>
    </main>
  );
}
