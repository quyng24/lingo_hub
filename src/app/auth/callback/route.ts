import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const cookieNext = request.cookies.get("lingohub_auth_next")?.value;
  let next = cookieNext ? decodeURIComponent(cookieNext) : (searchParams.get("next") ?? "/dashboard");

  // Prevent open redirect attacks
  if (!next.startsWith("/") || next.startsWith("//")) {
    next = "/dashboard";
  }

  // Handle explicit OAuth errors from provider
  const errorParam = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");
  if (errorParam) {
    const errorUrl = new URL("/auth", origin);
    errorUrl.searchParams.set("error", "oauth_failed");
    if (errorDescription) {
      errorUrl.searchParams.set("message", errorDescription);
    }
    return NextResponse.redirect(errorUrl);
  }

  if (code) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.redirect(new URL("/auth?error=missing_config", origin));
    }

    // Create the redirect response upfront so cookies can be set on it
    const redirectResponse = NextResponse.redirect(new URL(next, origin));
    redirectResponse.cookies.delete("lingohub_auth_next");

    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            redirectResponse.cookies.set(name, value, options);
          });
        },
      },
    });

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return redirectResponse;
    }

    console.error("Supabase OAuth exchangeCodeForSession error:", error);
    const errorUrl = new URL("/auth", origin);
    errorUrl.searchParams.set("error", "oauth_failed");
    errorUrl.searchParams.set("message", error.message);
    return NextResponse.redirect(errorUrl);
  }

  return NextResponse.redirect(new URL("/auth?error=oauth_failed", origin));
}
