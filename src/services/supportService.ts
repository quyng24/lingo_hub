import { apiClient } from "@/services/apiClient";

export type TicketCategory = "BUG" | "FEATURE" | "CONTENT" | "ACCOUNT" | "OTHER";
export type TicketStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";

export interface SupportTicket {
  id: string;
  user_id: string;
  email: string;
  category: TicketCategory;
  title: string;
  description: string;
  status: TicketStatus;
  created_at: string;
  updated_at: string;
}

export interface CreateTicketParams {
  category: TicketCategory;
  title: string;
  description: string;
}

export const CATEGORY_LABELS: Record<TicketCategory, { label: string; icon: string }> = {
  BUG: { label: "Báo lỗi kỹ thuật", icon: "🐛" },
  CONTENT: { label: "Sai sót từ vựng / Đề bài", icon: "📚" },
  FEATURE: { label: "Đề xuất tính năng mới", icon: "💡" },
  ACCOUNT: { label: "Vấn đề tài khoản", icon: "🔐" },
  OTHER: { label: "Góp ý khác", icon: "💬" },
};

export const STATUS_LABELS: Record<TicketStatus, { label: string; color: string }> = {
  OPEN: { label: "Đã tiếp nhận", color: "text-amber-400 border-amber-500/30 bg-amber-500/10" },
  IN_PROGRESS: { label: "Đang xử lý", color: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10" },
  RESOLVED: { label: "Đã giải quyết", color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10" },
  CLOSED: { label: "Đã đóng", color: "text-zinc-500 border-zinc-700 bg-zinc-800/40" },
};

export class SupportService {
  async createTicket(params: CreateTicketParams): Promise<SupportTicket> {
    const client = apiClient.requireClient();
    const {
      data: { user },
      error: userError,
    } = await client.auth.getUser();

    if (userError || !user) {
      throw new Error("Bạn cần đăng nhập để gửi yêu cầu hỗ trợ.");
    }

    const { data, error } = await client
      .from("support_tickets")
      .insert({
        user_id: user.id,
        email: user.email ?? "unknown@user.com",
        category: params.category,
        title: params.title.trim(),
        description: params.description.trim(),
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Không thể gửi yêu cầu hỗ trợ: ${error.message}`);
    }

    return data as SupportTicket;
  }

  async getUserTickets(): Promise<SupportTicket[]> {
    const client = apiClient.requireClient();
    const { data, error } = await client
      .from("support_tickets")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Không thể tải lịch sử hỗ trợ: ${error.message}`);
    }

    return (data ?? []) as SupportTicket[];
  }
}

export const supportService = new SupportService();

