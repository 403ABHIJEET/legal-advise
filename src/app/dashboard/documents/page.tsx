import type { DocCategory, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { isAdmin, requireUser } from "@/lib/auth";
import { getDict } from "@/lib/i18n";
import { DOC_CATEGORY, toOptions } from "@/lib/format";
import { PageHeader } from "@/components/ui/PageHeader";
import { FormModal } from "@/components/ui/FormModal";
import { ConfirmButton } from "@/components/ui/ConfirmButton";
import { DocForm } from "@/components/dashboard/forms";
import { deleteDocument, saveDocument } from "@/actions/documents";

export default async function DocumentsPage({ searchParams }: { searchParams: Promise<{ q?: string; category?: string }> }) {
  const user = await requireUser();
  const { t } = await getDict();
  const { q = "", category = "" } = await searchParams;

  const where: Prisma.DocumentWhereInput = {
    ...(Object.hasOwn(DOC_CATEGORY, category) ? { category: category as DocCategory } : {}),
    ...(q ? { OR: [
      { title: { contains: q, mode: "insensitive" } },
      { tags: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
    ] } : {}),
  };
  const docs = await prisma.document.findMany({ where, orderBy: { updatedAt: "desc" } });

  return (
    <>
      <PageHeader
        title={t("documents")} subtitle={t("docsIntro")}
        action={
          <FormModal title="Add library entry" trigger="＋ Add document" action={saveDocument} submitLabel={t("save")} cancelLabel={t("cancel")}>
            <DocForm />
          </FormModal>
        }
      />
      <div className="panel">
        <form className="mb-[17px] flex flex-wrap items-center gap-2.5">
          <input name="q" defaultValue={q} placeholder="Search title, category, tags…" className="field min-w-[100px] flex-1 max-sm:basis-full" />
          <select name="category" defaultValue={category} className="field w-auto">
            <option value="">All categories</option>
            {toOptions(DOC_CATEGORY).map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <button className="btn btn-light">{t("search")}</button>
        </form>

        {docs.length === 0 && <p className="text-muted">{t("noResults")}</p>}
        {docs.map((d) => (
          <div key={d.id} className="flex flex-wrap items-center gap-3 border-t border-[#edf0f5] py-3.5 first:border-t-0">
            <div className="grid h-11 w-10 shrink-0 place-items-center rounded-lg bg-[#edf2fa] text-xs font-extrabold text-[#315b91]">DOC</div>
            <div className="min-w-0 flex-1">
              <strong className="block text-navy">{d.title}</strong>
              <small className="text-muted">{DOC_CATEGORY[d.category]} · Updated {d.updatedAt.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric", timeZone: "Asia/Kolkata" })}</small>
              <details className="mt-1 text-xs text-muted">
                <summary className="cursor-pointer font-semibold text-[#315b91]">Details</summary>
                <p className="my-1">{d.description || "No description."}</p>
                {d.tags && <p className="m-0">Tags: {d.tags}</p>}
              </details>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {d.driveUrl ? (
                <a href={d.driveUrl} target="_blank" rel="noopener noreferrer" className="whitespace-nowrap rounded-[7px] border border-[#dce3ed] px-[9px] py-1.5 text-[11px] font-semibold text-[#315b91] no-underline">Open / Download in Drive ↗</a>
              ) : <span className="text-[11px] text-muted">No Drive link</span>}
              {isAdmin(user) && (
                <form action={deleteDocument}>
                  <input type="hidden" name="id" value={d.id} />
                  <ConfirmButton message={`Delete “${d.title}”?`} className="text-btn text-btn-danger" aria-label="Delete document">×</ConfirmButton>
                </form>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
