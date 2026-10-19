"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUp, Bot, Compass, Sparkles, Terminal } from "lucide-react";
import { FooterNavGroup } from "@/app/_data/landing";

interface FooterProps {
  footer: {
    tagline: string;
    navGroups: FooterNavGroup[];
    telemetry: {
      lat: string;
      lon: string;
      surveyId: string;
      year: number;
    };
  };
}

export function Footer({ footer }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative border-t border-border/50 bg-background overflow-hidden">
      {/* Radiant Top Glow Line */}
      <div className="relative h-px w-full bg-linear-to-r from-transparent via-primary/50 to-transparent">
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-2 rounded-full bg-primary shadow-[0_0_12px_rgba(249,115,22,0.8)]" />
      </div>

      {/* Background Topo Texture Faded */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(#ffffff_1px,transparent_1px)] bg-size-[20px_20px]"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-20">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-14 border-b border-border/50">
          {/* Column 1: Brand & Identity (5 cols) */}
          <div className="md:col-span-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3">
                <Link href="/" className="inline-block transition-opacity hover:opacity-90">
                  <Image
                    src="/brand/logo-navbar-dark.png"
                    alt="Outpost"
                    width={260}
                    height={130}
                    className="h-9 w-auto"
                  />
                </Link>
              </div>

              <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-sm">
                {footer.tagline}
              </p>

              {/* Station Coordinates Pill */}
              <div className="mt-6 flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-2 rounded-md border border-border/70 bg-secondary/40 px-3 py-1 font-mono text-[11px] text-muted-foreground backdrop-blur-xs">
                  <Compass className="size-3 text-primary" />
                  <span>SECTOR 08 // BASE ELEVATION 284m</span>
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 font-mono text-[11px] text-emerald-400">
                  <span className="size-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>ALL SYSTEMS NOMINAL</span>
                </div>
              </div>
            </div>

            {/* Mascot Blueprint Stamp */}
            <div className="mt-8 flex items-center gap-3.5">
              <div className="relative size-12 rounded-lg border border-border/70 bg-secondary/50 p-1.5 flex items-center justify-center shrink-0">
                <Image
                  src="/brand/mascot-dark.png"
                  alt="Outpost Mascot"
                  width={48}
                  height={48}
                  className="opacity-80 object-contain"
                />
                <span className="absolute -bottom-1 -right-1 font-mono text-[8px] font-bold bg-primary text-primary-foreground px-1 py-0.2 rounded-xs">
                  AGY
                </span>
              </div>
              <div className="font-mono text-xs text-muted-foreground">
                <span className="text-foreground font-semibold block text-[11px]">
                  OUTPOST AUTONOMOUS AGENT
                </span>
                <span className="text-[10px] text-muted-foreground/70">
                  Dual-surface real-time copilot
                </span>
              </div>
            </div>
          </div>

          {/* Column 2: Navigation Groups (7 cols) */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {footer.navGroups.map((group, gIdx) => (
              <div key={gIdx} className="space-y-4">
                <div className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-foreground">
                  <span className="text-primary text-[10px]">◆</span>
                  <span>{group.title}</span>
                </div>

                <ul className="space-y-2.5 font-mono text-xs">
                  {group.links.map((link, lIdx) => (
                    <li key={lIdx}>
                      {link.disabled ? (
                        <span className="text-muted-foreground/50 cursor-not-allowed flex items-center gap-1.5">
                          <span>{link.label}</span>
                          <span className="text-[9px] bg-secondary/60 px-1.5 py-0.2 rounded text-muted-foreground/60">
                            SOON
                          </span>
                        </span>
                      ) : link.isStatus ? (
                        <span className="inline-flex items-center gap-1.5 text-primary font-medium">
                          <span className="size-1.5 rounded-full bg-primary animate-pulse" />
                          <span>{link.label}</span>
                        </span>
                      ) : (
                        <Link
                          href={link.href}
                          className="text-muted-foreground hover:text-foreground transition-colors inline-block"
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Extra Station Telemetry Column on larger screens */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-foreground">
                <span className="text-primary text-[10px]">◆</span>
                <span>TELEMETRY</span>
              </div>
              <ul className="space-y-2 font-mono text-[11px] text-muted-foreground/80">
                <li className="flex items-center gap-1.5">
                  <Terminal className="size-3 text-primary shrink-0" />
                  <span>LAT: {footer.telemetry.lat}</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Compass className="size-3 text-primary shrink-0" />
                  <span>LON: {footer.telemetry.lon}</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Sparkles className="size-3 text-primary shrink-0" />
                  <span>ID: {footer.telemetry.surveyId}</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Bot className="size-3 text-primary shrink-0" />
                  <span>CRDT: YJS BINARY</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Registration Bar */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-muted-foreground">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <span>© {footer.telemetry.year} Outpost Inc.</span>
            <span className="text-border">•</span>
            <span className="text-muted-foreground/70">
              Engineered for fluid human-agent co-creation.
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden md:inline text-[11px] text-muted-foreground/60">
              [ OXIDE KERNEL v0.1.0 ]
            </span>
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 rounded border border-border/70 bg-secondary/40 px-2.5 py-1 text-[11px] text-muted-foreground hover:border-primary/50 hover:text-foreground transition-colors cursor-pointer"
            >
              <span>TOP</span>
              <ArrowUp className="size-3" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
