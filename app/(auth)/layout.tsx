import { Suspense } from "react";

export const instant = false;

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 items-center justify-center">
      <Suspense fallback={null}>{children}</Suspense>
    </div>
  );
}
