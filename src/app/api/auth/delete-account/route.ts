import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function POST(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return NextResponse.json(
      { error: "Cấu hình Supabase chưa hoàn chỉnh." },
      { status: 500 }
    );
  }

  const response = NextResponse.json({
    success: true,
    message: "Tài khoản và dữ liệu đã được xóa vĩnh viễn.",
  });

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value);
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  // Verify that the user is currently authenticated
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json(
      { error: "Bạn chưa đăng nhập hoặc phiên làm việc đã hết hạn." },
      { status: 401 }
    );
  }

  // Call the database function to delete all user records and auth user
  const { error: rpcError } = await supabase.rpc("delete_user_account");

  if (rpcError) {
    console.error("API delete-account error:", rpcError);
    return NextResponse.json(
      { error: rpcError.message || "Không thể xóa tài khoản vào lúc này." },
      { status: 500 }
    );
  }

  // Sign out locally
  await supabase.auth.signOut();

  // Expire and delete all auth-related cookies
  request.cookies.getAll().forEach((cookie) => {
    if (
      cookie.name.startsWith("sb-") ||
      cookie.name.includes("auth-token") ||
      cookie.name.includes("access-token") ||
      cookie.name === "lingohub_auth_next"
    ) {
      response.cookies.delete(cookie.name);
    }
  });

  return response;
}

