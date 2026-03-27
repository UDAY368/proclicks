"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAdminToken } from "./auth";

type AuthGate = "pending" | "allowed" | "denied";

export function RequireAdminAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [gate, setGate] = useState<AuthGate>("pending");

  useEffect(() => {
    if (!getAdminToken()) {
      router.replace("/admin");
      setGate("denied");
      return;
    }
    setGate("allowed");
  }, [router]);

  // Server + first client paint must match: never read localStorage during render.
  if (gate === "pending") {
    return (
      <div className="h-dvh min-h-0 overflow-hidden bg-[#050506] text-white">
        <div className="flex min-h-[50vh] items-center justify-center text-white/50">
          Loading...
        </div>
      </div>
    );
  }

  if (gate === "denied") {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-white/70">
        Redirecting...
      </div>
    );
  }

  return <>{children}</>;
}
