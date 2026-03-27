"use client";

import Link from "next/link";

const BRAND_LINE1 = "Pro Capture's";
const BRAND_LINE2 = "Photography";

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-sm text-white/55 transition hover:text-white"
    >
      {children}
    </Link>
  );
}

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-black text-white">
      {/* subtle top divider + glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 h-[260px] w-[900px] -translate-x-1/2 rounded-full bg-white/[0.06] blur-[90px]"
      />

      <div className="mx-auto max-w-[1600px] px-5 py-16 sm:px-8 sm:py-20 md:px-10">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-5">
            <div className="flex flex-col">
              <p className="text-[11px] font-semibold tracking-[0.38em] text-white/40">
                {BRAND_LINE1}
              </p>
              <p className="mt-2 font-[family-name:var(--font-display)] text-2xl font-normal tracking-tight text-white sm:text-3xl">
                {BRAND_LINE2}
              </p>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-white/50">
                Premium photography and cinematic content crafted for brands that
                care about detail, light, and story.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.26em] text-white/60">
                Studio-grade delivery
              </span>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.26em] text-white/60">
                Post-production included
              </span>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.26em] text-white/60">
                Fast turnarounds
              </span>
            </div>
          </div>

          {/* Links */}
          <div className="md:col-span-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-white/45">
              Explore
            </p>
            <ul className="mt-5 space-y-3">
              <li>
                <FooterLink href="#about">Services</FooterLink>
              </li>
              <li>
                <FooterLink href="#approach">Approach</FooterLink>
              </li>
              <li>
                <FooterLink href="#portfolio">Portfolio</FooterLink>
              </li>
              <li>
                <FooterLink href="#team">Team</FooterLink>
              </li>
              <li>
                <FooterLink href="#contact">Contact</FooterLink>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="md:col-span-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-white/45">
              Services
            </p>
            <ul className="mt-5 space-y-3">
              <li className="text-sm text-white/55">Fashion Photography</li>
              <li className="text-sm text-white/55">Product Photography</li>
              <li className="text-sm text-white/55">
                Social Media Content Creation
              </li>
              <li className="text-sm text-white/55">Creative Brand Campaigns</li>
            </ul>

            <div className="mt-7 flex items-center gap-3">
              {[
                { label: "YouTube", href: "https://www.youtube.com" },
                { label: "Facebook", href: "https://www.facebook.com" },
                { label: "Instagram", href: "https://www.instagram.com" },
                { label: "Twitter", href: "https://x.com" },
                { label: "LinkedIn", href: "https://www.linkedin.com" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="group inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/75 shadow-[0_18px_60px_rgba(0,0,0,0.55)] backdrop-blur-md transition hover:border-white/20 hover:bg-white hover:text-black focus:outline-none focus:ring-2 focus:ring-white/25"
                >
                  {s.label === "YouTube" ? (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="transition group-hover:scale-[1.04]"
                    >
                      <path
                        d="M10 9.75v4.5l4-2.25-4-2.25Z"
                        fill="currentColor"
                      />
                      <path
                        d="M21.6 8.2a2.8 2.8 0 0 0-2-2C17.9 5.75 12 5.75 12 5.75s-5.9 0-7.6.45a2.8 2.8 0 0 0-2 2A29 29 0 0 0 2 12a29 29 0 0 0 .4 3.8 2.8 2.8 0 0 0 2 2c1.7.45 7.6.45 7.6.45s5.9 0 7.6-.45a2.8 2.8 0 0 0 2-2A29 29 0 0 0 22 12a29 29 0 0 0-.4-3.8Z"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : s.label === "Facebook" ? (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="transition group-hover:scale-[1.04]"
                    >
                      <path
                        d="M14 8.5V7a2.5 2.5 0 0 1 2.5-2.5H18V2h-1.5A5 5 0 0 0 11.5 7v1.5H9v3h2.5V22h3V11.5H17l1-3h-3Z"
                        fill="currentColor"
                      />
                    </svg>
                  ) : s.label === "Instagram" ? (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="transition group-hover:scale-[1.04]"
                    >
                      <path
                        d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Z"
                        stroke="currentColor"
                        strokeWidth="1.6"
                      />
                      <path
                        d="M12 16.1a4.1 4.1 0 1 0 0-8.2 4.1 4.1 0 0 0 0 8.2Z"
                        stroke="currentColor"
                        strokeWidth="1.6"
                      />
                      <path
                        d="M17.8 6.2h.01"
                        stroke="currentColor"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                      />
                    </svg>
                  ) : s.label === "Twitter" ? (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="transition group-hover:scale-[1.04]"
                    >
                      <path
                        d="M18.7 2H22l-7.3 8.35L23 22h-6.6l-5.2-6.75L5 22H2l7.9-9.05L1 2h6.7l4.7 6.1L18.7 2Z"
                        fill="currentColor"
                      />
                    </svg>
                  ) : (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="transition group-hover:scale-[1.04]"
                    >
                      <path
                        d="M6.5 9H3.5V20.5h3V9Z"
                        fill="currentColor"
                      />
                      <path
                        d="M5 7.2a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6Z"
                        fill="currentColor"
                      />
                      <path
                        d="M20.5 20.5h-3v-6.1c0-1.5-.6-2.6-2.1-2.6-1.1 0-1.8.8-2.1 1.5-.1.3-.1.7-.1 1.1v6.1h-3s.04-9.9 0-11h3v1.6c.4-.7 1.3-1.8 3.2-1.8 2.3 0 4.1 1.5 4.1 4.9v6.3Z"
                        fill="currentColor"
                      />
                    </svg>
                  )}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-center gap-4 border-t border-white/10 pt-8 text-center">
          <p className="text-sm text-white/60">
            © {year} {BRAND_LINE1} {BRAND_LINE2}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

