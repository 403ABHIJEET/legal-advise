import { prisma } from "@/lib/prisma";
import { AREAS_OF_LAW } from "@/lib/content";
import { Navbar } from "@/components/public/Navbar";
import { Hero } from "@/components/public/Hero";
import { Services } from "@/components/public/Services";
import { About } from "@/components/public/About";
import { Approach } from "@/components/public/Approach";
import { ContactSection } from "@/components/public/ContactSection";
import { Disclaimer, Footer } from "@/components/public/Footer";

export default async function HomePage({ searchParams }: { searchParams: Promise<{ service?: string }> }) {
  const { service } = await searchParams;
  const defaultArea = AREAS_OF_LAW.find((a) => a === service);

  const [settings, campaigns] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: 1 } }),
    prisma.campaign.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { createdAt: "asc" },
      select: { id: true, title: true, description: true },
    }),
  ]);

  return (
    <div className="bg-[#f7fafc] bg-[radial-gradient(ellipse_at_5%_28%,#dcecf4_0,transparent_32%),radial-gradient(ellipse_at_94%_64%,#e5f0f6_0,transparent_28%)] text-[#12304e]">
      <Navbar />
      <main>
        <Hero />
        <Services campaigns={campaigns} />
        <About />
        <Approach />
        <ContactSection defaultArea={defaultArea} />
      </main>
      <Disclaimer />
      <Footer
        info={{
          address: settings?.address ?? "",
          phone: settings?.phone ?? "",
          email: settings?.email ?? "",
          mapUrl: settings?.mapUrl ?? "",
        }}
      />
    </div>
  );
}
