"use client";

import type { SelectHTMLAttributes } from "react";

/** A <select> that submits its parent form on change. */
export function AutoSubmitSelect(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} onChange={(e) => e.currentTarget.form?.requestSubmit()} />;
}
