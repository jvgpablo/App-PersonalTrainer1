"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";

interface NavItem { href: string; label: string; icon: string }

const STUDENT_TABS: NavItem[] = [
  { href: "/student",                    label: "Inicio",   icon: "🏠" },
  { href: "/student/routines",           label: "Rutina",   icon: "💪" },
  { href: "/student/progress",           label: "Progreso", icon: "📈" },
  { href: "/student/injuries",           label: "Lesiones", icon: "🩹" },
  { href: "/student/settings",           label: "Ajustes",  icon: "⚙️" },
];

const TRAINER_TABS: NavItem[] = [
  { href: "/trainer",                    label: "Inicio",   icon: "🏠" },
  { href: "/trainer/students",           label: "Alumnos",  icon: "👥" },
  { href: "/trainer/routines",           label: "Rutinas",  icon: "📋" },
  { href: "/trainer/injuries",           label: "Lesiones", icon: "🩹" },
];

const ADMIN_TABS: NavItem[] = [
  { href: "/admin",                      label: "Inicio",   icon: "🏠" },
  { href: "/admin/register-trainer",     label: "Registro", icon: "👨‍💼" },
  { href: "/admin/assign-student",       label: "Asignar",  icon: "🔗" },
];

export function BottomNav() {
  const { role } = useAuth();
  const pathname = usePathname();

  const tabs = role === "student" ? STUDENT_TABS : role === "trainer" ? TRAINER_TABS : ADMIN_TABS;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0d0d0d] border-t border-white/[0.06]"
         style={{ paddingBottom: "env(safe-area-inset-bottom, 8px)" }}>
      <div className="flex items-center justify-around px-2 pt-2 pb-1 max-w-[430px] mx-auto">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href || pathname.startsWith(tab.href + "/");
          return (
            <Link key={tab.href} href={tab.href as any} className="flex flex-col items-center gap-0.5 px-2 py-1 relative min-w-[48px]">
              <span className="text-xl" style={{ opacity: isActive ? 1 : 0.4 }}>{tab.icon}</span>
              <span className={`text-[10px] font-medium ${isActive ? "text-accent-primary" : "text-text-muted"}`}>
                {tab.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute -bottom-1 w-4 h-0.5 bg-accent-primary rounded-full"
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
