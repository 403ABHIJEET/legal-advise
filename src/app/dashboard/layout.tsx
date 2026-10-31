import type { Metadata } from "next";
import { requireUser, isAdmin } from "@/lib/auth";
import { getDict } from "@/lib/i18n";
import { dateKey } from "@/lib/format";
import { Shell, type NavItem } from "@/components/dashboard/Shell";

export const metadata: Metadata = { title: "Workspace — Pranj Legal Associates", robots: { index: false, follow: false } };

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const { lang, t } = await getDict();
  const admin = isAdmin(user);

  const nav: (NavItem & { admin?: boolean })[] = [
    { href: "/dashboard", icon: "◫", label: t("overview") },
    { href: "/dashboard/cases", icon: "▤", label: t("cases") },
    { href: "/dashboard/calendar", icon: "▦", label: t("calendar") },
    { href: "/dashboard/documents", icon: "▧", label: t("documents") },
    { href: "/dashboard/employees", icon: "♙", label: t("employees"), admin: true },
    { href: "/dashboard/assignments", icon: "⇄", label: t("assignments"), admin: true },
    { href: "/dashboard/office-calendar", icon: "▦", label: t("officeCalendar"), admin: true },
    { href: "/dashboard/advertising", icon: "◇", label: t("advertising"), admin: true },
    { href: "/dashboard/enquiries", icon: "✉", label: t("enquiries"), admin: true },
    { href: "/dashboard/settings", icon: "⚙", label: t("siteSettings"), admin: true },
  ];

  return (
    <div lang={lang}>
      <Shell
        user={{
          name: user.name,
          designation: user.designation,
          photoUrl: user.photoUrl,
          email: user.email,
          mobile: user.mobile ?? "",
          dob: user.dob ? dateKey(user.dob) : "",
          isAdmin: admin,
        }}
        nav={nav.filter((n) => !n.admin || admin).map(({ href, icon, label }) => ({ href, icon, label }))}
        labels={{
          workspace: t("workspace"), confidential: t("confidential"), brandSub: t("brandSub"),
          signOut: t("signOut"), roleBadge: admin ? t("adminView") : t("employeeView"),
          myProfile: t("myProfile"), changePassword: t("changePassword"), langToggle: t("langToggle"),
          save: t("save"), cancel: t("cancel"),
        }}
      >
        {children}
      </Shell>
    </div>
  );
}
