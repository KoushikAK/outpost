import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import { landingData } from "@/app/_data/landing";
import { AudienceStrip } from "./_components/AudienceStrip";
import { SurfaceRow } from "./_components/SurfaceRow";
import { HowItWorksWaypoints } from "./_components/HowItWorksWaypoints";
import { FinalCta } from "./_components/FinalCta";
import { Footer } from "./_components/Footer";

export default function Home() {
  const { hero, audiences, features, howItWorks, pricing, ctaBanner, footer } =
    landingData;

  return (
    <div className="flex flex-col w-full">
      {/* ── 1. HERO SECTION ─────────────────────────────────── */}
      <section className="topo-bg relative flex flex-col items-center justify-center px-6 pt-12 pb-20 text-center md:pt-20 md:pb-28 lg:pt-24 lg:pb-36">
        {/* Eyebrow */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/80 bg-secondary/50 px-3.5 py-1 text-xs font-mono tracking-wider text-muted-foreground backdrop-blur-xs transition-colors hover:border-border">
          <span className="text-primary text-[10px] leading-none">◆</span>
          <span className="uppercase">{hero.eyebrow}</span>
        </div>

        {/* Headline */}
        <h1 className="max-w-4xl text-balance font-heading text-4xl font-normal tracking-tight text-foreground sm:text-6xl md:text-7xl lg:text-[5.5rem] leading-[1.06]">
          {hero.headlinePrefix}{" "}
          <span className="text-primary">{hero.highlightedWord}</span>{" "}
          {hero.headlineSuffix}
        </h1>

        {/* Subtitle */}
        <p className="mt-6 max-w-2xl text-balance text-base font-normal text-muted-foreground sm:text-lg md:text-xl leading-relaxed">
          {hero.subtitle}
        </p>

        {/* CTAs */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Button
            asChild
            size="lg"
            className="glow px-6 h-11 text-base font-medium cursor-pointer"
          >
            <Link href={hero.primaryCta.href}>
              {hero.primaryCta.label}
              <ArrowRight className="ml-1 size-4" />
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-border/80 bg-background/60 hover:bg-muted/60 px-6 h-11 text-base font-medium cursor-pointer"
          >
            <Link href={hero.secondaryCta.href}>{hero.secondaryCta.label}</Link>
          </Button>
        </div>

        {/* Hero Preview Showcase */}
        <div className="mt-14 w-full max-w-5xl px-2 sm:px-4">
          <div className="survey-frame scroll-tilt">
            <div className="edge-light relative overflow-hidden rounded-xl bg-card shadow-2xl">
              {/* Window Chrome Header */}
              <div className="flex h-10 items-center justify-between border-b border-border/70 bg-secondary/40 px-4 font-mono text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span className="size-2.5 rounded-full bg-border" />
                  <span className="size-2.5 rounded-full bg-border" />
                  <span className="size-2.5 rounded-full bg-border" />
                  <span className="ml-2 font-mono text-[11px] text-muted-foreground/80">
                    {hero.video.windowUrl}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[11px]">
                  <span className="inline-flex items-center gap-1.5 text-primary">
                    <span className="size-1.5 rounded-full bg-primary animate-pulse" />
                    {hero.video.statusLabel}
                  </span>
                  <span className="hidden sm:inline border-l border-border/60 pl-3 text-muted-foreground/60">
                    DOC + CANVAS
                  </span>
                </div>
              </div>

              {/* Video Player */}
              <div className="relative aspect-16/10 w-full bg-background/80">
                <video
                  src={hero.video.mp4}
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
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. WHO'S IT FOR STRIP ───────────────────────────── */}
      <AudienceStrip items={audiences.items} label={audiences.label} />

      {/* ── 3. FEATURES SECTION: SURFACES WITH STATIC MOCKS ──── */}
      <section id="product" className="py-24 px-6 md:py-32">
        <div className="mx-auto max-w-6xl">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border/80 bg-secondary/40 px-3 py-0.5 text-xs font-mono text-muted-foreground">
              <span className="text-primary text-[10px]">◆</span>
              <span>{features.eyebrow}</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-normal font-heading tracking-tight text-foreground capitalize">
              {features.heading}
            </h2>
            <p className="mt-4 text-muted-foreground text-base sm:text-lg">
              {features.subtitle}
            </p>
          </div>

          {/* Alternating Surface Rows */}
          <div className="flex flex-col">
            {features.surfaces.map((surface, idx) => (
              <SurfaceRow key={surface.id} surface={surface} index={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. HOW IT WORKS: WAYPOINTS ON A ROUTE ───────────── */}
      <HowItWorksWaypoints data={howItWorks} />

      {/* ── 5. PRICING SECTION ──────────────────────────────── */}
      <section id="pricing" className="py-24 px-6 md:py-32 border-t border-border/50">
        <div className="mx-auto max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border/80 bg-secondary/40 px-3 py-0.5 text-xs font-mono text-muted-foreground">
              <span className="text-primary text-[10px]">◆</span>
              <span>{pricing.eyebrow}</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-normal font-heading tracking-tight text-foreground">
              {pricing.heading}
            </h2>
            <p className="mt-4 text-muted-foreground text-base sm:text-lg">
              {pricing.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricing.tiers.map((tier) => (
              <div
                key={tier.id}
                className={`relative rounded-xl p-8 flex flex-col justify-between ${
                  tier.featured
                    ? "edge-light glow bg-card"
                    : "border border-border/60 bg-card/30"
                }`}
              >
                {tier.badge && (
                  <div className="absolute -top-3 right-6 rounded-full bg-primary px-3 py-0.5 font-mono text-[11px] font-medium text-primary-foreground">
                    {tier.badge}
                  </div>
                )}
                <div>
                  <div
                    className={`font-mono text-xs uppercase tracking-wider ${
                      tier.featured
                        ? "text-primary font-semibold"
                        : "text-muted-foreground"
                    }`}
                  >
                    {tier.name}
                  </div>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-4xl font-normal font-heading text-foreground">
                      {tier.price}
                    </span>
                    <span className="text-xs font-mono text-muted-foreground">
                      {tier.period}
                    </span>
                  </div>
                  <p className="mt-3 text-xs sm:text-sm text-muted-foreground">
                    {tier.description}
                  </p>

                  <ul className="mt-8 space-y-3 text-xs sm:text-sm text-foreground/80">
                    {tier.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-center gap-2.5">
                        <Check className="size-4 text-primary shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  asChild
                  variant={tier.cta.variant}
                  className={`mt-8 w-full ${
                    tier.featured
                      ? "font-medium"
                      : "border-border/80 hover:bg-muted/60"
                  }`}
                >
                  <Link href={tier.cta.href}>{tier.cta.label}</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. FINAL CALL TO ACTION ─────────────────────────── */}
      <FinalCta data={ctaBanner} />

      {/* ── 7. FOOTER ───────────────────────────────────────── */}
      <Footer footer={footer} />
    </div>
  );
}
