# Pranj Legal Associates — Next.js

Public website + practice-management workspace, converted from the static HTML prototype.

**Stack:** Next.js (App Router, Server Components + Server Actions) · React 19 · TypeScript · Tailwind CSS v4 · Prisma · PostgreSQL (Neon)

## Setup

```bash
npm install
cp .env.example .env        # then fill in the three values below
npx prisma db push          # creates the tables in your Neon database
npm run db:seed             # creates the admin user (+ optional sample data)
npm run dev                 # http://localhost:3000
```

`.env`:

| Variable | Notes |
|---|---|
| `DATABASE_URL` | Your Neon Postgres connection string (`...?sslmode=require`). |
| `AUTH_SECRET` | 32+ random chars: `openssl rand -base64 48`. Signs login cookies. |
| `SEED_PASSWORD` | Initial password for seeded accounts (min 8 chars). Change after first login. |
| `SEED_ADMIN_EMAIL` | Optional. Defaults to `admin@pranjlegal.demo`. |
| `SEED_SAMPLE_DATA` | `true` also seeds the 3 demo employees, cases, documents and campaigns from the prototype. |

Neon tip: if `prisma db push` stalls on a pooled (`-pooler`) host, run that one command with the direct (non-pooler) connection string; use the pooled one at runtime.

## Structure

```
prisma/schema.prisma, seed.ts
src/app/page.tsx                 public homepage (server component, reads settings + published campaigns from DB)
src/app/login/                   sign-in
src/app/dashboard/*              overview, cases, calendar, documents, employees*, assignments*, office-calendar*,
                                 advertising*, enquiries*, settings*      (* = admin only)
src/app/api/enquiries/export     CSV export (admin only)
src/actions/*                    all mutations (server actions, validated with zod, auth-checked)
src/lib/                         prisma client, session (JWT cookie), auth guards, i18n (EN/HI), formatting
```

## What changed from the prototype

- **Real persistence**: everything that lived in a JS object is now a Prisma model.
- **Real authentication**: bcrypt-hashed passwords, signed httpOnly session cookie. The role is read from the database (the prototype let anyone pick "Administrator"). Every page and server action re-checks the session/role.
- **Public form → database**: enquiries are stored and appear in Dashboard → Enquiries. A hidden honeypot field filters basic bots.
- **Website settings** (address / phone / email / map link) are saved in the database and shown in the public footer.
- **Published campaigns** appear as extra service cards on the homepage.
- Employees only see cases they lead or support, and events tied to those cases plus office events; admins see everything.
- Fake demo figures (sample impressions/enquiries) were replaced with real counts.
- Profile photos are now an https URL field (the prototype stored base64 in memory). For uploads, add Vercel Blob / S3 / Cloudinary.

## Before going live

- Add rate limiting on `/login` and the enquiry form (e.g. Upstash Ratelimit) and a CAPTCHA if spam appears.
- Add an audit log and database backups (Neon has point-in-time restore).
- Add a privacy notice / terms page (the footer link is a placeholder) and review the content against Bar Council rules.
- Send an email/WhatsApp notification on new enquiries if desired (hook into `submitEnquiry` in `src/actions/enquiry.ts`).
