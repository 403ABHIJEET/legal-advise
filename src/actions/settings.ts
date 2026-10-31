"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { ActionState, done, emptyToUndef, fail, firstError, formObject } from "@/lib/action";

const schema = z.object({
  address: z.string().trim().max(300).default(""),
  phone: z.string().trim().max(60).default(""),
  email: z.preprocess(emptyToUndef, z.string().trim().email("Enter a valid email.").max(160).optional()),
  mapUrl: z.preprocess(emptyToUndef, z.string().trim().url("Enter a valid map link.").startsWith("https://", "Map link must start with https://").max(1000).optional()),
});

export async function saveSettings(_: ActionState, fd: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = schema.safeParse(formObject(fd));
  if (!parsed.success) return fail(firstError(parsed.error));
  const data = { ...parsed.data, email: parsed.data.email ?? "", mapUrl: parsed.data.mapUrl ?? "" };
  await prisma.siteSettings.upsert({ where: { id: 1 }, update: data, create: { id: 1, ...data } });
  revalidatePath("/");
  revalidatePath("/dashboard/settings");
  return done("Public contact details updated.");
}
