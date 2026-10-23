# Outpost — Dual-Surface Agentic Workspace

> **An autonomous AI agent that draws and writes alongside you and your team, live.**

Outpost is a dual-surface workspace engineered for product teams, engineering leaders, founders, solo builders, and technical consultants. Every outpost pairs an expressive, structured living document with an infinite spatial canvas, unified under an autonomous AI agent capable of reading, reasoning, and editing across both surfaces simultaneously.

---

## ✦ Core Architecture & Surfaces

```
                              ┌────────────────────────────────────────┐
                              │            OUTPOST AGENT               │
                              │  (Vercel AI SDK + Google Gemini 2.0/   │
                              │   Flash / Pro Reasoning Models)        │
                              └──────────────────┬─────────────────────┘
                                                 │
                        ┌────────────────────────┴────────────────────────┐
                        ▼                                                 ▼
          ┌───────────────────────────┐                     ┌───────────────────────────┐
          │     THE LIVING DOC        │ ◄─── Bi-directional ──► │   THE INFINITE CANVAS     │
          │  • BlockNote & Yjs CRDT   │       Sync & State      │  • tldraw Spatial Vector  │
          │  • Tech Specs & RFCs      │       Translation       │  • Topologies & ERDs      │
          │  • Markdown & Slashes     │                         │  • Systems Flowcharts     │
          └───────────────────────────┘                     └───────────────────────────┘
```

### 1. The Living Document

A structured block-based document editor designed for engineering specifications, RFCs, user journey stories, and system documentation. Features slash commands, inline code blocks, Callouts, and live Yjs CRDT real-time multiplayer synchronization.

### 2. The Infinite Canvas

An unbounded vector whiteboarding canvas powered by tldraw. Sketch architectures, map microservice topologies, generate entity-relationship diagrams (ERDs), and visualize product roadmaps with crisp spatial clarity.

### 3. The Dual-Surface Agent

An AI partner integrated via the Vercel AI SDK (`ai`, `@ai-sdk/react`, `@ai-sdk/google`, `zod`). It reads both the doc and the canvas concurrently — turn a whiteboard topology into a formal PRD, or prompt the agent to translate a written specification into connected visual canvas nodes with zero context switching.

### 4. Interactive Voice & Terminal Planner

A telemetry-grade prompt launcher on the dashboard featuring voice dictation (Web Speech API integration via `MicButton`), quick-start engineering prompts, and automatic workspace deployment.

### 5. Fleet Matrix Workspaces Command

A multi-view workspace operational center (`/workspaces`):

- **Kanban Board**: Drag-and-drop workflow across four lifecycle stages (`PLANNING`, `IN_PROGRESS`, `IN_REVIEW`, `DONE`) powered by `@hello-pangea/dnd` with unclipped card elevation and dynamic drop-target highlighting.
- **Card Grid View**: Responsive 4-column card view showcasing relative timestamps, creator badges, and quick-access actions.
- **High-Density Monospace Table**: Detailed engineering table displaying workspace titles, descriptions, color-coded stage badges, last activity timestamps, creator avatars, and direct links.
- **Live Pipeline Telemetry**: Real-time KPI stage counters and a segmented distribution progress bar that react instantly when cards are moved.
- **Instant Search & Filters**: Live title/description filtering with `/` keyboard shortcut and stage filter pills.

### 6. Multi-Tenancy & Access Control

Powered by Clerk Organizations:

- **Team Workspaces**: Owned by Clerk Organizations with role-based access control (`org:admin`, `org:member`, `org:viewer`).
- **Solo Builder Mode**: Membership-optional personal workspaces without requiring an organization.
- **Cryptographic Sharing**: Public read-only sharing via high-entropy `base64url` tokens with plan-level access gating.

### 7. Usage & Plan Entitlements

Integrated billing and quota enforcement:

- Free tier limits: `3` workspaces, `20` agent prompts/month.
- Pro & Team tiers: unlimited workspaces, 500–2,000 prompts/month per member, public read-only sharing links, and PDF exports.
- Real-time `PlanButton` in the global navigation bar showing prompt consumption with live progress meters and Clerk checkout integration.

---

## ✦ Tech Stack

| Layer | Technology | Description |
| --- | --- | --- |
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router, Turbopack) | Server Components, Server Actions, Dynamic Route Handlers |
| **Runtime** | [React 19](https://react.dev/) | React Server Components, Suspense, `useSyncExternalStore` |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) | Modern `@theme inline` CSS configuration & custom OKLCH color spaces |
| **Design Language** | **Oxide** | Custom warm graphite + vermilion signal dark-mode design system |
| **Authentication** | [Clerk](https://clerk.com/) (`@clerk/nextjs` v7) | Multi-tenant organizations, User sync, Middleware route protection |
| **AI SDK** | [Vercel AI SDK](https://sdk.vercel.ai/) & `@ai-sdk/google` | Model orchestration, streaming responses, structured schema validation with [Zod](https://zod.dev/) |
| **Database** | [PostgreSQL](https://www.postgresql.org/) via [Supabase](https://supabase.com/) | Managed relational storage |
| **ORM** | [Prisma ORM 7](https://www.prisma.io/) (`@prisma/client`, `@prisma/adapter-pg`) | Type-safe queries, driver adapter, declarative migrations |
| **Realtime & State** | [Supabase](https://supabase.com/) & [Yjs](https://yjs.dev/) | CRDT binary document synchronization |
| **Drag & Drop** | [@hello-pangea/dnd](https://github.com/hello-pangea/dnd) | Accessible drag-and-drop kanban matrix |
| **UI Primitives** | [Radix UI](https://www.radix-ui.com/) & [Shadcn UI](https://ui.shadcn.com/) | Accessible dropdowns, dialogs, alerts, tooltips, separators |
| **Icons & Typography** | [Lucide React](https://lucide.dev/), Instrument Serif, Bricolage Grotesque, Geist | Technical editorial aesthetics |

---

## ✦ Project Directory Structure

```text
outpost/
├── actions/                         # Next.js Server Actions
│   ├── check-user.ts                # Auto-sync Clerk user credentials into database
│   ├── usage.ts                     # Monthly prompt quota & billing telemetry
│   └── workspace.ts                 # Workspace CRUD, drag repositioning, & sharing tokens
├── app/
│   ├── (auth)/                      # Authentication layouts & routes
│   │   ├── sign-in/[[...sign-in]]/  # Clerk modal/page sign-in
│   │   └── sign-up/[[...sign-up]]/  # Clerk modal/page sign-up
│   ├── (main)/                      # Protected application core
│   │   ├── dashboard/               # Main telemetry deck & recent workspaces
│   │   │   └── _components/
│   │   │       ├── DashboardPrompt.tsx  # Voice-enabled AI workspace creator
│   │   │       └── RecentWorkspaces.tsx # Recent outpost grid cards
│   │   ├── workspace/[id]/          # Dual-surface workspace (Doc + Canvas editor)
│   │   └── workspaces/              # Fleet matrix command center
│   │       ├── _components/
│   │       │   └── WorkspaceBoard.tsx   # Kanban, Grid, & Table multi-view board
│   │       └── page.tsx             # Workspaces page with KPI cards & pipeline bar
│   ├── _components/                 # Landing page marketing components
│   │   ├── AudienceStrip.tsx        # Target audience personas
│   │   ├── DocMock.tsx              # BlockNote living document preview mock
│   │   ├── FinalCta.tsx             # Survey-grade bottom conversion station
│   │   ├── FlowchartMock.tsx        # Vector topology preview mock
│   │   ├── Footer.tsx               # Telemetry footer with mascot blueprint
│   │   ├── HowItWorksWaypoints.tsx  # Three-step workflow guide
│   │   ├── KanbanMock.tsx           # Interactive team kanban preview mock
│   │   └── SurfaceRow.tsx           # Alternating feature showcase rows
│   ├── _data/
│   │   └── landing.ts               # Marketing copy, audience definitions, & telemetry
│   ├── favicon.ico
│   ├── globals.css                  # Oxide design tokens, OKLCH utilities, scroll animations
│   ├── layout.tsx                   # Root layout with fonts, ClerkProvider, & AppShell
│   └── page.tsx                     # Public landing page
├── components/                      # Shared reusable UI components
│   ├── hooks/
│   │   └── use-fetch.ts             # Safe async action wrapper with loading state
│   ├── ui/                          # Radix / Shadcn primitives (button, dialog, input, etc.)
│   ├── AppShell.tsx                 # Header/nav boundary (marketing vs workspace layout)
│   ├── MicButton.tsx                # Browser SpeechRecognition voice dictation button
│   ├── PlanButton.tsx               # Real-time prompt quota tracker pill in header
│   ├── PricingPlans.tsx             # Multi-tier personal & organization pricing matrix
│   ├── SiteHeader.tsx               # Persistent navigation bar with org switcher & auth
│   ├── UpgradeDialog.tsx            # Contextual upgrade modal triggered on quota breach
│   ├── WorkspaceCard.tsx            # Unified card renderer for boards, grids, & lists
│   └── WorkspaceDialog.tsx          # Create & edit workspace modal
├── lib/                             # Core utilities & database configurations
│   ├── generated/prisma/            # Output directory for generated Prisma Client
│   ├── billing.ts                   # Clerk subscription inspection & prompt accounting
│   ├── plan-limits.ts               # Free vs paid thresholds & limit reason messages
│   ├── prisma.ts                    # Global Prisma client singleton with pg adapter
│   ├── utils.ts                     # Styling & keyboard helper utilities
│   ├── workspace-access.ts          # Organization membership verification
│   ├── workspace-scope.ts           # Workspace scoping queries (Personal vs Org)
│   └── workspace-status.ts          # Stage definitions & last-activity aggregators
├── prisma/
│   └── schema.prisma                # Relational schema (User, Workspace, Doc, Canvas, Prompt)
├── public/
│   ├── brand/                       # Logos, mascot stamps, and branding assets
│   ├── textures/                    # Topographic contour SVGs for background masks
│   └── videos/                      # Product video previews & poster frames
├── prisma7.config.ts                # Prisma 7 CLI configuration
├── proxy.ts                         # Route protection middleware using Clerk
└── package.json                     # Project manifest & dependency lock
```

---

## ✦ Database Schema (Prisma 7)

```prisma
enum WorkspaceStatus {
  PLANNING
  IN_PROGRESS
  IN_REVIEW
  DONE
}

model User {
  id                String            @id @default(cuid())
  clerkId           String            @unique
  email             String            @unique
  name              String?
  imageUrl          String?
  createdAt         DateTime          @default(now())
  updatedAt         DateTime          @updatedAt

  createdWorkspaces Workspace[]
  agentPrompts      AgentPrompt[]
}

model Workspace {
  id          String          @id @default(cuid())
  name        String
  description String?
  creatorId   String
  clerkOrgId  String?         // Clerk organization ID (null for personal workspaces)
  status      WorkspaceStatus @default(PLANNING)
  position    Float           @default(0)   // Fractional midpoint positioning for drag & drop
  shareToken  String?         @unique       // Cryptographic read-only sharing token
  createdAt   DateTime        @default(now())
  updatedAt   DateTime        @updatedAt

  creator      User          @relation(fields: [creatorId], references: [id], onDelete: Cascade)
  doc          Doc?          // Exactly one Doc paired per workspace
  canvas       Canvas?       // Exactly one Canvas paired per workspace
  agentPrompts AgentPrompt[]

  @@index([creatorId])
  @@index([clerkOrgId])
}

model Doc {
  id          String    @id @default(cuid())
  workspaceId String    @unique
  content     Json?     // BlockNote block JSON structure
  yjsState    Bytes?    // Yjs binary state for real-time collaboration
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  workspace   Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
}

model Canvas {
  id          String    @id @default(cuid())
  workspaceId String    @unique
  content     Json?     // tldraw shape snapshot
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  workspace   Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
}

model AgentPrompt {
  id          String    @id @default(cuid())
  ownerId     String    // Clerk user ID or org ID
  userId      String
  workspaceId String?
  createdAt   DateTime  @default(now())

  user        User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  workspace   Workspace? @relation(fields: [workspaceId], references: [id], onDelete: SetNull)

  @@index([ownerId, createdAt])
}
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

- **Node.js**: `v20.x` or higher
- **Package Manager**: `npm`, `pnpm`, or `bun`
- **PostgreSQL Database**: Supabase, Neon, or local PostgreSQL
- **Clerk Account**: For authentication, organizations, and billing

### 2. Environment Variables

Create a `.env` file in the project root:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Database Connection (Prisma 7 with pg adapter)
DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST]:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres"

# Supabase (Realtime & Storage)
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT-REF].supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...

# AI Provider (Google Gemini via Vercel AI SDK)
GOOGLE_GENERATIVE_AI_API_KEY=AIzaSy...
```

### 3. Installation

```bash
npm install
```

### 4. Database Setup

Generate the Prisma Client and sync the schema with your database:

```bash
npx prisma generate
npx prisma db push
```

### 5. Running the Application

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the landing page, or authenticate to access the `/dashboard` and `/workspaces` command matrix.

---

## ✦ Completed Features & Implementation Progress

- [x] **Full-Surface Landing Page**:
  - Interactive hero with `topo-bg`, `survey-frame`, and video showcase with `scroll-tilt`.
  - Persona breakdown for product teams, solo founders, and consultants.
  - Interactive mock previews (`FlowchartMock`, `DocMock`, `KanbanMock`).
  - Waypoints guide and multi-tier pricing section (`PricingPlans.tsx`).
- [x] **Clerk Multi-Tenancy & Auth**:
  - Personal account & organization switcher in universal header.
  - Automatic user synchronization into database via `checkUser()`.
  - Route protection and authentication rules via `proxy.ts`.
- [x] **Database & ORM Layer**:
  - Prisma 7 configuration with `@prisma/adapter-pg`.
  - Atomically paired Workspace rows with child `Doc` and `Canvas` models.
  - Fractional midpoint indexing (`positionBetween`) for fast zero-reindex drag ordering.
- [x] **Billing & Plan Quota System**:
  - Clerk billing integration with tier checks (Free, Pro, Team).
  - Monthly prompt usage tracking (`AgentPrompt` model) with monthly reset logic.
  - Contextual `UpgradeDialog` triggered when exceeding workspace or prompt limits.
  - Dynamic `PlanButton` in header with real-time progress bar.
- [x] **Dashboard Telemetry & Planner**:
  - Ambient vermilion oxide glow and station scope strip.
  - AI prompt terminal (`DashboardPrompt`) with speech-to-text voice dictation (`MicButton`).
  - Recent outposts carousel with empty-state inspiration starters.
- [x] **Workspaces Fleet Matrix (`/workspaces`)**:
  - Multi-view switcher: **Kanban Board**, **Grid View**, and **High-Density Monospace Table**.
  - Unclipped, elevated drag-and-drop workflow across 4 stages with `@hello-pangea/dnd`.
  - Live KPI stage cards (Planning, In Progress, In Review, Done) and segmented pipeline progress bar.
  - Real-time search with `/` hotkey listener and stage filter pills.
  - Create, edit, and cascade-delete with safe confirmation dialogs.
- [x] **Dual-Surface Workspace Route (`/workspace/[id]`)**:
  - Workspace authorization, multi-tenant permission verification, and silent 404 security.
  - Surface switching support (`doc`, `canvas`, `both`).
  - AI SDK integration setup (`ai`, `@ai-sdk/react`, `@ai-sdk/google`, `zod`).

---

## ✦ License

Private repository. Copyright © 2026 Outpost Inc. All rights reserved.
