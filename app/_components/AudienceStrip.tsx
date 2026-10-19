import React from "react";
import { AudienceItem } from "@/app/_data/landing";
import {
  Briefcase,
  Compass,
  FileSpreadsheet,
  Layers,
  Sparkles,
} from "lucide-react";

interface AudienceStripProps {
  items: AudienceItem[];
  label: string;
}

const iconMap: Record<string, React.ReactNode> = {
  "product-teams": <Layers className="size-4 text-primary" />,
  founders: <Compass className="size-4 text-primary" />,
  "solo-builders": <Sparkles className="size-4 text-primary" />,
  agencies: <Briefcase className="size-4 text-primary" />,
  consultants: <FileSpreadsheet className="size-4 text-primary" />,
};

export function AudienceStrip({ items, label }: AudienceStripProps) {
  return (
    <section className="border-y border-border/50 bg-secondary/15 py-10 px-6">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          {/* Eyebrow Label */}
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted-foreground whitespace-nowrap">
            <span className="text-primary text-[10px]">◆</span>
            <span className="font-semibold text-foreground/80">{label}</span>
          </div>

          {/* Cards / Badges Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 w-full">
            {items.map((item) => (
              <div
                key={item.id}
                className="group relative flex flex-col justify-between rounded-lg border border-border/60 bg-card/40 p-3.5 transition-all hover:border-primary/50 hover:bg-card/80"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="size-7 rounded-md border border-border/60 bg-secondary/60 flex items-center justify-center">
                    {iconMap[item.id] || <span className="text-primary text-xs">◆</span>}
                  </div>
                  <span className="font-mono text-[9px] text-muted-foreground/80 group-hover:text-primary transition-colors">
                    {item.badge}
                  </span>
                </div>

                <div>
                  <div className="font-mono text-xs font-medium text-foreground tracking-tight">
                    {item.label}
                  </div>
                  <div className="mt-1 text-[11px] text-muted-foreground leading-snug line-clamp-2">
                    {item.tagline}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
