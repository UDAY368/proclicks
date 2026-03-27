"use client";

import type { MotionValue } from "framer-motion";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import type { ReactNode } from "react";
import { useMemo, useRef } from "react";

type MediaKind = "image" | "video";
type AboutMedia = { kind: MediaKind; src: string };

function MediaFrame({
  media,
  className = "",
}: {
  media: AboutMedia;
  className?: string;
}) {
  return (
    <div
      className={`group relative overflow-hidden rounded-xl bg-white shadow-[0_18px_50px_-22px_rgba(0,0,0,0.18)] ring-1 ring-black/[0.06] ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/0 to-black/8" />
      {media.kind === "image" ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={media.src}
          alt=""
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          loading="lazy"
        />
      ) : (
        <video
          className="h-full w-full object-cover"
          src={media.src}
          muted
          playsInline
          loop
          autoPlay
          preload="metadata"
        />
      )}
    </div>
  );
}

function ZigZagTile({
  media,
  idx,
  progress,
  rowGap,
  startGap,
  x,
  baseScale = 1,
  frameClassName,
}: {
  media: AboutMedia;
  idx: number;
  progress: MotionValue<number>;
  rowGap: number;
  startGap: number;
  x: number;
  baseScale?: number;
  frameClassName: string;
}) {
  const reduceMotion = useReducedMotion();
  const scale = useTransform(
    progress,
    [0, 1],
    reduceMotion ? [1, 1] : [baseScale - 0.03, baseScale + 0.07],
  );

  return (
    <motion.div
      className="will-change-transform"
      style={{
        marginTop: idx === 0 ? startGap : rowGap,
        x,
        scale,
      }}
    >
      <MediaFrame media={media} className={frameClassName} />
    </motion.div>
  );
}

function MediaColumn({
  items,
  progress,
  y,
  startGap,
  xOffsets,
  speed,
  frameClassName,
}: {
  items: AboutMedia[];
  progress: MotionValue<number>;
  y: MotionValue<number>;
  startGap: number;
  xOffsets: number[];
  speed: "fast" | "slow";
  frameClassName: string;
}) {
  // A small extra scaling range per speed to emphasize motion.
  const baseScale = speed === "fast" ? 1.02 : 0.99;
  const rowGap = 125;

  return (
    <motion.div style={{ y }} className="flex flex-col items-center">
      {items.map((media, idx) => (
        <ZigZagTile
          key={idx}
          media={media}
          idx={idx}
          progress={progress}
              rowGap={rowGap}
          startGap={startGap}
          x={xOffsets[idx] ?? 0}
          baseScale={baseScale}
          frameClassName={frameClassName}
        />
      ))}
    </motion.div>
  );
}

function AboutContent({
  title,
  description,
}: {
  title: string;
  description: ReactNode;
}) {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="max-w-[34rem] text-center">
        <h2 className="text-balance font-[family-name:var(--font-display)] text-[clamp(1.8rem,2.5vw,2.35rem)] font-normal leading-[1.18] tracking-[-0.02em] text-zinc-900">
          {title}
        </h2>
        <div className="mt-6 text-[16px] leading-relaxed text-zinc-600 sm:text-[18px]">
          {description}
        </div>
      </div>
    </div>
  );
}

/**
 * About mosaic: 7 columns
 * - Left outer (col 1): 1_* (fast) starts after 200px
 * - Left inner (col 2): 2_* (slow) starts immediately
 * - Middle (cols 3-5): content (sticky/constant via pinned layout)
 * - Right inner (col 6): 4_* (slow) starts immediately
 * - Right outer (col 7): 5_* (fast) starts after 200px
 */
export function AboutMosaicSectionV2() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Keep the center content pinned until the full section scroll finishes.
  // Using the same height as the parent track prevents sticky from “releasing” early.
  const trackHeight = "220vh";

  // Translate columns upward as the user scrolls through the About track.
  // Outer columns move faster; inner columns move slower.
  const fastY = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion ? [0, 0] : [0, -320],
  );
  const slowY = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion ? [0, 0] : [0, -200],
  );

  // Move the center content with scroll (instead of fully pinning visually).
  const contentY = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion ? [0, 0] : [0, -260],
  );

  const col1 = useMemo<AboutMedia[]>(
    () => [
      { kind: "image", src: "/assets/1_1_about.JPG" },
      { kind: "video", src: "/assets/1_2_about.mp4" },
      { kind: "image", src: "/assets/1_3_about.JPG" },
      { kind: "image", src: "/assets/1_4_about.JPG" },
    ],
    [],
  );
  const col2 = useMemo<AboutMedia[]>(
    () => [
      { kind: "image", src: "/assets/2_1_about.JPG" },
      { kind: "video", src: "/assets/2_2_about.mp4" },
      { kind: "image", src: "/assets/2_3_about.JPG" },
      { kind: "image", src: "/assets/2_4_about.JPG" },
    ],
    [],
  );
  const col4 = useMemo<AboutMedia[]>(
    () => [
      { kind: "image", src: "/assets/4_1_about.JPG" },
      { kind: "image", src: "/assets/4_2_about.JPG" },
      { kind: "video", src: "/assets/4_3_about.mp4" },
      { kind: "image", src: "/assets/4_4_about.JPG" },
    ],
    [],
  );
  const col5 = useMemo<AboutMedia[]>(
    () => [
      { kind: "image", src: "/assets/5_1_about.JPG" },
      { kind: "video", src: "/assets/5_2_about.mp4" },
      { kind: "image", src: "/assets/5_3_about.JPG" },
      { kind: "image", src: "/assets/5_4_about.JPG" },
    ],
    [],
  );

  const title = "A full creative crew for premium content";
  const description = (
    <>
      <p>
        We deliver exceptional{" "}
        <span className="font-semibold text-[#ff2c6b]">
          Photography, Videography, Makeup, Hairstyling, and Outfit Styling
        </span>{" "}
        designed to elevate your brand’s visual identity.
      </p>
      <p className="mt-6">
        Every detail is curated with precision—from lighting and composition to styling and presentation—
        creating refined, high-impact visuals that reflect sophistication and class.
      </p>
    </>
  );

  const frameClassName = "aspect-square w-[72%]";
  const x1 = [-20, 22, -10, 26];
  const x2 = [18, -14, 22, -10];
  const x4 = [-18, 14, -8, 18];
  const x5 = [20, -16, 12, -10];

  return (
    <section
      id="about"
      ref={sectionRef}
      className="scroll-mt-28 border-t border-black/[0.06] bg-[#fbfbfc] px-6 py-24 overflow-hidden text-zinc-900 sm:scroll-mt-32 sm:px-10 md:px-12"
      aria-label="About"
    >
      <div className="mx-auto max-w-[1400px]">
        <div className="relative" style={{ height: trackHeight }}>
          <div className="sticky top-0" style={{ height: trackHeight }}>
            <div className="grid h-full grid-cols-7 items-start gap-x-8">
              <div className="col-span-1 hidden lg:flex">
                <MediaColumn
                  items={col1}
                  progress={scrollYProgress}
                  y={fastY}
                  startGap={125}
                  xOffsets={x1}
                  speed="fast"
                  frameClassName={frameClassName}
                />
              </div>

              <div className="col-span-1 hidden lg:flex">
                <MediaColumn
                  items={col2}
                  progress={scrollYProgress}
                  y={slowY}
                  startGap={0}
                  xOffsets={x2}
                  speed="slow"
                  frameClassName={frameClassName}
                />
              </div>

              <div className="col-span-3 hidden lg:flex">
                <motion.div style={{ y: contentY, willChange: "transform" }}>
                  <AboutContent title={title} description={description} />
                </motion.div>
              </div>

              <div className="col-span-1 hidden lg:flex">
                <MediaColumn
                  items={col4}
                  progress={scrollYProgress}
                  y={slowY}
                  startGap={0}
                  xOffsets={x4}
                  speed="slow"
                  frameClassName={frameClassName}
                />
              </div>

              <div className="col-span-1 hidden lg:flex">
                <MediaColumn
                  items={col5}
                  progress={scrollYProgress}
                  y={fastY}
                  startGap={125}
                  xOffsets={x5}
                  speed="fast"
                  frameClassName={frameClassName}
                />
              </div>

              {/* Mobile fallback */}
              <div className="col-span-full flex flex-col gap-6 lg:hidden">
                <AboutContent title={title} description={description} />
                <div className="grid grid-cols-2 gap-4">
                  {[...col1, ...col2].slice(0, 4).map((m, idx) => (
                    <MediaFrame key={`l-${idx}`} media={m} className="aspect-square w-full" />
                  ))}
                  {[...col4, ...col5].slice(0, 4).map((m, idx) => (
                    <MediaFrame key={`r-${idx}`} media={m} className="aspect-square w-full" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

