import { PORTFOLIO_1_IMAGE_URLS } from "@/lib/cloudinaryAssets";

/** Portfolio stills (Cloudinary CDN). */
export const PORTFOLIO_IMAGE_PATHS = PORTFOLIO_1_IMAGE_URLS;

/** Stepped masks: small → extra-large (right). Bottom-aligned row spans full width. */
export type ViewportFrameSpec = {
  widthClass: string;
  heightClass: string;
  overlapClass: string;
  z: number;
};

/**
 * Widths use vw so the stack stretches across the whole viewport.
 * Negative margins overlap like a card deck; right card is largest (h-full).
 */
export function getViewportFrames(pattern: 2 | 3 | 4): ViewportFrameSpec[] {
  if (pattern === 4) {
    return [
      {
        widthClass: "w-[17vw] min-w-[72px] max-w-[140px]",
        heightClass: "h-[45%]",
        overlapClass: "ml-0",
        z: 10,
      },
      {
        widthClass: "w-[24vw] min-w-[100px] max-w-[220px]",
        heightClass: "h-[60%]",
        overlapClass: "-ml-[8vw] sm:-ml-[7vw] md:-ml-[6vw]",
        z: 20,
      },
      {
        widthClass: "w-[30vw] min-w-[140px] max-w-[320px]",
        heightClass: "h-[85%]",
        overlapClass: "-ml-[10vw] sm:-ml-[9vw] md:-ml-[8vw]",
        z: 30,
      },
      {
        widthClass: "min-w-[min(36vw,300px)] flex-1 basis-0",
        heightClass: "h-[100%]",
        overlapClass: "-ml-[11vw] sm:-ml-[10vw] md:-ml-[9vw] lg:-ml-[8vw]",
        z: 40,
      },
    ];
  }
  if (pattern === 3) {
    return [
      {
        widthClass: "w-[26vw] min-w-[110px] max-w-[240px]",
        heightClass: "h-[60%]",
        overlapClass: "ml-0",
        z: 15,
      },
      {
        widthClass: "w-[34vw] min-w-[160px] max-w-[360px]",
        heightClass: "h-[85%]",
        overlapClass: "-ml-[10vw] md:-ml-[9vw]",
        z: 28,
      },
      {
        widthClass: "min-w-[min(42vw,280px)] flex-1 basis-0",
        heightClass: "h-full",
        overlapClass: "-ml-[11vw] md:-ml-[10vw]",
        z: 40,
      },
    ];
  }
  return [
    {
      widthClass: "w-[38vw] min-w-[140px] max-w-[280px]",
      heightClass: "h-[60%]",
      overlapClass: "ml-0",
      z: 22,
    },
    {
      widthClass: "min-w-[min(52vw,260px)] flex-1 basis-0",
      heightClass: "h-full",
      overlapClass: "-ml-[14vw] sm:-ml-[12vw]",
      z: 40,
    },
  ];
}

/** One slide in the moving strip (same in every mask; loop width = n × slide width). */
export const STRIP_SLIDE_CLASS =
  "w-[clamp(160px,22vw,300px)] sm:w-[clamp(180px,20vw,320px)] lg:w-[300px]";
