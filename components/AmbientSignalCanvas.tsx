"use client";

import { useEffect, useRef } from "react";
import { createNoise3D } from "simplex-noise";

type Particle = {
  baseX: number;
  baseY: number;
  phase: number;
  radius: number;
  speed: number;
};

const particleCount = 58;

export default function AmbientSignalCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    const signalCanvas = canvas;
    const drawingContext = context;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const noise = createNoise3D();
    const particles: Particle[] = Array.from({ length: particleCount }, (_, index) => ({
      baseX: Math.random(),
      baseY: Math.random(),
      phase: index * 0.38,
      radius: 1.2 + Math.random() * 2.4,
      speed: 0.16 + Math.random() * 0.42,
    }));
    let animationFrame = 0;
    let width = 0;
    let height = 0;
    let pixelRatio = 1;

    function resize() {
      const rect = signalCanvas.getBoundingClientRect();
      pixelRatio = Math.min(window.devicePixelRatio || 1, 1.75);
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      signalCanvas.width = Math.floor(width * pixelRatio);
      signalCanvas.height = Math.floor(height * pixelRatio);
      drawingContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    }

    function draw(time: number) {
      drawingContext.clearRect(0, 0, width, height);

      const t = time * 0.00018;
      const points = particles.map((particle) => {
        const driftX = noise(particle.baseX * 1.7, particle.phase, t * particle.speed);
        const driftY = noise(particle.baseY * 1.7, particle.phase + 12, t * particle.speed);

        return {
          x: particle.baseX * width + driftX * 42,
          y: particle.baseY * height + driftY * 42,
          radius: particle.radius,
        };
      });

      const gradient = drawingContext.createRadialGradient(
        width * 0.5,
        height * 0.32,
        0,
        width * 0.5,
        height * 0.32,
        Math.max(width, height) * 0.72,
      );
      gradient.addColorStop(0, "rgba(103, 232, 249, 0.16)");
      gradient.addColorStop(0.42, "rgba(167, 243, 208, 0.07)");
      gradient.addColorStop(1, "rgba(129, 140, 248, 0)");

      drawingContext.fillStyle = gradient;
      drawingContext.fillRect(0, 0, width, height);

      for (let i = 0; i < points.length; i += 1) {
        const a = points[i];

        for (let j = i + 1; j < points.length; j += 1) {
          const b = points[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distance = Math.hypot(dx, dy);

          if (distance < 132) {
            const alpha = (1 - distance / 132) * 0.22;
            drawingContext.strokeStyle = `rgba(103, 232, 249, ${alpha})`;
            drawingContext.lineWidth = 1;
            drawingContext.beginPath();
            drawingContext.moveTo(a.x, a.y);
            drawingContext.lineTo(b.x, b.y);
            drawingContext.stroke();
          }
        }
      }

      for (const point of points) {
        drawingContext.fillStyle = "rgba(247, 251, 255, 0.72)";
        drawingContext.beginPath();
        drawingContext.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
        drawingContext.fill();

        drawingContext.fillStyle = "rgba(103, 232, 249, 0.12)";
        drawingContext.beginPath();
        drawingContext.arc(point.x, point.y, point.radius * 4.4, 0, Math.PI * 2);
        drawingContext.fill();
      }

      if (!reducedMotion.matches) {
        animationFrame = requestAnimationFrame(draw);
      }
    }

    resize();
    draw(0);

    window.addEventListener("resize", resize);

    if (!reducedMotion.matches) {
      animationFrame = requestAnimationFrame(draw);
    }

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="ambient-signal-canvas" aria-hidden="true" />;
}
