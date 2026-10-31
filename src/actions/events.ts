"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { isAdmin, requireUser } from "@/lib/auth";
import { ActionState, done, emptyToUndef, fail, firstError, formObject, refreshDashboard } from "@/lib/action";
import { parseDay } from "@/lib/format";

const schema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a valid date."),
  title: z.string().trim().min(1, "Event title is required.").max(200),
  type: z.enum(["OFFICE", "HEARING", "DEADLINE", "REMINDER"]),
  note: z.preprocess(emptyToUndef, z.string().max(1000).optional()),
});

export async function createEvent(_: ActionState, fd: FormData): Promise<ActionState> {
  const user = await requireUser();
  const parsed = schema.safeParse(formObject(fd));
  if (!parsed.success) return fail(firstError(parsed.error));
  const { date, ...rest } = parsed.data;
  await prisma.calendarEvent.create({ data: { ...rest, date: parseDay(date), createdById: user.id } });
  refreshDashboard();
  return done("Date marked.");
}

/** Removes events on a date. Employees can only remove events they created; admins can remove any. */
export async function deleteEventsOnDate(date: string): Promise<number> {
  const user = await requireUser();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return 0;
  const { count } = await prisma.calendarEvent.deleteMany({
    where: { date: parseDay(date), ...(isAdmin(user) ? {} : { createdById: user.id }) },
  });
  refreshDashboard();
  return count;
}

export async function deleteEvent(fd: FormData) {
  const user = await requireUser();
  const id = String(fd.get("id") ?? "");
  if (!id) return;
  await prisma.calendarEvent.deleteMany({
    where: { id, ...(isAdmin(user) ? {} : { createdById: user.id }) },
  });
  refreshDashboard();
}
