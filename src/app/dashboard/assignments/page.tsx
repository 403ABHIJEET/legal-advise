import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { getDict } from "@/lib/i18n";
import { fmtDate } from "@/lib/format";
import { PageHeader } from "@/components/ui/PageHeader";
import { FormModal } from "@/components/ui/FormModal";
import { AssignForm } from "@/components/dashboard/forms";
import { CaseStatusTag } from "@/components/dashboard/StatusTag";
import { assignCase } from "@/actions/cases";

export default async function AssignmentsPage() {
  await requireAdmin();
  const { lang, t } = await getDict();

  const [cases, employees] = await Promise.all([
    prisma.case.findMany({ include: { lead: { select: { name: true } }, support: { select: { name: true } } }, orderBy: { assignedAt: "desc" } }),
    prisma.employee.findMany({ where: { status: "ACTIVE" }, select: { id: true, name: true }, orderBy: { name: "asc" } }),
  ]);

  return (
    <>
      <PageHeader title={t("assignments")} subtitle={t("assignIntro")} />
      <div className="panel overflow-auto">
        <table className="tbl">
          <thead><tr><th>Matter</th><th>Lead employee</th><th>Support</th><th>Assigned on</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {cases.map((c) => (
              <tr key={c.id}>
                <td><b>{c.title}</b><br /><span className="text-muted">{c.number}</span></td>
                <td>{c.lead.name}</td>
                <td>{c.support?.name ?? "—"}</td>
                <td>{fmtDate(c.assignedAt, lang)}</td>
                <td><CaseStatusTag status={c.status} /></td>
                <td>
                  <FormModal title="Assign case" trigger="Reassign" triggerClassName="text-btn" action={assignCase} submitLabel={t("save")} cancelLabel={t("cancel")}>
                    <AssignForm c={{ id: c.id, title: c.title, leadId: c.leadId, supportId: c.supportId }} employees={employees} />
                  </FormModal>
                </td>
              </tr>
            ))}
            {cases.length === 0 && <tr><td colSpan={6}>{t("noResults")}</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
