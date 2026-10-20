import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

function safeDestination(request: NextRequest, destination: string | null, fallback: string) {
  if (!destination?.startsWith("/") || destination.startsWith("//")) return fallback;
  const target = new URL(destination, request.url);
  return target.origin === request.nextUrl.origin ? target.pathname + target.search : fallback;
}

function redirectWithCookies(source: NextResponse, destination: URL) {
  const response = NextResponse.redirect(destination);
  for (const cookie of source.cookies.getAll()) response.cookies.set(cookie);
  return response;
}

export async function proxy(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const { pathname } = request.nextUrl;

  // Supabase may fall back to its configured Site URL when a redirect URL is not allowlisted.
  // Handle the returned PKCE code on the server before rendering the homepage or initializing
  // the browser auth client, so the code is exchanged exactly once by the callback route.
  if (pathname === "/" && request.nextUrl.searchParams.has("code")) {
    const callbackUrl = request.nextUrl.clone();
    callbackUrl.pathname = "/auth/callback";
    return NextResponse.redirect(callbackUrl);
  }

  const isPrivateRoute =
    pathname === "/dashboard" ||
    pathname.startsWith("/daily-learn/") ||
    ["/DailyLearnPage", "/ExercisePage"].includes(pathname);

  if (!url || !key) {
    if (!isPrivateRoute) return NextResponse.next();
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/auth";
    loginUrl.searchParams.set("next", pathname + request.nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }

  let response = NextResponse.next({ request });
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) request.cookies.set(name, value);
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  const { data: { user }, error } = await supabase.auth.getUser();
  const isAuthenticated = !error && user !== null;

  if (isPrivateRoute && !isAuthenticated) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/auth";
    loginUrl.searchParams.set("next", pathname + request.nextUrl.search);
    return redirectWithCookies(response, loginUrl);
  }

  if (isAuthenticated && (pathname === "/" || pathname === "/auth")) {
    const destination = pathname === "/auth"
      ? safeDestination(request, request.nextUrl.searchParams.get("next"), "/dashboard")
      : "/dashboard";
    return redirectWithCookies(response, new URL(destination, request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/",
    "/auth",
    "/dashboard/:path*",
    "/daily-learn/:path*",
    "/DailyLearnPage/:path*",
    "/ExercisePage/:path*",
  ],
};
