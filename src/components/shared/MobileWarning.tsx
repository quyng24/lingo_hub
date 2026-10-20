import Link from 'next/link';
import { ArrowLeft, Gamepad2, Monitor } from 'lucide-react';

export interface MobileWarningProps {
  gameTitle?: string;
  gameIcon?: string;
  accentColor?: 'cyan' | 'amber' | 'rose' | 'emerald';
  description?: string;
  backHref?: string;
  backLabel?: string;
  showDashboardLink?: boolean;
  className?: string;
}

const colorStyles = {
  cyan: {
    border: 'border-cyan-500/30',
    badge: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300',
    iconBg: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.25)]',
    highlight: 'text-cyan-400',
    primaryBtn: 'bg-cyan-500 hover:bg-cyan-400 text-zinc-950 shadow-cyan-500/20',
  },
  amber: {
    border: 'border-amber-500/30',
    badge: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
    iconBg: 'bg-amber-500/10 border-amber-500/30 text-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.25)]',
    highlight: 'text-amber-400',
    primaryBtn: 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20',
  },
  rose: {
    border: 'border-rose-500/30',
    badge: 'bg-rose-500/10 border-rose-500/30 text-rose-300',
    iconBg: 'bg-rose-500/10 border-rose-500/30 text-rose-400 shadow-[0_0_30px_rgba(244,63,94,0.25)]',
    highlight: 'text-rose-400',
    primaryBtn: 'bg-rose-500 hover:bg-rose-400 text-white shadow-rose-500/20',
  },
  emerald: {
    border: 'border-emerald-500/30',
    badge: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
    iconBg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.25)]',
    highlight: 'text-emerald-400',
    primaryBtn: 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-emerald-500/20',
  },
};

export default function MobileWarning({
  gameTitle,
  gameIcon = '🎮',
  accentColor = 'cyan',
  description,
  backHref = '/game',
  backLabel = 'Thư viện Game',
  showDashboardLink = true,
  className = '',
}: MobileWarningProps) {
  const styles = colorStyles[accentColor] || colorStyles.cyan;

  const defaultDescription = gameTitle
    ? `${gameTitle} yêu cầu phản xạ nhanh và sử dụng bàn phím vật lý để chơi. Vui lòng mở trang web trên PC/Laptop để có trải nghiệm tốt nhất.`
    : 'Trò chơi này yêu cầu phản xạ nhanh và sử dụng bàn phím máy tính. Vui lòng mở trang web trên PC/Laptop để có trải nghiệm tốt nhất.';

  return (
    <div
      className={`flex min-h-screen bg-slate-950 flex-col items-center justify-center text-center p-6 sm:p-8 z-50 fixed inset-0 font-sans select-none ${className}`}
    >
      {/* Background grid */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] bg-size-[24px_24px] opacity-40" />

      <div
        className={`relative max-w-md w-full bg-slate-900/90 border ${styles.border} rounded-3xl p-6 sm:p-8 flex flex-col items-center backdrop-blur-xl shadow-2xl`}
      >
        {/* Animated Monitor Icon */}
        <div
          className={`w-20 h-20 mb-5 rounded-3xl border flex items-center justify-center ${styles.iconBg}`}
        >
          <Monitor className="w-10 h-10 animate-pulse" />
        </div>

        {gameTitle && (
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-mono font-bold uppercase tracking-wider mb-3 ${styles.badge}`}
          >
            <span>{gameIcon}</span> {gameTitle}
          </div>
        )}

        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-3">
          Chỉ hỗ trợ <span className={styles.highlight}>Máy tính</span>
        </h1>

        <p className="text-slate-300 text-sm leading-relaxed mb-6 font-normal">
          {description || defaultDescription}
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
          <Link
            href={backHref}
            className={`w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl transition-all font-bold text-sm shadow-lg active:scale-95 ${styles.primaryBtn}`}
          >
            <Gamepad2 className="w-4 h-4" /> {backLabel}
          </Link>
          {showDashboardLink && (
            <Link
              href="/dashboard"
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-all font-bold text-sm border border-slate-700 active:scale-95"
            >
              <ArrowLeft className="w-4 h-4" /> Bảng điều khiển
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
