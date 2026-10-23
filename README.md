# Outpost

> **A collaborative AI-powered workspace** — combining a rich-text document editor and an infinite whiteboard canvas, unified by a context-aware Gemini agent.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Database Schema](#database-schema)
- [AI Agent](#ai-agent)
- [Pricing & Plans](#pricing--plans)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment Variables](#environment-variables)
  - [Installation](#installation)
  - [Database Setup](#database-setup)
  - [Running Locally](#running-locally)
- [Deployment](#deployment)
- [Canvas Sync Server](#canvas-sync-server)
- [Key Workflows](#key-workflows)
- [Contributing](#contributing)

---

## Overview

Outpost is a **multi-surface workspace** built with Next.js. Every workspace has exactly two surfaces that are always in sync:

| Surface    | Description                                                                                                                     |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------- |
| **Doc**    | A BlockNote-powered rich-text editor with real-time Yjs collaboration via Supabase Realtime                                     |
| **Canvas** | A tldraw infinite whiteboard with multiplayer support, custom ERD (Entity Relationship Diagram) tables, and smart arrow snapping |

A **Gemini 3.8 Flash** agent sits across both surfaces -- it can read the current state of the doc and canvas, then make targeted edits to either using a structured tool-call protocol. Users can also use a microphone button to dictate prompts via voice.

---

## Features

### Workspace Management

- **Kanban-style dashboard** -- workspaces displayed as cards in `PLANNING`, `IN_PROGRESS`, `IN_REVIEW`, and `DONE` columns with drag-and-drop reordering (fractional position indexing, so only the moved card is ever written to the database)
- **Editable workspace name** -- inline editing directly on the workspace header
- **Public share links** -- generate a read-only shareable link backed by a signed token; resetting the token instantly invalidates old links (paid feature)

### Document Editor

- **BlockNote** rich-text editor with Markdown-like shortcuts (headings, lists, checklists, tables, code blocks, bold, links)
- **Real-time collaboration** via Yjs + Supabase Realtime; the Yjs document state is also persisted in PostgreSQL as `yjsState` bytes (Supabase acts as the transport, Postgres as the durable store)
- **PDF export** of the document (paid feature)

### Canvas Editor

- **tldraw v5** infinite whiteboard
- **Custom ERD shape** (`EntityTableShapeUtil`) -- add named entity tables with typed columns directly on the canvas
- **Smart arrow snapping** -- arrows drawn onto an ERD table automatically snap to the nearest row
- **Real-time multiplayer** -- collaborators see each other's cursors with real names and avatar colours (seeded from Clerk)
- **Canvas sync** -- backed by a Cloudflare Worker tldraw-sync server (optional; falls back to tldraw's public demo server)
- **Auto-save** -- debounced 1 s snapshot back to Postgres

### AI Agent

- Powered by **Google Gemini 3.8 Flash** via Vercel AI SDK
- Reads the live canvas and doc state as context before every response
- Makes changes **only via tool calls** -- never describes edits in plain text
- Streaming responses with reasoning (`thinkingConfig`)
- Voice input via a mic button
- Monthly prompt usage metering per owner (org or user) with upgrade prompts when the limit is reached

### Authentication & Teams

- **Clerk** for authentication, organization management, and billing
- Users can work in a **personal** workspace or inside a **Clerk Organization** (team)
- Role-based access: org admins can manage billing; members get full workspace access; viewers get read-only access
- Plans and pricing rendered dynamically from Clerk's plan API

---

## Tech Stack

| Layer                   | Technology                                                                                    |
| ----------------------- | --------------------------------------------------------------------------------------------- |
| **Framework**           | [Next.js 16](https://nextjs.org/) (App Router, Turbopack)                                    |
| **Language**            | TypeScript 5                                                                                  |
| **Styling**             | Tailwind CSS v4 + `tw-animate-css`                                                            |
| **UI Components**       | Radix UI + shadcn/ui                                                                          |
| **Auth & Billing**      | [Clerk](https://clerk.com/) (auth, orgs, billing, plans)                                     |
| **Database**            | PostgreSQL (via [Supabase](https://supabase.com/))                                            |
| **ORM**                 | [Prisma 7](https://www.prisma.io/) with `@prisma/adapter-pg`                                 |
| **Real-time Collab**    | [Yjs](https://yjs.dev/) + Supabase Realtime (doc); tldraw-sync / Cloudflare Worker (canvas)  |
| **Document Editor**     | [BlockNote](https://www.blocknotejs.org/) with Mantine renderer                               |
| **Canvas / Whiteboard** | [tldraw v5](https://www.tldraw.com/)                                                          |
| **AI / Agent**          | [Vercel AI SDK](https://sdk.vercel.ai/) + Google Gemini 3.8 Flash (`@ai-sdk/google`)         |
| **Drag & Drop**         | `@hello-pangea/dnd`                                                                           |
| **PDF Export**          | `@react-pdf/renderer` + `jspdf`                                                               |
| **Date Utilities**      | `date-fns`                                                                                    |
| **Validation**          | `zod` v4                                                                                      |
| **Notifications**       | `sonner`                                                                                      |
| **Panels**              | `react-resizable-panels`                                                                      |

---

## Architecture

```text
+-------------------------------------------------------------------+
|                         Next.js App Router                        |
|                                                                   |
|  /               Landing page                                     |
|  /sign-in        /sign-up       Clerk-hosted auth                 |
|  /dashboard      Kanban board (workspace cards)                   |
|  /workspace/[id] Split-panel workspace (doc + canvas + agent)     |
|  /workspaces     Workspace list                                   |
|                                                                   |
|  /api/agent      Gemini streaming endpoint (POST)                 |
+----------------------------------+--------------------------------+
                                   |
              +--------------------+-------------------+
              |                    |                   |
     +--------+--------+  +--------+--------+  +-------+-------+
     |   Clerk Auth    |  |   PostgreSQL    |  |   Supabase    |
     |   + Billing     |  |   (Supabase)   |  |   Realtime    |
     |                 |  |  via Prisma 7  |  |   (Yjs doc)   |
     +-----------------+  +-----------------+  +-------+-------+
                                                       |
                                              +--------+-------+
                                              | Cloudflare     |
                                              | Worker         |
                                              | (tldraw-sync)  |
                                              +----------------+
```

### Key Design Decisions

- **Membership source of truth is Clerk Orgs** -- the `Workspace` model only stores `clerkOrgId` for association; roles/permissions live entirely in Clerk.
- **One doc + one canvas per workspace** -- not a generic list; both are created atomically alongside the workspace.
- **Canvas sync is optional** -- if `NEXT_PUBLIC_TLDRAW_SYNC_URL` is empty, tldraw's public demo server is used (fine for dev; rooms are public and get wiped).
- **Agent tools run in the browser** -- the `/api/agent` route returns tool definitions with no server-side `execute`; the client hooks execute them against the live editor instances (canvas and doc), since that is where the real state lives.
- **Fractional position indexing** for kanban -- dropping a card takes the midpoint between its neighbours, so only the moved card is ever written.
- **Prompt metering survives workspace deletion** -- `AgentPrompt` rows use `onDelete: SetNull` so deleting a workspace cannot reset usage.

---

## Database Schema

```text
User
+-- id (cuid)
+-- clerkId (unique)
+-- email (unique)
+-- name, imageUrl
+-- -> createdWorkspaces[], agentPrompts[]

Workspace
+-- id (cuid)
+-- name, description
+-- creatorId -> User
+-- clerkOrgId (Clerk Org, nullable for personal workspaces)
+-- status: PLANNING | IN_PROGRESS | IN_REVIEW | DONE
+-- position (Float, fractional for kanban ordering)
+-- shareToken (unique, nullable -- null = sharing off)
+-- -> doc (Doc?), canvas (Canvas?), agentPrompts[]

Doc
+-- id, workspaceId (unique)
+-- content (Json -- BlockNote block JSON)
+-- yjsState (Bytes -- Yjs CRDT state, collaboration source of truth)

Canvas
+-- id, workspaceId (unique)
+-- content (Json -- tldraw snapshot)

AgentPrompt
+-- id, ownerId (Clerk org_id or user_id), userId, workspaceId?
+-- createdAt  <- indexed with ownerId for monthly usage queries
```

---

## AI Agent

The agent is defined in `app/api/agent/route.ts`.

### How It Works

1. The client sends `{ messages, workspaceId, canvasContext, docContext }` to `POST /api/agent`
2. The server checks auth (Clerk), workspace access, and monthly prompt quota
3. Gemini 3.8 Flash receives a system prompt with the current canvas state and doc state injected as context
4. The model streams back text + tool calls (with reasoning via `thinkingConfig: { includeThoughts: true }`)
5. Tool calls are executed **on the client** against the live tldraw and BlockNote editor instances
6. After the model finishes, a prompt usage record is written to Postgres

### Agent Tool Categories

| Category            | Tools                                                                                           |
| ------------------- | ----------------------------------------------------------------------------------------------- |
| **Canvas - shapes** | `createRect`, `createText`, `createArrow`, `createEllipse`, `deleteShape`, `moveShape`, `updateShape` |
| **Canvas - ERD**    | `createEntityTable`, `addColumn`, `updateColumn`, `removeColumn`, `connectRelationship`         |
| **Doc**             | `replaceDoc`, `insertDocContent`, `updateDocBlock`, `deleteDocBlocks`                           |

### System Prompt Rules (Summarised)

- Choose the surface from the request; only change what the user asks about
- Canvas: one tool call per shape; every shape needs a unique caller-assigned `id`; never invent an id that is not in the current state
- Canvas layout: no overlapping shapes; at least 100 px vertical gap, 120 px horizontal gap
- Doc: prefer targeted edits over full rewrites

---

## Pricing & Plans

Plans and features are defined in the **Clerk dashboard** -- not hardcoded in the app. The `PricingPlans` component fetches them via `usePlans` / `useSubscription` from `@clerk/nextjs/experimental`.

### Free Plan Limits (Hardcoded)

| Limit                 | Value |
| --------------------- | ----- |
| Workspaces            | 3     |
| Agent prompts / month | 20    |

### Paid Plan Gates

| Feature               | Free | Paid      |
| --------------------- | ---- | --------- |
| Workspaces            | 3    | Unlimited |
| Agent prompts / month | 20   | Plan-defined |
| Public share links    | No   | Yes       |
| PDF export            | No   | Yes       |

Paid plans support both **Personal** (flat monthly fee) and **Team** (seat-based, per member/month) billing. Clerk's `CheckoutButton` opens the billing drawer; org billing is restricted to members with `org:sys_billing:manage`.

---

## Project Structure

```text
outpost/
+-- app/
|   +-- (auth)/              # Sign-in / sign-up routes
|   +-- (main)/
|   |   +-- dashboard/       # Kanban board page
|   |   +-- workspace/[id]/  # Split-panel workspace page
|   |   |   +-- _components/ # CanvasEditor, DocEditor wrappers
|   |   +-- workspaces/      # Workspace list
|   +-- _components/         # Landing page sections (AudienceStrip, SurfaceRow, etc.)
|   +-- _data/               # Landing page copy (landingData)
|   +-- api/agent/           # POST /api/agent -- Gemini streaming endpoint
|   +-- shared/              # Shared read-only workspace view (public share links)
|   +-- globals.css          # Global Tailwind + custom styles
|   +-- layout.tsx           # Root layout (Clerk provider, theme, fonts)
|   +-- page.tsx             # Landing page
+-- actions/                 # Next.js Server Actions
|   +-- workspace.ts         # CRUD, status, position, share token
|   +-- doc.ts               # Doc content save
|   +-- canvas.ts            # Canvas snapshot save
|   +-- check-user.ts        # Upsert Clerk -> DB user
|   +-- usage.ts             # Agent usage helpers
+-- components/
|   +-- ui/                  # shadcn/ui primitives
|   +-- EntityTable/         # Custom tldraw ERD shape + toolbar button
|   +-- DocEditor.tsx        # BlockNote editor wrapper
|   +-- PricingPlans.tsx     # Pricing card grid (Personal / Team)
|   +-- WorkspaceCard.tsx    # Kanban card
|   +-- WorkspaceDialog.tsx  # Create / edit workspace modal
|   +-- MicButton.tsx        # Voice-to-agent mic button
|   +-- PlanButton.tsx       # Agent chat panel trigger
|   +-- WorkspaceEditorsContext.tsx  # Context for live editor refs
+-- lib/
|   +-- agent-tools.ts       # Zod-validated tool definitions for the agent
|   +-- agent-canvas.ts      # Canvas tool implementations
|   +-- agent-doc.ts         # Doc tool implementations
|   +-- billing.ts           # Prompt usage: getPromptUsage, recordPrompt
|   +-- plan-limits.ts       # FREE_WORKSPACE_LIMIT, FREE_MONTHLY_PROMPTS
|   +-- supabase-yjs-provider.ts  # Yjs <-> Supabase Realtime bridge
|   +-- workspace-access.ts  # Clerk org/membership access checks
|   +-- workspace-scope.ts   # Owner ID resolution (org vs user)
|   +-- workspace-status.ts  # Status label/icon helpers
|   +-- prisma.ts            # Prisma client singleton
|   +-- supabase.ts          # Supabase browser client
+-- prisma/
|   +-- schema.prisma        # Database schema
|   +-- migrations/          # SQL migration history
+-- public/                  # Static assets (images, video poster)
+-- next.config.ts           # Next.js config (Turbopack, partial prefetching, image domains)
+-- prisma7.config.ts        # Prisma CLI config (uses DIRECT_URL for migrations)
+-- package.json
+-- tsconfig.json
```

---

## Getting Started

### Prerequisites

- **Node.js** >= 20
- **pnpm** (or npm / yarn)
- A **Supabase** project (PostgreSQL + Realtime)
- A **Clerk** application (with Billing enabled for paid plans)
- A **Google AI Studio** API key (Gemini)

### Environment Variables

Copy `.env` and fill in your own values. **Never commit real secrets.**

```bash
# Clerk -- https://dashboard.clerk.com
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/dashboard
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/dashboard

# Supabase -- Database
# Pooled connection (port 6543) for the app at runtime
DATABASE_URL="postgresql://postgres.<ref>:<password>@aws-0-<region>.pooler.supabase.com:6543/postgres?pgbouncer=true"
# Direct connection (port 5432) for Prisma migrations
DIRECT_URL="postgresql://postgres.<ref>:<password>@aws-0-<region>.pooler.supabase.com:5432/postgres"

# Supabase -- Realtime (for Yjs doc collaboration)
NEXT_PUBLIC_SUPABASE_URL=https://<ref>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...

# Google Gemini -- https://aistudio.google.com/apikey
GOOGLE_GENERATIVE_AI_API_KEY=...

# tldraw canvas sync (optional -- leave empty to use tldraw's public demo server)
NEXT_PUBLIC_TLDRAW_SYNC_URL=

# tldraw license key (optional on localhost; required in production)
NEXT_PUBLIC_TLDRAW_LICENSE_KEY=
```

> **Note on `DATABASE_URL` vs `DIRECT_URL`**: Prisma uses the pooled `DATABASE_URL` at runtime (via PgBouncer) and the direct `DIRECT_URL` for migrations. Both are required because PgBouncer does not support the extended query protocol that Prisma's migration engine needs.

### Installation

```bash
pnpm install
```

### Database Setup

Run migrations against your Supabase PostgreSQL database:

```bash
pnpm prisma migrate deploy
```

Or during development, to create a new migration from schema changes:

```bash
pnpm prisma migrate dev --name <migration-name>
```

Generate the Prisma client (auto-run on install, but run manually after schema changes):

```bash
pnpm prisma generate
```

### Running Locally

```bash
pnpm dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

> The dev server uses **Turbopack** by default (configured in `next.config.ts`).

---

## Deployment

This is a standard Next.js application and can be deployed to any platform that supports it (Vercel, Netlify, Railway, etc.).

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add all environment variables from `.env` to your Vercel project settings
3. Deploy -- Vercel will automatically detect Next.js and configure the build

### Post-Deployment Checklist

- [ ] Run `pnpm prisma migrate deploy` against your production database
- [ ] Set `NEXT_PUBLIC_TLDRAW_SYNC_URL` to your deployed Cloudflare Worker URL (see below)
- [ ] Add your production domain to the tldraw license allowlist and set `NEXT_PUBLIC_TLDRAW_LICENSE_KEY`
- [ ] Configure your Clerk application's **allowed redirect URLs** to include your production domain
- [ ] Enable Clerk **Billing** and configure your plans in the Clerk dashboard

---

## Canvas Sync Server

The real-time canvas multiplayer is powered by a **Cloudflare Worker** that implements the tldraw-sync protocol.

```bash
# Deploy the sync worker (from tldraw-sync/)
npm run deploy
```

Set the resulting Worker URL as `NEXT_PUBLIC_TLDRAW_SYNC_URL` in your environment.

**Without this**, the canvas falls back to tldraw's public demo server (`useSyncDemo`). That is fine for local development, but:

- Rooms are **publicly accessible** (anyone who knows the room ID can join)
- Rooms are **periodically wiped** by tldraw

---

## Key Workflows

### Creating a Workspace

1. Click **New Workspace** from the dashboard
2. Enter a name and optional description in the dialog
3. A workspace is created with a linked `Doc` and `Canvas` row -- both are always present

### Using the Agent

1. Open a workspace and click the **Plan** button (bottom right) or press the mic button for voice
2. Type or speak a prompt describing what you want built on the canvas or doc
3. The agent reads the current state of both surfaces and makes targeted changes via tool calls
4. Each user prompt is counted against the monthly quota; the free tier allows 20 prompts/month

### Sharing a Workspace

1. Open the workspace settings from the header
2. Click **Share** then **Generate link** (paid feature)
3. Send the link -- recipients see a read-only view without needing to sign in
4. Reset the token to invalidate existing links

### Exporting as PDF

1. Open the workspace doc
2. Click the **Export PDF** button in the header (paid feature)

---

## Contributing

1. Fork the repository and create a feature branch
2. Make your changes following the existing code conventions
3. Run `pnpm lint` to catch any lint errors
4. Open a pull request -- `.coderabbit.yaml` is configured for automated code review

```bash
pnpm lint
```
