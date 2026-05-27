"use client";

import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { Contact, Home, Menu, Moon, Shield, Sun, X } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useEffect, useState } from "react";

const navItems = [
  { href: "/#home", label: "home", icon: Home, mobileHidden: true },
  { href: "/#contact", label: "contact", icon: Contact, mobileHidden: true },
  { href: "/admin", label: "admin", icon: Shield },
];

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const { scrollY } = useScroll();
  const scale = useTransform(scrollY, [0, 140], [1, 0.97]);
  const y = useTransform(scrollY, [0, 140], [0, -5]);
  const isDark = mounted ? resolvedTheme !== "light" : true;

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));

    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <motion.header className="nav-wrap" style={{ scale, y }}>
      <nav className="nav-glass-plate">
        <span className="nav-3d-rim nav-3d-rim-top" aria-hidden="true" />
        <span className="nav-3d-rim nav-3d-rim-bottom" aria-hidden="true" />
        <span className="nav-3d-corner nav-3d-corner-left" aria-hidden="true" />
        <span className="nav-3d-corner nav-3d-corner-right" aria-hidden="true" />

        <div className="nav-asteroid-field" aria-hidden="true">
          <span className="nav-asteroid nav-asteroid-one" />
          <span className="nav-asteroid nav-asteroid-two" />
          <span className="nav-asteroid nav-asteroid-three" />
        </div>

        <Link href="/#home" className="nav-brand" aria-label="Devmanushh home">
          <span>devmanushh</span>
          <span className="brand-volcano" aria-hidden="true">
            <span className="volcano-cone" />
            <span className="volcano-lava volcano-lava-one" />
            <span className="volcano-lava volcano-lava-two" />
            <span className="volcano-lava volcano-lava-three" />
            <span className="volcano-smoke volcano-smoke-one" />
            <span className="volcano-smoke volcano-smoke-two" />
          </span>
        </Link>

        <div className="nav-right">
          <button
            type="button"
            className="nav-text-button theme-toggle-word"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
          >
            {isDark ? <Moon size={15} /> : <Sun size={15} />}
            theme
          </button>

          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-text-link${item.mobileHidden ? " nav-mobile-hidden" : ""}`}
              >
                <Icon size={15} />
                {item.label}
              </Link>
            );
          })}
        </div>

        <button
          type="button"
          className="mobile-menu-button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            className="mobile-nav-panel"
            initial={{ opacity: 0, y: -10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.96 }}
            transition={{ duration: 0.24 }}
          >
            <button type="button" onClick={() => setTheme(isDark ? "light" : "dark")}>
              theme
            </button>
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>
                {item.label}
              </Link>
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.header>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="section-frame footer-inner">
        <span>devmanushh operating system</span>
        <p>© 2026 devmanushh. Built with curiosity, intelligent systems, and a little starlight.</p>
      </div>
    </footer>
  );
}
