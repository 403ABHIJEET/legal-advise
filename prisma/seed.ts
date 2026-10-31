import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
const day = (s: string) => new Date(`${s}T00:00:00Z`);

async function main() {
  const password = process.env.SEED_PASSWORD;
  if (!password || password.length < 8) {
    throw new Error("Set SEED_PASSWORD (min 8 characters) in .env before seeding.");
  }
  const passwordHash = await bcrypt.hash(password, 12);
  const adminEmail = (process.env.SEED_ADMIN_EMAIL || "admin@pranjlegal.demo").toLowerCase();

  const admin = await prisma.employee.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: "Preet Kumar",
      email: adminEmail,
      passwordHash,
      systemRole: "ADMIN",
      designation: "Administrator",
    },
  });

  await prisma.siteSettings.upsert({ where: { id: 1 }, update: {}, create: { id: 1 } });

  if (process.env.SEED_SAMPLE_DATA !== "true") {
    console.log(`Seeded admin ${admin.email}. Sample data skipped.`);
    return;
  }

  const mk = (name: string, email: string, designation: string) =>
    prisma.employee.upsert({
      where: { email },
      update: {},
      create: { name, email, passwordHash, designation },
    });
  const aarav = await mk("Aarav Sharma", "advocate@legaloffice.demo", "Advocate");
  const meera = await mk("Meera Iyer", "meera@legaloffice.demo", "Senior Advocate");
  const kabir = await mk("Kabir Singh", "kabir@legaloffice.demo", "Associate Advocate");

  if ((await prisma.case.count()) === 0) {
    const cases = [
      { title: "Rao v. State — Bail Application", client: "N. Rao", court: "Delhi High Court", number: "BAIL/124/2026", nextDate: "2026-10-27", leadId: aarav.id, supportId: meera.id, status: "ACTIVE", notes: "Prepare compilation of judgments.", caseType: "Bail Application" },
      { title: "Mehta Commercial Dispute", client: "Mehta Trading Co.", court: "District Court, Shahdara", number: "CS/388/2025", nextDate: "2026-10-29", leadId: aarav.id, supportId: kabir.id, status: "PENDING", notes: "Written submissions under review.", caseType: "Corporate / Commercial" },
      { title: "Sharma Property Appeal", client: "P. Sharma", court: "Delhi High Court", number: "RFA/82/2024", nextDate: "2026-11-04", leadId: meera.id, supportId: aarav.id, status: "ACTIVE", notes: "Paper book index to be finalised.", caseType: "Property Dispute" },
      { title: "Northline Services — Recovery", client: "Northline Services", court: "Commercial Court, Delhi", number: "COM/92/2025", nextDate: "2026-11-12", leadId: kabir.id, supportId: meera.id, status: "ACTIVE", notes: "Review settlement correspondence.", caseType: "Corporate / Commercial" },
    ] as const;
    for (const c of cases) {
      const created = await prisma.case.create({ data: { ...c, nextDate: day(c.nextDate) } });
      await prisma.calendarEvent.create({
        data: { date: day(c.nextDate), title: c.title, type: "HEARING", note: c.court, caseId: created.id, createdById: admin.id },
      });
    }
    await prisma.calendarEvent.create({
      data: { date: day("2026-10-24"), title: "Weekly case review", type: "OFFICE", note: "Conference room · 4:00 PM", createdById: admin.id },
    });
  }

  if ((await prisma.document.count()) === 0) {
    await prisma.document.createMany({
      data: [
        { title: "Vakalatnama — General Template", category: "TEMPLATES", tags: "court, filing, vakalatnama", description: "Blank illustrative template. Verify jurisdiction-specific requirements." },
        { title: "Case Intake Checklist", category: "FORMS", tags: "client, intake, checklist", description: "Internal checklist for new matter intake." },
        { title: "Filing & Pagination Procedure", category: "PROCEDURE", tags: "filing, procedure, paper book", description: "Office process note for document preparation." },
        { title: "Court Directory — Delhi (Sample)", category: "REFERENCE", tags: "court, directory, delhi", description: "Sample directory; confirm all details independently." },
      ],
    });
  }

  if ((await prisma.campaign.count()) === 0) {
    await prisma.campaign.createMany({
      data: [
        { title: "Civil & Commercial Litigation", description: "Representation and case strategy for civil and commercial disputes.", language: "BOTH", status: "DRAFT" },
        { title: "Legal Research & Drafting", description: "Research, pleadings and document drafting support.", language: "ENGLISH", status: "PUBLISHED" },
      ],
    });
  }
  console.log("Seeded admin, sample employees and sample data.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
