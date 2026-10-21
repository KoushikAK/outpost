import { redirect } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  Compass,
  KanbanSquare,
  Layers,
  Plus,
  Sparkles,
} from "lucide-react";
import { compareDesc } from "date-fns";
import { checkUser } from "@/actions/check-user";
import { prisma } from "@/lib/prisma";
import { getWorkspaceScope } from "@/lib/workspace-scope";
import { withLastActivity, workspaceCardSelect } from "@/lib/workspace-status";
import { Button } from "@/components/ui/button";
import { RecentWorkspaces } from "./_components/RecentWorkspaces";
import { DashboardPrompt } from "./_components/DashboardPrompt";
import { WorkspaceDialog } from "@/components/WorkspaceDialog";

const RECENT_COUNT = 4;

export const instant = false;

export default async function DashboardPage() {
  const user = await checkUser();
  if (!user) redirect("/sign-in");

  const { orgName, where } = await getWorkspaceScope(user.id);
  const workspaces = await prisma.workspace.findMany({
    where,
    select: workspaceCardSelect,
  });
  const recent = workspaces
    .map(withLastActivity)
    .sort((a, b) => compareDesc(a.lastActivity, b.lastActivity))
    .slice(0, RECENT_COUNT);

  const planningCount = workspaces.filter(
    (w) => w.status === "PLANNING",
  ).length;
  const inProgressCount = workspaces.filter(
    (w) => w.status === "IN_PROGRESS",
  ).length;
  const doneCount = workspaces.filter((w) => w.status === "DONE").length;

  return (
    <div className="relative min-h-[calc(100vh-4.5rem)] px-4 py-8 sm:px-6 lg:px-8 overflow-hidden">
      {/* Ambient Top Glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 flex justify-center overflow-hidden">
        <div className="h-96 w-3xl max-w-full rounded-full bg-[radial-gradient(ellipse_at_top,oklch(var(--l-accent)_var(--c-accent)_var(--h-accent)/0.12)_0%,transparent_70%)] blur-3xl" />
      </div>

      {/* Station Telemetry & Scope Strip */}
      <div className="mx-auto mb-10 max-w-6xl flex flex-wrap items-center justify-between gap-4 border-b border-border/50 pb-4">
        <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-muted-foreground">
          <div className="flex items-center gap-2 rounded-md border border-border/70 bg-secondary/40 px-3 py-1 backdrop-blur-xs">
            <Compass className="size-3.5 text-primary" />
            <span className="text-foreground/90 font-medium tracking-wide">
              {orgName ? orgName.toUpperCase() : "PERSONAL WORKSPACE"}
            </span>
          </div>
          <span className="hidden sm:inline text-border">•</span>
          <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <Layers className="size-3 text-primary/70" />
            <span>
              {workspaces.length}{" "}
              {workspaces.length === 1 ? "outpost" : "outposts"} active
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 font-mono text-[11px]">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-emerald-400">
            <span className="size-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>ALL SYSTEMS NOMINAL</span>
          </span>
          <span className="hidden md:inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-secondary/30 px-2.5 py-0.5 text-muted-foreground">
            <Sparkles className="size-3 text-primary" />
            <span>AGENT STANDBY</span>
          </span>
        </div>
      </div>

      {/* Hero Planner Prompt */}
      <DashboardPrompt />

      {/* Workspaces Section */}
      <section className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="mb-1.5 flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted-foreground">
              <span className="text-primary text-[10px] leading-none">◆</span>
              <span>WORKSPACE REPOSITORY</span>
            </div>
            <h2 className="font-heading text-2xl font-normal tracking-tight text-foreground sm:text-3xl">
              Recent workspaces
            </h2>
          </div>

          <div className="flex items-center gap-2.5">
            {workspaces.length > 0 && (
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="gap-2 font-mono text-xs text-muted-foreground hover:text-foreground hover:bg-secondary/60 cursor-pointer"
              >
                <Link href="/workspaces">
                  <KanbanSquare className="size-4 text-primary" />
                  <span>View board</span>
                  <span className="rounded-full bg-secondary/80 px-2 py-0.2 font-mono text-[10px] text-foreground">
                    {workspaces.length}
                  </span>
                </Link>
              </Button>
            )}
            <WorkspaceDialog
              trigger={
                <Button
                  size="sm"
                  className="glow gap-1.5 font-medium cursor-pointer shadow-md"
                >
                  <Plus className="size-4" />
                  <span>New workspace</span>
                </Button>
              }
            />
          </div>
        </div>

        {workspaces.length === 0 ? (
          <div className="survey-frame">
            <div className="edge-light relative overflow-hidden rounded-2xl bg-card/60 p-10 sm:p-14 text-center backdrop-blur-md">
              {/* Corner Crosshairs */}
              <div className="absolute top-3 left-3 font-mono text-[10px] text-primary/40 select-none">
                +
              </div>
              <div className="absolute top-3 right-3 font-mono text-[10px] text-primary/40 select-none">
                +
              </div>
              <div className="absolute bottom-3 left-3 font-mono text-[10px] text-primary/40 select-none">
                +
              </div>
              <div className="absolute bottom-3 right-3 font-mono text-[10px] text-primary/40 select-none">
                +
              </div>

              {/* Center Beacon */}
              <div className="mx-auto mb-6 flex size-14 items-center justify-center rounded-2xl border border-primary/40 bg-secondary/50 shadow-lg shadow-primary/10">
                <Compass className="size-7 text-primary animate-pulse" />
              </div>

              <h3 className="font-heading text-2xl font-normal tracking-tight text-foreground sm:text-3xl">
                No outposts staked in this sector
              </h3>
              <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground leading-relaxed">
                Describe a flow, system, or schema in the terminal above — or
                spawn an empty workspace to draft live specs and spatial
                diagrams.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <WorkspaceDialog
                  trigger={
                    <Button size="lg" className="glow gap-2 cursor-pointer">
                      <Plus className="size-4" />
                      <span>Create your first workspace</span>
                      <ArrowRight className="size-4" />
                    </Button>
                  }
                />
              </div>

              {/* Starter inspiration */}
              <div className="mt-10 border-t border-border/50 pt-6">
                <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-3">
                  Sample ideas to try in the prompt above
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  <span className="rounded-md border border-border/60 bg-secondary/30 px-3 py-1 font-mono text-[11px] text-muted-foreground">
                    Event-driven microservices architecture
                  </span>
                  <span className="rounded-md border border-border/60 bg-secondary/30 px-3 py-1 font-mono text-[11px] text-muted-foreground">
                    Multi-tenant SaaS database schema
                  </span>
                  <span className="rounded-md border border-border/60 bg-secondary/30 px-3 py-1 font-mono text-[11px] text-muted-foreground">
                    User authentication & onboarding flow
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <RecentWorkspaces workspaces={recent} />

            {/* Workspace status breakdown bar */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border/40 pt-4 text-xs font-mono text-muted-foreground">
              <div className="flex flex-wrap items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-primary/70" />
                  <span>{planningCount} Planning</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-amber-400/80" />
                  <span>{inProgressCount} In progress</span>
                </span>
                {doneCount > 0 && (
                  <span className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-emerald-400/80" />
                    <span>{doneCount} Done</span>
                  </span>
                )}
              </div>
              <span className="text-[11px] text-muted-foreground/60">
                Showing {recent.length} of {workspaces.length} total
              </span>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
