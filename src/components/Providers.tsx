"use client";
import { AuthProvider } from "@/lib/auth-context";
import DevTierToggle from "@/components/DevTierToggle";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <DevTierToggle />
    </AuthProvider>
  );
}
