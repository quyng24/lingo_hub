"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AlertCircle, LogOut, X } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/components/AuthProvider";
import { authService } from "@/services/authService";

export default function AccountControl() {
  const { user } = useAuth();
  const router = useRouter();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Sync state with native <dialog>
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isConfirmOpen) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else {
      if (dialog.open) {
        dialog.close();
      }
    }
  }, [isConfirmOpen]);

  // Fallback backdrop click for light-dismiss
  const handleBackdropClick = (event: React.MouseEvent<HTMLDialogElement>) => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (event.target === dialog) {
      const rect = dialog.getBoundingClientRect();
      const isInside =
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width;

      if (!isInside) {
        setIsConfirmOpen(false);
      }
    }
  };

  async function handleSignOut() {
    if (!isConfirmOpen || isSigningOut) return;

    setIsSigningOut(true);
    try {
      const { error: signOutError } = await authService.signOut();

      if (signOutError) {
        toast.error(signOutError.message);
        return;
      }

      setIsConfirmOpen(false);
      toast.success("Đăng xuất thành công.");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không thể đăng xuất lúc này.");
    } finally {
      setIsSigningOut(false);
    }
  }

  if (!user) {
    return (
      <Link
        href="/auth"
        className="border border-emerald-500/50 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-300 hover:bg-emerald-500 hover:text-zinc-950 transition-colors"
      >
        Đăng nhập
      </Link>
    );
  }

  return (
    <>
      <div className="flex items-center gap-2.5 sm:gap-3">
        <span className="hidden max-w-40 truncate text-xs text-zinc-400 lg:inline">
          {user.email}
        </span>
        <Link
          href="/dashboard"
          className="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors hidden sm:inline"
        >
          Dashboard
        </Link>
        <button
          type="button"
          onClick={() => setIsConfirmOpen(true)}
          title="Đăng xuất"
          aria-haspopup="dialog"
          aria-expanded={isConfirmOpen}
          className="inline-flex items-center gap-1.5 border border-zinc-700 bg-zinc-900/60 px-2.5 py-1.5 text-xs font-bold text-zinc-300 hover:border-rose-400/80 hover:text-rose-300 transition-colors"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Đăng xuất</span>
        </button>
      </div>

      {/* 🛑 CONFIRMATION MODAL DIALOG */}
      <dialog
        ref={dialogRef}
        closedby="any"
        onClose={() => setIsConfirmOpen(false)}
        onClick={handleBackdropClick}
        aria-labelledby="signout-dialog-title"
        className="fixed inset-0 m-auto w-[92vw] max-w-sm bg-transparent p-0 border-0 backdrop:bg-black/80 backdrop:backdrop-blur-xs outline-none shadow-2xl"
      >
        <div className="border border-zinc-800 bg-zinc-950 p-5 sm:p-6 text-zinc-100 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 flex items-center justify-center bg-rose-500/10 border border-rose-500/25 text-rose-400 shrink-0">
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
              onClick={() => setIsConfirmOpen(false)}
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
              onClick={() => setIsConfirmOpen(false)}
              disabled={isSigningOut}
              className="px-3.5 py-2.5 border border-zinc-700 bg-zinc-900 hover:border-zinc-500 hover:bg-zinc-800 text-zinc-300 text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="px-3.5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold uppercase tracking-wider transition-colors disabled:cursor-wait disabled:opacity-60 flex items-center justify-center gap-1.5"
            >
              {isSigningOut ? (
                "Đang xử lý..."
              ) : (
                <>
                  <LogOut className="w-3.5 h-3.5" />
                  Đăng xuất
                </>
              )}
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
