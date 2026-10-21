import { redirect } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  ChevronLeft,
  Compass,
  Layers,
  Plus,
  Sparkles,
} from "lucide-react";
import { checkUser } from "@/actions/check-user";
import { prisma } from "@/lib/prisma";
import { getWorkspaceScope } from "@/lib/workspace-scope";
import { withLastActivity, workspaceCardSelect } from "@/lib/workspace-status";
import { Button } from "@/components/ui/button";
import { WorkspaceDialog } from "@/components/WorkspaceDialog";
import { WorkspaceBoard } from "./_components/WorkspaceBoard";

export const instant = false;

export default async function WorkspacesPage() {
  const user = await checkUser();
  if (!user) redirect("/sign-in");

  const { orgName, where } = await getWorkspaceScope(user.id);
  const rawWorkspaces = await prisma.workspace.findMany({
    where,
    select: { ...workspaceCardSelect, position: true },
    orderBy: { position: "asc" },
  });

  const workspaces = rawWorkspaces.map(withLastActivity);
  const totalCount = workspaces.length;

  return (
    <div className="relative min-h-[calc(100vh-4.5rem)] px-4 py-8 sm:px-6 lg:px-8">
      {/* Ambient Top Vermilion Oxide Glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 flex justify-center overflow-hidden">
        <div className="h-96 w-4xl max-w-full rounded-full bg-[radial-gradient(ellipse_at_top,oklch(var(--l-accent)_var(--c-accent)_var(--h-accent)/0.12)_0%,transparent_70%)] blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl">
        {/* Station Telemetry & Navigation Strip */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-border/50 pb-4">
          <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-muted-foreground">
            <Link
              href="/dashboard"
              className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors cursor-pointer group"
            >
              <ChevronLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
              <span>DASHBOARD</span>
            </Link>
            <span className="text-border/70">•</span>
            <div className="flex items-center gap-2 rounded-md border border-border/70 bg-secondary/40 px-3 py-1 backdrop-blur-xs">
              <Compass className="size-3.5 text-primary" />
              <span className="text-foreground/90 font-medium tracking-wide">
                {orgName ? orgName.toUpperCase() : "PERSONAL WORKSPACE"}
              </span>
            </div>
            <span className="hidden sm:inline text-border/70">•</span>
            <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Layers className="size-3 text-primary/70" />
              <span>
                {totalCount} {totalCount === 1 ? "outpost" : "outposts"} active
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 font-mono text-[11px]">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-emerald-400">
              <span className="size-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>FLEET MATRIX NOMINAL</span>
            </span>
            <span className="hidden md:inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-secondary/30 px-2.5 py-0.5 text-muted-foreground">
              <Sparkles className="size-3 text-primary" />
              <span>KANBAN RADAR SYNCED</span>
            </span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="mb-2 flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted-foreground">
              <span className="text-primary text-[10px] leading-none">◆</span>
              <span>FLEET COMMAND // WORKSPACE OPERATIONS</span>
            </div>
            <h1 className="font-heading text-3xl font-normal tracking-tight text-foreground sm:text-4xl">
              All workspaces
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground leading-relaxed">
              Central operational deck for all architectural diagrams, real-time specifications,
              and collaborative AI canvas workspaces across your organization.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <WorkspaceDialog
              trigger={
                <Button
                  size="default"
                  className="glow gap-2 font-medium cursor-pointer shadow-md"
                >
                  <Plus className="size-4" />
                  <span>New workspace</span>
                </Button>
              }
            />
          </div>
        </div>

        {/* Main Workspaces View or Empty State */}
        {totalCount === 0 ? (
          <div className="survey-frame">
            <div className="edge-light relative overflow-hidden rounded-2xl bg-card/60 p-10 sm:p-14 text-center backdrop-blur-md">
              <div className="absolute top-3 left-3 font-mono text-[10px] text-primary/40 select-none">+</div>
              <div className="absolute top-3 right-3 font-mono text-[10px] text-primary/40 select-none">+</div>
              <div className="absolute bottom-3 left-3 font-mono text-[10px] text-primary/40 select-none">+</div>
              <div className="absolute bottom-3 right-3 font-mono text-[10px] text-primary/40 select-none">+</div>

              <div className="mx-auto mb-6 flex size-14 items-center justify-center rounded-2xl border border-primary/40 bg-secondary/50 shadow-lg shadow-primary/10">
                <Compass className="size-7 text-primary animate-pulse" />
              </div>

              <h3 className="font-heading text-2xl font-normal tracking-tight text-foreground sm:text-3xl">
                No outposts established in this sector
              </h3>
              <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground leading-relaxed">
                Launch a workspace to collaborate with the AI agent across live documentation
                and real-time spatial diagrams.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <WorkspaceDialog
                  trigger={
                    <Button size="lg" className="glow gap-2 cursor-pointer">
                      <Plus className="size-4" />
                      <span>Deploy your first workspace</span>
                      <ArrowRight className="size-4" />
                    </Button>
                  }
                />
              </div>

              <div className="mt-10 border-t border-border/50 pt-6">
                <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-3">
                  Suggested outposts to draft
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  <span className="rounded-md border border-border/60 bg-secondary/30 px-3 py-1 font-mono text-[11px] text-muted-foreground">
                    Distributed Event-Driven Architecture
                  </span>
                  <span className="rounded-md border border-border/60 bg-secondary/30 px-3 py-1 font-mono text-[11px] text-muted-foreground">
                    Multi-Tenant Database Schema & Migrations
                  </span>
                  <span className="rounded-md border border-border/60 bg-secondary/30 px-3 py-1 font-mono text-[11px] text-muted-foreground">
                    Product Roadmap & Technical Specifications
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <WorkspaceBoard workspaces={workspaces} />
        )}
      </div>
    </div>
  );
}
