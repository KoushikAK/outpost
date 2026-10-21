"use client";

import { useId, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import {
  ArrowRight,
  ArrowUpDown,
  Clock,
  Filter,
  KanbanSquare,
  Layers,
  LayoutGrid,
  List,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import {
  DragDropContext,
  Draggable,
  Droppable,
  type DropResult,
} from "@hello-pangea/dnd";
import { deleteWorkspace, moveWorkspace } from "@/actions/workspace";

import type { WorkspaceStatus } from "@/lib/generated/prisma/enums";
import { WORKSPACE_STATUSES, statusTitle } from "@/lib/workspace-status";
import { WorkspaceDialog } from "@/components/WorkspaceDialog";
import {
  WorkspaceCard,
  type WorkspaceCardData,
} from "@/components/WorkspaceCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useFetch } from "@/components/hooks/use-fetch";

export type BoardWorkspace = WorkspaceCardData & { position: number };

type ViewMode = "board" | "grid" | "table";
type SortOption = "position" | "recent" | "alpha";

function columnItems(workspaces: BoardWorkspace[], status: WorkspaceStatus) {
  return workspaces
    .filter((w) => w.status === status)
    .sort((a, b) => a.position - b.position);
}

// Midpoint between the new neighbors, so only the dropped card needs saving.
function positionBetween(before?: BoardWorkspace, after?: BoardWorkspace) {
  if (before && after) return (before.position + after.position) / 2;
  if (before) return before.position + 1;
  if (after) return after.position - 1;
  return 0;
}

export function getStatusTheme(status: WorkspaceStatus) {
  switch (status) {
    case "PLANNING":
      return {
        dot: "bg-primary",
        border: "border-primary/30",
        badge: "bg-primary/10 text-primary border-primary/20",
        glow: "shadow-primary/10",
      };
    case "IN_PROGRESS":
      return {
        dot: "bg-amber-400",
        border: "border-amber-500/30",
        badge: "bg-amber-500/10 text-amber-400 border-amber-500/20",
        glow: "shadow-amber-500/10",
      };
    case "IN_REVIEW":
      return {
        dot: "bg-sky-400",
        border: "border-sky-500/30",
        badge: "bg-sky-500/10 text-sky-400 border-sky-500/20",
        glow: "shadow-sky-500/10",
      };
    case "DONE":
      return {
        dot: "bg-emerald-400",
        border: "border-emerald-500/30",
        badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        glow: "shadow-emerald-500/10",
      };
    default:
      return {
        dot: "bg-muted-foreground",
        border: "border-border",
        badge: "bg-secondary text-muted-foreground border-border",
        glow: "",
      };
  }
}

export function WorkspaceBoard({
  workspaces,
}: {
  workspaces: BoardWorkspace[];
}) {
  const [items, setItems] = useState(workspaces);
  const searchInputId = useId();
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Re-sync when the server sends a fresh list (e.g. after creating a workspace).
  const [prevWorkspaces, setPrevWorkspaces] = useState(workspaces);
  if (workspaces !== prevWorkspaces) {
    setPrevWorkspaces(workspaces);
    setItems(workspaces);
  }

  // Interactive UI toolbar state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | WorkspaceStatus>(
    "ALL",
  );
  const [viewMode, setViewMode] = useState<ViewMode>("board");
  const [sortBy, setSortBy] = useState<SortOption>("position");

  // `selected` outlives the open flag, so dialog text doesn't blank out during the close animation.
  const [selected, setSelected] = useState<BoardWorkspace | null>(null);
  const [openDialog, setOpenDialog] = useState<"edit" | "delete" | null>(null);
  const { fn: deleteWorkspaceFn, loading: isDeleting } =
    useFetch(deleteWorkspace);

  const openFor = (workspace: BoardWorkspace, dialog: "edit" | "delete") => {
    setSelected(workspace);
    setOpenDialog(dialog);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!selected) return;
    await deleteWorkspaceFn(selected.id);
    setOpenDialog(null);
  };

  // Drag and drop handler
  const handleDragEnd = async ({
    draggableId,
    source,
    destination,
  }: DropResult) => {
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const status = destination.droppableId as WorkspaceStatus;
    const target = columnItems(items, status).filter(
      (w) => w.id !== draggableId,
    );
    const position = positionBetween(
      target[destination.index - 1],
      target[destination.index],
    );

    const movedWorkspace = items.find((w) => w.id === draggableId);

    // If status filter was hiding the target stage, reset status filter so the moved card is always displayed
    if (statusFilter !== "ALL" && statusFilter !== status) {
      setStatusFilter("ALL");
    }

    const previous = items;
    setItems(
      items.map((w) => (w.id === draggableId ? { ...w, status, position } : w)),
    );

    try {
      await moveWorkspace(draggableId, status, position);
      if (movedWorkspace) {
        toast.success(
          `Moved "${movedWorkspace.name}" to ${statusTitle(status)}`,
        );
      }
    } catch {
      setItems(previous);
      toast.error("Couldn't move workspace");
    }
  };

  // Compute live stage telemetry from current items
  const totalCount = items.length;
  const planningCount = items.filter((w) => w.status === "PLANNING").length;
  const inProgressCount = items.filter(
    (w) => w.status === "IN_PROGRESS",
  ).length;
  const inReviewCount = items.filter((w) => w.status === "IN_REVIEW").length;
  const doneCount = items.filter((w) => w.status === "DONE").length;

  const planningPct = totalCount
    ? Math.round((planningCount / totalCount) * 100)
    : 0;
  const inProgressPct = totalCount
    ? Math.round((inProgressCount / totalCount) * 100)
    : 0;
  const inReviewPct = totalCount
    ? Math.round((inReviewCount / totalCount) * 100)
    : 0;
  const donePct = totalCount ? Math.round((doneCount / totalCount) * 100) : 0;

  // Filter items for Grid/Table view (Board view shows all columns, matching search query)
  const filteredItems = items.filter((w) => {
    const matchesSearch =
      searchQuery.trim() === "" ||
      w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (w.description &&
        w.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      viewMode === "board" ||
      statusFilter === "ALL" ||
      w.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Sort items according to active sort option
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === "recent") {
      return (
        new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime()
      );
    }
    if (sortBy === "alpha") {
      return a.name.localeCompare(b.name);
    }
    return a.position - b.position;
  });

  const isFiltered = searchQuery.trim() !== "" || statusFilter !== "ALL";

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("ALL");
  };

  return (
    <div className="space-y-6">
      {/* ── Live Stage Telemetry & Pipeline Distribution ────────── */}
      {totalCount > 0 && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {/* Planning */}
            <button
              type="button"
              onClick={() =>
                setStatusFilter(
                  statusFilter === "PLANNING" ? "ALL" : "PLANNING",
                )
              }
              className={`flex flex-col justify-between rounded-xl border p-3.5 backdrop-blur-xs text-left transition-all cursor-pointer ${
                statusFilter === "PLANNING"
                  ? "border-primary bg-primary/15 shadow-md shadow-primary/10 ring-1 ring-primary"
                  : "border-primary/20 bg-primary/5 hover:border-primary/40"
              }`}
            >
              <div className="flex items-center justify-between text-xs font-mono text-muted-foreground w-full">
                <span className="uppercase tracking-wider">Planning</span>
                <span className="size-2 rounded-full bg-primary" />
              </div>
              <div className="mt-3 flex items-baseline justify-between w-full">
                <span className="font-heading text-2xl text-foreground font-medium">
                  {planningCount}
                </span>
                <span className="font-mono text-xs text-primary/80">
                  {planningPct}%
                </span>
              </div>
            </button>

            {/* In Progress */}
            <button
              type="button"
              onClick={() =>
                setStatusFilter(
                  statusFilter === "IN_PROGRESS" ? "ALL" : "IN_PROGRESS",
                )
              }
              className={`flex flex-col justify-between rounded-xl border p-3.5 backdrop-blur-xs text-left transition-all cursor-pointer ${
                statusFilter === "IN_PROGRESS"
                  ? "border-amber-400 bg-amber-500/15 shadow-md shadow-amber-500/10 ring-1 ring-amber-400"
                  : "border-amber-500/20 bg-amber-500/5 hover:border-amber-500/40"
              }`}
            >
              <div className="flex items-center justify-between text-xs font-mono text-muted-foreground w-full">
                <span className="uppercase tracking-wider">In Progress</span>
                <span className="size-2 rounded-full bg-amber-400" />
              </div>
              <div className="mt-3 flex items-baseline justify-between w-full">
                <span className="font-heading text-2xl text-foreground font-medium">
                  {inProgressCount}
                </span>
                <span className="font-mono text-xs text-amber-400/80">
                  {inProgressPct}%
                </span>
              </div>
            </button>

            {/* In Review */}
            <button
              type="button"
              onClick={() =>
                setStatusFilter(
                  statusFilter === "IN_REVIEW" ? "ALL" : "IN_REVIEW",
                )
              }
              className={`flex flex-col justify-between rounded-xl border p-3.5 backdrop-blur-xs text-left transition-all cursor-pointer ${
                statusFilter === "IN_REVIEW"
                  ? "border-sky-400 bg-sky-500/15 shadow-md shadow-sky-500/10 ring-1 ring-sky-400"
                  : "border-sky-500/20 bg-sky-500/5 hover:border-sky-500/40"
              }`}
            >
              <div className="flex items-center justify-between text-xs font-mono text-muted-foreground w-full">
                <span className="uppercase tracking-wider">In Review</span>
                <span className="size-2 rounded-full bg-sky-400" />
              </div>
              <div className="mt-3 flex items-baseline justify-between w-full">
                <span className="font-heading text-2xl text-foreground font-medium">
                  {inReviewCount}
                </span>
                <span className="font-mono text-xs text-sky-400/80">
                  {inReviewPct}%
                </span>
              </div>
            </button>

            {/* Done */}
            <button
              type="button"
              onClick={() =>
                setStatusFilter(statusFilter === "DONE" ? "ALL" : "DONE")
              }
              className={`flex flex-col justify-between rounded-xl border p-3.5 backdrop-blur-xs text-left transition-all cursor-pointer ${
                statusFilter === "DONE"
                  ? "border-emerald-400 bg-emerald-500/15 shadow-md shadow-emerald-500/10 ring-1 ring-emerald-400"
                  : "border-emerald-500/20 bg-emerald-500/5 hover:border-emerald-500/40"
              }`}
            >
              <div className="flex items-center justify-between text-xs font-mono text-muted-foreground w-full">
                <span className="uppercase tracking-wider">Completed</span>
                <span className="size-2 rounded-full bg-emerald-400" />
              </div>
              <div className="mt-3 flex items-baseline justify-between w-full">
                <span className="font-heading text-2xl text-foreground font-medium">
                  {doneCount}
                </span>
                <span className="font-mono text-xs text-emerald-400/80">
                  {donePct}%
                </span>
              </div>
            </button>
          </div>

          {/* Segmented Pipeline Progress Bar (Live) */}
          <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-secondary/60">
            {planningCount > 0 && (
              <div
                style={{ width: `${(planningCount / totalCount) * 100}%` }}
                className="bg-primary transition-all duration-300"
                title={`Planning: ${planningCount}`}
              />
            )}
            {inProgressCount > 0 && (
              <div
                style={{ width: `${(inProgressCount / totalCount) * 100}%` }}
                className="bg-amber-400 transition-all duration-300"
                title={`In Progress: ${inProgressCount}`}
              />
            )}
            {inReviewCount > 0 && (
              <div
                style={{ width: `${(inReviewCount / totalCount) * 100}%` }}
                className="bg-sky-400 transition-all duration-300"
                title={`In Review: ${inReviewCount}`}
              />
            )}
            {doneCount > 0 && (
              <div
                style={{ width: `${(doneCount / totalCount) * 100}%` }}
                className="bg-emerald-400 transition-all duration-300"
                title={`Done: ${doneCount}`}
              />
            )}
          </div>
        </div>
      )}

      {/* ── Control Console / Toolbar ────────────────────────────── */}
      <div className="flex flex-col gap-3 rounded-xl border border-border/70 bg-card/40 p-3 sm:p-4 backdrop-blur-md shadow-xs">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
            <Input
              id={searchInputId}
              ref={searchInputRef}
              type="text"
              placeholder="Filter by name or description... (/)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-9 h-9.5 text-xs font-sans bg-secondary/30 border-border/80 focus-visible:bg-secondary/60 placeholder:text-muted-foreground/60 transition-colors"
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setSearchQuery("");
                }
              }}
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 size-5 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors cursor-pointer"
                title="Clear search"
              >
                <X className="size-3.5" />
              </button>
            ) : (
              <span className="hidden sm:inline-flex absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                <kbd className="rounded border border-border/70 bg-secondary/60 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground/80">
                  /
                </kbd>
              </span>
            )}
          </div>

          {/* Right Controls: Sort & View Mode Switcher */}
          <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2.5">
            {/* Sort Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 gap-1.5 font-mono text-xs text-muted-foreground border-border/80 bg-secondary/30 hover:bg-secondary/60 cursor-pointer"
                >
                  <ArrowUpDown className="size-3.5 text-primary" />
                  <span className="hidden sm:inline">Sort:</span>
                  <span className="font-sans text-foreground">
                    {sortBy === "position"
                      ? "Custom Order"
                      : sortBy === "recent"
                        ? "Recently Active"
                        : "Alphabetical"}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-44 font-mono text-xs"
              >
                <DropdownMenuItem
                  onClick={() => setSortBy("position")}
                  className={
                    sortBy === "position"
                      ? "text-primary font-medium cursor-pointer"
                      : "cursor-pointer"
                  }
                >
                  Custom Board Order
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setSortBy("recent")}
                  className={
                    sortBy === "recent"
                      ? "text-primary font-medium cursor-pointer"
                      : "cursor-pointer"
                  }
                >
                  Recently Active
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setSortBy("alpha")}
                  className={
                    sortBy === "alpha"
                      ? "text-primary font-medium cursor-pointer"
                      : "cursor-pointer"
                  }
                >
                  Alphabetical (A-Z)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* View Mode Toggle */}
            <div className="flex items-center rounded-lg border border-border/80 bg-secondary/40 p-0.5">
              <button
                type="button"
                onClick={() => setViewMode("board")}
                title="Kanban Board view"
                className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all cursor-pointer ${
                  viewMode === "board"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <KanbanSquare className="size-3.5" />
                <span className="hidden sm:inline">Board</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                title="Grid Cards view"
                className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <LayoutGrid className="size-3.5" />
                <span className="hidden sm:inline">Grid</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("table")}
                title="List / Table view"
                className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all cursor-pointer ${
                  viewMode === "table"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <List className="size-3.5" />
                <span className="hidden sm:inline">Table</span>
              </button>
            </div>
          </div>
        </div>

        {/* Status Filter Pills Row */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border/50 pt-2.5">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="mr-1 hidden sm:inline-flex items-center gap-1 font-mono text-[11px] text-muted-foreground/70 uppercase">
              <Filter className="size-3 text-primary/70" />
              <span>Filter:</span>
            </span>

            <button
              type="button"
              onClick={() => setStatusFilter("ALL")}
              className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-xs transition-colors cursor-pointer ${
                statusFilter === "ALL"
                  ? "bg-foreground/15 text-foreground font-semibold border border-foreground/20"
                  : "bg-secondary/40 text-muted-foreground hover:text-foreground hover:bg-secondary/70 border border-transparent"
              }`}
            >
              <span>All Stages</span>
              <span className="rounded-full bg-background/50 px-1.5 py-0.2 text-[10px]">
                {items.length}
              </span>
            </button>

            {WORKSPACE_STATUSES.map((col) => {
              const count = items.filter((w) => w.status === col.status).length;
              const theme = getStatusTheme(col.status);
              const isActive = statusFilter === col.status;
              return (
                <button
                  key={col.status}
                  type="button"
                  onClick={() => setStatusFilter(isActive ? "ALL" : col.status)}
                  className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-xs transition-colors cursor-pointer ${
                    isActive
                      ? `${theme.badge} border font-semibold`
                      : "bg-secondary/40 text-muted-foreground hover:text-foreground hover:bg-secondary/70 border border-transparent"
                  }`}
                >
                  <span className={`size-1.5 rounded-full ${theme.dot}`} />
                  <span>{col.title}</span>
                  <span className="rounded-full bg-background/50 px-1.5 py-0.2 text-[10px]">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Filter status telemetry */}
          {isFiltered && (
            <div className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
              <span>
                Matching {sortedItems.length} of {items.length}
              </span>
              <button
                type="button"
                onClick={clearFilters}
                className="text-primary hover:underline cursor-pointer font-medium"
              >
                Reset filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Zero-State when Filter produces no matches ───────────── */}
      {sortedItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-card/30 p-12 text-center backdrop-blur-xs">
          <div className="mb-4 flex size-12 items-center justify-center rounded-full border border-border/80 bg-secondary/50">
            <Filter className="size-5 text-muted-foreground" />
          </div>
          <h3 className="font-heading text-xl font-normal text-foreground">
            No workspaces match your criteria
          </h3>
          <p className="mt-1.5 max-w-sm text-xs text-muted-foreground leading-relaxed">
            {searchQuery
              ? `No outposts found containing "${searchQuery}". Try a different keyword or reset filters.`
              : "No outposts found in this status. Adjust your filter to view other sectors."}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
            className="mt-5 gap-1.5 font-mono text-xs cursor-pointer"
          >
            <X className="size-3.5" />
            Clear search & filters
          </Button>
        </div>
      ) : viewMode === "board" ? (
        /* ── View 1: Drag & Drop Kanban Board ──────────────────── */
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 items-start">
            {WORKSPACE_STATUSES.map((column) => {
              const theme = getStatusTheme(column.status);
              // In board mode, all columns show their cards, filtered by search query
              const columnWorkspaces = columnItems(
                items.filter(
                  (w) =>
                    searchQuery.trim() === "" ||
                    w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    (w.description &&
                      w.description
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())),
                ),
                column.status,
              );
              const totalInColumn = items.filter(
                (w) => w.status === column.status,
              ).length;

              return (
                <Droppable key={column.status} droppableId={column.status}>
                  {(droppableProvided, droppableSnapshot) => (
                    <div
                      className={`flex flex-col rounded-xl border transition-all ${
                        droppableSnapshot.isDraggingOver
                          ? "border-primary/60 bg-primary/10 shadow-lg shadow-primary/10 ring-2 ring-primary/40 z-20"
                          : "border-border/60 bg-card/40 shadow-xs"
                      }`}
                    >
                      {/* Column Header */}
                      <div className="flex items-center justify-between border-b border-border/40 px-3.5 py-3 bg-secondary/30 rounded-t-xl">
                        <div className="flex items-center gap-2">
                          <span
                            className={`size-2 rounded-full ${theme.dot}`}
                          />
                          <span className="text-xs font-mono font-semibold tracking-wider uppercase text-foreground/90">
                            {column.title}
                          </span>
                          <span className="rounded-full bg-secondary/80 px-2 py-0.2 font-mono text-[10px] text-muted-foreground border border-border/50">
                            {columnWorkspaces.length}
                            {searchQuery &&
                              columnWorkspaces.length !== totalInColumn && (
                                <span className="text-muted-foreground/60">
                                  /{totalInColumn}
                                </span>
                              )}
                          </span>
                        </div>

                        <WorkspaceDialog
                          trigger={
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-6 text-muted-foreground hover:text-primary hover:bg-secondary/80 cursor-pointer"
                              title={`Add workspace to ${column.title}`}
                            >
                              <Plus className="size-3.5" />
                            </Button>
                          }
                        />
                      </div>

                      {/* Droppable Drop Zone (NO overflow-hidden to prevent clipping dragged cards) */}
                      <div
                        ref={droppableProvided.innerRef}
                        {...droppableProvided.droppableProps}
                        className={`flex min-h-64 flex-1 flex-col gap-2 p-2.5 rounded-b-xl transition-colors ${
                          droppableSnapshot.isDraggingOver ? "bg-primary/5" : ""
                        }`}
                      >
                        {/* Dynamic Drop Target Indicator when hovering over stage */}
                        {droppableSnapshot.isDraggingOver && (
                          <div className="flex items-center justify-center gap-1.5 rounded-md border border-dashed border-primary/60 bg-primary/15 py-2 text-xs font-mono text-primary font-medium animate-pulse">
                            <ArrowRight className="size-3" />
                            <span>Drop to move to {column.title}</span>
                          </div>
                        )}

                        {columnWorkspaces.length === 0 &&
                        !droppableSnapshot.isDraggingOver ? (
                          <div className="flex flex-1 flex-col items-center justify-center rounded-lg border border-dashed border-border/60 p-6 text-center">
                            <span className="font-mono text-[11px] text-muted-foreground/60">
                              No items in {column.title.toLowerCase()}
                            </span>
                            <span className="mt-1 text-[10px] text-muted-foreground/40">
                              Drag card here across stages
                            </span>
                          </div>
                        ) : (
                          columnWorkspaces.map((workspace, index) => (
                            <Draggable
                              key={workspace.id}
                              draggableId={workspace.id}
                              index={index}
                            >
                              {(draggableProvided, draggableSnapshot) => (
                                <div
                                  ref={draggableProvided.innerRef}
                                  {...draggableProvided.draggableProps}
                                  {...draggableProvided.dragHandleProps}
                                  style={{
                                    ...draggableProvided.draggableProps.style,
                                    cursor: draggableSnapshot.isDragging
                                      ? "grabbing"
                                      : "grab",
                                  }}
                                  className={`relative ${
                                    draggableSnapshot.isDragging
                                      ? "z-50 shadow-2xl ring-2 ring-primary rounded-md opacity-95 scale-[1.02] pointer-events-none"
                                      : ""
                                  }`}
                                >
                                  <WorkspaceCard
                                    workspace={workspace}
                                    showStatus
                                    highlighted={draggableSnapshot.isDragging}
                                    actions={
                                      <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            aria-label="Workspace options"
                                            className="absolute top-2 right-2 size-7 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 data-[state=open]:opacity-100 hover:bg-secondary/80 cursor-pointer"
                                          >
                                            <MoreHorizontal className="size-4" />
                                          </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                          <DropdownMenuItem
                                            onSelect={() =>
                                              openFor(workspace, "edit")
                                            }
                                            className="cursor-pointer"
                                          >
                                            <Pencil className="size-4" />
                                            Edit 
                                          </DropdownMenuItem>
                                          <DropdownMenuItem
                                            variant="destructive"
                                            onSelect={() =>
                                              openFor(workspace, "delete")
                                            }
                                            className="cursor-pointer"
                                          >
                                            <Trash2 className="size-4" />
                                            Delete
                                          </DropdownMenuItem>
                                        </DropdownMenuContent>
                                      </DropdownMenu>
                                    }
                                  />
                                </div>
                              )}
                            </Draggable>
                          ))
                        )}
                        {droppableProvided.placeholder}
                      </div>
                    </div>
                  )}
                </Droppable>
              );
            })}
          </div>
        </DragDropContext>
      ) : viewMode === "grid" ? (
        /* ── View 2: Responsive Grid View ─────────────────────── */
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sortedItems.map((workspace) => (
            <WorkspaceCard
              key={workspace.id}
              workspace={workspace}
              showStatus
              actions={
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Workspace options"
                      className="absolute top-2 right-2 size-7 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 data-[state=open]:opacity-100 hover:bg-secondary/80 cursor-pointer"
                    >
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onSelect={() => openFor(workspace, "edit")}
                      className="cursor-pointer"
                    >
                      <Pencil className="size-4" />
                      Edit workspace
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      variant="destructive"
                      onSelect={() => openFor(workspace, "delete")}
                      className="cursor-pointer"
                    >
                      <Trash2 className="size-4" />
                      Delete workspace
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              }
            />
          ))}

          {/* Quick Create Card */}
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
        </div>
      ) : (
        /* ── View 3: Monospace High-Density Table View ────────── */
        <div className="overflow-hidden rounded-xl border border-border/70 bg-card/40 backdrop-blur-xs shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-border/50 bg-secondary/30 text-muted-foreground">
                  <th className="px-4 py-3 font-semibold uppercase tracking-wider">
                    Workspace
                  </th>
                  <th className="px-4 py-3 font-semibold uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 font-semibold uppercase tracking-wider">
                    Last Activity
                  </th>
                  <th className="px-4 py-3 font-semibold uppercase tracking-wider">
                    Creator
                  </th>
                  <th className="px-4 py-3 text-right font-semibold uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 font-sans">
                {sortedItems.map((workspace) => {
                  const theme = getStatusTheme(workspace.status);
                  const creatorName = workspace.creator.name ?? "Unknown";

                  return (
                    <tr
                      key={workspace.id}
                      className="group transition-colors hover:bg-secondary/40"
                    >
                      {/* Name & Description */}
                      <td className="px-4 py-3.5">
                        <Link
                          href={`/workspace/${workspace.id}`}
                          className="flex items-center gap-2.5 font-medium text-foreground group-hover:text-primary transition-colors"
                        >
                          <Layers className="size-4 text-primary shrink-0" />
                          <div>
                            <span className="font-medium text-sm">
                              {workspace.name}
                            </span>
                            {workspace.description && (
                              <p className="line-clamp-1 text-xs text-muted-foreground">
                                {workspace.description}
                              </p>
                            )}
                          </div>
                        </Link>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-mono text-[11px] ${theme.badge} border`}
                        >
                          <span
                            className={`size-1.5 rounded-full ${theme.dot}`}
                          />
                          <span>{statusTitle(workspace.status)}</span>
                        </span>
                      </td>

                      {/* Last Activity */}
                      <td
                        className="px-4 py-3.5 whitespace-nowrap font-mono text-xs text-muted-foreground"
                        suppressHydrationWarning
                      >
                        <span className="flex items-center gap-1.5">
                          <Clock className="size-3 text-muted-foreground/70" />
                          {formatDistanceToNow(
                            new Date(workspace.lastActivity),
                            {
                              addSuffix: true,
                            },
                          )}
                        </span>
                      </td>

                      {/* Creator */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {workspace.creator.imageUrl ? (
                            <Image
                              src={workspace.creator.imageUrl}
                              alt={creatorName}
                              width={20}
                              height={20}
                              className="size-5 shrink-0 rounded-full"
                            />
                          ) : (
                            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-white/10 text-[10px] font-medium text-foreground">
                              {creatorName.charAt(0).toUpperCase()}
                            </span>
                          )}
                          <span className="text-xs text-muted-foreground truncate max-w-28">
                            {creatorName}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            asChild
                            variant="ghost"
                            size="sm"
                            className="h-8 gap-1 font-mono text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                          >
                            <Link href={`/workspace/${workspace.id}`}>
                              <span>Open</span>
                              <ArrowRight className="size-3" />
                            </Link>
                          </Button>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                aria-label="Workspace options"
                                className="size-8 text-muted-foreground hover:text-foreground cursor-pointer"
                              >
                                <MoreHorizontal className="size-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onSelect={() => openFor(workspace, "edit")}
                                className="cursor-pointer"
                              >
                                <Pencil className="size-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                variant="destructive"
                                onSelect={() => openFor(workspace, "delete")}
                                className="cursor-pointer"
                              >
                                <Trash2 className="size-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Dialogs ─────────────────────────────────────────────── */}
      {selected && (
        <WorkspaceDialog
          workspace={selected}
          open={openDialog === "edit"}
          onOpenChange={(open) => !open && setOpenDialog(null)}
        />
      )}

      <AlertDialog
        open={openDialog === "delete"}
        onOpenChange={(open) => !open && setOpenDialog(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete &ldquo;{selected?.name}&rdquo;?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This permanently deletes the workspace, including its doc and
              canvas. It can&apos;t be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleDelete}
              disabled={!!isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
