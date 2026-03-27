"use client";

import { useEffect, useState } from "react";

export type CarouselPattern = 2 | 3 | 4;

/**
 * Visible tier count: 4 desktop, 3 tablet, 2 mobile (size hierarchy preserved).
 */
export function useCarouselPattern(): CarouselPattern {
  const [n, setN] = useState<CarouselPattern>(4);

  useEffect(() => {
    const read = () => {
      if (typeof window === "undefined") return;
      const w = window.innerWidth;
      if (w >= 1024) setN(4);
      else if (w >= 768) setN(3);
      else setN(2);
    };
    read();
    window.addEventListener("resize", read);
    return () => window.removeEventListener("resize", read);
  }, []);

  return n;
}
