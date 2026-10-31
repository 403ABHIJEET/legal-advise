"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { isAdmin, requireAdmin, requireUser } from "@/lib/auth";
import { ActionState, done, emptyToUndef, fail, firstError, formObject, refreshDashboard } from "@/lib/action";
import { parseDay } from "@/lib/format";

const caseSchema = z.object({
  id: z.preprocess(emptyToUndef, z.string().optional()),
  title: z.string().trim().min(1, "Matter title is required.").max(200),
  caseType: z.string().trim().min(1).max(80),
  client: z.string().trim().min(1, "Client name is required.").max(160),
  number: z.string().trim().min(1, "Case number is required.").max(80),
  court: z.string().trim().min(1, "Court / forum is required.").max(160),
  nextDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a valid date."),
  status: z.enum(["ACTIVE", "PENDING", "CLOSED"]),
  leadId: z.preprocess(emptyToUndef, z.string().optional()),
  notes: z.preprocess(emptyToUndef, z.string().max(2000).optional()),
});

export async function saveCase(_: ActionState, fd: FormData): Promise<ActionState> {
  const user = await requireUser();
  const parsed = caseSchema.safeParse(formObject(fd));
  if (!parsed.success) return fail(firstError(parsed.error));
  const { id, leadId, nextDate, ...rest } = parsed.data;
  const date = parseDay(nextDate);

  let caseId = id;
  if (id) {
    const existing = await prisma.case.findUnique({ where: { id } });
    const allowed = existing && (isAdmin(user) || existing.leadId === user.id || existing.supportId === user.id);
    if (!allowed) return fail("You do not have access to this case.");
    await prisma.case.update({
      where: { id },
      data: { ...rest, nextDate: date, ...(isAdmin(user) && leadId ? { leadId } : {}) },
    });
  } else {
    const created = await prisma.case.create({
      data: { ...rest, nextDate: date, leadId: isAdmin(user) && leadId ? leadId : user.id },
    });
    caseId = created.id;
  }

  // Keep a hearing entry on the calendar for the next date.
  const hasEvent = await prisma.calendarEvent.findFirst({ where: { caseId, date } });
  if (!hasEvent) {
    await prisma.calendarEvent.create({
      data: { caseId, date, title: rest.title, type: "HEARING", note: rest.court, createdById: user.id },
    });
  }
  refreshDashboard();
  return done("Case saved.");
}

const assignSchema = z.object({
  id: z.string().min(1),
  leadId: z.string().min(1, "Choose a lead employee."),
  supportId: z.preprocess(emptyToUndef, z.string().optional()),
});

export async function assignCase(_: ActionState, fd: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = assignSchema.safeParse(formObject(fd));
  if (!parsed.success) return fail(firstError(parsed.error));
  const { id, leadId, supportId } = parsed.data;
  await prisma.case.update({
    where: { id },
    data: { leadId, supportId: supportId ?? null, assignedAt: new Date() },
  });
  refreshDashboard();
  return done("Assignment updated.");
}
