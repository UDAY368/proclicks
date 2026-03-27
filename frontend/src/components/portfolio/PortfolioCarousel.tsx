"use client";

import Image from "next/image";
import {
  animate,
  AnimatePresence,
  motion,
  useMotionValue,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { memo, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useCarouselPattern } from "@/hooks/useCarouselPattern";
import { PORTFOLIO_IMAGE_PATHS } from "./portfolioCarouselConfig";

const FRAME_SHADOW =
  "0 28px 90px rgba(0,0,0,0.82), 0 0 0 1px rgba(255,255,255,0.07), 0 0 72px rgba(255,255,255,0.04)";

const EASE_IN_OUT = "easeInOut" as const;

type SlotSpec = {
  /** x in px */
  x: number;
  /** y in px */
  y: number;
  scale: number;
  opacity: number;
  z: number;
};

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function mixSpec(a: SlotSpec, b: SlotSpec, t: number): SlotSpec {
  return {
    x: lerp(a.x, b.x, t),
    y: lerp(a.y, b.y, t),
    scale: lerp(a.scale, b.scale, t),
    opacity: lerp(a.opacity, b.opacity, t),
    z: Math.round(lerp(a.z, b.z, t)),
  };
}

function buildSlots(containerW: number, visible: 2 | 3 | 4): SlotSpec[] {
  // Left → right fractions, tuned to feel like stacked deck across full width.
  const xs =
    visible === 4
      ? [0.06, 0.25, 0.44, 0.63]
      : visible === 3
        ? [0.10, 0.40, 0.66]
        : [0.14, 0.62];

  const scales =
    visible === 4 ? [0.55, 0.7, 0.85, 1] : visible === 3 ? [0.7, 0.85, 1] : [0.85, 1];
  const opacities =
    visible === 4 ? [0.62, 0.74, 0.88, 1] : visible === 3 ? [0.74, 0.88, 1] : [0.88, 1];
  const ys = visible === 4 ? [36, 22, 10, 0] : visible === 3 ? [22, 10, 0] : [10, 0];

  return xs.map((xf, i) => ({
    x: containerW * xf,
    y: ys[i] ?? 0,
    scale: scales[i] ?? 1,
    opacity: opacities[i] ?? 1,
    z: 10 + i * 10,
  }));
}

type ConveyorCardProps = {
  /** Track slot index at progress=0 (1..visible+1) */
  posAt0: number;
  progress: MotionValue<number>;
  trackRef: React.MutableRefObject<SlotSpec[]>;
  cardW: number;
  cardH: number;
  src: string;
  alt: string;
  onOpen: (src: string, alt: string) => void;
};

const ConveyorCard = memo(function ConveyorCard({
  posAt0,
  progress,
  trackRef,
  cardW,
  cardH,
  src,
  alt,
  onOpen,
}: ConveyorCardProps) {
  const transform = useTransform(progress, (p) => {
    const t = Math.min(1, Math.max(0, p));
    const track = trackRef.current;
    const a = track[posAt0]!;
    const b = track[posAt0 - 1]!;
    const m = mixSpec(a, b, t);
    return `translate3d(${m.x}px, ${m.y}px, 0) scale(${m.scale})`;
  });

  const opacity = useTransform(progress, (p) => {
    const t = Math.min(1, Math.max(0, p));
    const track = trackRef.current;
    const a = track[posAt0]!;
    const b = track[posAt0 - 1]!;
    return lerp(a.opacity, b.opacity, t);
  });

  const zIndex = useTransform(progress, (p) => {
    const t = Math.min(1, Math.max(0, p));
    const track = trackRef.current;
    const a = track[posAt0]!;
    const b = track[posAt0 - 1]!;
    return mixSpec(a, b, t).z;
  });

  return (
    <motion.div
      className="absolute bottom-0 left-0 will-change-transform"
      style={{
        width: cardW,
        height: cardH,
        transform,
        opacity,
        zIndex,
        transformOrigin: "bottom left",
      }}
    >
      <motion.div
        className="relative h-full w-full overflow-hidden rounded-[24px] cursor-pointer"
        style={{ boxShadow: FRAME_SHADOW, willChange: "transform" }}
        whileHover={{ scale: 1.05, zIndex: 90 }}
        transition={{ duration: 0.55, ease: EASE_IN_OUT }}
        onClick={() => onOpen(src, alt)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onOpen(src, alt);
        }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover select-none"
          sizes="(max-width: 768px) 78vw, (max-width: 1024px) 46vw, 520px"
          draggable={false}
          fetchPriority="low"
        />
      </motion.div>
    </motion.div>
  );
});

function PortfolioLightbox({
  open,
  src,
  alt,
  onClose,
}: {
  open: boolean;
  src: string | null;
  alt: string;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && src ? (
        <motion.div
          className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.25, ease: EASE_IN_OUT } }}
          exit={{ opacity: 0, transition: { duration: 0.2, ease: EASE_IN_OUT } }}
          aria-modal="true"
          role="dialog"
          onMouseDown={(e) => {
            // Click outside closes (backdrop only).
            if (e.target === e.currentTarget) onClose();
          }}
        >
          {/* Backdrop */}
          <motion.div
            aria-hidden
            className="absolute inset-0 bg-black/80 backdrop-blur-[10px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.25, ease: EASE_IN_OUT } }}
            exit={{ opacity: 0, transition: { duration: 0.2, ease: EASE_IN_OUT } }}
          />

          {/* Panel */}
          <motion.div
            className="relative z-[1] w-full max-w-[min(92vw,1100px)] overflow-hidden rounded-[24px]"
            style={{
              boxShadow:
                "0 45px 140px rgba(0,0,0,0.85), 0 0 0 1px rgba(255,255,255,0.08), 0 0 90px rgba(255,255,255,0.05)",
              willChange: "transform",
            }}
            initial={{ y: 18, scale: 0.96, opacity: 0 }}
            animate={{
              y: 0,
              scale: 1,
              opacity: 1,
              transition: { duration: 0.45, ease: EASE_IN_OUT },
            }}
            exit={{
              y: 10,
              scale: 0.97,
              opacity: 0,
              transition: { duration: 0.25, ease: EASE_IN_OUT },
            }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[16/10] w-full bg-black">
              <Image
                src={src}
                alt={alt}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 92vw, 1100px"
                priority
              />
            </div>

            <button
              type="button"
              onClick={onClose}
              className="absolute right-3 top-3 rounded-full border border-white/10 bg-black/60 px-3 py-2 text-xs font-medium tracking-wide text-white/85 backdrop-blur-md transition hover:bg-black/70 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/20"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export type PortfolioCarouselProps = {
  id?: string;
  kicker?: string;
  title?: string;
  subtitle?: string;
};

/**
 * Cinematic conveyor:
 * The SAME image flows 100% → 85% → 60% → 45%, while the next image enters the 100% slot.
 * Only 4 (or 3 / 2) cards are actively animated at a time. Infinite loop, pause on hover.
 */
export function PortfolioCarousel({
  id = "portfolio",
  kicker = "Portfolio",
  title = "Selected work",
  subtitle = "A stacked cinematic conveyor — hover to pause.",
}: PortfolioCarouselProps) {
  const pattern = useCarouselPattern();
  const visible = pattern; // 4 desktop, 3 tablet, 2 mobile
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerW, setContainerW] = useState(1200);

  const [head, setHead] = useState(0); // image index currently in the focus (rightmost) slot
  const progress = useMotionValue(0); // 0..1 between steps
  const controlsRef = useRef<ReturnType<typeof animate> | null>(null);
  const pausedRef = useRef(false);
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(
    null,
  );

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => setContainerW(el.getBoundingClientRect().width);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const start = useCallback(() => {
    controlsRef.current?.stop();
    progress.set(0);

    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const tick = () => {
      if (pausedRef.current) return;
      progress.set(0);
      const controls = animate(progress, 1, {
        duration: 2.6, // slow & premium
        ease: EASE_IN_OUT,
        onComplete: () => {
          setHead((h) => (h + 1) % PORTFOLIO_IMAGE_PATHS.length);
          tick();
        },
      });
      controlsRef.current = controls;
    };

    tick();
  }, [progress]);

  useEffect(() => {
    start();
    return () => controlsRef.current?.stop();
  }, [start]);

  const pause = useCallback(() => {
    pausedRef.current = true;
    controlsRef.current?.pause();
  }, []);

  const resume = useCallback(() => {
    pausedRef.current = false;
    controlsRef.current?.play();
    // If we were paused before an animation started, ensure it restarts.
    if (!controlsRef.current) start();
  }, [start]);

  const openLightbox = useCallback((src: string, alt: string) => {
    setLightbox({ src, alt });
  }, []);

  const closeLightbox = useCallback(() => {
    setLightbox(null);
  }, []);

  const slots = buildSlots(containerW, visible);
  // One extra slot to the right (incoming) and one to the left (outgoing).
  const incoming: SlotSpec = {
    x: (slots.at(-1)?.x ?? containerW * 0.6) + containerW * 0.18,
    y: 0,
    scale: 1.08,
    opacity: 0,
    z: 55,
  };
  const outgoing: SlotSpec = {
    x: (slots[0]?.x ?? containerW * 0.06) - containerW * 0.18,
    y: 44,
    scale: 0.45,
    opacity: 0,
    z: 0,
  };

  const track = [outgoing, ...slots, incoming]; // indices 0..visible+1
  const trackRef = useRef<SlotSpec[]>(track);
  trackRef.current = track;

  // Cards in play: visible slots + incoming (right) => visible+1 cards.
  const inPlayCount = visible + 1;
  const total = PORTFOLIO_IMAGE_PATHS.length;
  const getImg = (idx: number) => PORTFOLIO_IMAGE_PATHS[((idx % total) + total) % total]!;

  // Base card dimensions: full height is 600px before scale.
  const cardH = 600;
  const cardW = Math.min(560, Math.max(280, containerW * (visible === 2 ? 0.64 : 0.46)));

  return (
    <section
      id={id}
      className="relative scroll-mt-28 overflow-x-hidden bg-[#000000] py-24 text-white sm:scroll-mt-32 sm:py-28 md:py-32"
      aria-label="Portfolio carousel"
    >
      <div className="relative mx-auto max-w-[1600px] px-5 sm:px-8 md:px-10">
        <header className="mb-14 max-w-2xl md:mb-16">
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

      <div
        className="relative w-full overflow-hidden"
        onPointerEnter={pause}
        onPointerLeave={resume}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-[70] w-[min(16vw,120px)] bg-gradient-to-r from-black via-black/92 to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-[70] w-[min(18vw,140px)] bg-gradient-to-l from-black via-black/92 to-transparent"
        />

        {/* Full viewport width: only 4 (or 3/2) cards in play, layered with depth */}
        <div className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2">
          <div
            ref={containerRef}
            className="relative h-[600px] w-full"
            style={{ contain: "layout paint", willChange: "transform" }}
          >
            {Array.from({ length: inPlayCount }, (_, k) => {
              const posAt0 = 1 + k; // 1..visible+1
              const imgIndex = k === visible ? head + 1 : head - (visible - 1 - k);
              const safe = ((imgIndex % total) + total) % total;
              return (
                <ConveyorCard
                  key={`conv-${k}-${head}`}
                  posAt0={posAt0}
                  progress={progress}
                  trackRef={trackRef}
                  cardW={cardW}
                  cardH={cardH}
                  src={getImg(imgIndex)}
                  alt={`Portfolio ${safe + 1}`}
                  onOpen={openLightbox}
                />
              );
            })}
          </div>
        </div>
      </div>

      <PortfolioLightbox
        open={!!lightbox}
        src={lightbox?.src ?? null}
        alt={lightbox?.alt ?? "Portfolio image"}
        onClose={closeLightbox}
      />
    </section>
  );
}
