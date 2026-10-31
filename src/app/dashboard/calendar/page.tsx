import { prisma } from "@/lib/prisma";
import { eventScope, isAdmin, requireUser } from "@/lib/auth";
import { getDict } from "@/lib/i18n";
import { dateKey, todayKey } from "@/lib/format";
import { PageHeader } from "@/components/ui/PageHeader";
import { CalendarView } from "@/components/dashboard/CalendarView";

export default async function CalendarPage() {
  const user = await requireUser();
  const { lang, t } = await getDict();
  const admin = isAdmin(user);

  const events = await prisma.calendarEvent.findMany({ where: eventScope(user), orderBy: { date: "asc" } });

  return (
    <>
      <PageHeader title={t("calTitle")} subtitle={t("calIntro")} />
      <CalendarView
        lang={lang}
        today={todayKey()}
        events={events.map((e) => ({
          id: e.id, date: dateKey(e.date), title: e.title, type: e.type, note: e.note,
          canDelete: admin || e.createdById === user.id,
        }))}
        labels={{ mark: t("markDate"), unmark: t("unmarkDate"), selected: t("selectedDate"), empty: t("dateEmpty"), save: t("save"), cancel: t("cancel") }}
      />
    </>
  );
}
