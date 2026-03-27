"use client";

import dynamic from "next/dynamic";
import type { PortfolioCarouselProps } from "./PortfolioCarousel";

const PortfolioCarouselLazy = dynamic(
  () =>
    import("./PortfolioCarousel").then((m) => m.PortfolioCarousel),
  {
    ssr: false,
    loading: () => (
      <section
        id="portfolio"
        className="min-h-[280px] scroll-mt-28 bg-black sm:scroll-mt-32"
        aria-hidden
      />
    ),
  },
);

export function PortfolioCarouselDynamic(props: PortfolioCarouselProps) {
  return <PortfolioCarouselLazy {...props} />;
}
