import { EditableWorkspaceName } from "@/components/EditableWorkspaceName";
import { Button } from "@/components/ui/button";
import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { WorkspaceEditorsProvider } from "@/components/WorkspaceEditorsContext";
import {
  getEntitlements,
  workspaceOwnerId,
  workspaceOwnerSelect,
} from "@/lib/billing";
import { prisma } from "@/lib/prisma";
import { canAccessWorkspace } from "@/lib/workspace-access";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import type { Block } from "@blocknote/core";
import { DocEditor } from "./_components/DocEditor";
import { CanvasEditor } from "./_components/CanvasEditor";
import { PlanButton } from "@/components/PlanButton";
import { TLEditorSnapshot } from "tldraw";
import { ShareDialog } from "./_components/ShareDialog";
import { AgentToggleButton } from "./_components/AgentToggleButton";

// This line is needed to block prerendering and avoid server-side rendering errors
export const instant = false;

type ViewMode = "doc" | "canvas" | "both";

function parseViewMode(value: string | string[] | undefined): ViewMode {
  return value === "doc" || value === "canvas" ? value : "both";
}

export default async function WorkspacePage({
  params,
  searchParams,
}: PageProps<"/workspace/[id]">) {
  const { id } = await params;
  const { view: viewParam, prompt } = await searchParams;
  const view = parseViewMode(viewParam);

  // 404 rather than 403 so outsiders can't tell whether a workspace id exists.
  if (!(await canAccessWorkspace(id))) notFound();

  const workspace = await prisma.workspace.findUnique({
    where: { id },
    select: {
      name: true,
      shareToken: true,
      ...workspaceOwnerSelect,
      doc: { select: { content: true, yjsState: true } },
      canvas: { select: { content: true } },
    },
  });
  if (!workspace) notFound();
  const entitlements = await getEntitlements(workspaceOwnerId(workspace));

  const showDoc = view === "doc" || view === "both";
  const showCanvas = view === "canvas" || view === "both";

  return (
    <WorkspaceEditorsProvider>
      <div className="flex h-dvh flex-col overflow-hidden">
        <header className="flex h-14 shrink-0 items-center border-b border-white/6 bg-background px-4">
          <div className="flex flex-1 items-center gap-3">
            <Link
              href={"/dashboard"}
              className="flex size-8 items-center justify-center rounded-md transition-opacity hover:opacity-80"
            >
              <Image
                src={"/brand/mascot-dark.png"}
                alt="Back to dashboard"
                width={24}
                height={24}
                className="size-6"
              />
            </Link>
            <EditableWorkspaceName
              workspaceId={id}
              initialName={workspace.name}
            />
          </div>

          <div className="inline-flex items-center gap-1 rounded-xl border border-white/8 bg-zinc-950/70 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_8px_24px_rgba(0,0,0,0.18)] backdrop-blur-xl">
            {(["doc", "both", "canvas"] as const).map((mode) => {
              const isActive = view === mode;

              return (
                <Button
                  key={mode}
                  asChild
                  variant="ghost"
                  size="sm"
                  className={[
                    "relative h-8 rounded-lg px-3.5 text-[12px] font-medium tracking-wide",
                    "capitalize transition-all duration-200 ease-out",
                    "focus-visible:ring-2 focus-visible:ring-white/30",
                    isActive
                      ? "border border-white/12 bg-linear-to-b from-white/12 to-white/6 text-white shadow-[0_1px_3px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.06)]"
                      : "border border-transparent text-zinc-500 hover:bg-white/5 hover:text-zinc-200",
                  ].join(" ")}
                >
                  <Link
                    href={
                      mode === "both"
                        ? `/workspace/${id}`
                        : `/workspace/${id}?view=${mode}`
                    }
                    aria-current={isActive ? "page" : undefined}
                    className="flex items-center gap-2"
                  >
                    {mode === "doc"
                      ? "Document"
                      : mode === "both"
                        ? "Split view"
                        : "Canvas"}
                    {isActive && (
                      <span className="h-1 w-1 rounded-full bg-white/80 shadow-[0_0_6px_rgba(255,255,255,0.35)]" />
                    )}
                  </Link>
                </Button>
              );
            })}
          </div>

          <div className="flex flex-1 items-center justify-end gap-2">
            <PlanButton upgradeOnlyWhenOut />
            <ShareDialog
              workspaceId={id}
              workspaceName={workspace.name}
              initialShareToken={workspace.shareToken}
              canShare={entitlements.publicSharing}
              canExportPdf={entitlements.pdfExport}
            />
            <AgentToggleButton
              workspaceId={id}
              initialPrompt={typeof prompt === "string" ? prompt : undefined}
            />
          </div>
        </header>

        {/* key gives each view a fresh panel group, so an old layout isn't applied to new panels */}

        <ResizablePanelGroup
          key={view}
          orientation="horizontal"
          className="flex-1"
        >
          {showDoc && (
            <ResizablePanel defaultSize={35} minSize={20}>
              <DocEditor
                key={id}
                workspaceId={id}
                initialContent={workspace.doc?.content as Block[] | null}
                initialState={
                  workspace.doc?.yjsState
                    ? Buffer.from(workspace.doc.yjsState).toString("base64")
                    : null
                }
              />
            </ResizablePanel>
          )}

          {/* {showDoc && showCanvas && <ResizableHandle withHandle />} */}
          {showCanvas && (
            <ResizablePanel defaultSize={75} minSize={20}>
              <CanvasEditor
                workspaceId={id}
                initialSnapshot={
                  workspace.canvas?.content as TLEditorSnapshot | null
                }
              />
            </ResizablePanel>
          )}
        </ResizablePanelGroup>
      </div>
    </WorkspaceEditorsProvider>
  );
}
