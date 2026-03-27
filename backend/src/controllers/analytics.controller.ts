import type { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { sha256 } from "../lib/hash.js";
import { getTotalSubmittedLeads } from "../lib/leadCounters.js";

function firstQueryParam(value: unknown): unknown {
  if (Array.isArray(value)) return value[0];
  return value;
}

const analyticsQuerySchema = z.object({
  mode: z.enum(["day", "month"]).default("day"),
  year: z.preprocess(
    firstQueryParam,
    z.coerce.number().int().min(2020).max(2100),
  ),
  month: z.preprocess(
    (v) => {
      const x = firstQueryParam(v);
      if (x === undefined || x === "") return undefined;
      return x;
    },
    z.coerce.number().int().min(1).max(12).optional(),
  ),
});

function startOfMonth(year: number, month: number): Date {
  return new Date(year, month - 1, 1);
}

function endOfMonth(year: number, month: number): Date {
  return new Date(year, month, 1);
}

export async function createVisit(req: Request, res: Response): Promise<void> {
  const route = typeof req.body?.route === "string" ? req.body.route.slice(0, 120) : "/";
  const userAgent = req.headers["user-agent"]?.slice(0, 256) ?? null;
  const ipHeader = req.headers["x-forwarded-for"];
  const ip = Array.isArray(ipHeader) ? ipHeader[0] : (ipHeader ?? req.socket.remoteAddress ?? "");
  const ipHash = ip ? sha256(ip) : null;

  await prisma.visit.create({
    data: {
      route,
      userAgent,
      ipHash,
    },
  });

  res.status(201).json({ ok: true });
}

export async function getAnalyticsOverview(req: Request, res: Response): Promise<void> {
  const parsed = analyticsQuerySchema.safeParse(req.query as Record<string, unknown>);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid analytics filter query" });
    return;
  }

  const { mode, year, month } = parsed.data;
  const targetMonth = month ?? new Date().getMonth() + 1;

  const from = startOfMonth(year, targetMonth);
  const to = endOfMonth(year, targetMonth);

  const [totalVisits, totalSubmittedLeads, activeLeads, visitsInRange, leadsInRange] = await Promise.all([
    prisma.visit.count(),
    getTotalSubmittedLeads(),
    prisma.lead.count(),
    prisma.visit.findMany({
      where: { visitedAt: { gte: from, lt: to } },
      select: { visitedAt: true },
    }),
    prisma.lead.findMany({
      where: { submittedAt: { gte: from, lt: to } },
      select: { submittedAt: true },
    }),
  ]);

  if (mode === "month") {
    const visitsByMonth = Array.from({ length: 12 }, (_, i) => ({
      label: new Date(year, i, 1).toLocaleString("en-US", { month: "short" }),
      value: 0,
    }));
    const leadsByMonth = visitsByMonth.map((x) => ({ ...x }));

    const startYear = new Date(year, 0, 1);
    const endYear = new Date(year + 1, 0, 1);

    const [yearVisits, yearLeads] = await Promise.all([
      prisma.visit.findMany({
        where: { visitedAt: { gte: startYear, lt: endYear } },
        select: { visitedAt: true },
      }),
      prisma.lead.findMany({
        where: { submittedAt: { gte: startYear, lt: endYear } },
        select: { submittedAt: true },
      }),
    ]);

    for (const row of yearVisits) {
      visitsByMonth[row.visitedAt.getMonth()]!.value += 1;
    }
    for (const row of yearLeads) {
      leadsByMonth[row.submittedAt.getMonth()]!.value += 1;
    }

    res.json({
      totals: {
        totalVisits,
        totalLeads: totalSubmittedLeads,
        activeLeads,
        periodVisits: yearVisits.length,
        periodLeads: yearLeads.length,
      },
      charts: { visits: visitsByMonth, leads: leadsByMonth },
    });
    return;
  }

  const dayCount = new Date(year, targetMonth, 0).getDate();
  const visitsByDay = Array.from({ length: dayCount }, (_, i) => ({
    label: String(i + 1),
    value: 0,
  }));
  const leadsByDay = visitsByDay.map((x) => ({ ...x }));

  for (const row of visitsInRange) {
    visitsByDay[row.visitedAt.getDate() - 1]!.value += 1;
  }
  for (const row of leadsInRange) {
    leadsByDay[row.submittedAt.getDate() - 1]!.value += 1;
  }

  res.json({
    totals: {
      totalVisits,
      totalLeads: totalSubmittedLeads,
      activeLeads,
      periodVisits: visitsInRange.length,
      periodLeads: leadsInRange.length,
    },
    charts: { visits: visitsByDay, leads: leadsByDay },
  });
}
