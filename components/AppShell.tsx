"use client";
import { usePathname } from "next/navigation";
import React, { Suspense } from "react";
import { SiteHeader } from "./SiteHeader";

function HeaderGate() {
  const pathname = usePathname();
  const isFullScreenRoute =
    pathname?.startsWith("/workspace/") || pathname?.startsWith("/shared/");

  if (isFullScreenRoute) return null;
  return <SiteHeader />;
}

const AppShell = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Suspense fallback={null}>
        <HeaderGate />
      </Suspense>
      <div className="flex flex-1 col-1 pt-18">{children}</div>
    </>
  );
};

export default AppShell;
