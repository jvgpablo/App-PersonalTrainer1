"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useTrainerRoutines, useDeleteRoutine } from "@/hooks/useRoutines";
import { Skeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";

export default function TrainerRoutinesPage() {
  const { trainer } = useAuth();
  const { data: routines, isLoading } = useTrainerRoutines(trainer?.uid ?? "");
  const deleteMutation = useDeleteRoutine(trainer?.uid ?? "");

  return (
    <div className="px-4 pt-6 pb-4 space-y-5">
      <div className="flex items-start justify-between">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-[#3d8c58] text-xs font-semibold uppercase tracking-widest">Entrenador</p>
          <h1 className="text-white font-extrabold text-2xl mt-0.5">Rutinas</h1>
          <p className="text-[#3d8c58] text-sm mt-1">{routines?.length ?? 0} rutinas creadas</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
          <Link href="/trainer/routines/create">
            <Button variant="primary" size="sm">+ Nueva</Button>
          </Link>
        </motion.div>
      </div>

      <div className="h-px bg-accent-primary/[0.08]" />

      {isLoading ? (
        <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-24 rounded-2xl" />)}</div>
      ) : routines?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <span className="text-5xl mb-4">📋</span>
          <p className="text-white font-bold text-base">Sin rutinas todavía</p>
          <p className="text-[#3d8c58] text-sm mt-1 mb-5">Crea la primera rutina para tus alumnos</p>
          <Link href="/trainer/routines/create">
            <Button variant="primary" size="md">Crear rutina</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {routines?.map((r, i) => (
            <motion.div key={r.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
              <Link href={`/trainer/routines/${r.id}` as any}>
                <div className="rounded-2xl p-4"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-white font-bold text-base truncate">{r.title}</p>
                        {r.isActive && (
                          <span className="text-[10px] text-accent-primary font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                            style={{ background: "rgba(0,255,135,0.1)" }}>ACTIVA</span>
                        )}
                      </div>
                      {r.description && (
                        <p className="text-[#3d8c58] text-xs mt-0.5 truncate">{r.description}</p>
                      )}
                      <p className="text-[#3d8c58] text-xs mt-1.5">{r.exercises.length} ejercicios</p>
                    </div>
                    <span className="text-[#3d8c58] text-xl ml-2">›</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
