"use client";

import Image from "next/image";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import { CURVE_IMAGE_URLS } from "@/lib/cloudinaryAssets";

const EASE = "linear";
const EASE_IN_OUT = [0.42, 0, 0.58, 1];

function clamp01(v) {
  return Math.max(0, Math.min(1, v));
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function mod(n, m) {
  return ((n % m) + m) % m;
}

export function CurvedCarousel({
  className = "",
  /** loops per second (slow, cinematic) */
  speed = 0.035,
  curveHeightDesktop = 240,
  curveHeightMobile = 150,
}) {
  const images = useMemo(() => [...CURVE_IMAGE_URLS], []);

  // No visible duplicates: keep exactly one set and wrap positions mathematically.
  const items = images;

  const progress = useMotionValue(0);
  const controlsRef = useRef(null);
  const containerRef = useRef(null);
  const [layout, setLayout] = useState({ w: 1100, h: 520, curveH: 220 });

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const measure = () => {
      const r = el.getBoundingClientRect();
      const w = Math.max(320, r.width);
      const h = Math.max(360, r.height);
      const isMobile = w < 640;
      setLayout({
        w,
        h,
        curveH: isMobile ? curveHeightMobile : curveHeightDesktop,
      });
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [curveHeightDesktop, curveHeightMobile]);

  const start = useCallback(() => {
    controlsRef.current?.stop?.();
    progress.set(0);

    // Slow, cinematic drift: progress loops 0..1
    controlsRef.current = animate(progress, 1, {
      duration: 1 / speed,
      ease: EASE,
      repeat: Infinity,
      repeatType: "loop",
    });
  }, [progress, speed]);

  useLayoutEffect(() => {
    start();
    return () => controlsRef.current?.stop?.();
  }, [start]);

  const pause = () => controlsRef.current?.pause?.();
  const resume = () => controlsRef.current?.play?.();

  const radiusX = layout.w * 0.48;
  const centerX = layout.w * 0.5;
  const centerY = layout.h * 0.56;

  const arcStart = -Math.PI; // left
  const arcEnd = 0; // right

  function CurvedCarouselItem({ src, index }) {
    // position in [0..1): equally spaced along arc + animated offset
    const pos = useTransform(progress, (p) => mod(p + index / items.length, 1));
    const angle = useTransform(pos, (u) => lerp(arcStart, arcEnd, u));

    const style = useTransform(angle, (a) => {
      // Arc coords: X across radius, Y is a smile curve (sin)
      const x = Math.cos(a) * radiusX;
      const y = Math.sin(a) * layout.curveH; // negative at mid (since sin(-pi/2)=-1)

      // Depth: center of arc is at a=-pi/2 (y is most negative) → map to 1
      const depth = clamp01(1 - Math.abs(y) / Math.max(1, layout.curveH));
      const scale = lerp(0.72, 1.0, depth);
      const opacity = lerp(0.35, 1.0, depth);
      const rotateZ = lerp(10, -10, (x / radiusX + 1) / 2);
      const blur = lerp(2.2, 0, depth);

      return {
        transform: `translate3d(${centerX + x}px, ${centerY - y}px, 0) translate3d(-50%, -50%, 0) scale(${scale}) rotate(${rotateZ}deg)`,
        opacity,
        filter: `blur(${blur}px)`,
        zIndex: Math.round(10 + depth * 50),
      };
    });

    return (
      <motion.div
        className="absolute left-0 top-0 will-change-transform"
        style={style}
      >
        <motion.div
          className="relative overflow-hidden rounded-2xl bg-black shadow-[0_20px_60px_rgba(255,255,255,0.06)] ring-1 ring-white/10"
          style={{
            width: "clamp(150px, 12vw, 210px)",
            height: "clamp(210px, 18vw, 300px)",
            willChange: "transform",
          }}
          whileHover={{
            scale: 1.06,
            filter: "brightness(1.08)",
            transition: { duration: 0.45, ease: EASE_IN_OUT },
          }}
          transition={{ duration: 0.45, ease: EASE_IN_OUT }}
        >
          <Image
            src={src}
            alt={`Curve item ${index + 1}`}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 150px, 210px"
            draggable={false}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${className}`}
      onPointerEnter={pause}
      onPointerLeave={resume}
      style={{ perspective: "1000px" }}
      aria-label="Curved carousel"
    >
      {/* Edge fades */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 z-[60] w-[min(18vw,180px)] bg-gradient-to-r from-black via-black/90 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 z-[60] w-[min(18vw,180px)] bg-gradient-to-l from-black via-black/90 to-transparent"
      />

      {/* Full-width stage */}
      <div className="relative left-1/2 h-[560px] w-screen max-w-[100vw] -translate-x-1/2">
        {items.map((src, i) => (
          <CurvedCarouselItem key={src} src={src} index={i} />
        ))}
      </div>
    </div>
  );
}

