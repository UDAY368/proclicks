"use client";

import { animate, useMotionValue, type MotionValue } from "framer-motion";
import { useCallback, useEffect, useRef } from "react";

export type PortfolioMarqueeControls = {
  x: MotionValue<number>;
  pause: () => void;
  resume: () => void;
};

/**
 * Infinite horizontal marquee via translateX.
 * Assumes duplicate content: loopWidth = width of one copy; animates 0 → -loopWidth.
 */
export function usePortfolioMarquee(
  loopWidth: number,
  speedPxPerSec = 42,
): PortfolioMarqueeControls {
  const x = useMotionValue(0);
  const controlsRef = useRef<ReturnType<typeof animate> | null>(null);

  const start = useCallback(() => {
    controlsRef.current?.stop();
    if (loopWidth <= 0) return;

    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      x.set(0);
      return;
    }

    const duration = loopWidth / speedPxPerSec;
    x.set(0);

    const controls = animate(x, -loopWidth, {
      duration,
      ease: "linear",
      repeat: Infinity,
      repeatType: "loop",
    });
    controlsRef.current = controls;
  }, [loopWidth, speedPxPerSec, x]);

  useEffect(() => {
    start();
    return () => {
      controlsRef.current?.stop();
      controlsRef.current = null;
    };
  }, [start]);

  const pause = useCallback(() => {
    controlsRef.current?.pause();
  }, []);

  const resume = useCallback(() => {
    controlsRef.current?.play();
  }, []);

  return { x, pause, resume };
}
