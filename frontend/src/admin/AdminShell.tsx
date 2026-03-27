"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { clearAdminToken } from "./auth";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  const links = [
    {
      href: "/admin/dashboard/analytics",
      label: "Analytics",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M4 19h16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          <path d="M7 16V9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          <path d="M12 16V5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          <path d="M17 16v-3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      href: "/admin/dashboard/leads",
      label: "Leads",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
          <rect x="4" y="5" width="16" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.7" />
          <path d="M8 10h8M8 14h6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
      ),
    },
  ];

  return (
    <div className="h-dvh min-h-0 overflow-hidden bg-[#050506] text-white">
      <div
        className={`mx-auto grid h-full min-h-0 w-full max-w-[1600px] grid-cols-1 grid-rows-[auto_minmax(0,1fr)] gap-5 px-4 py-5 sm:gap-6 sm:px-6 sm:py-6 lg:grid-rows-1 lg:px-8 ${
          collapsed ? "lg:grid-cols-[88px_minmax(0,1fr)]" : "lg:grid-cols-[260px_minmax(0,1fr)]"
        }`}
      >
        <aside className="flex min-h-0 shrink-0 flex-col overflow-hidden rounded-3xl border border-white/10 bg-black/50 p-4 shadow-[0_28px_90px_rgba(0,0,0,0.55)] backdrop-blur-xl sm:p-5 lg:h-full lg:min-h-0">
          <div className="flex shrink-0 items-start justify-between gap-2">
            <div className={collapsed ? "hidden" : "block"}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.36em] text-white/45">
                Admin Panel
              </p>
              <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl text-white">
                Pro Capture
              </h1>
            </div>
            <button
              type="button"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              onClick={() => setCollapsed((v) => !v)}
              className="ml-auto inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-white/80 transition hover:border-white/25 hover:text-white"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <nav
            className={`min-h-0 flex-1 overflow-y-auto ${collapsed ? "mt-6 space-y-2" : "mt-8 space-y-2"}`}
          >
            {links.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={collapsed ? item.label : undefined}
                  className={`flex items-center rounded-2xl border py-3 text-sm font-medium transition ${
                    collapsed ? "justify-center px-2" : "gap-3 px-4"
                  } ${
                    active
                      ? "border-white/20 bg-white text-black"
                      : "border-white/10 bg-white/[0.03] text-white/75 hover:border-white/20 hover:text-white"
                  }`}
                >
                  <span className="shrink-0">{item.icon}</span>
                  {!collapsed ? <span>{item.label}</span> : null}
                </Link>
              );
            })}
          </nav>

          <div className="shrink-0 pt-3">
            <button
              type="button"
              title={collapsed ? "Logout" : undefined}
              className={`w-full rounded-2xl border border-white/15 bg-black/60 py-3 text-sm font-semibold text-white/85 transition hover:border-white/30 hover:text-white ${
                collapsed ? "inline-flex items-center justify-center px-2" : "px-4"
              }`}
              onClick={() => {
                clearAdminToken();
                router.push("/admin");
              }}
            >
              {collapsed ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M10 17l5-5-5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M15 12H3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  <path d="M21 21V3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              ) : (
                "Logout"
              )}
            </button>
          </div>
        </aside>

        <main className="min-h-0 min-w-0 overflow-y-auto overflow-x-hidden rounded-3xl border border-white/10 bg-black/35 p-4 shadow-[0_28px_90px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-5 lg:max-h-full">
          {children}
        </main>
      </div>
    </div>
  );
}
