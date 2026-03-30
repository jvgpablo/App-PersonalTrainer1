"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { BottomNav } from "@/components/layout/BottomNav";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isStudent } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) router.replace("/login");
    if (!isLoading && user && !isStudent) router.replace("/login");
  }, [isLoading, user, isStudent]);

  if (isLoading || !user || !isStudent) return null;

  return (
    <div className="flex flex-col h-full">
      <main className="flex-1 overflow-y-auto pb-20">{children}</main>
      <BottomNav />
    </div>
  );
}
