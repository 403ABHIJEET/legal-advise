import "server-only";
import { cookies } from "next/headers";
import type { Lang } from "@/lib/format";

const en = {
  overview: "Overview", cases: "Cases", calendar: "My Calendar", documents: "Document Library",
  employees: "Employees", assignments: "Case Assignments", officeCalendar: "Office Calendar",
  advertising: "Services & Advertising", enquiries: "Enquiries", siteSettings: "Website Settings",
  workspace: "Workspace", confidential: "Confidential workspace", brandSub: "Practice management",
  signOut: "Logout", employeeView: "Employee view", adminView: "Administrator view",
  myProfile: "My profile", changePassword: "Change password", langToggle: "हिन्दी",
  morning: "Good morning", afternoon: "Good afternoon", evening: "Good evening",
  welcomeSub: "Here is your practice at a glance.", newCaseNote: "＋ New case note",
  statAssigned: "Assigned matters", statUpcoming: "Upcoming dates", statDocs: "Library documents", statReminders: "Open reminders",
  statAssignedSub: "Across your matters", statUpcomingSub: "Dates marked in calendar", statDocsSub: "Searchable resources", statRemindersSub: "Deadlines & reminders",
  assignedCases: "Assigned cases", casesSub: "Your active matters and next steps",
  upcoming: "Upcoming dates", upcomingSub: "Hearings and office reminders",
  viewAll: "View all →", calendarLink: "Calendar →", noResults: "No matching records found.",
  caseTitle: "Case management", caseIntro: "Track matters, deadlines and assigned responsibility.", addCase: "＋ Add case",
  searchCase: "Search case title, client, court or case number…", allStatuses: "All statuses",
  calTitle: "Case calendar", calIntro: "Select a date to add, mark or unmark a note.",
  markDate: "＋ Mark date", unmarkDate: "Unmark date", selectedDate: "Selected date", dateEmpty: "No note or event on this date.",
  docsIntro: "Search and organise approved office resources.", employeesIntro: "Manage profiles, roles and office access.",
  officeIntro: "Shared dates and events across the practice.", adsIntro: "Create and manage public-facing legal service information.",
  assignIntro: "Allocate responsibility and keep ownership visible.",
  search: "Search", save: "Save", cancel: "Cancel",
} as const;

export type DictKey = keyof typeof en;

const hi: Partial<Record<DictKey, string>> = {
  overview: "अवलोकन", cases: "मामले", calendar: "मेरा कैलेंडर", documents: "दस्तावेज़ लाइब्रेरी",
  employees: "कर्मचारी", assignments: "मामला आवंटन", officeCalendar: "कार्यालय कैलेंडर",
  advertising: "सेवाएँ एवं विज्ञापन", enquiries: "पूछताछ", siteSettings: "वेबसाइट सेटिंग्स",
  workspace: "कार्यस्थल", confidential: "गोपनीय कार्यस्थल", brandSub: "प्रैक्टिस प्रबंधन",
  signOut: "लॉग आउट", employeeView: "कर्मचारी दृश्य", adminView: "प्रशासक दृश्य",
  myProfile: "मेरी प्रोफ़ाइल", changePassword: "पासवर्ड बदलें", langToggle: "English",
  morning: "सुप्रभात", afternoon: "नमस्कार", evening: "शुभ संध्या",
  welcomeSub: "आपके कार्य का संक्षिप्त विवरण।", newCaseNote: "＋ नया केस नोट",
  statAssigned: "आवंटित मामले", statUpcoming: "आगामी तिथियाँ", statDocs: "लाइब्रेरी दस्तावेज़", statReminders: "खुले रिमाइंडर",
  assignedCases: "आवंटित मामले", casesSub: "आपके सक्रिय मामले और अगले कदम",
  upcoming: "आगामी तारीखें", upcomingSub: "सुनवाई और कार्यालय अनुस्मारक",
  viewAll: "सभी देखें →", calendarLink: "कैलेंडर →", noResults: "कोई रिकॉर्ड नहीं मिला।",
  caseTitle: "मामला प्रबंधन", caseIntro: "मामलों, समय-सीमाओं और जिम्मेदारियों का प्रबंधन करें।", addCase: "＋ मामला जोड़ें",
  searchCase: "मामले, मुवक्किल, न्यायालय या केस नंबर से खोजें…", allStatuses: "सभी स्थितियाँ",
  calTitle: "केस कैलेंडर", calIntro: "नोट जोड़ने, तारीख चिह्नित या हटाने के लिए तारीख चुनें।",
  markDate: "＋ तारीख चिह्नित करें", unmarkDate: "चिह्न हटाएँ", selectedDate: "चुनी गई तारीख", dateEmpty: "इस तारीख पर कोई नोट या कार्यक्रम नहीं है।",
  docsIntro: "स्वीकृत कार्यालय संसाधनों को खोजें और व्यवस्थित करें।", employeesIntro: "प्रोफ़ाइल, भूमिकाएँ और कार्यालय पहुँच प्रबंधित करें।",
  officeIntro: "कार्यालय के साझा कार्यक्रम और तारीखें।", adsIntro: "सार्वजनिक कानूनी सेवा जानकारी प्रबंधित करें।",
  search: "खोजें", save: "सहेजें", cancel: "रद्द करें",
};

export async function getDict() {
  const lang: Lang = (await cookies()).get("lang")?.value === "hi" ? "hi" : "en";
  const t = (k: DictKey): string => (lang === "hi" ? hi[k] : undefined) ?? en[k];
  return { lang, t };
}
