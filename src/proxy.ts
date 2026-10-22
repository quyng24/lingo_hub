import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

function hasSupabaseAuthCookie(request: NextRequest): boolean {
  return request.cookies.getAll().some((cookie) =>
    cookie.name.startsWith("sb-") ||
    cookie.name.includes("auth-token") ||
    cookie.name.includes("access-token")
  );
}

function clearAuthCookies(response: NextResponse, request: NextRequest) {
  for (const cookie of request.cookies.getAll()) {
    if (cookie.name.startsWith("sb-") || cookie.name.includes("auth-token")) {
      response.cookies.delete(cookie.name);
    }
  }
}

export async function proxy(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const { pathname } = request.nextUrl;

  // Supabase may fall back to its configured Site URL when a redirect URL is not allowlisted.
  // Handle the returned PKCE code on the server before rendering the homepage or initializing
  // the browser auth client, so the code is exchanged exactly once by the callback route.
  if ((pathname === "/" || pathname === "/auth") && request.nextUrl.searchParams.has("code")) {
    const callbackUrl = request.nextUrl.clone();
    callbackUrl.pathname = "/auth/callback";
    return NextResponse.redirect(callbackUrl);
  }

  const isPrivateRoute =
    pathname === "/dashboard" ||
    pathname.startsWith("/dashboard/") ||
    pathname === "/daily-learn" ||
    pathname.startsWith("/daily-learn/") ||
    pathname === "/game" ||
    pathname.startsWith("/game/") ||
    pathname === "/support" ||
    pathname.startsWith("/support/") ||
    [
      "/DailyLearnPage",
      "/ExercisePage",
      "/WordBlaster",
      "/WordIsland",
      "/GameOver",
    ].includes(pathname);

  // If this is a public route (e.g. /, /privacy, /game/word-island, /auth):
  // Let the client load instantly without any blocking server auth verification.
  // The client components (AccountControl, AuthPage) handle auth states smoothly in the background.
  if (!isPrivateRoute) {
    return NextResponse.next();
  }

  // If Supabase credentials are missing on private routes, redirect to login
  if (!url || !key) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/auth";
    loginUrl.searchParams.set("next", pathname + request.nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }

  // Fast-path: If user has no auth cookies at all, they cannot be authenticated
  if (!hasSupabaseAuthCookie(request)) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/auth";
    loginUrl.searchParams.set("next", pathname + request.nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }

  // User has auth cookies and is attempting to access a private route:
  // Verify their session with Supabase with a strict 2.5s timeout.
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
    global: {
      fetch: (input, init) => {
        const signal = init?.signal ?? AbortSignal.timeout(2500);
        return fetch(input, { ...init, signal });
      },
    },
  });

  let isAuthenticated = false;
  try {
    const authPromise = supabase.auth.getUser();
    const timeoutPromise = new Promise<{ data: { user: null }; error: Error }>((resolve) => {
      const timer = setTimeout(() => {
        resolve({ data: { user: null }, error: new Error("Auth verification timeout") });
      }, 2500);
      if (typeof timer.unref === "function") timer.unref();
    });

    const { data, error } = await Promise.race([authPromise, timeoutPromise]);
    isAuthenticated = !error && data.user !== null;
  } catch {
    isAuthenticated = false;
  }

  if (!isAuthenticated) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/auth";
    loginUrl.searchParams.set("next", pathname + request.nextUrl.search);
    const redirectRes = NextResponse.redirect(loginUrl);
    // Clear stale cookies so subsequent requests don't keep retrying an invalid session
    clearAuthCookies(redirectRes, request);
    return redirectRes;
  }

  return response;
}

// Next.js 16 deprecated middleware.ts and renamed it to proxy.ts.
// This is the native Next.js Middleware running before request completion.
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - static media files (svg, png, jpg, jpeg, gif, webp)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
