import { Database, Layers, ShieldCheck, Zap } from "lucide-react";

export default function StatsDataSection() {
  return (
    <section className="border-b border-zinc-800 bg-zinc-950 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-5 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-zinc-800/80">
          {/* STAT 1 */}
          <div className="pt-4 sm:pt-0 sm:px-6 first:pl-0">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
              <Database className="w-3.5 h-3.5" /> Thư viện học liệu
            </span>
            <p className="mt-3 text-4xl sm:text-5xl font-black font-mono tabular-nums text-white">
              250<span className="text-emerald-400 font-light">+</span>
            </p>
            <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
              Từ vựng chuẩn khung tham chiếu CEFR từ cấp độ A1 đến B2 kèm ngữ cảnh câu.
            </p>
          </div>

          {/* STAT 2 */}
          <div className="pt-4 sm:pt-0 sm:px-6">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
              <Layers className="w-3.5 h-3.5" /> Chủ đề Arcade
            </span>
            <p className="mt-3 text-4xl sm:text-5xl font-black font-mono tabular-nums text-white">
              07<span className="text-cyan-400 font-light"> chủ đề</span>
            </p>
            <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
              230+ liên kết từ vựng chuyên đề cho đấu trường Word Blaster.
            </p>
          </div>

          {/* STAT 3 */}
          <div className="pt-4 sm:pt-0 sm:px-6">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-300 flex items-center gap-2">
              <Zap className="w-3.5 h-3.5" /> Thuật toán SRS
            </span>
            <p className="mt-3 text-4xl sm:text-5xl font-black font-mono tabular-nums text-white">
              05<span className="text-amber-300 font-light"> chu kỳ</span>
            </p>
            <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
              Ôn tập ngắt quãng sau 1, 3, 7, 14 và 30 ngày để chuyển vào trí nhớ dài hạn.
            </p>
          </div>

          {/* STAT 4 */}
          <div className="pt-4 sm:pt-0 sm:px-6 last:pr-0">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-orange-400 flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5" /> Bảo mật cá nhân
            </span>
            <p className="mt-3 text-4xl sm:text-5xl font-black font-mono tabular-nums text-white">
              100<span className="text-orange-400 font-light">%</span>
            </p>
            <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
              Phân quyền độc lập qua PostgreSQL Row-Level Security (RLS) & Google OAuth.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
