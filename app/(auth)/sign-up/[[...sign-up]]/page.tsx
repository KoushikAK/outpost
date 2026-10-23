import { SignUp } from "@clerk/nextjs";
import { Suspense } from "react";

export const dynamic = "force-dynamic";
export const instant = false;

export default function SignUpPage() {
  return (
    <Suspense fallback={null}>
      <SignUp />
    </Suspense>
  );
}
