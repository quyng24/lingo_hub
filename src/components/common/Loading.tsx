"use client";

interface LoadingProps {
  message?: string;
}

export default function Loading({ message = "Đang tải dữ liệu..." }: LoadingProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-zinc-950/80 backdrop-blur-xs z-50">
      <div className="flex flex-col items-center p-6 bg-zinc-900 border border-zinc-800 shadow-2xl max-w-xs w-full text-center">
        {/* Sleek Neon Emerald Spinner */}
        <div className="relative w-10 h-10">
          <div className="w-10 h-10 rounded-full border-2 border-zinc-800 border-t-emerald-400 animate-spin" />
        </div>

        {/* Message */}
        <p className="mt-4 text-xs font-mono uppercase tracking-wider text-zinc-300">
          {message}
        </p>
      </div>
    </div>
  );
}