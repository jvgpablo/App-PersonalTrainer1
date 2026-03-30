"use client";

import { useEffect, useState } from "react";

export function MobileShell({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 430);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (isMobile) {
    return (
      <div className="min-h-[100dvh] w-full bg-brand-dark overflow-hidden">
        {children}
      </div>
    );
  }

  // Desktop: iPhone frame centrado
  return (
    <div className="min-h-screen bg-[#020402] flex items-center justify-center p-8">
      {/* Glow debajo del iPhone */}
      <div className="absolute w-64 h-16 bg-accent-primary opacity-5 blur-3xl bottom-8 left-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="relative flex-shrink-0" style={{ width: 393, height: 852 }}>
        {/* Marco exterior */}
        <div className="absolute inset-0 rounded-[54px] border-[8px] border-[#1a1a1a]"
             style={{ boxShadow: "0 60px 120px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.05)" }} />

        {/* Dynamic Island */}
        <div className="absolute top-[10px] left-1/2 -translate-x-1/2 w-[120px] h-[34px] bg-black rounded-full z-50 flex items-center justify-center gap-3">
          <div className="w-2 h-2 rounded-full bg-[#1a1a1a]" />
          <div className="w-3 h-3 rounded-full bg-[#111]" />
        </div>

        {/* Pantalla */}
        <div className="absolute inset-[3px] rounded-[50px] overflow-hidden bg-brand-dark">
          {children}
        </div>

        {/* Barra inferior home */}
        <div className="absolute bottom-[8px] left-1/2 -translate-x-1/2 w-[130px] h-[5px] bg-[#333] rounded-full z-50" />

        {/* Botón lateral volumen */}
        <div className="absolute left-[-12px] top-[140px] w-[6px] h-[36px] bg-[#222] rounded-l-sm" />
        <div className="absolute left-[-12px] top-[188px] w-[6px] h-[56px] bg-[#222] rounded-l-sm" />
        <div className="absolute left-[-12px] top-[254px] w-[6px] h-[56px] bg-[#222] rounded-l-sm" />
        {/* Botón power derecho */}
        <div className="absolute right-[-12px] top-[188px] w-[6px] h-[80px] bg-[#222] rounded-r-sm" />
      </div>

      {/* Label ZENX debajo */}
      <p className="absolute bottom-6 text-[#1a1a1a] text-xs font-bold tracking-[0.3em]">
        ZENX · PWA
      </p>
    </div>
  );
}
