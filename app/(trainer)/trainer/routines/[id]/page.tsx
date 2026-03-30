"use client";

import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useRoutineDetail, useActivateRoutine, useDeleteRoutine } from "@/hooks/useRoutines";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { Badge } from "@/components/ui/Badge";

export default function RoutineDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { trainer } = useAuth();
  const { data: routine, isLoading } = useRoutineDetail(id);
  const activateMutation = useActivateRoutine();
  const deleteMutation = useDeleteRoutine(trainer?.uid ?? "");

  const handleActivate = async () => {
    if (!routine || !trainer) return;
    await activateMutation.mutateAsync({ routineId: id, studentId: routine.studentId, trainerId: trainer.uid });
  };

  const handleDelete = async () => {
    if (!confirm("¿Eliminar esta rutina?")) return;
    await deleteMutation.mutateAsync(id);
    router.back();
  };

  if (isLoading) return (
    <div className="px-4 pt-6 space-y-4">
      <Skeleton className="h-8 w-32 rounded-xl" />
      <Skeleton className="h-32 rounded-2xl" />
      <Skeleton className="h-20 rounded-2xl" />
    </div>
  );

  if (!routine) return (
    <div className="flex flex-col items-center justify-center h-full py-20 px-4">
      <p className="text-white font-bold">Rutina no encontrada</p>
      <button onClick={() => router.back()} className="text-accent-primary text-sm mt-3">Volver</button>
    </div>
  );

  return (
    <div className="px-4 pt-6 pb-4 space-y-5">
      <motion.button onClick={() => router.back()} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-1.5 text-[#3d8c58] text-sm font-semibold hover:text-accent-primary transition-colors">
        ← Rutinas
      </motion.button>

      {/* header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-5"
        style={{ background: "rgba(0,255,135,0.05)", border: "1px solid rgba(0,255,135,0.15)" }}>
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-white font-extrabold text-xl">{routine.title}</h1>
              {routine.isActive && (
                <span className="text-[10px] text-accent-primary font-bold px-2 py-0.5 rounded-full"
                  style={{ background: "rgba(0,255,135,0.15)" }}>ACTIVA</span>
              )}
            </div>
            {routine.description && <p className="text-[#3d8c58] text-sm mt-1">{routine.description}</p>}
            <p className="text-[#3d8c58] text-xs mt-2">{routine.exercises.length} ejercicios</p>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <Link href={`/trainer/routines/${id}/edit` as any} className="flex-1">
            <Button variant="ghost" size="sm" fullWidth>Editar</Button>
          </Link>
          {!routine.isActive && (
            <div className="flex-1">
              <Button variant="primary" size="sm" fullWidth
                isLoading={activateMutation.isPending} onClick={handleActivate}>
                Activar
              </Button>
            </div>
          )}
        </div>
      </motion.div>

      {/* exercises */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
        <h2 className="text-white font-bold text-base mb-3">Ejercicios</h2>
        <div className="space-y-2">
          {routine.exercises.map((ex, i) => (
            <motion.div key={ex.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.05 }}
              className="rounded-2xl p-4"
              style={{
                background: ex.isBlockedByInjury ? "rgba(248,113,113,0.06)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${ex.isBlockedByInjury ? "rgba(248,113,113,0.2)" : "rgba(255,255,255,0.06)"}`,
              }}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-white font-semibold text-sm">{ex.name}</p>
                    {ex.isBlockedByInjury && <span className="text-[10px] text-[#f87171]">⚠ Bloqueado</span>}
                  </div>
                  <p className="text-[#3d8c58] text-xs mt-0.5 capitalize">{ex.bodyArea}</p>
                </div>
                <div className="text-right text-xs text-[#3d8c58]">
                  <p><span className="text-white font-bold">{ex.sets}</span> series</p>
                  <p><span className="text-white font-bold">{ex.reps}</span> reps</p>
                  {ex.weight ? <p><span className="text-white font-bold">{ex.weight}</span> kg</p> : null}
                </div>
              </div>
              {ex.notes && <p className="text-[#3d8c58] text-xs mt-2 italic">{ex.notes}</p>}
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        <Button variant="danger" size="md" fullWidth isLoading={deleteMutation.isPending} onClick={handleDelete}>
          Eliminar rutina
        </Button>
      </motion.div>
    </div>
  );
}
