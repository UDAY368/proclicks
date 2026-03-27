"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getAdminToken } from "@/admin/auth";
import { BarChart } from "@/admin/BarChart";
import { apiUrl } from "@/lib/api";

type AnalyticsResponse = {
  totals: {
    totalVisits: number;
    totalLeads: number;
    activeLeads: number;
    /** Counts for the current chart range (selected month in day mode, selected year in month mode). */
    periodVisits?: number;
    periodLeads?: number;
  };
  charts: {
    visits: Array<{ label: string; value: number }>;
    leads: Array<{ label: string; value: number }>;
  };
};

export default function AnalyticsPage() {
  const now = new Date();
  const [mode, setMode] = useState<"day" | "month">("day");
  const [activeSeries, setActiveSeries] = useState<"visits" | "leads">("visits");
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [error, setError] = useState("");
  const [refreshTick, setRefreshTick] = useState(0);

  const load = useCallback(async () => {
    setError("");
    try {
      const params = new URLSearchParams({
        mode,
        year: String(year),
        ...(mode === "day" ? { month: String(month) } : {}),
      });
      const response = await fetch(apiUrl(`/admin/analytics?${params.toString()}`), {
        headers: {
          Authorization: `Bearer ${getAdminToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to load analytics");
      }
      const json = (await response.json()) as AnalyticsResponse;
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    }
  }, [mode, year, month]);

  useEffect(() => {
    load();
  }, [load, refreshTick]);

  useEffect(() => {
    const refresh = () => setRefreshTick((x) => x + 1);
    const onVisibility = () => {
      if (document.visibilityState === "visible") refresh();
    };
    const onStorage = (event: StorageEvent) => {
      if (event.key === "analytics_refresh_tick") refresh();
    };

    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("storage", onStorage);
    window.addEventListener("analytics:data-updated", refresh);

    return () => {
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("analytics:data-updated", refresh);
    };
  }, []);

  const years = useMemo(
    () => Array.from({ length: 8 }, (_, i) => now.getFullYear() - i),
    [now],
  );

  const monthName = useMemo(
    () => new Date(2000, month - 1, 1).toLocaleString("en-US", { month: "long" }),
    [month],
  );

  const leadsChartData = data?.charts.leads ?? [];
  const visitsChartData = data?.charts.visits ?? [];

  const axisHint =
    mode === "day"
      ? `Day of month — ${monthName} ${year}`
      : `Month of year — ${year}`;
  const selectedChartData =
    activeSeries === "visits" ? visitsChartData : leadsChartData;

  return (
    <div className="flex min-h-0 flex-col">
      <header className="mb-4 shrink-0">
        <p className="text-[11px] uppercase tracking-[0.34em] text-white/45">Analytics</p>
        <h2 className="mt-1 font-[family-name:var(--font-display)] text-2xl text-white sm:text-3xl">
          Performance Overview
        </h2>
      </header>

      <div className="grid shrink-0 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 sm:gap-4">
        <div className="rounded-2xl border border-white/10 bg-black/45 p-4">
          <p className="text-xs uppercase tracking-[0.24em] text-white/45">Total Visits</p>
          <p className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
            {data?.totals.periodVisits ?? data?.totals.totalVisits ?? 0}
          </p>
          <p className="mt-1 text-[11px] text-white/35">
            All time: {data?.totals.totalVisits ?? 0}
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/45 p-4">
          <p className="text-xs uppercase tracking-[0.24em] text-white/45">Total Leads</p>
          <p className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
            {data?.totals.totalLeads ?? 0}
          </p>
          <p className="mt-1 text-[11px] text-white/35">
            Submitted leads (all time)
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/45 p-4">
          <p className="text-xs uppercase tracking-[0.24em] text-white/45">Active Leads</p>
          <p className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
            {data?.totals.activeLeads ?? 0}
          </p>
          <p className="mt-1 text-[11px] text-white/35">
            Current leads in table
          </p>
        </div>
      </div>

      <div className="mt-4 flex shrink-0 flex-wrap gap-2 rounded-2xl border border-white/10 bg-black/45 p-3 sm:gap-3">
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value as "day" | "month")}
          className="rounded-xl border border-white/10 bg-black/70 px-3 py-2 text-sm text-white"
        >
          <option value="day">Daywise</option>
          <option value="month">Monthwise</option>
        </select>

        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="rounded-xl border border-white/10 bg-black/70 px-3 py-2 text-sm text-white"
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>

        {mode === "day" ? (
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="rounded-xl border border-white/10 bg-black/70 px-3 py-2 text-sm text-white"
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m}>
                {new Date(2000, m - 1, 1).toLocaleString("en-US", { month: "long" })}
              </option>
            ))}
          </select>
        ) : null}

        <div className="ml-auto flex overflow-hidden rounded-xl border border-white/10">
          <button
            type="button"
            onClick={() => setActiveSeries("leads")}
            className={`px-4 py-2 text-sm font-medium transition ${
              activeSeries === "leads"
                ? "bg-white text-black"
                : "bg-black/60 text-white/75 hover:text-white"
            }`}
          >
            Total Leads
          </button>
          <button
            type="button"
            onClick={() => setActiveSeries("visits")}
            className={`px-4 py-2 text-sm font-medium transition ${
              activeSeries === "visits"
                ? "bg-white text-black"
                : "bg-black/60 text-white/75 hover:text-white"
            }`}
          >
            Total Visits
          </button>
        </div>
      </div>

      {error ? <p className="mt-3 shrink-0 text-sm text-[#ffd6e1]">{error}</p> : null}

      <div className="mt-4 min-h-0 flex-1">
        <BarChart
          title={activeSeries === "visits" ? "Total Visits" : "Total Leads"}
          axisHint={axisHint}
          data={selectedChartData}
        />
      </div>
    </div>
  );
}
