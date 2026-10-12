import Link from "next/link";
import {
  Gamepad2,
  Zap,
  BrainCircuit,
  ShieldCheck,
  Map,
  ArrowRight,
  Flame,
  Swords,
  Globe,
} from "lucide-react";
import AccountControl from "@/components/AccountControl";
import RedirectSignedInHome from "@/components/RedirectSignedInHome";

function LandingContent() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-300 font-sans selection:bg-emerald-500/30">
      {/* 🚀 NAVIGATION */}
      <nav className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 flex items-center justify-center">
              <Gamepad2 className="w-6 h-6 text-zinc-950" />
            </div>
            <span className="text-xl font-black tracking-widest text-white uppercase">
              Lingo<span className="text-emerald-500 font-normal">Hub</span>
            </span>
          </div>
          <div className="hidden md:flex gap-8 text-xs font-mono tracking-widest uppercase text-zinc-500">
            <Link
              href="#benefits"
              className="hover:text-emerald-400 transition-colors"
            >
              Lợi Ích
            </Link>
            <Link
              href="#roadmap"
              className="hover:text-emerald-400 transition-colors"
            >
              Hệ Sinh Thái
            </Link>
            <Link
              href="/daily-learn/learn"
              className="text-emerald-400 hover:text-emerald-300 font-bold transition-colors"
            >
              Học Hàng Ngày
            </Link>
            <Link
              href="/game"
              className="text-white hover:text-emerald-400 transition-colors"
            >
              Vào Game
            </Link>
          </div>
          <AccountControl />
        </div>
      </nav>
      {/* 🎯 HERO SECTION */}
      <section className="relative border-b border-zinc-800 overflow-hidden">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-32 flex flex-col items-start">
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-mono uppercase tracking-wider mb-8">
            <Flame className="w-4 h-4" /> Hệ sinh thái Daily English &
            Gamification
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[1.05] tracking-tighter mb-8 max-w-5xl">
            CHINH PHỤC TIẾNG ANH <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-cyan-500">
              BẮT ĐẦU TỪ CẤP ĐỘ 1.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mb-12 leading-relaxed">
            Quên đi những giờ học nhồi nhét khô khan. Khám phá tổ hợp giải trí -
            học tập, nơi thói quen mỗi ngày (Daily) và niềm vui vượt ải (Gaming)
            hợp nhất để biến Tiếng Anh thành phản xạ tự nhiên.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link
              href="/daily-learn/learn"
              className="px-8 py-5 bg-emerald-500 text-zinc-950 font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 hover:bg-emerald-400 transition-all"
            >
              Bắt Đầu Học Hôm Nay <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/game"
              className="px-8 py-5 bg-transparent border-2 border-zinc-700 text-white font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-3 hover:border-zinc-500 transition-all"
            >
              <Gamepad2 className="w-5 h-5 text-emerald-400" />
              Chọn Game
            </Link>
          </div>
        </div>
      </section>

      {/* ⚡ LỐI VÀO CHÍNH */}
      <section className="border-b border-zinc-800 bg-zinc-900/40">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="mb-7 flex items-end justify-between gap-6">
            <div>
              <p className="text-xs font-mono font-bold uppercase tracking-[0.22em] text-emerald-400 mb-2">
                Chọn hành trình
              </p>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Bạn muốn bắt đầu thế nào?
              </h2>
            </div>
            <span className="hidden sm:block text-sm text-zinc-500">10–15 phút mỗi ngày</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 border border-zinc-800 divide-y md:divide-y-0 md:divide-x divide-zinc-800">
            <Link
              href="/daily-learn/learn"
              className="group p-6 sm:p-8 bg-zinc-950/30 hover:bg-emerald-500 transition-colors"
            >
              <div className="flex items-start justify-between gap-5">
                <div className="w-11 h-11 shrink-0 border border-emerald-500/40 bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:bg-zinc-950 group-hover:text-emerald-400 group-hover:border-zinc-950 transition-colors">
                  <Zap className="w-5 h-5" />
                </div>
                <ArrowRight className="w-5 h-5 text-emerald-400 group-hover:text-zinc-950 group-hover:translate-x-1 transition-all" />
              </div>
              <p className="mt-8 text-xs font-mono font-bold uppercase tracking-widest text-emerald-400 group-hover:text-zinc-950 transition-colors">Daily learn</p>
              <h3 className="mt-2 text-2xl font-black text-white group-hover:text-zinc-950 transition-colors">Học hôm nay</h3>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-zinc-400 group-hover:text-zinc-800 transition-colors">
                Học 10 từ vựng, xem ngữ cảnh và kiểm tra phản xạ trong một luồng ngắn gọn.
              </p>
            </Link>

            <Link
              href="/game"
              className="group p-6 sm:p-8 bg-zinc-950/30 hover:bg-cyan-500 transition-colors"
            >
              <div className="flex items-start justify-between gap-5">
                <div className="w-11 h-11 shrink-0 border border-cyan-500/40 bg-cyan-500/10 flex items-center justify-center text-cyan-400 group-hover:bg-zinc-950 group-hover:text-cyan-400 group-hover:border-zinc-950 transition-colors">
                  <Gamepad2 className="w-5 h-5" />
                </div>
                <ArrowRight className="w-5 h-5 text-cyan-400 group-hover:text-zinc-950 group-hover:translate-x-1 transition-all" />
              </div>
              <p className="mt-8 text-xs font-mono font-bold uppercase tracking-widest text-cyan-400 group-hover:text-zinc-950 transition-colors">Game library</p>
              <h3 className="mt-2 text-2xl font-black text-white group-hover:text-zinc-950 transition-colors">Chọn game để chơi</h3>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-zinc-400 group-hover:text-zinc-800 transition-colors">
                Vào thư viện game, chọn thử thách phù hợp và luyện tiếng Anh qua từng lượt chơi.
              </p>
            </Link>
          </div>
        </div>
      </section>
      {/* 🧩 BENEFITS SECTION */}
      <section
        id="benefits"
        className="max-w-7xl mx-auto border-b border-zinc-800"
      >
        <div className="px-6 py-16 border-b border-zinc-800">
          <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight">
            Tại sao lại là Daily + Game?
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-zinc-800">
          {/* Benefits */}
          <div className="p-8 md:p-12 hover:bg-zinc-900/50 transition-colors group">
            <Zap className="w-10 h-10 text-emerald-500 mb-6 group-hover:scale-110 transition-transform" />
            <h3 className="text-2xl font-bold text-white mb-4">
              &quot;Nghiện&quot; Học Nhờ Dopamine
            </h3>
            <p className="text-zinc-400 leading-relaxed">
              Không còn cảm giác ép buộc. Cơ chế vượt ải, tích điểm và thăng
              hạng liên tục kích thích não bộ tiết ra dopamine, biến việc học
              thành một niềm vui giải trí mà bạn muốn quay lại mỗi ngày.
            </p>
          </div>
          {/* Benefits 2 */}
          <div className="p-8 md:p-12 hover:bg-zinc-900/50 transition-colors group">
            <Gamepad2 className="w-10 h-10 text-cyan-500 mb-6 group-hover:scale-110 transition-transform" />
            <h3 className="text-2xl font-bold text-white mb-4">
              Mưa Dầm Thấm Lâu
            </h3>
            <p className="text-zinc-400 leading-relaxed">
              Không cần ngồi lỳ hàng giờ. Chỉ với 10-15 phút mỗi ngày thông qua
              các chuỗi thử thách (Daily streaks), bạn duy trì được sự liên tục
              — yếu tố quan trọng nhất để làm chủ ngoại ngữ.
            </p>
          </div>
          {/* Benefits 3 */}
          <div className="p-8 md:p-12 border-t border-zinc-800 hover:bg-zinc-900/50 transition-colors group">
            <BrainCircuit className="w-10 h-10 text-purple-500 mb-6 group-hover:scale-110 transition-transform" />
            <h3 className="text-2xl font-bold text-white mb-4">
              Phản Xạ Nhanh Như Chớp
            </h3>
            <p className="text-zinc-400 leading-relaxed">
              Trong game, bạn không có thời gian để dịch từ Tiếng Việt sang
              Tiếng Anh. Các thử thách ép thời gian sẽ rèn luyện cho não bộ khả
              năng phản xạ và tư duy trực tiếp bằng Tiếng Anh.
            </p>
          </div>
          {/* Benefits */}
          <div className="p-8 md:p-12 border-t border-zinc-800 hover:bg-zinc-900/50 transition-colors group">
            <ShieldCheck className="w-10 h-10 text-orange-500 mb-6 group-hover:scale-110 transition-transform" />
            <h3 className="text-2xl font-bold text-white mb-4">
              Môi Trường An Toàn Để Sai
            </h3>
            <p className="text-zinc-400 leading-relaxed">
              &quot;Game Over&quot; chỉ là cơ hội để chơi lại. Bạn được phép
              sai, được phép thử lại vô số lần trong một môi trường an toàn,
              không phán xét. Tự tin giao tiếp bắt nguồn từ đây.
            </p>
          </div>
        </div>
      </section>
      {/* 🗺️ ECOSYSTEM VISION SECTION (Roadmap) */}
      <section
        id="roadmap"
        className="max-w-7xl mx-auto px-6 py-20 lg:py-32 border-b border-zinc-800"
      >
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs font-mono uppercase tracking-wider mb-6">
            <Map className="w-4 h-4" /> Bản Đồ Mở Rộng
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-6">
            Không Chỉ Là Một Trò Chơi. <br /> Đây Là &quot;Căn Cứ&quot; Của Bạn.
          </h2>
          <p className="text-lg text-zinc-400">
            Chúng tôi đang xây dựng một vũ trụ học tập không giới hạn. Bạn càng
            học, thế giới này càng mở rộng.
          </p>
        </div>
        {/* Timeline Grid/Brutalism */}
        <div className="relative border-l-2 border-zinc-800 ml-4 md:ml-0 md:pl-10 space-y-12">
          <div className="relative">
            <div className="absolute -left-8.75 md:-left-11.25 bg-emerald-500 text-zinc-950 px-2 py-1 text-xs font-black uppercase">
              Now
            </div>
            <h3 className="text-2xl font-bold text-white mb-2 pl-4 md:pl-0">
              Giai Đoạn 1: Arcade Zone
            </h3>
            <p className="text-zinc-500 pl-4 md:pl-0 max-w-2xl">
              Ra mắt các Minigame luyện từ vựng và ngữ pháp tốc độ cao
              (WordBlaster, Grammar Ninja...). Tích hợp Daily Challenge mỗi ngày
              30 từ vựng cốt lõi.
            </p>
          </div>
          <div className="relative opacity-60">
            <div className="absolute -left-8.75 md:-left-11.25 bg-zinc-800 text-zinc-400 px-2 py-1 text-xs font-black uppercase">
              v2.0
            </div>
            <h3 className="text-2xl font-bold text-white mb-2 pl-4 md:pl-0 flex items-center gap-3">
              <Swords className="w-5 h-5 text-cyan-500" /> Đấu Trường PvP
            </h3>
            <p className="text-zinc-500 pl-4 md:pl-0 max-w-2xl">
              Chế độ thách đấu 1vs1. Thi gõ từ vựng, nối câu, trả lời phản xạ
              với những người học khác trên bảng xếp hạng toàn máy chủ.
            </p>
          </div>
          <div className="relative opacity-40">
            <div className="absolute -left-8.75 md:-left-11.25 bg-zinc-800 text-zinc-400 px-2 py-1 text-xs font-black uppercase">
              v3.0
            </div>
            <h3 className="text-2xl font-bold text-white mb-2 pl-4 md:pl-0 flex items-center gap-3">
              <Globe className="w-5 h-5 text-purple-500" /> Nhập Vai Tình Huống
              (RPG)
            </h3>
            <p className="text-zinc-500 pl-4 md:pl-0 max-w-2xl">
              Áp dụng kiến thức vào thực tế ảo. Trả lời phỏng vấn xin việc, đàm
              phán hợp đồng, hoặc gọi món tại nhà hàng qua giọng nói với AI NPC.
            </p>
          </div>
        </div>
      </section>
      {/* 🚀 FINAL CTA */}
      <section className="bg-emerald-500 text-zinc-950">
        <div className="max-w-7xl mx-auto px-6 py-20 lg:py-32 flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight mb-6">
              Sẵn sàng phá đảo <br /> rào cản ngôn ngữ?
            </h2>
            <p className="text-xl font-medium text-emerald-950">
              &quot;Bạn không thất bại trong việc học Tiếng Anh, bạn chỉ chưa
              tìm đúng cách tiếp cận.&quot;
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <Link
              href="/daily-learn/learn"
              className="px-8 py-5 bg-zinc-950 text-white font-black uppercase tracking-widest text-base flex items-center justify-center gap-3 hover:bg-zinc-800 transition-all shrink-0"
            >
              <Zap className="w-5 h-5 text-emerald-400" />
              Bắt Đầu Học Ngay
            </Link>
            <Link
              href="/game"
              className="px-8 py-5 bg-emerald-600 text-zinc-950 font-black uppercase tracking-widest text-base flex items-center justify-center gap-3 hover:bg-emerald-400 transition-all border-2 border-zinc-950 shrink-0"
            >
              <Gamepad2 className="w-5 h-5 text-zinc-950" />
              Chọn Game
            </Link>
          </div>
        </div>
      </section>
      {/* FOOTER */}
      <footer className="bg-zinc-950 border-t border-zinc-900 py-8 px-6 text-center text-zinc-600 text-sm font-mono uppercase tracking-widest">
        © {new Date().getFullYear()} LingoHub. Hệ sinh thái Game & Tiếng Anh.
      </footer>
    </main>
  );
}

export default function LingoHubLanding() {
  return <RedirectSignedInHome><LandingContent /></RedirectSignedInHome>;
}
