"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function RootPage() {
  const { isLoading, isAuthenticated, role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) { router.replace("/login"); return; }
    if (role === "admin")   router.replace("/admin");
    else if (role === "trainer") router.replace("/trainer");
    else router.replace("/student");
  }, [isLoading, isAuthenticated, role]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-brand-dark">
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 rounded-full border-2 border-accent-primary/30 flex items-center justify-center">
          <span className="text-accent-primary font-black text-lg">ZX</span>
        </div>
        <p className="text-text-muted text-sm animate-pulse">Cargando...</p>
      </div>
    </div>
  );
}
