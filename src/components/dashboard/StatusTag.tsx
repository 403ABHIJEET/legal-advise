import { Tag } from "@/components/ui/fields";
import { CASE_STATUS } from "@/lib/format";
import type { CaseStatus } from "@prisma/client";

export function CaseStatusTag({ status }: { status: CaseStatus }) {
  return <Tag tone={status === "PENDING" ? "amber" : status === "CLOSED" ? "grey" : undefined}>{CASE_STATUS[status]}</Tag>;
}
