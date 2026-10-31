"use client";

import { useActionState, useCallback, useEffect, useState, type ReactNode } from "react";
import type { ActionState } from "@/lib/action";

type Props = {
  title: string;
  trigger: ReactNode;
  triggerClassName?: string;
  action: (prev: ActionState, fd: FormData) => Promise<ActionState>;
  children: ReactNode;
  submitLabel?: string;
  cancelLabel?: string;
  note?: ReactNode;
};

export function FormModal({ title, trigger, triggerClassName = "btn", action, children, submitLabel = "Save", cancelLabel = "Cancel", note }: Props) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  return (
    <>
      <button type="button" className={triggerClassName} onClick={() => setOpen(true)}>{trigger}</button>
      {open && (
        <ModalBody title={title} action={action} onClose={close} submitLabel={submitLabel} cancelLabel={cancelLabel} note={note}>
          {children}
        </ModalBody>
      )}
    </>
  );
}

// Mounted only while open, so form state/messages reset every time the modal is reopened.
function ModalBody({ title, action, onClose, children, submitLabel, cancelLabel, note }: Omit<Props, "trigger" | "triggerClassName"> & { onClose: () => void }) {
  const [state, formAction, pending] = useActionState(action, null);

  useEffect(() => {
    if (state?.ok) onClose();
  }, [state, onClose]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-[#07152bb3] p-5"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
      role="dialog" aria-modal="true" aria-label={title}
    >
      <div className="max-h-[90vh] w-full max-w-[520px] overflow-auto rounded-[15px] bg-white p-6 text-left font-normal text-ink">
        <h3 className="m-0 mb-1 text-lg font-semibold text-navy">{title}</h3>
        <form action={formAction}>
          {children}
          {note && <p className="mt-3 text-[11px] text-muted">{note}</p>}
          {state && !state.ok && (
            <p role="alert" className="mt-4 rounded-lg bg-[#fff0f0] px-3 py-2 text-xs font-medium text-brand-red">{state.message}</p>
          )}
          <div className="mt-5 flex justify-end gap-2">
            <button type="button" className="btn btn-light" onClick={onClose}>{cancelLabel}</button>
            <button type="submit" className="btn" disabled={pending}>{pending ? "Saving…" : submitLabel}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
