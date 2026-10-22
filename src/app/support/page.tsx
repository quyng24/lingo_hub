"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  History,
  LifeBuoy,
  MessageSquarePlus,
  Send,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/components/AuthProvider";
import AccountControl from "@/components/AccountControl";
import {
  CATEGORY_LABELS,
  STATUS_LABELS,
  supportService,
  type SupportTicket,
  type TicketCategory,
} from "@/services/supportService";
import { Skeleton } from "@/components/common/Skeleton";

export default function SupportPage() {
  const router = useRouter();
  const { user, isProgressReady } = useAuth();

  // Active view tab: 'form' | 'history'
  const [activeTab, setActiveTab] = useState<"form" | "history">("form");

  // Form states
  const [category, setCategory] = useState<TicketCategory>("BUG");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // History tickets state
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [isLoadingTickets, setIsLoadingTickets] = useState(true);

  // Client-side auth guard (Defense-in-depth)
  useEffect(() => {
    if (isProgressReady && !user) {
      router.replace("/auth?next=/support");
    }
  }, [isProgressReady, user, router]);

  // Load tickets history
  useEffect(() => {
    if (!user) return;

    let isActive = true;

    supportService
      .getUserTickets()
      .then((data) => {
        if (isActive) {
          setTickets(data);
          setIsLoadingTickets(false);
        }
      })
      .catch((err) => {
        if (isActive) {
          console.error("Failed to load user support tickets:", err);
          setIsLoadingTickets(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [user]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Vui lòng nhập tiêu đề tóm tắt sự cố.");
      return;
    }

    if (!description.trim()) {
      toast.error("Vui lòng nhập mô tả chi tiết sự cố hoặc góp ý.");
      return;
    }

    setIsSubmitting(true);
    try {
      const newTicket = await supportService.createTicket({
        category,
        title,
        description,
      });

      toast.success("Đã gửi yêu cầu hỗ trợ thành công! Đội ngũ phát triển đã tiếp nhận.");
      setTitle("");
      setDescription("");
      setTickets((prev) => [newTicket, ...prev]);
      setActiveTab("history");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gửi yêu cầu thất bại. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-300 selection:bg-amber-500/30 flex flex-col font-sans">
      {/* 🧭 STICKY NAVIGATION */}
      <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-zinc-950/85 backdrop-blur-md px-4 sm:px-6 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Dashboard</span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold uppercase tracking-wider">
              <LifeBuoy className="w-3.5 h-3.5" />
              <span>Hỗ trợ kỹ thuật</span>
            </div>
            <AccountControl />
          </div>
        </div>
      </header>

      {/* 💬 MAIN CONTENT */}
      <div className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6">
        {/* Header Hero */}
        <div className="border-b border-zinc-800/80 pb-6 space-y-2">
          <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-amber-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Lắng nghe &amp; Hỗ trợ học viên</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Hỗ Trợ &amp; Báo Cáo Lỗi
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-2xl">
            Gặp lỗi kỹ thuật, sai sót từ vựng trong bài học hoặc có ý tưởng cải tiến?
            Mọi phản hồi của bạn sẽ được lưu trực tiếp vào hệ thống để đội ngũ LingoHub xử lý sớm nhất.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 border-b border-zinc-800/80 pb-px">
          <button
            type="button"
            onClick={() => setActiveTab("form")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-mono uppercase tracking-wider transition-colors border-b-2 -mb-px cursor-pointer ${
              activeTab === "form"
                ? "border-amber-400 text-white font-bold bg-zinc-900/40"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <MessageSquarePlus className="w-3.5 h-3.5" />
            <span>Gửi báo cáo mới</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("history")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-mono uppercase tracking-wider transition-colors border-b-2 -mb-px cursor-pointer ${
              activeTab === "history"
                ? "border-amber-400 text-white font-bold bg-zinc-900/40"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Lịch sử yêu cầu ({tickets.length})</span>
          </button>
        </div>

        {/* 📝 TAB 1: FORM GỬI YÊU CẦU */}
        {activeTab === "form" && (
          <form onSubmit={handleSubmit} className="space-y-6 pt-2">
            {/* Phân loại sự cố */}
            <div className="space-y-2.5">
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400">
                1. Chọn loại vấn đề bạn gặp phải:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {(Object.keys(CATEGORY_LABELS) as TicketCategory[]).map((cat) => {
                  const isSelected = category === cat;
                  const item = CATEGORY_LABELS[cat];
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`flex items-center gap-2 p-3 text-left border text-xs transition-colors cursor-pointer ${
                        isSelected
                          ? "border-amber-400 bg-amber-500/10 text-white font-bold"
                          : "border-zinc-800 bg-zinc-900/30 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                      }`}
                    >
                      <span className="text-base">{item.icon}</span>
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tiêu đề tóm tắt */}
            <div className="space-y-2">
              <label
                htmlFor="ticket-title"
                className="block text-xs font-mono uppercase tracking-wider text-zinc-400"
              >
                2. Tiêu đề tóm tắt sự cố:
              </label>
              <input
                id="ticket-title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ví dụ: Lỗi âm thanh phát âm ở từ vựng bài 3, hoặc Đề xuất thêm game nối chữ"
                maxLength={120}
                className="w-full bg-zinc-900/60 border border-zinc-800 px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-amber-400 focus:outline-none transition-colors"
              />
            </div>

            {/* Mô tả chi tiết */}
            <div className="space-y-2">
              <label
                htmlFor="ticket-desc"
                className="block text-xs font-mono uppercase tracking-wider text-zinc-400"
              >
                3. Mô tả chi tiết (Các bước xảy ra lỗi / Nội dung đề xuất):
              </label>
              <textarea
                id="ticket-desc"
                required
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mô tả cụ thể màn hình hoặc trò chơi bạn gặp lỗi, thiết bị bạn đang dùng (Chrome/Edge trên Windows/Mac), hoặc ý tưởng bạn muốn đóng góp cho LingoHub..."
                className="w-full bg-zinc-900/60 border border-zinc-800 p-3.5 text-sm text-white placeholder-zinc-500 focus:border-amber-400 focus:outline-none transition-colors font-sans leading-relaxed"
              />
            </div>

            {/* Email tài khoản xác nhận */}
            <div className="p-3 bg-zinc-900/30 border border-zinc-800 flex items-center justify-between text-xs font-mono">
              <span className="text-zinc-500">Tài khoản gửi báo cáo:</span>
              <span className="text-amber-400 font-bold">{user?.email}</span>
            </div>

            {/* Nút gửi */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-7 py-3 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-wait cursor-pointer"
            >
              {isSubmitting ? (
                "Đang gửi dữ liệu..."
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Gửi báo cáo sự cố</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* 📋 TAB 2: LỊCH SỬ BÁO CÁO CỦA USER */}
        {activeTab === "history" && (
          <div className="space-y-4 pt-2">
            {isLoadingTickets ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="border border-zinc-800 bg-zinc-900/30 p-4 sm:p-5 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Skeleton className="w-20 h-5" />
                        <Skeleton className="w-16 h-5" />
                      </div>
                      <Skeleton className="w-28 h-4" />
                    </div>
                    <Skeleton className="w-48 h-5" />
                    <Skeleton className="w-full h-12" />
                  </div>
                ))}
              </div>
            ) : tickets.length === 0 ? (
              <div className="p-10 border border-zinc-800 bg-zinc-900/20 text-center space-y-3">
                <div className="w-10 h-10 mx-auto rounded-full bg-zinc-800 flex items-center justify-center text-zinc-500">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="text-sm font-bold text-white">Chưa có yêu cầu hỗ trợ nào</h3>
                <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                  Bạn chưa gửi báo cáo sự cố nào. Nếu gặp bất kỳ vấn đề gì, hãy chuyển sang tab &ldquo;Gửi báo cáo mới&rdquo;.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {tickets.map((t) => {
                  const cat = CATEGORY_LABELS[t.category] ?? { label: t.category, icon: "📌" };
                  const st = STATUS_LABELS[t.status] ?? {
                    label: t.status,
                    color: "text-zinc-400 border-zinc-700 bg-zinc-800",
                  };
                  const dateStr = new Intl.DateTimeFormat("vi-VN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  }).format(new Date(t.created_at));

                  return (
                    <article
                      key={t.id}
                      className="border border-zinc-800 bg-zinc-900/30 p-4 sm:p-5 space-y-3 hover:border-zinc-700 transition-colors"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{cat.icon}</span>
                          <span className="text-xs font-mono uppercase text-zinc-400">
                            {cat.label}
                          </span>
                        </div>
                        <span
                          className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider border ${st.color}`}
                        >
                          {st.label}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                          {t.title}
                        </h3>
                        <p className="mt-1.5 text-xs text-zinc-400 leading-relaxed whitespace-pre-line">
                          {t.description}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-zinc-800/60 flex items-center justify-between text-[11px] font-mono text-zinc-500">
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3 h-3" />
                          <span>Gửi lúc: {dateStr}</span>
                        </span>
                        <span className="text-[10px] text-zinc-600">
                          Mã ticket: {t.id.slice(0, 8)}
                        </span>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
