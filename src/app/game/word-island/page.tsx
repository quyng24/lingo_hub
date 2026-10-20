import MobileWarning from '@/components/shared/MobileWarning';
import WordIsland from '@/pages/WordIsland';
import { headers } from 'next/headers';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Word Island - Đảo Từ Vựng 2D Sinh Tồn',
  description:
    'Game phiêu lưu sinh tồn 2D pixel-art. Khám phá hoang đảo, thu thập tài nguyên và giải các câu đố từ vựng tiếng Anh để thoát khỏi đảo!',
};

export default async function WordIslandPage() {
  const headersList = await headers();
  const userAgent = headersList.get('user-agent') || '';
  const isMobile =
    /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Opera M(obi|ini)/i.test(
      userAgent
    );

  const warningProps = {
    gameTitle: 'Word Island 2D',
    gameIcon: '🏝️',
    accentColor: 'amber' as const,
    description:
      'Word Island yêu cầu sử dụng bàn phím vật lý (WASD / Phím mũi tên & [E]) để di chuyển và tương tác sinh tồn. Vui lòng mở trang web trên PC/Laptop để có trải nghiệm tốt nhất.',
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
        <WordIsland />
      </div>
    </>
  );
}
