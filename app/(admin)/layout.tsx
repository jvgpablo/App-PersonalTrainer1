"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { BottomNav } from "@/components/layout/BottomNav";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) router.replace("/login");
    if (!isLoading && user && !isAdmin) router.replace("/login");
  }, [isLoading, user, isAdmin]);

  if (isLoading || !user || !isAdmin) return null;

  return (
    <div className="flex flex-col h-full">
      <main className="flex-1 overflow-y-auto pb-20">{children}</main>
      <BottomNav />
    </div>
  );
}
