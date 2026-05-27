"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Cpu, Radio } from "lucide-react";

import { OrbitalFrame } from "@/components/PortfolioChrome";
import type { IntroContent } from "@/lib/profile-store";

export default function HeroSection({ intro }: { intro: IntroContent }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 90, damping: 22 });
  const smoothY = useSpring(mouseY, { stiffness: 90, damping: 22 });
  const imageRotateX = useTransform(smoothY, [-0.5, 0.5], [8, -8]);
  const imageRotateY = useTransform(smoothX, [-0.5, 0.5], [-10, 10]);

  return (
    <section
      id="home"
      className="hero-section"
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        mouseX.set((event.clientX - rect.left) / rect.width - 0.5);
        mouseY.set((event.clientY - rect.top) / rect.height - 0.5);
      }}
    >
      <div className="hero-scan" />

      <div className="hero-grid section-frame">
        <OrbitalFrame>
          <motion.div
            className="hero-portrait-wrap magnetic-card"
            style={{ rotateX: imageRotateX, rotateY: imageRotateY }}
            initial={{ opacity: 0, scale: 0.88, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          >
            <div className="hero-circle-design">
              <span className="hero-circle-ring hero-circle-ring-one" />
              <span className="hero-circle-ring hero-circle-ring-two" />
            </div>
            <div className="hero-portrait">
              {intro.heroImageUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element -- Admin-entered external image URLs should work without remote host config. */
                <img
                  src={intro.heroImageUrl}
                  alt="Devmanushh profile"
                  fetchPriority="high"
                  decoding="async"
                />
              ) : (
                <div className="portrait-fallback">
                  <Cpu size={58} />
                </div>
              )}
            </div>
          </motion.div>
        </OrbitalFrame>

        <div className="hero-copy-stack">
          <motion.div
            className="hero-copy"
            initial={{ opacity: 0, x: 34 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="section-eyebrow">introduction...</span>
            <h1>{intro.heading}</h1>
            <div className="hero-lines">
              <p>{intro.lineOne}</p>
              <p>{intro.lineTwo}</p>
            </div>

            <div className="current-mission">
              <Radio size={18} />
              <span>Currently building at</span>
              <strong>{intro.currentCompany}</strong>
              <span>as {intro.currentRole}</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
