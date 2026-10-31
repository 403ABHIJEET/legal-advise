export const AREAS_OF_LAW = [
  "Divorce & Family Law", "Civil Cases", "Criminal Cases", "Bail Matters",
  "Property & Real Estate", "Consumer Disputes", "Cheque Bounce",
  "Corporate & Business Law", "Employment Matters", "Legal Notices", "Other / General Query",
] as const;

export type AreaOfLaw = (typeof AREAS_OF_LAW)[number];

export const NAV_SERVICES = [
  "Divorce & Family Law", "Civil Cases", "Criminal Cases", "Bail Matters",
  "Property & Real Estate", "Consumer Disputes", "Cheque Bounce",
  "Corporate & Business", "Employment Matters", "Legal Notices",
];

export const DEFAULT_SERVICES: { title: string; desc: string; area: AreaOfLaw }[] = [
  { title: "Divorce & Family Matters", desc: "Guidance on matrimonial disputes, divorce proceedings, maintenance and related family matters.", area: "Divorce & Family Law" },
  { title: "Civil Cases & Property Disputes", desc: "Assistance with civil litigation, property matters, injunctions and recovery disputes.", area: "Civil Cases" },
  { title: "Criminal Matters & Bail", desc: "Legal representation and procedural guidance in criminal matters and bail applications.", area: "Criminal Cases" },
  { title: "Consumer Disputes", desc: "Support with consumer complaints and dispute-resolution processes.", area: "Consumer Disputes" },
  { title: "Cheque Bounce / NI Act", desc: "Assistance with notices and proceedings under applicable negotiable instruments law.", area: "Cheque Bounce" },
  { title: "Legal Notices & Drafting", desc: "Drafting support for legal notices, agreements and related documents.", area: "Legal Notices" },
  { title: "Corporate & Commercial Disputes", desc: "Support for commercial disputes, contracts and business-related legal matters.", area: "Corporate & Business Law" },
  { title: "Employment & Service Matters", desc: "Guidance on employment, workplace and service-related disputes.", area: "Employment Matters" },
  { title: "Other Legal Queries", desc: "Submit a general enquiry so the office can review the nature of your query.", area: "Other / General Query" },
];

export const APPROACH_STEPS = [
  { n: "01", title: "Consultation", text: "We listen to your concerns and understand the facts and objectives." },
  { n: "02", title: "Strategy", text: "We review the issue and discuss a considered path forward." },
  { n: "03", title: "Representation & Action", text: "Where engaged, we prepare and progress the matter with diligence." },
  { n: "04", title: "Updates & Resolution", text: "We communicate developments and work toward an appropriate outcome." },
];
