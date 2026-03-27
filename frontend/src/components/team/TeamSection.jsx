"use client";

import { motion } from "framer-motion";

const TEAM = [
  {
    name: "Sai Kumar",
    role: "Photographer",
    exp: "5 Years Experience",
  },
  {
    name: "Srikanth",
    role: "Videographer",
    exp: "4 Years Experience",
  },
  {
    name: "Srinu K",
    role: "Editor",
    exp: "4 Years Experience",
  },
  {
    name: "Roshni",
    role: "Makeup Artist",
    exp: "4 Years Experience",
  },
  {
    name: "Ashwini",
    role: "Hairstylist",
    exp: "4 Years Experience",
  },
  {
    name: "Satya",
    role: "Draping Artist",
    exp: "8 Years Experience",
  },
];

const EASE = [0.42, 0, 0.58, 1];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

export function TeamSection({
  id = "team",
  kicker = "Team",
  title = "Meet Our Creative Team",
  subtitle = "A collective of passionate artists and specialists dedicated to crafting visually compelling stories with precision and creativity.",
}) {
  return (
    <section
      id={id}
      className="relative bg-[#000000] pt-0 pb-24 text-white sm:pb-28 md:pb-32"
      aria-label="Meet Our Creative Team"
    >
      {/* subtle background glow */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-[12%] top-[18%] h-[340px] w-[340px] rounded-full bg-white/[0.05] blur-[80px]" />
        <div className="absolute right-[10%] bottom-[10%] h-[420px] w-[420px] rounded-full bg-white/[0.04] blur-[95px]" />
      </div>

      <div className="relative mx-auto max-w-[1600px] px-5 sm:px-8 md:px-10">
        <header className="mb-12 max-w-2xl sm:mb-14">
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

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="mx-auto grid max-w-[1200px] grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {TEAM.map((m, i) => {
            const staggerY =
              i >= 3 ? "translate-y-6 sm:translate-y-8" : "translate-y-0";
            const altOffset =
              i % 2 === 0 ? "lg:translate-y-2" : "lg:-translate-y-2";

            return (
              <motion.article
                key={m.name}
                variants={item}
                className={`group relative ${staggerY} ${altOffset}`}
                style={{ willChange: "transform" }}
              >
                <motion.div
                  className="relative overflow-hidden rounded-[28px] border border-white/10 bg-black/40 p-6 shadow-[0_20px_60px_rgba(255,255,255,0.05)] backdrop-blur-md"
                  whileHover={{
                    y: -10,
                    transition: { duration: 0.45, ease: EASE },
                  }}
                >
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-transparent"
                  />

                  <div className="relative">
                    <p className="text-[26px] font-semibold tracking-tight text-white sm:text-[30px]">
                      {m.role}
                    </p>
                    <div className="mt-4 h-px w-12 bg-white/15" />
                    <p className="mt-4 text-lg font-semibold tracking-tight text-white/85 sm:text-xl">
                      {m.name}
                    </p>
                    <p className="mt-2 text-[12px] font-medium tracking-[0.22em] text-white/55">
                      {m.exp}
                    </p>
                  </div>
                </motion.div>

                {/* soft glow on hover */}
                <div className="pointer-events-none absolute -inset-8 opacity-0 transition-opacity duration-500 ease-in-out group-hover:opacity-100">
                  <div className="absolute inset-0 rounded-[40px] bg-white/7 blur-3xl" />
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

