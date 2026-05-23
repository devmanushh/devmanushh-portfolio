"use client";

import Lenis from "lenis";
import { ThemeProvider } from "next-themes";
import { useEffect } from "react";

function StoryBackground() {
  return (
    <div className="light-story-background" aria-hidden="true">
      <div className="dark-star-field">
        <span className="dark-moon" />
        <span className="dark-nebula dark-nebula-one" />
        <span className="dark-nebula dark-nebula-two" />
        <span className="dark-star-cluster dark-star-cluster-one" />
        <span className="dark-star-cluster dark-star-cluster-two" />
        <span className="dark-star-cluster dark-star-cluster-three" />
        <span className="dark-shooting-star dark-shooting-star-one" />
        <span className="dark-shooting-star dark-shooting-star-two" />
        <span className="dark-shooting-star dark-shooting-star-three" />
      </div>

      <div className="light-sky">
        <span className="sunset-sun" />
        <span className="sky-cloud cloud-one" />
        <span className="sky-cloud cloud-two" />
        <span className="sky-cloud cloud-three" />
        <span className="ufo ufo-one">
          <span />
        </span>
        <span className="ufo ufo-two">
          <span />
        </span>
        <span className="ufo ufo-three">
          <span />
        </span>
        <span className="story-asteroid story-asteroid-one" />
        <span className="story-asteroid story-asteroid-two" />
        <span className="story-asteroid story-asteroid-three" />
        <span className="story-asteroid story-asteroid-four" />
        <span className="story-asteroid story-asteroid-five" />
        <span className="story-asteroid story-asteroid-six" />
        <span className="story-asteroid story-asteroid-seven" />
        <span className="story-asteroid story-asteroid-eight" />
        <span className="story-asteroid story-asteroid-nine" />
      </div>

      <div className="mountain-range" />
      <div className="mountain-range mountain-range-back" />
      <div className="light-ground">
        <span className="ground-hill ground-hill-one" />
        <span className="ground-hill ground-hill-two" />
        <span className="ground-hill ground-hill-three" />
        <span className="grass grass-one" />
        <span className="grass grass-two" />
        <span className="grass grass-three" />
        <span className="grass grass-four" />
        <span className="alien alien-one" />
        <span className="alien alien-two" />
        <span className="alien alien-three" />
        <span className="dino dino-running dino-one" />
        <span className="dino dino-running dino-two" />
        <span className="dino dino-resting dino-three" />
        <span className="tiny-creature creature-one" />
        <span className="tiny-creature creature-two" />
        <span className="tiny-creature creature-three" />
        <span className="lava-pool lava-pool-one" />
        <span className="lava-pool lava-pool-two" />
        <span className="lava-pool lava-pool-three" />
        <span className="lava-pool lava-pool-four" />
      </div>
    </div>
  );
}

export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (reduceMotion.matches) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.15,
      lerp: 0.09,
      smoothWheel: true,
      wheelMultiplier: 0.9,
    });

    let frame = 0;

    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };

    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return (
    <ThemeProvider
      attribute="data-theme"
      defaultTheme="dark"
      enableSystem={false}
      themes={["light", "dark"]}
    >
      <StoryBackground />
      {children}
    </ThemeProvider>
  );
}
