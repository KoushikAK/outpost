"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUpgradeDialog } from "@/components/UpgradeDialog";
import { UPGRADE_REASONS } from "@/lib/plan-limits";
import { submitOnEnter } from "@/lib/utils";
import { createWorkspace } from "@/actions/workspace";
import { MicButton } from "@/components/MicButton";
import { useFetch } from "@/components/hooks/use-fetch";

const MAX_NAME_LENGTH = 48;

const EXAMPLE_PROMPTS = [
  "Design a blog database and document each table",
  "Map out a user onboarding flow",
  "Plan the architecture for a chat app",
];

// "design a blog schema: users, posts..." -> "Design a blog schema: users, posts", cut on a word.
function nameFromPrompt(prompt: string) {
  const firstLine = prompt.trim().split("\n")[0];
  const name =
    firstLine.length <= MAX_NAME_LENGTH
      ? firstLine
      : firstLine.slice(0, MAX_NAME_LENGTH).replace(/\s+\S*$/, "");
  const clean = name.replace(/[\s.,:;!?-]+$/, "");
  return clean.charAt(0).toUpperCase() + clean.slice(1);
}

// Creates a workspace from the prompt and opens it; the workspace's agent sends the prompt
// as its first message (see AgentToggleButton).
export function DashboardPrompt() {
  const [prompt, setPrompt] = useState("");
  const router = useRouter();
  const { fn: createWorkspaceFn, loading } = useFetch(createWorkspace);
  const openUpgrade = useUpgradeDialog();
  const busy = loading ?? false;
  
  const handleSubmit = async () => {
    const trimmed = prompt.trim();
    if (!trimmed || busy) return;
    const result = await createWorkspaceFn(nameFromPrompt(trimmed), trimmed);
    if (!result) return;
    if ("limit" in result) return openUpgrade(UPGRADE_REASONS[result.limit]);
    router.push(`/workspace/${result.workspace.id}?prompt=${encodeURIComponent(trimmed)}`);
  };

  return (
    <section className="topo-bg mx-auto mb-14 w-full max-w-4xl px-4 py-8 text-center sm:px-6 sm:py-12">
      <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border/80 bg-secondary/50 px-3.5 py-1 text-xs font-mono uppercase tracking-wider text-muted-foreground backdrop-blur-xs">
        <span className="text-primary text-[10px] leading-none">◆</span>
        <span>DUAL-SURFACE PLANNER // AGENT READY</span>
      </div>

      <h1 className="font-heading text-3xl font-normal tracking-tight text-foreground sm:text-5xl md:text-6xl leading-[1.08]">
        What are we planning today?
      </h1>
      <p className="mx-auto mt-3 max-w-xl text-balance text-base text-muted-foreground sm:text-lg leading-relaxed">
        Describe your system, flow, or schema — the agent charts the canvas and drafts the living doc in real time.
      </p>

      <div className="edge-light mx-auto mt-7 max-w-3xl rounded-3xl p-3.5 text-left shadow-2xl shadow-black/50 backdrop-blur-md transition-all focus-within:ring-4 focus-within:ring-primary/15">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={submitOnEnter(handleSubmit)}
          placeholder="e.g. Design the database for a food delivery app and document it"
          rows={2}
          disabled={busy}
          autoFocus
          className="field-sizing-content max-h-60 min-h-14 w-full resize-none bg-transparent px-2 pt-1 text-base leading-6 outline-none placeholder:text-muted-foreground/70"
        />
        <div className="mt-1 flex items-center justify-between gap-2 pl-2">
          <span className="text-xs text-muted-foreground/70">Shift + Enter for a new line</span>
          <div className="flex items-center gap-1.5">
            <MicButton value={prompt} onChange={setPrompt} disabled={busy} className="rounded-full" />
            <Button
              size="icon"
              onClick={handleSubmit}
              disabled={!prompt.trim() || busy}
              aria-label="Create workspace"
              className="rounded-full shadow-lg shadow-primary/25 cursor-pointer"
            >
              <ArrowUp className="size-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-4 flex max-w-3xl flex-wrap justify-center gap-2">
        {EXAMPLE_PROMPTS.map((example) => (
          <button
            key={example}
            type="button"
            onClick={() => setPrompt(example)}
            disabled={busy}
            className="cursor-pointer rounded-full border border-border/70 bg-secondary/40 px-3.5 py-1.5 font-mono text-xs text-muted-foreground transition-all hover:border-primary/50 hover:bg-secondary/70 hover:text-foreground"
          >
            {example}
          </button>
        ))}
      </div>
    </section>
  );
}