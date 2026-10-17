import { ArrowRight, BrainCircuit, RotateCcw } from "lucide-react";
import Link from "next/link";

const intervals = [
  { day: "1 ngày", label: "Lần 1", desc: "Định hình ấn tượng ban đầu" },
  { day: "3 ngày", label: "Lần 2", desc: "Kích hoạt nhận diện phản xạ" },
  { day: "7 ngày", label: "Lần 3", desc: "Chuyển giao trí nhớ trung hạn" },
  { day: "14 ngày", label: "Lần 4", desc: "Khắc sâu vào trí nhớ dài hạn" },
  { day: "30 ngày", label: "Mastered", desc: "Thành thạo vĩnh viễn" },
];

export default function SpacedRepetitionExplainer() {
  return (
    <section className="border-b border-zinc-800 bg-zinc-950 py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-5 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Text & Principles */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono uppercase tracking-wider">
              <BrainCircuit className="w-3.5 h-3.5" /> Khoa học ghi nhớ
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
              Chống lại &quot;Đường cong lãng quên&quot; với Spaced Repetition (SRS)
            </h2>

            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
              Theo nghiên cứu tâm lý học của Hermann Ebbinghaus, con người quên tới 70% lượng kiến thức mới nạp chỉ sau 24 giờ nếu không được ôn tập đúng lúc.
            </p>

            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
              LingoHub tự động tính toán thời điểm vàng bạn sắp quên một từ để đưa vào bài học hằng ngày. Khi bạn trả lời đúng, chu kỳ ôn sẽ giãn ra. Nếu trả lời sai, từ vựng sẽ lập tức được đưa về chu kỳ 1 ngày để bạn củng cố lại.
            </p>

            <div className="p-4 border border-zinc-800 bg-zinc-900/40 space-y-3">
              <div className="flex items-center gap-2.5 text-rose-400 text-xs font-mono font-bold uppercase">
                <RotateCcw className="w-4 h-4" /> Cơ chế &quot;Review Mistakes&quot; độc quyền
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Trong bài tập điền khuyết, mọi câu làm sai đều được hệ thống gom lại và bắt buộc ôn lại thẻ từ vựng (WordCard) trước khi cho phép kết thúc bài học. Không một lỗ hổng nào bị bỏ sót!
              </p>
            </div>

            <Link
              href="/daily-learn/learn"
              className="inline-flex items-center gap-2 text-sm font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Thử nghiệm hệ thống ôn tập ngay <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Right Column: Visual SRS Intervals Roadmap */}
          <div className="lg:col-span-6">
            <div className="border border-zinc-800 bg-zinc-900/30 p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">
                  Lộ trình chu kỳ ôn tập (SRS Interval)
                </span>
                <span className="text-xs text-emerald-400 font-mono font-bold">5 Cấp độ</span>
              </div>

              {/* 5 Interval Steps */}
              <div className="space-y-3">
                {intervals.map((item, idx) => (
                  <div
                    key={item.day}
                    className="flex items-center justify-between p-3.5 bg-zinc-950 border border-zinc-800/80 hover:border-zinc-700 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 flex items-center justify-center bg-zinc-900 text-zinc-400 font-mono text-xs font-bold border border-zinc-800">
                        {idx + 1}
                      </span>
                      <div>
                        <span className="text-sm font-bold text-white block">
                          Chu kỳ {item.day}
                        </span>
                        <span className="text-[11px] text-zinc-500 block">
                          {item.desc}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`text-xs font-mono font-bold uppercase px-2.5 py-1 border ${
                        idx === intervals.length - 1
                          ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-300"
                          : "bg-zinc-900 border-zinc-800 text-zinc-400"
                      }`}
                    >
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-zinc-950/60 border border-zinc-800/60 text-xs text-zinc-500 font-mono">
                💡 Trả lời đúng: Lên chu kỳ kế tiếp · Trả lời sai: Reset về chu kỳ 1 ngày.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
