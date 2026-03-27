"use client";

import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { getAdminToken } from "@/admin/auth";
import { apiUrl } from "@/lib/api";

type DeleteConfirmTarget = { id: string; name: string; email: string };

type Lead = {
  id: string;
  submittedAt: string;
  name: string;
  email: string;
  phoneNumber: string;
  company: string | null;
  service: string;
  message: string | null;
  remark: string | null;
  isReviewed: boolean;
};

type LeadsResponse = {
  totalLeads: number;
  activeLeads: number;
  filteredCount: number;
  leads: Lead[];
};

export default function LeadsPage() {
  const now = new Date();
  const [range, setRange] = useState<"all" | "today" | "last_week" | "last_month">("all");
  const [reviewed, setReviewed] = useState<"all" | "reviewed" | "not_reviewed">("all");
  const [year, setYear] = useState<number>(now.getFullYear());
  const [month, setMonth] = useState<number>(now.getMonth() + 1);
  const [data, setData] = useState<LeadsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<DeleteConfirmTarget | null>(null);
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});
  const [remarkDrafts, setRemarkDrafts] = useState<Record<string, string>>({});
  const [savingRemarkId, setSavingRemarkId] = useState<string | null>(null);

  function notifyAnalyticsRefresh() {
    try {
      localStorage.setItem("analytics_refresh_tick", String(Date.now()));
    } catch {
      /* ignore */
    }
    window.dispatchEvent(new CustomEvent("analytics:data-updated"));
  }

  const loadLeads = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({
        range,
        reviewed,
        year: String(year),
        month: String(month),
        ...(searchQuery ? { search: searchQuery } : {}),
      });
      const response = await fetch(apiUrl(`/leads?${params.toString()}`), {
        headers: { Authorization: `Bearer ${getAdminToken()}` },
      });
      if (!response.ok) throw new Error("Failed to load leads");
      const json = (await response.json()) as LeadsResponse;
      setData(json);
      setRemarkDrafts((prev) => {
        const next = { ...prev };
        for (const lead of json.leads) {
          if (next[lead.id] === undefined) next[lead.id] = lead.remark ?? "";
        }
        return next;
      });
    } catch (e) {
      const message =
        e instanceof TypeError
          ? "Cannot reach the API. Start backend (root: npm run dev, or backend: npm run dev)."
          : e instanceof Error
            ? e.message
            : "Failed to load leads";
      setError(message);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [range, reviewed, year, month, searchQuery]);

  useEffect(() => {
    void loadLeads();
  }, [loadLeads]);

  useEffect(() => {
    const onUpdated = () => void loadLeads();
    const onStorage = (e: StorageEvent) => {
      if (e.key === "analytics_refresh_tick") void loadLeads();
    };

    window.addEventListener("analytics:data-updated", onUpdated);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("analytics:data-updated", onUpdated);
      window.removeEventListener("storage", onStorage);
    };
  }, [loadLeads]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSearchQuery(searchInput.trim());
    }, 250);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    if (!deleteConfirm) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !deletingId) setDeleteConfirm(null);
    };
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [deleteConfirm, deletingId]);

  function toggleExpanded(id: string) {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  async function markReviewed(id: string) {
    try {
      const response = await fetch(apiUrl(`/leads/${id}/review`), {
        method: "PATCH",
        headers: { Authorization: `Bearer ${getAdminToken()}` },
      });
      if (!response.ok) throw new Error("Failed to update");
      await loadLeads();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Request failed");
    }
  }

  async function saveRemark(id: string) {
    setSavingRemarkId(id);
    setError("");
    try {
      const response = await fetch(apiUrl(`/leads/${id}/remark`), {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${getAdminToken()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ remark: remarkDrafts[id] ?? "" }),
      });
      if (!response.ok) throw new Error("Failed to update remark");
      await loadLeads();
      notifyAnalyticsRefresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSavingRemarkId(null);
    }
  }

  async function deleteLeadConfirmed(id: string) {
    setDeletingId(id);
    setError("");
    try {
      const response = await fetch(apiUrl(`/leads/${id}`), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getAdminToken()}` },
      });
      if (response.status === 404) throw new Error("Lead not found");
      if (!response.ok) throw new Error("Failed to delete lead");
      setDeleteConfirm(null);
      setExpandedIds((prev) => ({ ...prev, [id]: false }));
      await loadLeads();
      notifyAnalyticsRefresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
    } finally {
      setDeletingId(null);
    }
  }

  const years = useMemo(
    () => Array.from({ length: 8 }, (_, i) => now.getFullYear() - i),
    [now],
  );

  return (
    <div>
      {deleteConfirm ? (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-lead-dialog-title"
          aria-describedby="delete-lead-dialog-desc"
        >
          <button
            type="button"
            className={`absolute inset-0 bg-black/70 backdrop-blur-md ${deletingId ? "pointer-events-none" : ""}`}
            aria-label="Close dialog"
            onClick={() => setDeleteConfirm(null)}
          />
          <div className="relative w-full max-w-[420px] overflow-hidden rounded-2xl border border-white/12 bg-[#0a0a0c] shadow-[0_24px_80px_rgba(0,0,0,0.65)]">
            <div className="border-b border-white/[0.08] bg-gradient-to-br from-white/[0.06] to-transparent px-6 pb-5 pt-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-rose-500/25 bg-rose-500/10">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-rose-300" aria-hidden>
                    <path
                      d="M12 9v4M12 17h.01M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 002 2h6a2 2 0 002-2l1-12M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/40">Confirm action</p>
                  <h3
                    id="delete-lead-dialog-title"
                    className="mt-1 text-[22px] font-bold leading-[1.2] tracking-[-0.01em] text-white"
                  >
                    Delete this lead?
                  </h3>
                </div>
              </div>
            </div>
            <div id="delete-lead-dialog-desc" className="space-y-3 px-6 py-5">
              <p className="text-sm leading-relaxed text-white/65">
                You are about to permanently remove this lead from your database. This cannot be undone.
              </p>
              <div className="rounded-xl border border-white/10 bg-black/40 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-white/35">Lead</p>
                <p className="mt-1 truncate text-sm font-medium text-white">{deleteConfirm.name}</p>
                <p className="mt-0.5 truncate text-xs text-white/45">{deleteConfirm.email}</p>
              </div>
            </div>
            <div className="flex flex-col-reverse gap-2 border-t border-white/[0.08] bg-black/30 px-6 py-4 sm:flex-row sm:justify-end sm:gap-3">
              <button
                type="button"
                disabled={!!deletingId}
                className="rounded-xl border border-white/15 bg-transparent px-4 py-2.5 text-sm font-semibold text-white/85 transition hover:border-white/30 hover:bg-white/[0.04] disabled:opacity-50"
                onClick={() => setDeleteConfirm(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deletingId === deleteConfirm.id}
                className="rounded-xl bg-rose-500 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_8px_28px_rgba(244,63,94,0.35)] transition hover:bg-rose-400 disabled:opacity-50"
                onClick={() => void deleteLeadConfirmed(deleteConfirm.id)}
              >
                {deletingId === deleteConfirm.id ? "Deleting..." : "Delete permanently"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.34em] text-white/45">Leads</p>
          <h2 className="mt-2 font-[family-name:var(--font-display)] text-4xl text-white">
            Lead Management
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-black/45 px-5 py-3">
            <p className="text-xs uppercase tracking-[0.24em] text-white/45">Total Leads</p>
            <p className="mt-1 text-2xl font-semibold text-white">{data?.totalLeads ?? 0}</p>
            <p className="mt-0.5 text-[11px] text-white/40">Submitted all time</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/45 px-5 py-3">
            <p className="text-xs uppercase tracking-[0.24em] text-white/45">Active Leads</p>
            <p className="mt-1 text-2xl font-semibold text-white">{data?.activeLeads ?? 0}</p>
            <p className="mt-0.5 text-[11px] text-white/40">Currently in leads table</p>
          </div>
        </div>
      </header>

      <div className="rounded-2xl border border-white/10 bg-black/45 p-4">
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
          <div className="flex min-w-0 flex-wrap items-center gap-3">
            <div className="flex min-w-0 flex-wrap gap-2">
              {[
                ["all", "All"],
                ["today", "Today"],
                ["last_week", "Last Week"],
                ["last_month", "Last Month"],
              ].map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setRange(key as typeof range)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                    range === key ? "bg-white text-black" : "bg-white/10 text-white/80"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
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
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap justify-end gap-2 sm:ml-2">
            {[
              ["all", "All Status"],
              ["reviewed", "Reviewed"],
              ["not_reviewed", "Not Reviewed"],
            ].map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setReviewed(key as typeof reviewed)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                  reviewed === key ? "bg-white text-black" : "bg-white/10 text-white/80"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <label htmlFor="lead-search" className="sr-only">
            Search leads by name, email, phone or company
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-3 inline-flex items-center text-white/40">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M11 19a8 8 0 100-16 8 8 0 000 16zm10 2l-4.3-4.3"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <input
              id="lead-search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by name, email, phone, or company..."
              className="h-11 w-full rounded-xl border border-white/10 bg-black/65 pl-10 pr-10 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-white/25"
            />
            {searchInput ? (
              <button
                type="button"
                onClick={() => setSearchInput("")}
                className="absolute inset-y-0 right-2 inline-flex items-center rounded-lg px-2 text-white/45 transition hover:text-white/80"
                aria-label="Clear search"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {error ? (
        <p className="mt-4 rounded-xl border border-[#ffd6e1]/30 bg-[#ffd6e1]/10 px-4 py-3 text-sm text-[#ffd6e1]">
          {error}
        </p>
      ) : null}

      <div className="mt-5 overflow-hidden rounded-2xl border border-white/10">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse bg-black/35 text-left text-sm text-white/85">
            <thead className="bg-black/70 text-xs uppercase tracking-[0.22em] text-white/45">
              <tr>
                {["Date", "Name", "Email", "Phone", "Company", "Action", "Delete"].map((h) => (
                  <th key={h} className="px-4 py-3 font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(data?.leads ?? []).map((lead) => {
                const expanded = !!expandedIds[lead.id];
                return (
                  <Fragment key={lead.id}>
                    <tr key={lead.id} className="border-t border-white/10">
                      <td className="whitespace-nowrap px-4 py-3 text-white/70">
                        <button
                          type="button"
                          onClick={() => toggleExpanded(lead.id)}
                          className="group inline-flex items-center gap-2 rounded-lg px-1.5 py-1 transition hover:bg-white/[0.05]"
                          aria-label={expanded ? "Collapse row" : "Expand row"}
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            aria-hidden
                            className={`text-white/70 transition-transform ${expanded ? "rotate-180" : ""}`}
                          >
                            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <span>{new Date(lead.submittedAt).toLocaleString()}</span>
                        </button>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">{lead.name}</td>
                      <td className="whitespace-nowrap px-4 py-3">{lead.email}</td>
                      <td className="whitespace-nowrap px-4 py-3">{lead.phoneNumber}</td>
                      <td className="whitespace-nowrap px-4 py-3">{lead.company ?? "-"}</td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          disabled={lead.isReviewed}
                          onClick={() => void markReviewed(lead.id)}
                          className={`rounded-xl px-3 py-1.5 text-xs font-semibold ${
                            lead.isReviewed
                              ? "bg-emerald-500/20 text-emerald-200"
                              : "bg-white text-black hover:bg-white/90"
                          }`}
                        >
                          {lead.isReviewed ? "Reviewed" : "Review"}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          aria-label={`Delete lead ${lead.name}`}
                          disabled={deletingId === lead.id}
                          onClick={() =>
                            setDeleteConfirm({ id: lead.id, name: lead.name, email: lead.email })
                          }
                          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-white/[0.04] text-white/70 transition hover:border-rose-400/50 hover:bg-rose-500/15 hover:text-rose-200 disabled:opacity-40"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                            <path
                              d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 002 2h6a2 2 0 002-2l1-12M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2"
                              stroke="currentColor"
                              strokeWidth="1.7"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </td>
                    </tr>
                    {expanded ? (
                      <tr className="border-t border-white/5 bg-black/25">
                        <td colSpan={7} className="px-5 py-4">
                          <div className="grid grid-cols-1 gap-4 rounded-2xl border border-white/10 bg-black/35 p-4 lg:grid-cols-2">
                            <div>
                              <p className="text-[11px] uppercase tracking-[0.2em] text-white/45">Service</p>
                              <p className="mt-1.5 text-sm text-white/90">{lead.service || "-"}</p>
                            </div>
                            <div>
                              <p className="text-[11px] uppercase tracking-[0.2em] text-white/45">Message</p>
                              <p className="mt-1.5 text-sm text-white/75">{lead.message?.trim() || "-"}</p>
                            </div>
                            <div className="lg:col-span-2">
                              <p className="text-[11px] uppercase tracking-[0.2em] text-white/45">Remark</p>
                              <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                                <textarea
                                  value={remarkDrafts[lead.id] ?? ""}
                                  onChange={(e) =>
                                    setRemarkDrafts((prev) => ({ ...prev, [lead.id]: e.target.value }))
                                  }
                                  rows={2}
                                  placeholder="Add internal remark for this lead..."
                                  className="min-h-[70px] w-full resize-y rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-sm text-white outline-none transition focus:border-white/30"
                                />
                                <button
                                  type="button"
                                  disabled={savingRemarkId === lead.id}
                                  onClick={() => void saveRemark(lead.id)}
                                  className="shrink-0 rounded-xl border border-white/15 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/[0.1] disabled:opacity-50"
                                >
                                  {savingRemarkId === lead.id ? "Updating..." : "Update"}
                                </button>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ) : null}
                  </Fragment>
                );
              })}
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-white/60">
                    Loading leads...
                  </td>
                </tr>
              ) : null}
              {!loading && (data?.leads.length ?? 0) === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-white/45">
                    No leads found for the current filters/search.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
