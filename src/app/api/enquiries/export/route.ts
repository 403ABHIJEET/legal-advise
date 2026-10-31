import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Prevent spreadsheet formula injection from user-submitted text.
const cell = (v: unknown) => {
  let s = String(v ?? "");
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return `"${s.replaceAll('"', '""')}"`;
};

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return Response.json(
        { success: false, error: { code: "UNAUTHENTICATED", message: "Authentication required" } },
        { status: 401 },
      );
    }
    if (user.systemRole !== "ADMIN") {
      return Response.json(
        { success: false, error: { code: "FORBIDDEN", message: "Administrator access required" } },
        { status: 403 },
      );
    }

    const rows = await prisma.enquiry.findMany({ orderBy: { createdAt: "desc" } });
    const header = ["Received", "Name", "Mobile", "Email", "Area of law", "Query", "Status"];
    const lines = [
      header,
      ...rows.map((e) => [e.createdAt.toISOString(), e.name, e.mobile, e.email ?? "", e.areaOfLaw, e.query, e.status]),
    ].map((r) => r.map(cell).join(","));

    return new Response("\ufeff" + lines.join("\r\n"), {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="pranj-legal-enquiries.csv"',
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Failed to export enquiries", error);
    return Response.json(
      { success: false, error: { code: "INTERNAL_SERVER_ERROR", message: "Failed to export enquiries" } },
      { status: 500 },
    );
  }
}
