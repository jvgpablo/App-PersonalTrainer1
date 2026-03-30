"use client";

import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useActiveRoutine } from "@/hooks/useRoutines";
import { Skeleton } from "@/components/ui/Skeleton";

export default function StudentRoutinesPage() {
  const { student } = useAuth();
  const { data: routine, isLoading } = useActiveRoutine(student?.uid ?? "");

  return (
    <div className="px-4 pt-6 pb-4 space-y-5">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-[#3d8c58] text-xs font-semibold uppercase tracking-widest">Mis rutinas</p>
        <h1 className="text-white font-extrabold text-2xl mt-0.5">Entrenamiento</h1>
      </motion.div>

      <div className="h-px bg-accent-primary/[0.08]" />

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-16 rounded-2xl" />
          <Skeleton className="h-24 rounded-2xl" />
          <Skeleton className="h-24 rounded-2xl" />
        </div>
      ) : !routine ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <span className="text-6xl mb-4">🏋️</span>
          <p className="text-white font-bold text-lg">Sin rutina activa</p>
          <p className="text-[#3d8c58] text-sm mt-2 max-w-[240px]">
            Tu entrenador te asignará una rutina personalizada pronto
          </p>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          {/* routine header */}
          <div className="rounded-2xl p-5 mb-4"
            style={{ background: "rgba(0,255,135,0.06)", border: "1px solid rgba(0,255,135,0.18)" }}>
            <p className="text-accent-primary text-[10px] font-bold uppercase tracking-widest mb-1">Rutina activa</p>
            <h2 className="text-white font-extrabold text-xl">{routine.title}</h2>
            {routine.description && (
              <p className="text-[#3d8c58] text-sm mt-1">{routine.description}</p>
            )}
            <p className="text-[#3d8c58] text-xs mt-3">{routine.exercises.length} ejercicios en total</p>
          </div>

          {/* exercises */}
          <p className="text-white font-bold text-sm mb-3">Ejercicios</p>
          <div className="space-y-2">
            {routine.exercises.map((ex, i) => (
              <motion.div key={ex.id}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="rounded-2xl p-4"
                style={{
                  background: ex.isBlockedByInjury ? "rgba(248,113,113,0.06)" : "rgba(255,255,255,0.03)",
                  border: `1px solid ${ex.isBlockedByInjury ? "rgba(248,113,113,0.2)" : "rgba(255,255,255,0.06)"}`,
                }}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-white font-semibold text-sm">{ex.name}</p>
                      {ex.isBlockedByInjury && (
                        <span className="text-[10px] font-bold text-[#f87171] px-1.5 py-0.5 rounded-full"
                          style={{ background: "rgba(248,113,113,0.1)" }}>
                          ⚠ Bloqueado
                        </span>
                      )}
                    </div>
                    <p className="text-[#3d8c58] text-xs mt-0.5 capitalize">{ex.bodyArea}</p>
                    {ex.notes && <p className="text-[#3d8c58] text-xs mt-1 italic">{ex.notes}</p>}
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-white font-bold text-sm">{ex.sets}<span className="text-[#3d8c58] text-xs font-normal"> x </span>{ex.reps}</p>
                    {ex.weight ? <p className="text-accent-primary text-xs font-semibold mt-0.5">{ex.weight} kg</p> : null}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
