import { Kanban, MousePointer2, Users } from "lucide-react";

export function KanbanMock() {
  return (
    <div className="edge-light relative w-full overflow-hidden rounded-xl bg-card p-4 sm:p-6 shadow-xl">
      {/* Team Board Header Bar */}
      <div className="mb-4 flex items-center justify-between border-b border-border/60 pb-3 font-mono text-[11px] text-muted-foreground">
        <div className="flex items-center gap-2">
          <Kanban className="size-3.5 text-primary" />
          <span className="font-semibold text-foreground">Team Board</span>
          <span className="text-border">/</span>
          <span>Acme Labs Org</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex -space-x-1.5 overflow-hidden">
            <span className="inline-flex size-5 items-center justify-center rounded-full bg-primary/20 text-[9px] font-medium text-primary ring-1 ring-background">
              JD
            </span>
            <span className="inline-flex size-5 items-center justify-center rounded-full bg-emerald-500/20 text-[9px] font-medium text-emerald-400 ring-1 ring-background">
              SA
            </span>
            <span className="inline-flex size-5 items-center justify-center rounded-full bg-amber-500/20 text-[9px] font-medium text-amber-400 ring-1 ring-background">
              MK
            </span>
          </div>
          <span className="rounded bg-secondary/80 px-1.5 py-0.5 text-[10px]">
            +2 online
          </span>
        </div>
      </div>

      {/* Kanban Grid Container */}
      <div className="relative min-h-75 w-full rounded-lg border border-border/40 bg-background/80 p-3 flex flex-col justify-between">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {/* Column 1: Planning */}
          <div className="rounded-md border border-border/60 bg-card/40 p-2.5">
            <div className="mb-2 flex items-center justify-between font-mono text-[10px] text-muted-foreground">
              <span className="font-semibold text-foreground/80">PLANNING</span>
              <span className="rounded bg-secondary px-1.5 py-0.2">1</span>
            </div>
            {/* Card */}
            <div className="rounded border border-border/60 bg-background/90 p-2 text-left shadow-xs">
              <div className="font-mono text-[11px] font-medium text-foreground">
                Auth & RBAC Graph
              </div>
              <div className="mt-1.5 flex items-center justify-between text-[10px] font-mono text-muted-foreground">
                <span className="rounded bg-secondary/80 px-1 py-0.2">
                  Canvas only
                </span>
                <span>2d ago</span>
              </div>
            </div>
          </div>

          {/* Column 2: In Progress (Featured with live cursors) */}
          <div className="relative rounded-md border border-primary/30 bg-primary/5 p-2.5">
            <div className="mb-2 flex items-center justify-between font-mono text-[10px]">
              <span className="font-semibold text-primary">IN PROGRESS</span>
              <span className="rounded bg-primary/20 text-primary px-1.5 py-0.2">
                2
              </span>
            </div>

            {/* Card 1 with live cursor */}
            <div className="relative mb-2 rounded border border-border/80 bg-background/95 p-2 text-left shadow-xs">
              {/* Teammate Live Cursor */}
              <div className="absolute -top-3 right-1 z-10 flex items-center gap-1 rounded-full bg-emerald-500 px-2 py-0.5 text-[9px] font-mono font-medium text-black shadow-md">
                <MousePointer2 className="size-2.5 fill-black stroke-black" />
                <span>Sarah (in doc)</span>
              </div>

              <div className="font-mono text-[11px] font-medium text-foreground">
                Realtime Ingestion
              </div>
              <div className="mt-1.5 flex items-center justify-between text-[10px] font-mono text-muted-foreground">
                <span className="rounded bg-primary/20 text-primary px-1 py-0.2">
                  Doc + Canvas
                </span>
                <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
            </div>

            {/* Card 2 with second cursor */}
            <div className="relative rounded border border-border/80 bg-background/95 p-2 text-left shadow-xs">
              {/* Second Teammate Cursor */}
              <div className="absolute -bottom-2 -left-1 z-10 flex items-center gap-1 rounded-full bg-amber-500 px-2 py-0.5 text-[9px] font-mono font-medium text-black shadow-md">
                <MousePointer2 className="size-2.5 fill-black stroke-black" />
                <span>Alex (drawing)</span>
              </div>

              <div className="font-mono text-[11px] font-medium text-foreground">
                API Topology v2
              </div>
              <div className="mt-1.5 flex items-center justify-between text-[10px] font-mono text-muted-foreground">
                <span className="rounded bg-secondary/80 px-1 py-0.2">
                  PRD Draft
                </span>
                <span>Active</span>
              </div>
            </div>
          </div>

          {/* Column 3: Done */}
          <div className="rounded-md border border-border/60 bg-card/40 p-2.5">
            <div className="mb-2 flex items-center justify-between font-mono text-[10px] text-muted-foreground">
              <span className="font-semibold text-foreground/80">DONE</span>
              <span className="rounded bg-secondary px-1.5 py-0.2">1</span>
            </div>
            {/* Card */}
            <div className="rounded border border-border/60 bg-background/90 p-2 text-left shadow-xs opacity-80">
              <div className="font-mono text-[11px] font-medium text-foreground">
                Prisma 7 Schema
              </div>
              <div className="mt-1.5 flex items-center justify-between text-[10px] font-mono text-muted-foreground">
                <span className="rounded bg-secondary/80 px-1 py-0.2 text-emerald-400">
                  Shipped
                </span>
                <span>Merged</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Presence Notice */}
        <div className="mt-3 rounded border border-border/60 bg-secondary/30 px-3 py-1.5 flex items-center justify-between font-mono text-[10px] text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-primary animate-ping" />
            <span>3 teammates active in Acme Labs</span>
          </div>
          <span className="text-primary font-medium">JUMP IN →</span>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-3 flex items-center justify-between font-mono text-[10px] text-muted-foreground/70">
        <span className="flex items-center gap-1">
          <Users className="size-3 text-primary" />
          <span>CLERK ORG MULTI-TENANCY</span>
        </span>
        <span>LIVE MULTIPLAYER CURSORS</span>
      </div>
    </div>
  );
}
