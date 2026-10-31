import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { readSession } from "@/lib/session";

export const getCurrentUser = cache(async () => {
  const session = await readSession();
  if (!session) return null;
  const user = await prisma.employee.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      name: true,
      email: true,
      designation: true,
      systemRole: true,
      status: true,
      mobile: true,
      dob: true,
      photoUrl: true,
    },
  });
  if (!user || user.status !== "ACTIVE") return null;
  return user;
});

export type CurrentUser = NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>;

/** Call at the top of every protected page and every server action. */
export async function requireUser(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function requireAdmin(): Promise<CurrentUser> {
  const user = await requireUser();
  if (user.systemRole !== "ADMIN") redirect("/dashboard");
  return user;
}

export const isAdmin = (u: CurrentUser) => u.systemRole === "ADMIN";

/** Prisma `where` fragments limiting what an employee can see. Admins see everything. */
export const caseScope = (u: CurrentUser) =>
  isAdmin(u) ? {} : { OR: [{ leadId: u.id }, { supportId: u.id }] };

export const eventScope = (u: CurrentUser) =>
  isAdmin(u)
    ? {}
    : {
        OR: [
          { caseId: null },
          { case: { OR: [{ leadId: u.id }, { supportId: u.id }] } },
        ],
      };
