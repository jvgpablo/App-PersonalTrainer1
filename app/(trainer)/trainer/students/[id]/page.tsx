"use client";

import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useStudentsByTrainer } from "@/hooks/useUsers";
import { useStudentRoutines } from "@/hooks/useRoutines";
import { useStudentInjuries } from "@/hooks/useInjuries";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";

export default function StudentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { trainer } = useAuth();
  const { data: students } = useStudentsByTrainer(trainer?.uid ?? "");
  const student = students?.find(s => s.uid === id);

  const { data: routines, isLoading: loadingR } = useStudentRoutines(id, trainer?.uid ?? "");
  const { data: injuries, isLoading: loadingI } = useStudentInjuries(id, trainer?.uid ?? "");

  if (!student && students) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-20">
        <p className="text-white font-bold">Estudiante no encontrado</p>
        <button onClick={() => router.back()} className="text-accent-primary text-sm mt-3">Volver</button>
      </div>
    );
  }

  return (
    <div className="px-4 pt-6 pb-4 space-y-6">
      <motion.button onClick={() => router.back()} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-1.5 text-[#3d8c58] text-sm font-semibold hover:text-accent-primary transition-colors">
        ← Mis alumnos
      </motion.button>

      {/* profile card */}
      {student ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 rounded-2xl p-5"
          style={{ background: "rgba(0,255,135,0.05)", border: "1px solid rgba(0,255,135,0.15)" }}>
          <Avatar name={student.displayName} size="xl" />
          <div>
            <h1 className="text-white font-extrabold text-xl">{student.displayName}</h1>
            <p className="text-[#3d8c58] text-sm">{student.email}</p>
            {student.activeRoutineId && (
              <span className="inline-flex items-center gap-1 mt-1.5 text-[10px] font-semibold text-accent-primary px-2 py-0.5 rounded-full"
                style={{ background: "rgba(0,255,135,0.12)" }}>
                ● Rutina activa
              </span>
            )}
          </div>
        </motion.div>
      ) : (
        <Skeleton className="h-28 rounded-2xl" />
      )}

      {/* routines */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-white font-bold text-base">Rutinas</h2>
          <Link href={`/trainer/routines/create?studentId=${id}` as any}
            className="text-accent-primary text-xs font-semibold">+ Nueva</Link>
        </div>
        {loadingR ? (
          <div className="space-y-2">{[1,2].map(i => <Skeleton key={i} className="h-14 rounded-2xl" />)}</div>
        ) : routines?.length === 0 ? (
          <p className="text-[#3d8c58] text-sm p-4 rounded-2xl"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
            Sin rutinas asignadas
          </p>
        ) : (
          <div className="space-y-2">
            {routines?.map(r => (
              <Link key={r.id} href={`/trainer/routines/${r.id}` as any}>
                <div className="flex items-center gap-3 rounded-2xl p-3"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-sm truncate">{r.title}</p>
                    <p className="text-[#3d8c58] text-xs">{r.exercises.length} ejercicios</p>
                  </div>
                  {r.isActive && (
                    <span className="text-[10px] text-accent-primary font-bold px-2 py-0.5 rounded-full"
                      style={{ background: "rgba(0,255,135,0.1)" }}>ACTIVA</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </motion.div>

      {/* injuries */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-white font-bold text-base">Lesiones</h2>
        </div>
        {loadingI ? (
          <div className="space-y-2">{[1].map(i => <Skeleton key={i} className="h-14 rounded-2xl" />)}</div>
        ) : injuries?.length === 0 ? (
          <p className="text-[#3d8c58] text-sm p-4 rounded-2xl"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
            Sin lesiones registradas ✓
          </p>
        ) : (
          <div className="space-y-2">
            {injuries?.map(inj => (
              <Link key={inj.id} href={`/trainer/injuries/${inj.id}` as any}>
                <div className="flex items-center gap-3 rounded-2xl p-3"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-sm capitalize">{inj.bodyPart.replace("_", " ")}</p>
                    <p className="text-[#3d8c58] text-xs truncate">{inj.description}</p>
                  </div>
                  <div className="flex flex-col gap-1 items-end">
                    <Badge variant={inj.severity} />
                    <Badge variant={inj.status} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
