"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { ActionState, done, fail, firstError, formObject, refreshDashboard } from "@/lib/action";

const schema = z.object({
  title: z.string().trim().min(1, "Service title is required.").max(120),
  description: z.string().trim().min(1, "Description is required.").max(600),
  language: z.enum(["BOTH", "ENGLISH", "HINDI"]),
  status: z.enum(["DRAFT", "PUBLISHED"]),
});

export async function saveCampaign(_: ActionState, fd: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = schema.safeParse(formObject(fd));
  if (!parsed.success) return fail(firstError(parsed.error));
  await prisma.campaign.create({ data: parsed.data });
  refreshDashboard();
  revalidatePath("/");
  return done("Service advert saved.");
}

export async function toggleCampaign(fd: FormData) {
  await requireAdmin();
  const id = String(fd.get("id") ?? "");
  const c = id ? await prisma.campaign.findUnique({ where: { id } }) : null;
  if (!c) return;
  await prisma.campaign.update({
    where: { id },
    data: { status: c.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED" },
  });
  refreshDashboard();
  revalidatePath("/");
}

export async function deleteCampaign(fd: FormData) {
  await requireAdmin();
  const id = String(fd.get("id") ?? "");
  if (id) await prisma.campaign.delete({ where: { id } }).catch(() => null);
  refreshDashboard();
  revalidatePath("/");
}
