import React from "react";
import { SurfaceItem } from "@/app/_data/landing";
import { FlowchartMock } from "./FlowchartMock";
import { DocMock } from "./DocMock";
import { KanbanMock } from "./KanbanMock";
import { Check, FileText, Kanban, PenTool } from "lucide-react";

interface SurfaceRowProps {
  surface: SurfaceItem;
  index: number;
}

const iconMap: Record<string, React.ReactNode> = {
  canvas: <PenTool className="size-5 text-primary" />,
  docs: <FileText className="size-5 text-primary" />,
  "team-board": <Kanban className="size-5 text-primary" />,
};

export function SurfaceRow({ surface, index }: SurfaceRowProps) {
  const isReversed = index % 2 === 1;

  const renderMock = () => {
    switch (surface.mockType) {
      case "flowchart":
        return <FlowchartMock />;
      case "doc":
        return <DocMock />;
      case "kanban":
        return <KanbanMock />;
      default:
        return null;
    }
  };

  return (
    <div
      className={`flex flex-col gap-10 lg:gap-16 items-center ${
        isReversed ? "lg:flex-row-reverse" : "lg:flex-row"
      } py-12 lg:py-16 border-b border-border/40 last:border-b-0`}
    >
      {/* Text Column */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center text-left">
        {/* Eyebrow badge */}
        <div className="mb-3 inline-flex items-center gap-2 font-mono text-xs text-muted-foreground uppercase tracking-wider">
          <span className="text-primary text-[10px]">◆</span>
          <span>{surface.eyebrow}</span>
        </div>

        {/* Title with surface icon */}
        <div className="flex items-center gap-3.5 mb-4">
          <div className="size-11 rounded-lg border border-border/80 bg-secondary/60 flex items-center justify-center shrink-0">
            {iconMap[surface.id] || <PenTool className="size-5 text-primary" />}
          </div>
          <h3 className="text-3xl sm:text-4xl font-normal font-heading tracking-tight text-foreground">
            {surface.title}
          </h3>
        </div>

        {/* Description */}
        <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-6">
          {surface.description}
        </p>

        {/* 3 Bullets */}
        <ul className="space-y-3 font-mono text-xs sm:text-sm text-foreground/85 border-t border-border/60 pt-6">
          {surface.bullets.map((bullet, idx) => (
            <li key={idx} className="flex items-start gap-2.5">
              <span className="size-4 rounded-full bg-primary/10 border border-primary/40 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="size-2.5 text-primary" />
              </span>
              <span className="leading-normal">{bullet}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Mock Column */}
      <div className="w-full lg:w-1/2 flex items-center justify-center">
        {renderMock()}
      </div>
    </div>
  );
}
