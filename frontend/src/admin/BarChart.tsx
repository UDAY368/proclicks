"use client";

import { motion } from "framer-motion";

type BarPoint = { label: string; value: number };

export function BarChart({
  title,
  data,
  axisHint,
}: {
  title: string;
  data: BarPoint[];
  /** Shown under the chart (e.g. "Day of month — March 2026") */
  axisHint?: string;
}) {
  const max = Math.max(1, ...data.map((x) => x.value));
  const manyBars = data.length > 14;

  return (
    <section className="mx-auto w-full max-w-[calc(100%+50px)] rounded-2xl border border-white/10 bg-black/45 p-3 sm:p-4">
      <p className="text-sm font-semibold tracking-wide text-white/80">{title}</p>
      {axisHint ? (
        <p className="mt-0.5 text-[11px] text-white/40">{axisHint}</p>
      ) : null}
      <div
        className={`mt-3 ${manyBars ? "overflow-x-auto pb-1" : ""} ${
          manyBars ? "" : "overflow-hidden"
        }`}
      >
        <div
          className={`flex h-[220px] items-stretch gap-1 sm:h-[236px] sm:gap-2 ${manyBars ? "min-w-min px-0.5" : ""}`}
        >
          {data.map((point) => {
            const barPct =
              point.value > 0 ? Math.max((point.value / max) * 100, 8) : 0;
            return (
              <div
                key={`${title}-${point.label}`}
                className={`group flex min-h-0 flex-col items-center ${manyBars ? "w-5 shrink-0 sm:w-6" : "min-w-0 flex-1"}`}
              >
                {/* Fixed-height track; label sits above bar; bar % is relative to the flex-1 region only. */}
                <div className="flex h-[188px] w-full flex-col sm:h-[200px]">
                  {point.value > 0 ? (
                    <>
                      <span className="mb-1 shrink-0 w-full text-center text-base font-bold tabular-nums leading-none text-white sm:mb-1.5 sm:text-xl">
                        {point.value}
                      </span>
                      <div className="flex min-h-0 flex-1 flex-col justify-end">
                        <motion.div
                          className="w-full rounded-t-md bg-white/85 transition group-hover:bg-white sm:rounded-t-xl"
                          initial={false}
                          animate={{ height: `${barPct}%` }}
                          transition={{ duration: 0.6, ease: "easeInOut" }}
                          title={`${point.label}: ${point.value}`}
                        />
                      </div>
                    </>
                  ) : null}
                </div>
                <span className="mt-1.5 max-w-full shrink-0 truncate text-center text-[9px] text-white/45 sm:text-[10px]">
                  {point.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
