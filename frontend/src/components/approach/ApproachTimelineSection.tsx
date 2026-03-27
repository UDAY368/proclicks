"use client";

import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import { useMemo, useRef, useState } from "react";

type Step = {
  key: string;
  title: string;
  description: string;
};

function formatStepNumber(n: number) {
  return String(n).padStart(2, "0");
}

function ApproachCard({
  step,
  index,
  isActive,
}: {
  step: Step;
  index: number;
  isActive: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  const num = formatStepNumber(index + 1);

  return (
    <motion.div
      initial={
        reduceMotion
          ? { opacity: 1, y: 0, rotateZ: 0 }
          : { opacity: 0, y: 60, rotateZ: index % 2 === 0 ? 3 : -3 }
      }
      whileInView={
        reduceMotion ? { opacity: 1, y: 0, rotateZ: 0 } : { opacity: 1, y: 0, rotateZ: 0 }
      }
      viewport={{ once: false, amount: 0.28 }}
      transition={{
        duration: 0.75,
        ease: [0.22, 1, 0.36, 1],
        delay: index * 0.15,
      }}
      whileHover={{
        scale: 1.06,
        boxShadow:
          "0 0 0 1px rgba(255,44,107,0.34), 0 26px 70px -40px rgba(255,44,107,0.60)",
      }}
      style={{
        transformStyle: "preserve-3d",
        transformPerspective: 900,
        rotateX: tilt.rx,
        rotateY: tilt.ry,
      }}
      onMouseMove={(e) => {
        if (reduceMotion) return;
        const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width; // 0..1
        const py = (e.clientY - rect.top) / rect.height; // 0..1

        // subtle, premium tilt
        const ry = (px - 0.5) * 10;
        const rx = (0.5 - py) * 8;
        setTilt({ rx, ry });
      }}
      onMouseLeave={() => setTilt({ rx: 0, ry: 0 })}
      className={[
        "relative rounded-[20px] border bg-white/[0.04] px-7 py-7 backdrop-blur",
        "border-white/[0.12] text-white shadow-[0_0_0_1px_rgba(255,255,255,0.04)]",
        isActive ? "border-white/[0.22]" : "",
      ].join(" ")}
    >
      {/* Glass border/glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[20px] bg-gradient-to-br from-[#ff2c6b]/25 via-white/[0.06] to-transparent opacity-90"
      />
      <div
        aria-hidden
        className={[
          "pointer-events-none absolute inset-0 rounded-[20px]",
          isActive ? "bg-[#ff2c6b]/10" : "bg-transparent",
          "transition-colors duration-600 ease-[0.22,1,0.36,1]",
        ].join(" ")}
      />

      <div className="relative">
        <h3 className="text-[clamp(1.25rem,2.4vw,1.95rem)] font-extrabold leading-tight">
          <span className="mr-3 inline-block text-[11px] font-semibold uppercase tracking-[0.35em] text-white/60 align-top">
            {num}
          </span>
          <span className="text-white">{step.title}</span>
        </h3>

        <p className="mt-4 max-w-[48ch] text-[15px] leading-relaxed text-white/70">
          {step.description}
        </p>
      </div>
    </motion.div>
  );
}

export function ApproachTimelineSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  const steps: Step[] = useMemo(
    () => [
      {
        key: "discover",
        title: "Discover & Connect",
        description:
          "We align your brand, vision, and audience—so every detail supports your goals.",
      },
      {
        key: "concept",
        title: "Concept & Plan",
        description:
          "We craft the creative direction with mood boards, styling guidance, and a shoot strategy ready to execute.",
      },
      {
        key: "create",
        title: "Create & Execute",
        description:
          "We bring ideas to life with expert photography, videography, and styling—capturing premium visuals with confidence.",
      },
      {
        key: "refine",
        title: "Refine & Deliver",
        description:
          "We enhance every detail, refine the final output, and deliver cohesive visuals that perform.",
      },
    ],
    [],
  );

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const [activeIndex, setActiveIndex] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (reduceMotion) return;
    const idx = Math.round(v * (steps.length - 1));
    setActiveIndex(Math.max(0, Math.min(steps.length - 1, idx)));
  });

  return (
    <section
      id="approach"
      ref={sectionRef}
      className="scroll-mt-28 border-t border-white/[0.08] bg-[#0b0b0f] px-6 py-[120px] sm:scroll-mt-32 sm:px-10 md:px-12 overflow-hidden"
      aria-label="Approach"
    >
      {/* Animated background gradient */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundSize: "250% 250%",
          backgroundImage:
            "linear-gradient(120deg, rgba(255,44,107,0.20), rgba(255,255,255,0.03), rgba(255,44,107,0.10))",
        }}
        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
        transition={{ duration: 10, ease: "easeInOut", repeat: Infinity }}
      />

      <div className="relative mx-auto max-w-[1100px]">
        <div className="max-w-[62ch]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-[#ff2c6b]">
            Approach
          </p>
          <h2 className="mt-4 text-balance font-[family-name:var(--font-display)] text-[clamp(1.9rem,2.8vw,2.6rem)] font-normal tracking-[-0.02em] text-white">
            How we plan, shoot, and deliver
          </h2>
        </div>

        {/* Timeline + staggered cards */}
        <div className="relative mt-14">
          {/* Vertical progress line */}
          <div
            aria-hidden
            className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-white/[0.10] md:block"
          />
          <motion.div
            aria-hidden
            className="absolute left-1/2 top-0 hidden w-px -translate-x-1/2 bg-[#ff2c6b]/90 md:block"
            style={{ height: `${((activeIndex + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          />

          <div className="space-y-8 md:space-y-10">
            {steps.map((s, idx) => {
              const sideRight = idx % 2 === 1;
              const yOffset = [0, 16, -8, 24][idx] ?? 0;

              return (
                <div
                  key={s.key}
                  className={[
                    "md:flex",
                    sideRight ? "md:justify-end" : "md:justify-start",
                  ].join(" ")}
                  style={{}}
                >
                  <div
                    className={[
                      "w-full md:max-w-[520px]",
                      sideRight ? "md:pr-10" : "md:pl-10",
                    ].join(" ")}
                    style={{ transform: `translateY(${yOffset}px)` }}
                  >
                    <ApproachCard step={s} index={idx} isActive={idx === activeIndex} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

