import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

export class ApiClient {
  private supabaseClient: SupabaseClient | null = null;

  get client(): SupabaseClient | null {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) return null;

    if (!this.supabaseClient) {
      this.supabaseClient = createBrowserClient(url, key);
    }
    return this.supabaseClient;
  }

  requireClient(): SupabaseClient {
    const client = this.client;
    if (!client) throw new Error("Thiếu cấu hình Supabase. Hãy kiểm tra .env.local.");
    return client;
  }

  throwIfError(error: { message: string } | null, context: string): void {
    if (error) throw new Error(`${context}: ${error.message}`);
  }
}

export const apiClient = new ApiClient();