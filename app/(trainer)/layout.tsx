"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { BottomNav } from "@/components/layout/BottomNav";

export default function TrainerLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isTrainer } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) router.replace("/login");
    if (!isLoading && user && !isTrainer) router.replace("/login");
  }, [isLoading, user, isTrainer]);

  if (isLoading || !user || !isTrainer) return null;

  return (
    <div className="flex flex-col h-full">
      <main className="flex-1 overflow-y-auto pb-20">{children}</main>
      <BottomNav />
    </div>
  );
}
