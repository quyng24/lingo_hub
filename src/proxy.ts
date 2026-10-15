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
  const isPrivateRoute =
    pathname === "/dashboard" ||
    pathname.startsWith("/daily-learn/") ||
    pathname === "/game" ||
    pathname.startsWith("/game/") ||
    ["/DailyLearnPage", "/ExercisePage", "/GameOver", "/WordBlaster"].includes(pathname);

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
    "/game/:path*",
    "/DailyLearnPage/:path*",
    "/ExercisePage/:path*",
    "/GameOver/:path*",
    "/WordBlaster/:path*",
  ],
};