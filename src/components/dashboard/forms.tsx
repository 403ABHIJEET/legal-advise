import { Field, Hidden, SelectField, TextAreaField } from "@/components/ui/fields";
import {
  CAMPAIGN_STATUS, CASE_STATUS, CASE_TYPES, DOC_CATEGORY, EVENT_TYPE, LANGUAGE, toOptions,
} from "@/lib/format";

export type EmployeeOption = { id: string; name: string };

export type CaseFormData = {
  id: string; title: string; caseType: string; client: string; number: string; court: string;
  nextDate: string; status: string; leadId: string; notes: string | null;
};

export function CaseForm({ c, employees, isAdmin, today }: { c?: CaseFormData; employees: EmployeeOption[]; isAdmin: boolean; today: string }) {
  return (
    <>
      {c && <Hidden name="id" value={c.id} />}
      <Field label="Matter title" name="title" defaultValue={c?.title} />
      <SelectField label="Type of matter" name="caseType" defaultValue={c?.caseType ?? "Civil Case"} options={CASE_TYPES.map((x) => ({ value: x, label: x }))} />
      <Field label="Client name" name="client" defaultValue={c?.client} />
      <Field label="Case number" name="number" defaultValue={c?.number} />
      <Field label="Court / forum" name="court" defaultValue={c?.court ?? "Delhi High Court"} />
      <Field label="Next date" name="nextDate" type="date" defaultValue={c?.nextDate ?? today} />
      {isAdmin && (
        <SelectField label="Lead employee" name="leadId" defaultValue={c?.leadId} options={employees.map((e) => ({ value: e.id, label: e.name }))} />
      )}
      <SelectField label="Status" name="status" defaultValue={c?.status ?? "ACTIVE"} options={toOptions(CASE_STATUS)} />
      <TextAreaField label="Internal note" name="notes" defaultValue={c?.notes ?? ""} maxLength={2000} />
    </>
  );
}

export function AssignForm({ c, employees }: { c: { id: string; title: string; leadId: string; supportId: string | null }; employees: EmployeeOption[] }) {
  const opts = employees.map((e) => ({ value: e.id, label: e.name }));
  return (
    <>
      <Hidden name="id" value={c.id} />
      <p className="mb-0 mt-2 text-sm font-semibold text-navy">{c.title}</p>
      <SelectField label="Lead employee" name="leadId" defaultValue={c.leadId} options={opts} />
      <SelectField label="Supporting employee" name="supportId" defaultValue={c.supportId ?? ""} options={opts} required={false} placeholder="None" />
    </>
  );
}

export function EventForm({ date }: { date: string }) {
  return (
    <>
      <Field label="Date" name="date" type="date" defaultValue={date} />
      <Field label="Event title" name="title" maxLength={200} />
      <SelectField label="Type" name="type" defaultValue="OFFICE" options={toOptions(EVENT_TYPE)} />
      <TextAreaField label="Note" name="note" maxLength={1000} />
    </>
  );
}

export function DocForm() {
  return (
    <>
      <Field label="Document title" name="title" maxLength={200} />
      <SelectField label="Category" name="category" defaultValue="TEMPLATES" options={toOptions(DOC_CATEGORY)} />
      <Field label="Google Drive share link" name="driveUrl" type="url" required={false} placeholder="https://drive.google.com/…" hint="Use a Drive link shared with the intended office users. Download access depends on the permissions set in Google Drive." />
      <Field label="Tags" name="tags" required={false} maxLength={200} />
      <TextAreaField label="Description" name="description" maxLength={1000} />
    </>
  );
}

export type EmployeeFormData = {
  id: string; name: string; email: string; designation: string; mobile: string | null; dob: string;
  photoUrl: string | null; systemRole: string; status: string;
};

export function EmployeeForm({ e }: { e?: EmployeeFormData }) {
  return (
    <>
      {e && <Hidden name="id" value={e.id} />}
      <Field label="Full name" name="name" defaultValue={e?.name} />
      <Field label="Mobile number" name="mobile" type="tel" defaultValue={e?.mobile ?? ""} required={false} />
      <Field label="Designation" name="designation" defaultValue={e?.designation ?? "Associate Advocate"} />
      <Field label="Work email" name="email" type="email" defaultValue={e?.email} />
      <Field label="Date of birth" name="dob" type="date" defaultValue={e?.dob ?? ""} required={false} />
      <Field label="Profile photo URL (https, optional)" name="photoUrl" type="url" defaultValue={e?.photoUrl ?? ""} required={false} />
      <SelectField label="Access level" name="systemRole" defaultValue={e?.systemRole ?? "EMPLOYEE"} options={[{ value: "EMPLOYEE", label: "Employee" }, { value: "ADMIN", label: "Administrator" }]} />
      <SelectField label="Account status" name="status" defaultValue={e?.status ?? "ACTIVE"} options={[{ value: "ACTIVE", label: "Active" }, { value: "SUSPENDED", label: "Suspended" }]} />
      <Field label={e ? "Reset password (leave blank to keep)" : "Initial password"} name="password" type="password" required={!e} hint="Minimum 8 characters." />
    </>
  );
}

export function CampaignForm() {
  return (
    <>
      <Field label="Service title" name="title" maxLength={120} />
      <TextAreaField label="Description" name="description" required maxLength={600} />
      <SelectField label="Language" name="language" defaultValue="BOTH" options={toOptions(LANGUAGE)} />
      <SelectField label="Initial status" name="status" defaultValue="DRAFT" options={toOptions(CAMPAIGN_STATUS)} />
    </>
  );
}
