"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useStudentsByTrainer } from "@/hooks/useUsers";
import { Avatar } from "@/components/ui/Avatar";
import { Skeleton } from "@/components/ui/Skeleton";

export default function StudentsPage() {
  const { trainer } = useAuth();
  const { data: students, isLoading } = useStudentsByTrainer(trainer?.uid ?? "");

  return (
    <div className="px-4 pt-6 pb-4 space-y-5">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-[#3d8c58] text-xs font-semibold uppercase tracking-widest">Entrenador</p>
        <h1 className="text-white font-extrabold text-2xl mt-0.5">Mis alumnos</h1>
        <p className="text-[#3d8c58] text-sm mt-1">{students?.length ?? 0} estudiantes asignados</p>
      </motion.div>

      <div className="h-px bg-accent-primary/[0.08]" />

      {isLoading ? (
        <div className="space-y-3">{[1,2,3,4].map(i => <Skeleton key={i} className="h-20 rounded-2xl" />)}</div>
      ) : students?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <span className="text-5xl mb-4">👥</span>
          <p className="text-white font-bold text-base">Sin alumnos asignados</p>
          <p className="text-[#3d8c58] text-sm mt-1">El administrador asignará estudiantes a tu cuenta</p>
        </div>
      ) : (
        <div className="space-y-2">
          {students?.map((s, i) => (
            <motion.div key={s.uid} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
              <Link href={`/trainer/students/${s.uid}` as any}>
                <div className="flex items-center gap-4 rounded-2xl p-4"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <Avatar name={s.displayName} size="lg" />
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-bold text-base truncate">{s.displayName}</p>
                    <p className="text-[#3d8c58] text-xs truncate mt-0.5">{s.email}</p>
                    {s.activeRoutineId && (
                      <p className="text-accent-primary text-[10px] font-semibold mt-1">● Rutina activa</p>
                    )}
                  </div>
                  <span className="text-[#3d8c58] text-xl">›</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
