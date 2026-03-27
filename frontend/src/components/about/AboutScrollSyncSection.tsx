"use client";

import { useMemo, useRef, useState } from "react";
import {
  motion,
  type MotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { SERVICE_VIDEOS_LEGACY_ORDER } from "@/lib/cloudinaryAssets";

type Video = {
  step: 1 | 2 | 3 | 4;
  keyword: "Photography" | "Videography" | "Makeup" | "Hairstyling";
  src: string;
};

function clamp01(v: number) {
  return Math.min(1, Math.max(0, v));
}

function keywordParts(activeKeyword: Video["keyword"]) {
  const items: Array<{ key: string; text: string; active: boolean }> = [];

  // Paragraph 1 includes commas; we render each keyword span individually for highlight.
  const raw = [
    { k: "Photography", text: "Photography" },
    { k: "Videography", text: "Videography" },
    { k: "Makeup", text: "Makeup" },
    { k: "Hairstyling", text: "Hairstyling" },
  ] as const;

  // Photography, Videography, Makeup, Hairstyling, and Outfit Styling
  items.push({
    key: "p",
    text: "We deliver exceptional ",
    active: false,
  });
  raw.forEach((it, idx) => {
    const active = it.k === activeKeyword;
    const comma = idx < raw.length - 1 ? ", " : ", and ";
    items.push({
      key: `kw-${it.k}`,
      text: it.text + comma,
      active,
    });
  });
  items.push({
    key: "outfit",
    text: "Outfit Styling ",
    active: false,
  });
  items.push({
    key: "rest",
    text:
      "designed to elevate your brand’s visual identity.",
    active: false,
  });

  return items;
}

function HighlightKeyword({
  text,
  active,
}: {
  text: string;
  active: boolean;
}) {
  return (
    <motion.span
      initial={false}
      animate={{
        color: active ? "#000" : "#888",
        scale: active ? 1.05 : 1,
        textShadow: active ? "0 0 18px rgba(255,44,107,0.20)" : "none",
      }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="relative inline-block font-semibold"
    >
      {text}
      {/* Underline/glow animation */}
      <motion.span
        aria-hidden
        className="absolute left-0 -bottom-1 h-[2px] w-full origin-left rounded-full bg-[#ff2c6b]"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: active ? 1 : 0, opacity: active ? 1 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      />
    </motion.span>
  );
}

function VideoStack({
  videos,
  t,
}: {
  videos: Video[];
  t: MotionValue<number>;
}) {
  const reduceMotion = useReducedMotion();

  // Smooth crossfade based on `t` (0..3). Each video fades in/out around its step.
  const opacity0 = useTransform(t, (v) => clamp01(1 - Math.abs(v - 0) / 1.0));
  const opacity1 = useTransform(t, (v) => clamp01(1 - Math.abs(v - 1) / 1.0));
  const opacity2 = useTransform(t, (v) => clamp01(1 - Math.abs(v - 2) / 1.0));
  const opacity3 = useTransform(t, (v) => clamp01(1 - Math.abs(v - 3) / 1.0));

  const scale0 = useTransform(t, (v) => 1 + 0.05 * clamp01(1 - Math.abs(v - 0) / 0.85));
  const scale1 = useTransform(t, (v) => 1 + 0.05 * clamp01(1 - Math.abs(v - 1) / 0.85));
  const scale2 = useTransform(t, (v) => 1 + 0.05 * clamp01(1 - Math.abs(v - 2) / 0.85));
  const scale3 = useTransform(t, (v) => 1 + 0.05 * clamp01(1 - Math.abs(v - 3) / 0.85));

  // Using stacked layers ensures perfect sync with text highlight.
  return (
    <div className="relative h-full w-full overflow-hidden rounded-[24px] border border-black/10 bg-white shadow-[0_30px_80px_-45px_rgba(0,0,0,0.25)]">
      {/* Soft reflection */}
      {!reduceMotion ? (
        <motion.div
          aria-hidden
          className="absolute inset-0 opacity-40"
          style={{
            background:
              "linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.55) 45%, transparent 70%)",
            filter: "blur(14px)",
            mixBlendMode: "soft-light",
          }}
          animate={{ x: ["-60%", "60%"] }}
          transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
        />
      ) : null}

      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent" />

      {videos.map((v, idx) => {
        const opacity =
          idx === 0 ? opacity0 : idx === 1 ? opacity1 : idx === 2 ? opacity2 : opacity3;
        const scale =
          idx === 0 ? scale0 : idx === 1 ? scale1 : idx === 2 ? scale2 : scale3;
        return (
          <motion.video
            key={v.keyword}
            muted
            playsInline
            loop
            preload="metadata"
            autoPlay={!reduceMotion}
            src={v.src}
            className="absolute inset-0 h-full w-full object-cover"
            style={{ opacity, scale }}
          />
        );
      })}
    </div>
  );
}

export function AboutScrollSyncSection({
  id,
}: {
  id: string;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  const videos = useMemo<Video[]>(
    () => [
      {
        step: 1,
        keyword: "Photography",
        src: SERVICE_VIDEOS_LEGACY_ORDER[0],
      },
      {
        step: 2,
        keyword: "Videography",
        src: SERVICE_VIDEOS_LEGACY_ORDER[1],
      },
      {
        step: 3,
        keyword: "Makeup",
        src: SERVICE_VIDEOS_LEGACY_ORDER[2],
      },
      {
        step: 4,
        keyword: "Hairstyling",
        src: SERVICE_VIDEOS_LEGACY_ORDER[3],
      },
    ],
    [],
  );

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // t: 0..3 across the full scroll story
  const t = useTransform(scrollYProgress, [0, 1], [0, 3]);
  const [activeStep, setActiveStep] = useState(1);

  useMotionValueEvent(t, "change", (v) => {
    if (reduceMotion) return;
    const next = Math.round(v) + 1; // 1..4
    setActiveStep((prev) => (prev === next ? prev : Math.max(1, Math.min(4, next))));
  });

  const activeKeyword = videos[activeStep - 1]?.keyword ?? "Photography";
  const parts = keywordParts(activeKeyword);

  const titleMotion = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.4 },
    transition: { duration: 0.8, ease: "easeInOut" as const },
  };

  // Depth micro shift on scroll: stronger on desktop right column
  const rightDepth = useTransform(scrollYProgress, [0, 1], [0, -18]);

  return (
    <motion.section
      id={id}
      ref={sectionRef}
      aria-label="About (Scroll Sync)"
      className="relative bg-white scroll-mt-28 px-6"
      style={{ height: "400vh" }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.9, ease: "easeInOut" as const }}
    >
      {/* Top padding content anchor */}
      <div className="mx-auto flex max-w-[1400px] flex-col lg:flex-row lg:gap-[72px] pt-[140px]">
        {/* LEFT: sticky video on desktop */}
        <div className="w-full lg:w-[560px]">
          <div className="relative lg:sticky lg:top-0 lg:h-screen">
            <div className="h-[520px] lg:h-[calc(100vh-80px)]">
              <VideoStack videos={videos} t={t} />
            </div>
          </div>
        </div>

        {/* RIGHT: scroll narrative */}
        <motion.div
          className="w-full lg:max-w-[640px] pb-[140px]"
          style={{ y: rightDepth }}
        >
          <motion.h2
            {...titleMotion}
            className="text-[clamp(2.6rem,4.6vw,4.2rem)] font-thin leading-[1.04] tracking-[-0.03em] text-zinc-900"
          >
            A full creative crew for premium content
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.75, ease: "easeInOut", delay: 0.12 }}
            className="mt-6 text-[16px] leading-relaxed text-[#888] sm:text-[18px]"
          >
            {parts.map((p) => (
              <span key={p.key}>
                {p.active ? (
                  <HighlightKeyword text={p.text} active={p.active} />
                ) : (
                  p.text
                )}
              </span>
            ))}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.75, ease: "easeInOut", delay: 0.18 }}
            className="mt-6 text-[16px] leading-relaxed text-[#666] sm:text-[18px]"
          >
            Every detail is curated with precision—from lighting and composition to styling and
            presentation—creating refined, high-impact visuals that reflect sophistication and
            class.
          </motion.p>

          {/* Step rail (subtle, aids the storytelling scroll) */}
          <div className="mt-10 flex flex-col gap-6">
            {videos.map((v, idx) => {
              const stepIndex = idx + 1;
              const active = stepIndex === activeStep;
              return (
                <motion.div
                  key={v.step}
                  initial={false}
                  animate={{ opacity: active ? 1 : 0.55 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="flex items-center gap-4"
                >
                  <div className="relative flex h-8 w-8 items-center justify-center">
                    <div className="absolute inset-0 rounded-full bg-[#ff2c6b]/10" />
                    <div
                      className={[
                        "relative text-[11px] font-semibold uppercase tracking-[0.2em]",
                        active ? "text-zinc-900" : "text-zinc-500",
                      ].join(" ")}
                    >
                      {String(stepIndex).padStart(2, "0")}
                    </div>
                  </div>
                  <div className="text-[14px] font-semibold">
                    <span className={active ? "text-zinc-900" : "text-[#888]"}>
                      {v.keyword}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}

