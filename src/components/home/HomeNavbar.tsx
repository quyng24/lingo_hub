import Link from "next/link";
import { Gamepad2 } from "lucide-react";
import AccountControl from "@/components/AccountControl";

export default function HomeNavbar() {
  return (
    <nav className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-5 sm:px-6 py-3.5">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 sm:w-9 sm:h-9 bg-emerald-500 flex items-center justify-center group-hover:bg-emerald-400 transition-colors">
            <Gamepad2 className="w-5 h-5 text-zinc-950" />
          </div>
          <span className="text-lg sm:text-xl font-black tracking-widest text-white uppercase">
            Lingo<span className="text-emerald-400 font-normal">Hub</span>
          </span>
        </Link>

        <div className="hidden lg:flex gap-6 text-xs font-mono tracking-widest uppercase text-zinc-400">
          <Link href="#learning-flow" className="hover:text-emerald-400 transition-colors">
            Luồng học
          </Link>
          <Link href="#phases" className="hover:text-emerald-400 transition-colors">
            4 Giai đoạn
          </Link>
          <Link href="#srs" className="hover:text-emerald-400 transition-colors">
            Cơ chế SRS
          </Link>
          <Link href="/daily-learn/learn" className="text-emerald-400 hover:text-emerald-300 font-bold transition-colors">
            Học hôm nay
          </Link>
          <Link href="/game" className="text-white hover:text-cyan-400 transition-colors">
            Game Library
          </Link>
        </div>

        <AccountControl />
      </div>
    </nav>
  );
}

