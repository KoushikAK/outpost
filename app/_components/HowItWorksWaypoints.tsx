import { WaypointStep } from "@/app/_data/landing";
import { Bot, MessageSquareCode, Sparkles, Users } from "lucide-react";

interface HowItWorksWaypointsProps {
  data: {
    id: string;
    eyebrow: string;
    heading: string;
    subtitle: string;
    steps: WaypointStep[];
  };
}

export function HowItWorksWaypoints({ data }: HowItWorksWaypointsProps) {
  const stepIcons = [
    <MessageSquareCode key="0" className="size-4 text-primary" />,
    <Bot key="1" className="size-4 text-primary" />,
    <Users key="2" className="size-4 text-primary" />,
  ];

  return (
    <section
      id={data.id}
      className="topo-bg relative py-24 px-6 md:py-32 border-t border-border/50 bg-secondary/10 overflow-hidden"
    >
      <div className="mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border/80 bg-secondary/50 px-3.5 py-1 text-xs font-mono text-muted-foreground backdrop-blur-xs">
            <span className="text-primary text-[10px]">◆</span>
            <span>{data.eyebrow}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-normal font-heading tracking-tight text-foreground capitalize">
            {data.heading}
          </h2>
          <p className="mt-4 text-muted-foreground text-base sm:text-lg">
            {data.subtitle}
          </p>
        </div>

        {/* Waypoints Route Grid */}
        <div className="relative">
          {/* Desktop Connecting Route Line (Hidden on Mobile) */}
          <div className="hidden lg:block absolute top-7 left-[16%] right-[16%] h-0.5 border-t-2 border-dashed border-primary/40 z-0 pointer-events-none" />

          {/* Desktop Transit Direction Markers */}
          <div className="hidden lg:flex absolute top-4.75 left-[16%] right-[16%] justify-around z-0 pointer-events-none">
            <div className="bg-background border border-primary/40 px-2 py-0.5 rounded-full font-mono text-[9px] text-primary shadow-xs">
              BEARING 064° ──►
            </div>
            <div className="bg-background border border-primary/40 px-2 py-0.5 rounded-full font-mono text-[9px] text-primary shadow-xs">
              BEARING 118° ──►
            </div>
          </div>

          {/* Mobile Vertical Trail Line (Hidden on Desktop) */}
          <div className="lg:hidden absolute top-6 bottom-6 left-6 w-0.5 border-l-2 border-dashed border-primary/40 z-0 pointer-events-none" />

          {/* Steps Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8 relative z-10">
            {data.steps.map((step, idx) => (
              <div
                key={step.number}
                className="flex flex-col pl-16 lg:pl-0 items-start lg:items-center text-left lg:text-center group"
              >
                {/* Waypoint Marker Pin */}
                <div className="absolute left-0 lg:static -top-1 lg:top-auto flex items-center justify-center size-14 rounded-full border-2 border-primary bg-background shadow-[0_0_24px_rgba(249,115,22,0.35)] mb-5 transition-transform duration-300 group-hover:scale-105">
                  <span className="font-mono text-base font-bold text-primary">
                    {step.number}
                  </span>
                  {/* Ping Indicator */}
                  <span className="absolute -top-1 -right-1 size-3.5 rounded-full bg-primary/20 border border-primary flex items-center justify-center">
                    <span className="size-1.5 rounded-full bg-primary animate-ping" />
                  </span>
                </div>

                {/* Waypoint Meta Badge */}
                <div className="mb-2 font-mono text-[10px] text-primary font-semibold tracking-widest uppercase">
                  {step.waypoint}
                </div>

                {/* Step Title */}
                <h3 className="text-2xl font-normal font-heading text-foreground mb-3 tracking-tight">
                  {step.title}
                </h3>

                {/* Step Description */}
                <p className="text-muted-foreground text-sm leading-relaxed mb-6 max-w-sm">
                  {step.description}
                </p>

                {/* Waypoint Telemetry / Interactive-style Simulation Box */}
                <div className="w-full rounded-xl edge-light bg-card/60 p-4 border border-border/60 text-left shadow-lg backdrop-blur-xs">
                  <div className="flex items-center justify-between border-b border-border/50 pb-2.5 mb-2.5 font-mono text-[10px] text-muted-foreground">
                    <div className="flex items-center gap-1.5 text-foreground font-medium">
                      {stepIcons[idx]}
                      <span>{step.mockLabel}</span>
                    </div>
                    <span className="text-primary font-semibold tracking-wider">
                      {step.tag}
                    </span>
                  </div>

                  {idx === 0 && (
                    <div className="rounded border border-border/60 bg-background/90 p-3 font-mono text-xs text-foreground/90 leading-relaxed">
                      <span className="text-primary select-none mr-1.5">›</span>
                      {step.mockContent}
                    </div>
                  )}

                  {idx === 1 && (
                    <div className="space-y-2">
                      <div className="rounded border border-border/60 bg-background/90 p-2.5 font-mono text-[11px] text-primary flex items-center gap-2">
                        <span className="size-2 rounded-full bg-primary animate-pulse shrink-0" />
                        <span className="truncate">{step.mockContent}</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground px-1">
                        <span>CANVAS: ACTIVE DRAFT</span>
                        <span className="text-emerald-400">100% VECTOR</span>
                      </div>
                    </div>
                  )}

                  {idx === 2 && (
                    <div className="space-y-2">
                      <div className="rounded border border-border/60 bg-background/90 p-2.5 font-mono text-[11px] text-foreground/90">
                        <div className="flex items-center gap-1.5 text-emerald-400 text-[10px] mb-1">
                          <Sparkles className="size-3" />
                          <span>LIVE CO-PILOT SYNC</span>
                        </div>
                        <span className="text-muted-foreground text-[10px] block leading-snug">
                          {step.mockContent}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
