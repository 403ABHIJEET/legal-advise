import type { ReactNode } from "react";

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h2 className="m-0 mb-1 text-2xl font-semibold text-navy">{title}</h2>
        {subtitle && <p className="m-0 text-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
