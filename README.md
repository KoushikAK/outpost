# Outpost — Agentic Workspace

> An AI agent that draws and writes alongside you and your team, live.

Outpost is a dual-surface workspace built for product teams, founders, solo builders, agencies, and engineering consultants. Every project in Outpost pairs an expressive living document with an infinite spatial canvas, unified under an autonomous AI agent that operates seamlessly across both.

---

## ✦ Core Surfaces

Outpost bridges the gap between linear prose and freeform diagrams:

- **The Living Document**: A block-based editor designed for technical specifications, RFCs, and product roadmaps. Supports markdown shortcuts, slash commands, inline code, and live Yjs CRDT multiplayer synchronization.
- **The Infinite Canvas**: An unbounded spatial whiteboarding surface powered by tldraw. Sketch architectures, map system topologies, generate ERDs, and organize complex brainstorms with vector fidelity.
- **The Dual-Surface Agent**: An autonomous intelligence that reads both surfaces simultaneously. It translates canvas diagrams into written PRDs, or compiles textual briefs into node-by-node canvas architecture diagrams with in-place editing.
- **Team Board**: An organization-wide kanban board tracking all outposts (`Planning`, `In Progress`, `In Review`, `Done`) with live multiplayer cursors, allowing teammates to jump into any project instantly.

---

## ✦ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack, React 19)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with custom **OXIDE** theme system
- **Authentication**: [Clerk](https://clerk.com/) (`@clerk/nextjs`) with multi-tenant Organizations & solo-builder personal workspaces
- **Database & ORM**: PostgreSQL via [Prisma ORM 7](https://www.prisma.io/) (`@prisma/client`, `@prisma/adapter-pg`)
- **Backend / Realtime**: [Supabase](https://supabase.com/) & Yjs CRDT binary sync
- **Icons & UI**: [Lucide React](https://lucide.dev/), [Radix UI](https://www.radix-ui.com/), and [Sonner](https://sonner.emilkowal.ski/)
- **Typography**: Instrument Serif, Bricolage Grotesque, Geist Sans, and Geist Mono

---

## ✦ Project Structure

```text
outpost/
├── actions/
│   └── check-user.ts           # Clerk-to-database user synchronization action
├── app/
│   ├── (auth)/                 # Clerk auth routes (sign-in, sign-up)
│   ├── (main)/
│   │   ├── dashboard/          # Team board & workspace kanban
│   │   └── workspace/[id]/     # Twin-surface workspace (Doc + Canvas)
│   ├── _components/            # Landing page interactive preview mocks:
│   │   ├── AudienceStrip.tsx   # "Who's it for" audience breakdown
│   │   ├── SurfaceRow.tsx      # Alternating feature surface rows
│   │   ├── FlowchartMock.tsx   # Canvas flowchart & vector node mock
│   │   ├── DocMock.tsx         # BlockNote living document mock
│   │   ├── KanbanMock.tsx      # Team kanban & live cursor mock
│   │   ├── HowItWorksWaypoints.tsx # Waypoint route (Intake → Synthesis → Iteration)
│   │   ├── FinalCta.tsx        # Survey-grade final CTA station
│   │   └── Footer.tsx          # Drafted telemetry footer with mascot blueprint
│   ├── _data/
│   │   └── landing.ts          # Centralized landing page copy & telemetry data
│   ├── globals.css             # Tailwind v4 theme, OKLCH tokens, and custom utilities
│   ├── layout.tsx              # Root layout with fonts, ClerkProvider, and AppShell
│   └── page.tsx                # Landing page entry point
├── components/
│   ├── ui/                     # Reusable Shadcn & Radix primitives (Button, Tooltip, etc.)
│   ├── AppShell.tsx            # Conditional layout wrapper for marketing vs workspace
│   └── SiteHeader.tsx          # Universal navbar with Clerk auth buttons & org switcher
├── prisma/
│   └── schema.prisma           # Prisma 7 database schema (User, Workspace, Doc, Canvas, AgentPrompt)
├── proxy.ts                    # Clerk route-protection middleware (dashboard, workspace)
└── public/
    ├── brand/                  # Logo and mascot assets
    ├── textures/topo.svg       # Topographic contour mask for topo-bg utility
    └── videos/                 # Hero demo video and poster
```

---

## ✦ Design System: Oxide

The application is styled with the custom **Oxide** design language — warm graphite paired with vermilion signal accents, engineered specifically for dark mode:

| Utility | Description |
| --- | --- |
| `topo-bg` | Generates glowing topographic contours centered on vermilion and cooling to bone edges. |
| `survey-frame` | Renders drafted map-sheet crop marks at the element corners. |
| `edge-light` | Produces a delicate hairline border where light catches the top edge. |
| `glow` | Applies radiant vermilion signal aura to primary CTAs. |
| `scroll-tilt` | Pure CSS perspective tilt that leans back and settles flat over the first 500px of scroll. |
| `grain` | Subtly overlays analog film texture to remove digital flatness. |

---

## ✦ Getting Started

### 1. Prerequisites

- **Node.js**: v20 or higher
- **pnpm** / **npm** / **yarn** / **bun**
- A **PostgreSQL** instance (e.g. Supabase)
- A **Clerk** application for authentication

### 2. Environment Variables

Create a `.env` file in the project root:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Database Connection (Prisma)
DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST]:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres"

# Supabase (Realtime & Storage)
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT-REF].supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

### 3. Install Dependencies

```bash
npm install
# or
pnpm install
```

### 4. Database Setup

Generate Prisma Client and push schema to your database:

```bash
npx prisma generate
npx prisma db push
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the landing page.

---

## ✦ Completed Milestones

- [x] **Prisma 7 Database Schema**: Models for `User`, `Workspace` (paired doc & canvas), `Doc` (BlockNote JSON + Yjs binary), `Canvas` (tldraw state), and `AgentPrompt` (monthly usage counters).
- [x] **Clerk Multi-Tenancy**: Organization and personal workspace support with protected routes in `proxy.ts`.
- [x] **Oxide Design System**: Topographic gradients, survey frames, hairline lighting, and custom fonts.
- [x] **Full Landing Page**:
  - Hero on `topo-bg` with mono eyebrow, vermilion headline, and video showcase in `survey-frame` and `scroll-tilt`.
  - "Who's it for" audience breakdown for product teams, founders, solo builders, agencies, and consultants.
  - Three platform surface rows with custom interactive-style mocks (`FlowchartMock`, `DocMock`, `KanbanMock`).
  - Waypoint route "How it works" section (Describe it → Watch the agent draw → Keep iterating together).
  - Transparent pricing tiers (Solo Builder, Pro Outpost, Team / Studio).
  - High-impact station Final CTA with radiant ambient glow.
  - Drafted telemetry footer with mascot blueprint stamp and operational coordinates.

---

## ✦ License

Private repository. Copyright © 2026 Outpost Inc. All rights reserved.
