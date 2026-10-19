import { Bot, Sparkles, Terminal } from "lucide-react";

export function FlowchartMock() {
  return (
    <div className="edge-light relative w-full overflow-hidden rounded-xl bg-card p-4 sm:p-6 shadow-xl">
      {/* Canvas Tool Header */}
      <div className="mb-4 flex items-center justify-between border-b border-border/60 pb-3 font-mono text-[11px] text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-primary" />
          <span className="font-semibold text-foreground">Canvas</span>
          <span className="text-border">/</span>
          <span>Architecture Flow</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded bg-secondary/80 px-2 py-0.5 text-[10px]">100%</span>
          <span className="rounded bg-primary/10 px-2 py-0.5 text-[10px] text-primary">
            Agent drawing
          </span>
        </div>
      </div>

      {/* Grid Canvas Area */}
      <div className="relative min-h-75 w-full rounded-lg border border-border/40 bg-[radial-gradient(oklch(0.95_0.02_85/0.08)_1px,transparent_1px)] bg-size-[16px_16px] p-4 flex flex-col justify-between">
        {/* Top Node */}
        <div className="flex justify-center">
          <div className="relative rounded-md border border-border/80 bg-background/90 px-3.5 py-2 text-xs font-mono shadow-sm">
            <span className="text-muted-foreground">event: </span>
            <span className="text-foreground font-medium">HTTP Request (Ingest)</span>
            {/* Port handle */}
            <span className="absolute -bottom-1 left-1/2 size-2 -translate-x-1/2 rounded-full border border-primary bg-background" />
          </div>
        </div>

        {/* Center Connecting SVG & Main Processing Node */}
        <div className="relative my-2 flex flex-col items-center">
          {/* Connector Line */}
          <div className="h-6 w-px bg-linear-to-b from-primary to-primary/60" />

          {/* Center Agent Node with Active Selection Box */}
          <div className="relative rounded-lg border-2 border-primary/80 bg-primary/10 px-4 py-2.5 text-center shadow-lg backdrop-blur-xs">
            {/* Selection Handles */}
            <span className="absolute -top-1 -left-1 size-2 rounded-xs bg-primary" />
            <span className="absolute -top-1 -right-1 size-2 rounded-xs bg-primary" />
            <span className="absolute -bottom-1 -left-1 size-2 rounded-xs bg-primary" />
            <span className="absolute -bottom-1 -right-1 size-2 rounded-xs bg-primary" />

            <div className="flex items-center justify-center gap-1.5 text-xs font-mono font-semibold text-primary">
              <Bot className="size-3.5" />
              <span>Outpost Agent Engine</span>
            </div>
            <div className="mt-0.5 text-[10px] font-mono text-muted-foreground">
              bi-directional synthesis
            </div>

            {/* Bottom port handles */}
            <span className="absolute -bottom-1 left-1/3 size-2 -translate-x-1/2 rounded-full border border-primary bg-background" />
            <span className="absolute -bottom-1 left-2/3 size-2 -translate-x-1/2 rounded-full border border-primary bg-background" />
          </div>

          {/* Floating Agent Cursor */}
          <div className="absolute -right-2 top-0 flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-[10px] font-mono font-medium text-primary-foreground shadow-lg animate-bounce">
            <Sparkles className="size-2.5" />
            <span>Agent inserting node</span>
          </div>

          {/* Forking connector lines */}
          <svg
            className="h-7 w-52 overflow-visible stroke-primary/70"
            fill="none"
            viewBox="0 0 208 28"
          >
            <path d="M 69 0 L 69 12 L 40 12 L 40 28" strokeWidth="1.5" />
            <path d="M 139 0 L 139 12 L 168 12 L 168 28" strokeWidth="1.5" />
          </svg>
        </div>

        {/* Bottom Branch Nodes */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-md border border-border/80 bg-background/90 p-2.5 font-mono text-xs shadow-xs">
            <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
              <span>DOC MODEL</span>
              <span className="text-emerald-400">SYNCED</span>
            </div>
            <div className="text-foreground font-medium text-[11px]">
              BlockNote Spec (RFC)
            </div>
          </div>

          <div className="rounded-md border border-border/80 bg-background/90 p-2.5 font-mono text-xs shadow-xs">
            <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
              <span>CANVAS SHAPES</span>
              <span className="text-primary">LIVE</span>
            </div>
            <div className="text-foreground font-medium text-[11px]">
              tldraw System Diagram
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-3 flex items-center justify-between font-mono text-[10px] text-muted-foreground/70">
        <span className="flex items-center gap-1">
          <Terminal className="size-3 text-primary" />
          <span>AUTONOMOUS SHAPE PLACEMENT</span>
        </span>
        <span>WORKSPACE: ACTIVE</span>
      </div>
    </div>
  );
}
