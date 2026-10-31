import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { getDict } from "@/lib/i18n";
import { dateKey, initials } from "@/lib/format";
import { PageHeader } from "@/components/ui/PageHeader";
import { FormModal } from "@/components/ui/FormModal";
import { Tag } from "@/components/ui/fields";
import { EmployeeForm } from "@/components/dashboard/forms";
import { saveEmployee } from "@/actions/employees";

export default async function EmployeesPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  await requireAdmin();
  const { t } = await getDict();
  const { q = "" } = await searchParams;

  const employees = await prisma.employee.findMany({
    where: q ? { OR: [
      { name: { contains: q, mode: "insensitive" } },
      { designation: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
    ] } : {},
    include: { _count: { select: { ledCases: true, supportedCases: true } } },
    orderBy: { name: "asc" },
  });

  const modal = { action: saveEmployee, submitLabel: t("save"), cancelLabel: t("cancel") };

  return (
    <>
      <PageHeader
        title={t("employees")} subtitle={t("employeesIntro")}
        action={<FormModal title="Create employee profile" trigger="＋ Add employee" {...modal}><EmployeeForm /></FormModal>}
      />
      <div className="panel">
        <form className="mb-[17px] flex gap-2.5">
          <input name="q" defaultValue={q} placeholder="Search name, role, email…" className="field flex-1" />
          <button className="btn btn-light">{t("search")}</button>
        </form>
        <div className="overflow-auto">
          <table className="tbl">
            <thead><tr><th>Photo</th><th>Employee</th><th>Designation</th><th>Mobile</th><th>Email</th><th>DOB</th><th>Assigned matters</th><th>Access</th><th></th></tr></thead>
            <tbody>
              {employees.map((e) => (
                <tr key={e.id}>
                  <td>
                    {e.photoUrl
                      // eslint-disable-next-line @next/next/no-img-element
                      ? <img src={e.photoUrl} alt={`${e.name} profile`} className="size-[34px] rounded-full object-cover align-middle" />
                      : <span className="inline-grid size-[34px] place-items-center rounded-full bg-[#e7edf8] align-middle font-bold text-navy">{initials(e.name)}</span>}
                  </td>
                  <td><b>{e.name}</b></td>
                  <td>{e.designation}</td>
                  <td>{e.mobile || "—"}</td>
                  <td>{e.email}</td>
                  <td>{e.dob ? dateKey(e.dob) : "—"}</td>
                  <td>{e._count.ledCases + e._count.supportedCases}</td>
                  <td>
                    <Tag tone={e.status === "SUSPENDED" ? "amber" : undefined}>{e.status === "SUSPENDED" ? "Suspended" : "Active"}</Tag>{" "}
                    {e.systemRole === "ADMIN" && <Tag tone="blue">Admin</Tag>}
                  </td>
                  <td>
                    <FormModal title="Edit employee profile" trigger="Edit" triggerClassName="text-btn" {...modal}>
                      <EmployeeForm e={{ id: e.id, name: e.name, email: e.email, designation: e.designation, mobile: e.mobile, dob: e.dob ? dateKey(e.dob) : "", photoUrl: e.photoUrl, systemRole: e.systemRole, status: e.status }} />
                    </FormModal>
                  </td>
                </tr>
              ))}
              {employees.length === 0 && <tr><td colSpan={9}>{t("noResults")}</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
