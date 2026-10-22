import Link from "next/link";
import { ArrowRight, BookOpen, BrainCircuit, Flame, Gamepad2, ShieldCheck, Zap } from "lucide-react";

export default function FeatureModesSection() {
  return (
    <section id="features" className="border-b border-zinc-800 bg-zinc-950 py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-5 sm:px-6">
        {/* Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <p className="text-xs font-mono font-bold uppercase tracking-[0.22em] text-emerald-400 mb-3">
            Hai trải nghiệm trọng tâm
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            Vừa học bài bản, vừa chơi phản xạ
          </h2>
          <p className="mt-4 text-sm sm:text-base text-zinc-400 leading-relaxed">
            LingoHub kết hợp hai chế độ bổ trợ lẫn nhau: Nạp kiến thức sâu qua bài học hằng ngày
            và kích hoạt tốc độ nhận diện từ ngữ qua trò chơi Arcade.
          </p>
        </div>

        {/* 2 Big Feature Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* 1. DAILY LEARN PILLAR */}
          <div className="border border-emerald-500/30 bg-linear-to-b from-emerald-500/5 to-zinc-950 p-6 sm:p-8 flex flex-col justify-between hover:border-emerald-500/60 transition-colors">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-zinc-800/80">
                <div className="w-11 h-11 flex items-center justify-center bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  <BookOpen className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 border border-emerald-500/20">
                  10–15 phút / ngày
                </span>
              </div>

              <h3 className="mt-6 text-2xl font-bold text-white">
                Học Hằng Ngày (Daily Micro-Learning)
              </h3>
              <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
                Mỗi ngày hệ thống tự động chọn ra 10 từ vựng tối ưu (kết hợp từ mới và từ đến hạn ôn theo chu kỳ SRS).
                Bạn được học theo luồng 4 bước giúp khắc sâu bản chất của từ thay vì học vẹt.
              </p>

              {/* Highlights */}
              <div className="mt-6 space-y-2.5 text-xs text-zinc-300 font-mono">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Chuẩn phát âm IPA, phân loại từ & nghĩa cốt lõi</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Cụm từ đi kèm (Collocations) phổ biến của người bản xứ</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Bài tập trắc nghiệm điền khuyết ngữ cảnh thực tế</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Cơ chế bắt buộc ôn lại câu trả lời sai trước khi kết thúc</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-zinc-800/80">
              <Link
                href="/daily-learn/learn"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs uppercase tracking-wider transition-colors"
              >
                <Zap className="w-4 h-4 fill-current" />
                Bắt đầu bài học hôm nay
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* 2. GAME HUB PILLAR */}
          <div className="border border-cyan-500/30 bg-linear-to-b from-cyan-500/5 to-zinc-950 p-6 sm:p-8 flex flex-col justify-between hover:border-cyan-500/60 transition-colors">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-zinc-800/80">
                <div className="w-11 h-11 flex items-center justify-center bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                  <Gamepad2 className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-3 py-1 border border-cyan-500/20">
                  Game Library
                </span>
              </div>

              <h3 className="mt-6 text-2xl font-bold text-white">
                Khu Trò Chơi (Game Library)
              </h3>
              <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
                Biến việc học từ vựng thành những thử thách hồi hộp. Chọn tựa game yêu thích để kích hoạt phản xạ tự nhiên: từ bắn chữ tốc độ đến phiêu lưu sinh tồn đảo hoang.
              </p>

              {/* Highlights */}
              <div className="mt-6 space-y-2.5 text-xs text-zinc-300 font-mono">
                <div className="flex items-center gap-2">
                  <span className="text-cyan-400 font-bold">✓</span>
                  <span>Word Blaster: Bắn nổ từ rơi bằng tốc độ gõ phím & combo</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-cyan-400 font-bold">✓</span>
                  <span>Word Island: RPG 2D pixel sinh tồn, chặt cây đập đá giải đố</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-cyan-400 font-bold">✓</span>
                  <span>Âm thanh sống động, đồ họa hoài niệm và tính điểm thời gian thực</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-cyan-400 font-bold">✓</span>
                  <span>Đồng bộ tiến độ và điểm số trực tiếp vào tài khoản học viên</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-zinc-800/80">
              <Link
                href="/game"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold text-xs uppercase tracking-wider transition-colors"
              >
                <Gamepad2 className="w-4 h-4" />
                Khám phá Game Library
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* 4 User Benefits Grid */}
        <div className="mt-16 sm:mt-20 pt-12 border-t border-zinc-800">
          <div className="max-w-2xl mb-8">
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Tại sao phương pháp Daily + Game lại hiệu quả?
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="border border-zinc-800 bg-zinc-900/40 p-5">
              <div className="w-8 h-8 flex items-center justify-center bg-emerald-500/10 text-emerald-400 mb-3 border border-emerald-500/20">
                <Zap className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-white mb-2">Hứng thú nhờ Dopamine</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Cơ chế vượt ải, tính combo và mở khóa từ mới kích thích sự hào hứng, biến việc học thành niềm vui mỗi ngày.
              </p>
            </div>

            <div className="border border-zinc-800 bg-zinc-900/40 p-5">
              <div className="w-8 h-8 flex items-center justify-center bg-cyan-500/10 text-cyan-400 mb-3 border border-cyan-500/20">
                <Flame className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-white mb-2">Mưa dầm thấm lâu</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Chỉ 10–15 phút mỗi ngày thông qua chuỗi Daily Streak giúp não bộ duy trì liên tục mà không bị quá tải hay kiệt sức.
              </p>
            </div>

            <div className="border border-zinc-800 bg-zinc-900/40 p-5">
              <div className="w-8 h-8 flex items-center justify-center bg-purple-500/10 text-purple-400 mb-3 border border-purple-500/20">
                <BrainCircuit className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-white mb-2">Phản xạ tức thì</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Thời gian đếm ngược trong game buộc não bộ bỏ qua bước dịch thầm, tư duy trực tiếp bằng tiếng Anh.
              </p>
            </div>

            <div className="border border-zinc-800 bg-zinc-900/40 p-5">
              <div className="w-8 h-8 flex items-center justify-center bg-orange-500/10 text-orange-400 mb-3 border border-orange-500/20">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-white mb-2">Môi trường an toàn</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Sai chỉ là cơ hội để chơi lại. Bạn được phép thử lại không giới hạn trong môi trường tự do, không phán xét.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

