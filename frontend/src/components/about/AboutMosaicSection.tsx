"use client";

import type { ReactNode } from "react";
import { useMemo, useRef } from "react";
import type { MotionValue } from "framer-motion";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

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
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
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

function ColumnStack({
  items,
  y,
  offsets,
  parallaxAbs,
  downShift = 0,
  className = "",
}: {
  items: AboutMedia[];
  y: MotionValue<number>;
  offsets: { extraTop: number; x: number; scale?: number }[];
  parallaxAbs: number;
  downShift?: number;
  className?: string;
}) {
  return (
    <motion.div style={{ y, marginTop: downShift }} className={className}>
      <div className="flex flex-col">
        {items.map((media, idx) => {
          const o = offsets[idx] ?? { extraTop: 0, x: 0, scale: 1 };
          return (
            <ZigZagTile
              key={idx}
              media={media}
              y={y}
              idx={idx}
              parallaxAbs={parallaxAbs}
              extraTop={o.extraTop}
              x={o.x}
              baseScale={o.scale ?? 1}
            />
          );
        })}
      </div>
    </motion.div>
  );
}

function ZigZagTile({
  media,
  y,
  idx,
  parallaxAbs,
  extraTop,
  x,
  baseScale = 1,
}: {
  media: AboutMedia;
  y: MotionValue<number>;
  idx: number;
  parallaxAbs: number;
  extraTop: number;
  x: number;
  baseScale?: number;
}) {
  const dynamicScale = useTransform(
    y,
    [-parallaxAbs, parallaxAbs],
    [baseScale - 0.08, baseScale + 0.12],
  );

  return (
    <motion.div
      className="will-change-transform"
      style={{
        marginTop: idx === 0 ? 0 : 200,
        x,
        scale: dynamicScale,
      }}
    >
      <MediaFrame media={media} className="mx-auto aspect-square w-[58%]" />
    </motion.div>
  );
}

function CenterColumn({
  heading,
  body,
}: {
  heading: string;
  body: ReactNode;
}) {
  return (
    <div className="sticky top-[7.25rem]">
      <div className="flex w-full items-center justify-center">
        <div className="max-w-[34rem] text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-[#ff2c6b]">
            About
          </p>
          <h2 className="mt-4 text-balance font-[family-name:var(--font-display)] text-[clamp(1.6rem,2.15vw,2.1rem)] font-normal leading-[1.18] tracking-[-0.02em] text-zinc-900">
            {heading}
          </h2>
          <p className="mt-6 whitespace-pre-line text-pretty text-[17px] leading-relaxed text-zinc-600 sm:text-[18px]">
            {body}
          </p>
          <div
            className="mx-auto mt-9 h-px w-24 bg-gradient-to-r from-transparent via-zinc-300/70 to-transparent"
            aria-hidden
          />
        </div>
      </div>
    </div>
  );
}

/**
 * Waabi-like 5-column about mosaic.
 * - Center column is sticky during section scroll.
 * - Columns 1&5 move faster; 2&4 move slower.
 *
 * Media paths expected under `public/assets/`:
 * - 1_1_about.* ... 5_4_about.*
 */
export function AboutMosaicSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Parallax distances tuned to feel like the reference spacing.
  const fast = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [150, -150]);
  const slow = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [90, -90]);

  const leftCol1 = useMemo<AboutMedia[]>(
    () => [
      { kind: "image", src: "/assets/1_1_about.JPG" },
      { kind: "video", src: "/assets/1_2_about.mp4" },
      { kind: "image", src: "/assets/1_3_about.JPG" },
      { kind: "image", src: "/assets/1_4_about.JPG" },
    ],
    [],
  );

  const leftCol2 = useMemo<AboutMedia[]>(
    () => [
      { kind: "image", src: "/assets/2_1_about.JPG" },
      { kind: "video", src: "/assets/2_2_about.mp4" },
      { kind: "image", src: "/assets/2_3_about.JPG" },
      { kind: "image", src: "/assets/2_4_about.JPG" },
    ],
    [],
  );

  const rightCol4 = useMemo<AboutMedia[]>(
    () => [
      { kind: "image", src: "/assets/4_1_about.JPG" },
      { kind: "image", src: "/assets/4_2_about.JPG" },
      { kind: "video", src: "/assets/4_3_about.mp4" },
      { kind: "image", src: "/assets/4_4_about.JPG" },
    ],
    [],
  );

  const rightCol5 = useMemo<AboutMedia[]>(
    () => [
      { kind: "image", src: "/assets/5_1_about.JPG" },
      { kind: "video", src: "/assets/5_2_about.mp4" },
      { kind: "image", src: "/assets/5_3_about.JPG" },
      { kind: "image", src: "/assets/5_4_about.JPG" },
    ],
    [],
  );

  const heading = "A full creative crew for premium content";
  const body = (
    <>
      We deliver exceptional{" "}
      <span className="font-semibold text-[#ff2c6b] text-[1.06em]">
        Photography, Videography, Makeup, Hairstyling,
      </span>{" "}
      and{" "}
      <span className="font-semibold text-[#ff2c6b] text-[1.06em]">
        Outfit Styling
      </span>{" "}
      designed to elevate your brand’s visual identity.
      {"\n\n"}
      Every detail is curated with precision—from lighting and composition to
      styling and presentation—creating refined, high-impact visuals that
      reflect sophistication and class.
      {"\n\n"}
      {/* (Removed final call-to-action line per request) */}
    </>
  );

  return (
    <section
      id="about"
      ref={sectionRef}
      className="scroll-mt-28 border-t border-black/[0.06] bg-[#fbfbfc] px-6 py-24 text-zinc-900 overflow-hidden sm:scroll-mt-32 sm:px-10 md:px-12"
      aria-label="About"
    >
      {/* Tall track so the center stays constant while you scroll */}
      <div className="mx-auto max-w-[1400px]">
        <div className="relative" style={{ height: "220vh" }}>
          <div className="sticky top-0 flex h-svh items-start">
            <div className="w-full">
              <div className="grid grid-cols-1 gap-10 lg:grid-cols-5 lg:gap-8">
                {/* Left side (2 columns) */}
                <div className="hidden lg:block">
                  <ColumnStack
                    items={leftCol1}
                    y={fast}
                    parallaxAbs={150}
                    downShift={0}
                    offsets={[
                      { extraTop: 0, x: -16, scale: 1.0 },
                      { extraTop: 18, x: 22, scale: 0.95 },
                      { extraTop: 34, x: -10, scale: 1.03 },
                      { extraTop: 56, x: 18, scale: 0.92 },
                    ]}
                  />
                </div>
                <div className="hidden lg:block">
                  <ColumnStack
                    items={leftCol2}
                    y={slow}
                    parallaxAbs={90}
                    downShift={0}
                    offsets={[
                      { extraTop: 0, x: 20, scale: 0.98 },
                      { extraTop: 14, x: -18, scale: 0.94 },
                      { extraTop: 40, x: 10, scale: 1.01 },
                      { extraTop: 66, x: -12, scale: 0.93 },
                    ]}
                  />
                </div>

                {/* Center sticky column */}
                <div className="lg:col-span-1">
                  <CenterColumn
                    heading={heading}
                    body={body}
                  />
                </div>

                {/* Right side (2 columns) */}
                <div className="hidden lg:block">
                  <ColumnStack
                    items={rightCol4}
                    y={slow}
                    parallaxAbs={90}
                    downShift={0}
                    offsets={[
                      { extraTop: 0, x: -20, scale: 1.02 },
                      { extraTop: 20, x: 16, scale: 0.95 },
                      { extraTop: 36, x: -8, scale: 1.0 },
                      { extraTop: 64, x: 14, scale: 0.91 },
                    ]}
                  />
                </div>
                <div className="hidden lg:block">
                  <ColumnStack
                    items={rightCol5}
                    y={fast}
                    parallaxAbs={150}
                    downShift={0}
                    offsets={[
                      { extraTop: 0, x: 16, scale: 0.96 },
                      { extraTop: 12, x: -22, scale: 1.02 },
                      { extraTop: 30, x: 12, scale: 0.94 },
                      { extraTop: 58, x: -10, scale: 1.01 },
                    ]}
                  />
                </div>
              </div>

              {/* Mobile/tablet fallback: keep content centered first, then a simple grid */}
              <div className="mt-12 grid grid-cols-2 gap-4 lg:hidden">
                {[...leftCol1, ...leftCol2, ...rightCol4, ...rightCol5]
                  .slice(0, 8)
                  .map((media, idx) => (
                    <MediaFrame key={idx} media={media} className="aspect-square w-full" />
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

