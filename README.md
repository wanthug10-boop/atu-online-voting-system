# ATU Online Voting System

An online voting system for students at **Accra Technical University**. Built with Next.js 14, Neon PostgreSQL, and NextAuth.js.

## Features

- **Multiple Election Types** — SRC, Departmental, Hall, and Class-level elections
- **Secure Authentication** — Student ID + University Email with password
- **Role-Based Access** — Super Admin, Election Committee, and Student roles
- **Candidate Management** — Photo upload, manifestos, approval workflow
- **One Student, One Vote** — Prevents duplicate voting per position
- **Real-time Results** — Live vote counts with visual charts
- **Audit Trail** — Complete logging of all system actions
- **Voter Turnout Tracking** — Monitor participation rates
- **Printable Reports** — Export results as PDF/CSV

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router, TypeScript) |
| Database | Neon PostgreSQL (serverless) |
| ORM | Prisma |
| Auth | NextAuth.js v5 (Credentials) |
| UI | Tailwind CSS + shadcn/ui |
| Charts | Recharts |
| Hosting | Vercel (Free Tier) |

## Getting Started

### Prerequisites

- Node.js 18+
- A Neon PostgreSQL database ([free tier](https://neon.tech))

### Environment Variables

```env
DATABASE_URL="postgresql://user:password@ep-xxxx.us-east-2.aws.neon.tech/neondb?sslmode=require"
AUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

### Installation

```bash
npm install
npm run db:push
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Test Accounts

| Role | Student ID | Password |
|------|-----------|----------|
| Super Admin | `ADMIN001` | `admin123` |
| Election Committee | `COM001` | `admin123` |
| Student | `2023001` | `admin123` |

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── auth/                 # Login, Register
│   ├── dashboard/            # Student dashboard
│   ├── admin/                # Super Admin panel
│   ├── committee/            # Election Committee panel
│   ├── voter/                # Voting & Results
│   └── api/                  # REST API routes
├── components/
│   ├── ui/                   # shadcn-style components
│   └── app-nav.tsx           # Role-based navigation
└── lib/
    ├── auth.ts               # NextAuth configuration
    ├── prisma.ts             # Database client
    └── constants.ts          # ATU-specific values
```

## Deployment

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

Connect your Neon database, add environment variables, and deploy.
