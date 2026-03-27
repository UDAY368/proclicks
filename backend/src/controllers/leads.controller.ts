import type { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { sha256 } from "../lib/hash.js";
import { bumpTotalSubmittedLeads, getTotalSubmittedLeads } from "../lib/leadCounters.js";

const createLeadSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email().max(160),
  phoneNumber: z.string().min(6).max(40),
  company: z.string().max(180).optional().nullable(),
  service: z.string().min(1).max(120),
  message: z.string().max(4000).optional().nullable(),
});

const listQuerySchema = z.object({
  range: z.enum(["all", "today", "last_week", "last_month"]).default("all"),
  year: z.coerce.number().int().min(2020).max(2100).optional(),
  month: z.coerce.number().int().min(1).max(12).optional(),
  reviewed: z.enum(["all", "reviewed", "not_reviewed"]).default("all"),
  search: z.string().trim().max(120).optional().default(""),
});

const updateRemarkSchema = z.object({
  remark: z.string().max(1200).optional().nullable(),
});

function normalize(input: string | null | undefined): string {
  return (input ?? "").trim().toLowerCase();
}

function buildDedupeHash(input: {
  name: string;
  email: string;
  phoneNumber: string;
  company?: string | null;
  service: string;
  message?: string | null;
}): string {
  return sha256(
    [
      normalize(input.name),
      normalize(input.email),
      normalize(input.phoneNumber),
      normalize(input.company),
      normalize(input.service),
      normalize(input.message),
    ].join("|"),
  );
}

export async function createLead(req: Request, res: Response): Promise<void> {
  const parsed = createLeadSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid lead payload" });
    return;
  }

  const payload = parsed.data;
  const dedupeHash = buildDedupeHash(payload);

  const existing = await prisma.lead.findUnique({
    where: { dedupeHash },
    select: { id: true },
  });

  if (existing) {
    res.status(409).json({ error: "Request Already Submitted" });
    return;
  }

  await getTotalSubmittedLeads();

  const lead = await prisma.lead.create({
    data: {
      name: payload.name.trim(),
      email: payload.email.trim().toLowerCase(),
      phoneNumber: payload.phoneNumber.trim(),
      company: payload.company?.trim() || null,
      service: payload.service.trim(),
      message: payload.message?.trim() || "",
      dedupeHash,
    },
    select: { id: true, submittedAt: true },
  });
  await bumpTotalSubmittedLeads();

  res.status(201).json({
    message: "Thank you we will get back to you",
    lead,
  });
}

function rangeStart(range: "all" | "today" | "last_week" | "last_month"): Date | null {
  const now = new Date();
  if (range === "all") return null;
  if (range === "today") return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (range === "last_week") return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
}

export async function listLeads(req: Request, res: Response): Promise<void> {
  const parsed = listQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid filter query" });
    return;
  }

  const { range, year, month, reviewed, search } = parsed.data;

  const where: {
    submittedAt?: { gte?: Date; lt?: Date };
    isReviewed?: boolean;
    OR?: Array<{
      name?: { contains: string; mode: "insensitive" };
      email?: { contains: string; mode: "insensitive" };
      phoneNumber?: { contains: string; mode: "insensitive" };
      company?: { contains: string; mode: "insensitive" };
    }>;
  } = {};

  const start = rangeStart(range);
  if (start) {
    where.submittedAt = { gte: start };
  }

  if (year) {
    const from = new Date(year, (month ?? 1) - 1, 1);
    const to = month ? new Date(year, month, 1) : new Date(year + 1, 0, 1);
    where.submittedAt = { ...(where.submittedAt ?? {}), gte: from, lt: to };
  }

  if (reviewed === "reviewed") where.isReviewed = true;
  if (reviewed === "not_reviewed") where.isReviewed = false;

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { phoneNumber: { contains: search, mode: "insensitive" } },
      { company: { contains: search, mode: "insensitive" } },
    ];
  }

  const [totalSubmittedLeads, activeLeads, leads] = await Promise.all([
    getTotalSubmittedLeads(),
    prisma.lead.count(),
    prisma.lead.findMany({
      where,
      orderBy: { submittedAt: "desc" },
      select: {
        id: true,
        submittedAt: true,
        name: true,
        email: true,
        phoneNumber: true,
        company: true,
        service: true,
        message: true,
        remark: true,
        isReviewed: true,
        reviewedAt: true,
      },
    }),
  ]);

  res.json({
    totalLeads: totalSubmittedLeads,
    activeLeads,
    filteredCount: leads.length,
    leads,
  });
}

export async function markLeadReviewed(req: Request, res: Response): Promise<void> {
  const idRaw = req.params.id;
  if (!idRaw || Array.isArray(idRaw)) {
    res.status(400).json({ error: "Lead id is required" });
    return;
  }
  const id = idRaw;

  const updated = await prisma.lead.update({
    where: { id },
    data: { isReviewed: true, reviewedAt: new Date() },
    select: { id: true, isReviewed: true, reviewedAt: true },
  });

  res.json({ message: "Lead marked as reviewed", lead: updated });
}

export async function deleteLead(req: Request, res: Response): Promise<void> {
  const idRaw = req.params.id;
  if (!idRaw || Array.isArray(idRaw)) {
    res.status(400).json({ error: "Lead id is required" });
    return;
  }
  const id = idRaw;

  const existing = await prisma.lead.findUnique({ where: { id }, select: { id: true } });
  if (!existing) {
    res.status(404).json({ error: "Lead not found" });
    return;
  }

  await prisma.lead.delete({ where: { id } });
  res.json({ ok: true });
}

export async function updateLeadRemark(req: Request, res: Response): Promise<void> {
  const idRaw = req.params.id;
  if (!idRaw || Array.isArray(idRaw)) {
    res.status(400).json({ error: "Lead id is required" });
    return;
  }

  const parsed = updateRemarkSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid remark payload" });
    return;
  }

  const remarkInput = parsed.data.remark;
  const remark = remarkInput?.trim() ? remarkInput.trim() : null;

  const updated = await prisma.lead.update({
    where: { id: idRaw },
    data: { remark },
    select: { id: true, remark: true },
  });

  res.json({ message: "Remark updated", lead: updated });
}
