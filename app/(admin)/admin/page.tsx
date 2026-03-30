"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useAllTrainers } from "@/hooks/useUsers";
import { Avatar } from "@/components/ui/Avatar";
import { Skeleton } from "@/components/ui/Skeleton";

const adminCards = [
  { href: "/admin/register-trainer", icon: "➕", label: "Registrar entrenador", desc: "Crear nueva cuenta de trainer" },
  { href: "/admin/assign-student",   icon: "🔗", label: "Asignar estudiante",    desc: "Vincular estudiante con trainer" },
];

export default function AdminDashboard() {
  const { user } = useAuth();
  const { data: trainers, isLoading } = useAllTrainers();

  return (
    <div className="px-4 pt-6 pb-4 space-y-6">
      {/* header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-[#3d8c58] text-xs font-semibold uppercase tracking-widest">Panel Admin</p>
        <h1 className="text-white font-extrabold text-2xl mt-0.5">
          Hola, {user?.displayName.split(" ")[0]} 👋
        </h1>
        <p className="text-[#3d8c58] text-sm mt-1">Gestiona entrenadores y estudiantes</p>
      </motion.div>

      {/* quick actions */}
      <div className="grid grid-cols-2 gap-3">
        {adminCards.map((c, i) => (
          <motion.div key={c.href} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Link href={c.href as any}>
              <div className="rounded-2xl p-4 h-full"
                style={{ background: "rgba(0,255,135,0.05)", border: "1px solid rgba(0,255,135,0.12)" }}>
                <span className="text-2xl">{c.icon}</span>
                <p className="text-white font-bold text-sm mt-2">{c.label}</p>
                <p className="text-[#3d8c58] text-xs mt-0.5">{c.desc}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* trainers list */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-white font-bold text-base">Entrenadores</h2>
          <span className="text-[#3d8c58] text-xs">{trainers?.length ?? 0} registrados</span>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full rounded-2xl" />)}
          </div>
        ) : trainers?.length === 0 ? (
          <div className="rounded-2xl p-6 text-center"
            style={{ background: "rgba(0,255,135,0.03)", border: "1px solid rgba(0,255,135,0.08)" }}>
            <p className="text-[#3d8c58] text-sm">Sin entrenadores registrados</p>
            <Link href="/admin/register-trainer"
              className="text-accent-primary text-sm font-semibold mt-2 inline-block">
              Registrar primero
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {trainers?.map((t, i) => (
              <motion.div key={t.uid} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 + i * 0.06 }}
                className="flex items-center gap-3 rounded-2xl p-4"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <Avatar name={t.displayName} size="md" />
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm truncate">{t.displayName}</p>
                  <p className="text-[#3d8c58] text-xs truncate">{t.email}</p>
                </div>
                <div className="text-right">
                  <span className="text-accent-primary font-bold text-sm">{t.studentIds.length}</span>
                  <p className="text-[#3d8c58] text-[10px]">alumnos</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
