"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { createSession, destroySession } from "@/lib/session";
import { ActionState, done, fail, firstError, formObject } from "@/lib/action";

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
  password: z.string().min(1, "Enter your password."),
});

// Valid-format bcrypt hash; compared against when the email is unknown so timing doesn't reveal which emails exist.
const DUMMY_HASH = bcrypt.hashSync("not-a-real-password", 12);

export async function loginAction(_: ActionState, fd: FormData): Promise<ActionState> {
  try {
    const parsed = loginSchema.safeParse(formObject(fd));
    if (!parsed.success) return fail(firstError(parsed.error));

    const user = await prisma.employee.findUnique({ where: { email: parsed.data.email } });
    const ok = await bcrypt.compare(parsed.data.password, user?.passwordHash ?? DUMMY_HASH);
    if (!user || !ok || user.status !== "ACTIVE") return fail("Incorrect email or password.");

    await createSession(user.id);
    redirect("/dashboard");
  } catch (error) {
    return fail("An error occurred while logging in.");
  }
}

export async function logoutAction() {
  await destroySession();
  redirect("/");
}

const pwSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password."),
    newPassword: z.string().min(8, "Use at least 8 characters."),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, { message: "New passwords do not match.", path: ["confirmPassword"] });

export async function changePasswordAction(_: ActionState, fd: FormData): Promise<ActionState> {
  const user = await requireUser();
  const parsed = pwSchema.safeParse(formObject(fd));
  if (!parsed.success) return fail(firstError(parsed.error));

  const row = await prisma.employee.findUnique({ where: { id: user.id }, select: { passwordHash: true } });
  if (!row || !(await bcrypt.compare(parsed.data.currentPassword, row.passwordHash))) {
    return fail("Current password is incorrect.");
  }
  await prisma.employee.update({
    where: { id: user.id },
    data: { passwordHash: await bcrypt.hash(parsed.data.newPassword, 12) },
  });
  return done("Password changed.");
}
