import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Database,
  Gamepad2,
  Lock,
  Mail,
  RefreshCw,
  Shield,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Chính Sách Quyền Riêng Tư (Privacy Policy) | LingoHub",
  description:
    "Chính sách quyền riêng tư của LingoHub - Minh bạch về thu thập dữ liệu Google OAuth, bảo vệ thông tin cá nhân và quyền xóa tài khoản của người dùng theo GDPR và quy định pháp luật.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 antialiased font-sans selection:bg-emerald-500 selection:text-zinc-950">
      {/* 🧭 Top Navigation */}
      <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-zinc-950/85 backdrop-blur-md px-4 sm:px-6 py-3.5">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-zinc-400 hover:text-white transition-colors group text-xs font-mono uppercase tracking-wider"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Trở về Trang chủ</span>
          </Link>

          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-7 h-7 bg-emerald-500 flex items-center justify-center text-zinc-950 font-black">
              <Gamepad2 className="w-4 h-4" />
            </div>
            <span className="text-sm font-black tracking-widest text-white uppercase">
              Lingo<span className="text-emerald-400 font-normal">Hub</span>
            </span>
          </Link>
        </div>
      </header>

      {/* 📜 Privacy Document Body */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-12">
        {/* Header Hero */}
        <div className="space-y-4 border-b border-zinc-800 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Tài liệu pháp lý & Bảo vệ dữ liệu cá nhân</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
            Chính Sách Quyền Riêng Tư
          </h1>

          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-3xl">
            LingoHub cam kết bảo vệ dữ liệu cá nhân và sự riêng tư của người
            dùng. Tài liệu này giải thích rõ ràng các thông tin chúng tôi thu
            thập, mục đích sử dụng, các biện pháp bảo mật với Row Level Security
            (RLS), và quyền xóa toàn bộ dữ liệu của bạn bất cứ lúc nào.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-500 pt-2">
            <span>• Ngày hiệu lực: 22 tháng 10, 2026</span>
            <span>• Phiên bản: 1.2 (Tuân thủ Google OAuth & GDPR)</span>
          </div>
        </div>

        {/* Section 1: Giới thiệu */}
        <section className="space-y-3">
          <div className="flex items-center gap-2.5 text-emerald-400">
            <Shield className="w-5 h-5" />
            <h2 className="text-xl font-bold tracking-tight text-white uppercase font-mono">
              1. Giới thiệu & Cam kết
            </h2>
          </div>
          <p className="text-sm text-zinc-300 leading-relaxed">
            LingoHub là ứng dụng web học từ vựng tiếng Anh tương tác thông qua
            phương pháp lặp lại ngắt quãng (Spaced Repetition System - SRS) và
            trò chơi hóa (gamification). Chúng tôi tôn trọng quyền riêng tư của
            bạn và chỉ thu thập những thông tin thực sự cần thiết để vận hành và
            cá nhân hóa trải nghiệm học tập của bạn.
          </p>
          <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-none text-xs text-zinc-300 space-y-1">
            <p className="font-bold text-white">Cam kết nguyên tắc cốt lõi:</p>
            <ul className="list-disc pl-5 space-y-1 text-zinc-400">
              <li>Không thu thập dữ liệu nhạy cảm ngoài phạm vi học tập.</li>
              <li>
                Tuyệt đối không bán, cho thuê, hoặc trao đổi dữ liệu người dùng
                cho các bên quảng cáo thứ ba.
              </li>
              <li>
                Mọi dữ liệu cá nhân có thể được chính bạn xóa vĩnh viễn bất kỳ
                lúc nào với 1 cú nhấp chuột.
              </li>
            </ul>
          </div>
        </section>

        {/* Section 2: Dữ liệu thu thập */}
        <section className="space-y-4">
          <div className="flex items-center gap-2.5 text-emerald-400">
            <UserCheck className="w-5 h-5" />
            <h2 className="text-xl font-bold tracking-tight text-white uppercase font-mono">
              2. Các loại dữ liệu chúng tôi thu thập
            </h2>
          </div>
          <p className="text-sm text-zinc-300 leading-relaxed">
            Chúng tôi chỉ thu thập các nhóm dữ liệu tối thiểu sau:
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="p-4 bg-zinc-900/40 border border-zinc-800 space-y-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-400 inline-block" />
                Thông tin Google OAuth 2.0
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Khi bạn đăng nhập bằng Google, chúng tôi nhận được: Họ tên, địa
                chỉ email và ảnh đại diện công khai (avatar URL). Chúng tôi{" "}
                <strong>không bao giờ</strong> có quyền truy cập mật khẩu
                Google, danh bạ, tệp tin Drive hay dữ liệu cá nhân khác của bạn.
              </p>
            </div>

            <div className="p-4 bg-zinc-900/40 border border-zinc-800 space-y-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-400 inline-block" />
                Dữ liệu tiến trình học tập
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Bao gồm: Danh sách từ vựng bạn đã học, trạng thái ghi nhớ (Mới /
                Đang nhớ / Thành thạo), chuỗi ngày học liên tục (Streak), mốc
                thời gian ôn tập lặp lại ngắt quãng (SRS), và kết quả các màn
                chơi trong Word Island hay Word Blaster.
              </p>
            </div>

            <div className="p-4 bg-zinc-900/40 border border-zinc-800 space-y-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-400 inline-block" />
                Cookie phiên làm việc (Session)
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Chúng tôi chỉ sử dụng Cookie phiên cần thiết (Essential Auth
                Cookies) do Supabase cung cấp để giữ phiên đăng nhập an toàn.
                Chúng tôi không sử dụng bất kỳ cookie theo dõi quảng cáo nào.
              </p>
            </div>

            <div className="p-4 bg-zinc-900/40 border border-zinc-800 space-y-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-400 inline-block" />
                Nhật ký bảo mật hệ thống
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Thời điểm đăng nhập gần nhất và nhật ký sự kiện hệ thống nhằm
                ngăn chặn gian lận điểm số và các cuộc tấn công từ chối dịch vụ
                (DDoS/Spam).
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Mục đích sử dụng */}
        <section className="space-y-3">
          <div className="flex items-center gap-2.5 text-emerald-400">
            <RefreshCw className="w-5 h-5" />
            <h2 className="text-xl font-bold tracking-tight text-white uppercase font-mono">
              3. Mục đích sử dụng dữ liệu
            </h2>
          </div>
          <p className="text-sm text-zinc-300 leading-relaxed">
            Dữ liệu thu thập được sử dụng độc quyền cho các mục đích sau:
          </p>
          <ul className="grid gap-2 text-xs sm:text-sm text-zinc-300 pl-1">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                Xác thực danh tính và đồng bộ tiến độ học tập trên các thiết bị
                bạn sử dụng.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                Vận hành thuật toán lặp lại ngắt quãng (Spaced Repetition
                System) giúp đề xuất từ cần ôn tập đúng thời điểm.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                Ghi nhận chuỗi ngày học (Streak) và thống kê thành tích cá nhân
                để tạo động lực học tập.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                Bảo vệ hệ thống trước các hành vi tấn công giả mạo hoặc gian lận
                cơ sở dữ liệu.
              </span>
            </li>
          </ul>
        </section>

        {/* Section 4: Bảo mật & RLS */}
        <section className="space-y-3">
          <div className="flex items-center gap-2.5 text-emerald-400">
            <Lock className="w-5 h-5" />
            <h2 className="text-xl font-bold tracking-tight text-white uppercase font-mono">
              4. Bảo mật dữ liệu & Cơ chế Row Level Security (RLS)
            </h2>
          </div>
          <p className="text-sm text-zinc-300 leading-relaxed">
            Chúng tôi triển khai các tiêu chuẩn bảo mật dữ liệu cấp doanh
            nghiệp:
          </p>
          <div className="p-4 bg-zinc-900/60 border border-zinc-800 space-y-3 text-xs leading-relaxed text-zinc-300">
            <div>
              <strong className="text-white block mb-0.5">
                • Mã hóa đầu cuối (HTTPS/TLS):
              </strong>
              Toàn bộ dữ liệu truyền giữa trình duyệt của bạn và máy chủ luôn
              được mã hóa thông qua chuẩn TLS 1.3 bảo mật.
            </div>
            <div>
              <strong className="text-white block mb-0.5">
                • Phân quyền cấp độ hàng (Row Level Security - RLS):
              </strong>
              Cơ sở dữ liệu PostgreSQL của LingoHub được cấu hình chính sách RLS
              nghiêm ngặt. Mỗi học viên chỉ có thể đọc và ghi chép dữ liệu của
              chính mình thông qua định danh xác thực (
              <code className="text-emerald-400 font-mono">auth.uid()</code>).
              Không một người dùng nào có thể xem hoặc chỉnh sửa dữ liệu học tập
              của học viên khác.
            </div>
            <div>
              <strong className="text-white block mb-0.5">
                • Bảo vệ bản quyền học liệu:
              </strong>
              Kho từ vựng và câu hỏi được kiểm soát truy cập chống việc trích
              xuất hàng loạt (anti-scraping) bởi bot hoặc tác nhân độc hại.
            </div>
          </div>
        </section>

        {/* Section 5: Xóa tài khoản & GDPR */}
        <section className="space-y-4">
          <div className="flex items-center gap-2.5 text-rose-400">
            <ShieldAlert className="w-5 h-5" />
            <h2 className="text-xl font-bold tracking-tight text-white uppercase font-mono">
              5. Quyền của bạn & Xóa vĩnh viễn tài khoản (Right to be Forgotten)
            </h2>
          </div>
          <p className="text-sm text-zinc-300 leading-relaxed">
            Tuân thủ chính sách của Google API Services User Data Policy, quy
            định GDPR của Liên minh Châu Âu và Nghị định 13/2023/NĐ-CP của Việt
            Nam về bảo vệ dữ liệu cá nhân, bạn có toàn quyền đối với dữ liệu của
            mình:
          </p>

          <div className="border border-rose-900/60 bg-rose-950/20 p-5 space-y-3">
            <h3 className="text-sm font-bold text-rose-300 flex items-center gap-2">
              <span className="w-2 h-2 bg-rose-400 rounded-full" />
              Tính năng tự xóa tài khoản trực tiếp trong ứng dụng
            </h3>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Bạn không cần gửi email yêu cầu hay chờ đợi phê duyệt. Bạn có thể
              tự tay hủy hoàn toàn tài khoản bất cứ lúc nào:
            </p>
            <ol className="list-decimal pl-5 text-xs text-zinc-300 space-y-1">
              <li>Đăng nhập vào LingoHub trên máy tính hoặc điện thoại.</li>
              <li>
                Bấm vào biểu tượng <strong>Avatar của bạn</strong> ở góc trên
                bên phải màn hình để mở menu.
              </li>
              <li>
                Chọn mục <strong>&ldquo;Xóa tài khoản vĩnh viễn&rdquo;</strong>{" "}
                trong phần Bảo mật &amp; Quyền riêng tư.
              </li>
              <li>
                Nhập xác nhận từ{" "}
                <strong className="text-rose-400 font-mono">XÓA</strong> vào hộp
                thoại cảnh báo và bấm xác nhận.
              </li>
            </ol>
            <div className="pt-2 border-t border-rose-900/40 text-xs text-rose-200/90 leading-relaxed">
              <strong>Hậu quả pháp lý &amp; kỹ thuật khi xóa:</strong> Khi bạn
              xác nhận xóa, hệ thống sẽ thực thi hàm bảo mật{" "}
              <code className="text-white font-mono bg-rose-950/60 px-1 py-0.5">
                delete_user_account()
              </code>
              , xóa sạch ngay lập tức mọi dữ liệu tài khoản, phiên OAuth Google,
              bảng tiến độ học tập và chuỗi streak khỏi cơ sở dữ liệu. Hành động
              này là vĩnh viễn và không thể khôi phục.
            </div>
          </div>
        </section>

        {/* Section 6: Bên thứ ba */}
        <section className="space-y-3">
          <div className="flex items-center gap-2.5 text-emerald-400">
            <Database className="w-5 h-5" />
            <h2 className="text-xl font-bold tracking-tight text-white uppercase font-mono">
              6. Các nhà cung cấp dịch vụ bên thứ ba
            </h2>
          </div>
          <p className="text-sm text-zinc-300 leading-relaxed">
            Để vận hành ứng dụng, chúng tôi hợp tác với các nhà cung cấp hạ tầng
            đám mây uy tín hàng đầu thế giới:
          </p>
          <div className="grid gap-3 sm:grid-cols-3 text-xs">
            <div className="p-3 bg-zinc-900/50 border border-zinc-800">
              <strong className="text-white block mb-1">
                Google Identity Services
              </strong>
              <p className="text-zinc-400">
                Cung cấp phương thức xác thực người dùng an toàn theo chuẩn
                OAuth 2.0.
              </p>
            </div>
            <div className="p-3 bg-zinc-900/50 border border-zinc-800">
              <strong className="text-white block mb-1">Supabase Inc.</strong>
              <p className="text-zinc-400">
                Lưu trữ cơ sở dữ liệu phân tán bảo mật, đạt chứng chỉ bảo mật
                SOC2 Type II.
              </p>
            </div>
            <div className="p-3 bg-zinc-900/50 border border-zinc-800">
              <strong className="text-white block mb-1">Vercel Inc.</strong>
              <p className="text-zinc-400">
                Mạng lưới phân phối nội dung (CDN) và máy chủ biên phân phối
                trang tĩnh bảo mật cao.
              </p>
            </div>
          </div>
        </section>

        {/* Section 7: Liên hệ */}
        <section className="space-y-3 border-t border-zinc-800 pt-8">
          <div className="flex items-center gap-2.5 text-emerald-400">
            <Mail className="w-5 h-5" />
            <h2 className="text-xl font-bold tracking-tight text-white uppercase font-mono">
              7. Liên hệ về Quyền Riêng Tư &amp; Khiếu Nại
            </h2>
          </div>
          <p className="text-sm text-zinc-300 leading-relaxed">
            Nếu bạn có bất kỳ câu hỏi, góp ý hoặc quan ngại nào liên quan đến
            chính sách quyền riêng tư hoặc việc xử lý dữ liệu cá nhân của
            LingoHub, xin vui lòng liên hệ với đội ngũ phát triển qua:
          </p>
          <div className="p-4 bg-zinc-900/40 border border-zinc-800 text-xs font-mono text-zinc-300 space-y-1">
            <p>
              • <strong>Dự án:</strong> LingoHub English Vocabulary Platform
            </p>
            <p>
              • <strong>Email phụ trách bảo mật:</strong>{" "}
              <span className="text-emerald-400">quy24.dev@gmail.com</span>
            </p>
            <p>
              • <strong>Thời gian phản hồi cam kết:</strong> Trong vòng 24 - 48
              giờ làm việc.
            </p>
          </div>
        </section>

        {/* Bottom Navigation */}
        <div className="border-t border-zinc-800 pt-8 flex items-center justify-between">
          <Link
            href="/"
            className="text-xs font-mono uppercase tracking-wider text-zinc-400 hover:text-white transition-colors"
          >
            ← Về Trang chủ
          </Link>
          <Link
            href="/dashboard"
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs uppercase tracking-wider transition-colors"
          >
            Vào học ngay
          </Link>
        </div>
      </main>
    </div>
  );
}
