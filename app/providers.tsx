"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import { MobileShell } from "@/components/layout/MobileShell";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: { queries: { retry: 2, staleTime: 1000 * 60 * 3 } },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <MobileShell>{children}</MobileShell>
      </AuthProvider>
    </QueryClientProvider>
  );
}
