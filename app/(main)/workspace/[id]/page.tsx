import {
  getEntitlements,
  workspaceOwnerId,
  workspaceOwnerSelect,
} from "@/lib/billing";
import { prisma } from "@/lib/prisma";
import { canAccessWorkspace } from "@/lib/workspace-access";
import { notFound } from "next/navigation";

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

  return <div>WorkspacePage</div>;
}
