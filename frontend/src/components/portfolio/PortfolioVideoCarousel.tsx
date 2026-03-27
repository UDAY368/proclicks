"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { PORTFOLIO_2_VIDEO_URLS } from "@/lib/cloudinaryAssets";

type VideoItem = {
  src: string;
  label: string;
};

const EASE_IN_OUT = [0.42, 0, 0.58, 1] as const;

function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

export type PortfolioVideoCarouselProps = {
  id?: string;
  kicker?: string;
  title?: string;
  subtitle?: string;
  /** If your files are named differently, override here. */
  videos?: VideoItem[];
};

export function PortfolioVideoCarousel({
  id = "portfolio-videos",
  kicker = "Showreel",
  title = "Motion work, in sequence",
  subtitle = "Center plays automatically. Side previews stay blurred. Advances one-by-one.",
  videos,
}: PortfolioVideoCarouselProps) {
  const items = useMemo<VideoItem[]>(
    () =>
      videos ??
      PORTFOLIO_2_VIDEO_URLS.map((src, i) => ({
        src,
        label: `Reel ${String(i + 1).padStart(2, "0")}`,
      })),
    [videos],
  );

  const [index, setIndex] = useState(0);
  const activeRef = useRef<HTMLVideoElement | null>(null);

  const prev = items[mod(index - 1, items.length)]!;
  const active = items[mod(index, items.length)]!;
  const next = items[mod(index + 1, items.length)]!;

  const goPrev = () => setIndex((i) => mod(i - 1, items.length));
  const goNext = () => setIndex((i) => mod(i + 1, items.length));

  useEffect(() => {
    const el = activeRef.current;
    if (!el) return;

    el.currentTime = 0;
    const p = el.play();
    if (p && typeof p.catch === "function") p.catch(() => {});
  }, [active.src]);

  return (
    <section
      id={id}
      className="relative bg-[#000000] pt-0 pb-24 text-white sm:pb-28 md:pb-32"
      aria-label="Portfolio video carousel"
    >
      <div className="relative mx-auto max-w-[1600px] px-5 sm:px-8 md:px-10">
        <header className="mb-12 max-w-2xl sm:mb-14">
          <p className="text-[11px] font-semibold uppercase tracking-[0.38em] text-white/40">
            {kicker}
          </p>
          <h2 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-normal tracking-tight text-white sm:text-4xl md:text-[2.75rem]">
            {title}
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-white/50 sm:text-base">
            {subtitle}
          </p>
        </header>
      </div>

      <div className="relative w-full overflow-hidden">
        {/* Edge fades */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-[60] w-[min(16vw,140px)] bg-gradient-to-r from-black via-black/90 to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-[60] w-[min(18vw,170px)] bg-gradient-to-l from-black via-black/90 to-transparent"
        />

        <div className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 px-4 sm:px-8">
          <div className="relative mx-auto flex h-[600px] w-full max-w-[min(100vw,1320px)] items-center justify-center">
            {/* Premium navigation arrows */}
            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous video"
              className="absolute left-0 top-1/2 z-[80] -translate-y-1/2 rounded-full border border-white/35 bg-white/85 p-3 text-black shadow-[0_22px_70px_rgba(0,0,0,0.65)] backdrop-blur-md transition hover:bg-white hover:shadow-[0_26px_90px_rgba(0,0,0,0.7)] focus:outline-none focus:ring-2 focus:ring-white/40 md:left-6"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="block"
              >
                <path
                  d="M14.5 5L7.5 12L14.5 19"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <button
              type="button"
              onClick={goNext}
              aria-label="Next video"
              className="absolute right-0 top-1/2 z-[80] -translate-y-1/2 rounded-full border border-white/35 bg-white/85 p-3 text-black shadow-[0_22px_70px_rgba(0,0,0,0.65)] backdrop-blur-md transition hover:bg-white hover:shadow-[0_26px_90px_rgba(0,0,0,0.7)] focus:outline-none focus:ring-2 focus:ring-white/40 md:right-6"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="block"
              >
                <path
                  d="M9.5 5L16.5 12L9.5 19"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {/* Left blurred preview */}
            <div className="pointer-events-none relative -mr-10 hidden h-[72%] w-[min(34vw,420px)] shrink-0 overflow-hidden rounded-[24px] border border-white/5 bg-black shadow-[0_30px_110px_rgba(0,0,0,0.75)] md:block">
              <div className="absolute inset-0 scale-[1.12] blur-[10px] opacity-85">
                <video
                  className="h-full w-full object-cover"
                  src={prev.src}
                  muted
                  playsInline
                  preload="metadata"
                />
              </div>
              <div className="absolute inset-0 bg-black/35" />
            </div>

            {/* Center active video (Shorts 9:16) */}
            <div className="relative z-[2] h-[600px] w-[min(92vw,420px)] aspect-[9/16] overflow-hidden rounded-[30px] border border-white/12 bg-black shadow-[0_45px_160px_rgba(0,0,0,0.85)] ring-1 ring-white/10">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={active.src}
                  className="absolute inset-0"
                  initial={{ opacity: 0, scale: 0.99 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    transition: { duration: 0.6, ease: EASE_IN_OUT },
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.995,
                    transition: { duration: 0.35, ease: EASE_IN_OUT },
                  }}
                >
                  <video
                    ref={activeRef}
                    className="h-full w-full object-cover"
                    src={active.src}
                    muted
                    playsInline
                    autoPlay
                    preload="auto"
                    onEnded={() => setIndex((i) => mod(i + 1, items.length))}
                  />
                </motion.div>
              </AnimatePresence>

              {/* label removed per requirement */}
            </div>

            {/* Right blurred preview */}
            <div className="pointer-events-none relative -ml-10 hidden h-[86%] w-[min(36vw,460px)] shrink-0 overflow-hidden rounded-[24px] border border-white/5 bg-black shadow-[0_30px_110px_rgba(0,0,0,0.75)] md:block">
              <div className="absolute inset-0 scale-[1.12] blur-[10px] opacity-85">
                <video
                  className="h-full w-full object-cover"
                  src={next.src}
                  muted
                  playsInline
                  preload="metadata"
                />
              </div>
              <div className="absolute inset-0 bg-black/30" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

