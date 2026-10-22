import type { AuthChangeEvent, Session } from "@supabase/supabase-js";
import { apiClient } from "@/services/apiClient";

export class AuthService {
  get isConfigured() {
    return apiClient.client !== null;
  }

  getSession() {
    return apiClient.requireClient().auth.getSession();
  }

  onAuthStateChange(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    const { data: { subscription } } = apiClient.requireClient().auth.onAuthStateChange(
      (event, session) => callback(event, session),
    );
    return subscription;
  }

  signInWithPassword(email: string, password: string) {
    return apiClient.requireClient().auth.signInWithPassword({ email, password });
  }

  signUp(email: string, password: string, emailRedirectTo: string) {
    return apiClient.requireClient().auth.signUp({
      email,
      password,
      options: { emailRedirectTo },
    });
  }

  signInWithOAuth(provider: "google" | "github", redirectTo: string) {
    return apiClient.requireClient().auth.signInWithOAuth({
      provider,
      options: {
        redirectTo,
      },
    });
  }

  signOut() {
    return apiClient.requireClient().auth.signOut();
  }

  async deleteAccount() {
    try {
      const response = await fetch("/api/auth/delete-account", {
        method: "POST",
        headers: { "Content-Type": "application/json"},
      });

      if (response.ok) {
        return;
      }

      const errorPayload = await response.json().catch(() => null);
      if (errorPayload?.error) throw new Error(errorPayload.error);
    } catch (error) {
      // 2. Fallback to direct client RPC execution if server endpoint is unreachable
      console.warn("API delete-account route failed, attempting direct RPC fallback:", error);
      const client = apiClient.requireClient();
      const { error: rpcError } = await client.rpc("delete_user_account");

      if (rpcError) {
        throw new Error(rpcError.message || "Không thể xóa tài khoản vào lúc này.");
      }

      await client.auth.signOut();
    }
  }
}

export const authService = new AuthService();