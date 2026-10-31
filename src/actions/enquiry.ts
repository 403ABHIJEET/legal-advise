"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { AREAS_OF_LAW } from "@/lib/content";
import { ActionState, done, emptyToUndef, fail, firstError, formObject } from "@/lib/action";

const schema = z.object({
  name: z.string().trim().min(1, "Please enter your name.").max(120),
  mobile: z.string().trim().regex(/^[0-9+() -]{7,20}$/, "Enter a valid mobile number."),
  email: z.preprocess(emptyToUndef, z.string().trim().email("Enter a valid email address.").max(160).optional()),
  areaOfLaw: z.enum(AREAS_OF_LAW, { message: "Please select an area of law." }),
  query: z.string().trim().min(1, "Please describe your query.").max(3000),
  website: z.string().optional(), // honeypot
});

/** Public contact form. */
export async function submitEnquiry(_: ActionState, fd: FormData): Promise<ActionState> {
  const parsed = schema.safeParse(formObject(fd));
  if (!parsed.success) return fail(firstError(parsed.error));
  const { website, ...data } = parsed.data;
  if (website) return done("Thank you. Your enquiry has been received."); // bot: pretend success

  await prisma.enquiry.create({ data });
  revalidatePath("/dashboard/enquiries");
  return done("Thank you. Your enquiry has been received.");
}

const statusSchema = z.object({ id: z.string().min(1), status: z.enum(["NEW", "CONTACTED", "CLOSED"]) });

export async function updateEnquiryStatus(fd: FormData) {
  await requireAdmin();
  const p = statusSchema.safeParse(formObject(fd));
  if (!p.success) return;
  await prisma.enquiry.update({ where: { id: p.data.id }, data: { status: p.data.status } });
  revalidatePath("/dashboard/enquiries");
}

export async function deleteEnquiry(fd: FormData) {
  await requireAdmin();
  const id = String(fd.get("id") ?? "");
  if (id) await prisma.enquiry.delete({ where: { id } }).catch(() => null);
  revalidatePath("/dashboard/enquiries");
}
