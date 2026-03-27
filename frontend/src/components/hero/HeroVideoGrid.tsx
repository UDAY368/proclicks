"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { HERO_VIDEO_BASE_NAMES } from "./hero.constants";
import { HERO_VIDEO_URLS } from "@/lib/cloudinaryAssets";

function subscribeReducedMotion(cb: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

type Props = {
  className?: string;
};

export function HeroVideoGrid({ className }: Props) {
  const reduceMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );

  return (
    <div className={className} aria-hidden>
      <ul className="grid h-full min-h-0 w-full grid-cols-4 gap-px bg-zinc-950/90 sm:gap-0.5 md:gap-1">
        {HERO_VIDEO_BASE_NAMES.map((name, i) => (
          <li
            key={name}
            className="hero-video-tile group relative min-h-0 min-w-0 overflow-hidden bg-zinc-900/90 first:rounded-l-lg last:rounded-r-lg sm:first:rounded-l-2xl sm:last:rounded-r-2xl"
          >
            <HeroClip
              src={HERO_VIDEO_URLS[i]!}
              preferStatic={reduceMotion}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

function HeroClip({
  src,
  preferStatic,
}: {
  src: string;
  preferStatic: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || preferStatic) return;
    el.play().catch(() => {
      /* autoplay may be blocked; muted clips usually autoplay */
    });
  }, [preferStatic]);

  if (preferStatic) {
    return (
      <div
        className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-zinc-800 via-zinc-900 to-black"
        aria-hidden
      >
        <span className="max-w-[70%] text-center text-[10px] font-medium uppercase tracking-[0.2em] text-white/35">
          Video preview
        </span>
      </div>
    );
  }

  return (
    <video
      ref={ref}
      className="absolute inset-0 h-full w-full object-cover"
      muted
      loop
      playsInline
      autoPlay
      preload="auto"
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
