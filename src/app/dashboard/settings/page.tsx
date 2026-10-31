import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { getDict } from "@/lib/i18n";
import { PageHeader } from "@/components/ui/PageHeader";
import { SettingsForm } from "./SettingsForm";

export default async function SettingsPage() {
  await requireAdmin();
  const { t } = await getDict();
  const s = await prisma.siteSettings.findUnique({ where: { id: 1 } });

  return (
    <>
      <PageHeader title="Public website settings" subtitle="Update the contact details and map link shown in the footer of the public home page." />
      <SettingsForm defaults={{ address: s?.address ?? "", phone: s?.phone ?? "", email: s?.email ?? "", mapUrl: s?.mapUrl ?? "" }} saveLabel={t("save")} />
    </>
  );
}
