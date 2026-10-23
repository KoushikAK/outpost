import { SignIn } from "@clerk/nextjs";
import { Suspense } from "react";

export const instant = false;

export default function SignInPage() {
  return (
    <Suspense fallback={null}>
      <SignIn />
    </Suspense>
  );
}
