"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useStudentsByTrainer } from "@/hooks/useUsers";
import { useTrainerRoutines } from "@/hooks/useRoutines";
import { useTrainerInjuries } from "@/hooks/useInjuries";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";

export default function TrainerDashboard() {
  const { trainer } = useAuth();
  const { data: students, isLoading: loadingStudents } = useStudentsByTrainer(trainer?.uid ?? "");
  const { data: routines, isLoading: loadingRoutines } = useTrainerRoutines(trainer?.uid ?? "");
  const { data: injuries, isLoading: loadingInjuries } = useTrainerInjuries(trainer?.uid ?? "");

  const activeInjuries = injuries?.filter(i => i.status === "activa") ?? [];

  const stats = [
    { label: "Alumnos", value: students?.length ?? 0, color: "#00FF87", href: "/trainer/students" },
    { label: "Rutinas", value: routines?.length ?? 0, color: "#60a5fa", href: "/trainer/routines" },
    { label: "Lesiones activas", value: activeInjuries.length, color: activeInjuries.length > 0 ? "#f87171" : "#00FF87", href: "/trainer/injuries" },
  ];

  return (
    <div className="px-4 pt-6 pb-4 space-y-6">
      {/* header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-[#3d8c58] text-xs font-semibold uppercase tracking-widest">Entrenador</p>
        <h1 className="text-white font-extrabold text-2xl mt-0.5">
          Hola, {trainer?.displayName.split(" ")[0]} 💪
        </h1>
        <p className="text-[#3d8c58] text-sm mt-1">Resumen de tu equipo</p>
      </motion.div>

      {/* stats */}
      <div className="grid grid-cols-3 gap-2">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Link href={s.href as any}>
              <div className="rounded-2xl p-3 text-center"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <p className="font-extrabold text-2xl" style={{ color: s.color }}>{s.value}</p>
                <p className="text-[#3d8c58] text-[10px] mt-0.5 leading-tight">{s.label}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* recent students */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-white font-bold text-base">Mis alumnos</h2>
          <Link href="/trainer/students" className="text-accent-primary text-xs font-semibold">Ver todos</Link>
        </div>
        {loadingStudents ? (
          <div className="space-y-2">{[1,2].map(i => <Skeleton key={i} className="h-16 rounded-2xl" />)}</div>
        ) : students?.length === 0 ? (
          <div className="rounded-2xl p-5 text-center" style={{ background: "rgba(0,255,135,0.03)", border: "1px solid rgba(0,255,135,0.08)" }}>
            <p className="text-[#3d8c58] text-sm">Sin alumnos asignados aún</p>
          </div>
        ) : (
          <div className="space-y-2">
            {students?.slice(0, 3).map((s, i) => (
              <motion.div key={s.uid} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 + i * 0.06 }}>
                <Link href={`/trainer/students/${s.uid}` as any}>
                  <div className="flex items-center gap-3 rounded-2xl p-4"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <Avatar name={s.displayName} size="md" />
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold text-sm truncate">{s.displayName}</p>
                      <p className="text-[#3d8c58] text-xs truncate">{s.email}</p>
                    </div>
                    <span className="text-[#3d8c58] text-lg">›</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* active injuries alert */}
      {activeInjuries.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
          <Link href="/trainer/injuries">
            <div className="rounded-2xl p-4 flex items-center gap-3"
              style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.25)" }}>
              <span className="text-2xl">⚠️</span>
              <div>
                <p className="text-[#f87171] font-bold text-sm">
                  {activeInjuries.length} lesión{activeInjuries.length > 1 ? "es" : ""} activa{activeInjuries.length > 1 ? "s" : ""}
                </p>
                <p className="text-[#f87171]/70 text-xs mt-0.5">Toca para revisar</p>
              </div>
            </div>
          </Link>
        </motion.div>
      )}

      {/* quick actions */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        <h2 className="text-white font-bold text-base mb-3">Acciones rápidas</h2>
        <div className="grid grid-cols-2 gap-2">
          <Link href="/trainer/routines/create">
            <div className="rounded-2xl p-4" style={{ background: "rgba(0,255,135,0.05)", border: "1px solid rgba(0,255,135,0.12)" }}>
              <span className="text-xl">➕</span>
              <p className="text-white font-bold text-sm mt-2">Nueva rutina</p>
            </div>
          </Link>
          <Link href="/trainer/injuries">
            <div className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <span className="text-xl">🩹</span>
              <p className="text-white font-bold text-sm mt-2">Ver lesiones</p>
            </div>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
