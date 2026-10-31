"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { FormModal } from "@/components/ui/FormModal";
import { Field } from "@/components/ui/fields";
import { changePasswordAction, logoutAction } from "@/actions/auth";
import { updateProfile } from "@/actions/employees";
import { toggleLang } from "@/actions/lang";
import { initials } from "@/lib/format";

export type NavItem = { href: string; icon: string; label: string };

export type ShellProps = {
  user: { name: string; designation: string; photoUrl: string | null; email: string; mobile: string; dob: string; isAdmin: boolean };
  nav: NavItem[];
  labels: Record<"workspace" | "confidential" | "brandSub" | "signOut" | "roleBadge" | "myProfile" | "changePassword" | "langToggle" | "save" | "cancel", string>;
  children: ReactNode;
};

function Avatar({ name, url, size = 36 }: { name: string; url: string | null; size?: number }) {
  const style = { width: size, height: size };
  // eslint-disable-next-line @next/next/no-img-element
  if (url) return <img src={url} alt={`${name} profile`} style={style} className="rounded-full border border-line object-cover" />;
  return <span style={style} className="grid place-items-center rounded-full bg-[#e7edf8] font-bold text-navy">{initials(name)}</span>;
}

export function Shell({ user, nav, labels, children }: ShellProps) {
  const pathname = usePathname();
  const [menu, setMenu] = useState(false);

  const isActive = (href: string) => (href === "/dashboard" ? pathname === href : pathname.startsWith(href));
  const current = nav.find((n) => isActive(n.href));

  return (
    <div className="min-h-screen md:grid md:grid-cols-[248px_1fr]">
      <aside className={`${menu ? "fixed inset-y-0 left-0 z-40 flex w-[260px]" : "hidden"} flex-col gap-6 bg-navy px-4 py-[25px] text-[#dce5f3] md:sticky md:top-0 md:flex md:h-screen md:w-auto`}>
        <div className="flex items-center gap-3 px-2">
          <Image src="/logo.png" alt="Pranj Legal Associates logo" width={54} height={54} className="size-[54px] rounded-lg bg-white object-contain" />
          <div>
            <strong className="block text-[15px] leading-tight text-white">Pranj Legal Associates</strong>
            <small className="text-[#aab9ce]">{labels.brandSub}</small>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="mb-[7px] px-3 text-[10px] uppercase tracking-[1.5px] text-[#8295b2]">{labels.workspace}</div>
          <nav className="grid gap-[5px]">
            {nav.map((n) => (
              <Link
                key={n.href} href={n.href} onClick={() => setMenu(false)}
                className={`flex items-center gap-3 rounded-[9px] px-3 py-[11px] text-left no-underline transition ${isActive(n.href) ? "bg-[#20395c] text-white shadow-[inset_3px_0_var(--color-gold)]" : "text-[#b9c7da] hover:bg-[#20395c] hover:text-white"}`}
              >
                <span className="w-5 text-center text-base">{n.icon}</span>{n.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="border-t border-[#293e5d] px-2 pt-4 text-xs text-[#9eb0c9]">
          <div>◈ {labels.confidential}</div>
          <p className="mb-0 mt-2">© {new Date().getFullYear()} Pranj Legal Associates</p>
        </div>
      </aside>
      {menu && <button aria-label="Close menu" className="fixed inset-0 z-30 bg-black/40 md:hidden" onClick={() => setMenu(false)} />}

      <div className="min-w-0">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-white px-3 py-3 sm:px-8 md:min-h-[76px]">
          <div className="flex items-center gap-2.5">
            <button className="pill md:hidden" onClick={() => setMenu(true)} aria-label="Open menu">☰</button>
            <div>
              <div className="text-xs text-muted">Legal Office / {current?.label ?? ""}</div>
              <h1 className="m-0 mt-0.5 text-lg font-semibold text-navy sm:text-xl">{current?.label ?? ""}</h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2.5 max-sm:text-[11px]">
            <span className="pill hidden sm:inline-block">{labels.roleBadge}</span>
            <form action={toggleLang}><button className="pill">{labels.langToggle}</button></form>
            <div className="flex items-center gap-[9px] border-l border-line pl-4 max-sm:border-0 max-sm:pl-0">
              <Avatar name={user.name} url={user.photoUrl} />
              <div className="max-sm:hidden">
                <b className="block text-xs">{user.name}</b>
                <small className="text-muted">{user.designation}</small>
              </div>
            </div>

            <FormModal title={labels.myProfile} trigger={labels.myProfile} triggerClassName="pill" action={updateProfile} submitLabel={labels.save} cancelLabel={labels.cancel}>
              <Field label="Full name" name="name" defaultValue={user.name} />
              <Field label="Mobile number" name="mobile" type="tel" defaultValue={user.mobile} required={false} />
              <Field label="Designation" name="designation" defaultValue={user.designation} />
              <Field label="Email address" name="email" type="email" defaultValue={user.email} />
              <Field label="Date of birth" name="dob" type="date" defaultValue={user.dob} required={false} />
              <Field label="Profile photo URL (https)" name="photoUrl" type="url" defaultValue={user.photoUrl ?? ""} required={false} />
            </FormModal>

            <FormModal title={labels.changePassword} trigger={labels.changePassword} triggerClassName="pill" action={changePasswordAction} submitLabel={labels.save} cancelLabel={labels.cancel}>
              <Field label="Current password" name="currentPassword" type="password" />
              <Field label="New password (minimum 8 characters)" name="newPassword" type="password" />
              <Field label="Confirm new password" name="confirmPassword" type="password" />
            </FormModal>

            <form action={logoutAction}><button className="pill">↪ {labels.signOut}</button></form>
          </div>
        </header>

        <div className="mx-auto max-w-[1600px] px-3.5 py-[18px] sm:px-8 sm:py-7">{children}</div>
      </div>
    </div>
  );
}
