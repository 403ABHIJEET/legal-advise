import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { caseScope, eventScope, isAdmin, requireUser } from "@/lib/auth";
import { getDict } from "@/lib/i18n";
import { EVENT_TYPE, fmtDate, parseDay, todayKey } from "@/lib/format";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { CaseStatusTag } from "@/components/dashboard/StatusTag";
import { FormModal } from "@/components/ui/FormModal";
import { CaseForm } from "@/components/dashboard/forms";
import { saveCase } from "@/actions/cases";

function greetingKey() {
  const h = Number(new Intl.DateTimeFormat("en-GB", { hour: "numeric", hour12: false, timeZone: "Asia/Kolkata" }).format(new Date()));
  return h < 12 ? "morning" : h < 17 ? "afternoon" : "evening";
}

export default async function OverviewPage() {
  const user = await requireUser();
  const { lang, t } = await getDict();
  const admin = isAdmin(user);
  const today = todayKey();
  const todayDate = parseDay(today);

  const [activeCases, recentCases, upcoming, upcomingCount, reminderCount, docCount, employees] = await Promise.all([
    prisma.case.count({ where: { ...caseScope(user), status: "ACTIVE" } }),
    prisma.case.findMany({ where: caseScope(user), orderBy: { nextDate: "asc" }, take: 4 }),
    prisma.calendarEvent.findMany({ where: { ...eventScope(user), date: { gte: todayDate } }, orderBy: { date: "asc" }, take: 4 }),
    prisma.calendarEvent.count({ where: { ...eventScope(user), date: { gte: todayDate } } }),
    prisma.calendarEvent.count({ where: { ...eventScope(user), date: { gte: todayDate }, type: { in: ["DEADLINE", "REMINDER"] } } }),
    prisma.document.count(),
    admin ? prisma.employee.findMany({ where: { status: "ACTIVE" }, select: { id: true, name: true }, orderBy: { name: "asc" } }) : Promise.resolve([]),
  ]);

  return (
    <>
      <PageHeader
        title={`${t(greetingKey())}, ${user.name.split(" ")[0]}.`}
        subtitle={t("welcomeSub")}
        action={
          <FormModal title="Add case" trigger={t("newCaseNote")} triggerClassName="btn btn-gold" action={saveCase} submitLabel={t("save")} cancelLabel={t("cancel")}>
            <CaseForm employees={employees} isAdmin={admin} today={today} />
          </FormModal>
        }
      />

      <div className="mb-5 grid grid-cols-2 gap-4 max-sm:gap-[9px] lg:grid-cols-4">
        <StatCard label={t("statAssigned")} value={activeCases} sub={t("statAssignedSub")} icon="▤" />
        <StatCard label={t("statUpcoming")} value={upcomingCount} sub={t("statUpcomingSub")} icon="▦" />
        <StatCard label={t("statDocs")} value={docCount} sub={t("statDocsSub")} icon="▧" />
        <StatCard label={t("statReminders")} value={reminderCount} sub={t("statRemindersSub")} icon="◷" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="panel">
          <div className="panel-head">
            <div><h3>{t("assignedCases")}</h3><p>{t("casesSub")}</p></div>
            <Link href="/dashboard/cases" className="text-btn">{t("viewAll")}</Link>
          </div>
          {recentCases.length === 0 && <p className="text-muted">{t("noResults")}</p>}
          {recentCases.map((c) => (
            <div key={c.id} className="row">
              <div>
                <div className="font-semibold text-navy">{c.title}</div>
                <div className="mt-1 text-xs text-muted">{c.number} · {c.court}<br />Next: {fmtDate(c.nextDate, lang)}</div>
              </div>
              <CaseStatusTag status={c.status} />
            </div>
          ))}
        </section>

        <section className="panel">
          <div className="panel-head">
            <div><h3>{t("upcoming")}</h3><p>{t("upcomingSub")}</p></div>
            <Link href="/dashboard/calendar" className="text-btn">{t("calendarLink")}</Link>
          </div>
          {upcoming.length === 0 && <p className="text-muted">{t("noResults")}</p>}
          {upcoming.map((e) => (
            <div key={e.id} className="flex gap-3 border-t border-[#edf0f5] py-3 first:border-t-0">
              <div className="grid h-[52px] min-w-[49px] place-content-center rounded-[9px] border border-line text-center">
                <b className="text-lg leading-[1.1] text-navy">{e.date.getUTCDate()}</b>
                <small className="text-[10px] uppercase text-muted">{e.date.toLocaleDateString(lang === "hi" ? "hi-IN" : "en-IN", { month: "short", timeZone: "UTC" })}</small>
              </div>
              <div>
                <strong className="text-[13px]">{e.title}</strong>
                <p className="m-0 mt-1 text-xs text-muted">{e.note ? `${e.note} · ` : ""}{EVENT_TYPE[e.type]}</p>
              </div>
            </div>
          ))}
        </section>
      </div>
    </>
  );
}
