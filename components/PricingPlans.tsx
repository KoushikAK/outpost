"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { useAuth, useOrganization } from "@clerk/nextjs";
import { CheckoutButton, usePlans, useSubscription } from "@clerk/nextjs/experimental";
import { Button } from "@/components/ui/button";

type PayerType = "user" | "organization";
type Plan = NonNullable<ReturnType<typeof usePlans>["data"]>[number];

const TABS: { value: PayerType; label: string }[] = [
  { value: "user", label: "Personal" },
  { value: "organization", label: "Team" },
];

// Seat-based plans price per member; everything else is a flat monthly fee.
function planPrice(plan: Plan) {
  const seatFee = plan.unitPrices?.find((u) => u.name === "seats")?.tiers[0]?.feePerBlock;
  if (seatFee && seatFee.amount > 0) {
    return { amount: `${seatFee.currencySymbol}${seatFee.amountFormatted}`, unit: "per member / month" };
  }
  if (plan.fee && plan.fee.amount > 0) {
    return { amount: `${plan.fee.currencySymbol}${plan.fee.amountFormatted}`, unit: "per month" };
  }
  return { amount: "$0", unit: "forever" };
}

// Free first, then paid plans from cheapest to most expensive.
function sortPlans(plans: Plan[]) {
  const cost = (plan: Plan) =>
    plan.isDefault ? -1 : (plan.unitPrices?.[0]?.tiers[0]?.feePerBlock.amount ?? plan.fee?.amount ?? 0);
  return [...plans].sort((a, b) => cost(a) - cost(b));
}

// Shared by the landing page and the upgrade dialog. Plans, prices and features
// come from the Clerk dashboard. Paid cards open Clerk's checkout drawer; team plans charge the
// active organization. `onCheckoutStart` lets a container (like a dialog) close before it opens.
export function PricingPlans({
  title,
  description,
  onCheckoutStart,
}: {
  title?: string;
  description?: string;
  onCheckoutStart?: () => void;
}) {
  const { isSignedIn, orgId } = useAuth();
  const [tab, setTab] = useState<PayerType | null>(null);
  // Until the visitor picks a tab, show the plans for where they currently are.
  const payerType = tab ?? (orgId ? "organization" : "user");

  const { data: plans, isLoading } = usePlans({ for: payerType, pageSize: 10 });
  const { data: subscription } = useSubscription({
    for: payerType,
    enabled: !!isSignedIn && (payerType === "user" || !!orgId),
  });
  const activePlanIds = new Set(
    subscription?.subscriptionItems.filter((item) => item.status === "active").map((item) => item.plan.id)
  );
  const sortedPlans = sortPlans(plans ?? []);
  // Only the entry-level paid plan (Pro, or Team) is highlighted, not every paid tier.
  const featuredPlanId = sortedPlans.find((plan) => !plan.isDefault)?.id;

  return (
    <div className="mx-auto w-full max-w-6xl">
      {title && (
        <div className="mb-12 text-center">
          <h2 className="font-heading text-3xl sm:text-5xl font-normal tracking-tight text-foreground">{title}</h2>
          {description && <p className="mx-auto mt-4 max-w-lg text-muted-foreground text-base sm:text-lg">{description}</p>}
        </div>
      )}

      {/* Personal / Team Plan Switcher */}
      <div className="mx-auto mb-12 flex w-fit items-center rounded-full border border-border/80 bg-secondary/40 p-1 backdrop-blur-xs">
        {TABS.map(({ value, label }) => {
          const isActive = payerType === value;
          return (
            <button
              key={value}
              type="button"
              onClick={() => setTab(value)}
              className={`cursor-pointer rounded-full px-6 py-2 font-mono text-xs uppercase tracking-wider transition-all ${
                isActive
                  ? "bg-primary font-semibold text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div
        className={`grid gap-8 ${
          sortedPlans.length > 2
            ? "grid-cols-1 md:grid-cols-3"
            : "mx-auto max-w-4xl grid-cols-1 md:grid-cols-2"
        }`}
      >
        {isLoading
          ? [0, 1, 2].slice(0, payerType === "user" ? 2 : 3).map((i) => (
              <div
                key={i}
                className="h-115 animate-pulse rounded-xl border border-border/60 bg-card/20"
              />
            ))
          : sortedPlans.map((plan) => {
              const price = planPrice(plan);
              const isCurrent =
                activePlanIds.has(plan.id) ||
                (!!isSignedIn && plan.isDefault && activePlanIds.size === 0);
              const isFeatured = plan.id === featuredPlanId;

              return (
                <div
                  key={plan.id}
                  className={`relative flex flex-col justify-between rounded-xl p-8 transition-all ${
                    isFeatured
                      ? "edge-light glow bg-card border border-primary/40 shadow-2xl shadow-primary/5"
                      : "border border-border/60 bg-card/30"
                  }`}
                >
                  {isFeatured && (
                    <div className="absolute -top-3 right-6 rounded-full bg-primary px-3 py-0.5 font-mono text-[11px] font-medium text-primary-foreground">
                      {payerType === "organization" ? "POPULAR" : "RECOMMENDED"}
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between">
                      <span
                        className={`font-mono text-xs uppercase tracking-wider ${
                          isFeatured
                            ? "text-primary font-semibold"
                            : "text-muted-foreground"
                        }`}
                      >
                        {plan.name}
                      </span>
                      {isCurrent && (
                        <span className="rounded-full border border-border/80 bg-secondary/60 px-2.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                          Current plan
                        </span>
                      )}
                    </div>

                    <div className="mt-4 flex items-baseline gap-2">
                      <span className="font-heading text-4xl font-normal text-foreground">
                        {price.amount}
                      </span>
                      <span className="font-mono text-xs text-muted-foreground">
                        {price.unit}
                      </span>
                    </div>

                    {plan.description && (
                      <p className="mt-3 text-xs sm:text-sm text-muted-foreground">
                        {plan.description}
                      </p>
                    )}

                    <ul className="mt-8 space-y-3 text-xs sm:text-sm text-foreground/80">
                      {plan.features.length === 0 ? (
                        <li className="flex items-center gap-2.5 text-muted-foreground">
                          <Check className="size-4 shrink-0 text-primary" />
                          <span>The core workspace: docs, canvas and the agent</span>
                        </li>
                      ) : (
                        plan.features.map((feature) => (
                          <li key={feature.id} className="flex items-center gap-2.5">
                            <Check className="size-4 shrink-0 text-primary" />
                            <span>{feature.name}</span>
                          </li>
                        ))
                      )}
                    </ul>
                  </div>

                  <PlanAction
                    plan={plan}
                    payerType={payerType}
                    isFeatured={isFeatured}
                    isCurrent={isCurrent}
                    onCheckoutStart={onCheckoutStart}
                  />
                </div>
              );
            })}
      </div>
    </div>
  );
}

function PlanAction({
  plan,
  payerType,
  isFeatured,
  isCurrent,
  onCheckoutStart,
}: {
  plan: Plan;
  payerType: PayerType;
  isFeatured: boolean;
  isCurrent: boolean;
  onCheckoutStart?: () => void;
}) {
  const { isSignedIn, orgId, has } = useAuth();
  const { organization } = useOrganization();
  const isPaid = !plan.isDefault;

  if (!isSignedIn) {
    return (
      <Button
        asChild
        size="lg"
        variant={isFeatured ? "default" : "outline"}
        className={`mt-8 w-full cursor-pointer ${
          isFeatured
            ? "glow font-medium"
            : "border-border/80 hover:bg-muted/60"
        }`}
      >
        <Link href="/sign-up">{isPaid ? `Get ${plan.name}` : "Start free"}</Link>
      </Button>
    );
  }

  if (isCurrent || !isPaid) {
    return (
      <Button
        size="lg"
        variant="outline"
        className="mt-8 w-full border-border/80 opacity-60"
        disabled
      >
        {isCurrent ? "Current plan" : "Included"}
      </Button>
    );
  }

  if (payerType === "organization") {
    if (!orgId) {
      return (
        <div className="mt-8">
          <Note>Select or create a team in the header to upgrade it.</Note>
        </div>
      );
    }
    // Clerk only lets members with the billing permission (admins by default) manage the plan.
    if (!has?.({ permission: "org:sys_billing:manage" })) {
      return (
        <div className="mt-8">
          <Note>Ask an admin of {organization?.name ?? "your team"} to upgrade.</Note>
        </div>
      );
    }
  }

  return (
    <div className="mt-8 space-y-2">
      {payerType === "organization" && organization && (
        <p className="text-center font-mono text-xs text-muted-foreground">
          Upgrading <span className="text-foreground">{organization.name}</span>
        </p>
      )}
      {/* CheckoutButton runs this button's onClick first, then opens Clerk's checkout drawer. */}
      <CheckoutButton planId={plan.id} planPeriod="month" for={payerType}>
        <Button
          size="lg"
          variant={isFeatured ? "default" : "outline"}
          className={`w-full cursor-pointer ${
            isFeatured
              ? "glow font-medium"
              : "border-border/80 hover:bg-muted/60"
          }`}
          onClick={onCheckoutStart}
        >
          Upgrade to {plan.name}
        </Button>
      </CheckoutButton>
    </div>
  );
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-lg border border-border/80 bg-secondary/30 px-4 py-3 text-center text-xs text-muted-foreground">
      {children}
    </p>
  );
}