import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Bot,
  Check,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";

interface FinalCtaProps {
  data: {
    eyebrow: string;
    heading: string;
    subtitle: string;
    primaryCta: {
      label: string;
      href: string;
    };
    secondaryCta: {
      label: string;
      href: string;
    };
    badges?: string[];
  };
}

export function FinalCta({ data }: FinalCtaProps) {
  const defaultBadges = [
    {
      label: "No credit card required",
      icon: <Check className="size-3 text-primary" />,
    },
    {
      label: "50 Free agent credits/mo",
      icon: <Zap className="size-3 text-primary" />,
    },
    {
      label: "Yjs real-time multiplayer",
      icon: <Bot className="size-3 text-primary" />,
    },
    {
      label: "Clerk-secured workspace",
      icon: <ShieldCheck className="size-3 text-primary" />,
    },
  ];

  return (
    <section className="relative py-24 px-6 md:py-36 overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute inset-0 pointer-events-none -z-10 flex items-center justify-center">
        <div className="h-112.5 w-187.5 max-w-full rounded-full bg-[radial-gradient(ellipse_at_center,oklch(var(--l-accent)_var(--c-accent)_var(--h-accent)/0.18)_0%,transparent_70%)] blur-3xl" />
      </div>

      <div className="mx-auto max-w-5xl">
        {/* Survey Frame Wrapper (with registration marks) */}
        <div className="survey-frame">
          <div className="edge-light relative overflow-hidden rounded-2xl bg-card/85 p-8 sm:p-12 md:p-16 shadow-2xl backdrop-blur-md">
            {/* Topographic Background Texture Overlay */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.06] bg-[radial-gradient(#ffffff_1px,transparent_1px)] bg-size-[24px_24px]"
              aria-hidden="true"
            />

            {/* Corner Decorative Crosshairs */}
            <div className="absolute top-3 left-3 font-mono text-[10px] text-primary/40 select-none">
              +
            </div>
            <div className="absolute top-3 right-3 font-mono text-[10px] text-primary/40 select-none">
              +
            </div>
            <div className="absolute bottom-3 left-3 font-mono text-[10px] text-primary/40 select-none">
              +
            </div>
            <div className="absolute bottom-3 right-3 font-mono text-[10px] text-primary/40 select-none">
              +
            </div>

            {/* Top Station Telemetry Bar */}
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-4 font-mono text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-primary animate-pulse" />
                <span className="text-foreground/90 font-medium tracking-wide">
                  OUTPOST BEACON // SECTOR 08
                </span>
                <span className="hidden sm:inline text-border">/</span>
                <span className="hidden sm:inline text-muted-foreground/70">
                  LAT: 37.7749° N • LON: 122.4194° W
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/30 px-2.5 py-0.5 text-[10px] font-mono text-primary font-medium">
                  <span className="size-1.5 rounded-full bg-primary animate-ping" />
                  STATION READY
                </span>
              </div>
            </div>

            {/* Main Content */}
            <div className="mx-auto max-w-3xl text-center">
              {/* Eyebrow */}
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border/80 bg-secondary/60 px-4 py-1 text-xs font-mono text-muted-foreground shadow-xs">
                <span className="text-primary text-[10px] leading-none">◆</span>
                <span className="tracking-wider uppercase">{data.eyebrow}</span>
              </div>

              {/* Headline */}
              <h2 className="text-3xl sm:text-5xl md:text-6xl font-normal font-heading tracking-tight text-foreground leading-[1.08]">
                Stake your <span className="text-primary">outpost</span> today
              </h2>

              {/* Subtitle */}
              <p className="mt-5 text-base sm:text-lg md:text-xl text-muted-foreground font-normal leading-relaxed max-w-2xl mx-auto">
                {data.subtitle} Join founders, product teams, and engineers who
                draw architectures and draft living specs side-by-side with an
                autonomous AI partner.
              </p>

              {/* Interactive Action Buttons */}
              <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
                <Button
                  asChild
                  size="lg"
                  className="glow px-8 h-12 text-base font-medium cursor-pointer shadow-xl transition-transform hover:scale-[1.02]"
                >
                  <Link
                    href={data.primaryCta.href}
                    className="inline-flex items-center gap-2"
                  >
                    <Sparkles className="size-4" />
                    <span>{data.primaryCta.label}</span>
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-border/80 bg-background/60 hover:bg-muted/60 px-7 h-12 text-base font-medium cursor-pointer"
                >
                  <Link href={data.secondaryCta.href}>
                    {data.secondaryCta.label}
                  </Link>
                </Button>
              </div>

              {/* Reassurance Micro-Badges */}
              <div className="mt-10 pt-8 border-t border-border/50 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
                {defaultBadges.map((badge, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground"
                  >
                    <span className="size-5 rounded-md border border-border/60 bg-secondary/50 flex items-center justify-center shrink-0">
                      {badge.icon}
                    </span>
                    <span className="leading-tight">{badge.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
