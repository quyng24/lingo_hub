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
}

export const authService = new AuthService();