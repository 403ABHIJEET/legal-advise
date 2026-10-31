import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { getDict } from "@/lib/i18n";
import { LANGUAGE } from "@/lib/format";
import { PageHeader } from "@/components/ui/PageHeader";
import { FormModal } from "@/components/ui/FormModal";
import { ConfirmButton } from "@/components/ui/ConfirmButton";
import { Tag } from "@/components/ui/fields";
import { StatCard } from "@/components/dashboard/StatCard";
import { CampaignForm } from "@/components/dashboard/forms";
import { deleteCampaign, saveCampaign, toggleCampaign } from "@/actions/campaigns";

export default async function AdvertisingPage({ searchParams }: { searchParams: Promise<{ status?: string; preview?: string }> }) {
  await requireAdmin();
  const { t } = await getDict();
  const { status = "", preview } = await searchParams;

  const [all, enquiryCount] = await Promise.all([
    prisma.campaign.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.enquiry.count(),
  ]);
  const shown = all.filter((c) => !status || c.status === status);
  const previewed = all.find((c) => c.id === preview) ?? shown[0] ?? all[0];

  return (
    <>
      <PageHeader
        title={t("advertising")} subtitle={t("adsIntro")}
        action={
          <FormModal title="Create service advert" trigger="＋ Create campaign" action={saveCampaign} submitLabel={t("save")} cancelLabel={t("cancel")}>
            <CampaignForm />
          </FormModal>
        }
      />
      <div className="mb-5 rounded-[10px] border border-[#f0dfb0] bg-[#fff7e4] px-3.5 py-3 text-xs text-[#72571c]">
        Published campaigns appear as extra service cards on the public homepage. Check applicable Bar Council rules and professional-conduct requirements before publishing.
      </div>

      <div className="mb-5 grid grid-cols-2 gap-4 max-sm:gap-[9px] lg:grid-cols-4">
        <StatCard label="Published" value={all.filter((c) => c.status === "PUBLISHED").length} sub="Visible on public site" icon="◉" />
        <StatCard label="Drafts" value={all.filter((c) => c.status === "DRAFT").length} sub="Not published" icon="✎" />
        <StatCard label="Total campaigns" value={all.length} sub="All statuses" icon="◌" />
        <StatCard label="Enquiries received" value={enquiryCount} sub="Via the public form" icon="↗" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="panel">
          <div className="panel-head">
            <div><h3>Campaign manager</h3><p>Review status, preview and publish service listings.</p></div>
            <form>
              <select name="status" defaultValue={status} className="field max-w-[145px]" aria-label="Filter campaigns">
                <option value="">All campaigns</option><option value="PUBLISHED">Published</option><option value="DRAFT">Draft</option>
              </select>
              <button className="text-btn">Filter</button>
            </form>
          </div>
          {shown.length === 0 && <p className="text-muted">No campaigns in this status.</p>}
          {shown.map((c) => (
            <div key={c.id} className="row">
              <div>
                <div className="font-semibold text-navy">{c.title}</div>
                <div className="mt-1 text-xs text-muted">{c.description}<br />Languages: {LANGUAGE[c.language]}</div>
              </div>
              <div className="min-w-[105px] text-right">
                <Tag tone={c.status === "DRAFT" ? "amber" : undefined}>{c.status === "DRAFT" ? "Draft" : "Published"}</Tag><br />
                <Link href={`?preview=${c.id}${status ? `&status=${status}` : ""}`} className="text-btn">Preview</Link>
                <form action={toggleCampaign} className="inline">
                  <input type="hidden" name="id" value={c.id} />
                  <button className="text-btn">{c.status === "PUBLISHED" ? "Unpublish" : "Publish"}</button>
                </form>
                <form action={deleteCampaign} className="inline">
                  <input type="hidden" name="id" value={c.id} />
                  <ConfirmButton message={`Delete “${c.title}”?`} className="text-btn text-btn-danger">×</ConfirmButton>
                </form>
              </div>
            </div>
          ))}
        </section>

        <section className="panel">
          <div className="panel-head">
            <div><h3>Public listing preview</h3><p>How the card appears on the homepage</p></div>
            <Tag tone="blue">Preview</Tag>
          </div>
          {previewed ? (
            <div className="min-h-[150px] rounded-xl bg-[linear-gradient(125deg,#0b1d39,#23446e)] p-[22px] text-white">
              <small className="uppercase tracking-[1px] text-[#d7c28f]">Legal Office · {LANGUAGE[previewed.language]}</small>
              <h3 className="mb-1 mt-3 text-xl font-semibold text-white">{previewed.title}</h3>
              <p className="m-0 text-[#d4deed]">{previewed.description}</p>
              <div className="mt-[18px] text-[11px] text-[#e0c983]">Professional services · Contact office for details</div>
            </div>
          ) : <p className="text-muted">Create a campaign to see a preview.</p>}

          <div className="panel-head mt-5"><div><h3>Campaign checklist</h3><p>Review before publishing</p></div></div>
          {[
            ["Accurate service description", "No guaranteed outcomes or misleading claims."],
            ["Professional conduct review", "Confirm compliance with applicable rules."],
            ["Language and contact details", "Proofread English/Hindi content and office details."],
          ].map(([a, b]) => (
            <div key={a} className="row"><div><div className="font-semibold text-navy">✓ {a}</div><div className="mt-1 text-xs text-muted">{b}</div></div></div>
          ))}
        </section>
      </div>
    </>
  );
}
