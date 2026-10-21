import { WorkspaceCard, WorkspaceCardData } from "@/components/WorkspaceCard";
import { WorkspaceDialog } from "@/components/WorkspaceDialog";
import { Plus } from "lucide-react";

export function RecentWorkspaces({
  workspaces,
}: {
  workspaces: WorkspaceCardData[];
}) {
  const showAddCard = workspaces.length < 4;

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {workspaces.map((workspace) => (
        <WorkspaceCard key={workspace.id} workspace={workspace} showStatus />
      ))}

      {showAddCard && (
        <WorkspaceDialog
          trigger={
            <button
              type="button"
              className="group flex h-36 flex-col items-center justify-center gap-2.5 rounded-md border border-dashed border-border/80 bg-secondary/15 p-4 text-center transition-all hover:border-primary/50 hover:bg-secondary/35 cursor-pointer"
            >
              <div className="flex size-9 items-center justify-center rounded-full border border-border/80 bg-secondary/60 group-hover:border-primary/60 group-hover:scale-105 group-hover:bg-primary/10 transition-all">
                <Plus className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <div>
                <span className="block font-mono text-xs font-medium text-foreground/90 group-hover:text-primary transition-colors">
                  New workspace
                </span>
                <span className="mt-0.5 block text-[11px] text-muted-foreground/70">
                  Spawn doc + canvas
                </span>
              </div>
            </button>
          }
        />
      )}
    </div>
  );
}
