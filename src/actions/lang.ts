"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function toggleLang() {
  const c = await cookies();
  c.set("lang", c.get("lang")?.value === "hi" ? "en" : "hi", {
    path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax",
  });
  revalidatePath("/dashboard", "layout");
}
