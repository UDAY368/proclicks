"use client";

import { type ReactNode, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
} from "framer-motion";
import { SERVICE_VIDEOS_VIDEO_GRID_ORDER } from "@/lib/cloudinaryAssets";

function VideoFrame({
  title,
  src,
  align = "start",
  isActive = false,
}: {
  title: string;
  src: string;
  align?: "start" | "end";
  isActive?: boolean;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-zinc-900/5 shadow-[0_18px_50px_-22px_rgba(0,0,0,0.18)] ring-1 ring-black/[0.06] ${
        align === "end" ? "self-end" : "self-start"
      } h-full w-full ${
        isActive ? "ring-[#ff2c6b]/25 shadow-[0_0_0_1px_rgba(255,44,107,0.30),0_22px_70px_-50px_rgba(255,44,107,0.55)]" : ""
      }`}
    >
      <video
        className="h-full w-full object-cover"
        src={src}
        muted
        playsInline
        loop
        autoPlay
        preload="metadata"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

      <div className="absolute left-4 top-4">
        <p className="rounded-full bg-white/90 px-3 py-1 text-[12px] font-semibold tracking-wide text-zinc-900 shadow-sm">
          {title}
        </p>
      </div>
    </div>
  );
}

function AboutTileMotion({
  children,
  index,
  isActive,
}: {
  children: ReactNode;
  index: number;
  isActive: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const tiltXS = useSpring(tiltX, { stiffness: 140, damping: 18, mass: 0.6 });
  const tiltYS = useSpring(tiltY, { stiffness: 140, damping: 18, mass: 0.6 });

  return (
    <motion.div
      initial={
        reduceMotion
          ? { opacity: 1, y: 0, rotateZ: 0 }
          : { opacity: 0, y: 60, rotateZ: index % 2 === 0 ? 3 : -3 }
      }
      whileInView={reduceMotion ? { opacity: 1, y: 0, rotateZ: 0 } : { opacity: 1, y: 0, rotateZ: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{
        duration: 0.75,
        ease: [0.22, 1, 0.36, 1],
        delay: index * 0.15,
      }}
      whileHover={{
        scale: 1.06,
        boxShadow:
          "0 0 0 1px rgba(255,44,107,0.35), 0 30px 90px -60px rgba(255,44,107,0.70)",
      }}
      style={{
        transformStyle: "preserve-3d",
        transformPerspective: 900,
        rotateX: tiltXS,
        rotateY: tiltYS,
      }}
      onMouseMove={(e) => {
        if (reduceMotion) return;
        const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width; // 0..1
        const py = (e.clientY - rect.top) / rect.height; // 0..1
        const ry = (px - 0.5) * 10;
        const rx = (0.5 - py) * 8;
        tiltX.set(rx);
        tiltY.set(ry);
      }}
      onMouseLeave={() => {
        tiltX.set(0);
        tiltY.set(0);
      }}
      className={[
        "will-change-transform",
        isActive ? "filter saturate-110" : "filter saturate-100",
      ].join(" ")}
    >
      {children}
    </motion.div>
  );
}

export function AboutVideoGridSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const [activeFrameIndex, setActiveFrameIndex] = useState(0);

  // Content moves with the scroll; side videos stay visually stable.
  const contentY = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion ? [0, 0] : [80, -80],
  );

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (reduceMotion) return;
    const frameCount = 4;
    const idx = Math.round(v * (frameCount - 1));
    const next = Math.max(0, Math.min(frameCount - 1, idx));
    setActiveFrameIndex((prev) => (prev === next ? prev : next));
  });

  return (
    <section
      id="about"
      ref={sectionRef}
      className="scroll-mt-28 border-t border-black/[0.06] bg-[#fbfbfc] px-6 py-24"
      aria-label="About"
    >
      <div className="mx-auto max-w-[1400px]">
        {/* Reduced scroll container height to remove extra whitespace after the sticky grid */}
        <div className="relative" style={{ height: "130vh" }}>
          <div className="sticky top-0 h-svh">
            <div className="grid h-full grid-cols-3 gap-8">
              {/* Left column */}
              <div className="flex h-full flex-col justify-between">
              <div className="h-[44%]">
                <AboutTileMotion index={0} isActive={activeFrameIndex === 0}>
                  <VideoFrame
                    title="Photography"
                    src={SERVICE_VIDEOS_VIDEO_GRID_ORDER[0]}
                    align="start"
                    isActive={activeFrameIndex === 0}
                  />
                </AboutTileMotion>
                </div>
              <div className="h-[44%]">
                <AboutTileMotion index={1} isActive={activeFrameIndex === 1}>
                  <VideoFrame
                    title="Hairstyling"
                    src={SERVICE_VIDEOS_VIDEO_GRID_ORDER[1]}
                    align="end"
                    isActive={activeFrameIndex === 1}
                  />
                </AboutTileMotion>
                </div>
              </div>

              {/* Center content */}
              <motion.div
                className="flex h-full items-center justify-center"
                style={{ y: contentY }}
              >
                <div className="max-w-[36rem] text-center">
                  <h2 className="text-balance font-[family-name:var(--font-display)] text-[clamp(1.6rem,2.2vw,2.3rem)] font-normal leading-[1.18] tracking-[-0.02em] text-zinc-900">
                    A full creative crew for premium content
                  </h2>
                  <p className="mt-5 text-[16px] leading-relaxed text-zinc-600 sm:text-[18px]">
                    We deliver exceptional{" "}
                    <span className="font-semibold text-[#ff2c6b]">
                      Photography, Videography, Makeup, Hairstyling, and Outfit Styling
                    </span>{" "}
                    designed to elevate your brand’s visual identity.
                  </p>
                  <p className="mt-6 text-[16px] leading-relaxed text-zinc-600 sm:text-[18px]">
                    Every detail is curated with precision—from lighting and composition to styling and
                    presentation—creating refined, high-impact visuals that reflect sophistication and class.
                  </p>
                </div>
              </motion.div>

              {/* Right column */}
              <div className="flex h-full flex-col justify-between">
                <div className="h-[44%]">
                  <AboutTileMotion index={2} isActive={activeFrameIndex === 2}>
                    <VideoFrame
                      title="Videography"
                      src={SERVICE_VIDEOS_VIDEO_GRID_ORDER[2]}
                      align="start"
                      isActive={activeFrameIndex === 2}
                    />
                  </AboutTileMotion>
                </div>
                <div className="h-[44%]">
                  <AboutTileMotion index={3} isActive={activeFrameIndex === 3}>
                    <VideoFrame
                      title="Makeup"
                      src={SERVICE_VIDEOS_VIDEO_GRID_ORDER[3]}
                      align="end"
                      isActive={activeFrameIndex === 3}
                    />
                  </AboutTileMotion>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

