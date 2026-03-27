"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { HeroVideoGrid } from "./HeroVideoGrid";

const COMPANY = "Pro Capture's Photography";
const TITLE =
  "Elevate your brand's visual identity with our comprehensive content creation services!";

/** Tall scroll track (~Waabi overview): pinned viewport, phased copy + video scale. */
const SCROLL_TRACK_VH = 2.65;

export function HeroScrollExperience() {
  const containerRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const progress = useSpring(scrollYProgress, {
    stiffness: 88,
    damping: 32,
    mass: 0.85,
    restDelta: 0.0005,
  });

  // Phase 1 → 2: company large, then lifts & compacts while title appears
  const companyY = useTransform(progress, [0, 0.14, 0.34], [56, 12, -6]);
  const companyScale = useTransform(progress, [0, 0.2], [1.28, 1]);
  const companyOpacity = useTransform(progress, [0, 0.38], [1, 0.92]);

  const titleOpacity = useTransform(progress, [0.06, 0.26], [0, 1]);
  const titleY = useTransform(progress, [0.06, 0.3], [36, 0]);

  // Video strip: overall pull-back, then handoff
  const gridScale = useTransform(progress, [0.32, 0.78], [1, 0.86]);
  const gridY = useTransform(progress, [0.38, 0.88], [0, -52]);

  const scrimEndOpacity = useTransform(progress, [0.72, 0.98], [0, 0.45]);

  // (intentionally no fade-to-white overlay; hero remains fully black)

  const scrollCueOpacity = useTransform(progress, [0, 0.1], [1, 0]);

  if (prefersReducedMotion) {
    return <HeroStaticFallback />;
  }

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative w-full bg-[#050506]"
      style={{ height: `${SCROLL_TRACK_VH * 100}vh` }}
      aria-labelledby="hero-heading"
    >
      {/* Full-bleed from viewport top; videos sit under the floating header (header z-[500]) */}
      <div className="sticky top-0 z-[40] relative flex h-svh w-full flex-col overflow-hidden bg-[#050506]">
        <div className="hero-bg-grid pointer-events-none absolute inset-0 z-0 opacity-[0.35]" />
        <div className="hero-vignette pointer-events-none absolute inset-0 z-0" />
        <div className="hero-noise pointer-events-none absolute inset-0 z-0 mix-blend-overlay" />
        <div className="relative min-h-0 flex-1">
          <motion.div
            className="absolute inset-0 will-change-transform"
            style={{ scale: gridScale, y: gridY }}
          >
            <HeroVideoGrid className="absolute inset-0" />
          </motion.div>

          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050506] via-[#050506]/45 to-transparent"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#050506]/75 via-[#050506]/12 to-[#050506]/38"
            aria-hidden
          />
          <motion.div
            className="pointer-events-none absolute inset-0 bg-[#050506]"
            style={{ opacity: scrimEndOpacity }}
            aria-hidden
          />

          {/* no fade-to-white overlay */}

          <div className="absolute inset-0 z-10 flex h-full w-full items-end justify-start px-4 pb-20 sm:px-6 sm:pb-24 md:px-8 md:pb-32 lg:px-12 lg:pb-[clamp(4.5rem,11vh,6.75rem)]">
            <div className="max-w-[min(100%,44rem)]">
              <motion.div
                className="mb-6 flex origin-bottom-left items-center gap-4 sm:mb-7"
                style={{ y: companyY, scale: companyScale, opacity: companyOpacity }}
              >
                <span
                  className="h-px w-10 shrink-0 bg-gradient-to-r from-stone-300/90 to-stone-300/0 sm:w-12"
                  aria-hidden
                />
                <p className="max-w-[20ch] text-[clamp(0.7rem,1.6vw,0.85rem)] font-medium uppercase leading-snug tracking-[0.38em] text-stone-300 sm:max-w-none sm:text-[clamp(0.75rem,1.35vw,0.8rem)]">
                  {COMPANY}
                </p>
              </motion.div>

              <motion.h1
                id="hero-heading"
                className="text-balance font-[family-name:var(--font-display)] text-[clamp(1.45rem,3.65vw,2.55rem)] font-normal leading-[1.18] tracking-[-0.018em] text-zinc-50"
                style={{ opacity: titleOpacity, y: titleY }}
              >
                {TITLE}
              </motion.h1>

              <motion.div
                className="mt-9 h-px max-w-[6.5rem] bg-gradient-to-r from-stone-400/55 to-transparent sm:mt-10 sm:max-w-[7.5rem]"
                style={{ opacity: titleOpacity }}
                aria-hidden
              />
            </div>
          </div>
        </div>

        <motion.div
          className="pointer-events-none absolute bottom-6 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-2 sm:bottom-8 sm:flex"
          style={{ opacity: scrollCueOpacity }}
          aria-hidden
        >
          <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-500">
            Scroll
          </span>
          <span className="hero-scroll-hint h-8 w-px bg-gradient-to-b from-zinc-500 to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}

function HeroStaticFallback() {
  return (
    <section
      id="home"
      className="relative isolate min-h-svh w-full overflow-hidden bg-[#050506] text-zinc-100"
      aria-labelledby="hero-heading"
    >
      <div className="hero-bg-grid pointer-events-none absolute inset-0 opacity-[0.35]" />
      <div className="hero-vignette pointer-events-none absolute inset-0" />
      <div className="hero-noise pointer-events-none absolute inset-0 mix-blend-overlay" />

      <div className="absolute inset-0 min-h-svh">
        <HeroVideoGrid className="absolute inset-0" />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050506] via-[#050506]/45 to-transparent"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#050506]/75 via-[#050506]/15 to-[#050506]/40"
          aria-hidden
        />
        <div className="absolute inset-0 z-10 flex h-full min-h-svh w-full items-end justify-start px-4 pb-20 sm:px-6 sm:pb-24 md:px-8 md:pb-32 lg:px-12 lg:pb-[clamp(4.5rem,11vh,6.75rem)]">
          <div className="max-w-[min(100%,44rem)]">
            <div className="mb-6 flex items-center gap-4 sm:mb-7">
              <span
                className="h-px w-10 shrink-0 bg-gradient-to-r from-stone-300/90 to-stone-300/0 sm:w-12"
                aria-hidden
              />
              <p className="text-[10px] font-medium uppercase tracking-[0.42em] text-stone-400 sm:text-[11px]">
                {COMPANY}
              </p>
            </div>
            <h1
              id="hero-heading"
              className="text-balance font-[family-name:var(--font-display)] text-[clamp(1.5rem,3.75vw,2.65rem)] font-normal leading-[1.18] tracking-[-0.018em] text-zinc-50"
            >
              {TITLE}
            </h1>
            <div
              className="mt-9 h-px max-w-[6.5rem] bg-gradient-to-r from-stone-400/55 to-transparent sm:mt-10 sm:max-w-[7.5rem]"
              aria-hidden
            />
          </div>
        </div>
      </div>
    </section>
  );
}
