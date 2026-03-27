import { prisma } from "./prisma.js";

const TOTAL_SUBMITTED_LEADS_KEY = "total_submitted_leads";

function parseCounter(value: string | null | undefined): number {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

export async function getTotalSubmittedLeads(): Promise<number> {
  const counter = await prisma.appConfig.findUnique({
    where: { key: TOTAL_SUBMITTED_LEADS_KEY },
    select: { value: true },
  });
  if (counter) return parseCounter(counter.value);

  const activeLeads = await prisma.lead.count();
  await prisma.appConfig.create({
    data: { key: TOTAL_SUBMITTED_LEADS_KEY, value: String(activeLeads) },
  });
  return activeLeads;
}

export async function bumpTotalSubmittedLeads(): Promise<number> {
  const [counter, activeLeads] = await Promise.all([
    prisma.appConfig.findUnique({
      where: { key: TOTAL_SUBMITTED_LEADS_KEY },
      select: { value: true },
    }),
    prisma.lead.count(),
  ]);

  const current = counter ? parseCounter(counter.value) : activeLeads;
  const next = current + 1;

  await prisma.appConfig.upsert({
    where: { key: TOTAL_SUBMITTED_LEADS_KEY },
    update: { value: String(next) },
    create: { key: TOTAL_SUBMITTED_LEADS_KEY, value: String(next) },
  });

  return next;
}
