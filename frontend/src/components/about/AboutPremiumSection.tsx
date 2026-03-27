"use client";

import { type ReactNode, useMemo, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useMotionValueEvent,
  useScroll,
  type MotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { SERVICE_VIDEOS } from "@/lib/cloudinaryAssets";

type VideoSpec = {
  label: string;
  src: string;
  parallaxVariant: "left" | "right";
  offsetDesktopY: number;
  offsetDesktopY2: number;
};

function useTiltMotion(reduceMotion: boolean) {
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const springRx = useSpring(tilt.rx, { stiffness: 140, damping: 18, mass: 0.6 });
  const springRy = useSpring(tilt.ry, { stiffness: 140, damping: 18, mass: 0.6 });

  return {
    tiltX: springRx,
    tiltY: springRy,
    onMouseMove: (e: React.MouseEvent<HTMLDivElement>) => {
      if (reduceMotion) return;
      const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width; // 0..1
      const py = (e.clientY - rect.top) / rect.height; // 0..1
      const ry = (px - 0.5) * 10;
      const rx = (0.5 - py) * 7;
      setTilt({ rx, ry });
    },
    onMouseLeave: () => setTilt({ rx: 0, ry: 0 }),
  };
}

function VideoCard({
  video,
  parallaxY,
  indexDelay,
  isActive,
  fadeCutoffPx,
}: {
  video: VideoSpec;
  parallaxY: MotionValue<number>;
  indexDelay: number;
  isActive?: boolean;
  fadeCutoffPx: number;
}) {
  const reduceMotion = useReducedMotion();
  const { tiltX, tiltY, onMouseMove, onMouseLeave } = useTiltMotion(
    reduceMotion ?? false,
  );

  return (
    <motion.div
      className="relative h-full w-full"
      style={{ y: parallaxY }}
      aria-label={`${video.label} video card`}
      initial={false}
    >
      <motion.div
        initial={
          reduceMotion
            ? { opacity: 1, y: 0, rotateZ: 0 }
            : {
                opacity: 0,
                y: 60,
                rotateZ: indexDelay % 2 === 0 ? 3 : -3,
              }
        }
        whileInView={
          reduceMotion
            ? { opacity: 1, y: 0, rotateZ: 0 }
            : { opacity: 1, y: 0, rotateZ: 0 }
        }
        viewport={{ once: true, amount: 0.25 }}
        transition={{
          duration: 0.75,
          ease: [0.22, 1, 0.36, 1],
          delay: indexDelay * 0.15,
        }}
        whileHover={{
          scale: 1.03,
          boxShadow:
            isActive
              ? "0 0 0 1px rgba(0,0,0,0.18), 0 34px 90px -60px rgba(0,0,0,0.35)"
              : "0 0 0 1px rgba(0,0,0,0.12), 0 34px 90px -60px rgba(0,0,0,0.25)",
        }}
        style={{
          transformStyle: "preserve-3d",
          rotateX: tiltX,
          rotateY: tiltY,
        }}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        className="relative h-full w-full"
      >
        {/* Gradient-border wrapper */}
        <div
          className={[
            "relative h-full w-full rounded-[22px] p-[1px] bg-gradient-to-br from-black/10 via-white/55 to-black/5",
            isActive ? "shadow-[0_0_0_1px_rgba(0,0,0,0.10)]" : "",
          ].join(" ")}
        >
          <div className="relative h-full w-full overflow-hidden rounded-[21px] bg-[#0b0b0f]">
              <video
                className="absolute left-0 top-0 w-full object-cover"
              src={video.src}
              muted
              playsInline
              loop
              autoPlay={!reduceMotion}
                style={{ height: `calc(100% - ${fadeCutoffPx}px)` }}
              preload="metadata"
            />

            {/* Bottom fade overlay */}
            <div
              className="absolute left-0 top-0 right-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"
              style={{ height: `calc(100% - ${fadeCutoffPx}px)` }}
            />

            {/* Title moved to bottom empty area */}

            {/* Active highlight glow */}
            {isActive ? (
              <div
                aria-hidden
                className="absolute left-0 top-0 right-0 h-[calc(100%-150px)] rounded-[21px] bg-gradient-to-br from-black/10 via-white/[0.05] to-transparent"
              />
            ) : null}

            {/* Bottom empty-area title */}
            <div
              className="absolute left-0 right-0 bottom-0 z-[2] flex items-center justify-center pointer-events-none"
              style={{ height: `${fadeCutoffPx}px` }}
            >
              <div className="px-5 text-center">
                <div className="text-[15px] font-semibold tracking-[0.22em] text-white/85">
                  {video.label}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function CenterText({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex w-full flex-col items-center justify-center text-center">
      {/* Floating, very light center glow */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -inset-10 rounded-[48px] bg-gradient-to-br from-[#ff2c6b]/18 via-white/15 to-transparent blur-3xl"
        initial={{ opacity: 0.35, y: 8 }}
        whileInView={{ opacity: 0.65, y: 0 }}
        transition={{ duration: 1.1, ease: "easeInOut" }}
        viewport={{ once: true, amount: 0.35 }}
      />
      {children}
    </div>
  );
}

export function AboutPremiumSection({ id = "about" }: { id?: string }) {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Parallax: left moves slower, right moves faster.
  const leftParallax = useTransform(scrollYProgress, [0, 1], [0, -18]);
  const leftParallax2 = useTransform(scrollYProgress, [0, 1], [10, -8]);
  const rightParallax = useTransform(scrollYProgress, [0, 1], [0, -30]);
  const rightParallax2 = useTransform(scrollYProgress, [0, 1], [14, -10]);

  const [activeIndex, setActiveIndex] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (reduceMotion) return;
    const frameCount = 4;
    const idx = Math.round(v * (frameCount - 1));
    const next = Math.max(0, Math.min(frameCount - 1, idx));
    setActiveIndex((prev) => (prev === next ? prev : next));
  });

  const leftVideos = useMemo<VideoSpec[]>(
    () => [
      {
        label: "Fashion Photography",
        src: SERVICE_VIDEOS.fashionPhotography,
        parallaxVariant: "left",
        offsetDesktopY: 12,
        offsetDesktopY2: -6,
      },
      {
        label: "Social Media Content Creation",
        src: SERVICE_VIDEOS.socialMediaContent,
        parallaxVariant: "left",
        offsetDesktopY: -8,
        offsetDesktopY2: 10,
      },
    ],
    [],
  );

  const rightVideos = useMemo<VideoSpec[]>(
    () => [
      {
        label: "Product Photography",
        src: SERVICE_VIDEOS.productPhotography,
        parallaxVariant: "right",
        offsetDesktopY: -6,
        offsetDesktopY2: 10,
      },
      {
        label: "Creative Brand Campaigns",
        src: SERVICE_VIDEOS.creativeBrandCampaigns,
        parallaxVariant: "right",
        offsetDesktopY: 14,
        offsetDesktopY2: -10,
      },
    ],
    [],
  );

  const combinedVideos = [...leftVideos, ...rightVideos];

  return (
    <motion.section
      id={id}
      ref={sectionRef}
      className="relative scroll-mt-28 bg-[#0b0b0f] px-6 py-[140px]"
      aria-label="About"
    >
      {/* Subtle animated gradient background */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundSize: "220% 220%",
          backgroundImage:
            "radial-gradient(900px 480px at 50% 0%, rgba(255,44,107,0.10), transparent 55%)",
        }}
        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
        transition={{ duration: 12, ease: "easeInOut", repeat: Infinity }}
      />

      <div className="relative mx-auto max-w-[1400px]">
        {/* Desktop */}
        <div className="hidden lg:grid lg:grid-cols-3 lg:gap-12">
          <div className="flex flex-col gap-8">
            <div className="h-[310px]">
              <VideoCard
                video={leftVideos[0] as VideoSpec}
                parallaxY={leftParallax2}
                indexDelay={0}
                isActive={activeIndex === 0}
                fadeCutoffPx={70}
              />
            </div>
            <div className="h-[310px] translate-y-[-14px]">
              <VideoCard
                video={leftVideos[1] as VideoSpec}
                parallaxY={leftParallax}
                indexDelay={1}
                isActive={activeIndex === 1}
                fadeCutoffPx={120}
              />
            </div>
          </div>

          <div className="px-2">
            <CenterText>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.85, ease: "easeInOut" }}
                className="text-[clamp(2.8rem,4.6vw,4rem)] font-thin leading-[1.04] tracking-[-0.03em] text-white"
              >
                A full creative crew for premium content
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.85, ease: "easeInOut", delay: 0.12 }}
                className="mt-6 max-w-[56ch] text-[16px] leading-relaxed text-zinc-200 sm:text-[18px]"
              >
                We deliver exceptional{" "}
                <motion.span
                  initial={{ opacity: 0.45, filter: "saturate(0.7) brightness(0.95)" }}
                  whileInView={{ opacity: 1, filter: "saturate(1.1) brightness(1)" }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.75, ease: "easeInOut", delay: 0.05 }}
                  className="inline-block bg-gradient-to-r from-[#ff2c6b]/90 via-[#ff2c6b]/60 to-[#ff2c6b]/90 bg-clip-text text-transparent"
                >
                  Photography, Videography, Makeup, Hairstyling, and Outfit Styling
                </motion.span>{" "}
                designed to elevate your brand’s visual identity.
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.85, ease: "easeInOut", delay: 0.18 }}
                className="mt-6 max-w-[62ch] text-[16px] leading-relaxed text-zinc-400 sm:text-[18px]"
              >
                Every detail is curated with precision—from lighting and composition to styling and
                presentation—creating refined, high-impact visuals that reflect sophistication and class.
              </motion.p>
            </CenterText>
          </div>

          <div className="flex flex-col gap-8">
            <div className="h-[310px] translate-y-[-14px]">
              <VideoCard
                video={rightVideos[0] as VideoSpec}
                parallaxY={rightParallax}
                indexDelay={2}
                isActive={activeIndex === 2}
                fadeCutoffPx={90}
              />
            </div>
            <div className="h-[310px]">
              <VideoCard
                video={rightVideos[1] as VideoSpec}
                parallaxY={rightParallax2}
                indexDelay={3}
                isActive={activeIndex === 3}
                fadeCutoffPx={140}
              />
            </div>
          </div>
        </div>

        {/* Tablet (2 columns): text + stacked videos */}
        <div className="hidden md:grid lg:hidden md:grid-cols-2 md:gap-12">
          <div className="px-2">
            <CenterText>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.85, ease: "easeInOut" }}
                className="text-[clamp(2.6rem,4.2vw,3.2rem)] font-thin leading-[1.04] tracking-[-0.03em] text-white"
              >
                A full creative crew for premium content
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.85, ease: "easeInOut", delay: 0.12 }}
                className="mt-6 max-w-[56ch] text-[16px] leading-relaxed text-zinc-200 sm:text-[18px]"
              >
                We deliver exceptional{" "}
                <span className="bg-gradient-to-r from-[#ff2c6b]/90 via-[#ff2c6b]/60 to-[#ff2c6b]/90 bg-clip-text text-transparent">
                  Photography, Videography, Makeup, Hairstyling, and Outfit Styling
                </span>{" "}
                designed to elevate your brand’s visual identity.
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.85, ease: "easeInOut", delay: 0.18 }}
                className="mt-6 max-w-[62ch] text-[16px] leading-relaxed text-zinc-400 sm:text-[18px]"
              >
                Every detail is curated with precision—from lighting and composition to styling and presentation—
                creating refined, high-impact visuals that reflect sophistication and class.
              </motion.p>
            </CenterText>
          </div>

          <div className="flex flex-col gap-8">
            {combinedVideos.map((v, i) => {
              const par =
                v.parallaxVariant === "left" ? (i % 2 === 0 ? leftParallax2 : leftParallax) : i % 2 === 0 ? rightParallax : rightParallax2;
              return (
                <div key={v.label} className="h-[260px]">
                  <VideoCard
                    video={v}
                    parallaxY={par}
                    indexDelay={i}
                    isActive={activeIndex === i}
                    fadeCutoffPx={i === 0 ? 60 : i === 1 ? 105 : i === 2 ? 80 : 125}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile (single column): videos → text → videos */}
        <div className="flex flex-col gap-10 md:hidden">
          <div className="flex flex-col gap-8">
            <div className="h-[250px]">
              <VideoCard
                video={leftVideos[0] as VideoSpec}
                parallaxY={leftParallax2}
                indexDelay={0}
                isActive={activeIndex === 0}
                fadeCutoffPx={55}
              />
            </div>
            <div className="h-[250px]">
              <VideoCard
                video={leftVideos[1] as VideoSpec}
                parallaxY={leftParallax}
                indexDelay={1}
                isActive={activeIndex === 1}
                fadeCutoffPx={95}
              />
            </div>
          </div>

          <CenterText>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.85, ease: "easeInOut" }}
              className="text-[clamp(2.4rem,6vw,3rem)] font-thin leading-[1.04] tracking-[-0.03em] text-white"
            >
              A full creative crew for premium content
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.85, ease: "easeInOut", delay: 0.12 }}
              className="mt-6 max-w-[56ch] text-[16px] leading-relaxed text-zinc-200 sm:text-[18px]"
            >
              We deliver exceptional{" "}
              <span className="bg-gradient-to-r from-[#ff2c6b]/90 via-[#ff2c6b]/60 to-[#ff2c6b]/90 bg-clip-text text-transparent">
                Photography, Videography, Makeup, Hairstyling, and Outfit Styling
              </span>{" "}
              designed to elevate your brand’s visual identity.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.85, ease: "easeInOut", delay: 0.18 }}
              className="mt-6 max-w-[62ch] text-[16px] leading-relaxed text-zinc-400 sm:text-[18px]"
            >
              Every detail is curated with precision—from lighting and composition to styling and presentation—
              creating refined, high-impact visuals that reflect sophistication and class.
            </motion.p>
          </CenterText>

          <div className="flex flex-col gap-8">
            <div className="h-[250px]">
              <VideoCard
                video={rightVideos[0] as VideoSpec}
                parallaxY={rightParallax}
                indexDelay={2}
                isActive={activeIndex === 2}
                fadeCutoffPx={75}
              />
            </div>
            <div className="h-[250px]">
              <VideoCard
                video={rightVideos[1] as VideoSpec}
                parallaxY={rightParallax2}
                indexDelay={3}
                isActive={activeIndex === 3}
                fadeCutoffPx={115}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

