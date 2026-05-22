"use client";

import { PenLine } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="paper-shell sticky top-4 z-40 pt-2">
      <nav className="ink-frame flex items-center justify-between gap-4 bg-[#fffaf0]/75 px-5 py-3 backdrop-blur">
        <Link href="/" className="text-2xl font-bold leading-none">
          devmanushh
        </Link>

        <div className="hidden items-center gap-2 rounded-full border-2 border-[#181614] px-3 py-2 text-sm sm:flex">
          <PenLine size={16} />
          ink
        </div>

        <div className="flex items-center gap-4 text-lg">
          <Link href="/">theme</Link>
          <Link href="/projects">projects</Link>
          <Link href="/contact">contact</Link>
          <Link href="/admin">admin</Link>
        </div>
      </nav>
    </header>
  );
}
