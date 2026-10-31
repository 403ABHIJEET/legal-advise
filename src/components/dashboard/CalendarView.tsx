"use client";

import { useMemo, useState, useTransition } from "react";
import { createEvent, deleteEventsOnDate } from "@/actions/events";
import { FormModal } from "@/components/ui/FormModal";
import { EventForm } from "@/components/dashboard/forms";
import { fmtDate, type Lang } from "@/lib/format";

type Ev = { id: string; date: string; title: string; type: string; note: string | null; canDelete: boolean };

const WEEKDAYS: Record<Lang, string[]> = {
  en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  hi: ["रवि", "सोम", "मंगल", "बुध", "गुरु", "शुक्र", "शनि"],
};
const TYPE_LABEL: Record<string, string> = { HEARING: "Hearing", OFFICE: "Office", DEADLINE: "Deadline", REMINDER: "Reminder" };

export function CalendarView({
  events, today, lang, labels,
}: {
  events: Ev[]; today: string; lang: Lang;
  labels: { mark: string; unmark: string; selected: string; empty: string; save: string; cancel: string };
}) {
  const [{ y, m }, setMonth] = useState(() => {
    const [yy, mm] = today.split("-").map(Number);
    return { y: yy, m: mm - 1 };
  });
  const [selected, setSelected] = useState(today);
  const [pending, start] = useTransition();
  const locale = lang === "hi" ? "hi-IN" : "en-IN";

  const byDate = useMemo(() => {
    const map = new Map<string, Ev[]>();
    for (const e of events) map.set(e.date, [...(map.get(e.date) ?? []), e]);
    return map;
  }, [events]);

  const cells = useMemo(() => {
    const startDow = new Date(Date.UTC(y, m, 1)).getUTCDay();
    return Array.from({ length: 42 }, (_, i) => {
      const d = new Date(Date.UTC(y, m, i - startDow + 1));
      return { key: d.toISOString().slice(0, 10), day: d.getUTCDate(), dim: d.getUTCMonth() !== m };
    });
  }, [y, m]);

  const shift = (delta: number) => {
    const d = new Date(Date.UTC(y, m + delta, 1));
    setMonth({ y: d.getUTCFullYear(), m: d.getUTCMonth() });
  };

  const dayEvents = byDate.get(selected) ?? [];

  const unmark = () => {
    const removable = dayEvents.filter((e) => e.canDelete).length;
    if (!removable) return alert("No events that you can remove on this date.");
    if (!confirm(`Remove ${removable} event(s) on ${selected}?`)) return;
    start(async () => { await deleteEventsOnDate(selected); });
  };

  return (
    <>
      <div className="-mt-3 mb-5 flex flex-wrap items-center justify-end gap-2.5">
        <button className="pill" onClick={() => shift(-1)} aria-label="Previous month">‹</button>
        <strong className="min-w-[120px] text-center text-navy">
          {new Date(Date.UTC(y, m, 1)).toLocaleDateString(locale, { month: "long", year: "numeric", timeZone: "UTC" })}
        </strong>
        <button className="pill" onClick={() => shift(1)} aria-label="Next month">›</button>
        <FormModal title="Mark calendar date" trigger={labels.mark} action={createEvent} submitLabel={labels.save} cancelLabel={labels.cancel}>
          <EventForm date={selected} />
        </FormModal>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="panel">
          <div className="grid grid-cols-7 gap-[3px] sm:gap-[7px]">
            {WEEKDAYS[lang].map((n) => <div key={n} className="py-1.5 text-center text-[10px] uppercase text-muted sm:p-2">{n}</div>)}
            {cells.map((c) => {
              const evs = byDate.get(c.key) ?? [];
              const sel = c.key === selected;
              return (
                <button
                  key={c.key} onClick={() => setSelected(c.key)}
                  className={`min-h-[55px] rounded-[9px] bg-white p-1 text-left sm:min-h-[82px] sm:p-2 ${sel ? "border-2 border-gold bg-[#fffdf7]" : "border border-line hover:border-[#9bb0cd]"} ${c.dim ? "opacity-40" : ""}`}
                >
                  <span className="font-bold text-navy">{c.day}</span><br />
                  {evs.map((e) => <span key={e.id} className="mr-[3px] mt-[7px] inline-block size-1.5 rounded-full bg-gold" />)}
                  <div className="mt-1 hidden truncate text-[10px] text-[#315b91] sm:block">{evs[0]?.title}</div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="panel">
          <div className="panel-head">
            <div><h3>{fmtDate(selected, lang)}</h3><p>{labels.selected}</p></div>
            <button className="text-btn" onClick={unmark} disabled={pending}>{labels.unmark}</button>
          </div>
          {dayEvents.length === 0 && <p className="text-muted">{labels.empty}</p>}
          {dayEvents.map((e) => (
            <div key={e.id} className="flex gap-3 border-t border-[#edf0f5] py-3 first:border-t-0">
              <div className="grid h-11 w-10 shrink-0 place-items-center rounded-lg bg-[#edf2fa] font-extrabold text-[#315b91]">{e.type === "HEARING" ? "⚖" : "◷"}</div>
              <div>
                <strong className="text-[13px]">{e.title}</strong>
                <p className="m-0 mt-1 text-xs text-muted">{TYPE_LABEL[e.type] ?? e.type}{e.note ? ` · ${e.note}` : ""}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
