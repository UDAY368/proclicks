"use client";

import Image from "next/image";
import {
  animate,
  motion,
  useMotionValue,
  useTransform,
  type MotionValue,
} from "framer-motion";
import {
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { CURVE_IMAGE_URLS } from "@/lib/cloudinaryAssets";

const EASE_IN_OUT = "easeInOut" as const;

function clamp01(v: number) {
  return Math.min(1, Math.max(0, v));
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

type SlotSpec = {
  x: number;
  y: number;
  scale: number;
  opacity: number;
  rotateZ: number;
  z: number;
};

function mix(a: SlotSpec, b: SlotSpec, t: number): SlotSpec {
  return {
    x: lerp(a.x, b.x, t),
    y: lerp(a.y, b.y, t),
    scale: lerp(a.scale, b.scale, t),
    opacity: lerp(a.opacity, b.opacity, t),
    rotateZ: lerp(a.rotateZ, b.rotateZ, t),
    z: Math.round(lerp(a.z, b.z, t)),
  };
}

function buildArcSlots(w: number, curveH: number, offsetY: number): SlotSpec[] {
  // 5 fixed slots across width. Ends larger, center smallest.
  const xs = [0.10, 0.30, 0.50, 0.70, 0.90];
  const scales = [1.0, 0.86, 0.72, 0.86, 1.0];
  const opacities = [1.0, 0.88, 0.70, 0.88, 1.0];
  const rots = [-6, -2, 0, 2, 6];

  // Arc: ends higher, center lower.
  const ys = xs.map((xf) => {
    const t = (xf - 0.5) / 0.5; // -1..1
    const y = (1 - t * t) * curveH; // peak at center
    // We want center lower, so invert.
    return -y + offsetY;
  });

  return xs.map((xf, i) => ({
    x: w * xf,
    y: ys[i] ?? 0,
    scale: scales[i] ?? 1,
    opacity: opacities[i] ?? 1,
    rotateZ: rots[i] ?? 0,
    z: 10 + Math.round((scales[i] ?? 1) * 20),
  }));
}

type CardProps = {
  posAt0: number;
  progress: MotionValue<number>;
  trackRef: React.MutableRefObject<SlotSpec[]>;
  src: string;
  alt: string;
  cardW: number;
  cardH: number;
};

const ArcCard = memo(function ArcCard({
  posAt0,
  progress,
  trackRef,
  src,
  alt,
  cardW,
  cardH,
}: CardProps) {
  const transform = useTransform(progress, (p) => {
    const t = clamp01(p);
    const tr = trackRef.current;
    const a = tr[posAt0]!;
    const b = tr[posAt0 - 1]!;
    const m = mix(a, b, t);
    return `translate3d(${m.x}px, ${m.y}px, 0) translate3d(-50%, -50%, 0) rotate(${m.rotateZ}deg) scale(${m.scale})`;
  });

  const opacity = useTransform(progress, (p) => {
    const t = clamp01(p);
    const tr = trackRef.current;
    const a = tr[posAt0]!;
    const b = tr[posAt0 - 1]!;
    return lerp(a.opacity, b.opacity, t);
  });

  const zIndex = useTransform(progress, (p) => {
    const t = clamp01(p);
    const tr = trackRef.current;
    const a = tr[posAt0]!;
    const b = tr[posAt0 - 1]!;
    return mix(a, b, t).z;
  });

  return (
    <motion.div
      className="absolute left-0 top-1/2 will-change-transform"
      style={{
        width: cardW,
        height: cardH,
        transform,
        opacity,
        zIndex,
        transformOrigin: "center",
      }}
    >
      <motion.div
        className="relative h-full w-full overflow-hidden rounded-2xl bg-black ring-1 ring-white/10"
        style={{
          boxShadow:
            "0 26px 90px rgba(0,0,0,0.82), 0 0 0 1px rgba(255,255,255,0.06), 0 0 70px rgba(255,255,255,0.04)",
          willChange: "transform",
        }}
        whileHover={{ scale: 1.05, transition: { duration: 0.45, ease: EASE_IN_OUT } }}
        transition={{ duration: 0.45, ease: EASE_IN_OUT }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 140px, (max-width: 1024px) 180px, 220px"
          draggable={false}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
      </motion.div>
    </motion.div>
  );
});

export function ContactArcCarousel({
  heightPx = 520,
  stepDurationSec = 2.8,
}: {
  heightPx?: number;
  /** time for one image to move one slot */
  stepDurationSec?: number;
}) {
  const images = useMemo(() => [...CURVE_IMAGE_URLS], []);

  const [head, setHead] = useState(0);
  const progress = useMotionValue(0);
  const controlsRef = useRef<ReturnType<typeof animate> | null>(null);
  const pausedRef = useRef(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(1200);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => setW(el.getBoundingClientRect().width);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const start = useCallback(() => {
    controlsRef.current?.stop();
    progress.set(0);

    const tick = () => {
      if (pausedRef.current) return;
      progress.set(0);
      const c = animate(progress, 1, {
        duration: stepDurationSec,
        ease: EASE_IN_OUT,
        onComplete: () => {
          setHead((h) => mod(h + 1, images.length));
          tick();
        },
      });
      controlsRef.current = c;
    };
    tick();
  }, [images.length, progress, stepDurationSec]);

  useEffect(() => {
    start();
    return () => controlsRef.current?.stop();
  }, [start]);

  const pause = () => {
    pausedRef.current = true;
    controlsRef.current?.pause();
  };
  const resume = () => {
    pausedRef.current = false;
    controlsRef.current?.play();
    if (!controlsRef.current) start();
  };

  const curveH = w < 640 ? 90 : 120;
  const offsetY = curveH * 0.85;
  const slots = buildArcSlots(w, curveH, offsetY);

  // outgoing + 5 slots + incoming
  const outgoing: SlotSpec = {
    x: w * -0.10,
    y: 0,
    scale: 0.62,
    opacity: 0,
    rotateZ: -10,
    z: 0,
  };
  const incoming: SlotSpec = {
    x: w * 1.10,
    y: 0,
    scale: 0.62,
    opacity: 0,
    rotateZ: 10,
    z: 0,
  };
  const track = [outgoing, ...slots, incoming];
  const trackRef = useRef<SlotSpec[]>(track);
  trackRef.current = track;

  const visible = 5;
  const inPlay = visible + 1; // + incoming
  const cardH = Math.min(320, Math.max(220, heightPx * 0.56));
  const cardW = Math.round(cardH * 0.72);

  const getImg = (idx: number) => images[mod(idx, images.length)]!;

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden"
      style={{ height: `${heightPx}px`, perspective: "1000px" }}
      onPointerEnter={pause}
      onPointerLeave={resume}
      aria-label="Contact arc carousel"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 z-[60] w-[min(18vw,180px)] bg-gradient-to-r from-black via-black/90 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 z-[60] w-[min(18vw,180px)] bg-gradient-to-l from-black via-black/90 to-transparent"
      />

      {Array.from({ length: inPlay }, (_, k) => {
        const posAt0 = 1 + k; // 1..6
        // center slot index = 3 (0..4), but our “ends bigger” look is in slot specs.
        // assign images so the motion feels continuous left→right.
        const imgIndex = k === visible ? head + 1 : head - (visible - 1 - k);
        const safe = mod(imgIndex, images.length);
        return (
          <ArcCard
            key={`arc-${k}-${head}`}
            posAt0={posAt0}
            progress={progress}
            trackRef={trackRef}
            src={getImg(imgIndex)}
            alt={`Curve ${safe + 1}`}
            cardW={cardW}
            cardH={cardH}
          />
        );
      })}
    </div>
  );
}

