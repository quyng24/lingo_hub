import type { Session } from "@supabase/supabase-js";
import { apiClient } from "@/services/apiClient";

export class AuthService {
  get isConfigured() {
    return apiClient.client !== null;
  }

  getSession() {
    return apiClient.requireClient().auth.getSession();
  }

  onAuthStateChange(callback: (session: Session | null) => void) {
    const { data: { subscription } } = apiClient.requireClient().auth.onAuthStateChange(
      (_event, session) => callback(session),
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

  signOut() {
    return apiClient.requireClient().auth.signOut();
  }
}

export const authService = new AuthService();