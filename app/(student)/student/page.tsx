"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useActiveRoutine } from "@/hooks/useRoutines";
import { useMyInjuries } from "@/hooks/useInjuries";
import { useRecentProgress } from "@/hooks/useProgress";
import { Skeleton } from "@/components/ui/Skeleton";
import { Badge } from "@/components/ui/Badge";

export default function StudentDashboard() {
  const { student } = useAuth();
  const { data: activeRoutine, isLoading: loadingR } = useActiveRoutine(student?.uid ?? "");
  const { data: injuries, isLoading: loadingI }      = useMyInjuries(student?.uid ?? "");
  const { data: recentProgress }                     = useRecentProgress(student?.uid ?? "", 3);

  const activeInjuries = injuries?.filter(i => i.status === "activa") ?? [];

  return (
    <div className="px-4 pt-6 pb-4 space-y-6">
      {/* header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-[#3d8c58] text-xs font-semibold uppercase tracking-widest">Mi panel</p>
        <h1 className="text-white font-extrabold text-2xl mt-0.5">
          Hola, {student?.displayName.split(" ")[0]} 🔥
        </h1>
        <p className="text-[#3d8c58] text-sm mt-1">
          {!student?.trainerId ? "Esperando asignación de entrenador" : "Sigue con tu entrenamiento"}
        </p>
      </motion.div>

      {/* trainer warning */}
      {!student?.trainerId && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
          className="rounded-2xl p-4"
          style={{ background: "rgba(96,165,250,0.06)", border: "1px solid rgba(96,165,250,0.2)" }}>
          <p className="text-[#60a5fa] font-bold text-sm">Sin entrenador asignado</p>
          <p className="text-[#60a5fa]/70 text-xs mt-0.5">Un administrador te asignará pronto a un entrenador</p>
        </motion.div>
      )}

      {/* active routine card */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-white font-bold text-base">Rutina activa</h2>
          <Link href="/student/routines" className="text-accent-primary text-xs font-semibold">Ver todas</Link>
        </div>
        {loadingR ? (
          <Skeleton className="h-28 rounded-2xl" />
        ) : !activeRoutine ? (
          <div className="rounded-2xl p-5 text-center"
            style={{ background: "rgba(0,255,135,0.03)", border: "1px solid rgba(0,255,135,0.08)" }}>
            <p className="text-[#3d8c58] text-sm">Sin rutina activa</p>
            <p className="text-[#3d8c58] text-xs mt-1">Tu entrenador asignará una rutina pronto</p>
          </div>
        ) : (
          <Link href="/student/routines">
            <div className="rounded-2xl p-5"
              style={{ background: "rgba(0,255,135,0.06)", border: "1px solid rgba(0,255,135,0.18)" }}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-accent-primary text-[10px] font-bold uppercase tracking-widest mb-1">Activa</p>
                  <p className="text-white font-extrabold text-lg">{activeRoutine.title}</p>
                  {activeRoutine.description && (
                    <p className="text-[#3d8c58] text-xs mt-0.5">{activeRoutine.description}</p>
                  )}
                </div>
                <span className="text-3xl">💪</span>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <span className="text-accent-primary font-bold text-sm">{activeRoutine.exercises.length}</span>
                <span className="text-[#3d8c58] text-xs">ejercicios</span>
              </div>
            </div>
          </Link>
        )}
      </motion.div>

      {/* active injury alert */}
      {loadingI ? null : activeInjuries.length > 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <Link href="/student/injuries">
            <div className="rounded-2xl p-4 flex items-center gap-3"
              style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.25)" }}>
              <span className="text-2xl">⚠️</span>
              <div>
                <p className="text-[#f87171] font-bold text-sm">
                  {activeInjuries.length} lesión{activeInjuries.length > 1 ? "es" : ""} activa{activeInjuries.length > 1 ? "s" : ""}
                </p>
                <p className="text-[#f87171]/70 text-xs mt-0.5">Toca para ver detalles</p>
              </div>
            </div>
          </Link>
        </motion.div>
      ) : null}

      {/* recent progress */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-white font-bold text-base">Progreso reciente</h2>
          <Link href="/student/progress" className="text-accent-primary text-xs font-semibold">Ver gráfico</Link>
        </div>
        {!recentProgress || recentProgress.length === 0 ? (
          <div className="rounded-2xl p-5 text-center"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
            <p className="text-[#3d8c58] text-sm">Sin registros de progreso</p>
            <Link href="/student/progress"
              className="text-accent-primary text-xs font-semibold mt-2 inline-block">
              Registrar progreso
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {recentProgress.map((p, i) => (
              <motion.div key={p.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.06 }}
                className="flex items-center gap-3 rounded-2xl p-3"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(0,255,135,0.1)" }}>
                  <span className="text-accent-primary text-xs font-bold">
                    {p.date?.toDate?.().getDate() ?? "—"}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm font-semibold">
                    {p.date?.toDate?.().toLocaleDateString("es-ES") ?? "Sin fecha"}
                  </p>
                  {p.weight && <p className="text-[#3d8c58] text-xs">{p.weight} kg</p>}
                </div>
                <div className="text-right">
                  <p className="text-accent-primary text-xs font-bold">+{p.metrics.goalsAchieved} metas</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* nav cards */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        <div className="grid grid-cols-2 gap-2">
          {[
            { href: "/student/progress", icon: "📈", label: "Mi progreso" },
            { href: "/student/injuries/report", icon: "🩹", label: "Reportar lesión" },
          ].map(c => (
            <Link key={c.href} href={c.href as any}>
              <div className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <span className="text-2xl">{c.icon}</span>
                <p className="text-white font-bold text-sm mt-2">{c.label}</p>
              </div>
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
