"use client";
import { usePathname } from "next/navigation";
import React, { Suspense } from "react";
import { SiteHeader } from "./SiteHeader";

function AppShellInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isFullScreenRoute =
    pathname?.startsWith("/workspace/") || pathname?.startsWith("/shared/");

  if (isFullScreenRoute) return <>{children}</>;
  return (
    <>
      <SiteHeader />
      <div className="flex flex-1 col-1 pt-18">{children}</div>
    </>
  );
}

const AppShell = ({ children }: { children: React.ReactNode }) => {
  return (
    <Suspense fallback={<div className="flex flex-1 col-1 pt-18">{children}</div>}>
      <AppShellInner>{children}</AppShellInner>
    </Suspense>
  );
};

export default AppShell;
