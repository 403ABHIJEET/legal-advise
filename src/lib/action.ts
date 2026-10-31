import type { ZodError } from "zod";
import { revalidatePath } from "next/cache";

export type ActionState = { ok: boolean; message: string } | null;

export const fail = (message: string): ActionState => ({ ok: false, message });
export const done = (message: string): ActionState => ({ ok: true, message });
export const firstError = (e: ZodError) => e.issues[0]?.message ?? "Invalid input.";

export function refreshDashboard() {
  revalidatePath("/dashboard", "layout");
}

export const formObject = (fd: FormData) => Object.fromEntries(fd.entries());

/** "" -> undefined so optional zod fields work with empty inputs. */
export const emptyToUndef = (v: unknown) => (typeof v === "string" && v.trim() === "" ? undefined : v);
