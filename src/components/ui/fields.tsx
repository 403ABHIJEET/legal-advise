import type { ReactNode } from "react";

type Opt = { value: string; label: string };

export function Field({
  label, name, defaultValue = "", type = "text", required = true, placeholder, maxLength, hint,
}: {
  label: string; name: string; defaultValue?: string; type?: string; required?: boolean;
  placeholder?: string; maxLength?: number; hint?: string;
}) {
  return (
    <div>
      <label className="label" htmlFor={name}>{label}</label>
      <input
        id={name} name={name} type={type} defaultValue={defaultValue} required={required}
        placeholder={placeholder} maxLength={maxLength} className="field"
        autoComplete={type === "password" ? "new-password" : undefined}
      />
      {hint && <p className="mt-1 text-[11px] text-muted">{hint}</p>}
    </div>
  );
}

export function SelectField({
  label, name, options, defaultValue = "", required = true, placeholder,
}: {
  label: string; name: string; options: Opt[]; defaultValue?: string; required?: boolean; placeholder?: string;
}) {
  return (
    <div>
      <label className="label" htmlFor={name}>{label}</label>
      <select id={name} name={name} defaultValue={defaultValue} required={required} className="field">
        {placeholder !== undefined && <option value="">{placeholder}</option>}
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

export function TextAreaField({
  label, name, defaultValue = "", rows = 3, required = false, maxLength,
}: {
  label: string; name: string; defaultValue?: string; rows?: number; required?: boolean; maxLength?: number;
}) {
  return (
    <div>
      <label className="label" htmlFor={name}>{label}</label>
      <textarea id={name} name={name} rows={rows} defaultValue={defaultValue} required={required} maxLength={maxLength} className="field" />
    </div>
  );
}

export function Hidden({ name, value }: { name: string; value: string }) {
  return <input type="hidden" name={name} value={value} />;
}

export function Tag({ tone, children }: { tone?: "amber" | "blue" | "grey"; children: ReactNode }) {
  const cls = tone === "amber" ? "tag tag-amber" : tone === "blue" ? "tag tag-blue" : tone === "grey" ? "tag tag-grey" : "tag";
  return <span className={cls}>{children}</span>;
}
