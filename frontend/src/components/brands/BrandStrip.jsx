"use client";

import Image from "next/image";
import { animate, motion, useMotionValue } from "framer-motion";
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import { BRAND_LOGO_URLS } from "@/lib/cloudinaryAssets";

const LOGOS = BRAND_LOGO_URLS;

const EASE = "linear";

export function BrandStrip({
  id = "brands",
  title = "Trusted by Leading Brands",
  subtitle = "We collaborate with forward-thinking brands to create powerful visual stories that elevate identity and drive impact.",
}) {
  const logos = useMemo(() => [...LOGOS, ...LOGOS, ...LOGOS], []);
  const x = useMotionValue(0);
  const controlsRef = useRef(null);
  const stripRef = useRef(null);
  const [loopWidth, setLoopWidth] = useState(0);

  const start = useCallback(() => {
    if (!loopWidth) return;
    controlsRef.current?.stop?.();
    x.set(0);

    // Slow, premium pace (px/sec)
    const speed = 32;
    const duration = loopWidth / speed;
    controlsRef.current = animate(x, -loopWidth, {
      duration,
      ease: EASE,
      repeat: Infinity,
      repeatType: "loop",
    });
  }, [loopWidth, x]);

  useLayoutEffect(() => {
    const el = stripRef.current;
    if (!el) return;

    const measure = () => {
      // One copy width = total width / 3 (because we duplicated 3x)
      setLoopWidth(el.scrollWidth / 3);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useLayoutEffect(() => {
    start();
    return () => controlsRef.current?.stop?.();
  }, [start]);

  return (
    <section
      id={id}
      className="relative bg-[#000000] pt-0 pb-24 text-white sm:pb-28 md:pb-32"
      aria-label="Trusted by brands"
    >
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8 md:px-10">
        <header className="mx-auto mb-12 max-w-2xl text-center sm:mb-14">
          <p className="text-[11px] font-semibold uppercase tracking-[0.38em] text-white/40">
            TRUSTED BY
          </p>
          <h2 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-normal tracking-tight text-white sm:text-4xl md:text-[2.75rem]">
            {title}
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-white/50 sm:text-base">
            {subtitle}
          </p>
        </header>
      </div>

      <div className="relative mt-14 w-full overflow-hidden sm:mt-16">
        <motion.div
          ref={stripRef}
          className="flex h-24 w-max items-center gap-8 px-6 sm:gap-10 sm:px-10 md:gap-12 md:px-12 will-change-transform"
          style={{ x }}
        >
          {logos.map((src, i) => (
            <div
              key={`${src}-${i}`}
              className="relative h-24 w-[260px] sm:w-[320px] md:w-[360px]"
            >
              <Image
                src={src}
                alt={`Brand logo ${i + 1}`}
                fill
                className="object-contain"
                sizes="(max-width: 640px) 260px, (max-width: 1024px) 320px, 360px"
                draggable={false}
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

