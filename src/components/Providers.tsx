"use client";
import { useEffect } from "react";
import { AuthProvider } from "@/lib/auth-context";
import DevTierToggle from "@/components/DevTierToggle";
import { initPostHog } from "@/lib/posthog";

export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initPostHog();
  }, []);

  return (
    <AuthProvider>
      {children}
      <DevTierToggle />
    </AuthProvider>
  );
}
