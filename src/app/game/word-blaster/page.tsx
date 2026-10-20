import MobileWarning from "@/components/shared/MobileWarning";
import { GameProvider } from "@/hooks/useGameEngine";
import WordBlaster from "@/pages/WordBlaster";
import { headers } from "next/headers";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Word Blaster - Luyện gõ từ vựng tiếng Anh",
  description:
    "Game bắn từ vựng phản xạ nhanh. Tiêu diệt những từ đang rơi bằng tốc độ gõ và xây combo phản xạ tiếng Anh!",
};

export default async function WordBlasterPage() {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";
  const isMobile =
    /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Opera M(obi|ini)/i.test(
      userAgent,
    );

  const warningProps = {
    gameTitle: "Word Blaster",
    gameIcon: "⌨️",
    accentColor: "rose" as const,
    description:
      "Word Blaster yêu cầu phản xạ nhanh và bàn phím cứng để luyện gõ 10 ngón. Vui lòng mở trang web trên PC/Laptop để chơi.",
  };

  if (isMobile) {
    return <MobileWarning {...warningProps} />;
  }

  return (
    <>
      {/* Mobile warning fallback if browser window is resized on desktop */}
      <div className="flex md:hidden">
        <MobileWarning {...warningProps} />
      </div>
      <div className="hidden md:block w-full h-full">
        <GameProvider>
          <WordBlaster />
        </GameProvider>
      </div>
    </>
  );
}
