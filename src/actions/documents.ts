"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin, requireUser } from "@/lib/auth";
import { ActionState, done, emptyToUndef, fail, firstError, formObject, refreshDashboard } from "@/lib/action";

const schema = z.object({
  title: z.string().trim().min(1, "Document title is required.").max(200),
  category: z.enum(["TEMPLATES", "PROCEDURE", "REFERENCE", "FORMS"]),
  driveUrl: z.preprocess(
    emptyToUndef,
    z.string().trim().url().regex(/^https:\/\/(drive|docs)\.google\.com\//i, "Please enter a valid Google Drive/Docs link.").optional(),
  ),
  tags: z.string().trim().max(200).default(""),
  description: z.string().trim().max(1000).default(""),
});

export async function saveDocument(_: ActionState, fd: FormData): Promise<ActionState> {
  await requireUser();
  const parsed = schema.safeParse(formObject(fd));
  if (!parsed.success) return fail(firstError(parsed.error));
  await prisma.document.create({ data: parsed.data });
  refreshDashboard();
  return done("Library entry added.");
}

export async function deleteDocument(fd: FormData) {
  await requireAdmin();
  const id = String(fd.get("id") ?? "");
  if (id) await prisma.document.delete({ where: { id } }).catch(() => null);
  refreshDashboard();
}
