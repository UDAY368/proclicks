"use client";

import { useEffect } from "react";
import { apiUrl } from "@/lib/api";

const VISIT_TRACKED_KEY = "portfolio_visit_tracked";

export function VisitTracker() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(VISIT_TRACKED_KEY)) return;

    fetch(apiUrl("/analytics/visit"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ route: window.location.pathname }),
    }).finally(() => {
      sessionStorage.setItem(VISIT_TRACKED_KEY, "1");
      const tick = String(Date.now());
      localStorage.setItem("analytics_refresh_tick", tick);
      window.dispatchEvent(new Event("analytics:data-updated"));
    });
  }, []);

  return null;
}
