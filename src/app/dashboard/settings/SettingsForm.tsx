"use client";

import { useActionState } from "react";
import { saveSettings } from "@/actions/settings";
import { Field } from "@/components/ui/fields";

export function SettingsForm({ defaults, saveLabel }: { defaults: { address: string; phone: string; email: string; mapUrl: string }; saveLabel: string }) {
  const [state, action, pending] = useActionState(saveSettings, null);
  return (
    <form action={action} className="panel grid gap-x-3 sm:grid-cols-2">
      <Field label="Office address" name="address" defaultValue={defaults.address} required={false} maxLength={300} placeholder="Enter office address" />
      <Field label="Contact phone" name="phone" defaultValue={defaults.phone} required={false} maxLength={60} placeholder="Enter office phone" />
      <Field label="Contact email" name="email" type="email" defaultValue={defaults.email} required={false} maxLength={160} placeholder="Enter office email" />
      <Field label="Google Maps link" name="mapUrl" type="url" defaultValue={defaults.mapUrl} required={false} maxLength={1000} placeholder="https://maps.google.com/..." />
      <div className="mt-4 sm:col-span-2">
        <button className="btn" disabled={pending}>{pending ? "Saving…" : saveLabel}</button>
        {state && <span role="status" className={`ml-2.5 text-xs ${state.ok ? "text-brand-green" : "text-brand-red"}`}>{state.message}</span>}
      </div>
    </form>
  );
}
