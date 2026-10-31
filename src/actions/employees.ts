"use server";

import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin, requireUser } from "@/lib/auth";
import { ActionState, done, emptyToUndef, fail, firstError, formObject, refreshDashboard } from "@/lib/action";
import { parseDay } from "@/lib/format";

const base = {
  name: z.string().trim().min(1, "Full name is required.").max(120),
  email: z.string().trim().toLowerCase().email("Enter a valid work email."),
  designation: z.string().trim().min(1, "Designation is required.").max(80),
  mobile: z.preprocess(emptyToUndef, z.string().trim().max(30).optional()),
  dob: z.preprocess(emptyToUndef, z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional()),
  photoUrl: z.preprocess(emptyToUndef, z.string().trim().url().startsWith("https://", "Photo URL must start with https://").max(500).optional()),
};

const adminSchema = z.object({
  id: z.preprocess(emptyToUndef, z.string().optional()),
  ...base,
  systemRole: z.enum(["EMPLOYEE", "ADMIN"]),
  status: z.enum(["ACTIVE", "SUSPENDED"]),
  password: z.preprocess(emptyToUndef, z.string().min(8, "Password must be at least 8 characters.").max(100).optional()),
});

const isDuplicate = (e: unknown) => e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002";

export async function saveEmployee(_: ActionState, fd: FormData): Promise<ActionState> {
  const admin = await requireAdmin();
  const parsed = adminSchema.safeParse(formObject(fd));
  if (!parsed.success) return fail(firstError(parsed.error));
  const { id, password, dob, ...rest } = parsed.data;

  if (!id && !password) return fail("Set an initial password for the new employee.");
  if (id === admin.id && (rest.status !== "ACTIVE" || rest.systemRole !== "ADMIN")) {
    return fail("You cannot suspend or demote your own account.");
  }

  const data = {
    ...rest,
    dob: dob ? parseDay(dob) : null,
    mobile: rest.mobile ?? null,
    photoUrl: rest.photoUrl ?? null,
    ...(password ? { passwordHash: await bcrypt.hash(password, 12) } : {}),
  };
  try {
    if (id) await prisma.employee.update({ where: { id }, data });
    else await prisma.employee.create({ data: { ...data, passwordHash: data.passwordHash! } });
  } catch (e) {
    if (isDuplicate(e)) return fail("An employee with this email already exists.");
    throw e;
  }
  refreshDashboard();
  return done("Employee saved.");
}

const profileSchema = z.object(base);

/** Lets any signed-in user update their own profile (never role/status). */
export async function updateProfile(_: ActionState, fd: FormData): Promise<ActionState> {
  const user = await requireUser();
  const parsed = profileSchema.safeParse(formObject(fd));
  if (!parsed.success) return fail(firstError(parsed.error));
  const { dob, ...rest } = parsed.data;
  try {
    await prisma.employee.update({
      where: { id: user.id },
      data: { ...rest, dob: dob ? parseDay(dob) : null, mobile: rest.mobile ?? null, photoUrl: rest.photoUrl ?? null },
    });
  } catch (e) {
    if (isDuplicate(e)) return fail("Another employee already uses this email.");
    throw e;
  }
  refreshDashboard();
  return done("Profile updated.");
}
