import { BookOpen, CheckCircle2, MessageSquareQuote, Sparkles } from "lucide-react";

const flowSteps = [
  {
    step: "01",
    label: "WordCard",
    title: "Từ vựng cốt lõi",
    icon: BookOpen,
    color: "emerald",
    borderClass: "border-emerald-500/30",
    bgClass: "bg-emerald-500/10",
    textClass: "text-emerald-400",
    description:
      "Làm quen với từ vựng, phiên âm chuẩn quốc tế (IPA), loại từ (noun, verb, adj) và định nghĩa ngắn gọn, chính xác.",
    preview: {
      badge: "VOCABULARY",
      main: "collaborate",
      phonetic: "/kəˈlæb.ə.reɪt/",
      pos: "verb",
      def: "Hợp tác, cùng làm việc với người khác để đạt mục tiêu chung.",
    },
  },
  {
    step: "02",
    label: "PhraseList",
    title: "Cụm từ tự nhiên",
    icon: Sparkles,
    color: "cyan",
    borderClass: "border-cyan-500/30",
    bgClass: "bg-cyan-500/10",
    textClass: "text-cyan-400",
    description:
      "Học các Collocations (cụm từ đi liền nhau) giúp câu nói chuẩn tự nhiên như người bản ngữ, tránh lỗi ghép từ gượng gạo.",
    preview: {
      badge: "COLLOCATIONS",
      main: "collaborate with",
      phonetic: "cụm phổ biến",
      pos: "phrase",
      def: "collaborate with colleagues / collaborate on a project",
    },
  },
  {
    step: "03",
    label: "ExampleSentence",
    title: "Ngữ cảnh thực tế",
    icon: MessageSquareQuote,
    color: "amber",
    borderClass: "border-amber-500/30",
    bgClass: "bg-amber-500/10",
    textClass: "text-amber-300",
    description:
      "Đặt từ vào câu hoàn chỉnh trong đời sống và công việc. Hệ thống highlight từ vựng để não bộ liên kết ngữ cảnh.",
    preview: {
      badge: "CONTEXT EXAMPLE",
      main: "We collaborate closely with our global partners.",
      phonetic: "dịch nghĩa",
      pos: "sentence",
      def: "Chúng tôi hợp tác chặt chẽ với các đối tác toàn cầu.",
    },
  },
  {
    step: "04",
    label: "Contextual Quiz",
    title: "Thực hành điền khuyết",
    icon: CheckCircle2,
    color: "purple",
    borderClass: "border-purple-500/30",
    bgClass: "bg-purple-500/10",
    textClass: "text-purple-400",
    description:
      "Trắc nghiệm điền khuyết vào ngữ cảnh có phản hồi màu tức thì. Nếu làm sai, hệ thống tự động bắt ôn lại trước khi kết thúc.",
    preview: {
      badge: "EXERCISE",
      main: "Our team must ____ to solve the problem.",
      phonetic: "chọn đáp án đúng",
      pos: "quiz",
      def: "A. collaborate ✓   B. collect   C. combine",
    },
  },
];

export default function LearningFlowSection() {
  return (
    <section className="border-b border-zinc-800 bg-zinc-950 py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-5 sm:px-6">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <p className="text-xs font-mono font-bold uppercase tracking-[0.22em] text-emerald-400 mb-3">
            Triết lý Micro-Learning cốt lõi
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            Luồng học tự nhiên 4 bước: <br />
            <span className="text-zinc-400">Từ vựng ➔ Cụm từ ➔ Câu ➔ Ngữ cảnh</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-zinc-400 leading-relaxed">
            Học một từ không chỉ là học nghĩa tiếng Việt. LingoHub chia nhỏ sự chú ý (Micro-learning)
            để bạn thấu hiểu cách một từ vận hành từ dạng nguyên mẫu tới câu giao tiếp thực tế.
          </p>
        </div>

        {/* 4 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {flowSteps.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative border border-zinc-800 bg-zinc-900/40 p-5 sm:p-6 flex flex-col justify-between hover:border-zinc-700 transition-colors group"
              >
                <div>
                  {/* Step & Icon */}
                  <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80">
                    <span className="font-mono text-xs font-bold text-zinc-500">
                      STEP {item.step}
                    </span>
                    <div
                      className={`w-8 h-8 flex items-center justify-center border ${item.borderClass} ${item.bgClass} ${item.textClass}`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="mt-4 text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                    {item.title}
                  </h3>
                  <span className={`text-[11px] font-mono font-bold uppercase tracking-wider ${item.textClass} block mt-0.5`}>
                    {item.label}
                  </span>
                  <p className="mt-3 text-xs text-zinc-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Simulated UI Snippet */}
                <div className="mt-6 p-3 bg-zinc-950/80 border border-zinc-800/80 font-mono text-xs space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] text-zinc-500">
                    <span>{item.preview.badge}</span>
                    <span>{item.preview.pos}</span>
                  </div>
                  <p className="text-white font-bold truncate text-[11px]">
                    {item.preview.main}
                  </p>
                  <p className="text-[10px] text-zinc-400 truncate">
                    {item.preview.def}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
