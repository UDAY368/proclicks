"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useMemo, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import { HOME_NAV_ITEM, SITE_NAV_ITEMS, type NavItem } from "./nav-items";
import { NavMenuIcon } from "./nav-menu-icons";

const BRAND_LINE1 = "Pro Capture's";
const BRAND_LINE2 = "Photography";
/** Full name for labels and compact single-line uses */
const BRAND = `${BRAND_LINE1} ${BRAND_LINE2}`;

const easeOut = [0.22, 1, 0.36, 1] as const;

function BrandWordmark({
  compact = false,
  muted = false,
}: {
  compact?: boolean;
  muted?: boolean;
}) {
  const tone = muted ? "text-zinc-400" : "text-zinc-900";
  return (
    <span className="flex flex-col items-start leading-none">
      <span
        className={`font-semibold tracking-[0.07em] ${tone} ${
          compact ? "text-[10px]" : "text-[11px] sm:text-[12px]"
        }`}
      >
        {BRAND_LINE1}
      </span>
      <span
        className={`mt-0.5 font-[family-name:var(--font-display)] font-normal tracking-[-0.03em] ${tone} ${
          compact ? "text-[13px]" : "text-[15px] sm:text-[16px]"
        }`}
      >
        {BRAND_LINE2}
      </span>
    </span>
  );
}

const menuList = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.035, delayChildren: 0.04 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2, ease: easeOut },
  },
};

const menuRow = {
  hidden: { opacity: 0, y: 8, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.32, ease: easeOut },
  },
};

const menuRowReduced = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.32, ease: easeOut },
  },
};

function useLocationHash() {
  const [hash, setHash] = useState("#home");

  const syncHash = useCallback(() => {
    const h = window.location.hash;
    setHash(h && h.length > 0 ? h : "#home");
  }, []);

  /** Same tick as click — Next.js may not update `location.hash` before paint. */
  const setHashFromHref = useCallback((href: string) => {
    if (!href || href === "#") {
      setHash("#home");
      return;
    }
    setHash(href.startsWith("#") ? href : `#${href}`);
  }, []);

  useEffect(() => {
    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, [syncHash]);

  return { hash, syncHash, setHashFromHref };
}

export function SiteHeader() {
  const reduceMotion = useReducedMotion();
  const [menuOpen, setMenuOpen] = useState(false);
  const [desktopMenuHover, setDesktopMenuHover] = useState(false);
  const panelId = useId();
  const { hash, setHashFromHref } = useLocationHash();

  const currentNavItem = useMemo(
    () => SITE_NAV_ITEMS.find((item) => item.href === hash) ?? HOME_NAV_ITEM,
    [hash],
  );

  const closeDesktopMenu = useCallback(() => setDesktopMenuHover(false), []);

  const onDesktopNavClick = useCallback(
    (href: string) => {
      closeDesktopMenu();
      setHashFromHref(href);
    },
    [closeDesktopMenu, setHashFromHref],
  );

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const rowVariants = reduceMotion ? menuRowReduced : menuRow;

  return (
    <>
      <header
        className="cs-header pointer-events-none fixed left-0 right-0 top-0 z-[500] mx-auto flex w-full flex-col items-center justify-center px-4 pt-5 sm:pt-7"
        aria-label="Site header"
      >
        <div className="pointer-events-auto flex w-full max-w-[100vw] flex-col items-stretch gap-6 sm:max-w-[52rem] lg:w-auto lg:max-w-none">
          {/* Desktop: pill + compact hover menu (sans) */}
          <div className="hidden w-full justify-center lg:flex">
            <div
              className="group relative flex w-full max-w-[56rem] flex-col items-center"
              onMouseEnter={() => setDesktopMenuHover(true)}
              onMouseLeave={() => setDesktopMenuHover(false)}
            >
              <motion.div
                className="relative flex h-12 w-full max-w-[56rem] items-stretch overflow-hidden rounded-xl bg-white shadow-[0_8px_40px_-12px_rgba(0,0,0,0.28)] sm:h-[3.4375rem]"
                initial={reduceMotion ? false : { opacity: 0, y: -10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.55, ease: easeOut }}
              >
                <div className="flex min-w-0 flex-1 items-center justify-between gap-3 pl-6 pr-3 sm:pl-8 sm:pr-4">
                  <Link
                    href="#home"
                    aria-label={BRAND}
                    className="max-w-[min(46vw,11rem)] shrink-0 text-left sm:max-w-[12.5rem]"
                    onClick={() => {
                      closeMenu();
                      setHashFromHref("#home");
                    }}
                  >
                    <BrandWordmark />
                  </Link>

                  <nav
                    className="flex min-w-0 flex-1 items-center justify-center px-2"
                    aria-label="Primary"
                  >
                    <DesktopNavHomeLink
                      href={currentNavItem.href}
                      label={currentNavItem.label}
                      onHashNavigate={setHashFromHref}
                    />
                  </nav>

                  <div
                    className="flex h-full shrink-0 items-center pl-1 text-zinc-900"
                    aria-hidden
                  >
                    <TwoLineMenuGlyph className="w-[18px]" />
                  </div>
                </div>
              </motion.div>

              <AnimatePresence>
                {desktopMenuHover && (
                  <motion.div
                    className="absolute left-1/2 top-full z-[520] flex w-full max-w-[56rem] -translate-x-1/2 flex-col items-center pt-3"
                    initial={{ opacity: 0, y: -6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4, scale: 0.99 }}
                    transition={{ duration: reduceMotion ? 0.18 : 0.38, ease: easeOut }}
                    role="menu"
                    aria-label="All sections"
                  >
                    <div className="flex w-full flex-col items-center rounded-xl bg-white p-4 text-center shadow-[0_20px_60px_-18px_rgba(0,0,0,0.3)] ring-1 ring-black/[0.05] sm:p-5">
                      <p className="w-full text-left text-[11px] font-semibold uppercase tracking-[0.32em] text-zinc-400">
                        Menu
                      </p>
                      <motion.ul
                        className="mt-3 flex w-full flex-col gap-0"
                        variants={menuList}
                        initial="hidden"
                        animate="show"
                        exit="exit"
                      >
                        {SITE_NAV_ITEMS.map((item) => (
                          <motion.li key={item.href} variants={rowVariants}>
                            <DesktopMenuRowLink
                              item={item}
                              active={hash === item.href}
                              onNavigate={onDesktopNavClick}
                            />
                          </motion.li>
                        ))}
                      </motion.ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile: compact bar + sheet */}
          <div className="relative z-[510] lg:hidden">
            <div className="overflow-hidden rounded-2xl border border-white/[0.12] bg-black/20 p-1 backdrop-blur-xl">
              <div className="flex h-[3.25rem] items-center justify-between gap-3 rounded-xl bg-white px-4">
                <Link
                  href="#home"
                  aria-label={BRAND}
                  className="min-w-0 flex-1 text-left"
                  onClick={() => {
                    closeMenu();
                    setHashFromHref("#home");
                  }}
                >
                  <BrandWordmark compact />
                </Link>
                <button
                  type="button"
                  className="flex shrink-0 items-center gap-2 rounded-lg px-2 py-1.5 text-[13px] font-medium text-zinc-800 transition-colors hover:bg-zinc-100"
                  aria-expanded={menuOpen}
                  aria-controls={panelId}
                  aria-label={menuOpen ? "Close menu" : "Open menu"}
                  onClick={() => setMenuOpen((o) => !o)}
                >
                  <span>{menuOpen ? "Close" : "Menu"}</span>
                  <MobileMenuGlyph open={menuOpen} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {menuOpen && (
          <motion.div
            id={panelId}
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            className="fixed inset-0 z-[480] lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: easeOut }}
          >
            <motion.button
              type="button"
              className="absolute inset-0 bg-black/35 backdrop-blur-[2px]"
              aria-label="Close menu overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMenu}
            />

            <nav
              className="absolute inset-x-0 top-[4.75rem] bottom-0 mx-3 flex w-[calc(100vw-1.5rem)] max-w-none flex-col sm:top-[5.25rem] sm:mx-4 sm:w-[calc(100vw-2rem)]"
              aria-label="Mobile primary"
            >
              <div className="relative flex size-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-black/15 p-1 backdrop-blur-md">
                <motion.div
                  className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-[1.25rem] bg-white"
                  initial={
                    reduceMotion
                      ? { opacity: 0, y: 12 }
                      : { opacity: 0, y: 28, filter: "blur(14px)" }
                  }
                  animate={
                    reduceMotion
                      ? { opacity: 1, y: 0 }
                      : { opacity: 1, y: 0, filter: "blur(0px)" }
                  }
                  exit={
                    reduceMotion
                      ? { opacity: 0, y: 8 }
                      : { opacity: 0, y: 16, filter: "blur(10px)" }
                  }
                  transition={{ duration: 0.42, ease: easeOut }}
                >
                  <div className="flex h-[calc(100dvh-6.5rem)] min-h-[20rem] w-full flex-col justify-between border-t border-black/10 px-5 py-6 sm:h-auto sm:min-h-[min(70vh,32rem)] sm:gap-8 sm:border-t-0 sm:px-8 sm:py-8">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-zinc-400">
                        Menu
                      </p>
                      <motion.ul
                        className="mt-3 flex flex-col gap-0"
                        variants={menuList}
                        initial="hidden"
                        animate="show"
                        exit="exit"
                      >
                        {SITE_NAV_ITEMS.map((item) => (
                          <motion.li key={item.href} variants={rowVariants}>
                            <Link
                              href={item.href}
                              className={`flex items-center gap-3 rounded-lg px-2 py-2 text-[15px] font-medium leading-snug tracking-wide transition-colors hover:bg-zinc-50 ${
                                hash === item.href
                                  ? "text-[#ff2c6b] hover:text-[#ff2c6b]"
                                  : "text-zinc-900 hover:text-[#ff2c6b]"
                              }`}
                              onClick={() => {
                                closeMenu();
                                setHashFromHref(item.href);
                              }}
                            >
                              <NavMenuIcon
                                id={item.icon}
                                className={`size-[17px] shrink-0 ${
                                  hash === item.href ? "opacity-100" : "opacity-70"
                                }`}
                              />
                              <span>{item.label}</span>
                            </Link>
                          </motion.li>
                        ))}
                      </motion.ul>
                    </div>
                    <p className="text-zinc-400">
                      <BrandWordmark compact muted />
                    </p>
                  </div>
                </motion.div>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/** Current section label in the pill — updates with the URL hash. */
function DesktopNavHomeLink({
  href,
  label,
  onHashNavigate,
}: {
  href: string;
  label: string;
  onHashNavigate: (href: string) => void;
}) {
  return (
    <Link
      href={href}
      onClick={() => onHashNavigate(href)}
      className="min-w-0 max-w-[min(42vw,11rem)] truncate whitespace-nowrap rounded-xl px-3 py-2 text-center text-[13px] font-semibold tracking-wide text-zinc-900 transition-colors hover:bg-zinc-100 hover:text-[#ff2c6b] sm:max-w-[13rem] sm:text-[14px]"
    >
      {label}
    </Link>
  );
}

function DesktopMenuRowLink({
  item,
  active,
  onNavigate,
}: {
  item: NavItem;
  active: boolean;
  onNavigate: (href: string) => void;
}) {
  return (
    <Link
      href={item.href}
      role="menuitem"
      onClick={() => onNavigate(item.href)}
      className={`flex w-full items-center justify-center gap-3 rounded-lg px-3 py-2.5 text-[16px] font-medium leading-snug tracking-wide transition-colors hover:bg-zinc-50 sm:text-[17px] ${
        active
          ? "text-[#ff2c6b] hover:text-[#ff2c6b]"
          : "text-zinc-900 hover:text-[#ff2c6b]"
      }`}
    >
      <NavMenuIcon
        id={item.icon}
        className={`shrink-0 sm:size-5 ${
          active ? "opacity-100" : "opacity-70"
        }`}
      />
      <span>{item.label}</span>
    </Link>
  );
}

function TwoLineMenuGlyph({ className }: { className?: string }) {
  return (
    <span
      className={`relative block h-3 w-[18px] shrink-0 ${className ?? ""}`}
      aria-hidden
    >
      <span className="absolute left-0 top-0 block h-px w-full rounded-full bg-zinc-900 transition-[top,opacity] duration-300 ease-out group-hover:top-[5px]" />
      <span className="absolute left-0 top-[9px] block h-px w-full rounded-full bg-zinc-900 transition-opacity duration-300 ease-out group-hover:opacity-0" />
    </span>
  );
}

function MobileMenuGlyph({ open }: { open: boolean }) {
  return (
    <span className="relative block h-3 w-[14px] shrink-0">
      <span
        className={`absolute left-0 top-0.5 block h-px w-full origin-center rounded-full bg-zinc-900 transition-transform duration-300 ease-out ${
          open ? "top-[5px] rotate-45" : ""
        }`}
      />
      <span
        className={`absolute left-0 top-[9px] block h-px w-full origin-center rounded-full bg-zinc-900 transition-transform duration-300 ease-out ${
          open ? "top-[5px] -rotate-45" : ""
        }`}
      />
    </span>
  );
}
