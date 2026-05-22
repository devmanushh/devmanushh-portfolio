"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <header className="paper-shell sticky top-4 z-40 pt-2">
      <nav className="ink-frame flex items-center justify-between gap-4 bg-[#fffaf0]/75 px-5 py-3 backdrop-blur">
        <Link href="/#home" className="text-2xl font-bold leading-none">
          devmanushh
        </Link>

        <div className="flex items-center gap-4 text-lg">
          <Link href="/#home">theme</Link>
          <Link href="/#home">home</Link>
          <Link href="/#contact">contact</Link>
          <Link href="/admin">admin</Link>
        </div>
      </nav>
    </header>
  );
}
