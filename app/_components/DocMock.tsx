import { Bot, Check, CornerDownLeft, FileText, Sparkles } from "lucide-react";

export function DocMock() {
  return (
    <div className="edge-light relative w-full overflow-hidden rounded-xl bg-card p-4 sm:p-6 shadow-xl">
      {/* Editor Header Bar */}
      <div className="mb-4 flex items-center justify-between border-b border-border/60 pb-3 font-mono text-[11px] text-muted-foreground">
        <div className="flex items-center gap-2">
          <FileText className="size-3.5 text-primary" />
          <span className="font-semibold text-foreground">Doc</span>
          <span className="text-border">/</span>
          <span>RFC-084-spec.md</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded bg-secondary/80 px-2 py-0.5 text-[10px]">Markdown</span>
          <span className="flex items-center gap-1 rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-400">
            <Check className="size-2.5" />
            Saved
          </span>
        </div>
      </div>

      {/* Document Paper Surface */}
      <div className="min-h-75 w-full rounded-lg border border-border/40 bg-background/80 p-4 sm:p-5 flex flex-col justify-between">
        <div className="space-y-3.5 text-left">
          {/* Doc Title & Meta */}
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base">📄</span>
              <h4 className="font-heading text-lg font-medium text-foreground tracking-tight">
                RFC-084: Realtime State Machine
              </h4>
            </div>
            <div className="mt-1 font-mono text-[10px] text-muted-foreground">
              Last updated 2m ago by <span className="text-foreground">Koushik</span> &{" "}
              <span className="text-primary font-medium">Outpost Agent</span>
            </div>
          </div>

          {/* Section Heading */}
          <div className="pt-1">
            <div className="font-mono text-xs font-semibold uppercase tracking-wider text-primary">
              1. Architecture & Protocol
            </div>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              The synchronizer maintains lockstep between the spatial canvas and the document model
              using binary Yjs CRDT payloads over persistent WebSocket connections.
            </p>
          </div>

          {/* Agent Synthesized Callout Block */}
          <div className="rounded-md border-l-2 border-primary bg-primary/10 p-3 text-left">
            <div className="flex items-center gap-1.5 font-mono text-[10px] font-semibold text-primary">
              <Sparkles className="size-3" />
              <span>Agent synthesized from Canvas flowchart:</span>
            </div>
            <p className="mt-1 text-xs text-foreground/90 font-mono leading-relaxed">
              + Generated 4 microservice endpoints & rate-limit guardrails based on Node #02.
            </p>
          </div>
        </div>

        {/* Slash Command Bar */}
        <div className="mt-4 flex items-center justify-between rounded-md border border-border/70 bg-card/90 px-3 py-2 font-mono text-xs text-muted-foreground shadow-xs">
          <div className="flex items-center gap-2">
            <Bot className="size-3.5 text-primary" />
            <span className="text-foreground/80 text-[11px]">
              /summarize canvas into technical spec
            </span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground/80">
            <kbd className="rounded border border-border/60 bg-secondary/80 px-1 py-0.5">Enter</kbd>
            <CornerDownLeft className="size-3" />
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-3 flex items-center justify-between font-mono text-[10px] text-muted-foreground/70">
        <span>EDITOR: BLOCKNOTE (YJS CRDT)</span>
        <span className="text-primary">BI-DIRECTIONAL LINKED</span>
      </div>
    </div>
  );
}
