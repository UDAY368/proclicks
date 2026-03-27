"use client";

import { CurvedCarousel } from "./CurvedCarousel";

export function ContactSection({
  id = "contact",
  kicker = "Contact",
  title = "Let’s build your next visual story",
  subtitle = "A curved, cinematic reel of recent frames — designed to feel premium, smooth, and unforgettable.",
}) {
  return (
    <section
      id={id}
      className="relative bg-[#000000] py-32 text-white"
      aria-label="Contact"
    >
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8 md:px-10">
        <header className="mb-14 max-w-2xl sm:mb-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.38em] text-white/40">
            {kicker}
          </p>
          <h2 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-normal tracking-tight text-white sm:text-4xl md:text-[2.75rem]">
            {title}
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/50 sm:text-base">
            {subtitle}
          </p>
        </header>

        <CurvedCarousel className="mx-auto" />

        <div className="mt-14 flex flex-col gap-3 text-sm text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Email: <span className="text-white/85">hello@procaptures.com</span>
          </p>
          <p>
            Location: <span className="text-white/85">Hyderabad, India</span>
          </p>
        </div>
      </div>
    </section>
  );
}

