import type {
  CampaignStatus, CaseStatus, DocCategory, EnquiryStatus, EventType, Language,
} from "@prisma/client";

export type Lang = "en" | "hi";

export const dateKey = (d: Date) => d.toISOString().slice(0, 10);
export const parseDay = (s: string) => new Date(`${s}T00:00:00Z`);

/** Today's date (YYYY-MM-DD) in the office's timezone. */
export const todayKey = () =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date());

export function fmtDate(d: Date | string, lang: Lang = "en") {
  const date = typeof d === "string" ? parseDay(d) : d;
  return date.toLocaleDateString(lang === "hi" ? "hi-IN" : "en-IN", {
    day: "2-digit", month: "short", year: "numeric", timeZone: "UTC",
  });
}

export const initials = (name: string) =>
  name.split(" ").filter(Boolean).map((x) => x[0]).join("").slice(0, 2).toUpperCase();

export const CASE_STATUS: Record<CaseStatus, string> = { ACTIVE: "Active", PENDING: "Pending", CLOSED: "Closed" };
export const EVENT_TYPE: Record<EventType, string> = { HEARING: "Hearing", OFFICE: "Office", DEADLINE: "Deadline", REMINDER: "Reminder" };
export const DOC_CATEGORY: Record<DocCategory, string> = { TEMPLATES: "Templates", PROCEDURE: "Procedure", REFERENCE: "Reference", FORMS: "Forms" };
export const LANGUAGE: Record<Language, string> = { BOTH: "Both", ENGLISH: "English", HINDI: "Hindi" };
export const CAMPAIGN_STATUS: Record<CampaignStatus, string> = { DRAFT: "Draft", PUBLISHED: "Published" };
export const ENQUIRY_STATUS: Record<EnquiryStatus, string> = { NEW: "New", CONTACTED: "Contacted", CLOSED: "Closed" };

export const toOptions = (m: Record<string, string>) =>
  Object.entries(m).map(([value, label]) => ({ value, label }));

export const CASE_TYPES = [
  "Divorce / Family", "Civil Case", "Criminal Case", "Bail Application", "Consumer Dispute",
  "Cheque Bounce / NI Act", "Property Dispute", "Corporate / Commercial",
  "Employment / Service", "Legal Notice / Drafting", "Other",
];
