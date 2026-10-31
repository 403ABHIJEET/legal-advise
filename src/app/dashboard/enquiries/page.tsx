import type { EnquiryStatus, Prisma } from "@prisma/client";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { getDict } from "@/lib/i18n";
import { ENQUIRY_STATUS, toOptions } from "@/lib/format";
import { PageHeader } from "@/components/ui/PageHeader";
import { AutoSubmitSelect } from "@/components/ui/AutoSubmitSelect";
import { ConfirmButton } from "@/components/ui/ConfirmButton";
import { deleteEnquiry, updateEnquiryStatus } from "@/actions/enquiry";

export default async function EnquiriesPage({ searchParams }: { searchParams: Promise<{ q?: string; status?: string }> }) {
  await requireAdmin();
  const { t } = await getDict();
  const { q = "", status = "" } = await searchParams;

  const where: Prisma.EnquiryWhereInput = {
    ...(Object.hasOwn(ENQUIRY_STATUS, status) ? { status: status as EnquiryStatus } : {}),
    ...(q ? { OR: [
      { name: { contains: q, mode: "insensitive" } },
      { mobile: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
      { areaOfLaw: { contains: q, mode: "insensitive" } },
      { query: { contains: q, mode: "insensitive" } },
    ] } : {}),
  };
  const enquiries = await prisma.enquiry.findMany({ where, orderBy: { createdAt: "desc" }, take: 500 });

  return (
    <>
      <PageHeader
        title="Public Enquiries" subtitle="General enquiries submitted through the public website contact form."
        action={<Link href="/api/enquiries/export" prefetch={false} className="btn btn-light no-underline">Export CSV</Link>}
      />
      <div className="panel">
        <form className="mb-[17px] flex flex-wrap items-center gap-2.5">
          <input name="q" defaultValue={q} placeholder="Search name, mobile, email, service or query…" className="field min-w-[100px] flex-1 max-sm:basis-full" />
          <select name="status" defaultValue={status} className="field w-auto">
            <option value="">{t("allStatuses")}</option>
            {toOptions(ENQUIRY_STATUS).map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <button className="btn btn-light">{t("search")}</button>
        </form>
        <div className="overflow-auto">
          <table className="tbl">
            <thead><tr><th>Received</th><th>Name</th><th>Mobile</th><th>Email</th><th>Area of law</th><th>Query</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {enquiries.map((e) => (
                <tr key={e.id}>
                  <td>{e.createdAt.toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "short" })}</td>
                  <td><b>{e.name}</b></td>
                  <td>{e.mobile}</td>
                  <td>{e.email ?? "—"}</td>
                  <td>{e.areaOfLaw}</td>
                  <td className="!min-w-[220px] !whitespace-normal">{e.query}</td>
                  <td>
                    <form action={updateEnquiryStatus}>
                      <input type="hidden" name="id" value={e.id} />
                      <AutoSubmitSelect name="status" defaultValue={e.status} className="field !w-auto !py-1.5 text-xs" aria-label="Enquiry status">
                        {toOptions(ENQUIRY_STATUS).map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </AutoSubmitSelect>
                    </form>
                  </td>
                  <td>
                    <form action={deleteEnquiry}>
                      <input type="hidden" name="id" value={e.id} />
                      <ConfirmButton message="Delete this enquiry permanently?" className="text-btn text-btn-danger">Delete</ConfirmButton>
                    </form>
                  </td>
                </tr>
              ))}
              {enquiries.length === 0 && <tr><td colSpan={8}>No enquiries found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
