import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Sparkles,
  Layers,
  Cpu,
  ShieldCheck,
  Compass,
  Lock,
  Activity,
  Zap,
  Terminal,
} from "lucide-react";
import { landingData } from "@/app/_data/landing";
import { AudienceStrip } from "./_components/AudienceStrip";
import { SurfaceRow } from "./_components/SurfaceRow";
import { HowItWorksWaypoints } from "./_components/HowItWorksWaypoints";
import { FinalCta } from "./_components/FinalCta";
import { Footer } from "./_components/Footer";
import { PricingPlans } from "@/components/PricingPlans";

function Crosshair({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute z-20 flex size-3 items-center justify-center font-mono text-[10px] leading-none text-primary/50 select-none ${className}`}
    >
      +
    </span>
  );
}

export const instant = false;

export default function Home() {
  const { hero, audiences, features, howItWorks, pricing, ctaBanner, footer } =
    landingData;

  return (
    <div className="relative flex w-full flex-col overflow-x-hidden selection:bg-primary/20 selection:text-primary">
      {/* ── GLOBAL ARCHITECTURAL GUIDE RAILS ──────────────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 mx-auto hidden max-w-7xl border-x border-white/4 lg:block"
      >
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 border-l border-dashed border-white/2.5" />
      </div>

      {/* ── 1. HERO SECTION ───────────────────────────────────── */}
      <section className="topo-bg relative flex flex-col items-center justify-center overflow-hidden px-6 pt-14 pb-24 text-center md:pt-24 md:pb-32 lg:pt-28 lg:pb-40">
        {/* Ambient Top Spotlight & Concentric Topo Rings */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 flex items-start justify-center overflow-hidden"
        >
          {/* Primary Aurora Beam */}
          <div className=" -top-40 h-136 w-272 rounded-full bg-primary/12 blur-[140px]" />
          <div className="absolute top-28 h-72 w-2xl rounded-full bg-primary/8 blur-[100px]" />

          {/* Concentric Survey Radar Circles */}
          <div className="absolute -top-64 size-176 rounded-full border border-white/4 sm:size-232 lg:size-296" />
          <div className="absolute -top-40 size-128 rounded-full border border-dashed border-primary/12 sm:size-176 lg:size-224" />
          <div className="absolute -top-16 size-80 rounded-full border border-white/5 sm:size-120 lg:size-152" />
        </div>

        {/* Top Telemetry Coordinate Bar */}
        <div className="relative z-10 mb-8 flex items-center gap-3 font-mono text-[10px] tracking-[0.22em] text-muted-foreground/60 uppercase">
          <span className="hidden sm:inline-block">SYS // 01</span>
          <span className="hidden h-px w-6 bg-border/70 sm:inline-block" />
          <div className="group inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-secondary/60 px-4 py-1.5 text-xs font-mono tracking-wider text-muted-foreground shadow-lg shadow-black/20 backdrop-blur-md transition-all duration-300 hover:border-primary/40 hover:bg-secondary/80">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-primary" />
            </span>
            <span className="text-foreground/90 uppercase">{hero.eyebrow}</span>
            <span className="border-l border-white/10 pl-2.5 text-[10px] text-primary">
              LIVE
            </span>
          </div>
          <span className="hidden h-px w-6 bg-border/70 sm:inline-block" />
          <span className="hidden sm:inline-block">OUTPOST OS</span>
        </div>

        {/* Headline */}
        <h1 className="relative z-10 max-w-5xl text-balance font-heading text-4xl font-normal tracking-tight text-foreground sm:text-6xl md:text-7xl lg:text-[5.6rem] leading-[1.04]">
          <span className="bg-linear-to-b from-foreground via-foreground to-foreground/75 bg-clip-text">
            {hero.headlinePrefix}
          </span>{" "}
          <span className="relative inline-block">
            <span className="relative z-10 bg-linear-to-r from-primary via-primary to-primary/80 bg-clip-text text-primary drop-shadow-[0_0_28px_rgba(255,255,255,0.12)]">
              {hero.highlightedWord}
            </span>
            {/* Subtle architectural underline accent */}
            <svg
              aria-hidden="true"
              viewBox="0 0 240 14"
              fill="none"
              className="pointer-events-none absolute -bottom-1.5 left-0 w-full text-primary/50"
            >
              <path
                d="M2 10.5C62 3.5 178 3.5 238 10.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </span>{" "}
          <span className="bg-linear-to-b from-foreground via-foreground to-foreground/75 bg-clip-text">
            {hero.headlineSuffix}
          </span>
        </h1>

        {/* Subtitle */}
        <p className="relative z-10 mt-7 max-w-2xl text-balance text-base font-normal text-muted-foreground sm:text-lg md:text-xl leading-relaxed">
          {hero.subtitle}
        </p>

        {/* CTAs */}
        <div className="relative z-10 mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button
            asChild
            size="lg"
            className="group glow relative h-12 cursor-pointer overflow-hidden rounded-lg px-7 text-base font-medium shadow-xl shadow-primary/20 transition-all duration-300 hover:scale-[1.02]"
          >
            <Link href={hero.primaryCta.href}>
              <span>{hero.primaryCta.label}</span>
              <ArrowRight className="ml-1.5 size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            size="lg"
            className="h-12 cursor-pointer rounded-lg border-white/12 bg-background/60 px-7 text-base font-medium backdrop-blur-md transition-all duration-300 hover:border-white/25 hover:bg-muted/60"
          >
            <Link
              href={hero.secondaryCta.href}
              className="flex items-center gap-2"
            >
              <Compass className="size-4 text-primary/80" />
              <span>{hero.secondaryCta.label}</span>
            </Link>
          </Button>
        </div>

        {/* Micro-Telemetry Capability Pills */}
        <div className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-[11px] tracking-wider text-muted-foreground/75 uppercase">
          <span className="inline-flex items-center gap-1.5">
            <Layers className="size-3.5 text-primary" />
            Structured Docs
          </span>
          <span className="text-border">•</span>
          <span className="inline-flex items-center gap-1.5">
            <Cpu className="size-3.5 text-primary" />
            Infinite Canvas
          </span>
          <span className="text-border">•</span>
          <span className="inline-flex items-center gap-1.5">
            <Sparkles className="size-3.5 text-primary" />
            Context-Aware Agent
          </span>
        </div>

        {/* ── HERO PREVIEW SHOWCASE STAGE ──────────────────────── */}
        <div className="relative z-10 mt-16 w-full max-w-6xl px-2 sm:px-4">
          {/* Outer Ambient Halo Behind Frame */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-4 rounded-3xl bg-linear-to-b from-primary/20 via-primary/5 to-transparent opacity-75 blur-2xl"
          />

          {/* Floating Left HUD Pill (Desktop) */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-5 left-8 z-30 hidden items-center gap-2 rounded-full border border-white/10 bg-background/85 px-3.5 py-1.5 font-mono text-[11px] text-muted-foreground shadow-xl backdrop-blur-md lg:inline-flex"
          >
            <Terminal className="size-3.5 text-primary" />
            <span>WORKSPACE // MULTI-SURFACE SYNC</span>
          </div>

          {/* Floating Right HUD Pill (Desktop) */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-5 right-8 z-30 hidden items-center gap-2 rounded-full border border-primary/30 bg-background/85 px-3.5 py-1.5 font-mono text-[11px] text-foreground shadow-xl backdrop-blur-md lg:inline-flex"
          >
            <Activity className="size-3.5 text-primary animate-pulse" />
            <span>AGENT CONTEXT: READY</span>
          </div>

          <div className="survey-frame scroll-tilt relative rounded-2xl p-1.5 sm:p-2.5 ring-1 ring-white/10 bg-white/2 backdrop-blur-xs">
            {/* Corner Survey Crosshairs */}
            <Crosshair className="-top-1.5 -left-1.5" />
            <Crosshair className="-top-1.5 -right-1.5" />
            <Crosshair className="-bottom-1.5 -left-1.5" />
            <Crosshair className="-bottom-1.5 -right-1.5" />

            <div className="edge-light relative overflow-hidden rounded-xl border border-white/10 bg-card shadow-[0_25px_80px_-15px_rgba(0,0,0,0.85)]">
              {/* Window Chrome Header */}
              <div className="flex h-11 items-center justify-between border-b border-border/70 bg-secondary/60 px-4 font-mono text-xs text-muted-foreground backdrop-blur-md">
                {/* Traffic Lights & Workspace Indicator */}
                <div className="flex items-center gap-2">
                  <span className="size-2.5 rounded-full bg-white/15 ring-1 ring-white/10 transition-colors hover:bg-red-400/80" />
                  <span className="size-2.5 rounded-full bg-white/15 ring-1 ring-white/10 transition-colors hover:bg-amber-400/80" />
                  <span className="size-2.5 rounded-full bg-white/15 ring-1 ring-white/10 transition-colors hover:bg-emerald-400/80" />
                  <span className="ml-2 hidden rounded border border-white/8 bg-white/4 px-2 py-0.5 font-mono text-[10px] tracking-wider text-muted-foreground/90 md:inline-block">
                    OUTPOST // CORE
                  </span>
                </div>

                {/* Centered Browser / Workspace Address Pill */}
                <div className="flex items-center gap-2 rounded-md border border-white/8 bg-background/60 px-3 py-1 font-mono text-[11px] text-muted-foreground/90 shadow-inner">
                  <Lock className="size-3 text-primary/80" />
                  <span className="truncate max-w-45 sm:max-w-xs">
                    {hero.video.windowUrl}
                  </span>
                </div>

                {/* Right Live Telemetry */}
                <div className="flex items-center gap-3 text-[11px]">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5 text-primary ring-1 ring-primary/25">
                    <span className="size-1.5 rounded-full bg-primary animate-pulse" />
                    {hero.video.statusLabel}
                  </span>
                  <span className="hidden border-l border-border/60 pl-3 font-mono text-[10px] tracking-widest text-muted-foreground/70 sm:inline">
                    DOC + CANVAS
                  </span>
                </div>
              </div>

              {/* Video Player Stage */}
              <div className="relative aspect-16/10 w-full bg-background/90">
                <video
                  poster={hero.video.poster}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="h-full w-full object-cover"
                >
                  <source src={hero.video.mp4} type="video/mp4" />
                  <source src={hero.video.webm} type="video/webm" />
                </video>

                {/* Subtle Inner Vignette & Bottom Horizon Blend */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-background/60 via-background/15 to-transparent"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. WHO'S IT FOR STRIP ─────────────────────────────── */}
      <div className="relative z-10 border-y border-white/6 bg-secondary/15 backdrop-blur-xs">
        <div className="mx-auto max-w-7xl relative">
          <Crosshair className="-top-1.5 -left-1.5 hidden lg:flex" />
          <Crosshair className="-top-1.5 -right-1.5 hidden lg:flex" />
          <Crosshair className="-bottom-1.5 -left-1.5 hidden lg:flex" />
          <Crosshair className="-bottom-1.5 -right-1.5 hidden lg:flex" />
          <AudienceStrip items={audiences.items} label={audiences.label} />
        </div>
      </div>

      {/* ── 3. FEATURES SECTION: SURFACES WITH STATIC MOCKS ───── */}
      <section
        id="product"
        className="relative overflow-hidden py-28 px-6 md:py-36"
      >
        {/* Ambient Mid-Section Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/4 left-1/2 -z-10 h-144 w-5xl -translate-x-1/2 rounded-full bg-primary/5 blur-[150px]"
        />

        <div className="mx-auto max-w-6xl">
          {/* Section Header */}
          <div className="mx-auto mb-20 max-w-3xl text-center md:mb-28">
            <div className="mb-5 inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-secondary/50 px-3.5 py-1 text-xs font-mono tracking-wider text-muted-foreground backdrop-blur-xs">
              <span className="text-[10px] text-primary">◆</span>
              <span className="uppercase">{features.eyebrow}</span>
              <span className="border-l border-white/10 pl-2 text-[10px] text-muted-foreground/60">
                02 // ARCHITECTURE
              </span>
            </div>

            <h2 className="text-balance font-heading text-3xl font-normal tracking-tight text-foreground capitalize sm:text-5xl md:text-6xl leading-[1.08]">
              {features.heading}
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-balance text-base text-muted-foreground sm:text-lg leading-relaxed">
              {features.subtitle}
            </p>

            {/* Surface Waypoint Index Pills */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
              {features.surfaces.map((surface, idx) => (
                <span
                  key={surface.id}
                  className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-card/60 px-3.5 py-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground backdrop-blur-xs"
                >
                  <span className="text-primary">0{idx + 1}</span>
                  <span className="h-2.5 w-px bg-border" />
                  <span className="text-foreground/85">
                    {surface.id.replace(/[-_]/g, " ")}
                  </span>
                </span>
              ))}
            </div>
          </div>

          {/* Alternating Surface Rows */}
          <div className="relative flex flex-col">
            {features.surfaces.map((surface, idx) => (
              <SurfaceRow key={surface.id} surface={surface} index={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. HOW IT WORKS: WAYPOINTS ON A ROUTE ─────────────── */}
      <div className="relative border-t border-white/6 bg-linear-to-b from-secondary/10 via-transparent to-transparent">
        <div className="mx-auto max-w-7xl relative">
          <Crosshair className="-top-1.5 -left-1.5 hidden lg:flex" />
          <Crosshair className="-top-1.5 -right-1.5 hidden lg:flex" />
        </div>
        <HowItWorksWaypoints data={howItWorks} />
      </div>

      {/* ── 5. PRICING SECTION ────────────────────────────────── */}
      <section
        id="pricing"
        className="relative overflow-hidden border-t border-border/60 py-28 px-6 md:py-36"
      >
        {/* Ambient Pricing Spotlight */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-16 left-1/2 -z-10 h-112 w-4xl -translate-x-1/2 rounded-full bg-primary/[0.07] blur-[140px]"
        />

        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-14 max-w-3xl text-center md:mb-20">
            <div className="mb-5 inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-secondary/50 px-3.5 py-1 text-xs font-mono tracking-wider text-muted-foreground backdrop-blur-xs">
              <span className="text-[10px] text-primary">◆</span>
              <span className="uppercase">{pricing.eyebrow}</span>
              <span className="border-l border-white/10 pl-2 text-[10px] text-muted-foreground/60">
                04 // SCALE
              </span>
            </div>

            <h2 className="text-balance font-heading text-3xl font-normal tracking-tight text-foreground sm:text-5xl md:text-6xl leading-[1.08]">
              {pricing.heading}
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-balance text-base text-muted-foreground sm:text-lg leading-relaxed">
              {pricing.subtitle}
            </p>
          </div>

          <PricingPlans />

          {/* Pricing Reassurance & Telemetry Footer Bar */}
          <div className="mx-auto mt-14 flex max-w-4xl flex-wrap items-center justify-center gap-x-8 gap-y-3 rounded-2xl border border-white/8 bg-secondary/25 px-6 py-4 font-mono text-xs text-muted-foreground backdrop-blur-xs">
            <span className="inline-flex items-center gap-2">
              <Zap className="size-3.5 text-primary" />
              <span>Instant workspace provisioning</span>
            </span>
            <span className="hidden text-border sm:inline">•</span>
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="size-3.5 text-primary" />
              <span>Personal &amp; Team billing supported</span>
            </span>
            <span className="hidden text-border sm:inline">•</span>
            <span className="inline-flex items-center gap-2">
              <Sparkles className="size-3.5 text-primary" />
              <span>Real-time monthly prompt metering</span>
            </span>
          </div>
        </div>
      </section>

      {/* ── 6. FINAL CALL TO ACTION ───────────────────────────── */}
      <div className="relative border-t border-white/6">
        <FinalCta data={ctaBanner} />
      </div>

      {/* ── 7. FOOTER ─────────────────────────────────────────── */}
      <Footer footer={footer} />
    </div>
  );
}
