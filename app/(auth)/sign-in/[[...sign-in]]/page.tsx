import { SignIn } from "@clerk/nextjs";
import { Suspense } from "react";

export const dynamic = "force-dynamic";
export const instant = false;

export default function SignInPage() {
  return (
    <Suspense fallback={null}>
      <SignIn />
    </Suspense>
  );
}
