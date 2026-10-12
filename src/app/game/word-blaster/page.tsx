import { GameProvider } from "@/hooks/useGameEngine";
import WordBlaster from "@/pages/WordBlaster";
import RequireAuth from "@/components/RequireAuth";
import { headers } from "next/headers";
import { ArrowLeft, Monitor } from "lucide-react";
import Link from "next/link";

export default async function Game() {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";
  const isMobile =
    /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Opera M(obi|ini)/i.test(
      userAgent,
    );

  if (isMobile) {
    return (
      <RequireAuth>
      <div className="flex md:hidden min-h-screen bg-slate-950 flex-col items-center justify-center text-center p-8 z-50 fixed inset-0">
        <div className="w-24 h-24 mb-6 rounded-3xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(244,63,94,0.2)]">
          <Monitor className="w-12 h-12 text-rose-500 animate-pulse" />
        </div>
        <h1 className="text-3xl font-black mb-4 text-white tracking-wide">
          Chỉ hỗ trợ <span className="text-rose-500">Máy tính</span>
        </h1>
        <p className="text-slate-400 text-base mb-8 leading-relaxed max-w-sm">
          WordBlaster yêu cầu phản xạ nhanh và{" "}
          <strong className="text-white">bàn phím cứng</strong> để luyện gõ 10
          ngón. Vui lòng mở trang web trên PC/Laptop để chơi.
        </p>
        <Link
          href="/dashboard"
          className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-full transition-colors font-bold"
        >
          <ArrowLeft className="w-5 h-5" /> Bảng điều khiển
        </Link>
      </div>
      </RequireAuth>
    );
  }
  return (
    <RequireAuth>
      <GameProvider>
        <WordBlaster />
      </GameProvider>
    </RequireAuth>
  );
}
