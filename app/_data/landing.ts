export interface CtaLink {
  label: string;
  href: string;
}

export interface AudienceItem {
  id: string;
  label: string;
  tagline: string;
  badge: string;
}

export interface SurfaceBullet {
  text: string;
}

export interface SurfaceItem {
  id: "canvas" | "docs" | "team-board";
  eyebrow: string;
  title: string;
  description: string;
  bullets: string[];
  mockType: "flowchart" | "doc" | "kanban";
}

export interface WaypointStep {
  number: string;
  waypoint: string;
  title: string;
  description: string;
  tag: string;
  mockLabel: string;
  mockContent: string;
}

export interface PricingTier {
  id: string;
  name: string;
  badge?: string;
  featured?: boolean;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: {
    label: string;
    href: string;
    variant: "default" | "outline";
  };
}

export interface FooterNavGroup {
  title: string;
  links: {
    label: string;
    href: string;
    isStatus?: boolean;
    disabled?: boolean;
  }[];
}

export const landingData = {
  hero: {
    eyebrow: "Early access",
    headlinePrefix: "An",
    highlightedWord: "outpost",
    headlineSuffix: "for whatever you're building",
    subtitle:
      "An AI agent that draws and writes alongside you and your team, live. Pair an expressive document with an infinite canvas, synchronized in real time.",
    primaryCta: {
      label: "Start building free",
      href: "/sign-up",
    },
    secondaryCta: {
      label: "See how it works",
      href: "#how-it-works",
    },
    video: {
      mp4: "/videos/hero.mp4",
      webm: "/videos/hero.webm",
      poster: "/videos/hero-poster.jpg",
      windowUrl: "outpost://workspace/architecture",
      statusLabel: "Agent connected",
    },
  },

  // "Who's it for" short strip
  audiences: {
    label: "Drafted for",
    items: [
      {
        id: "product-teams",
        label: "Product teams",
        tagline: "Connecting PRDs and system architecture",
        badge: "SYNC",
      },
      {
        id: "founders",
        label: "Founders",
        tagline: "From napkin sketch to technical spec in minutes",
        badge: "VELOCITY",
      },
      {
        id: "solo-builders",
        label: "Solo builders",
        tagline: "An autonomous partner that diagrams with you",
        badge: "AUTONOMOUS",
      },
      {
        id: "agencies",
        label: "Agencies",
        tagline: "Client-ready proposals and interactive handoffs",
        badge: "CLIENTS",
      },
      {
        id: "consultants",
        label: "Consultants",
        tagline: "Deconstruct complex legacy stacks interactively",
        badge: "SYSTEMS",
      },
    ],
  },

  // Features: One agent, one workspace, your whole team
  features: {
    id: "product",
    eyebrow: "THE PLATFORM",
    heading: "One agent, one workspace, your whole team",
    subtitle:
      "Every project in Outpost couples structured prose with an unbounded canvas, unified under an AI agent that reasons across both.",
    surfaces: [
      {
        id: "canvas",
        eyebrow: "Surface 01",
        title: "Canvas",
        description:
          "An infinite whiteboard where the agent draws flowcharts, ERDs, architecture diagrams, and org charts shape by shape, and edits them in place when you ask.",
        bullets: [
          "Shape-by-shape generation of flowcharts, ERDs, and system topologies",
          "In-place AI editing: adjust connections or add microservices without redrawing",
          "Infinite spatial canvas powered by tldraw with high-resolution vector export",
        ],
        mockType: "flowchart",
      },
      {
        id: "docs",
        eyebrow: "Surface 02",
        title: "Docs",
        description:
          "A block editor where the agent turns a diagram into a written spec, and rewrites or summarizes sections on command.",
        bullets: [
          "Bi-directional synthesis: transforms canvas flows into detailed RFCs and PRDs",
          "Block-level AI commands to rewrite, summarize, or audit security parameters",
          "Rich text editor with slash commands, markdown shortcuts, and live Yjs cursors",
        ],
        mockType: "doc",
      },
      {
        id: "team-board",
        eyebrow: "Surface 03",
        title: "Team board",
        description:
          "A kanban board of every workspace in your org, with live cursors, so teammates can jump in together.",
        bullets: [
          "Organization-wide kanban tracking every active outpost from planning to done",
          "Real-time multiplayer presence showing who is editing doc or canvas",
          "Instant one-click jump-in to pair, review, or direct the agent collaboratively",
        ],
        mockType: "kanban",
      },
    ] as SurfaceItem[],
  },

  // Workflow / How it works: Waypoints on a route
  howItWorks: {
    id: "how-it-works",
    eyebrow: "THE ROUTE",
    heading: "How it works",
    subtitle:
      "A fluid, waypoint-driven loop between natural thought, autonomous drawing, and continuous refinement.",
    steps: [
      {
        number: "01",
        waypoint: "WAYPOINT 01 // INTAKE",
        title: "Describe it",
        description:
          "Start with raw thoughts, paste user stories, or jot down bullet points in the doc. Speak to the agent in plain language.",
        tag: "PROMPT & SPEC",
        mockLabel: "INPUT BRIEF",
        mockContent:
          "“Design an event-driven payment processor with idempotency keys, Redis sessions, and webhook retries.”",
      },
      {
        number: "02",
        waypoint: "WAYPOINT 02 // SYNTHESIS",
        title: "Watch the agent draw",
        description:
          "The agent takes your brief and charts microservices, databases, and message queues on the canvas, placing shapes and connectors in real time.",
        tag: "AUTONOMOUS DRAFTING",
        mockLabel: "CANVAS SYNTHESIS",
        mockContent:
          "Generating 5 nodes: Client App ──► API Gateway ──► Redis Store ──► Worker Pool ──► Postgres DB",
      },
      {
        number: "03",
        waypoint: "WAYPOINT 03 // ITERATION",
        title: "Keep iterating together",
        description:
          "Move nodes, tweak the spec, or ask for alternatives. The agent stays in sync across both surfaces as your whole team reviews.",
        tag: "LOCKSTEP CO-PILOT",
        mockLabel: "TEAM REFINEMENT",
        mockContent:
          "Teammate adjusted Worker Pool node • Agent generated OpenAPI schema & updated PRD section 3.2",
      },
    ] as WaypointStep[],
  },

  // Pricing
  pricing: {
    id: "pricing",
    eyebrow: "PRICING",
    heading: "Survey-grade tools, straightforward plans",
    subtitle:
      "Start free during early access. Upgrade when you need team collaboration and advanced agent capacity.",
    tiers: [
      {
        id: "solo",
        name: "Solo Builder",
        price: "$0",
        period: "/ month",
        description:
          "Perfect for individual hackers and builders exploring ideas.",
        features: [
          "Unlimited personal workspaces",
          "Full Doc & Canvas twin surfaces",
          "50 agent prompts / month",
          "Public share tokens",
        ],
        cta: {
          label: "Start free",
          href: "/sign-up",
          variant: "outline",
        },
      },
      {
        id: "pro",
        name: "Pro Outpost",
        badge: "RECOMMENDED",
        featured: true,
        price: "$19",
        period: "/ month",
        description: "For creators and founders building production systems.",
        features: [
          "Everything in Solo",
          "500 agent prompts / month",
          "Priority agent inference speed",
          "Unlimited public sharing links",
          "Export canvas to vector SVG & PNG",
        ],
        cta: {
          label: "Get started with Pro",
          href: "/sign-up",
          variant: "default",
        },
      },
      {
        id: "team",
        name: "Team / Studio",
        price: "$49",
        period: "/ month",
        description:
          "For engineering and design teams who build in public.",
        features: [
          "Everything in Pro",
          "Clerk Organization multi-tenancy",
          "Shared team prompt pool",
          "Role permissions: Admin, Member, Viewer",
          "Custom workspace templates",
        ],
        cta: {
          label: "Create team outpost",
          href: "/sign-up",
          variant: "outline",
        },
      },
    ] as PricingTier[],
  },

  // Final CTA
  ctaBanner: {
    eyebrow: "NO CREDIT CARD REQUIRED",
    heading: "Stake your outpost today",
    subtitle:
      "Experience the agentic workspace that adapts to how you naturally think, write, and sketch.",
    primaryCta: {
      label: "Start building free",
      href: "/sign-up",
    },
    secondaryCta: {
      label: "Sign in to workspace",
      href: "/sign-in",
    },
  },

  // Footer
  footer: {
    tagline:
      "An AI agent that draws and writes alongside you and your team, live.",
    navGroups: [
      {
        title: "PRODUCT",
        links: [
          { label: "Canvas & Docs", href: "#product" },
          { label: "How it works", href: "#how-it-works" },
          { label: "Pricing", href: "#pricing" },
        ],
      },
      {
        title: "RESOURCES",
        links: [
          { label: "Early Access", href: "/sign-up" },
          { label: "Sign in", href: "/sign-in" },
          { label: "Changelog", href: "#", disabled: true },
        ],
      },
      {
        title: "STATUS",
        links: [
          { label: "Operational", href: "#", isStatus: true },
          { label: "v0.1.0 (Oxide)", href: "#" },
        ],
      },
    ] as FooterNavGroup[],
    telemetry: {
      lat: "37.7749° N",
      lon: "122.4194° W",
      surveyId: "OP-01",
      year: 2026,
    },
  },
};
