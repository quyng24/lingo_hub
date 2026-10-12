import type { AppProps } from "next/app";
import { AuthProvider } from "@/components/AuthProvider";
import RequireAuth from "@/components/RequireAuth";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <RequireAuth>
        <Component {...pageProps} />
      </RequireAuth>
    </AuthProvider>
  );
}