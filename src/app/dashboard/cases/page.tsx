import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { caseScope, isAdmin, requireUser } from "@/lib/auth";
import { getDict } from "@/lib/i18n";
import { CASE_STATUS, dateKey, fmtDate, toOptions, todayKey } from "@/lib/format";
import { PageHeader } from "@/components/ui/PageHeader";
import { FormModal } from "@/components/ui/FormModal";
import { CaseForm } from "@/components/dashboard/forms";
import { CaseStatusTag } from "@/components/dashboard/StatusTag";
import { saveCase } from "@/actions/cases";

export default async function CasesPage({ searchParams }: { searchParams: Promise<{ q?: string; status?: string }> }) {
  const user = await requireUser();
  const { lang, t } = await getDict();
  const admin = isAdmin(user);
  const { q = "", status = "" } = await searchParams;

  const where: Prisma.CaseWhereInput = {
    AND: [
      caseScope(user),
      Object.hasOwn(CASE_STATUS, status) ? { status: status as keyof typeof CASE_STATUS } : {},
      q
        ? {
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { client: { contains: q, mode: "insensitive" } },
              { court: { contains: q, mode: "insensitive" } },
              { number: { contains: q, mode: "insensitive" } },
              { lead: { name: { contains: q, mode: "insensitive" } } },
            ],
          }
        : {},
    ],
  };

  const [cases, employees] = await Promise.all([
    prisma.case.findMany({ where, include: { lead: { select: { name: true } } }, orderBy: { nextDate: "asc" } }),
    prisma.employee.findMany({ where: { status: "ACTIVE" }, select: { id: true, name: true }, orderBy: { name: "asc" } }),
  ]);
  const today = todayKey();

  const modalProps = { action: saveCase, submitLabel: t("save"), cancelLabel: t("cancel") };

  return (
    <>
      <PageHeader
        title={t("caseTitle")} subtitle={t("caseIntro")}
        action={
          <FormModal title="Add case" trigger={t("addCase")} {...modalProps}>
            <CaseForm employees={employees} isAdmin={admin} today={today} />
          </FormModal>
        }
      />
      <div className="panel">
        <form className="mb-[17px] flex flex-wrap items-center gap-2.5">
          <input name="q" defaultValue={q} placeholder={t("searchCase")} className="field min-w-[100px] flex-1 max-sm:basis-full" />
          <select name="status" defaultValue={status} className="field w-auto">
            <option value="">{t("allStatuses")}</option>
            {toOptions(CASE_STATUS).map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <button className="btn btn-light">{t("search")}</button>
        </form>

        <div className="overflow-auto">
          <table className="tbl">
            <thead><tr><th>Case / Matter</th><th>Client</th><th>Court</th><th>Next date</th><th>Assigned to</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {cases.map((c) => (
                <tr key={c.id}>
                  <td><b>{c.title}</b><br /><span className="text-muted">{c.number}</span></td>
                  <td>{c.client}</td><td>{c.court}</td><td>{fmtDate(c.nextDate, lang)}</td><td>{c.lead.name}</td>
                  <td><CaseStatusTag status={c.status} /></td>
                  <td>
                    <FormModal title="Case details" trigger="Open" triggerClassName="text-btn" {...modalProps}>
                      <CaseForm
                        c={{ id: c.id, title: c.title, caseType: c.caseType, client: c.client, number: c.number, court: c.court, nextDate: dateKey(c.nextDate), status: c.status, leadId: c.leadId, notes: c.notes }}
                        employees={employees} isAdmin={admin} today={today}
                      />
                    </FormModal>
                  </td>
                </tr>
              ))}
              {cases.length === 0 && <tr><td colSpan={7}>{t("noResults")}</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
