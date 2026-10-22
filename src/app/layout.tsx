import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/components/AuthProvider";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL( process.env.NEXT_PUBLIC_APP_URL || "https://lingo-hub-lime.vercel.app/"),
  title: {
    default: "LingoHub - Học Tiếng Anh Mỗi Ngày & Chơi Game Nhớ Từ Vựng",
    template: "%s | LingoHub",
  },
  description:
    "Nền tảng học tiếng Anh thông minh kết hợp chơi game giải trí. Học từ vựng mỗi ngày, thử thách mini-game tương tác và theo dõi tiến trình cá nhân dễ dàng!",
  keywords: [
    "LingoHub",
    "học tiếng anh",
    "học từ vựng tiếng anh",
    "game học tiếng anh",
    "daily english",
    "vừa học vừa chơi",
    "học tiếng anh giao tiếp",
    "ôn luyện từ vựng",
  ],
  authors: [{ name: "Quicy Nguyen" }],
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: [{ url: "/iamge_og.png", sizes: "180x180" }],
  },
  openGraph: {
    title: "LingoHub - Vừa Học Vừa Chơi Tiếng Anh Mỗi Ngày",
    description:
      "Chinh phục từ vựng tiếng Anh qua các mini-game hấp dẫn. Xây dựng thói quen học tập daily ngay hôm nay!",
    url: "https://lingo-hub-lime.vercel.app/",
    siteName: "LingoHub",
    locale: "vi_VN",
    type: "website",
    images: [
      {
        url: "/image_og.png",
        width: 1200,
        height: 630,
        alt: "LingoHub - Daily Learn & Game Hub",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LingoHub | Daily Learn & Game Hub",
    description:
      "Học từ vựng tiếng Anh mỗi ngày thông qua các trò chơi tương tác thú vị.",
    images: ["/image_og.png"],
  },
  appleWebApp: {
    capable: true,
    title: "LingoHub",
    statusBarStyle: "black-translucent",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="vi"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100 selection:bg-emerald-500/30">
        <AuthProvider>
          {children}
          <Toaster position="top-right" richColors closeButton />
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
