import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { getDict } from "@/lib/i18n";
import { EVENT_TYPE, dateKey, fmtDate, todayKey } from "@/lib/format";
import { PageHeader } from "@/components/ui/PageHeader";
import { FormModal } from "@/components/ui/FormModal";
import { ConfirmButton } from "@/components/ui/ConfirmButton";
import { EventForm } from "@/components/dashboard/forms";
import { createEvent, deleteEvent, updateEvent } from "@/actions/events";

export default async function OfficeCalendarPage() {
  const user = await requireAdmin();
  const { lang, t } = await getDict();
  const events = await prisma.calendarEvent.findMany({
    orderBy: { date: "asc" },
    include: { createdBy: { select: { name: true } } },
  });

  return (
    <>
      <PageHeader
        title={t("officeCalendar")} subtitle={t("officeIntro")}
        action={
          <FormModal title="Add office event" trigger="＋ Add office event" action={createEvent} submitLabel={t("save")} cancelLabel={t("cancel")}>
            <EventForm date={todayKey()} />
          </FormModal>
        }
      />
      <div className="panel">
        {events.length === 0 && <p className="text-muted">{t("noResults")}</p>}
        {events.map((e) => (
          <div key={e.id} className="flex gap-3 border-t border-[#edf0f5] py-3 first:border-t-0">
            <div className="grid h-[52px] min-w-[49px] place-content-center rounded-[9px] border border-line text-center">
              <b className="text-lg leading-[1.1] text-navy">{e.date.getUTCDate()}</b>
              <small className="text-[10px] uppercase text-muted">{e.date.toLocaleDateString(lang === "hi" ? "hi-IN" : "en-IN", { month: "short", timeZone: "UTC" })}</small>
            </div>
            <div className="flex-1">
              <strong className="text-[13px]">{e.title}</strong>
              <p className="m-0 mt-1 text-xs text-muted">{fmtDate(dateKey(e.date), lang)} · {EVENT_TYPE[e.type]}{e.note ? ` · ${e.note}` : ""}</p>
              {e.createdBy && <p className="m-0 mt-1 text-xs text-muted">{t("createdBy")}: {e.createdBy.name}</p>}
            </div>
            {e.createdById === user.id && (
              <FormModal
                title={t("edit")}
                trigger={t("edit")}
                triggerClassName="text-btn"
                action={updateEvent}
                submitLabel={t("save")}
                cancelLabel={t("cancel")}
              >
                <EventForm date={dateKey(e.date)} event={{
                  id: e.id, date: dateKey(e.date), title: e.title, type: e.type, note: e.note,
                }} />
              </FormModal>
            )}
            <form action={deleteEvent}>
              <input type="hidden" name="id" value={e.id} />
              <ConfirmButton message={`Remove “${e.title}”?`} className="text-btn text-btn-danger">Remove</ConfirmButton>
            </form>
          </div>
        ))}
      </div>
    </>
  );
}
