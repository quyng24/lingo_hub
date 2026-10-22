"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  ChevronDown,
  Gamepad2,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Shield,
  ShieldAlert,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/components/AuthProvider";
import { authService } from "@/services/authService";

export default function AccountControl() {
  const { user } = useAuth();
  const router = useRouter();

  // Dropdown menu state
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Sign out modal state
  const [isSignOutOpen, setIsSignOutOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const signOutDialogRef = useRef<HTMLDialogElement>(null);

  // Delete account modal state
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const deleteDialogRef = useRef<HTMLDialogElement>(null);

  // Close dropdown on click outside or Escape
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    }

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMenuOpen]);

  // Sync Sign Out dialog
  useEffect(() => {
    const dialog = signOutDialogRef.current;
    if (!dialog) return;

    if (isSignOutOpen) {
      if (!dialog.open) dialog.showModal();
    } else {
      if (dialog.open) dialog.close();
    }
  }, [isSignOutOpen]);

  // Sync Delete Account dialog
  useEffect(() => {
    const dialog = deleteDialogRef.current;
    if (!dialog) return;

    if (isDeleteOpen) {
      if (!dialog.open) dialog.showModal();
    } else {
      if (dialog.open) dialog.close();
    }
  }, [isDeleteOpen]);

  // Backdrop click handler for modals
  const handleBackdropClick = (
    event: React.MouseEvent<HTMLDialogElement>,
    closeFn: () => void,
    ref: React.RefObject<HTMLDialogElement | null>
  ) => {
    const dialog = ref.current;
    if (!dialog) return;

    if (event.target === dialog) {
      const rect = dialog.getBoundingClientRect();
      const isInside =
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width;

      if (!isInside) {
        closeFn();
      }
    }
  };

  async function handleSignOut() {
    if (!isSignOutOpen || isSigningOut) return;

    setIsSigningOut(true);
    try {
      const { error: signOutError } = await authService.signOut();

      if (signOutError) {
        toast.error(signOutError.message);
        return;
      }

      setIsSignOutOpen(false);
      toast.success("Đăng xuất thành công.");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không thể đăng xuất lúc này.");
    } finally {
      setIsSigningOut(false);
    }
  }

  async function handleDeleteAccount() {
    if (!isDeleteOpen || isDeleting) return;

    const trimmed = deleteConfirmText.trim().toUpperCase();
    if (trimmed !== "XÓA" && trimmed !== "DELETE") {
      toast.error("Vui lòng nhập đúng chữ 'XÓA' để xác nhận.");
      return;
    }

    setIsDeleting(true);
    try {
      await authService.deleteAccount();
      setIsDeleteOpen(false);
      toast.success("Tài khoản và toàn bộ dữ liệu của bạn đã được xóa vĩnh viễn.");
      router.push("/auth?deleted=true");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không thể xóa tài khoản lúc này.");
    } finally {
      setIsDeleting(false);
    }
  }

  const isDeleteConfirmed =
    deleteConfirmText.trim().toUpperCase() === "XÓA" ||
    deleteConfirmText.trim().toUpperCase() === "DELETE";

  if (!user) {
    return (
      <Link
        href="/auth"
        className="border border-emerald-500/50 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-300 hover:bg-emerald-500 hover:text-zinc-950 transition-colors"
      >
        Đăng nhập
      </Link>
    );
  }

  // Derive display values
  const avatarUrl =
    (user.user_metadata?.avatar_url as string | undefined) ||
    (user.user_metadata?.picture as string | undefined);
  const fullName =
    (user.user_metadata?.full_name as string | undefined) ||
    (user.user_metadata?.name as string | undefined);
  const displayName = fullName || user.email?.split("@")[0] || "User";
  const initialChar = (displayName[0] || user.email?.[0] || "U").toUpperCase();

  return (
    <>
      {/* 👤 AVATAR MENU TRIGGER CONTAINER */}
      <div className="relative inline-block text-left" ref={menuRef}>
        <button
          type="button"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-haspopup="menu"
          aria-expanded={isMenuOpen}
          aria-label="Menu tài khoản"
          className="group flex items-center gap-2 border border-zinc-800 bg-zinc-900/70 hover:border-zinc-700 hover:bg-zinc-800/80 px-2 sm:px-2.5 py-1.5 text-xs transition-colors cursor-pointer"
        >
          {/* Avatar Icon / Picture with Online Dot */}
          <div className="relative flex-shrink-0">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarUrl}
                alt={displayName}
                referrerPolicy="no-referrer"
                className="w-6 h-6 object-cover border border-zinc-700"
              />
            ) : (
              <div className="w-6 h-6 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-[11px] flex items-center justify-center">
                {initialChar}
              </div>
            )}
            <span className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 bg-emerald-400 border border-zinc-950 rounded-full" />
          </div>

          {/* User Name */}
          <span className="hidden sm:inline max-w-28 md:max-w-36 truncate text-xs font-medium text-zinc-300 group-hover:text-white transition-colors">
            {displayName}
          </span>

          {/* Dropdown Chevron */}
          <ChevronDown
            className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-200 ${
              isMenuOpen ? "rotate-180 text-emerald-400" : "group-hover:text-zinc-200"
            }`}
          />
        </button>

        {/* 📋 POPUP MENU DROPDOWN */}
        {isMenuOpen && (
          <div
            role="menu"
            aria-orientation="vertical"
            className="absolute right-0 top-full mt-2 w-64 sm:w-72 border border-zinc-800 bg-zinc-950/95 backdrop-blur-md shadow-2xl z-50 p-1.5 divide-y divide-zinc-800/70 animate-in fade-in zoom-in-95 duration-100"
          >
            {/* Header: User Profile Info */}
            <div className="px-2.5 py-2">
              <div className="flex items-center gap-2.5">
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={avatarUrl}
                    alt={displayName}
                    referrerPolicy="no-referrer"
                    className="w-8 h-8 object-cover border border-zinc-700 shrink-0"
                  />
                ) : (
                  <div className="w-8 h-8 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center justify-center shrink-0">
                    {initialChar}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-white truncate">{displayName}</p>
                  <p className="text-[11px] text-zinc-400 truncate font-mono mt-0.5">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Navigation Links */}
            <div className="py-1">
              <Link
                href="/dashboard"
                onClick={() => setIsMenuOpen(false)}
                role="menuitem"
                className="flex items-center gap-2.5 px-2.5 py-2 text-xs font-medium text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-emerald-400" />
                <span>Dashboard</span>
              </Link>

              <Link
                href="/daily-learn/progress"
                onClick={() => setIsMenuOpen(false)}
                role="menuitem"
                className="flex items-center gap-2.5 px-2.5 py-2 text-xs font-medium text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors"
              >
                <GraduationCap className="w-3.5 h-3.5 text-zinc-400" />
                <span>Tiến độ học tập</span>
              </Link>

              <Link
                href="/game"
                onClick={() => setIsMenuOpen(false)}
                role="menuitem"
                className="flex items-center gap-2.5 px-2.5 py-2 text-xs font-medium text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors"
              >
                <Gamepad2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Game từ vựng</span>
              </Link>
            </div>

            {/* Actions: Đăng xuất */}
            <div className="py-1">
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsSignOutOpen(true);
                }}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 text-xs font-medium text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors text-left cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5 text-zinc-400" />
                <span>Đăng xuất</span>
              </button>
            </div>

            {/* Danger / Privacy Zone: Xóa tài khoản & Chính sách */}
            <div className="pt-1.5 pb-0.5">
              <p className="px-2.5 pt-1 text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                Bảo mật & Quyền riêng tư
              </p>
              <Link
                href="/privacy"
                onClick={() => setIsMenuOpen(false)}
                role="menuitem"
                className="w-full mt-1 flex items-center gap-2.5 px-2.5 py-1.5 text-xs text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors text-left"
              >
                <Shield className="w-3.5 h-3.5 text-zinc-500" />
                <span>Chính sách quyền riêng tư</span>
              </Link>
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setIsMenuOpen(false);
                  setDeleteConfirmText("");
                  setIsDeleteOpen(true);
                }}
                className="w-full flex items-center gap-2.5 px-2.5 py-1.5 text-xs text-zinc-400 hover:text-rose-400 hover:bg-rose-950/25 transition-colors text-left cursor-pointer group/del"
              >
                <Trash2 className="w-3.5 h-3.5 text-zinc-500 group-hover/del:text-rose-400" />
                <span>Xóa tài khoản vĩnh viễn</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 🛑 1. MODAL ĐĂNG XUẤT */}
      <dialog
        ref={signOutDialogRef}
        closedby="any"
        onClose={() => setIsSignOutOpen(false)}
        onClick={(e) => handleBackdropClick(e, () => setIsSignOutOpen(false), signOutDialogRef)}
        aria-labelledby="signout-dialog-title"
        className="fixed inset-0 m-auto w-[92vw] max-w-sm bg-transparent p-0 border-0 backdrop:bg-black/80 backdrop:backdrop-blur-xs outline-none shadow-2xl"
      >
        <div className="border border-zinc-800 bg-zinc-950 p-5 sm:p-6 text-zinc-100 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 flex items-center justify-center bg-zinc-800 border border-zinc-700 text-zinc-300 shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h2
                  id="signout-dialog-title"
                  className="text-base font-bold text-white tracking-tight"
                >
                  Xác nhận đăng xuất
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  LingoHub Account
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsSignOutOpen(false)}
              disabled={isSigningOut}
              className="text-zinc-500 hover:text-zinc-300 transition-colors p-1"
              aria-label="Đóng"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            Bạn có chắc chắn muốn đăng xuất khỏi tài khoản{" "}
            <span className="font-mono text-zinc-200 break-all">{user.email}</span>?
            Tiến trình học của bạn đã được đồng bộ an toàn.
          </p>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsSignOutOpen(false)}
              disabled={isSigningOut}
              className="px-3.5 py-2.5 border border-zinc-700 bg-zinc-900 hover:border-zinc-500 hover:bg-zinc-800 text-zinc-300 text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="px-3.5 py-2.5 bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-bold uppercase tracking-wider transition-colors disabled:cursor-wait disabled:opacity-60 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {isSigningOut ? "Đang xử lý..." : "Đăng xuất"}
            </button>
          </div>
        </div>
      </dialog>

      {/* ⚠️ 2. MODAL XÓA TÀI KHOẢN (GDPR & GOOGLE COMPLIANCE) */}
      <dialog
        ref={deleteDialogRef}
        closedby="any"
        onClose={() => setIsDeleteOpen(false)}
        onClick={(e) => handleBackdropClick(e, () => setIsDeleteOpen(false), deleteDialogRef)}
        aria-labelledby="delete-dialog-title"
        className="fixed inset-0 m-auto w-[92vw] max-w-md bg-transparent p-0 border-0 backdrop:bg-black/85 backdrop:backdrop-blur-sm outline-none shadow-2xl"
      >
        <div className="border-2 border-rose-600/80 bg-zinc-950 p-5 sm:p-6 text-zinc-100 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center bg-rose-500/15 border border-rose-500/40 text-rose-400 shrink-0">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h2
                  id="delete-dialog-title"
                  className="text-base sm:text-lg font-black text-rose-400 tracking-tight"
                >
                  Xóa Vĩnh Viễn Tài Khoản
                </h2>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Tuân thủ quyền riêng tư & GDPR / Google Data Policy
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsDeleteOpen(false)}
              disabled={isDeleting}
              className="text-zinc-500 hover:text-zinc-300 transition-colors p-1"
              aria-label="Đóng"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-rose-950/30 border border-rose-900/60 p-3 rounded text-xs text-rose-200/90 space-y-1.5 leading-relaxed">
            <p className="font-bold text-rose-300">
              Cảnh báo: Hành động này không thể hoàn tác!
            </p>
            <p>
              Khi bạn xóa tài khoản <span className="font-mono font-bold text-white break-all">{user.email}</span>, toàn bộ các dữ liệu sau sẽ bị hủy vĩnh viễn khỏi hệ thống:
            </p>
            <ul className="list-disc pl-4 space-y-1 text-zinc-300">
              <li>Liên kết Google OAuth và thông tin đăng nhập</li>
              <li>Chuỗi ngày học liên tục (Streak) và điểm số cá nhân</li>
              <li>Toàn bộ tiến trình học và thuật toán lặp lại ngắt quãng (SRS)</li>
            </ul>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="delete-confirm-input"
              className="block text-xs font-medium text-zinc-300"
            >
              Để xác nhận, vui lòng nhập chữ <strong className="text-rose-400 font-mono">XÓA</strong> vào ô dưới đây:
            </label>
            <input
              id="delete-confirm-input"
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="Nhập XÓA để xác nhận"
              disabled={isDeleting}
              className="w-full bg-zinc-900 border border-zinc-700 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-rose-500 focus:outline-none font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsDeleteOpen(false)}
              disabled={isDeleting}
              className="px-3.5 py-2.5 border border-zinc-700 bg-zinc-900 hover:border-zinc-500 hover:bg-zinc-800 text-zinc-300 text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="button"
              onClick={handleDeleteAccount}
              disabled={!isDeleteConfirmed || isDeleting}
              className="px-3.5 py-2.5 bg-rose-600 hover:bg-rose-500 disabled:bg-rose-950 disabled:text-rose-500 disabled:border-rose-900 text-white text-xs font-bold uppercase tracking-wider transition-colors disabled:cursor-not-allowed flex items-center justify-center gap-1.5 cursor-pointer shadow-lg"
            >
              {isDeleting ? (
                "Đang xóa..."
              ) : (
                <>
                  <Trash2 className="w-3.5 h-3.5" />
                  Xác nhận xóa
                </>
              )}
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
